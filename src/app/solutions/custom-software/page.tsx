import { serviceMetadata } from "@/components/solutions/ServicePage";
import ServiceStory from "@/components/solutions/story/ServiceStory";
import { SoftwareBuilds, SoftwareClose, SoftwareFocus, SoftwareHero, SoftwareSigns } from "@/components/solutions/story/SoftwareVisuals";

export const metadata = serviceMetadata("custom-software");

export default function CustomSoftwarePage() {
  return (
    <ServiceStory
      slug="custom-software"
      accent="120 190 255"
      visuals={{ hero: <SoftwareHero />, signs: <SoftwareSigns />, focus: <SoftwareFocus />, builds: <SoftwareBuilds />, close: <SoftwareClose /> }}
    />
  );
}
