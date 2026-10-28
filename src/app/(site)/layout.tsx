import type { ReactNode } from "react";
import InnerPageShell from "@/components/site/InnerPageShell";

/** Shared chrome for /about, /approach, /working-together and /contact. */
export default function CompanyPagesLayout({ children }: { children: ReactNode }) {
  return <InnerPageShell>{children}</InnerPageShell>;
}
