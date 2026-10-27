"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_CTA, NAV_LINKS } from "@/config/site";
import BrandLogo from "./BrandLogo";
import SiteLinkControl from "./SiteLinkControl";

const navLinkClass =
  "relative rounded-md px-3 py-2 text-[0.9375rem] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-[current=page]:text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";

const ctaClass =
  "inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/**
 * Site-wide header. Transparent over the hero, gains a quiet backdrop once the
 * page scrolls. Below lg it collapses into an accessible full-screen menu.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Menu open: lock page scroll, make the page behind inert, move focus into
  // the menu, close on Escape or when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    main?.setAttribute("inert", "");
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktop = () => desktop.matches && close(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      main?.removeAttribute("inert");
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open, close]);

  // While the menu is open the header must not use backdrop-filter: it would
  // become the containing block for the fixed menu panel and collapse it.
  const surface = open
    ? "border-b border-hairline bg-[#080d17]"
    : scrolled
      ? "border-b border-hairline bg-[#080d17]/80 backdrop-blur-md"
      : "border-b border-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${surface}`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1440px] items-center justify-between px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12">
        <BrandLogo onNavigate={() => open && close(false)} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <SiteLinkControl link={link} className={navLinkClass} current={link.href === "/"} />
              </li>
            ))}
          </ul>
          <div className="ml-4">
            <SiteLinkControl link={NAV_CTA} className={ctaClass} />
          </div>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? close() : setOpen(true))}
        >
          <span aria-hidden className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile / tablet menu */}
      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(var(--header-height)+env(safe-area-inset-top))] overflow-y-auto bg-[#080d17] lg:hidden"
      >
        <nav
          aria-label="Main"
          className="flex min-h-full flex-col px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-8"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="border-b border-hairline">
                <SiteLinkControl
                  link={link}
                  current={link.href === "/"}
                  onNavigate={() => close(false)}
                  className="flex w-full items-center py-4 text-left text-[1.75rem] font-medium tracking-[-0.02em] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-[current=page]:text-foreground"
                />
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <SiteLinkControl
              link={NAV_CTA}
              bubblePlacement="above"
              className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
