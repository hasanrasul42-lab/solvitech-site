"use client";

import { useCallback, useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_CTA, NAV_LINKS, NAV_SOLUTIONS, SOLUTIONS_HUB } from "@/config/site";
import BrandLogo from "./BrandLogo";
import SiteLinkControl from "./SiteLinkControl";

const navLinkClass =
  "relative rounded-md px-3 py-2 text-[0.9375rem] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-[current=page]:text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100";

const ctaClass =
  "inline-flex items-center rounded-full bg-foreground px-4 py-2 text-[0.9375rem] font-medium text-background transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

/**
 * Site-wide header. Transparent over the hero, gains a quiet backdrop once the
 * page scrolls. Solutions opens a panel listing all six dedicated service
 * pages (disclosure pattern: a button with aria-expanded; Escape, outside
 * click and leaving the panel close it). Below lg everything collapses into
 * an accessible full-screen menu, where Solutions expands in place.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  // A page link is current on its own page and below it; homepage anchors never are.
  const isCurrent = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
  const inSolutions = pathname === "/solutions" || pathname.startsWith("/solutions/");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false);
  const [mobileSol, setMobileSol] = useState(false);
  const menuId = useId();
  const solId = useId();
  const mobileSolId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const solBtnRef = useRef<HTMLButtonElement>(null);
  const solWrapRef = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  // Desktop Solutions panel: Escape returns focus to its button; a click
  // outside closes it.
  useEffect(() => {
    if (!solOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSolOpen(false);
        solBtnRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!solWrapRef.current?.contains(e.target as Node)) setSolOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [solOpen]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  // Mobile menu open: lock page scroll, make the page behind inert, move focus
  // into the menu, close on Escape or when the viewport grows to desktop.
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

  // Mouse users get hover-intent opening; touch and keyboard use the button.
  const hoverOpen = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setSolOpen(true), 90);
  };
  const hoverClose = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setSolOpen(false), 220);
  };

  // While the menu is open the header must not use backdrop-filter: it would
  // become the containing block for the fixed menu panel and collapse it.
  const surface =
    open || solOpen
      ? "border-b border-hairline bg-[#080d17]"
      : scrolled
        ? "border-b border-hairline bg-[#080d17]/95"
        : "border-b border-transparent";

  const ctaLink = NAV_CTA.external ? (
    <a href={NAV_CTA.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
      {NAV_CTA.label}
    </a>
  ) : (
    <SiteLinkControl link={NAV_CTA} className={ctaClass} />
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${surface}`}
      style={{ paddingTop: "env(safe-area-inset-top)", viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1440px] items-center justify-between px-[max(1.25rem,env(safe-area-inset-left))] sm:px-8 lg:px-12">
        <BrandLogo onNavigate={() => open && close(false)} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            <li ref={solWrapRef} className="relative" onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
              <button
                ref={solBtnRef}
                type="button"
                aria-expanded={solOpen}
                aria-controls={solId}
                onClick={() => setSolOpen((v) => !v)}
                className={`${navLinkClass} inline-flex items-center gap-1.5 ${inSolutions ? "text-foreground after:scale-x-100" : ""}`}
              >
                Solutions
                <svg aria-hidden viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-300 ${solOpen ? "rotate-180" : ""}`}>
                  <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                id={solId}
                hidden={!solOpen}
                onBlur={(e) => {
                  if (!solWrapRef.current?.contains(e.relatedTarget as Node | null)) setSolOpen(false);
                }}
                className="absolute left-1/2 top-full w-[min(44rem,calc(100vw-4rem))] -translate-x-[30%] pt-3"
              >
                <div className="overflow-hidden rounded-[20px] border border-white/[0.1] bg-[#0b1220] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
                  <ul className="grid grid-cols-2 gap-1 p-3">
                    {NAV_SOLUTIONS.map((s) => (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          aria-current={isCurrent(s.href) ? "page" : undefined}
                          onClick={() => setSolOpen(false)}
                          className="group block rounded-[14px] px-4 py-3.5 transition-colors hover:bg-white/[0.05] focus-visible:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-soft aria-[current=page]:bg-white/[0.06]"
                        >
                          <span className="flex items-center justify-between gap-3 text-[0.9375rem] font-medium text-foreground">
                            {s.label}
                            <span aria-hidden className="text-subtle opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                              →
                            </span>
                          </span>
                          <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">{s.line}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-white/[0.07] px-7 py-4">
                    <p className="text-[0.8125rem] text-subtle">Not sure where to start?</p>
                    <Link
                      href={SOLUTIONS_HUB.href}
                      onClick={() => setSolOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-md text-[0.875rem] font-medium text-accent-soft hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
                    >
                      {SOLUTIONS_HUB.label} <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <SiteLinkControl link={link} className={navLinkClass} current={isCurrent(link.href)} />
              </li>
            ))}
          </ul>
          <div className="ml-3 xl:ml-4">{ctaLink}</div>
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
          className="flex min-h-full flex-col px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:px-8"
        >
          <ul className="flex flex-col">
            <li className="border-b border-hairline">
              <button
                type="button"
                aria-expanded={mobileSol}
                aria-controls={mobileSolId}
                onClick={() => setMobileSol((v) => !v)}
                className="flex w-full items-center justify-between py-4 text-left text-[1.75rem] font-medium tracking-[-0.02em] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-expanded:text-foreground"
              >
                Solutions
                <svg aria-hidden viewBox="0 0 12 12" className={`h-4 w-4 transition-transform duration-300 ${mobileSol ? "rotate-180" : ""}`}>
                  <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <ul id={mobileSolId} hidden={!mobileSol} className="grid gap-0.5 pb-4">
                {NAV_SOLUTIONS.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      aria-current={isCurrent(s.href) ? "page" : undefined}
                      onClick={() => close(false)}
                      className="block rounded-lg px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-[current=page]:bg-white/[0.05]"
                    >
                      <span className="block text-[1.0625rem] font-medium text-foreground">{s.label}</span>
                      <span className="block text-[0.8125rem] text-muted">{s.line}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={SOLUTIONS_HUB.href}
                    onClick={() => close(false)}
                    className="mt-1 inline-flex min-h-11 items-center gap-1.5 px-3 text-[0.9375rem] font-medium text-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
                  >
                    {SOLUTIONS_HUB.label} <span aria-hidden>→</span>
                  </Link>
                </li>
              </ul>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="border-b border-hairline">
                <SiteLinkControl
                  link={link}
                  current={isCurrent(link.href)}
                  onNavigate={() => close(false)}
                  className="flex w-full items-center py-4 text-left text-[1.75rem] font-medium tracking-[-0.02em] text-muted transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft aria-[current=page]:text-foreground"
                />
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            {NAV_CTA.external ? (
              <a
                href={NAV_CTA.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                {NAV_CTA.label}
              </a>
            ) : (
              <SiteLinkControl
                link={NAV_CTA}
                onNavigate={() => close(false)}
                bubblePlacement="above"
                className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-base font-medium text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
