# Tasks: Landing Reforma — Web + AI Repositioning

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~90–110 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Bugfix (P0)

- [x] 1.1 Add `import templates from '../data/templates.json'` to `src/components/LandingsExpress.astro` frontmatter
- [x] 1.2 Run `pnpm build` to verify LandingsExpress compiles without error

## Phase 2: Core Reform (P1)

- [x] 2.1 Remove `<script>` block (lines 19–57) from `src/components/Hero.astro`; verify no `#heroTyping` element exists
- [x] 2.2 Add `import ConvertixAI from '../components/ConvertixAI.astro'` to `src/pages/index.astro`
- [x] 2.3 Insert `<ConvertixAI />` between `<FeaturesGrid />` and `<ProcessTimeline />` in `src/pages/index.astro`
- [x] 2.4 Add `<li><a href="/#ai">IA</a></li>` after Servicios link in `src/components/Navbar.astro`
- [x] 2.5 Update `src/components/CtaFinal.astro`: h2 → "Cuéntame tu proyecto"; WhatsApp btn text → "Cuéntame tu proyecto 📲"; href to `wa.me/573163000208?text=¡Hola!%20Vi%20tu%20página%20y%20quiero%20contarte%20sobre%20mi%20proyecto.`
- [x] 2.6 Run E2E tests: verify `#ai` renders between `#servicios` and `#proceso`, Navbar link scrolls, no typewriter errors

## Phase 3: SEO (P2)

- [x] 3.1 Add `<meta name="keywords" content="página web Colombia, diseño web Colombia, landing page Colombia, chatbot WhatsApp Colombia, automatización Colombia, desarrollo web Colombia, IA para negocios">` to `src/components/SEO.astro`
- [x] 3.2 Extend `knowsAbout` array in `src/components/StructuredData.astro` with "chatbot WhatsApp Colombia", "automatización Python", "consultoría IA", "página web Colombia"
- [x] 3.3 Verify `BaseLayout.astro` title/description already includes Colombia + AI terms; confirm no changes needed
- [x] 3.4 E2E test: assert `<meta name="keywords">` exists in `<head>` and Schema.org contains AI terms

## Phase 4: Visual Polish (P3)

- [x] 4.1 Add `text-wrap: balance` to `h1, h2, .section-title` and `text-wrap: pretty` to `p` in `src/styles/global.css`
- [x] 4.2 Add `@media (prefers-reduced-motion: no-preference) { .btn:active, .btn-primary:active, .btn-outline:active { transform: scale(0.96); transition: transform 0.1s ease; } }` to `src/styles/global.css`
- [x] 4.3 Add `.price, .template-price { font-variant-numeric: tabular-nums; }` to `src/styles/global.css`
- [x] 4.4 Replace `transition: all` with explicit `transition-property` in `.btn`, `.feature-card`, `.service-card`, `.template-card`, `.ai-card`, `.timeline-step::before`
- [x] 4.5 Add `--image-outline` to `:root` and `[data-theme="light"]`; apply `border: 1px solid var(--image-outline)` to `.template-image img` and `.ai-card img`
- [x] 4.6 Enforce 40×40px hit areas: `.theme-toggle { width:40px; height:40px }`, `.hamburger { min-width:40px; min-height:40px }`, `.nav-links a { min-height:40px }`
- [x] 4.7 E2E visual regression: screenshot diff baseline vs reforma at 375px and 1440px; axe-core zero violations
