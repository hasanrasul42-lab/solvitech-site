# Solvitech website

Marketing website for Solvitech: Next.js (App Router, Cache Components), React, TypeScript, Tailwind CSS and Three.js / React Three Fiber for the 3D hero.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start   # production build, the true speed of the site
```

## Where things live

- `src/config/` holds the site's copy and structure, so content can change without touching layout code:
  - `site.ts` navigation, calls to action, site name and the production origin (`NEXT_PUBLIC_SITE_URL`)
  - `services.ts` the Solutions hub and the six service pages
  - `home.ts` homepage chapters, `solutions.ts` the homepage Solutions chapter, `pages.ts` About, Approach, Working Together and Contact, `work.ts` Selected Work (hidden until approved projects exist)
- `src/components/hero/` the approved 3D hero and System Activation entrance
- `src/app/` routes, metadata images (favicon, app icons, social share image), robots and sitemap

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` to the production origin: this enables canonical URLs, the sitemap and search indexing (until then `robots.txt` blocks indexing).
- Enquiries are preview-only until a recipient and delivery method are approved (`CONTACT` in `src/config/home.ts`).
- Founder and commercial decisions still open are listed in `FOUNDER_DECISIONS` in `src/config/pages.ts`.
