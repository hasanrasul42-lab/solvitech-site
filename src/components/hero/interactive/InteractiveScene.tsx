"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { buildRibbonGeometry } from "../../mark/markGeometry";
import {
  BLUE_SEGMENT,
  WHITE_SEGMENT,
  createEnergyUniforms,
  createFieldTexture,
  createGlowTexture,
  patchEnergyShader,
  pointOnAxis,
  ribbonAxis,
  type EnergyUniforms,
  type RibbonAxis,
} from "../../mark/markEffects";
import {
  clamp01,
  easeInOutSine,
  smoothDamp,
} from "../../mark/motion";
import { loadMarkContours, useLoadedMarkContours } from "../../mark/useMarkContours";
import type { MarkContours } from "../../mark/markGeometry";
import {
  AMPLITUDE,
  ENTRANCE,
  TIMING,
  type EntranceProgress,
  type InteractionInput,
  type ResponseStrength,
} from "./interactionConfig";
import { MOVES, createShuffleBag, type MoveId } from "./moves";
import { FOV, fitMetrics } from "./layout";

const deg = THREE.MathUtils.degToRad;
const smoothstep01 = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};

// Start fetching/parsing the mark as soon as this chunk loads. The canvas
// mounts once it is parsed, so nothing inside the canvas suspends.
void loadMarkContours();

/*
 * Geometry: deeper than the Task 01-03 slab so a 10-15° turn reads as a solid
 * object. The bevel is inset (see buildRibbonGeometry), so the outer
 * silhouette stays exactly on the traced contour at any depth/bevel.
 */
const GEOMETRY = { depth: 0.3, bevel: 0.03, smoothing: true };
const SILHOUETTE_Z = GEOMETRY.depth / 2;

const GLOW = { color: "#2f6bff", softness: 40, strength: 0.4, whiteAlpha: 0.22 };
const SHADOW = { softness: 12, opacity: 0.55, offset: new THREE.Vector2(0.05, -0.09) };

/**
 * "refined" lighting (A/B candidate): one steady, shapeless field of blue
 * light behind the mark, concentrated low around the blue ribbon and fading
 * smoothly into the navy. No silhouette-shaped halo and no shadow copies, so
 * nothing outlines the logo, and it does not react to the cursor or the click
 * moves (it only builds with the entrance, like the approved glow).
 */
export type Lighting = "approved" | "refined";
const FIELD = {
  /** Size relative to the mark's bounds (stays inside the poster crop, 1.7 x 1.55). */
  width: 1.5,
  height: 1.3,
  strength: 0.34,
  /** World units below the mark's centre: towards the blue ribbon. */
  drop: 0.12,
};

export interface InteractiveSceneProps {
  input: RefObject<InteractionInput>;
  /** Gives the DOM side a way to request a frame; returns an unregister. */
  registerWake: (wake: () => void) => () => void;
  /** Entrance progress (pose q and time t), read every frame from InteractiveMark's controller. */
  getEntrance: () => EntranceProgress;
  /** Poster capture: hold the given entrance pose with no idle, cursor or pulse. */
  frozen?: boolean;
  response: ResponseStrength;
  /** Reduced motion: no arrival/idle/tilt/spin; clicks give a light pulse. */
  reducedMotion: boolean;
  /** Overlay comparison: hold the exact resting front pose. */
  holdFront: boolean;
  paused: boolean;
  /** Called once when a click move starts (preview panel feedback). */
  onMoveStart?: (id: MoveId) => void;
  lowPower: boolean;
  onReady: () => void;
  /**
   * Size the canvas from layout size (offsetWidth/Height), ignoring CSS
   * transforms on ancestors. Needed when the stage may be scaled while the
   * canvas mounts (entrance prototype); the default measures the rendered box.
   */
  layoutSized?: boolean;
  /** Background halo and shadow treatment (A/B); defaults to the approved one. */
  lighting?: Lighting;
}

type RibbonFx = { axis: RibbonAxis; energy: EnergyUniforms };

