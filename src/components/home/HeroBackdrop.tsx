import { Field, Glow } from "@/components/field/Field";
import HeroFlow from "./HeroFlow";

/**
 * The hero's interactive background, placed behind the approved hero (which is
 * not modified): a light plane that leans with the pointer, and the directional
 * flow around the mark drawn on its own canvas (HeroFlow), which draws in after
 * the System Activation intro and responds to the cursor trail.
 */
export default function HeroBackdrop() {
  return (
    <>
      <Field rest={["70%", "50%"]} className="hero-flow bottom-auto h-[max(40rem,100svh)]">
        <Glow x="70%" y="50%" w="58rem" h="44rem" alpha={0.07} follow={46} />
      </Field>
      <HeroFlow className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[max(40rem,100svh)] w-full" />
    </>
  );
}
