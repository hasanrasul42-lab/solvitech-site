import ServicePage, { serviceMetadata } from "@/components/solutions/ServicePage";

export const metadata = serviceMetadata("websites");

export default function WebsitesPage() {
  return <ServicePage slug="websites" />;
}
