import ServicePage, { serviceMetadata } from "@/components/solutions/ServicePage";

export const metadata = serviceMetadata("automation");

export default function AutomationPage() {
  return <ServicePage slug="automation" />;
}
