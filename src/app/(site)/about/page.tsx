import AboutPage from "@/components/pages/AboutPage";
import { pageMetadata } from "@/components/pages/PageHero";
import { ABOUT } from "@/config/pages";

export const metadata = pageMetadata(ABOUT.meta);

export default function AboutRoute() {
  return <AboutPage />;
}
