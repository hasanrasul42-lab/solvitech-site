"use client";

import { useState, type CSSProperties } from "react";
import Stage, { Layer } from "./Stage";

/**
 * Websites & E-commerce: an original, clearly illustrative online store for a
 * fictional ceramics brand ("Northfold"), shown as a desktop browser and a
 * phone. A small toggle brings either presentation forward. Labelled as an
 * illustrative concept, never as client work.
 *
 * Products are drawn with CSS (no images, no stock assets).
 */

type Tone = "clay" | "sage" | "sand" | "ink";
const TONES: Record<Tone, [string, string]> = {
  clay: ["#d99a78", "#a9603f"],
  sage: ["#b8c4ad", "#7d8f72"],
  sand: ["#efe2cf", "#c6ad8c"],
  ink: ["#5d6470", "#2f343c"],
};

/** A vessel: body + neck, lit from the upper left. Sized in em by the caller. */
function Vessel({ tone, shape, style }: { tone: Tone; shape: "jug" | "vase" | "bowl"; style?: CSSProperties }) {
  const [light, dark] = TONES[tone];
  const body = `radial-gradient(120% 90% at 30% 25%, ${light}, ${dark} 78%)`;
  if (shape === "bowl") {
    return (
      <div className="relative" style={{ width: "1em", height: "0.5em", ...style }}>
        <div className="absolute inset-x-0 top-0 h-[0.12em] rounded-[50%] bg-black/25" />
        <div className="absolute inset-0 rounded-b-[50%_100%] rounded-t-[0.04em]" style={{ background: body }} />
      </div>
    );
  }
  const neck = shape === "jug" ? { w: 0.42, h: 0.3 } : { w: 0.26, h: 0.42 };
  return (
    <div className="relative" style={{ width: "1em", height: "1.45em", ...style }}>
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 rounded-t-[0.06em]"
        style={{ width: `${neck.w}em`, height: `${neck.h + 0.1}em`, background: `linear-gradient(90deg, ${light}, ${dark})` }}
      />
      <div className="absolute inset-x-0 bottom-0 rounded-[45%_45%_42%_42%/50%_50%_48%_48%]" style={{ top: `${neck.h}em`, background: body }} />
    </div>
  );
}

const PRODUCTS: { name: string; price: string; tone: Tone; shape: "jug" | "vase" | "bowl" }[] = [
  { name: "Tide jug", price: "£42", tone: "clay", shape: "jug" },
  { name: "Moor vase", price: "£38", tone: "sage", shape: "vase" },
  { name: "Harbour bowl", price: "£26", tone: "ink", shape: "bowl" },
];

const serif = { fontFamily: "Georgia, 'Times New Roman', serif" };

