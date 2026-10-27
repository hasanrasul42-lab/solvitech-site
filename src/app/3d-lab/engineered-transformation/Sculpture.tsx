"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  AUTO,
  BOUNDS,
  CARRIAGE,
  CHAMBER,
  DECK_Y,
  MODULE,
  PLINTH,
  RACK_IDS,
  RAIL,
  TOKENS,
  autoPose,
  lerp,
  moduleX,
  pathBlend,
  postGlow,
  rackPose,
  scanAlpha,
  scanX,
  seamGlow,
  selectGlow,
  sysSettle,
  tokenGlow,
  tokenPose,
  type Mechanism,
  type RackId,
} from "./choreography";
import type { Director } from "./director";
import { BLUE, createGlow, createMaterials, type Materials } from "./materials";

interface Ctx {
  director: Director;
  mats: Materials;
}
const SceneCtx = createContext<Ctx | null>(null);
const useScene = () => useContext(SceneCtx)!;

/** A material owned by one component, disposed with it. */
function useOwned<T extends THREE.Material>(make: () => T) {
  const [m] = useState(make);
  useEffect(() => () => m.dispose(), [m]);
  return m;
}
// Per-frame material updates go through these so render-time values stay immutable.
const glow = (m: THREE.MeshStandardMaterial, v: number) => void (m.emissiveIntensity = v);
const fade = (m: THREE.Material, v: number) => void (m.opacity = v);

// --- Frame driver ----------------------------------------------------------------

/** Advances the choreography and keeps requesting frames only while something moves. */
function Driver() {
  const { director } = useScene();
  const invalidate = useThree((s) => s.invalidate);
  const get = useThree((s) => s.get);
  useEffect(() => {
    director.setInspect(() => {
      const { gl } = get();
      const i = gl.info;
      return { ...i.render, ...i.memory, programs: i.programs?.length, dpr: gl.getPixelRatio(), size: gl.getSize(new THREE.Vector2()).toArray() };
    });
    director.setWake(() => invalidate());
    invalidate();
    return () => director.setWake(() => {});
  }, [director, invalidate, get]);
  useFrame((_, delta) => {
    // Clamp so a dropped frame or a returning tab never jumps the mechanism.
    if (director.frame(Math.min(delta, 1 / 30)) && director.visible) invalidate();
  });
  return null;
}

// --- Camera ----------------------------------------------------------------------

const FOV = 11;
const LANDSCAPE = new THREE.Vector3(0.04, 0.44, 1).normalize();
// From the left: the low intelligence module nearest, the tall rack behind.
const PORTRAIT = new THREE.Vector3(-0.78, 0.6, 0.9).normalize();
const corners = (() => {
  const out: THREE.Vector3[] = [];
  for (const x of [BOUNDS.min[0], BOUNDS.max[0]])
    for (const y of [BOUNDS.min[1], BOUNDS.max[1]])
      for (const z of [BOUNDS.min[2], BOUNDS.max[2]]) out.push(new THREE.Vector3(x, y, z));
  return out;
})();

/** Smallest distance at which every corner of the bounds fits the frame with margins. */
function fit(cam: THREE.PerspectiveCamera, dir: THREE.Vector3, target: THREE.Vector3, margin: number) {
  const v = new THREE.Vector3();
  const place = (d: number) => {
    cam.position.copy(target).addScaledVector(dir, d);
    cam.lookAt(target);
    cam.updateMatrixWorld();
  };
  const extent = (d: number) => {
    place(d);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; // prettier-ignore
    for (const c of corners) {
      v.copy(c).project(cam);
      x0 = Math.min(x0, v.x);
      x1 = Math.max(x1, v.x);
      y0 = Math.min(y0, v.y);
      y1 = Math.max(y1, v.y);
    }
    return { x0, x1, y0, y1 };
  };
  let lo = 2;
  let hi = 80;
  for (let i = 0; i < 28; i++) {
    const d = (lo + hi) / 2;
    const e = extent(d);
    if (Math.max(-e.x0, e.x1) <= 1 - margin && Math.max(-e.y0, e.y1) <= 1 - margin) hi = d;
    else lo = d;
  }
  return { distance: hi, extent: extent(hi) };
}

