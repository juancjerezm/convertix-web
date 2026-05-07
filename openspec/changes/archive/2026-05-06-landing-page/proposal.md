# Proposal: Convertix Web Landing Page

## Intent

Convertix Web (1-week-old agency) needs a professional landing page as its primary client acquisition channel. An existing HTML prototype has strong dark-theme design but lacks portfolio proof, about/trust section, real contact info, SEO metadata, and a budget-friendly offering. Port the design to Astro, expand strategically, and add the "Landings Express" template tier to differentiate from pure-custom agencies.

## Scope

### In Scope
- Port existing design (dark theme, gradient, Inter, animations) to Astro components: Hero, Services, Process, CTA, Footer
- **Landings Express**: pre-built template grid with preview cards, subtitle, and contact CTA (budget tier)
- Portfolio section featuring Autos JC (screenshots, tech badges, description)
- About section (founder story, mission)
- Contact section (real WhatsApp link, email form)
- SEO metadata (meta description, Open Graph, Twitter Card, sitemap)
- Mobile hamburger menu toggle (prototype has placeholder, logic missing)
- Deploy to Vercel or Netlify

### Out of Scope
- Testimonials (no real reviews yet)
- Pricing/Packages tier cards
- Tech stack section
- Analytics or tracking
- CMS or database
- Multi-language

## Capabilities

### New Capabilities
Each becomes `openspec/specs/<name>/spec.md`:

- `landing-hero`: Headline, subtitle, CTA buttons
- `landing-services`: 3 service cards (Landing Pages, Corporativos, E-commerce)
- `landing-process`: 3-step delivery timeline
- `landing-express`: Pre-built template grid — budget tier, choose & customize
- `landing-portfolio`: Autos JC showcase (screenshots, tech badges, project link)
- `landing-about`: Founder story, photo, mission statement
- `landing-contact`: WhatsApp link, email form
- `landing-seo`: Meta tags, OG image, Twitter Card, canonical URL, sitemap

### Modified Capabilities
None — greenfield project, no existing specs.

## Approach

Port prototype design into Astro `.astro` section components. Preserve CSS custom properties verbatim, extract global styles to `src/styles/global.css`. Target 0KB JS shipped — vanilla toggle for hamburger menu only. Static generation, no hydration, no islands, no UI framework. Component tree: `Layout.astro` → `src/sections/*.astro`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/layouts/Layout.astro` | New | Base layout (head, meta, nav, footer slot) |
| `src/sections/*.astro` | New | 8 section components |
| `src/styles/global.css` | New | Ported design tokens + component styles |
| `public/` | New | Favicon, OG image, Autos JC screenshots |
| `astro.config.mjs` | New | Astro config with deploy adapter |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Scope creep (too many sections for v1) | High | Explicit out-of-scope list; defer testimonials and pricing |
| Mobile menu JS not implemented | Medium | Minimal vanilla JS toggle in Navbar component |
| Portfolio credibility (brother's project) | Low | Frame Autos JC as commercial delivery, not "family favor" |
| No real testimonials available | Medium | Skip testimonials entirely for v1; do not fake social proof |
| Over-engineering with frameworks | Low | Strict 0KB JS target; no React, no islands |

## Rollback Plan

Astro outputs pure static HTML. Revert by removing the deploy from Vercel/Netlify and restoring the original prototype HTML file. No database migrations, no API changes, no state to lose.

## Dependencies

- Node.js ≥18 (Astro requirement)
- Real WhatsApp number (replace `5491112345678` placeholder)
- Autos JC screenshots (2-3 images from the live application)

## Success Criteria

- [ ] Lighthouse Performance ≥90, loads in <2s on 3G
- [ ] All 8 sections render correctly on mobile (375px) and desktop (1440px)
- [ ] WhatsApp link and email form are functional
- [ ] OG/Twitter Card preview renders correctly when shared
- [ ] ≤1KB JavaScript shipped (hamburger menu toggle only)
- [ ] Deployed and accessible via Vercel or Netlify URL
- [ ] Landings Express grid shows ≥4 template preview cards
