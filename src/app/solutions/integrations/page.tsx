import ServicePage, { serviceMetadata } from "@/components/solutions/ServicePage";

export const metadata = serviceMetadata("integrations");

export default function IntegrationsPage() {
  return <ServicePage slug="integrations" />;
}