function Rig() {
  const { director } = useScene();
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const base = useRef({ dir: LANDSCAPE.clone(), target: new THREE.Vector3(), distance: 20 });

  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    // Wide stages look along the front; tall stages turn to a diagonal so the
    // long sculpture reads in depth instead of shrinking to a sliver.
    const t = THREE.MathUtils.clamp((1.5 - aspect) / (1.5 - 1.05), 0, 1);
    const dir = LANDSCAPE.clone().lerp(PORTRAIT, THREE.MathUtils.smootherstep(t, 0, 1)).normalize();
    camera.fov = FOV;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    const target = new THREE.Vector3(0, 0.95, 0);
    // Fit, then re-centre the projected bounds and fit again.
    let r = fit(camera, dir, target, 0.04);
    for (let i = 0; i < 2; i++) {
      const halfH = r.distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(right, ((r.extent.x0 + r.extent.x1) / 2) * halfH * aspect);
      target.addScaledVector(up, ((r.extent.y0 + r.extent.y1) / 2) * halfH);
      r = fit(camera, dir, target, 0.04);
    }
    camera.near = r.distance * 0.3;
    camera.far = r.distance * 3;
    camera.updateProjectionMatrix();
    base.current = { dir, target, distance: r.distance };
    invalidate();
  }, [get, size.width, size.height, invalidate]);

  const q = useMemo(() => new THREE.Quaternion(), []);
  const axis = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const { dir, target, distance } = base.current;
    const tilt = director.tilt;
    let yaw = tilt.x * 0.07;
    const pitch = -tilt.y * 0.035;
    if (director.idle > 0) {
      // Very restrained drift after the sequence, fading in and out.
      const t = director.idleClock;
      const env = Math.min(1, t / 2.5, director.idle / 3);
      yaw += Math.sin(t * 0.42) * 0.018 * env;
    }
    const d = dir.clone().applyAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
    axis.crossVectors(THREE.Object3D.DEFAULT_UP, d).normalize();
    q.setFromAxisAngle(axis, pitch);
    d.applyQuaternion(q);
    camera.position.copy(target).addScaledVector(d, distance);
    camera.lookAt(target);
  });
  return null;
}

// --- Studio ----------------------------------------------------------------------

function Studio({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      <Environment resolution={lowPower ? 128 : 256} frames={1} environmentIntensity={1.25}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-5, 6, 6]} scale={[9, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[0, 9, 0]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#e6ecf5" position={[7, 1, 4]} scale={[4, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#dfe6f2" position={[2, 3, -7]} scale={[12, 1.2, 1]} />
        {/* Thin strips: crisp highlights along bevels and rods. */}
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4.5, 6]} scale={[14, 0.18, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-6, 2, 3]} rotation-y={Math.PI / 3} scale={[0.25, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#eef2f8" position={[6, 2, 3]} rotation-y={-Math.PI / 3} scale={[0.25, 6, 1]} />
      </Environment>
      <ambientLight intensity={0.08} color="#c8d4ea" />
      {/* Soft key from front-left above, restrained fill, cool rim from behind. */}
      <directionalLight position={[-4, 7, 6]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[6, 2.5, 5]} intensity={0.25} color="#dde5f2" />
      <directionalLight position={[3, 4, -7]} intensity={1.8} color="#d6e1f5" />
    </>
  );
}

// --- Base: plinth, rails, connection seams ----------------------------------------

