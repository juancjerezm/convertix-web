# Tasks: Ambient Animations

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~420 (±40) |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (infra + components) → PR 2 (tests + verification) |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Install dependency, create CSS vars, build both components, wire layout | PR 1 | Targets `feature/ambient-animations` branch; ~270 lines |
| 2 | Write Playwright tests, run axe-core + Lighthouse | PR 2 | Targets PR 1 branch; ~150 lines; depends on Unit 1 |

---

## Phase 1: Foundation

- [ ] 1.1 Add `animejs@3.2.2` to `dependencies` in `package.json` and run `pnpm install`
- [ ] 1.2 Add `--particle-opacity` and `--particle-line-opacity` to `:root` and `[data-theme="light"]` in `src/styles/global.css`
- [ ] 1.3 Verify ESM import `import anime from 'animejs/lib/anime.es.js'` resolves in Astro dev build

## Phase 2: Core Implementation

### ParticleConstellation.astro

- [ ] 2.1 Create `src/components/ParticleConstellation.astro` with `<canvas id="particle-canvas" aria-hidden="true">`, scoped `<style>` (`position:fixed;inset:0;z-index:-1;pointer-events:none`), and hoisted `<script>`
- [ ] 2.2 Implement `initParticles()` in script: create particle objects with `x`, `y`, `vx`, `vy`, count = `canvas.width < 768 ? 25 : 60`
- [ ] 2.3 Implement rAF draw loop: clear canvas, draw particles as circles using `--particle-opacity`, draw proximity lines using `--particle-line-opacity` (desktop radius > mobile radius)
- [ ] 2.4 Add `ResizeObserver` on `document.documentElement` to update `canvas.width/height` and re-init particle count on viewport change
- [ ] 2.5 Add `MutationObserver` on `<html>` (`attributeFilter: ['data-theme']`) to read new `--particle-opacity` / `--particle-line-opacity` via `getComputedStyle` and trigger redraw
- [ ] 2.6 Gate all animation behind `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check — if true, render static dots only (no rAF loop)
- [ ] 2.7 Add Anime.js staggered timeline (`loop:true, direction:'alternate'`) to drive particle `x`/`y` drift with `anime.stagger(100)` for organic desync

### DecorativeBlobs.astro

- [ ] 2.8 Remove `@keyframes floatBlob` block and all `animation` / `animation-delay` declarations from `.bg-blob--1`, `.bg-blob--2`, `.bg-blob--3`
- [ ] 2.9 Add hoisted `<script>` importing animejs; create 3 independent timelines morphing `borderRadius` through ≥4 asymmetric values per blob (`loop:true, direction:'alternate', duration:~20000`)
- [ ] 2.10 Gate blob timelines behind same `prefers-reduced-motion: reduce` check — if true, skip timeline creation
- [ ] 2.11 Preserve existing CSS: `filter:blur(130px)` (80px mobile), `opacity`, positioning, mobile breakpoint sizes (400px/300px/350px)

### Layout Wiring

- [ ] 2.12 Import `ParticleConstellation` in `src/layouts/BaseLayout.astro` and render `<ParticleConstellation />` before `<DecorativeBlobs />` to maintain z-index stacking

## Phase 3: Testing & Verification

- [ ] 3.1 Playwright test (R1 Scenario 1): screenshot at 1440px verifies canvas particles render; screenshot at 375px verifies ≤30 particles (R4 Scenario 1)
- [ ] 3.2 Playwright test (R2 Scenario 1): capture computed `border-radius` at 4+ timestamps per blob to verify ≥4 distinct shapes
- [ ] 3.3 Playwright test (R3 Scenario 1+2): emulate `prefers-reduced-motion: reduce`, verify canvas shows static dots and blob border-radius does not change over 5s
- [ ] 3.4 Playwright test (R5 Scenario 3): toggle theme, sample canvas pixel color to verify opacity shift within 1 animation frame
- [ ] 3.5 Axe-core audit (R7 Scenario 1+2): run `@axe-core/playwright` on homepage; assert zero violations and `aria-hidden="true"` on `#particle-canvas` and `.bg-blobs`
- [ ] 3.6 Lighthouse audit (R10 Scenario 1): run mobile simulation; assert performance score within ±2 points of pre-change baseline
- [ ] 3.7 Manual verification (R8 Scenario 1): disable JS in browser, confirm empty canvas and intact layout

## Phase 4: Cleanup & Rollback Check

- [ ] 4.1 Verify rollback: remove `ParticleConstellation` import, revert `DecorativeBlobs` keyframes, delete CSS vars, `pnpm remove animejs`, confirm site renders identically to pre-change state
- [ ] 4.2 Add inline code comments in `ParticleConstellation.astro` explaining MutationObserver + ResizeObserver rationale
