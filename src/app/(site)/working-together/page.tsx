import WorkingTogetherPage from "@/components/pages/WorkingTogetherPage";
import { pageMetadata } from "@/components/pages/PageHero";
import { WORKING_PAGE } from "@/config/pages";

export const metadata = pageMetadata(WORKING_PAGE.meta);

export default function WorkingTogetherRoute() {
  return <WorkingTogetherPage />;
}
