import * as THREE from "three";

/**
 * One shared material language for every module.
 * Blue (#3478F6) is only ever emissive, i.e. functional illumination.
 */
export const BLUE = new THREE.Color("#3478F6");

export function createMaterials() {
  const anodised = new THREE.MeshPhysicalMaterial({
    color: "#4a5566",
    metalness: 0.72,
    roughness: 0.4,
    clearcoat: 0.18,
    clearcoatRoughness: 0.55,
  });
  const anodisedDeep = new THREE.MeshPhysicalMaterial({
    color: "#2a323e",
    metalness: 0.7,
    roughness: 0.46,
    clearcoat: 0.12,
    clearcoatRoughness: 0.6,
  });
  const silver = new THREE.MeshStandardMaterial({
    color: "#d4d9e0",
    metalness: 0.95,
    roughness: 0.26,
    envMapIntensity: 1.8,
  });
  const ceramic = new THREE.MeshPhysicalMaterial({
    color: "#efefed",
    metalness: 0,
    roughness: 0.5,
    clearcoat: 0.08,
    clearcoatRoughness: 0.7,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#c9d3e2",
    metalness: 0,
    roughness: 0.3,
    transmission: 1,
    thickness: 0.18,
    ior: 1.46,
    attenuationColor: new THREE.Color("#6f7f99"),
    attenuationDistance: 0.9,
    specularIntensity: 0.6,
  });
  /** Unlit-looking recessed channel that a glow strip sits in. */
  const groove = new THREE.MeshStandardMaterial({ color: "#0b1018", metalness: 0.4, roughness: 0.7 });
  const all = [anodised, anodisedDeep, silver, ceramic, glass, groove];
  return { anodised, anodisedDeep, silver, ceramic, glass, groove, dispose: () => all.forEach((m) => m.dispose()) };
}
export type Materials = ReturnType<typeof createMaterials>;

/** A dark lens that emits the functional blue at a controllable intensity. */
export function createGlow(base = 0) {
  return new THREE.MeshStandardMaterial({
    color: "#0c1424",
    metalness: 0.2,
    roughness: 0.45,
    emissive: BLUE,
    emissiveIntensity: base,
  });
}
