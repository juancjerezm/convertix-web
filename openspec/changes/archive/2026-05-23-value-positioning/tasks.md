# Tasks: Value Positioning

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~290 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 `src/styles/global.css` — add `.feature-list` with `li::before` checkmark (`var(--accent-blue)`), plus `@media (max-width: 768px)` for 2-col grid
- [x] 1.2 `src/components/FeaturesGrid.astro` — create 3 cards with user design bullets (NOT spec bullets), scoped styles, hover lift/shadow/accent-line, responsive 3→2→1 columns

## Phase 2: Content Updates

- [x] 2.1 `src/components/Hero.astro` — replace h1 headline; keep typing animation, CTA buttons, subtitle
- [x] 2.2 `src/components/ProcessTimeline.astro` — title → "Método Vuelo"; steps → Despegue/Impulso/Órbita; adjust descriptions; keep `data-number`
- [x] 2.3 `src/data/templates.json` — landing $400.000, profesional $450.000, negocio-local $500.000, blog $550.000

## Phase 3: Integration & Cleanup

- [x] 3.1 `src/pages/index.astro` — swap import to `FeaturesGrid`, render in same slot
- [x] 3.2 Delete `src/components/ServicesGrid.astro`

## Phase 4: Verification

- [x] 4.1 Run `pnpm build` — zero errors
- [x] 4.2 Visual check — 3-col→2-col→1-col, hero wraps at 375px, theme toggle works
