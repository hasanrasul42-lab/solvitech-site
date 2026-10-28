import ServicePage, { serviceMetadata } from "@/components/solutions/ServicePage";

export const metadata = serviceMetadata("ai");

export default function AiPage() {
  return <ServicePage slug="ai" />;
}