function Sculpture({
  input,
  registerWake,
  getEntrance,
  frozen = false,
  response,
  reducedMotion,
  holdFront,
  paused,
  lowPower,
  onReady,
  onMoveStart,
  lighting = "approved",
  contours,
}: InteractiveSceneProps & { contours: MarkContours }) {
  const refined = lighting === "refined";
  const invalidate = useThree((s) => s.invalidate);
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const { worldPerPx } = fitMetrics(size.width, size.height, contours, SILHOUETTE_Z);

  const geometries = useMemo(
    () =>
      contours.ribbons.map((ribbon) => ({
        ribbon,
        geometry: buildRibbonGeometry(ribbon, contours, { ...GEOMETRY, bevelSegments: lowPower ? 4 : 6 }),
      })),
    [contours, lowPower],
  );
  useEffect(() => () => geometries.forEach(({ geometry }) => geometry.dispose()), [geometries]);

  const glow = useMemo(
    () =>
      refined
        ? createFieldTexture(contours, GLOW.color, FIELD.width, FIELD.height)
        : createGlowTexture(contours, GLOW.color, GLOW.softness, GLOW.whiteAlpha),
    [contours, refined],
  );
  const shadow = useMemo(() => createGlowTexture(contours, "#000000", SHADOW.softness, 1), [contours]);
  useEffect(
    () => () => {
      glow.texture.dispose();
      shadow.texture.dispose();
    },
    [glow, shadow],
  );

  // Shader uniforms are mutated every frame, so they live in a ref.
  const fxRef = useRef<Record<string, RibbonFx> | null>(null);
  if (fxRef.current === null) {
    const out: Record<string, RibbonFx> = {};
    for (const ribbon of contours.ribbons) {
      const axis = ribbonAxis(ribbon, contours);
      const energy = createEnergyUniforms(axis, ribbon.id === "blue-ribbon" ? BLUE_SEGMENT : WHITE_SEGMENT);
      energy.uEnergyCount.value = 1;
      energy.uEnergyWidth.value = 0.06;
      if (ribbon.id === "white-ribbon") energy.uEnergyColor.value.set("#dbe7ff");
      out[ribbon.id] = { axis, energy };
    }
    fxRef.current = out;
  }

  // Scene graph refs. Nesting keeps the transforms independent:
  // outer = parallax/float/entrance pose, tilt = cursor/drag/keys/idle,
  // spin = click animation.
  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const moveGroup = useRef<THREE.Group>(null);
  const glowMesh = useRef<THREE.Mesh>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMesh = useRef<THREE.Mesh>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const whiteMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const blueMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const sweepLight = useRef<THREE.DirectionalLight>(null);
  const pulseLight = useRef<THREE.PointLight>(null);

  // Animation state: mutable, never in React state.
  const s = useRef({
    t: 0,
    arrivalPulsed: false,
    /** Frames actually rendered before the canvas is revealed. */
    framesRendered: 0,
    revealed: false,
    yaw: 0,
    pitch: 0,
    yawV: { v: 0 },
    pitchV: { v: 0 },
    /** Spring-smoothed cursor distance from centre (drives the glow). */
    reach: 0,
    reachV: { v: 0 },
    px: 0,
    py: 0,
    pxV: { v: 0 },
    pyV: { v: 0 },
    drag: 0,
    dragV: { v: 0 },
    move: null as MoveId | null,
    lastMove: null as MoveId | null,
    moveStart: 0,
    moveQuat: new THREE.Quaternion(),
    frontNormal: new THREE.Vector3(),
    bag: createShuffleBag(),
    /** Energy pulse already launched within the current move. */
    movePulsed: false,
    roll: 0,
    rollV: { v: 0 },
    cooldownUntil: 0,
    spinConsumed: 0,
    resetConsumed: 0,
    pulseStart: -1,
    flash: 0,
  });

  useEffect(() => {
    // Requests made before mount are not replayed.
    s.current.spinConsumed = input.current.spinRequests;
    s.current.resetConsumed = input.current.resetRequests;
    const unregister = registerWake(() => invalidate());
    invalidate();
    return unregister;
  }, [input, registerWake, invalidate]);

  useEffect(() => {
    invalidate();
  }, [response, reducedMotion, holdFront, paused, invalidate]);

  useFrame((_, rawDelta) => {
    const st = s.current;
    const inp = input.current;
    const dt = Math.min(rawDelta, 1 / 20);
    st.t += dt;
    const t = st.t;
    const still = reducedMotion || holdFront || frozen;

    // Reveal only once real frames exist: frame 1 compiles shaders and builds
    // the environment map, frame 2 is a normal frame. Until then the start
    // poster stays on screen and nothing animates. The entrance starts after
    // the hand-over, so no part of it plays against a hidden canvas.
    if (!st.revealed) {
      st.framesRendered++;
      if (st.framesRendered >= 2) {
        st.revealed = true;
        onReady();
      }
    }

    // Reset: replay arrival from a clean state.
    if (inp.resetRequests !== st.resetConsumed) {
      st.resetConsumed = inp.resetRequests;
      st.spinConsumed = inp.spinRequests;
      st.arrivalPulsed = false;
      st.move = null;
      st.pulseStart = -1;
      st.flash = 0;
    }

    // --- Entrance -------------------------------------------------------------
    // Pose and timing come from InteractiveMark's entrance controller (the
    // same values the posters were rendered at), so the canvas always takes
    // over at exactly the visible pose.
    const entrance = reducedMotion || holdFront ? { q: 1, t: 1 } : getEntrance();
    const arrival = clamp01(entrance.q);
    const away = 1 - arrival;
    // Pointer response and idle drift blend in over the final part of the
    // entrance (time-based), so control is already live when it lands.
    const settled = frozen
      ? 0
      : (entrance.engage ?? smoothstep01((entrance.t - ENTRANCE.engageFrom) / (1 - ENTRANCE.engageFrom)));
    if (!st.arrivalPulsed && (frozen || (st.revealed && entrance.t >= 1))) st.arrivalPulsed = true; // took over at rest: no pulse
    if (!st.arrivalPulsed && st.revealed && entrance.t >= ENTRANCE.pulseAt && !reducedMotion) {
      st.arrivalPulsed = true;
      st.pulseStart = t;
    }

    // --- Click manoeuvre -------------------------------------------------------
    // One move at a time: requests during a move (and a short cooldown after)
    // are dropped, never queued. Explicit requests (preview panel) name a
    // move; ordinary clicks draw the next one from the shuffle bag.
    if (inp.spinRequests !== st.spinConsumed) {
      st.spinConsumed = inp.spinRequests;
      const requested = inp.requestedMove;
      if (st.move === null && t >= st.cooldownUntil && !holdFront) {
        if (reducedMotion) {
          st.flash = 1; // no movement: a brief illumination instead
        } else {
          const id = requested === "replay" ? (st.lastMove ?? st.bag.next()) : (requested ?? st.bag.next());
          st.move = id;
          st.lastMove = id;
          st.moveStart = t; // starts on this frame
          st.movePulsed = false;
          onMoveStart?.(id);
        }
      }
    }
    let surge = 0; // glow boost: rises at once, fades out by the end
    let crest = 0; // lift/scale envelope
    let accent = 0; // closing blue-light accent
    let crestScale = 0;
    let crestForward = 0;
    if (st.move !== null) {
      const def = MOVES[st.move];
      const p = clamp01((t - st.moveStart) / def.seconds);
      def.rotation(p, st.moveQuat);
      surge = Math.sin(Math.PI * Math.pow(p, 0.55));
      crest = def.crest(p);
      accent = def.accent(p);
      crestScale = def.crestScale;
      crestForward = def.crestForward;
      if (!st.movePulsed && p >= def.pulseAt) {
        st.movePulsed = true;
        st.pulseStart = t; // energy pulse sweeps through as it comes round
      }
      if (p >= 1) {
        st.move = null;
        surge = crest = accent = 0;
        st.cooldownUntil = t + TIMING.clickCooldownSeconds;
      }
    }
    // Exactly the resting orientation whenever no move is running.
    if (st.move === null) st.moveQuat.identity();
    const clickActive = st.move !== null;

    // Glow and shadow are flat layers shaped like the front view; fade them as
    // the front face turns away (z of the rotated front normal).
    const facing = Math.abs(st.frontNormal.set(0, 0, 1).applyQuaternion(st.moveQuat).z);

    // --- Orientation: cursor + keys + idle, clamped to the envelope ----------
    const maxYaw = deg(response.yawDeg);
    const maxPitch = deg(response.pitchDeg);
    const idle = still ? 0 : settled;
    const cursorOn = !still;
    const engage = settled; // pointer response fades in with the settle
    const targetYaw = THREE.MathUtils.clamp(
      (cursorOn ? inp.pointer.x * maxYaw * engage : 0) + inp.keyYaw + idle * deg(AMPLITUDE.idleYawDeg) * Math.sin(t * 0.31),
      -maxYaw,
      maxYaw,
    );
    const targetPitch = THREE.MathUtils.clamp(
      (cursorOn ? inp.pointer.y * maxPitch * engage : 0) +
        inp.keyPitch +
        idle * deg(AMPLITUDE.idlePitchDeg) * Math.sin(t * 0.23 + 1.1),
      -maxPitch,
      maxPitch,
    );
    const targetRoll = idle * deg(AMPLITUDE.idleRollDeg) * Math.sin(t * 0.17 + 0.4);
    if (clickActive) {
      // Hold the pointer tilt exactly where it was when the click landed; the
      // springs restart from rest afterwards, so it eases back to the pointer.
      st.yawV.v = st.pitchV.v = st.dragV.v = st.rollV.v = 0;
    } else {
      st.yaw = smoothDamp(st.yaw, holdFront ? 0 : targetYaw, st.yawV, TIMING.tiltSmoothTime, dt);
      st.pitch = smoothDamp(st.pitch, holdFront ? 0 : targetPitch, st.pitchV, TIMING.tiltSmoothTime, dt);
      st.roll = smoothDamp(st.roll, targetRoll, st.rollV, TIMING.tiltSmoothTime, dt);
      // Touch-drag preview: tight follow while dragging, soft return on release.
      st.drag = smoothDamp(
        st.drag,
        inp.dragging && !holdFront ? inp.dragYaw : 0,
        st.dragV,
        inp.dragging ? TIMING.dragSmoothTime : TIMING.releaseSmoothTime,
        dt,
      );
    }

    // Parallax: nearest layer shifts against the cursor (never chases it).
    const ptrX = cursorOn ? inp.pointer.x * engage : 0;
    const ptrY = cursorOn ? inp.pointer.y * engage : 0;
    st.px = smoothDamp(st.px, -ptrX * response.parallaxXPx * worldPerPx, st.pxV, TIMING.tiltSmoothTime, dt);
    st.py = smoothDamp(st.py, ptrY * response.parallaxYPx * worldPerPx, st.pyV, TIMING.tiltSmoothTime, dt);

    const float = idle * AMPLITUDE.idleFloat * Math.sin(t * 0.9);

    // Composition (parent -> child), each with one job, all pivoting on the
    // model centre:
    //   outer:  position (parallax, float, entrance drop, move lift/forward),
    //           scale (entrance, move crest), entrance settle rotation
    //   move:   click move only, one quaternion composed per move (moves.ts)
    //   tilt:   pointer / keys / idle / touch-drag (held during a move)
    if (outer.current) {
      outer.current.position.set(
        st.px,
        st.py + float + crest * AMPLITUDE.manoeuvreLift - away * AMPLITUDE.arrivalDrop,
        crest * crestForward,
      );
      outer.current.rotation.set(away * deg(AMPLITUDE.arrivalPitchDeg), away * deg(AMPLITUDE.arrivalYawDeg), 0);
      outer.current.scale.setScalar(
        THREE.MathUtils.lerp(AMPLITUDE.arrivalScale, 1, holdFront ? 1 : arrival) * (1 + crest * crestScale),
      );
    }
    moveGroup.current?.quaternion.copy(st.moveQuat);
    tilt.current?.rotation.set(st.pitch, st.yaw + st.drag, st.roll);

    // --- Energy pulse along the blue ribbon, catching the white ------------
    let pulseActive = false;
    const fx = fxRef.current!;
    const blue = fx["blue-ribbon"];
    const white = fx["white-ribbon"];
    let pulseIntensity = 0;
    let phase = 0;
    if (st.pulseStart >= 0) {
      const p = (t - st.pulseStart) / TIMING.pulseSeconds;
      if (p >= 1) {
        st.pulseStart = -1;
      } else {
        pulseActive = true;
        // Travels left -> right along the blue ribbon, round its curl and
        // fades a little way into the white ribbon's right end.
        phase = THREE.MathUtils.lerp(-0.04, 0.62, easeInOutSine(p));
        pulseIntensity = Math.sin(Math.PI * p) * 1.5;
      }
    }
    blue.energy.uEnergyPhase.value = phase;
    blue.energy.uEnergyIntensity.value = pulseIntensity;
    white.energy.uEnergyPhase.value = phase;
    white.energy.uEnergyIntensity.value = pulseIntensity * 0.35;
    if (pulseLight.current) {
      const onBlue = phase < 0.5;
      const sAxis = onBlue ? clamp01(phase * 2) : 1 - clamp01((phase - 0.5) * 2);
      pointOnAxis(onBlue ? blue.axis : white.axis, sAxis, pulseLight.current.position, SILHOUETTE_Z + 0.8);
      pulseLight.current.intensity = pulseIntensity * 0.7;
    }

    // --- Illumination -------------------------------------------------------
    st.flash *= Math.exp(-dt * 3.2);
    if (st.flash < 1e-3) st.flash = 0;
    // Materials start near the static SVG's brightness (no dark hand-over
    // frame); the glow and shadow layers start from zero, like the SVG.
    const lit = holdFront ? 1 : 0.6 + 0.4 * arrival;
    const glowOn = holdFront ? 1 : arrival * arrival; // the glow builds through the entrance
    // The glow follows the cursor through the same spring as the tilt. It used
    // to read the raw cursor, so every pointer event could resize the large
    // halo by up to 4% in a single frame -- visible as jerks around the mark.
    st.reach = smoothDamp(st.reach, Math.min(1, Math.hypot(ptrX, ptrY)), st.reachV, TIMING.tiltSmoothTime, dt);
    const reach = st.reach;
    const breathe = still ? 1 : 1 + 0.06 * Math.sin(t * 1.05);

    if (whiteMat.current) whiteMat.current.emissiveIntensity = 0.04 + 0.16 * lit + 0.1 * st.flash + 0.06 * surge + 0.08 * accent;
    if (blueMat.current) blueMat.current.emissiveIntensity = 0.1 + 0.16 * lit + 0.35 * st.flash + 0.3 * surge + 0.4 * accent;
    if (rimLight.current) rimLight.current.intensity = (0.9 + 1.2 * st.flash + 1.2 * surge + 1.4 * accent) * lit;
    get().scene.environmentIntensity = 0.55 + 0.45 * lit;

    if (glowMat.current) {
      glowMat.current.opacity = refined
        ? FIELD.strength * glowOn // steady: no breathing, cursor or move response
        : GLOW.strength * glowOn * breathe * (0.35 + 0.65 * facing) * (1 + 0.25 * reach + 0.6 * st.flash + AMPLITUDE.manoeuvreGlow * surge + 0.8 * accent);
    }
    if (glowMesh.current) {
      if (refined) {
        // Fixed behind the resting mark (it only arrives with the entrance).
        glowMesh.current.position.set(0, -FIELD.drop - away * AMPLITUDE.arrivalDrop, -0.7);
      } else {
        // Deeper layer: parallaxes less, so the halo slides out towards the cursor.
        glowMesh.current.position.set(st.px * 0.35, st.py * 0.35 + float * 0.5 - away * AMPLITUDE.arrivalDrop, -0.7);
        glowMesh.current.scale.setScalar(1 + 0.04 * reach);
      }
    }
    if (shadowMesh.current) {
      // Soft drop shadow cast onto the glow: deepens the sense of layers.
      shadowMesh.current.position.set(
        st.px * 0.6 + SHADOW.offset.x - st.yaw * 0.25,
        st.py * 0.6 + SHADOW.offset.y + float * 0.6 - away * AMPLITUDE.arrivalDrop,
        -0.45,
      );
    }
    if (shadowMat.current) shadowMat.current.opacity = SHADOW.opacity * glowOn * facing * facing;
    // Highlight sweep light moves against the turn, so bevels catch it.
    if (sweepLight.current) sweepLight.current.position.set(-(st.yaw + st.drag) * 18, 2.5 + st.pitch * 18, 5);

    // --- Keep rendering only while something moves --------------------------
    const settling =
      Math.abs(st.yawV.v) + Math.abs(st.pitchV.v) + Math.abs(st.pxV.v) + Math.abs(st.pyV.v) > 1e-4 ||
      Math.abs(st.dragV.v) + Math.abs(st.reachV.v) > 1e-4 ||
      Math.abs(st.drag - (inp.dragging ? inp.dragYaw : 0)) > 1e-4 ||
      Math.abs(st.yaw - (holdFront ? 0 : targetYaw)) > 1e-4;
    const animating =
      !st.revealed || !still || arrival < 1 || st.move !== null || pulseActive || st.flash > 0 || settling || inp.dragging;
    if (animating && !paused) invalidate();
  });

  const energyFor = (id: string) => (shader: THREE.WebGLProgramParametersWithUniforms) =>
    patchEnergyShader(shader, fxRef.current![id].energy);

  return (
    <>
      <mesh ref={glowMesh} position={[0, 0, -0.7]} renderOrder={-2}>
        <planeGeometry args={[glow.worldWidth, glow.worldHeight]} />
        <meshBasicMaterial
          ref={glowMat}
          map={glow.texture}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {!refined && (
        <mesh ref={shadowMesh} position={[0, 0, -0.45]} renderOrder={-1}>
          <planeGeometry args={[shadow.worldWidth, shadow.worldHeight]} />
          <meshBasicMaterial ref={shadowMat} map={shadow.texture} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}

      <directionalLight ref={rimLight} position={[1.5, 3, -6]} intensity={0} color="#3d7bff" />
      <directionalLight ref={sweepLight} position={[0, 2.5, 5]} intensity={0.9} color="#ffffff" />
      <pointLight ref={pulseLight} color="#6aa6ff" intensity={0} distance={2.4} decay={2} />

      <group ref={outer}>
        <group ref={moveGroup}>
          <group ref={tilt}>
            {geometries.map(({ ribbon, geometry }) =>
              ribbon.id === "white-ribbon" ? (
                <mesh key={ribbon.id} geometry={geometry}>
                  {/* Satin/gloss white: soft base sheen under a crisp coat. */}
                  <meshPhysicalMaterial
                    ref={whiteMat}
                    color={ribbon.color}
                    roughness={0.3}
                    metalness={0.02}
                    clearcoat={0.8}
                    clearcoatRoughness={0.1}
                    envMapIntensity={1.45}
                    emissive="#ffffff"
                    emissiveIntensity={0}
                    onBeforeCompile={energyFor(ribbon.id)}
                    customProgramCacheKey={() => "solvitech-energy"}
                  />
                </mesh>
              ) : (
                <mesh key={ribbon.id} geometry={geometry}>
                  {/* Coated metallic blue: colour from a light metallic base,
                      depth from a glossy clearcoat. */}
                  <meshPhysicalMaterial
                    ref={blueMat}
                    color={ribbon.color}
                    roughness={0.32}
                    metalness={0.3}
                    clearcoat={1}
                    clearcoatRoughness={0.08}
                    envMapIntensity={1.3}
                    emissive={ribbon.color}
                    emissiveIntensity={0}
                    onBeforeCompile={energyFor(ribbon.id)}
                    customProgramCacheKey={() => "solvitech-energy"}
                  />
                </mesh>
              ),
            )}
          </group>
        </group>
      </group>
    </>
  );
}

function CameraFit({ contours }: { contours: MarkContours }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const { distance } = fitMetrics(size.width, size.height, contours, SILHOUETTE_Z);
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = FOV;
    camera.near = distance * 0.4;
    camera.far = distance * 2;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, contours, invalidate]);

  return null;
}