function Base() {
  const { director, mats } = useScene();
  const groove = useOwned(() => createGlow(0.12));
  const seamL = useOwned(() => createGlow(0));
  useFrame(() => {
    const g = seamGlow(director.p.unify);
    glow(seamL, g * 2.2);
    glow(groove, 0.1 + g * 0.5);
  });
  const top = PLINTH.h;
  return (
    <group>
      <RoundedBox args={[PLINTH.w, PLINTH.h, PLINTH.d]} radius={0.05} smoothness={3} position={[0, PLINTH.h / 2, 0]} material={mats.anodisedDeep} />
      {/* Front groove with a faint functional light line. */}
      <mesh position={[0, PLINTH.h / 2, PLINTH.d / 2 + 0.001]} material={mats.groove}>
        <boxGeometry args={[PLINTH.w - 0.6, 0.03, 0.004]} />
      </mesh>
      <mesh position={[0, PLINTH.h / 2, PLINTH.d / 2 + 0.004]} material={groove}>
        <boxGeometry args={[PLINTH.w - 0.7, 0.008, 0.004]} />
      </mesh>
      {[-RAIL.z, RAIL.z].map((z) => (
        <group key={z}>
          <mesh position={[0, RAIL.y, z]} rotation-z={Math.PI / 2} material={mats.silver}>
            <cylinderGeometry args={[RAIL.r, RAIL.r, PLINTH.w - 0.5, 24]} />
          </mesh>
          {[-1, 1].map((s) => (
            <RoundedBox key={s} args={[0.12, 0.1, 0.16]} radius={0.02} position={[s * (PLINTH.w / 2 - 0.2), top + 0.05, z]} material={mats.anodised} />
          ))}
        </group>
      ))}
      {/* Connection seams where the modules meet: light briefly as they lock. */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 1.12, top + 0.003, 0]} material={seamL}>
          <boxGeometry args={[0.03, 0.006, 1.7]} />
        </mesh>
      ))}
      <ContactShadows position={[0, top + 0.002, 0]} scale={[PLINTH.w, PLINTH.d]} resolution={1024} far={1.2} blur={1.6} opacity={0.6} color="#000000" />
      <ContactShadows position={[0, 0.001, 0]} scale={[PLINTH.w + 5, PLINTH.d + 3]} resolution={512} far={0.8} blur={3} opacity={0.75} frames={1} color="#000000" />
    </group>
  );
}

/** A module riding the rails: carriage, accent strip, and its mechanism. */
function ModuleSlot({ id, children }: { id: Mechanism; children: ReactNode }) {
  const { director, mats } = useScene();
  const group = useRef<THREE.Group>(null);
  const accent = useOwned(() => createGlow(0.06));
  const w = MODULE[id].w;
  useFrame(() => {
    if (group.current) group.current.position.x = moduleX(id, director.p.unify);
    glow(accent, 0.06 + director.hl[id] * 1.5);
  });
  return (
    <group ref={group} position={[MODULE[id].from, DECK_Y, 0]}>
      <RoundedBox args={[w - 0.04, CARRIAGE.h, CARRIAGE.d]} radius={0.035} smoothness={3} position={[0, -CARRIAGE.h / 2, 0]} material={mats.anodised} />
      <mesh position={[0, -CARRIAGE.h / 2, CARRIAGE.d / 2 + 0.003]} material={accent}>
        <boxGeometry args={[w * 0.42, 0.014, 0.006]} />
      </mesh>
      {children}
    </group>
  );
}

// --- Intelligence: interpretation chamber ------------------------------------------

