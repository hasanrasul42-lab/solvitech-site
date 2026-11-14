import { ViewTransition, type ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

/**
 * Shared chrome for inner pages: skip link, header, main landmark, footer.
 * Moving between inner pages cross-fades the content where the browser
 * supports view transitions (the header stays put); elsewhere it swaps as usual.
 */
export default function InnerPageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <ViewTransition>{children}</ViewTransition>
      </main>
      <SiteFooter />
    </>
  );
}