export default function WebsiteVisual({ label }: { label: string }) {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");
  return (
    <div>
      <Stage label={label} rest={[6, -11]} className="acc-websites" view={view}>
        {/* Desktop browser */}
        <Layer x={0.5} y={2} w={45} h={32} slab className="ws-desktop" faceClassName="![background:#f3ede5]">
          <div className="flex h-[2.6em] items-center gap-[0.45em] bg-[#1a1f29] px-[1em]">
            <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/20" />
            <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/20" />
            <span className="h-[0.55em] w-[0.55em] rounded-full bg-white/20" />
            <span className="mx-auto rounded-full bg-white/[0.08] px-[2.5em] py-[0.15em] text-[0.82em] text-white/55">northfold.example</span>
          </div>
          <div className="px-[2em] text-[#2b2723]">
            <div className="flex h-[3.6em] items-center text-[0.95em]">
              <span className="font-semibold tracking-[0.32em]">NORTHFOLD</span>
              <span className="ml-auto flex gap-[1.6em] text-[#2b2723]/70">
                <span>Shop</span>
                <span>Studio</span>
                <span>Journal</span>
                <span className="text-[#2b2723]">Basket (2)</span>
              </span>
            </div>
            <div className="grid grid-cols-[1fr_17em] gap-[1.6em]">
              <div className="pt-[1.6em]">
                <p className="text-[0.8em] uppercase tracking-[0.22em] text-[#a9603f]">New season</p>
                <p className="mt-[0.5em] text-[2.55em] leading-[1.06] tracking-[-0.01em]" style={serif}>
                  Handmade stoneware for everyday tables
                </p>
                <p className="mt-[0.7em] max-w-[19em] text-[0.95em] leading-[1.5] text-[#2b2723]/65">
                  Thrown, glazed and fired in small batches, made to be used every day.
                </p>
                <span className="mt-[1.1em] inline-block rounded-full bg-[#2b2723] px-[1.3em] py-[0.55em] text-[0.9em] font-medium text-[#f3ede5]">
                  Shop the collection
                </span>
              </div>
              <div className="relative h-[14.5em] overflow-hidden rounded-[0.8em] bg-[linear-gradient(160deg,#e7dccd,#d8c6b0)]">
                <div className="absolute inset-x-0 bottom-0 h-[3.4em] bg-[#cbb69c]" />
                <div className="absolute bottom-[2.6em] left-[2.4em]">
                  <Vessel tone="sand" shape="vase" style={{ fontSize: "6.4em" }} />
                </div>
                <div className="absolute bottom-[2.4em] left-[8.2em]">
                  <Vessel tone="clay" shape="jug" style={{ fontSize: "5.2em" }} />
                </div>
                <div className="absolute bottom-[2.4em] left-[12.4em]">
                  <Vessel tone="ink" shape="bowl" style={{ fontSize: "3.6em" }} />
                </div>
              </div>
            </div>
            <div className="mt-[1.6em] grid grid-cols-3 gap-[1em]">
              {PRODUCTS.map((p) => (
                <div key={p.name}>
                  <div className="relative grid h-[4.6em] place-items-center rounded-[0.6em] bg-[#e6dccf]">
                    <Vessel tone={p.tone} shape={p.shape} style={{ fontSize: p.shape === "bowl" ? "2.6em" : "2.2em" }} />
                  </div>
                  <div className="mt-[0.45em] flex justify-between text-[0.88em]">
                    <span>{p.name}</span>
                    <span className="text-[#2b2723]/60">{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Layer>

        {/* Phone */}
        <Layer
          x={42.5}
          y={8.5}
          w={15}
          h={30.5}
          z={7}
          lift={2}
          slab
          className="ws-phone s3d-key"
          faceClassName="![background:#11151c] !p-[0.55em]"
          style={{ ["--r" as string]: "2.3em" }}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-[1.8em] bg-[#f3ede5] text-[#2b2723]">
            <div className="flex h-[2.2em] items-center justify-between px-[1.2em] text-[0.7em] font-medium">
              <span>9:41</span>
              <span className="h-[0.9em] w-[3.6em] rounded-full bg-[#11151c]" />
              <span>●●●</span>
            </div>
            <div className="flex items-center justify-between px-[0.9em] py-[0.4em] text-[0.72em]">
              <span className="font-semibold tracking-[0.28em]">NORTHFOLD</span>
              <span>☰</span>
            </div>
            <div className="relative mx-[0.7em] grid h-[11em] place-items-center rounded-[0.8em] bg-[linear-gradient(160deg,#e7dccd,#d8c6b0)]">
              <Vessel tone="clay" shape="jug" style={{ fontSize: "5.6em" }} />
            </div>
            <div className="flex justify-center gap-[0.3em] py-[0.6em]">
              <span className="h-[0.35em] w-[1em] rounded-full bg-[#2b2723]" />
              <span className="h-[0.35em] w-[0.35em] rounded-full bg-[#2b2723]/25" />
              <span className="h-[0.35em] w-[0.35em] rounded-full bg-[#2b2723]/25" />
            </div>
            <div className="px-[0.9em]">
              <p className="text-[1.35em]" style={serif}>
                Tide jug
              </p>
              <p className="text-[0.85em] text-[#2b2723]/60">Stoneware · speckled clay glaze</p>
              <p className="mt-[0.3em] text-[1.05em] font-semibold">£42</p>
            </div>
            <span className="mx-[0.9em] mb-[1em] mt-auto block rounded-full bg-[#2b2723] py-[0.65em] text-center text-[0.85em] font-medium text-[#f3ede5]">
              Add to basket
            </span>
          </div>
        </Layer>

        {/* Confirmation, nearest the viewer. */}
        <Layer x={24} y={35.5} w={17} h={4.3} z={11} lift={2.5} slab className="ws-chip" style={{ ["--r" as string]: "2.2em" }}>
          <div className="flex h-full items-center gap-[0.6em] px-[1.1em] text-[0.95em] text-white/80">
            <span className="grid h-[1.4em] w-[1.4em] place-items-center rounded-full text-[0.8em] text-white acc-bg">✓</span>
            Added to basket
          </div>
        </Layer>
      </Stage>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-[max(1.25rem,env(safe-area-inset-left))] sm:px-0">
        <p className="text-[0.8125rem] text-subtle">Illustrative concept, not client work.</p>
        <div role="group" aria-label="Preview the concept on" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
          {(["desktop", "mobile"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className="min-h-9 rounded-full px-4 text-[0.8125rem] font-medium capitalize text-muted transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft aria-pressed:bg-white/[0.1] aria-pressed:text-foreground"
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