function Intelligence() {
  const { director, mats } = useScene();
  const tokens = useRef<(THREE.Object3D | null)[]>([]);
  const scan = useRef<THREE.Group>(null);
  const tokenMats = useMemo(
    () =>
      TOKENS.map((t) => {
        const m = (t.kind === "disc" ? mats.silver : mats.ceramic).clone();
        m.emissive = BLUE.clone();
        glow(m, 0);
        return m;
      }),
    [mats],
  );
  useEffect(() => () => tokenMats.forEach((m) => m.dispose()), [tokenMats]);
  const sheet = useOwned(
    () =>
      new THREE.MeshBasicMaterial({
        color: BLUE,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
  );
  const head = useOwned(() => createGlow(0));
  const ring = useOwned(() => createGlow(0));

  useFrame(() => {
    const p = director.p.intel;
    TOKENS.forEach((t, i) => {
      const o = tokens.current[i];
      if (!o) return;
      o.position.set(...tokenPose(i, p));
      glow(tokenMats[i], tokenGlow(i, p) * (t.kind === "anomaly" ? 1.3 : 0.7));
    });
    if (scan.current) scan.current.position.x = scanX(p);
    const a = scanAlpha(p);
    fade(sheet, a * 0.22);
    glow(head, 0.15 + a * 1.6);
    glow(ring, postGlow(p) * 1.8);
  });

  const { x: cx, z: cz, floor, top } = CHAMBER;
  return (
    <group>
      {/* Chamber bed and frame. */}
      <RoundedBox args={[cx * 2, floor, cz * 2]} radius={0.02} position={[0, floor / 2, 0]} material={mats.anodisedDeep} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[sx * cx, top / 2, sz * cz]} material={mats.anodised}>
            <boxGeometry args={[0.06, top, 0.06]} />
          </mesh>
        )),
      )}
      {[-1, 1].map((s) => (
        <mesh key={`x${s}`} position={[0, top, s * cz]} material={mats.anodised}>
          <boxGeometry args={[cx * 2 + 0.06, 0.05, 0.05]} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} position={[s * cx, top, 0]} material={mats.anodised}>
          <boxGeometry args={[0.05, 0.05, cz * 2 - 0.05]} />
        </mesh>
      ))}
      {/* Smoked glass: back wall, roof and a low front lip (real thickness). */}
      <mesh position={[0, (floor + top - 0.03) / 2, -cz]} material={mats.glass}>
        <boxGeometry args={[cx * 2 - 0.06, top - floor - 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, top, 0]} material={mats.glass}>
        <boxGeometry args={[cx * 2 - 0.06, 0.03, cz * 2 - 0.06]} />
      </mesh>
      <mesh position={[0, floor + 0.08, cz]} material={mats.glass}>
        <boxGeometry args={[cx * 2 - 0.06, 0.16, 0.03]} />
      </mesh>
      {/* Reader: a satin bar under the roof, projecting a thin scan sheet. */}
      <group ref={scan} position={[scanX(0), 0, 0]}>
        <mesh position={[0, top - 0.06, 0]} material={mats.silver}>
          <boxGeometry args={[0.05, 0.04, cz * 2 - 0.08]} />
        </mesh>
        <mesh position={[0, top - 0.083, 0]} material={head}>
          <boxGeometry args={[0.012, 0.006, cz * 2 - 0.12]} />
        </mesh>
        <mesh position={[0, (floor + top - 0.09) / 2, 0]} rotation-y={Math.PI / 2} material={sheet}>
          <planeGeometry args={[cz * 2 - 0.14, top - floor - 0.1]} />
        </mesh>
      </group>
      {/* Feeder tray (in) and sorting shelf with an inspection post (out). */}
      <RoundedBox args={[0.56, 0.16, 1.04]} radius={0.025} position={[-0.99, 0.08, 0]} material={mats.ceramic} />
      <RoundedBox args={[0.52, 0.06, 1.12]} radius={0.02} position={[1.0, 0.03, -0.06]} material={mats.anodised} />
      <mesh position={[1.0, 0.42, -0.46]} material={mats.silver}>
        <cylinderGeometry args={[0.022, 0.022, 0.72, 16]} />
      </mesh>
      <mesh position={[1.0, 0.78, -0.46]} material={mats.silver}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 32]} />
      </mesh>
      <mesh position={[1.0, 0.765, -0.46]} rotation-x={Math.PI / 2} material={ring}>
        <torusGeometry args={[0.104, 0.007, 8, 48]} />
      </mesh>
      {TOKENS.map((t, i) => (
        <group key={i} ref={(o) => void (tokens.current[i] = o)} position={t.tray}>
          {t.kind === "slab" && <RoundedBox args={[0.26, 0.08, 0.2]} radius={0.016} material={tokenMats[i]} />}
          {t.kind === "disc" && (
            <mesh material={tokenMats[i]}>
              <cylinderGeometry args={[0.1, 0.1, 0.08, 32]} />
            </mesh>
          )}
          {t.kind === "anomaly" && (
            <RoundedBox args={[0.13, 0.13, 0.13]} radius={0.014} rotation-y={Math.PI / 4} material={tokenMats[i]} />
          )}
        </group>
      ))}
    </group>
  );
}

