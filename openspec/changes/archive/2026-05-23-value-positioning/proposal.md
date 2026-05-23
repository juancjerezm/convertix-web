# Proposal: Value Positioning

## Intent

Convertix Web's landing page undersells its value. Competitors use detailed feature breakdowns, branded methodologies, and value-anchored pricing to build trust. Our page has 3 vague service cards, a generic process timeline, and a speed-only hero. Visitors don't see what they're getting. This change evolves the value proposition to match competitor transparency while keeping Convertix's identity: custom development, better technology, fair pricing. No price anchoring. No WordPress bashing.

## Scope

### In Scope
- Replace ServicesGrid.astro with FeaturesGrid.astro — 3-column detailed deliverable grid (Desarrollo a Medida, Performance & Seguridad, Entrega & Soporte) with 6 bullet points per column
- Update Hero.astro headline/subtitle to soft value proposition: "La web que tu negocio necesita, con la tecnología que usan las startups, sin pagar de más."
- Brand ProcessTimeline.astro section header "Método Vuelo" and rename steps: Despegue → Impulso → Órbita
- Sync templates.json prices to FAQ ($400K base for landing), adjust other tiers proportionally
- Update index.astro import: ServicesGrid → FeaturesGrid

### Out of Scope
- Template card UI changes (do NOT show prices)
- Portfolio, FAQ, Contact, or CtaFinal sections
- CSS system overhaul
- Dark/light theme changes
- WordPress/competitor attacks in copy

## Capabilities

### New Capabilities
None — FeaturesGrid replaces ServicesGrid within the existing capability structure.

### Modified Capabilities
- `landing-services`: requirement "three service cards" replaced by detailed feature grid with deliverable lists
- `landing-hero`: headline and subtitle copy updated
- `landing-process`: step titles renamed (Despegue, Impulso, Órbita), section header includes methodology brand

## Approach

1. Create `FeaturesGrid.astro` using existing `.service-card` CSS pattern, extend with `<ul>` lists inside cards
2. Edit `Hero.astro` — replace headline and subtitle, keep typing animation and CTA buttons
3. Edit `ProcessTimeline.astro` — add section label "Método Vuelo", update step names
4. Edit `templates.json` — landing: $400K, profesional: $450K, negocio-local: $510K, blog: $560K (proportional to current ratios)
5. Edit `index.astro` — rename import

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/FeaturesGrid.astro` | New | 3-column feature deliverable grid (replaces ServicesGrid) |
| `src/components/Hero.astro` | Modified | Headline + subtitle copy |
| `src/components/ProcessTimeline.astro` | Modified | Step names + section branding |
| `src/data/templates.json` | Modified | Price sync to FAQ |
| `src/pages/index.astro` | Modified | Import rename |
| `src/styles/global.css` | Modified | `.feature-list` styles for card bullets |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| "Hosting sin costo mensual" claim invalid after Hetzner migration | Low | Phrase as "hosting incluido" — agnostic to provider |
| FeaturesGrid `<ul>` inside cards needs new CSS | Medium | Add `.feature-list` selector to global.css; style with `list-style: none` + emoji pseudo-elements |
| Removing ServicesGrid removes "project types" context | Low | FAQ covers pricing context; FeaturesGrid covers deliverables |
| Price sync may surprise existing customers | Low | Current JSON prices are unused in UI; no impact |

## Rollback Plan

1. Revert `index.astro` import to `ServicesGrid.astro`
2. Revert `Hero.astro`, `ProcessTimeline.astro` edits via git checkout
3. Revert `templates.json` via git checkout
4. Delete `FeaturesGrid.astro`
5. `global.css` additions are additive — no rollback needed unless they conflict

## Dependencies

- None. All changes are self-contained within the Astro component layer and data JSON.

## Success Criteria

- [ ] FeaturesGrid renders 3 columns on desktop, stacks on mobile (≤768px)
- [ ] Hero shows new headline without overflow on 375px viewport
- [ ] ProcessTimeline shows "Método Vuelo" header and renamed steps (Despegue, Impulso, Órbita)
- [ ] templates.json landing price reads "$400.000"
- [ ] No visual regressions: dark/light theme, reveal animations, existing sections intact
