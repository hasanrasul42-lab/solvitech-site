# SOLVITECH — 3D LOGO LAB / TASK 01

Act as a senior React/Three.js developer and visual engineer. Build only a local proof of concept for the existing Solvitech logo. **Do not build the full website yet.**

## Inputs
- `public/brand/solvitech-mark.svg`: raster-traced, approximate vector extracted from the client's **original** logo image; two separate closed SVG paths, `white-ribbon` and `blue-ribbon`.
- `public/brand/original-reference.png`: source image against which fidelity must be judged.
- `public/brand/solvitech-mark-transparent.png`: helpful flat shape reference.

If the project is not yet set up, use Next.js App Router, React, TypeScript and Tailwind. Use React Three Fiber 9 with React 19, `three` and `@react-three/drei` compatible with the project's actual versions. Do not use experimental alpha packages. If the scaffold already exists, inspect dependencies before installing.

## Build
1. Make a route `/3d-lab`, with a client-side R3F Canvas embedded in the page and without affecting other routes.
2. Parse the provided SVG with Three.js `SVGLoader`; preserve the white/blue contours separately and generate shapes for `ExtrudeGeometry`. Use appropriate TypeScript. Avoid hardcoding a hand-invented letter S or unrelated procedural sculpture.
3. Orient SVG paths correctly (SVG Y points down, Three.js Y up) and center the combined mark using its bounding box, not by arbitrary offsets. Keep consistent size and aspect ratio.
4. Extrude each silhouette with **shallow adjustable thickness** and **small adjustable bevels**. Assign a neutral off-white satin material to the upper mark and a vivid blue satin material to the lower mark. Keep the **front face** recognisably like the supplied artwork. Use modest roughness and restrained metallic response. No glass, chrome, particle effects, or fake neon.
5. Set up orthographic or long-focal-length camera at a near-front angle initially, 1–2 large soft studio lights, subtle blue rim light, and near-black navy background (#080D17).
6. Show the actual SVG and reference image on the page beside/below the 3D view for direct comparison. Include a reset-to-front-view button. Desktop and mobile layouts must both work.
7. Add simple dev controls for **depth, bevel and horizontal/vertical viewing angle**. These are for evaluation only. NO idle spin, magnetic hover, scroll choreography, or continuous pointer animation yet.
8. On render failure, show a static logo fallback, not a blank canvas. Respect reduced-motion user settings (even though there is no animation yet).

## Acceptance tests
- Head-on view matches original white and blue silhouettes (subject to the raster-trace approximation); no reversed, flipped, or merged shape.
- Both ribbons are separately editable meshes/materials.
- Side faces reveal genuine physical thickness when tilted.
- Smooth borders, no obvious contour wobble, z-fighting, broken shadows, stretched logo or unwanted outlines.
- Page works after refresh and in production build (`npm run build`).
- No unnecessary packages, animations, animations libraries, postprocessing stacks or unrelated features.

## Required response when done
List changed files, explain the geometry/camera/material approach, what you verified, what remains uncertain, and what exact local URL to open. Do not claim to have visually inspected the scene unless you actually did. Ask for a screenshot of front and angled views for design review.
