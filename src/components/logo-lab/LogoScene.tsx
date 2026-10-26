"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Line, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { buildRibbonGeometry, contourToShape } from "../mark/markGeometry";
import { useMarkContours } from "../mark/useMarkContours";
import {
  BLUE_SEGMENT,
  WHITE_SEGMENT,
  createEnergyUniforms,
  createGlowTexture,
  easeOutQuart,
  patchEnergyShader,
  pointOnAxis,
  ribbonAxis,
  type EnergyUniforms,
  type RibbonAxis,
} from "../mark/markEffects";
import { REFERENCE_IMAGE, type ExperimentSettings, type LabSettings, type ViewState } from "./labConfig";

const BACKGROUND = "#080D17";
const CAMERA_DISTANCE = 20;

type RibbonFx = { axis: RibbonAxis; energy: EnergyUniforms };

function Ribbons({
  settings,
  experiments,
  fx,
}: {
  settings: LabSettings;
  experiments: ExperimentSettings;
  fx: Record<string, RibbonFx>;
}) {
  const contours = useMarkContours();
  const { depth, bevel, bevelSegments, smoothing } = settings;

  const geometries = useMemo(
    () =>
      contours.ribbons.map((ribbon) => ({
        ribbon,
        geometry: buildRibbonGeometry(ribbon, contours, { depth, bevel, bevelSegments, smoothing }),
      })),
    [contours, depth, bevel, bevelSegments, smoothing],
  );

  useEffect(() => () => geometries.forEach(({ geometry }) => geometry.dispose()), [geometries]);

  // Experiment A: brighter satin white, restrained blue self-illumination,
  // tighter clearcoat. Static mode keeps the Task 01 material values.
  const lit = experiments.enabled && experiments.illumination.enabled;
  const { whiteLift, blueEmissive } = experiments.illumination;

  return (
    <group>
      {geometries.map(({ ribbon, geometry }) => {
        const isWhite = ribbon.id === "white-ribbon";
        const energy = fx[ribbon.id].energy;
        return (
          <mesh key={ribbon.id} name={ribbon.id} geometry={geometry}>
            <meshPhysicalMaterial
              color={ribbon.color}
              roughness={settings.roughness}
              metalness={settings.metalness}
              clearcoat={lit ? 0.35 : 0.15}
              clearcoatRoughness={lit ? 0.35 : 0.6}
              envMapIntensity={lit && isWhite ? 1 + whiteLift : 1}
              emissive={isWhite ? "#ffffff" : ribbon.color}
              emissiveIntensity={lit ? (isWhite ? whiteLift * 0.5 : blueEmissive) : 0}
              onBeforeCompile={(shader) => patchEnergyShader(shader, energy)}
              customProgramCacheKey={() => "solvitech-energy"}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/** Experiment A halo: blurred silhouette of the real paths, behind the mark. */
function Glow({
  experiments,
  backZ,
  materialRef,
}: {
  experiments: ExperimentSettings;
  backZ: number;
  materialRef: RefObject<THREE.MeshBasicMaterial | null>;
}) {
  const contours = useMarkContours();
  const { glowColor, glowSoftness } = experiments.illumination;
  const glow = useMemo(
    () => createGlowTexture(contours, glowColor, glowSoftness),
    [contours, glowColor, glowSoftness],
  );
  useEffect(() => () => glow.texture.dispose(), [glow]);

  return (
    <mesh position={[0, 0, backZ - 0.03]} renderOrder={-1}>
      <planeGeometry args={[glow.worldWidth, glow.worldHeight]} />
      <meshBasicMaterial
        ref={materialRef}
        map={glow.texture}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

const ARRIVAL_SECONDS = 1.8;
const deg = THREE.MathUtils.degToRad;

export interface SceneFx {
  experiments: ExperimentSettings;
  /** false under reduced motion: pulses stay frozen in place. */
  animateEnergy: boolean;
  /** Canvas offscreen: stop requesting frames. */
  paused: boolean;
  /** Bump to replay the arrival animation. */
  arrivalToken: number;
  /** Overlays visible: hold the neutral front pose so they line up. */
  holdStill: boolean;
}

/**
 * The mark plus all Task 02 effects. One useFrame drives motion, glow and
 * energy. The canvas stays on frameloop="demand": this component requests the
 * next frame only while something is actually moving, so a static setup
 * costs nothing.
 */
function AnimatedMark({ settings, fx }: { settings: LabSettings; fx: SceneFx }) {
  const contours = useMarkContours();
  const invalidate = useThree((s) => s.invalidate);
  const domElement = useThree((s) => s.gl.domElement);

  const group = useRef<THREE.Group>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const pulseLight = useRef<THREE.PointLight>(null);

  const ribbonFx = useMemo(() => {
    const out: Record<string, RibbonFx> = {};
    for (const ribbon of contours.ribbons) {
      const axis = ribbonAxis(ribbon, contours);
      const segment = ribbon.id === "blue-ribbon" ? BLUE_SEGMENT : WHITE_SEGMENT;
      const energy = createEnergyUniforms(axis, segment);
      if (ribbon.id === "white-ribbon") energy.uEnergyColor.value.set("#d6e4ff");
      out[ribbon.id] = { axis, energy };
    }
    return out;
  }, [contours]);

  // Mutable animation state; lives outside React so frames don't re-render.
  const anim = useRef({
    time: 0,
    arrivalStart: null as number | null,
    phase: 0,
    idleWeight: 0,
    pointer: new THREE.Vector2(),
    tilt: new THREE.Vector2(),
  });

  const { experiments } = fx;
  const on = experiments.enabled;
  const illumination = on && experiments.illumination.enabled;
  const energy = on && experiments.energy.enabled;
  const motion = experiments.motion;
  const arrivalOn = on && motion.arrival && !fx.holdStill;
  const idleOn = on && motion.idle && !fx.holdStill;
  const cursorOn = on && motion.cursor && !fx.holdStill;

  // Start (or replay) the arrival. Deliberately keyed on the token only.
  const arrivalOnRef = useRef(arrivalOn);
  useEffect(() => {
    arrivalOnRef.current = arrivalOn;
  });
  useEffect(() => {
    anim.current.arrivalStart = arrivalOnRef.current ? anim.current.time : null;
    invalidate();
  }, [fx.arrivalToken, invalidate]);

  // Kick the loop whenever what is animating changes.
  useEffect(() => {
    invalidate();
  }, [invalidate, illumination, energy, idleOn, cursorOn, fx.paused, fx.animateEnergy]);

  // Cursor tilt: mouse only (touch drags orbit the camera instead).
  useEffect(() => {
    const state = anim.current;
    if (!cursorOn) {
      state.pointer.set(0, 0);
      invalidate();
      return;
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.buttons) return;
      const r = domElement.getBoundingClientRect();
      state.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
      invalidate();
    };
    const leave = () => {
      state.pointer.set(0, 0);
      invalidate();
    };
    domElement.addEventListener("pointermove", move);
    domElement.addEventListener("pointerleave", leave);
    return () => {
      domElement.removeEventListener("pointermove", move);
      domElement.removeEventListener("pointerleave", leave);
    };
  }, [cursorOn, domElement, invalidate]);

  useFrame((_, rawDelta) => {
    const a = anim.current;
    const dt = Math.min(rawDelta, 1 / 20); // no jumps after demand-mode gaps
    a.time += dt;
    const t = a.time;

    // Arrival 0 -> 1
    let arrival = 1;
    if (arrivalOn && a.arrivalStart !== null) {
      arrival = easeOutQuart(THREE.MathUtils.clamp((t - a.arrivalStart) / ARRIVAL_SECONDS, 0, 1));
    }
    const away = 1 - arrival;

    // Idle drift, faded in/out so toggling never snaps.
    a.idleWeight += ((idleOn ? 1 : 0) - a.idleWeight) * (1 - Math.exp(-dt * 2));
    const idle = a.idleWeight * motion.idleAmount;

    // Cursor tilt eases towards the pointer; the mark turns to face it.
    const tiltMax = deg(motion.cursorTilt);
    const tx = cursorOn ? a.pointer.x * tiltMax : 0;
    const ty = cursorOn ? a.pointer.y * tiltMax : 0;
    const ease = 1 - Math.exp(-dt * 3.5);
    a.tilt.x += (tx - a.tilt.x) * ease;
    a.tilt.y += (ty - a.tilt.y) * ease;

    const g = group.current;
    if (g) {
      g.rotation.set(
        away * deg(10) + idle * deg(1.2) * Math.sin(t * 0.55) + a.tilt.y,
        away * deg(-28) + idle * deg(2.2) * Math.sin(t * 0.43 + 1.3) + a.tilt.x,
        idle * deg(0.4) * Math.sin(t * 0.31 + 0.6),
      );
      g.position.y = -away * 0.15 + idle * 0.025 * Math.sin(t * 0.7);
      g.scale.setScalar(THREE.MathUtils.lerp(0.9, 1, arrival));
    }

    if (glowMaterial.current) {
      glowMaterial.current.opacity = illumination ? experiments.illumination.glowStrength * arrival : 0;
    }

    // Experiment B: travelling pulse around the blue -> white circuit.
    const e = experiments.energy;
    if (energy && fx.animateEnergy) a.phase += dt * e.speed * e.frequency;
    const blue = ribbonFx["blue-ribbon"];
    const white = ribbonFx["white-ribbon"];
    const pairs: [RibbonFx, number][] = [
      [blue, 1],
      [white, e.whiteResponse],
    ];
    for (const [rib, strength] of pairs) {
      rib.energy.uEnergyPhase.value = a.phase;
      rib.energy.uEnergyCount.value = e.frequency;
      rib.energy.uEnergyWidth.value = e.width;
      rib.energy.uEnergyIntensity.value = energy ? e.intensity * strength * arrival : 0;
    }

    // A small blue light rides the leading pulse, so nearby surfaces (white
    // bevels beside the blue curl, and vice versa) catch real light.
    const light = pulseLight.current;
    if (light) {
      const lead = (((a.phase / e.frequency) % 1) + 1) % 1;
      const onBlue = lead < 0.5;
      const s = onBlue ? lead * 2 : 1 - (lead - 0.5) * 2;
      pointOnAxis(onBlue ? blue.axis : white.axis, s, light.position, settings.depth / 2 + 0.9);
      light.intensity = energy ? e.intensity * 0.9 * arrival * (onBlue ? 1 : 0.5) : 0;
    }

    const moving =
      (energy && fx.animateEnergy) ||
      idleOn ||
      (arrivalOn && arrival < 1) ||
      Math.abs(a.idleWeight - (idleOn ? 1 : 0)) > 1e-3 ||
      Math.abs(a.tilt.x - tx) > 1e-4 ||
      Math.abs(a.tilt.y - ty) > 1e-4;
    if (moving && !fx.paused) invalidate();
  });

  const frontZ = settings.depth / 2 + settings.bevel;

  return (
    <group ref={group}>
      {illumination && <Glow experiments={experiments} backZ={-frontZ} materialRef={glowMaterial} />}
      <Ribbons settings={settings} experiments={experiments} fx={ribbonFx} />
      <pointLight ref={pulseLight} color="#5c9dff" intensity={0} distance={2.4} decay={2} />
    </group>
  );
}

/** Raw traced SVG contours drawn just in front of the model, for front-view checks. */
function TraceOutline({ frontZ }: { frontZ: number }) {
  const contours = useMarkContours();
  const lines = useMemo(
    () =>
      contours.ribbons.map((ribbon) => {
        const pts = contourToShape(ribbon.points, contours).getPoints();
        return { id: ribbon.id, points: [...pts, pts[0]].map((p) => [p.x, p.y, frontZ] as const) };
      }),
    [contours, frontZ],
  );
  return (
    <>
      {lines.map(({ id, points }) => (
        <Line
          key={id}
          points={points as unknown as [number, number, number][]}
          color="#ff3d71"
          lineWidth={1.5}
          depthTest={false}
          renderOrder={20}
        />
      ))}
    </>
  );
}

/**
 * original-reference.png placed in world space so the mark inside it lines up
 * with the SVG geometry (see REFERENCE_IMAGE for the measured offsets).
 */
function ReferencePlane({ opacity, frontZ }: { opacity: number; frontZ: number }) {
  const contours = useMarkContours();
  const loaded = useLoader(THREE.TextureLoader, REFERENCE_IMAGE.url);
  const texture = useMemo(() => {
    const t = loaded.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [loaded]);
  useEffect(() => () => texture.dispose(), [texture]);

  const { width, height, position } = useMemo(() => {
    const ref = REFERENCE_IMAGE;
    const worldPerRefPx = contours.scale / ref.pxPerSvgUnit;
    const center = contours.bounds.getCenter(new THREE.Vector2());
    // Mark centre expressed in reference-image pixels.
    const markX = ref.svgOriginX + center.x * ref.pxPerSvgUnit;
    const markY = ref.svgOriginY + center.y * ref.pxPerSvgUnit;
    return {
      width: ref.width * worldPerRefPx,
      height: ref.height * worldPerRefPx,
      position: [
        (ref.width / 2 - markX) * worldPerRefPx,
        -(ref.height / 2 - markY) * worldPerRefPx,
        frontZ,
      ] as const,
    };
  }, [contours, frontZ]);

  return (
    <mesh position={position} renderOrder={10}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * With frameloop="demand", nothing redraws when a Suspense boundary resolves.
 * Mounting this alongside suspended content requests one frame once it is ready.
 */
function InvalidateOnMount() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [invalidate]);
  return null;
}

function fitZoom(width: number, height: number) {
  // Mark is ~3 units tall and ~2.3 wide; leave generous margin.
  return Math.min(height / 4.4, width / 3.6);
}

/**
 * Positions the orthographic camera from the azimuth/elevation state and
 * reports user orbiting back so the sliders stay in sync.
 */
function CameraRig({ view, onViewChange }: { view: ViewState; onViewChange: (v: ViewState) => void }) {
  // Read camera/controls through get() so effects mutate the live three.js
  // objects rather than values captured from React state.
  const get = useThree((s) => s.get);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  // Re-fit on resize and whenever a reset/preset is requested.
  useEffect(() => {
    const camera = get().camera as THREE.OrthographicCamera;
    camera.zoom = fitZoom(size.width, size.height);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, view.resetToken, invalidate]);

  useEffect(() => {
    const phi = THREE.MathUtils.degToRad(90 - view.elevation);
    const theta = THREE.MathUtils.degToRad(view.azimuth);
    const camera = get().camera;
    camera.position.setFromSphericalCoords(CAMERA_DISTANCE, phi, theta);
    camera.lookAt(0, 0, 0);
    const liveControls = get().controls as OrbitControlsImpl | null;
    if (liveControls) {
      liveControls.target.set(0, 0, 0);
      liveControls.update();
    }
    invalidate();
  }, [get, controls, view.azimuth, view.elevation, view.resetToken, invalidate]);

  return (
    <OrbitControls
      makeDefault
      enableDamping={false}
      enablePan={false}
      minZoom={20}
      maxZoom={2000}
      onEnd={() => {
        const s = new THREE.Spherical().setFromVector3(get().camera.position);
        onViewChange({
          azimuth: Math.round(THREE.MathUtils.radToDeg(s.theta)),
          elevation: Math.round(90 - THREE.MathUtils.radToDeg(s.phi)),
          resetToken: view.resetToken,
        });
      }}
    />
  );
}

function StudioLighting({ settings }: { settings: LabSettings }) {
  return (
    <>
      {/* Static softbox environment: no external HDR files. */}
      <Environment resolution={256} frames={1} environmentIntensity={settings.environment}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-4, 4, 6]} scale={[8, 5, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#dfe8ff" position={[6, -1, 4]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#3d7bff" position={[0, 3, -6]} scale={[10, 1.5, 1]} />
      </Environment>
      <ambientLight intensity={0.08} color="#9fb6ff" />
      <directionalLight position={[-3, 4, 6]} intensity={settings.keyLight} color="#ffffff" />
      {/* Subtle blue rim from behind: catches bevels and side walls when tilted. */}
      <directionalLight position={[2, 3, -6]} intensity={settings.rimLight} color="#3d7bff" />
      <directionalLight position={[-5, -2, -4]} intensity={settings.rimLight * 0.5} color="#2f5fd0" />
    </>
  );
}

export interface LogoSceneProps {
  settings: LabSettings;
  fx: SceneFx;
  /** Pixel-ratio cap; lower on touch devices. */
  maxDpr: number;
  view: ViewState;
  onViewChange: (v: ViewState) => void;
}

export default function LogoScene({ settings, fx, maxDpr, view, onViewChange }: LogoSceneProps) {
  // Front cap sits at depth/2 + bevel; overlays go just in front of it.
  const frontZ = settings.depth / 2 + settings.bevel + 0.01;

  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, CAMERA_DISTANCE], near: 0.1, far: 100, zoom: 100 }}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={[BACKGROUND]} />
      <StudioLighting settings={settings} />
      <Suspense fallback={null}>
        <AnimatedMark settings={settings} fx={fx} />
        <InvalidateOnMount />
      </Suspense>
      {settings.referenceOpacity > 0 && (
        <Suspense fallback={null}>
          <ReferencePlane opacity={settings.referenceOpacity} frontZ={frontZ} />
          <InvalidateOnMount />
        </Suspense>
      )}
      {settings.showTrace && (
        <Suspense fallback={null}>
          <TraceOutline frontZ={frontZ + 0.01} />
          <InvalidateOnMount />
        </Suspense>
      )}
      <CameraRig view={view} onViewChange={onViewChange} />
    </Canvas>
  );
}
