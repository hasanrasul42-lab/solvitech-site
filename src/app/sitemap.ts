import type { MetadataRoute } from "next";
import { SERVICES } from "@/config/services";
import { PUBLIC_ROUTES, SITE } from "@/config/site";

/** All public pages. Empty until the production origin is configured (SITE.url). */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE.url) return [];
  return [...PUBLIC_ROUTES, ...SERVICES.map((s) => s.href)].map((path) => ({ url: new URL(path, SITE.url).toString() }));
}
