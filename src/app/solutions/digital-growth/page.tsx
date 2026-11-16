import { serviceMetadata } from "@/components/solutions/ServicePage";
import ServiceStory from "@/components/solutions/story/ServiceStory";
import { GrowthBuilds, GrowthClose, GrowthFocus, GrowthHero, GrowthSigns } from "@/components/solutions/story/GrowthVisuals";

export const metadata = serviceMetadata("digital-growth");

export default function DigitalGrowthPage() {
  return (
    <ServiceStory
      slug="digital-growth"
      accent="110 210 150"
      visuals={{ hero: <GrowthHero />, signs: <GrowthSigns />, focus: <GrowthFocus />, builds: <GrowthBuilds />, close: <GrowthClose /> }}
    />
  );
}
