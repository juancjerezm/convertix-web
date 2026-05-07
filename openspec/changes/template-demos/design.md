# Design: Demo Pages for Templates

## Technical Approach

Four standalone Astro pages in `src/pages/demos/`, each a complete HTML document with own `<html>`, `<head>`, `<style is:global>`, and Google Fonts. Zero dependency on BaseLayout or global.css. A Playwright script captures 1600×900 WebP screenshots post-build for use as template card images.

## Architecture Decisions

### Decision 1: Separate pages vs dynamic route

| Option | Tradeoff | Verdict |
|--------|----------|---------|
| 4 separate `.astro` files | Simple, no routing logic, each file is its own design system | **Chosen** |
| `[slug].astro` with conditional rendering | Fewer files, but requires layout-switching logic, font conditionals, and data files | Rejected — complexity with no upside for 4 completely different designs |

### Decision 2: Style isolation

| Option | Tradeoff | Verdict |
|--------|----------|---------|
| No BaseLayout import + `<style is:global>` | Clean isolation, idiomatic Astro for standalone pages | **Chosen** |
| Shadow DOM or iframe | Overkill, breaks SEO, hurts screenshot quality | Rejected |

**Rationale**: Each demo declares its own `<html>` → Astro treats it as a separate page entry point. `is:global` on the style block prevents Astro scoping so `body`/`html`/`:root` selectors work naturally within that page only.

### Decision 3: Fonts per demo

Each demo includes its own `<link>` for Google Fonts in its `<head>`. No conflict with Inter loaded by the landing page — these are separate HTML documents served as separate page requests.

### Decision 4: "Volver a Convertix" link

**Choice**: Absolute-positioned anchor in top-left, `padding: 8px 16px`, semi-transparent background (`rgba(0,0,0,0.6)` or matching demo palette), `z-index: 10`, scrolls with content (not fixed). Text: `← Volver a Convertix`.

### Decision 5: LandingsExpress button layout

**Choice**: Stacked vertical. Primary "Quiero esta →" (WhatsApp, `btn-primary`) on top, secondary "Ver demo →" (`btn-outline`) below with `margin-top: 8px`. This preserves visual hierarchy — primary action gets prominence.

### Decision 6: `demoUrl` schema

**Choice**: Relative path string. Example: `"demoUrl": "/demos/landing"`. Works across all environments, no domain hardcoding.

### Decision 7: Screenshot script

**Choice**: `scripts/screenshots.mjs` (ESM JavaScript, no TypeScript config overhead). Uses `playwright` (not `@playwright/test` — lighter). Script: launches `astro preview` on the built output, captures 1600×900 viewport WebP screenshots, kills server on exit. Desktop only (mobile viewport is future enhancement).

### Decision 8: Image replacement flow

1. Write 4 demo pages
2. `npm run build` — generates demo HTML + landing page
3. `node scripts/screenshots.mjs` — starts `astro preview`, captures demos → `public/templates/{id}.webp`
4. Update `templates.json`: change `image` from `.svg` to `.webp`
5. `npm run build` — landing page regenerates with real screenshot references
6. Delete old SVGs

## Data Flow

```
templates.json ──import──→ LandingsExpress.astro ──→ template cards (build time)
       │
       ├─ image (→ public/templates/*.webp)
       └─ demoUrl (→ /demos/{slug})

src/pages/demos/*.astro ──build──→ dist/demos/*.html ──screenshot──→ public/templates/*.webp
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/demos/landing.astro` | Create | SaaS/Startup demo, white bg, blue accents |
| `src/pages/demos/negocio-local.astro` | Create | Restaurant demo, cream/olive/terracotta palette |
| `src/pages/demos/profesional.astro` | Create | Lawyer/Consultant demo, navy/gold palette |
| `src/pages/demos/tienda-online.astro` | Create | Fashion e-commerce demo, coral/black palette |
| `src/data/templates.json` | Modify | Add `demoUrl` field per template |
| `src/components/LandingsExpress.astro` | Modify | Add "Ver demo →" secondary CTA button |
| `scripts/screenshots.mjs` | Create | Playwright headless capture script |
| `package.json` | Modify | Add `playwright` to devDependencies |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Each demo renders correct palette, no dark-theme leakage | Manual: `astro dev`, open each URL, verify no `#0a0a0f` background or purple gradients appear |
| Visual | "Volver a Convertix" link present on all 4 demos | Manual inspection |
| Visual | LandingsExpress cards show both buttons correctly | Manual: check button layout, spacing, hover states |
| Integration | Screenshot script captures 4 valid WebP files | Run `node scripts/screenshots.mjs`, verify output files exist and are > 10KB |
| Build | `npm run build` completes with zero errors | Automated: CI or manual `npm run build` |
| Build | Sitemap includes `/demos/*` URLs | Check `dist/sitemap-0.xml` after build |

## Open Questions

None — all blocking decisions resolved above.
