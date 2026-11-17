import type { Metadata } from "next";
import { SHARE_IMAGE, SITE } from "@/config/site";
import { AUTO_PAGE } from "@/config/automationPage";
import StructureReveal from "@/components/home/StructureReveal";
import { AutoApproach, AutoApps, AutoClose, AutoHero, AutoHow, AutoPain, AutoTrust } from "./AutomationSections";
import "@/components/home/directory/directory.css";
import "./automation.css";

export const automationMetadata: Metadata = {
  title: { absolute: AUTO_PAGE.meta.title },
  description: AUTO_PAGE.meta.description,
  openGraph: { title: AUTO_PAGE.meta.title, description: AUTO_PAGE.meta.description, images: [SHARE_IMAGE] },
  ...(SITE.url ? { alternates: { canonical: "/solutions/automation" } } : {}),
};

/**
 * /solutions/automation -- Business Automation (Plan V1.0 copy). Each section
 * pairs its copy with its own dimensional visual, on the homepage's
 * surfaces, lighting and cursor dot grid. Other service pages keep the
 * shared ServicePage template.
 */
export default function AutomationServicePage() {
  return (
    <div className="svc-cards contents">
      <StructureReveal />
      <AutoHero />
      <AutoPain />
      <AutoHow />
      <AutoApps />
      <AutoApproach />
      <AutoTrust />
      <AutoClose />
    </div>
  );
}
