import Stage, { Layer } from "@/components/home/directory/Stage";
import { Tick, round, turn } from "./parts";

/**
 * Websites visuals (homepage stage system), each its own composition:
 *   hero    exploded page   a page's sections lifting out of the browser frame
 *   signs   dated site      an old page, a slow-load gauge and a broken phone view
 *   focus   fan of phones   arrive, decide, act, follow through, held like cards
 *   builds  component cloud the parts of a good site floating round a page outline
 *   close   blueprint       a new site drawn on a grid behind its address bar
 * Sample content is fictional.
 */

const ACC = "acc-websites";

export function WebsiteHero() {
  return (
    <Stage label="Illustration: a website's sections lifting out of the browser frame: navigation, a headline, three service cards, an enquiry form and a footer." rest={[10, -14]} className={ACC}>
      <Layer x={2} y={1} w={52} h={39} slab faceClassName="![background:transparent] !border-white/15">
        <div className="flex h-[2.4em] items-center gap-[0.4em] border-b border-white/10 px-[1em]">
          <span className="h-[0.5em] w-[0.5em] rounded-full bg-white/15" />
          <span className="h-[0.5em] w-[0.5em] rounded-full bg-white/15" />
          <span className="ml-[1em] h-[1.3em] flex-1 rounded-full bg-white/[0.05]" />
        </div>
      </Layer>
      <Layer x={4} y={4} w={48} h={3.6} z={3} lift={1} slab style={round(0.6)}>
        <div className="flex h-full items-center justify-between px-[1em] text-[0.75em] text-white/60">
          <span className="font-semibold text-white/85">Dental Practice</span>
          <span className="flex gap-[1.2em]">
            <span>Treatments</span>
            <span>Prices</span>
            <span>Contact</span>
          </span>
        </div>
      </Layer>
      <Layer x={4} y={9} w={30} h={12} z={6} lift={2} slab>
        <div className="p-[1.1em]">
          <p className="text-[1.5em] font-semibold leading-tight text-white">Book a check-up online</p>
          <span className="mt-[0.8em] inline-block rounded-full px-[0.9em] py-[0.3em] text-[0.8em] font-medium text-white acc-bg">Book now</span>
        </div>
      </Layer>
      {["Check-ups", "Hygiene", "Whitening"].map((c, i) => (
        <Layer key={c} x={4 + i * 10.2} y={23} w={9.4} h={8} z={4 + i} lift={1.5} slab style={round(0.6)}>
          <p className="p-[0.7em] text-[0.75em] text-white/75">{c}</p>
        </Layer>
      ))}
      <Layer x={36} y={9} w={20} h={22} z={11} lift={4} slab faceClassName="is-light" className="s3d-key">
        <div className="p-[1em] text-[0.8em] text-[#1f2633]">
          <p className="text-[1.1em] font-semibold">Choose a time</p>
          <div className="mt-[0.6em] grid grid-cols-3 gap-[0.3em]">
            {["Mon", "Tue", "Wed"].map((d, i) => (
              <span key={d} className={`rounded-[0.3em] py-[0.3em] text-center ${i === 1 ? "bg-[#1f2633] text-white" : "bg-black/[0.06]"}`}>
                {d}
              </span>
            ))}
          </div>
          {["09:30", "11:00", "14:15"].map((t, i) => (
            <p key={t} className={`mt-[0.4em] rounded-[0.3em] border px-[0.5em] py-[0.3em] ${i === 1 ? "st-hit border-black/20" : "border-black/10 text-black/55"}`}>
              {t}
            </p>
          ))}
        </div>
      </Layer>
      <Layer x={4} y={33} w={48} h={4} z={2} slab style={round(0.6)}>
        <p className="flex h-full items-center px-[1em] text-[0.7em] text-white/40">© Dental Practice · Privacy · Accessibility</p>
      </Layer>
    </Stage>
  );
}

