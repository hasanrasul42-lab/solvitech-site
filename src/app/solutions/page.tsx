import type { Metadata } from "next";
import SolutionsHub from "@/components/solutions/SolutionsHub";
import { HUB } from "@/config/services";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: `${HUB.meta.title} | ${SITE.name}`,
  description: HUB.meta.description,
  openGraph: { title: `${HUB.meta.title} | ${SITE.name}`, description: HUB.meta.description },
};

export default function SolutionsPage() {
  return <SolutionsHub />;
}
