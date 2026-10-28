import ContactPage from "@/components/pages/ContactPage";
import { pageMetadata } from "@/components/pages/PageHero";
import { CONTACT_PAGE } from "@/config/pages";

export const metadata = pageMetadata(CONTACT_PAGE.meta);

export default function ContactRoute() {
  return <ContactPage />;
}
