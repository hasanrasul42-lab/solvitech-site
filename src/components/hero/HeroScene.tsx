"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MARK_WORLD_HEIGHT, buildRibbonGeometry, type MarkContours } from "../mark/markGeometry";
import { createGlowTexture, easeOutQuart } from "../mark/markEffects";
import { smoothDamp } from "../mark/motion";
import { useMarkContours } from "../mark/useMarkContours";
import { MARK_HEIGHT_FRACTION, MARK_MAX_WIDTH_FRACTION } from "./heroLayout";
import { HERO_SMOOTH_TIME, type HeroInteraction } from "./heroMotion";

/*
 * Public hero sculpture. Fixed, art-directed values only: no developer
 * controls, no orbit or drag. Tuning happened in /3d-lab (archive branch).
 */
const GEOMETRY = { depth: 0.16, bevel: 0.02, bevelSegments: 5, smoothing: true };
const GLOW = { color: "#2f6bff", softness: 34, strength: 0.42 };

const ARRIVAL_SECONDS = 1.9;
const FOV = 24;
/** Idle drift amplitude, kept inside the interaction envelope. */
const IDLE_YAW = 1.1;
const IDLE_PITCH = 0.7;

const deg = THREE.MathUtils.degToRad;

/** Camera distance and world-units-per-CSS-pixel at the mark's plane. */
function fitMetrics(width: number, height: number, contours: MarkContours) {
  const bounds = contours.bounds.getSize(new THREE.Vector2());
  const markPx = Math.min(height * MARK_HEIGHT_FRACTION, (width * MARK_MAX_WIDTH_FRACTION * bounds.y) / bounds.x);
  const visibleHeight = (MARK_WORLD_HEIGHT * height) / markPx;
  return {
    distance: visibleHeight / 2 / Math.tan(deg(FOV / 2)),
    worldPerPx: visibleHeight / height,
  };
}

export interface HeroSceneProps {
  /** Reduced motion: render a still front pose, no arrival/idle/cursor. */
  still: boolean;
  /** Cursor response (fine pointers only). */
  followCursor: boolean;
  /** Rotation and parallax envelope. */
  interaction: HeroInteraction;
  /** Hero offscreen: stop requesting frames. */
  paused: boolean;
  /** Element whose centre the cursor offset is measured from. */
  anchor: RefObject<HTMLElement | null>;
  lowPower: boolean;
  onReady: () => void;
}

