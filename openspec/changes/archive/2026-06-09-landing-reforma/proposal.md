# Proposal: Landing Reforma — Web + AI Repositioning

## Intent

Reposition Convertix from "web development only" to "web + AI automation for Colombian SMEs." The landing must communicate both lines — Convertix Web (websites) and Convertix AI (chatbots, Python automation, RAG) — to match the founder's pivot and new product portfolio.

## Scope

### In Scope
- **Phase 1 — Bugfix**: Fix broken `LandingsExpress.astro` (missing `templates` import)
- **Phase 2 — Core Reform**: Remove dead typewriter script from Hero; insert `ConvertixAI` section into `index.astro` between FeaturesGrid and ProcessTimeline; update CTA text to "Cuéntame tu proyecto"; add `#ai` Navbar link
- **Phase 3 — SEO**: Add `<meta name="keywords">`, enrich Schema.org `knowsAbout`, update title/description with Colombia + AI terms
- **Phase 4 — Visual Polish**: `text-wrap: balance` on headings, `scale(0.96)` on button press, `tabular-nums` on numbers, `transition-property` explicit, 40×40px hit areas, image outlines

### Out of Scope
- Demo pages (demos/ folder) — standalone, untouched
- ParticleConstellation and DecorativeBlobs ambient animations
- Theme system (dark/light CSS variables)
- Netlify form configuration
- Navbar/Footer restructure (add link only)
- Dedicated pricing section (decision pending, deferred to Phase 5)

## Capabilities

### New Capabilities
- `convertix-ai-section`: AI product showcase (chatbot WhatsApp, Python automation, consultoría) rendered between FeaturesGrid and ProcessTimeline with 3 cards + CTA, using `accent-purple` theme and `id="ai"` anchor

### Modified Capabilities
- `landing-hero`: REMOVE typewriter cycling animation requirement — headline displays static with ScrollReveal fade-in as sole reveal effect
- `landing-layout`: INSERT `ConvertixAI` after FeaturesGrid; ADD `#ai` entry to Navbar links
- `landing-seo`: ADD `<meta name="keywords">` with Colombian SME terms; ENRICH Schema.org `knowsAbout` with AI/automation keywords; UPDATE title and description for SEO

## Approach

Phased implementation, each phase independently testable:
1. **Bugfix first** — LandingsExpress import (unblocks build)
2. **Core Reform** — dead code removal → component insertion → CTA copy → nav link (4 atomic commits)
3. **SEO enrichment** — meta tags, Schema.org, title/desc updates
4. **Visual polish** — CSS-only refinements from the 12-principle checklist

All changes within `src/` (Astro components + pages). No new dependencies. E2E tests via Playwright per `strict_tdd: true` in config.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/LandingsExpress.astro` | Bugfix | Add missing `templates` import |
| `src/components/Hero.astro` | Modified | Remove dead typewriter script (lines 19-57) |
| `src/pages/index.astro` | Modified | Insert `<ConvertixAI />` between FeaturesGrid and ProcessTimeline |
| `src/components/CtaFinal.astro` | Modified | Update CTA text + WhatsApp message |
| `src/components/Navbar.astro` | Modified | Add `#ai` link |
| `src/components/SEO.astro` | Modified | Add keywords meta tag |
| `src/components/StructuredData.astro` | Modified | Enrich `knowsAbout` |
| `src/layouts/BaseLayout.astro` | Modified | Update default title/description |
| `src/styles/global.css` | Modified | Visual polish CSS refinements |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| LandingsExpress still broken after fix | Low | Verify `templates.json` path exists; test build |
| `#ai` Navbar anchor breaks scroll position | Low | Verify section ID matches; test on mobile |
| Typewriter removal affects hero visual | Low | Confirmed ScrollReveal fade-in is primary effect |
| Schema.org changes break structured data | Low | Validate with Google Rich Results Test |
| Visual polish causes layout shift | Med | Apply CSS incrementally; E2E visual diff per change |

## Rollback Plan

Revert `index.astro` to remove `<ConvertixAI />` import. Revert Navbar link. Revert Hero script removal. Each phase is independently revertible via `git revert` on the specific commit. Schema.org and SEO changes are additive — no destructive mutations.

## Dependencies

- Exploration findings in Engram (`sdd/landing-reforma/explore`)
- Target keywords from `convertix-brain/01-Negocio/Marketing/Especificaciones/Keywords SEO Landing.md`
- `ConvertixAI.astro` component (already exists, tested)
- Playwright E2E suite for verification

## Success Criteria

- [ ] `LandingsExpress` builds without error
- [ ] `ConvertixAI` section visible on landing page between FeaturesGrid and ProcessTimeline
- [ ] Dead typewriter script removed from Hero without visual regression
- [ ] CTA shows "Cuéntame tu proyecto" with proper WhatsApp message
- [ ] Navbar includes functional `#ai` link
- [ ] `<meta name="keywords">` present with Colombian SME target terms
- [ ] Schema.org `knowsAbout` includes AI/automation terms
- [ ] All E2E tests pass (Playwright + axe-core)
- [ ] Lighthouse SEO score ≥ 95
- [ ] No visual regressions on mobile (375px) or desktop (1440px)
