import type { Metadata } from "next";
import { SHARE_IMAGE, SITE } from "@/config/site";
import { AI_PAGE } from "@/config/aiPage";
import StructureReveal from "@/components/home/StructureReveal";
import { AiAlongside, AiApproach, AiApps, AiClose, AiDiscovery, AiHero } from "./AiSections";
import "@/components/home/directory/directory.css";
import "./ai.css";

export const aiMetadata: Metadata = {
  title: { absolute: AI_PAGE.meta.title },
  description: AI_PAGE.meta.description,
  openGraph: { title: AI_PAGE.meta.title, description: AI_PAGE.meta.description, images: [SHARE_IMAGE] },
  ...(SITE.url ? { alternates: { canonical: "/solutions/ai" } } : {}),
};

/**
 * /solutions/ai -- AI Consulting & Implementation (founder copy, Nov 2026). Each
 * section pairs its copy with its own 3D scene beside the text, on the
 * homepage's surfaces, lighting and cursor dot grid.
 * The other service pages keep the shared ServicePage template.
 */
export default function AiServicePage() {
  return (
    <div className="svc-cards contents">
      <StructureReveal />
      <AiHero />
      <AiDiscovery />
      <AiApps />
      <AiApproach />
      <AiAlongside />
      <AiClose />
    </div>
  );
}
