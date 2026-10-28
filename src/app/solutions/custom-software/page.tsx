import ServicePage, { serviceMetadata } from "@/components/solutions/ServicePage";

export const metadata = serviceMetadata("custom-software");

export default function CustomSoftwarePage() {
  return <ServicePage slug="custom-software" />;
}
