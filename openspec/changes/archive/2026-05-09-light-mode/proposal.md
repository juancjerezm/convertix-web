# Proposal: Light Mode Toggle

## Intent
Visitors can switch from the default dark theme to a light theme. Preference persists via localStorage. No flash of wrong theme on load. Accent colors and button gradients remain identical across both modes.

## Scope

### In Scope
- CSS variables for light mode (`[data-theme="light"]` selector)
- Inline blocking `<script>` in `<head>` to apply theme before first paint
- Sun/moon toggle button in Navbar
- localStorage persistence (`theme` key: `"dark"` | `"light"`)
- First-visit OS preference fallback (`prefers-color-scheme`)
- New CSS variables for hardcoded colors (glows, borders, shadows, overlays)

### Out of Scope
- Demo pages (blog, negocio-local, profesional, landing) — each has its own self-contained theme
- Color picker or multi-theme system
- Animations/transitions on theme switch
- Automated tests for visual regression

## Capabilities

### New Capabilities
- `theme-toggle`: Light/dark mode switching with localStorage persistence and OS preference detection

### Modified Capabilities
None — this is a purely cosmetic CSS addition. No component behavior changes at the spec level.

## Approach
CSS-first with `[data-theme]` attribute on `<html>`. Default `<html data-theme="dark">` in BaseLayout.astro. Inline `<head>` script reads localStorage (fallback: `prefers-color-scheme`), sets attribute synchronously before render. Toggle button in Navbar updates attribute + localStorage. Accent colors/gradients stay identical per constraint. Hardcoded colors (card hover borders, shadows, overlay bg, body/hero/cta radial glows) converted to CSS variables.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modified | +40 lines: add `[data-theme="light"]` block + 12 new CSS variables to `:root` |
| `src/layouts/BaseLayout.astro` | Modified | +10 lines: `<html data-theme="dark">` + inline theme script in `<head>` |
| `src/components/Navbar.astro` | Modified | +5 lines: toggle button between hamburger and nav-cta |
| `src/components/LandingsExpress.astro` | Modified | lines 92,94: replace hardcoded rgba with CSS variables |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Flash of wrong theme (FOUC) | Low | Inline blocking script in `<head>` before any stylesheet; `data-theme` on `<html>` resolved pre-paint |
| Contrast issues with accent colors on light bg | Low | Accent colors unchanged; tested against `#ffffff` (WCAG AA for `#0070f3` on white: 4.6:1) |
| Navbar layout crowded with toggle | Low | Toggle is a compact 36×36px button; on mobile it sits next to hamburger |

## Rollback Plan
Remove `[data-theme="light"]` block from global.css, remove script from BaseLayout, remove toggle markup from Navbar. Revert `<html>` to bare tag. No DB migrations or API changes.

## Dependencies
None

## Success Criteria
- [ ] First load shows dark theme (no flash)
- [ ] Toggle switches to light mode, preference saved to localStorage
- [ ] Reloading the page shows light mode if previously set
- [ ] OS dark mode preference respected on first visit (no localStorage)
- [ ] Accent colors and gradients identical in both modes
- [ ] Grain/noise texture overlay unchanged
- [ ] No visual regressions in dark mode
