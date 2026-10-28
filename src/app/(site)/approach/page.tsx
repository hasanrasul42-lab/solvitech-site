import ApproachPage from "@/components/pages/ApproachPage";
import { pageMetadata } from "@/components/pages/PageHero";
import { APPROACH_PAGE } from "@/config/pages";

export const metadata = pageMetadata(APPROACH_PAGE.meta);

export default function ApproachRoute() {
  return <ApproachPage />;
}