// --- Automation: trigger, lever, carriage, clamp -----------------------------------

function Automation() {
  const { director, mats } = useScene();
  const key = useRef<THREE.Group>(null);
  const lever = useRef<THREE.Group>(null);
  const carriage = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const rod = useRef<THREE.Mesh>(null);
  const collar = useOwned(() => createGlow(0));
  const status = useOwned(() => createGlow(0));
  const done = useOwned(() => createGlow(0));

  useFrame(() => {
    const s = autoPose(director.p.auto);
    if (key.current) key.current.position.x = AUTO.key.x0 + s.press * AUTO.key.travel;
    if (lever.current) lever.current.rotation.z = s.lever;
    if (carriage.current) carriage.current.position.x = lerp(AUTO.carriage.x0, AUTO.carriage.x1, s.carriage);
    const y = lerp(AUTO.press.up, AUTO.press.down, s.clamp);
    head.current?.position.setY(y);
    // The rod spans from the sleeve to the top of the head.
    const len = AUTO.press.sleeve - (y + 0.04);
    rod.current?.position.setY(y + 0.04 + len / 2);
    rod.current?.scale.setY(len);
    glow(collar, 0.12 + s.trigger * 2);
    glow(status, s.trigger * 1.2 + s.done * 0.6);
    glow(done, s.done * 2);
  });

  const [px, py] = AUTO.pivot;
  const hx = AUTO.press.x;
  return (
    <group>
      {/* Tower housing: gives the module its height. */}
      <RoundedBox args={[0.5, 1.15, 0.36]} radius={0.03} position={[-0.7, 0.575, -0.72]} material={mats.anodised} />
      <mesh position={[-0.7, 1.165, -0.72]} material={mats.silver}>
        <boxGeometry args={[0.52, 0.03, 0.38]} />
      </mesh>
      <mesh position={[-0.7, 0.62, -0.536]} material={mats.ceramic}>
        <boxGeometry args={[0.3, 0.72, 0.012]} />
      </mesh>
      <mesh position={[-0.7, 1.04, -0.536]} material={status}>
        <boxGeometry args={[0.2, 0.014, 0.008]} />
      </mesh>
      {/* Trigger: ceramic key with a pushrod and a blue collar, on its housing. */}
      <RoundedBox args={[0.36, 0.22, 0.34]} radius={0.025} position={[-0.72, 0.11, 0]} material={mats.anodised} />
      <group ref={key} position={[AUTO.key.x0, AUTO.key.y, 0]}>
        <RoundedBox args={[0.16, 0.16, 0.22]} radius={0.022} material={mats.ceramic} />
        <mesh position={[0.08 + 0.079, 0, 0]} rotation-z={Math.PI / 2} material={mats.silver}>
          <cylinderGeometry args={[0.022, 0.022, 0.158, 16]} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation-y={Math.PI / 2} material={collar}>
          <torusGeometry args={[0.04, 0.01, 10, 32]} />
        </mesh>
      </group>
      {/* Lever on a pivot bracket. */}
      <RoundedBox args={[0.16, 0.14, 0.2]} radius={0.02} position={[px, 0.07, 0]} material={mats.anodised} />
      <mesh position={[px, py, 0]} rotation-x={Math.PI / 2} material={mats.silver}>
        <cylinderGeometry args={[0.03, 0.03, 0.26, 20]} />
      </mesh>
      <group ref={lever} position={[px, py, 0]} rotation-z={AUTO.from}>
        <RoundedBox args={[0.07, AUTO.lever, 0.07]} radius={0.015} position={[0, AUTO.lever / 2, 0]} material={mats.ceramic} />
      </group>
      {/* Carriage track: beam on posts with twin guide rods. */}
      <RoundedBox args={[1.25, 0.14, 0.2]} radius={0.02} position={[0.425, 0.43, 0]} material={mats.anodised} />
      {[0.05, 0.85].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]} material={mats.anodised}>
          <boxGeometry args={[0.1, 0.36, 0.14]} />
        </mesh>
      ))}
      {[-0.125, 0.125].map((z) => (
        <mesh key={z} position={[0.425, 0.52, z]} rotation-z={Math.PI / 2} material={mats.silver}>
          <cylinderGeometry args={[0.02, 0.02, 1.25, 16]} />
        </mesh>
      ))}
      <mesh position={[0.425, 0.43, 0.103]} material={done}>
        <boxGeometry args={[1.05, 0.012, 0.006]} />
      </mesh>
      <group ref={carriage} position={[AUTO.carriage.x0, AUTO.carriage.y, 0]}>
        <RoundedBox args={[0.3, 0.18, 0.2]} radius={0.025} material={mats.ceramic} />
      </group>
      {/* Press: a cantilevered head comes down onto the carriage to complete the run. */}
      <RoundedBox args={[0.16, 1.06, 0.16]} radius={0.025} position={[hx, 0.53, -0.42]} material={mats.anodised} />
      <RoundedBox args={[0.16, 0.1, 0.5]} radius={0.02} position={[hx, 1.0, -0.21]} material={mats.anodised} />
      <mesh position={[hx, 1.0, 0.042]} material={done}>
        <boxGeometry args={[0.1, 0.012, 0.006]} />
      </mesh>
      <mesh position={[hx, AUTO.press.sleeve + 0.03, 0]} material={mats.silver}>
        <cylinderGeometry args={[0.045, 0.045, 0.06, 24]} />
      </mesh>
      <mesh ref={rod} position={[hx, 0.88, 0]} material={mats.silver}>
        <cylinderGeometry args={[0.022, 0.022, 1, 16]} />
      </mesh>
      <group ref={head} position={[hx, AUTO.press.up, 0]}>
        <RoundedBox args={[0.26, 0.08, 0.24]} radius={0.018} material={mats.silver} />
      </group>
      {/* Interlock keys: meet the neighbouring modules when unified. */}
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.05, 0.08, 0.5]} radius={0.012} position={[s * 1.105, -0.11, 0]} material={mats.ceramic} />
      ))}
    </group>
  );
}

