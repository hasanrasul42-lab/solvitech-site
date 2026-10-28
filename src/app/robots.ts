import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Indexing is only allowed once the production origin is configured
 * (NEXT_PUBLIC_SITE_URL). Until then -- previews, local builds -- search
 * engines are asked not to crawl.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE.url) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: new URL("/sitemap.xml", SITE.url).toString() };
}
