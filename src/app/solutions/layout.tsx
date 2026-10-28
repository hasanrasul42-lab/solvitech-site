import InnerPageShell from "@/components/site/InnerPageShell";

/** Shared chrome for /solutions and the service pages. */
export default function SolutionsLayout({ children }: LayoutProps<"/solutions">) {
  return <InnerPageShell>{children}</InnerPageShell>;
}