function Sculpture({
  still,
  followCursor,
  interaction,
  paused,
  anchor,
  onReady,
}: Omit<HeroSceneProps, "lowPower">) {
  const contours = useMarkContours();
  const invalidate = useThree((s) => s.invalidate);
  const size = useThree((s) => s.size);
  const { worldPerPx } = fitMetrics(size.width, size.height, contours);

  const geometries = useMemo(
    () => contours.ribbons.map((ribbon) => ({ ribbon, geometry: buildRibbonGeometry(ribbon, contours, GEOMETRY) })),
    [contours],
  );
  useEffect(() => () => geometries.forEach(({ geometry }) => geometry.dispose()), [geometries]);

  const glow = useMemo(() => createGlowTexture(contours, GLOW.color, GLOW.softness), [contours]);
  useEffect(() => () => glow.texture.dispose(), [glow]);

  const sculpture = useRef<THREE.Group>(null);
  const glowMesh = useRef<THREE.Mesh>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const cursorLight = useRef<THREE.DirectionalLight>(null);
  const anim = useRef({
    time: 0,
    arrivalStart: 0,
    /** Raw pointer, -1..1 from the hero centre (y down). */
    pointer: new THREE.Vector2(),
    /** Spring-smoothed pointer; every cursor response derives from this. */
    smooth: new THREE.Vector2(),
    vx: { v: 0 },
    vy: { v: 0 },
  });

  useEffect(() => {
    onReady();
    invalidate();
  }, [onReady, invalidate]);

  // Wake the loop when motion conditions change.
  useEffect(() => {
    invalidate();
  }, [still, followCursor, paused, interaction, invalidate]);

  // Cursor anywhere on the page, measured from the hero's centre and
  // normalised by half the viewport, so far-left to far-right sweeps the full
  // envelope. Mouse only; touch never tilts.
  useEffect(() => {
    const state = anim.current;
    if (!followCursor || still) {
      state.pointer.set(0, 0);
      return;
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = anchor.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      state.pointer.set(
        THREE.MathUtils.clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1),
        THREE.MathUtils.clamp((e.clientY - cy) / (window.innerHeight / 2), -1, 1),
      );
      invalidate();
    };
    const reset = () => {
      state.pointer.set(0, 0);
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [followCursor, still, anchor, invalidate]);

  useFrame((_, rawDelta) => {
    const a = anim.current;
    const dt = Math.min(rawDelta, 1 / 20);
    a.time += dt;
    const t = a.time;

    const arrival = still ? 1 : easeOutQuart(THREE.MathUtils.clamp((t - a.arrivalStart) / ARRIVAL_SECONDS, 0, 1));
    const away = 1 - arrival;
    const idle = still ? 0 : arrival; // idle eases in as the arrival lands

    a.smooth.x = smoothDamp(a.smooth.x, a.pointer.x, a.vx, HERO_SMOOTH_TIME, dt);
    a.smooth.y = smoothDamp(a.smooth.y, a.pointer.y, a.vy, HERO_SMOOTH_TIME, dt);
    const sx = a.smooth.x;
    const sy = a.smooth.y;

    // Orientation: turn to face the cursor, plus slow drift, clamped to the
    // envelope. Screen y is down, so a cursor above tilts the top back.
    const maxYaw = deg(interaction.yawDeg);
    const maxPitch = deg(interaction.pitchDeg);
    const yaw = THREE.MathUtils.clamp(sx * maxYaw + idle * deg(IDLE_YAW) * Math.sin(t * 0.37), -maxYaw, maxYaw);
    const pitch = THREE.MathUtils.clamp(
      sy * maxPitch + idle * deg(IDLE_PITCH) * Math.sin(t * 0.29 + 1.1),
      -maxPitch,
      maxPitch,
    );

    // Parallax: the sculpture is the nearest layer, so it shifts slightly
    // against the viewpoint (cursor) rather than following it.
    const shiftX = -sx * interaction.parallaxXPx * worldPerPx;
    const shiftY = sy * interaction.parallaxYPx * worldPerPx;

    const g = sculpture.current;
    if (g) {
      g.rotation.set(pitch + away * deg(5), yaw + away * deg(-12), idle * deg(0.35) * Math.sin(t * 0.23 + 0.4));
      g.position.set(shiftX, shiftY - away * 0.16 + idle * 0.035 * Math.sin(t * 0.55), 0);
      g.scale.setScalar(THREE.MathUtils.lerp(0.94, 1, arrival));
    }

    // Glow sits deeper: it parallaxes less than the sculpture, so the halo
    // slides out on the side facing the cursor, and it brightens slightly
    // while the sculpture is turned.
    const reach = Math.min(1, Math.hypot(sx, sy));
    if (glowMesh.current) {
      glowMesh.current.position.set(shiftX * 0.35, shiftY * 0.35 - away * 0.16, -0.5);
      glowMesh.current.scale.setScalar(1 + reach * 0.05);
    }
    if (glowMaterial.current) glowMaterial.current.opacity = GLOW.strength * arrival * (1 + reach * 0.3);

    // A small key light that moves against the turn: as the sculpture faces
    // the cursor, the light slides to the opposite side, so bevel highlights
    // travel across the edges instead of staying put.
    const light = cursorLight.current;
    if (light) light.position.set(-sx * 4.5, 2.5 + sy * 3, 5);

    const settling =
      Math.abs(a.vx.v) > 1e-4 ||
      Math.abs(a.vy.v) > 1e-4 ||
      Math.abs(a.smooth.x - a.pointer.x) > 1e-4 ||
      Math.abs(a.smooth.y - a.pointer.y) > 1e-4;
    if (!paused && !still && (arrival < 1 || idle > 0 || settling)) invalidate();
  });

  return (
    <>
      <mesh ref={glowMesh} position={[0, 0, -0.5]} renderOrder={-1}>
        <planeGeometry args={[glow.worldWidth, glow.worldHeight]} />
        <meshBasicMaterial
          ref={glowMaterial}
          map={glow.texture}
          transparent
          opacity={still ? GLOW.strength : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <directionalLight ref={cursorLight} position={[0, 2.5, 5]} intensity={still ? 0.6 : 1.1} color="#ffffff" />
      <group ref={sculpture}>
        {geometries.map(({ ribbon, geometry }) => {
          const white = ribbon.id === "white-ribbon";
          return (
            <mesh key={ribbon.id} geometry={geometry}>
              {/* Satin base with a crisp clearcoat: as the sculpture turns,
                  the narrow studio strips slide across bevels and faces. */}
              <meshPhysicalMaterial
                color={ribbon.color}
                roughness={white ? 0.34 : 0.3}
                metalness={0.04}
                clearcoat={0.6}
                clearcoatRoughness={0.12}
                envMapIntensity={white ? 1.5 : 1.25}
                emissive={white ? "#ffffff" : ribbon.color}
                emissiveIntensity={white ? 0.2 : 0.2}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

/** Fits the mark to the same box the static fallback image uses. */
function CameraFit() {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const contours = useMarkContours();

  useEffect(() => {
    const { distance } = fitMetrics(size.width, size.height, contours);
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = FOV;
    camera.near = distance * 0.5;
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
      {/* World-fixed softboxes and narrow strips. The sculpture turns, the
          lights don't. At rest the faces reflect empty space (true colours);
          the strips sit ~20° off-axis, so turning sweeps them across the faces
          and bevels (a face turned by θ reflects at 2θ). */}
      <Environment resolution={lowPower ? 128 : 256} frames={1} environmentIntensity={0.95}>
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[-4, 4, 6]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[1.9, 0.4, 5]} scale={[0.32, 8, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#e4ecff" position={[-1.7, -0.3, 5]} scale={[0.26, 8, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 1.3, 5]} scale={[8, 0.22, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#dfe8ff" position={[6, -1, 4]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#3d7bff" position={[0, 3, -6]} scale={[10, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#2f6bff" position={[-5, -3, 2]} scale={[0.4, 5, 1]} />
      </Environment>
      <ambientLight intensity={0.08} color="#9fb6ff" />
      <directionalLight position={[-3, 4, 6]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[2, 3, -6]} intensity={1.2} color="#3d7bff" />
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color="#2f5fd0" />
    </>
  );
}

export default function HeroScene({ lowPower, ...props }: HeroSceneProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, lowPower ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      // Purely decorative: never captures pointer or touch, so page scrolling
      // and clicks pass straight through.
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Studio lowPower={lowPower} />
      <Suspense fallback={null}>
        <CameraFit />
        <Sculpture {...props} />
      </Suspense>
    </Canvas>
  );
}
