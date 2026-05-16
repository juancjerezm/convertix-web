# ambient-animations Specification

## Purpose

Subtle continuous background motion: canvas particle constellation (Anime.js-driven) + enhanced blob morphing (Anime.js timeline replacing CSS keyframes). Premium depth signal without competing with content. Mobile performance prioritized above all.

## Requirements

| # | Requirement | Strength | Scenarios |
|---|-------------|----------|-----------|
| R1 | Particle Constellation Rendering | MUST | 4 |
| R2 | Blob Border-Radius Morphing | MUST | 3 |
| R3 | prefers-reduced-motion Off-Ramp | MUST | 3 |
| R4 | Mobile Adaptation | MUST | 2 |
| R5 | Theme-Responsive Opacity | MUST | 3 |
| R6 | Z-Index Layer Order | MUST | 2 |
| R7 | Accessibility Attributes | MUST | 2 |
| R8 | Static JS-Fallback | MUST | 1 |
| R9 | Dependency Pinning | MUST | 1 |
| R10 | Performance Budget | MUST | 2 |

### Requirement: Particle Constellation Rendering

The system MUST render a fixed-position `<canvas>` with animated particles connected by proximity lines. All animation MUST be driven by `animejs@3.2.2`. Desktop MUST render ~60 particles. The canvas MUST cover the full viewport (`position: fixed; inset: 0`). Particles MUST use `--accent-blue` color with opacity from CSS variables.

#### Scenario: Desktop constellation renders on load

- GIVEN a viewport width ≥768px
- WHEN the page loads and JS executes
- THEN a canvas renders ~60 particles with connecting lines AND particles animate continuously

#### Scenario: Connecting lines appear between proximate particles

- GIVEN particles are rendered on canvas
- WHEN two particles are within connection radius
- THEN a semi-transparent line connects them using `var(--particle-line-opacity)`

#### Scenario: Canvas resizes with viewport

- GIVEN the particle canvas is rendered
- WHEN the browser window is resized
- THEN the canvas dimensions update to match the new viewport

#### Scenario: Animation runs at smooth frame rate

- GIVEN desktop viewport AND a mid-range device (not flagship)
- WHEN particles are animating
- THEN frame rate stays ≥30fps AND no visible jank

### Requirement: Blob Border-Radius Morphing

The system MUST replace existing CSS `@keyframes floatBlob` in `DecorativeBlobs.astro` with an Anime.js timeline that morphs `border-radius` between ≥4 distinct organic shapes. CSS `filter: blur()` and `opacity` MUST remain unchanged. Existing mobile breakpoint (≤768px) for blur and blob sizes MUST be preserved.

#### Scenario: Blobs morph through organic shapes

- GIVEN the page has loaded
- WHEN the Anime.js timeline runs
- THEN each blob's `border-radius` transitions through ≥4 asymmetric values over the animation cycle

#### Scenario: Blur and opacity remain CSS-driven

- GIVEN blobs are animating via Anime.js
- WHEN inspecting rendered blob elements
- THEN `filter: blur(130px)` and `opacity` are set via CSS, not JS

#### Scenario: Existing floatBlob keyframes removed

- GIVEN `DecorativeBlobs.astro` is loaded
- WHEN inspecting component styles
- THEN the `@keyframes floatBlob` block is absent AND float animation is now JS-driven

### Requirement: prefers-reduced-motion Off-Ramp

The system MUST detect `prefers-reduced-motion: reduce` and disable ALL ambient animations. Blobs MUST render static (no morphing). Particle canvas MUST stop rendering entirely.

#### Scenario: Reduce motion disables particles

- GIVEN OS `prefers-reduced-motion: reduce` is active
- WHEN the page loads
- THEN the particle canvas is present but renders NO particles AND no animation runs

#### Scenario: Reduce motion freezes blobs

- GIVEN OS `prefers-reduced-motion: reduce` is active
- WHEN the page loads
- THEN blobs render at their default border-radius AND no morphing timeline runs

#### Scenario: No-reduce runs full animations

- GIVEN OS `prefers-reduced-motion: no-preference`
- WHEN the page loads
- THEN particles animate AND blobs morph normally

### Requirement: Mobile Adaptation

