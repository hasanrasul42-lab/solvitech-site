"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { MARK_WORLD_HEIGHT, buildRibbonGeometry, type MarkContours } from "@/components/mark/markGeometry";
import { useLoadedMarkContours } from "@/components/mark/useMarkContours";
import { smoothDamp } from "@/components/mark/motion";

/**
 * The About backdrop's 3D scene (loaded on demand by AboutMark.tsx, so
 * three.js never ships in the initial page bundle): the official Solvitech mark (same ribbon
 * geometry as the hero, built from /brand/solvitech-mark.svg) rendered as
 * an outline in the background (edges only, the faces barely there),
 * turning towards the cursor.
 *
 * Separate from the hero scene, which is not touched. Cost is kept low:
 * - the canvas mounts only once About comes near the viewport;
 * - frames render on demand, only while the mark is settling after a cursor
 *   move, and never while About is off-screen (no idle animation);
 * - touch and reduced motion get a still, angled pose;
 * - no WebGL, or a render error: the flat mark image, very faint.
 */

const GEOMETRY = { depth: 0.3, bevel: 0.02, bevelSegments: 2, smoothing: true };
const FOV = 26;
/** Resting pose, so the mark reads as an object even without a cursor. */
const REST = { yaw: -22, pitch: 7 };
/** How far it turns towards the cursor. */
const RANGE = { yaw: 26, pitch: 16 };
const SMOOTH = 0.45;
const deg = THREE.MathUtils.degToRad;

function Mark({ contours, live, anchor }: { contours: MarkContours; live: boolean; anchor: RefObject<HTMLElement | null> }) {
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<THREE.Group>(null);
  const state = useRef({
    pointer: new THREE.Vector2(),
    smooth: new THREE.Vector2(),
    vx: { v: 0 },
    vy: { v: 0 },
    /** Latest raw cursor; converted (one layout read) on the next frame. */
    cx: 0,
    cy: 0,
    pending: false,
  });

  const parts = useMemo(
    () =>
      contours.ribbons.map((ribbon) => {
        const geometry = buildRibbonGeometry(ribbon, contours, GEOMETRY);
        return { ribbon, geometry, edges: new THREE.EdgesGeometry(geometry, 30) };
      }),
    [contours],
  );
  useEffect(
    () => () =>
      parts.forEach((p) => {
        p.geometry.dispose();
        p.edges.dispose();
      }),
    [parts],
  );

  // Cursor anywhere on the page, measured from the mark's own centre.
  useEffect(() => {
    const s = state.current;
    if (!live) {
      s.pointer.set(0, 0);
      invalidate();
      return;
    }
    // Store the raw position only; the frame measures once. Reading layout in
    // the event handler would force a layout on every move while scrolling.
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      s.cx = e.clientX;
      s.cy = e.clientY;
      s.pending = true;
      invalidate();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [live, anchor, invalidate]);

  useFrame((_, raw) => {
    const s = state.current;
    if (s.pending) {
      s.pending = false;
      const r = anchor.current?.getBoundingClientRect();
      if (r) {
        s.pointer.set(
          THREE.MathUtils.clamp((s.cx - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1),
          THREE.MathUtils.clamp((s.cy - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1),
        );
      }
    }
    const dt = Math.min(raw, 1 / 20);
    s.smooth.x = smoothDamp(s.smooth.x, s.pointer.x, s.vx, SMOOTH, dt);
    s.smooth.y = smoothDamp(s.smooth.y, s.pointer.y, s.vy, SMOOTH, dt);
    const g = group.current;
    if (g) {
      g.rotation.set(deg(REST.pitch) + s.smooth.y * deg(RANGE.pitch), deg(REST.yaw) + s.smooth.x * deg(RANGE.yaw), 0);
    }
    const settling =
      Math.abs(s.vx.v) + Math.abs(s.vy.v) > 1e-4 || Math.abs(s.smooth.x - s.pointer.x) + Math.abs(s.smooth.y - s.pointer.y) > 1e-4;
    if (live && settling) invalidate();
  });

  return (
    <group ref={group}>
      {parts.map(({ ribbon, geometry, edges }) => {
        const white = ribbon.id === "white-ribbon";
        return (
          <group key={ribbon.id}>
            {/* A barely-there glass body: only its clearcoat glints read. */}
            <mesh geometry={geometry} renderOrder={1}>
              <meshPhysicalMaterial
                color={ribbon.color}
                transparent
                opacity={white ? 0.025 : 0.055}
                roughness={0.12}
                metalness={0.05}
                clearcoat={1}
                clearcoatRoughness={0.08}
                envMapIntensity={0.9}
                emissive={ribbon.color}
                emissiveIntensity={0}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* The outline: front and back silhouettes and their corners. */}
            <lineSegments geometry={edges} renderOrder={2}>
              <lineBasicMaterial color={white ? "#cfdcff" : "#6ea0ff"} transparent opacity={white ? 0.42 : 0.62} depthWrite={false} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}

function CameraFit({ contours }: { contours: MarkContours }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const bounds = contours.bounds.getSize(new THREE.Vector2());
    const aspect = bounds.x / bounds.y;
    // The mark fills ~78% of the height, or of the width if that is tighter.
    const fill = Math.min(0.78, (0.78 * size.width) / (size.height * aspect));
    const visible = MARK_WORLD_HEIGHT / fill;
    const distance = visible / 2 / Math.tan(deg(FOV / 2));
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.fov = FOV;
    camera.near = distance * 0.4;
    camera.far = distance * 2.5;
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    invalidate();
  }, [get, size.width, size.height, contours, invalidate]);
  return null;
}

/** The canvas. Renders nothing until the brand contours have loaded. */
export default function AboutMarkScene({ live, anchor }: { live: boolean; anchor: RefObject<HTMLElement | null> }) {
  const contours = useLoadedMarkContours();
  if (!contours) return null;
  return (
    <Canvas
      frameloop="demand"
      // A faint background outline: a lower pixel ratio is invisible here and
      // keeps each frame cheap.
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      style={{ pointerEvents: "none" }}
    >
      <Environment resolution={128} frames={1} environmentIntensity={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[-4, 4, 6]} scale={[7, 4, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[2, 0.4, 5]} scale={[0.35, 8, 1]} />
        <Lightformer form="rect" intensity={2} color="#3d7bff" position={[0, 3, -6]} scale={[10, 1.5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#2f6bff" position={[-5, -3, 2]} scale={[0.4, 5, 1]} />
      </Environment>
      <ambientLight intensity={0.2} color="#9fb6ff" />
      <directionalLight position={[-3, 4, 6]} intensity={1} />
      <directionalLight position={[2, 3, -6]} intensity={1.2} color="#3d7bff" />
      <CameraFit contours={contours} />
      <Mark contours={contours} live={live} anchor={anchor} />
    </Canvas>
  );
}
