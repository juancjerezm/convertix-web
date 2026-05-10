# Tasks: Light Mode Toggle

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | N/A |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation — CSS Variables (~80 lines)

- [x] 1.1 Add 12 new variables to `:root` in `src/styles/global.css` with dark defaults per design mapping. Covers R6.
- [x] 1.2 Replace 12 hardcoded color values in `src/styles/global.css` with `var(--...)` references. Covers R6.
- [x] 1.3 Add `[data-theme="light"]` override block overriding 17 variables. Covers R2, R6.

## Phase 2: Core Wiring — Script & Toggle (~55 lines)

- [x] 2.1 Add `data-theme="dark"` to `<html>` and insert inline blocking script before Google Fonts in `src/layouts/BaseLayout.astro`. Covers R1, R3.
- [x] 2.2 Insert sun/moon toggle button with inline SVGs into `src/components/Navbar.astro` between `.nav-links` and `.nav-cta`. Covers R2.
- [x] 2.3 Add click handler in `src/components/Navbar.astro` script to toggle `data-theme` and save to localStorage. Covers R2, R3.
- [x] 2.4 Add toggle button CSS to `src/components/Navbar.astro`. Covers R2.

## Phase 3: Integration (~4 lines)

- [x] 3.1 Replace card hover border/shadow in `src/components/LandingsExpress.astro` with `var(--card-hover-border)` and `var(--card-hover-shadow)`. Covers R6.

## Phase 4: Verification

- [ ] 4.1 R1: Verify default dark on first visit and OS `prefers-color-scheme` fallback.
- [ ] 4.2 R2+R3: Verify toggle switches mode and persists across reloads.
- [ ] 4.3 R4: Verify accent colors and CTA gradient are identical in both modes.
- [ ] 4.4 R5: Verify grain overlay opacity and blend mode match across modes.
- [ ] 4.5 R6: Verify dark mode renders identically to pre-change state.
