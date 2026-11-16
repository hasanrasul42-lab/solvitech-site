import { serviceMetadata } from "@/components/solutions/ServicePage";
import ServiceStory from "@/components/solutions/story/ServiceStory";
import { IntegrationBuilds, IntegrationClose, IntegrationFocus, IntegrationHero, IntegrationSigns } from "@/components/solutions/story/IntegrationVisuals";

export const metadata = serviceMetadata("integrations");

export default function IntegrationsPage() {
  return (
    <ServiceStory
      slug="integrations"
      accent="236 170 96"
      visuals={{ hero: <IntegrationHero />, signs: <IntegrationSigns />, focus: <IntegrationFocus />, builds: <IntegrationBuilds />, close: <IntegrationClose /> }}
    />
  );
}
