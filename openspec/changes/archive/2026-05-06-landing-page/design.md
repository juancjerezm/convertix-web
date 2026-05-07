# Design: Convertix Web Landing Page

## Technical Approach

Port the existing 905-line vanilla HTML prototype to an Astro static site. Extract CSS custom properties into `global.css`, decompose sections into `.astro` components, and add 4 new sections (Landings Express, Portfolio, About, ContactForm). Zero JS at build time — only 12-line vanilla hamburger toggle shipped. Static generation with `@astrojs/netlify` adapter. Netlify Forms for email capture via `netlify` attribute.

## Architecture Decisions

| Decision | Options | Choice | Rationale |
|----------|---------|--------|-----------|
| **CSS strategy** | global.css only / component `<style>` / hybrid | Hybrid: `global.css` for tokens+base+shared classnames; component `<style>` only for isolated overrides | Prototype's 700 lines form a unified design system. Splitting would duplicate selectors. Tokens (`:root`), reset, `.container`, `.btn`, `.section-title`, `.service-card`, `.timeline`, responsive media queries — all live in `global.css`. |
| **Component granularity** | 1 `.astro` per section / sub-components per card | 1 `.astro` per section | Only 4 new sections. ServiceCard and TemplateCard differ in structure (icon vs image thumbnail, gradient vs border). No ≥2 identical patterns to extract. |
| **Template data** | Hardcoded in component / `src/data/templates.json` | `src/data/templates.json` | Astro imports JSON natively via `import data from '../data/templates.json'`. Non-technical users can add templates without touching markup. |
| **Contact form** | Formspree / Web3Forms / Netlify Forms / WhatsApp only | Netlify Forms (primary) + WhatsApp link (secondary) | Proposal requires email form + WhatsApp. Netlify Forms auto-detects `<form netlify>` — zero config, free tier included. WhatsApp link serves as fallback for inbound leads that skip the form. |
| **Deployment** | Vercel / Netlify | Netlify | Netlify Forms is built-in (no external service for contact form). `@astrojs/netlify` adapter is mature. |
| **Images** | `<Image />` component / plain `<img>` | Plain `<img>` with `loading="lazy"` | MVP has ~5-8 images. `@astrojs/image` adds Sharp dependency (~130MB). Migrate to `<Image />` when build step is justified post-MVP. |
| **SEO** | Inline `<head>` / shared SEO component | `src/components/SEO.astro` with props (`title`, `description`, `ogImage`) | Single-page site but reusable pattern if expanding later. Inject via `<slot name="head">` in BaseLayout. |

## Component Tree

```
BaseLayout.astro
├── <head> metatags via props
├── <Navbar />                   ← Fixed, scrolled class, hamburger (12-line vanilla JS)
├── <slot />                     ← All sections composed in index.astro
└── <Footer />

pages/index.astro renders:
  <Hero />
  <ServicesGrid />
  <ProcessTimeline />
  <LandingsExpress />
  <Portfolio />
  <About />
  <ContactForm />
  <CtaFinal />
```

## Data Flow

```
templates.json ──→ LandingsExpress.astro ──→ static HTML grid
                                        └──→ each card: image, title, subtitle, CTA
ContactForm.astro ──→ <form netlify> ──→ Netlify serverless handler ──→ email to hola@convertix.com
WhatsApp link ──→ https://wa.me/{number} (no server logic)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Dependencies: astro, @astrojs/netlify |
| `astro.config.mjs` | Create | Netlify adapter config, site URL, output: 'static' |
| `tsconfig.json` | Create | Astro's strict base config |
| `src/env.d.ts` | Create | Astro client types reference |
| `src/layouts/BaseLayout.astro` | Create | `<html>`, `<head>` with font preconnect, SEO component, global.css import, Navbar + Footer wrapping `<slot />` |
| `src/components/SEO.astro` | Create | Props: title, description, ogImage. Outputs `<meta>`, `<link canonical>`, OG + Twitter Card tags |
| `src/components/Navbar.astro` | Create | Fixed nav with logo (C letter + CONVERTIX + WEB), nav links, hamburger. `<script>` block for scroll+click toggle |
| `src/components/Hero.astro` | Create | h1 with gradient highlight, subtitle, 2 CTA buttons, radial glow pseudo-elements |
| `src/components/ServicesGrid.astro` | Create | Section-label, title, subtitle, 3-card grid (3 hardcoded service-card articles) |
| `src/components/ProcessTimeline.astro` | Create | 3-step timeline with data-number circles, connecting gradient line |
| `src/components/LandingsExpress.astro` | Create | 🆕 Section-label, title, subtitle. Grid of template cards from `templates.json` — each with screenshot `<img>`, title, subtitle, "Ver demo" CTA |
| `src/components/Portfolio.astro` | Create | 🆕 Autos JC showcase — 2-3 screenshots, tech badges (Astro, Tailwind, etc.), project description, link to live site |
| `src/components/About.astro` | Create | 🆕 Founder photo, name, story paragraph, mission statement |
| `src/components/ContactForm.astro` | Create | 🆕 `<form netlify name="contact">` with name, email, message fields + submit btn. Below: WhatsApp fallback link |
| `src/components/CtaFinal.astro` | Create | Glow card with heading, subtitle, WhatsApp button |
| `src/components/Footer.astro` | Create | Brand + tagline, footer links (Secciones, Contacto), copyright bar |
| `src/pages/index.astro` | Create | Imports and renders all section components in order |
| `src/styles/global.css` | Create | Full port: `:root` tokens, reset, `.btn`, `.navbar`, `.hero`, `.services-grid`, `.timeline`, `.cta-card`, `.footer`, `@keyframes fade-in-up`, responsive media queries |
| `src/data/templates.json` | Create | Array of 4-6 template objects: `{ id, title, subtitle, image, ctaUrl }` |
| `public/favicon.svg` | Create | Simple C monogram SVG |
| `public/og-image.png` | Create | Open Graph preview image (1200x630) |
| `public/portfolio/` | Create | Autos JC screenshots (2-3 PNGs) |
| `public/templates/` | Create | Landings Express template preview PNGs (4-6) |
| `netlify.toml` | Create | Build command, publish directory, redirects |

## Testing Strategy

No test runner available. Manual strategy:

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | All 8 sections render | `astro dev` — verify desktop 1440px + mobile 375px (Chrome DevTools) |
| Accessibility | Color contrast, keyboard nav | axe DevTools browser extension |
| Performance | Lighthouse score ≥90 | Chrome Lighthouse audit on Netlify deploy preview |
| Functionality | Hamburger toggle, form submission | Manual click verification; form test via Netlify deploy preview |
| SEO | OG/Twitter card preview | opengraph.xyz or Twitter Card Validator |

## Open Questions

- [ ] Real WhatsApp number needed — proposal uses placeholder `5491112345678`
- [ ] Founder photo available? About section needs one
- [ ] Autos JC screenshots ready? Portfolio section depends on them (2-3 images)
- [ ] Landings Express template previews — design mockups or real screenshots?
- [ ] Domain name configured? Netlify custom domain needed for production
