# Design: Ambient Animations

## Technical Approach

Two independent components share `animejs@3.2.2` but operate on separate layers:
1. **`ParticleConstellation.astro`**: `<canvas>` renders ~60 (desktop) / ~25 (mobile) dots with proximity lines. Anime.js drives particle positions via staggered timeline; `requestAnimationFrame` handles canvas drawing. Theme-responsive via `getComputedStyle` on each `data-theme` change (MutationObserver).
2. **`DecorativeBlobs.astro`**: Existing 3-blob DOM structure preserved. CSS `@keyframes floatBlob` replaced with Anime.js timelines that morph `border-radius` through ≥4 asymmetric shapes. CSS `filter: blur()` and `opacity` unchanged — GPU-composited, essentially free.

Both components check `prefers-reduced-motion: reduce` before activating. Both use `aria-hidden="true"`. Both follow existing Astro `<script>` convention (not `is:inline` — Astro bundles the ESM import).

## Architecture Decisions

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| **Script type** | `is:inline` vs `<script>` (hoisted) | `<script>` (default) | Anime.js must be bundled via ESM import (`import anime from 'animejs/lib/anime.es.js'`). Inline scripts can't resolve `node_modules`. Existing Navbar script is inline because it has no imports. |
| **Canvas resize** | `window resize` event vs `ResizeObserver` | `ResizeObserver` on `document.documentElement` | Avoids debounce boilerplate. Fires only when viewport dimensions actually change (e.g., orientation, DevTools dock). No scroll-blocking concern. |
| **Theme listening** | `matchMedia` change vs `MutationObserver` | `MutationObserver` on `[data-theme]` | Theme toggle sets `data-theme` via `setAttribute`. MutationObserver catches both the toggle and any future programmatic changes. Canvas calls `getComputedStyle(documentElement)` and redraws on next frame. |
| **Particle movement** | rAF-only physics vs Anime.js-driven | Anime.js staggered timeline; rAF draws | Anime.js computes smooth positions via easing (organic drift). rAF reads current values purely for drawing — clean separation. Timeline uses `loop: true, direction: 'alternate'` with `anime.stagger(100)` for desynchronized motion. |
| **Blob shape count** | 2 shapes vs ≥4 shapes | ≥4 per blob (3 blobs × ≥4 shapes) | Spec requires ≥4 distinct organic shapes per blob. Each blob gets independent timeline with staggered start offsets. |
| **Particle count calc** | Media query string vs canvas width | `canvas.width < 768 ? 25 : 60` | Direct measurement avoids media query sync issues (no `matchMedia` listener needed). `ResizeObserver` already triggers count recalculation on resize. |
| **Canvas DPI scaling** | devicePixelRatio × CSS size vs 1:1 CSS pixels | 1:1 CSS pixels | Performance budget for mid-range phones. HiDPI scaling doubles pixel fill-rate — no visible benefit because CSS blur (130px) on blobs already softens the scene. |

## Data Flow

```
Theme Toggle (Navbar)
    │ setAttribute('data-theme', 'light'|'dark')
    ▼
<html data-theme="dark|light">
    │ CSS custom properties cascade
    ├──► Canvas reads via getComputedStyle(documentElement)
    │      └──► Updates particle/lines alpha on next draw frame
    └──► Blob DOM elements inherit via CSS (no JS needed for color)

MutationObserver(on <html>, attributeFilter: ['data-theme'])
    │ "data-theme" changed?
    ▼
Canvas → getComputedStyle → redraw with new --particle-opacity / --particle-line-opacity
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/ParticleConstellation.astro` | **Create** | Canvas component: markup (`<canvas id="particle-canvas" aria-hidden="true">`), scoped `<style>` (position:fixed; inset:0; z-index:-1; pointer-events:none), `<script>` (Anime.js import + particle init + MutationObserver + ResizeObserver + rAF draw loop) |
| `src/components/DecorativeBlobs.astro` | **Modify** | Remove `@keyframes floatBlob` and all `animation`/`animation-delay` props from `.bg-blob--1/2/3`. Add `<script>` with Anime.js timeline driving `borderRadius` morphing. Keep CSS positioning, sizing, `filter: blur()`, `opacity`, mobile breakpoint rules. |
| `src/layouts/BaseLayout.astro` | **Modify** | Add `import ParticleConstellation from '../components/ParticleConstellation.astro'`. Place `<ParticleConstellation />` before `<DecorativeBlobs />` in template. No other layout changes. |
| `src/styles/global.css` | **Modify** | Add `--particle-opacity` and `--particle-line-opacity` to `:root` (dark: 0.3, 0.08) and `[data-theme="light"]` (light: 0.15, 0.04). No other variable changes — accent colors untouched. |
| `package.json` | **Modify** | Add `"animejs": "3.2.2"` to `dependencies`. |

## Contracts

**CSS Variables** — additive, no breaking changes:

```css
:root {
  --particle-opacity: 0.3;
  --particle-line-opacity: 0.08;
}
[data-theme="light"] {
  --particle-opacity: 0.15;
  --particle-line-opacity: 0.04;
}
```

**Canvas element contract**: `<canvas id="particle-canvas">` — always present in DOM (SSR), empty when JS fails. `position: fixed; inset: 0; z-index: -1; pointer-events: none`. Queryable by tests via `#particle-canvas`.

**Blob timeline contract**: Each blob's `borderRadius` animates through ≥4 values per cycle. Duration: ~20s per blob. Existing DOM classes (`.bg-blobs`, `.bg-blob`, `.bg-blob--1/2/3`) unchanged.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Visual | Canvas renders on desktop/mobile | Playwright screenshot at 1440px and 375px, dark + light modes |
| Visual | Blobs morph shapes | Animation recording or frame capture comparison |
| Accessibility | `aria-hidden` + axe-core | `@axe-core/playwright` in same test run |
| Behavior | prefers-reduced-motion disables all | Emulate via `page.emulateMedia({ reducedMotion: 'reduce' })`, verify static canvas + static blobs |
| Behavior | JS fails gracefully | Block `animejs/lib/anime.es.js` route, verify canvas empty + no layout break |
| Integration | Theme toggle updates canvas | Click theme toggle, verify canvas colors change via pixel sampling |

## Migration / Rollout

No migration required. CSS vars are additive. New component import is additive. Rollback: remove import + CSS vars + dependency, revert DecorativeBlobs `@keyframes`.

## Open Questions

None. All design decisions resolved per proposal and exploration findings.