// --- Custom systems: reconfigurable rack -----------------------------------------

const RACK_MODULE = { w: 0.84, h: 0.46, d: 0.5 };
/** Light paths on the back plate, visible through the gaps: [x, y, w, h]. */
const PATHS_A: [number, number, number, number][] = [
  [-0.47, 0.61, 0.84, 0.018],
  [-0.47, 1.15, 0.84, 0.018],
];
const PATHS_B: [number, number, number, number][] = [
  [0.47, 0.61, 0.84, 0.018],
  [0.47, 1.15, 0.84, 0.018],
  [-0.47, 0.88, 0.84, 0.018],
];

function RackModule({ edge }: { edge: THREE.Material }) {
  const { mats } = useScene();
  const { w, h, d } = RACK_MODULE;
  return (
    <>
      <RoundedBox args={[w, h, d]} radius={0.028} smoothness={3} material={mats.anodised} />
      <mesh position={[0.04, 0, d / 2 + 0.002]} material={mats.ceramic}>
        <boxGeometry args={[w - 0.2, h - 0.14, 0.008]} />
      </mesh>
      <mesh position={[-w / 2 + 0.06, 0, d / 2 + 0.004]} material={edge}>
        <boxGeometry args={[0.012, h - 0.14, 0.006]} />
      </mesh>
    </>
  );
}

