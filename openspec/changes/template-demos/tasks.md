# Tasks: Demo Pages for Templates

## Phase 1: Data & UI Unblocking

- [ ] 1.1 Add `demoUrl` to each entry in `src/data/templates.json` (ecommerce → `/demos/tienda-online`)
- [ ] 1.2 Render conditional "Ver demo →" `btn-outline` button in `src/components/LandingsExpress.astro`, stacked below primary CTA
- [ ] 1.3 Add scoped CSS for demo button spacing and outline style in `LandingsExpress.astro`

## Phase 2: Demo Pages

- [x] 2.1 Create `src/pages/demos/landing.astro` — white bg, blue #2563eb, hero + features + pricing + testimonials, own `<style is:global>`, Google Fonts, "← Volver a Convertix"
- [x] 2.2 Create `src/pages/demos/negocio-local.astro` — cream #fef7e7, olive #4a6741 + terracotta #c67b5c, hero + menu + location/hours + reservation CTA
- [ ] 2.3 Create `src/pages/demos/profesional.astro` — white, navy #1e3a5f + gold #c9a84c, hero + photo placeholder + services icons + about + contact form layout
- [ ] 2.4 Create `src/pages/demos/tienda-online.astro` — white, coral #ff6b6b + black #1a1a2e, product grid (8-12 items) + category nav + featured banner + newsletter CTA
- [ ] 2.5 Verify all 4 demos at `/demos/{slug}`: zero `<script>` tags, no dark-theme leakage, responsive at 375px and 1440px

## Phase 3: Screenshot Script

- [ ] 3.1 Install `playwright` as devDependency (`npm install -D playwright`)
- [ ] 3.2 Create `scripts/screenshots.mjs` — launch `astro preview`, capture 1600×900 WebP per demo into `public/templates/{slug}.webp`, exit 0 on success
- [ ] 3.3 Add unreachable-server error handling to `scripts/screenshots.mjs`

## Phase 4: Capture & Final Build

- [ ] 4.1 Run `npm run build` then `node scripts/screenshots.mjs` to generate 4 WebP screenshots
- [ ] 4.2 Update `src/data/templates.json` `image` fields from `.svg` to `.webp`
- [ ] 4.3 Run `npm run build` to regenerate landing page with real screenshot references
- [ ] 4.4 Delete old SVG placeholders from `public/templates/`
- [ ] 4.5 Verify `dist/sitemap-0.xml` includes `/demos/*` URLs and build completes with zero errors