export function WebsiteSigns() {
  return (
    <Stage label="Illustration: a dated website with cluttered text and a tiny contact link, a gauge showing slow loading, and the same page breaking on a phone." rest={[12, 12]} className={ACC}>
      <Layer x={2} y={3} w={36} h={32} slab faceClassName="![background:#e9e4d8] !border-[#d8d0bd]" style={turn(-2)}>
        <div className="p-[1.1em] font-serif text-[#4a4433]">
          <p className="text-center text-[1.4em] font-bold tracking-wide">WELCOME TO OUR WEBSITE!!</p>
          <p className="mt-[0.5em] text-center text-[0.7em] text-[#2b56c6] underline">Click here to enter</p>
          <div className="mt-[1em] grid gap-[0.45em]">
            {["95%", "88%", "92%", "80%", "90%", "70%"].map((w, i) => (
              <span key={i} className="block h-[0.4em] rounded-full bg-black/15" style={{ width: w }} />
            ))}
          </div>
          <p className="mt-[1.2em] text-[0.55em] text-[#2b56c6] underline">contact us</p>
        </div>
      </Layer>
      <Layer x={36} y={2} w={18} h={13} z={7} lift={3} slab className="s3d-key">
        <div className="flex h-full flex-col items-center justify-center">
          <svg viewBox="0 0 40 22" className="w-[70%]" fill="none" strokeWidth="3" strokeLinecap="round">
            <path d="M4 20a16 16 0 0 1 32 0" stroke="rgb(255 255 255 / 0.12)" />
            <path d="M4 20a16 16 0 0 1 6-12.5" stroke="#e0a24a" />
            <path d="M20 20 9 11" stroke="#fff" strokeWidth="1.6" />
          </svg>
          <p className="mt-[0.4em] text-[0.8em] text-white/70">Slow to load on mobile</p>
        </div>
      </Layer>
      <Layer x={42} y={17} w={13} h={23} z={11} lift={4} slab style={round(1.8)} faceClassName="![background:#070b14]">
        <div className="relative h-full overflow-hidden p-[0.8em] pt-[1.2em]">
          <div className="w-[160%] rounded-[0.3em] bg-[#e9e4d8] p-[0.5em] font-serif text-[0.6em] font-bold text-[#4a4433]">WELCOME TO OUR WEB…</div>
          <div className="mt-[0.5em] w-[140%] space-y-[0.4em]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-[0.35em] rounded-full bg-white/15" />
            ))}
          </div>
        </div>
      </Layer>
    </Stage>
  );
}

export function WebsiteFocus() {
  const screens = [
    { step: "Arrive", body: <p className="text-[1.05em] font-semibold leading-tight text-white">Dental care for the whole family</p> },
    { step: "Decide", body: <div className="grid gap-[0.35em] text-[0.8em] text-white/65"><span>Check-up · from 45 mins</span><span>Hygiene · 30 mins</span><span>Prices listed</span></div> },
    {
      step: "Act",
      body: (
        <div className="grid gap-[0.35em] text-[0.8em]">
          <span className="rounded-[0.3em] border border-white/15 px-[0.4em] py-[0.25em] text-white/60">Name</span>
          <span className="rounded-[0.3em] border border-white/15 px-[0.4em] py-[0.25em] text-white/60">Tue 11:00</span>
          <span className="rounded-full py-[0.25em] text-center font-medium text-white acc-bg">Request booking</span>
        </div>
      ),
    },
    { step: "Follow through", body: <div className="text-[0.85em] text-white/80"><Tick dark="#120f2a" /><p className="mt-[0.4em]">Request received. Confirmation sent by email.</p></div> },
  ];
  return (
    <Stage label="Illustration: four phone screens fanned like playing cards: arrive, decide, act and follow through." rest={[10, 6]} className={ACC}>
      {screens.map((s, i) => (
        <Layer
          key={s.step}
          x={4 + i * 12.5}
          y={5 + Math.abs(1.5 - i) * 1.6}
          w={15}
          h={30}
          z={i * 3}
          lift={i === 3 ? 4 : i}
          slab
          className={i === 3 ? "s3d-key" : ""}
          style={{ ...turn((i - 1.5) * 7), ...round(1.8) }}
          faceClassName="![background:#070b14]"
        >
          <div className="flex h-full flex-col p-[1em] pt-[1.4em]">
            <span className="mx-auto mb-[1em] block h-[0.5em] w-[3.5em] rounded-full bg-white/10" />
            <p className="text-[0.72em] font-semibold uppercase tracking-[0.14em] acc-text">
              0{i + 1} {s.step}
            </p>
            <div className="mt-[0.8em]">{s.body}</div>
          </div>
        </Layer>
      ))}
    </Stage>
  );
}