function Systems() {
  const { director, mats } = useScene();
  const mods = useRef<Partial<Record<RackId, THREE.Group | null>>>({});
  const pathA = useOwned(() => createGlow(0.5));
  const pathB = useOwned(() => createGlow(0));
  const spine = useOwned(() => createGlow(0.3));
  const header = useOwned(() => createGlow(0));
  const edgeSel = useOwned(() => createGlow(0.25));
  const edge = useOwned(() => createGlow(0.1));

  useFrame(() => {
    const p = director.p.sys;
    for (const id of RACK_IDS) mods.current[id]?.position.set(...rackPose(id, p));
    const b = pathBlend(p);
    const settle = sysSettle(p);
    glow(pathA, (1 - b) * 0.5);
    glow(pathB, b * 0.5 + settle * 0.9);
    glow(spine, 0.3 + settle * 0.9);
    glow(header, settle * 1.8);
    glow(edgeSel, 0.25 + selectGlow(p) * 1.6);
    glow(edge, 0.1 + settle * 0.8);
  });

  const H = 1.8;
  return (
    <group>
      <RoundedBox args={[2.0, 0.06, 0.72]} radius={0.015} position={[0, 0.03, -0.24]} material={mats.ceramic} />
      {[-1, 1].map((s) => (
        <RoundedBox key={s} args={[0.12, H, 0.62]} radius={0.025} position={[s * 1.0, 0.06 + H / 2, -0.25]} material={mats.anodised} />
      ))}
      <RoundedBox args={[1.88, H, 0.06]} radius={0.015} position={[0, 0.06 + H / 2, -0.55]} material={mats.anodisedDeep} />
      <RoundedBox args={[2.12, 0.1, 0.62]} radius={0.025} position={[0, 0.06 + H + 0.05, -0.25]} material={mats.anodised} />
      <mesh position={[0, 0.06 + H + 0.05, 0.062]} material={header}>
        <boxGeometry args={[1.2, 0.014, 0.006]} />
      </mesh>
      <mesh position={[0, 0.06 + H / 2, -0.518]} material={spine}>
        <boxGeometry args={[0.018, H - 0.36, 0.004]} />
      </mesh>
      {PATHS_A.map(([x, y, w, h], i) => (
        <mesh key={`a${i}`} position={[x, y, -0.518]} material={pathA}>
          <boxGeometry args={[w, h, 0.004]} />
        </mesh>
      ))}
      {PATHS_B.map(([x, y, w, h], i) => (
        <mesh key={`b${i}`} position={[x, y, -0.517]} material={pathB}>
          <boxGeometry args={[w, h, 0.004]} />
        </mesh>
      ))}
      {RACK_IDS.map((id) => (
        <group key={id} ref={(g) => void (mods.current[id] = g)} position={rackPose(id, 0)}>
          <RackModule edge={id === "c" ? edgeSel : edge} />
        </group>
      ))}
    </group>
  );
}

// --- Scene -------------------------------------------------------------------------

function Ready({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    // After this frame is on screen.
    requestAnimationFrame(() => onReady());
  });
  return null;
}

function Scene({ director, lowPower, onReady }: { director: Director; lowPower: boolean; onReady: () => void }) {
  const mats = useMemo(() => createMaterials(), []);
  useEffect(() => () => mats.dispose(), [mats]);
  const ctx = useMemo<Ctx>(() => ({ director, mats }), [director, mats]);
  return (
    <SceneCtx.Provider value={ctx}>
      <Driver />
      <Rig />
      <Studio lowPower={lowPower} />
      <Base />
      <ModuleSlot id="intel">
        <Intelligence />
      </ModuleSlot>
      <ModuleSlot id="auto">
        <Automation />
      </ModuleSlot>
      <ModuleSlot id="sys">
        <Systems />
      </ModuleSlot>
      <Ready onReady={onReady} />
    </SceneCtx.Provider>
  );
}

export interface SculptureProps {
  director: Director;
  lowPower: boolean;
  onReady: () => void;
  onLost: () => void;
}

export default function Sculpture({ director, lowPower, onReady, onLost }: SculptureProps) {
  return (
    <Canvas
      frameloop="demand"
      resize={{ offsetSize: true }}
      dpr={[1, lowPower ? 1.5 : 1.75]}
      camera={{ fov: FOV, near: 1, far: 100, position: [0, 4, 20] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Scene director={director} lowPower={lowPower} onReady={onReady} />
    </Canvas>
  );
}
