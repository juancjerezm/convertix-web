# Exploration: Ambient Animations

## Current State

- **Stack**: Astro 6.x static output, zero client-side JS libraries (only vanilla scripts: typewriter, scroll-progress, scroll-reveal)
- **Existing background**: `DecorativeBlobs.astro` — 3 CSS-animated divs with `filter: blur(130px)`, `opacity: 0.07`, positioned `fixed` at `z-index: 0`. Uses `--accent-purple` / `--accent-blue` colors. Animation is pure CSS `@keyframes floatBlob`.
- **Layering**: `<main>` at z-index 1, grain overlay at z-index 9999, scroll-progress at z-index 10000
- **CSS variables**: `--accent-blue: #0070f3`, `--accent-purple: #7928ca`, `--accent-blue-rgb: 0, 112, 243`, `--gradient: linear-gradient(135deg, #0070f3, #7928ca)`
- **Dark/light mode**: Light mode adjusts glow opacity variables (halves opacity), but NOT accent colors themselves
- **Dependencies**: pnpm, only astro + @astrojs/netlify + @astrojs/sitemap + playwright + sharp

## Affected Areas

| File | Impact |
|------|--------|
| `src/components/DecorativeBlobs.astro` | Modify — add Anime.js timeline for border-radius morphing, replace CSS keyframes |
| `src/components/ParticleConstellation.astro` | **CREATE** — Canvas element + Anime.js for particle constellation |
| `src/layouts/BaseLayout.astro` | Modify — import ParticleConstellation alongside DecorativeBlobs |
| `src/styles/global.css` | Modify — add `--particle-opacity`, `--particle-line-opacity` CSS vars |
| `package.json` | Modify — add `animejs@3.2.2` |

## Approaches

### 1. Canvas Particles + Anime.js Blob Enhancement (RECOMMENDED)

- **Particles**: `<canvas>` element rendered client-side with Anime.js controlling positions and line connections. Separate `ParticleConstellation.astro` component.
- **Blob morphing**: Enhance existing `DecorativeBlobs.astro` — replace CSS `@keyframes floatBlob` with Anime.js timelines that morph `borderRadius` between organic shapes. Keep CSS `filter: blur()` (GPU-composited).
- **Anime.js via npm** (`pnpm add animejs@3.2.2`) — Astro bundles it, ~17KB gzip.

**Pros**:
- Canvas particles are GPU-accelerated, off-main-thread compositing
- Reuses existing blob component — minimal DOM change
- Anime.js drives timing for both effects precisely
- npm = version-locked, tree-shakeable, no CDN fingerprinting

**Cons**:
- Adds runtime dependency (~17KB gzip)
- Canvas needs resize listener + mobile breakpoint
- Requires prefers-reduced-motion check

**Effort**: Medium

### 2. Pure CSS Particles + CSS Blob Enhancement

- No JS library. Particles as CSS-animated divs (15-30 max). Lines between particles impossible in pure CSS.

**Pros**: Zero dependency weight, simple

**Cons**: **Cannot produce constellation effect** — no line connections in CSS. Defeats the core requirement.

**Effort**: Low (but fails requirements)

### 3. Full Canvas for Both

- Single `<canvas>` rendering particles AND blobs.

**Pros**: Single compositing layer

**Cons**: `filter: blur(130px)` on canvas is a per-pixel CPU operation — catastrophic for performance. CSS blur is hardware-composited essentially free.

**Effort**: High, worse perf than Approach 1

## Recommendation

**Approach 1**: Canvas particles via Anime.js + enhance existing CSS blobs with Anime.js.

Why:
- Constellation effect (particles + lines) **requires** canvas. SVG `<line>` elements tracking N particles = O(N²) DOM updates = jank.
- Blob morphing is already well-served by CSS blur+opacity. Anime.js drives the *animation values* (position, scale, border-radius) but renders via DOM elements — keeps CSS blur compositor optimization.
- "Best tool for each job" split: canvas for constellation, DOM+CSS for blob morphing.

## Z-index Layering

| Layer | z-index | What |
|-------|---------|------|
| Canvas | -1 | #particle-canvas (constellation behind blobs) |
| Blobs | 0 | .bg-blobs (morphing blobs, existing) |
| Content | 1 | main content |
| Grain | 9999 | body::after grain overlay |
| Progress | 10000 | scroll-progress bar |

## Dark/Light Mode Colors

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Particle dots | `rgba(0,112,243,0.3)` | `rgba(0,112,243,0.15)` |
| Particle lines | `rgba(0,112,243,0.08)` | `rgba(0,112,243,0.04)` |

New CSS custom properties:
- `--particle-opacity` (dark: 0.3, light: 0.15)
- `--particle-line-opacity` (dark: 0.08, light: 0.04)

## Performance Guarantees

- `prefers-reduced-motion: reduce` → disable ALL animations, show static state only
- Mobile (<768px): reduce particle count from ~60 to ~25, reduce connection radius
- Canvas uses `{ passive: true }` on resize listener
- Anime.js uses `will-change: transform` auto on animated DOM elements

## Coexistence

- Two separate components: `ParticleConstellation.astro` and `DecorativeBlobs.astro`
- No shared state. They visually layer naturally.
- Blob morphing keeps CSS blur (GPU-composited). Particles on own canvas layer.

## Risks

1. **Anime.js v4 vs v3**: v4 has breaking API changes. **Pin to `animejs@3.2.2`**.
2. **Canvas resize + SSR**: Script must be client-side only. Use `<script>` (module, not `is:inline`) — Astro handles this.
3. **CLS risk**: Canvas must get explicit dimensions matching viewport before first paint. Set `position: fixed; inset: 0` in Astro template styles, not in JS.
4. **Mobile GPU pressure**: Simultaneous CSS blur morphing + canvas on low-end phones could drop frames. Must implement reduced-motion + mobile particle limits.
5. **Accessibility**: Both effects need `aria-hidden="true"` and `prefers-reduced-motion` disabling.

## Ready for Proposal

**Yes**. Approach 1 is the clear winner. Proceed to `sdd-propose` for the "ambient-animations" change.