function Studio({ lowPower }: { lowPower: boolean }) {
  return (
    <>
      {/* World-fixed softboxes and strips. At rest the faces reflect empty
          space (true brand colours); turning sweeps the strips across faces
          and bevels (a face turned by θ reflects at 2θ). */}
      <Environment resolution={lowPower ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[-4, 4, 6]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[1.9, 0.4, 5]} scale={[0.32, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#e4ecff" position={[-1.7, -0.3, 5]} scale={[0.26, 8, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 1.3, 5]} scale={[8, 0.22, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#dfe8ff" position={[6, -1, 4]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#3d7bff" position={[0, 3, -6]} scale={[10, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#2f6bff" position={[-5, -3, 2]} scale={[0.4, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#2f6bff" position={[5, -3, -2]} scale={[0.4, 5, 1]} />
      </Environment>
      <ambientLight intensity={0.07} color="#9fb6ff" />
      <directionalLight position={[-3, 4, 6]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.7} color="#2f5fd0" />
    </>
  );
}

export default function InteractiveScene(props: InteractiveSceneProps) {
  const contours = useLoadedMarkContours();
  if (!contours) return null;
  return (
    <Canvas
      frameloop="demand"
      resize={props.layoutSized ? { offsetSize: true } : undefined}
      dpr={[1, props.lowPower ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, powerPreference: "high-performance" }}
      // Input is handled by the accessible element layered above the canvas.
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Studio lowPower={props.lowPower} />
      <Suspense fallback={null}>
        <CameraFit contours={contours} />
        <Sculpture {...props} contours={contours} />
      </Suspense>
    </Canvas>
  );
}