On viewports <768px, the system MUST reduce particle count to ~25, reduce connection radius, and preserve existing mobile blob sizes. Performance on mid-range phones MUST be smooth.

#### Scenario: Mobile reduces particle count

- GIVEN viewport width is 375px (typical mid-range phone)
- WHEN the particle constellation renders
- THEN ≤30 particles are drawn AND connection radius is smaller than desktop

#### Scenario: Mobile blob sizes unchanged

- GIVEN viewport width <768px
- WHEN `DecorativeBlobs` renders
- THEN blob sizes match existing mobile breakpoint (400px, 300px, 350px) AND blur is 80px

### Requirement: Theme-Responsive Opacity

The system MUST define `--particle-opacity` and `--particle-line-opacity` CSS custom properties. Dark mode SHALL use higher opacity values. Light mode SHALL halve both. Theme toggle MUST update particle canvas appearance without flash.

#### Scenario: Dark mode opacities

- GIVEN `<html data-theme="dark">`
- WHEN particle canvas reads CSS variables
- THEN particle dots render at opacity 0.3 AND lines at opacity 0.08

#### Scenario: Light mode opacities

- GIVEN `<html data-theme="light">`
- WHEN particle canvas reads CSS variables
- THEN particle dots render at opacity 0.15 AND lines at opacity 0.04

#### Scenario: Theme toggle updates particles

- GIVEN particle canvas is rendered in dark mode
- WHEN visitor toggles to light mode
- THEN particle opacities update to light mode values within one animation frame

### Requirement: Z-Index Layer Order

The system MUST maintain visual layer order: particles at z-index -1, blobs at z-index 0, content at z-index 1, grain overlay at 9999, scroll-progress at 10000.

#### Scenario: Particles render behind blobs

- GIVEN both components are rendered
- WHEN inspecting z-index stacking
- THEN `#particle-canvas` has z-index -1 AND `.bg-blobs` has z-index 0

#### Scenario: Content renders above all ambient effects

- GIVEN all layers are rendered
- WHEN inspecting `<main>` element
- THEN main content has z-index >0 AND is visually above both blobs and particles

### Requirement: Accessibility Attributes

Both `ParticleConstellation.astro` and `DecorativeBlobs.astro` MUST include `aria-hidden="true"`. Axe-core audit MUST produce zero violations.

#### Scenario: Particle canvas aria-hidden

- GIVEN the page is rendered
- WHEN running axe-core accessibility audit
- THEN `#particle-canvas` has `aria-hidden="true"` AND zero accessibility violations are reported

#### Scenario: Decorative blobs aria-hidden preserved

- GIVEN the page is rendered
- WHEN running axe-core accessibility audit
- THEN `.bg-blobs` has `aria-hidden="true"` AND zero accessibility violations are reported

### Requirement: Static JS-Fallback

When JavaScript fails to load or execute, the particle canvas MUST render as an empty element with `aria-hidden="true"`. The page layout MUST NOT break. No content shift or broken layout.

#### Scenario: Canvas empty when JS blocked

- GIVEN JavaScript execution fails (network error, ad-blocker)
- WHEN the page renders via SSR
- THEN the canvas element is in the DOM but empty AND page layout is intact

### Requirement: Dependency Pinning

The project MUST install `animejs@3.2.2` via pnpm with exact version. npm MUST NOT be used. No other animation libraries.

#### Scenario: Correct dependency installed

- GIVEN `pnpm install` has been run
- WHEN checking `package.json` dependencies
- THEN `"animejs": "3.2.2"` is present (exact) AND no caret/tilde prefix

### Requirement: Performance Budget

Lighthouse performance score MUST remain within ±2 points of pre-change baseline. Mid-range mobile device (Snapdragon 695 / Apple A13 equivalent) MUST maintain ≥30fps during animation.

#### Scenario: Lighthouse unchanged

- GIVEN production build is deployed
- WHEN running Lighthouse audit (mobile, 4x CPU throttle)
- THEN performance score is within 2 points of pre-change score

#### Scenario: Mid-range phone smooth animation

- GIVEN a mid-range mobile device at 360-414px viewport
- WHEN all animations are running simultaneously
- THEN frame rate stays ≥30fps AND no frame drops over 200ms
