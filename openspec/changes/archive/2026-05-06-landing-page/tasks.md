# Tasks: Convertix Web Landing Page

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1,200 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain (resolved)
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Base |
|------|------|------|
| 1 | Scaffold, layout, SEO, Navbar, Footer, global.css | main |
| 2 | Core sections: Hero, Services, Process, CTA | PR 1 |
| 3 | New sections: Landings Express, Portfolio, About, Contact | PR 2 |
| 4 | Assets, deploy config, manual QA | PR 3 |

## Phase 1: Foundation

- [x] 1.1 Create `package.json` with `astro` and `@astrojs/netlify`
- [x] 1.2 Create `astro.config.mjs` — Netlify adapter, `output: 'static'`, site URL
- [x] 1.3 Create `tsconfig.json` and `src/env.d.ts`
- [x] 1.4 Create `src/styles/global.css` — port `:root` tokens, reset, shared classes, keyframes, responsive queries
- [x] 1.5 Create `src/components/SEO.astro` — props `title`, `description`, `ogImage`; emit meta/OG/Twitter tags
- [x] 1.6 Create `src/layouts/BaseLayout.astro` — `<head>` preconnect, SEO slot, global.css import, Navbar + Footer wrapping `<slot />`
- [x] 1.7 Create `src/components/Navbar.astro` — fixed nav, logo, links, hamburger; `<script>` for scroll/click toggle
- [x] 1.8 Create `src/components/Footer.astro` — brand, links, copyright bar

## Phase 2: Core Sections

- [x] 2.1 Create `src/components/Hero.astro` — gradient h1, subtitle, 2 CTAs, radial glow
- [x] 2.2 Create `src/components/ServicesGrid.astro` — section label, 3 hardcoded service cards
- [x] 2.3 Create `src/components/ProcessTimeline.astro` — 3-step timeline with numbered circles and connecting line
- [x] 2.4 Create `src/components/CtaFinal.astro` — glow card, heading, subtitle, WhatsApp button

## Phase 3: New Sections

- [x] 3.1 Create `src/data/templates.json` — 4–6 objects `{ id, title, subtitle, image, ctaUrl }`
- [x] 3.2 Create `src/components/LandingsExpress.astro` — import JSON, render template card grid with `<img>`
- [x] 3.3 Create `src/components/Portfolio.astro` — Autos JC screenshots, tech badges, description, external link
- [x] 3.4 Create `src/components/About.astro` — founder name, mission statement (text-only MVP)
- [x] 3.5 Create `src/components/ContactForm.astro` — `<form netlify name="contact">` with name/email/message; WhatsApp fallback link

## Phase 4: Integration

- [x] 4.1 Create `src/pages/index.astro` — import and render all sections in order inside `BaseLayout` (Navbar + Footer only; sections added in PR 2 & 3)
- [x] 4.2 Add `public/favicon.svg` (gradient "C" monogram) and `public/og-image.png` (placeholder; needs real OG image)
- [x] 4.3 Add placeholder images to `public/portfolio/` and `public/templates/`
- [x] 4.4 Create `netlify.toml` — build command, publish directory, redirects
- [x] 4.5 Create `public/robots.txt` — allow all, sitemap reference

## Phase 5: Polish

- [x] 5.1 Run `astro build` locally; verify zero errors
- [ ] 5.2 Verify all 8 sections render at 1440px and 375px in `astro dev`
- [ ] 5.3 Test hamburger toggle, WhatsApp deep link, and Netlify form submission
- [ ] 5.4 Run Lighthouse audit; confirm Performance ≥90 and ≤1KB JS shipped
