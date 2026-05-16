# Proposal: Ambient Animations

## Intent

The site's static background lacks depth — barely perceptible blur blobs against a flat dark surface. We need subtle continuous motion (particle constellation + organic blob morphing) that signals premium quality without distracting from content.

## Scope

### In Scope
- `ParticleConstellation.astro`: Canvas particle system (~60 dots, line connections, Anime.js-driven)
- `DecorativeBlobs.astro` enhancement: Replace CSS `@keyframes floatBlob` with Anime.js timeline morphing `border-radius`
- Two new CSS custom properties: `--particle-opacity`, `--particle-line-opacity` (dark/light variants)
- `prefers-reduced-motion: reduce` → disable all animation, show static state
- Mobile breakpoint: halve particle count (~25), reduce connection radius
- `aria-hidden="true"` on both components
- `pnpm add animejs@3.2.2`

### Out of Scope
- User-configurable animation toggles
- Parallax, scroll-linked, or mouse-follow interactions
- Audio reactivity
- Canvas-based blob rendering (CSS blur stays — hardware-composited)

## Capabilities

### New Capabilities
- `ambient-animations`: Canvas particle constellation + Anime.js-enhanced blob morphing; theme-responsive opacity; `prefers-reduced-motion` off-ramp; axe-core-clean accessibility

### Modified Capabilities
- None. New CSS vars are additive. `theme-toggle` accent color invariance (R4) is fully preserved.

## Approach

**Split architecture — best tool per job**:
1. **Particles**: `<canvas>` with Anime.js position/lines. Canvas is the only way to draw inter-particle lines without O(N²) DOM churn.
2. **Blobs**: Existing 3-blob DOM structure. Anime.js timeline replaces CSS keyframes, drives `border-radius` toward asymmetric organic shapes. CSS `filter: blur(130px)` remains — GPU-composited, essentially free.

**Stack**: Astro 6.x, TailwindCSS 4, pnpm. `animejs@3.2.2` pinned (~17KB gzip).

**Z-index**: particles (-1) → blobs (0) → content (1) → grain (9999) → scroll-progress (10000).

**Theme**: Dark mode `rgba(0,112,243,0.3)` dots / `rgba(0,112,243,0.08)` lines. Light mode halves both opacities.

**Injection**: `BaseLayout.astro` imports `ParticleConstellation` before `DecorativeBlobs`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/ParticleConstellation.astro` | New | Canvas + Anime.js particle system |
| `src/components/DecorativeBlobs.astro` | Modified | Anime.js border-radius morphing timeline |
| `src/layouts/BaseLayout.astro` | Modified | Import new component, maintain layer order |
| `src/styles/global.css` | Modified | Add `--particle-opacity`, `--particle-line-opacity` |
| `package.json` | Modified | `animejs@3.2.2` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Anime.js v4 API breakage | Low | Pin exact v3.2.2 |
| Canvas CLS on load | Low | Fixed position + explicit `inset: 0` in Astro template |
| Mobile GPU pressure (blur + canvas) | Med | Halved particles, smaller radius, `prefers-reduced-motion` off-ramp |
| JS fails to load (static SSR) | Low | Empty `<canvas>` with `aria-hidden`; no layout break |
| Theme flash (stale canvas colors) | Low | Canvas reads `getComputedStyle` on mount; vars in Astro scoped styles |

## Rollback Plan

1. Remove `ParticleConstellation` import from `BaseLayout.astro`
2. Revert `DecorativeBlobs.astro` to CSS `@keyframes floatBlob` (keep backup)
3. Remove new CSS vars from `global.css`
4. `pnpm remove animejs`
5. Delete `ParticleConstellation.astro`
6. Verify site renders identically to pre-change state

## Dependencies

- `animejs@3.2.2` — no other new dependencies

## Success Criteria

- [ ] Constellation renders 60 desktop / 25 mobile particles without jank
- [ ] Blobs morph between ≥4 distinct organic shapes
- [ ] `prefers-reduced-motion: reduce` → static blobs, no canvas particles
- [ ] Light/dark mode switches opacity correctly, no flash
- [ ] Lighthouse performance unchanged (±2 points)
- [ ] Both components `aria-hidden="true"`, pass axe-core
