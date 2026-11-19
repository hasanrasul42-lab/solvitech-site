import type { Metadata } from "next";
import { SHARE_IMAGE, SITE } from "@/config/site";
import { WEB_PAGE } from "@/config/websitesPage";
import StructureReveal from "@/components/home/StructureReveal";
import { WebClose, WebCosts, WebFaq, WebHero, WebNeed, WebQuality, WebScenarios, WebServices, WebUx } from "./WebsitesSections";
import "@/components/home/directory/directory.css";
import "@/components/solutions/story/story.css";

export const websitesMetadata: Metadata = {
  title: { absolute: WEB_PAGE.meta.title },
  description: WEB_PAGE.meta.description,
  openGraph: { title: WEB_PAGE.meta.title, description: WEB_PAGE.meta.description, images: [SHARE_IMAGE] },
  ...(SITE.url ? { alternates: { canonical: "/solutions/websites" } } : {}),
};

/**
 * /solutions/websites -- Websites & Digital Experiences (founder copy, Nov
 * 2026). Each section pairs its copy with a dimensional visual on the
 * homepage's surfaces, lighting and cursor dot grid.
 */
export default function WebsitesServicePage() {
  return (
    <div className="svc-cards contents">
      <StructureReveal />
      <WebHero />
      <WebNeed />
      <WebServices />
      <WebUx />
      <WebQuality />
      <WebScenarios />
      <WebCosts />
      <WebFaq />
      <WebClose />
    </div>
  );
}
