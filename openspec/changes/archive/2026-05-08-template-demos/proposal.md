# Proposal: Demo Pages for Templates

## Intent

Prospects can only see SVG wireframes before buying. They need real demo pages to experience the design quality of each template tier. Each demo must showcase a COMPLETELY DIFFERENT visual identity — not reuse the dark Convertix theme.

## Scope

### In Scope
- 4 standalone demo pages in `src/pages/demos/` (landing, negocio-local, profesional, blog)
- Each demo self-contained: own `<html>`, fonts, inline styles — NO BaseLayout import
- `templates.json`: add `demoUrl` field per template
- `LandingsExpress.astro`: add "Ver demo →" secondary button linking to `demoUrl`
- Playwright as devDependency + screenshot capture script (1600×900, WebP)
- Replace SVGs in `public/templates/` with real WebP screenshots
- "← Volver a Convertix" link on each demo

### Out of Scope
- Real product data, functional carts, or backend
- Change to main landing page design or dark theme
- SSR or server routes

## Capabilities

### New Capabilities
- `demo-pages`: 4 standalone demo pages with unique design systems, no BaseLayout leakage
- `template-screenshots`: automated Playwright script capturing 16:9 WebP screenshots of each demo

### Modified Capabilities
- `landing-express`: template cards gain a secondary "Ver demo" CTA; templates.json gains `demoUrl`

## Approach

**Pages (4 separate `.astro` files in `src/pages/demos/`):**

| File | Style | Key Elements |
|------|-------|-------------|
| `landing.astro` | SaaS/Startup — white bg, blue #2563eb accents | Hero, features grid, pricing tiers, testimonials |
| `negocio-local.astro` | Restaurant/Café — cream #fef7e7, olive #4a6741, terracotta #c67b5c | Hero, menu sections, location/hours, reservation CTA |
| `profesional.astro` | Lawyer/Consultant — white, navy #1e3a5f, gold #c9a84c | Hero+photo, services icons, about, contact form layout |
| `blog.astro` | Blog editorial — white, charcoal #1a1a2e, teal #0d9488 | Hero, article grid (6 posts), newsletter, footer, Merriweather + Inter |

Each page is a complete HTML document with its own `<style>` block. Zero build-time JS.

**Screenshot pipeline:**
1. `npm install -D playwright @playwright/test`
2. Script scans `demo-urls.json` or hardcodes paths, launches Chromium headless
3. Captures 1600×900 viewport screenshots → `public/templates/{slug}.webp`
4. After capture: `npm run build` regenerates the landing page with real images

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/demos/*.astro` | New (4 files) | Standalone demo pages |
| `src/data/templates.json` | Modified | Add `demoUrl` field per template |
| `src/components/LandingsExpress.astro` | Modified | Add "Ver demo →" button row |
| `public/templates/*.svg` | Replaced | SVG placeholders → WebP screenshots |
| `scripts/screenshots.ts` | New | Playwright capture script |
| `package.json` | Modified | Add Playwright devDependency |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Global CSS leakage if demo imports BaseLayout | Low | Demos declare own `<html>`/`<head>`/`<body>`; no BaseLayout import in any demo |
| `:global()` needed for html/body overrides in Astro scoped styles | Medium | Test each demo with `astro dev` before proceeding; use `is:global` on root style if needed |
| Playwright browser binary download fails in CI | Low | Install `playwright-core` + `chromium` as separate dependency; or skip CI, screenshots are human-run |
| Existing sitemap excludes `/demos/*` | Low | `@astrojs/sitemap` auto-discovers static pages at build time |

## Rollback Plan

1. Delete `src/pages/demos/` directory
2. Revert `templates.json` to remove `demoUrl` fields
3. Revert `LandingsExpress.astro` changes (remove demo button)
4. Restore SVG placeholders from git
5. Remove Playwright from devDependencies
6. `npm run build` — landing page returns to pre-demo state

## Dependencies

- Playwright (`npm install -D playwright`)
- Existing `@astrojs/sitemap` for auto-indexing new pages

## Success Criteria

- [ ] 4 demo pages accessible at `/demos/{slug}` and visually distinct
- [ ] `npm run build` completes with zero errors
- [ ] Each demo renders its own unique color palette and typography (no dark-theme leakage)
- [ ] "← Volver a Convertix" link present on every demo
- [ ] LandingsExpress cards show "Ver demo →" button linking to correct demoUrl
- [ ] Screenshots captured as 1600×900 WebP files in `public/templates/`
- [ ] Template cards display real screenshots instead of SVG placeholders