export function WebsiteBuilds() {
  return (
    <Stage label="Illustration: the parts of a website floating around a page outline: a booking calendar, a basket, a content editor, a login, an accessibility check and a fast-loading indicator." rest={[12, -10]} className={ACC}>
      <Layer x={16} y={5} w={28} h={32} z={0}>
        <div className="absolute inset-0 rounded-[1.2em] border-[0.15em] border-dashed border-white/15" />
        <p className="absolute inset-x-0 top-[45%] text-center text-[0.85em] uppercase tracking-[0.18em] text-white/30">Your site</p>
      </Layer>
      <Layer x={2} y={3} w={16} h={11} z={6} lift={3} slab>
        <div className="p-[0.9em] text-[0.75em]">
          <p className="font-semibold text-white/85">Booking</p>
          <div className="mt-[0.4em] grid grid-cols-5 gap-[0.2em]">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`h-[1.1em] rounded-[0.2em] ${i === 6 ? "acc-bg" : "bg-white/[0.08]"}`} />
            ))}
          </div>
        </div>
      </Layer>
      <Layer x={42} y={2} w={16} h={10} z={8} lift={3} slab faceClassName="is-light">
        <div className="p-[0.9em] text-[0.75em] text-[#1f2633]">
          <p className="font-semibold">Basket · 2 items</p>
          <p className="mt-[0.3em] flex justify-between text-black/55">
            <span>Subtotal</span>
            <span>£46.00</span>
          </p>
          <span className="mt-[0.4em] block rounded-full bg-[#1f2633] py-[0.2em] text-center text-white">Checkout</span>
        </div>
      </Layer>
      <Layer x={1} y={18} w={17} h={9} z={10} lift={4} slab className="s3d-key">
        <div className="p-[0.9em] text-[0.75em]">
          <p className="flex gap-[0.5em] text-white/50">
            <b className="text-white/85">B</b> <i>I</i> <span>Link</span> <span>Image</span>
          </p>
          <p className="mt-[0.5em] text-white/80">Edit this page…</p>
        </div>
      </Layer>
      <Layer x={43} y={16} w={15} h={11} z={5} lift={2} slab>
        <div className="grid gap-[0.35em] p-[0.9em] text-[0.72em]">
          <p className="font-semibold text-white/85">Sign in</p>
          <span className="rounded-[0.3em] border border-white/15 px-[0.4em] py-[0.2em] text-white/45">Email</span>
          <span className="rounded-[0.3em] border border-white/15 px-[0.4em] py-[0.2em] text-white/45">Password</span>
        </div>
      </Layer>
      <Layer x={4} y={31} w={17} h={5} z={7} lift={3} slab style={round(2.5)}>
        <p className="flex h-full items-center gap-[0.5em] px-[1em] text-[0.8em] text-white/80">
          <Tick dark="#120f2a" /> Accessible
        </p>
      </Layer>
      <Layer x={40} y={31} w={17} h={5} z={9} lift={3} slab style={round(2.5)}>
        <p className="flex h-full items-center gap-[0.5em] px-[1em] text-[0.8em] text-white/80">
          <Tick dark="#120f2a" /> Fast on mobile
        </p>
      </Layer>
    </Stage>
  );
}

export function WebsiteClose() {
  return (
    <Stage label="Illustration: a new website being drawn on a blueprint grid, behind a browser address bar." rest={[10, 12]} className={ACC}>
      <Layer x={4} y={6} w={44} h={32} z={0} slab faceClassName="!bg-[linear-gradient(rgb(150_140_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(150_140_255/0.12)_1px,transparent_1px)] ![background-size:2em_2em] ![background-color:#0c1124]">
        <svg viewBox="0 0 44 32" className="absolute inset-0 h-full w-full" fill="none" stroke="rgb(190 185 255 / 0.55)" strokeWidth="0.2">
          <rect x="3" y="4" width="38" height="3" rx="0.5" />
          <rect x="3" y="10" width="22" height="9" rx="0.5" />
          <rect x="27" y="10" width="14" height="9" rx="0.5" />
          <rect x="3" y="22" width="11.5" height="6" rx="0.5" />
          <rect x="16.3" y="22" width="11.5" height="6" rx="0.5" />
          <rect x="29.5" y="22" width="11.5" height="6" rx="0.5" />
        </svg>
      </Layer>
      <Layer x={14} y={2} w={42} h={5.4} z={8} lift={3} slab className="s3d-key" style={round(2.7)}>
        <div className="flex h-full items-center gap-[0.7em] px-[1.2em] text-[1em]">
          <svg viewBox="0 0 24 24" className="h-[1.1em] w-[1.1em] text-white/50" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          <span className="text-white/85">yourbusiness.co.uk</span>
          <span className="ml-auto text-[0.8em] acc-text">Coming together</span>
        </div>
      </Layer>
    </Stage>
  );
}
