import { serviceMetadata } from "@/components/solutions/ServicePage";
import ServiceStory from "@/components/solutions/story/ServiceStory";
import { WebsiteBuilds, WebsiteClose, WebsiteFocus, WebsiteHero, WebsiteSigns } from "@/components/solutions/story/WebsiteVisuals";

export const metadata = serviceMetadata("websites");

export default function WebsitesPage() {
  return (
    <ServiceStory
      slug="websites"
      accent="150 140 255"
      visuals={{ hero: <WebsiteHero />, signs: <WebsiteSigns />, focus: <WebsiteFocus />, builds: <WebsiteBuilds />, close: <WebsiteClose /> }}
    />
  );
}
