# Design: Light Mode Toggle

## Technical Approach

CSS-first with `[data-theme]` attribute on `<html>`. All dark values remain in `:root`. A single `[data-theme="light"]` block overrides only what changes. Twelve new CSS variables replace hardcoded colors (glows, borders, shadows, overlay). An inline blocking `<script>` in `<head>` reads localStorage (fallback: `prefers-color-scheme`), sets `data-theme` synchronously before any paint. A sun/moon toggle button in Navbar updates the attribute + localStorage on click. Accent colors, gradients, and grain overlay are untouched.

## Architecture Decisions

### Decision: Theme Mechanism — `data-theme` attribute on `<html>`

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `data-theme` attr on `<html>` | Standard, JS-friendly, CSS selector `[data-theme="light"]` | **Chosen** |
| CSS class (`.light-theme`) | Conflicts with other class toggling patterns | Rejected |
| `prefers-color-scheme` only | No user toggle possible | Rejected |
| CSS `light-dark()` function | Limited browser support (2024+) | Rejected |

**Rationale**: Attribute selectors require no framework. `setAttribute`/`getAttribute` is trivial. The `data-` prefix signals user-controlled state.

### Decision: CSS Variable Override — `:root` defaults, `[data-theme="light"]` overrides

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Single `[data-theme="light"]` block | Minimal diff, no refactoring | **Chosen** |
| Separate stylesheet per theme | Duplicates all selectors | Rejected |
| CSS custom property trick with `:root.light` | Same as attribute but less semantic | Rejected |

**Rationale**: The codebase already uses `:root` for variables (line 10). Adding one override block is the minimal change. Locked variables (`--accent-blue`, `--accent-purple`, `--gradient`) are not repeated in the light block.

### Decision: Light Glow Opacity — ~50% of dark values

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Half opacity (e.g., `0.08 → 0.04`) | Preserves depth without overpowering light bg | **Chosen** |
| Remove glows entirely | Loses spatial depth on light mode | Rejected |
| Same opacity | Looks muddy on white background | Rejected |

**Rationale**: Accent hues stay identical per R4. Reducing opacity preserves the ambient effect without visual noise.

### Decision: Toggle Position — inside `.nav-menu` between nav-links and nav-cta

**Choice**: Insert inside `.nav-menu` flow, between `<ul class="nav-links">` and `<a class="nav-cta">`
**Rationale**: Natural horizontal placement on desktop, vertical placement inside the slide-out panel on mobile. Zero additional CSS breakpoints needed. Matches proposal.

## Data Flow

```
Page loads
  │
  ▼
Inline <head> script (synchronous, blocking)
  ├─ localStorage.getItem('theme')
  │   ├─ "light" → <html data-theme="light"> ✅
  │   └─ "dark"  → <html data-theme="dark">  ✅
  └─ not set → matchMedia('prefers-color-scheme: light')
        ├─ true  → <html data-theme="light">
        └─ false → stays dark (default)
  │
  ▼
CSS resolves → [data-theme] variables apply
  │
  ▼
Page renders — no flash
  │
  ▼
User clicks toggle button
  ├─ data-theme toggles: dark ↔ light
  ├─ localStorage.setItem('theme', newValue)
  └─ CSS re-resolves → variables swap instantly
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/styles/global.css` | Modify | Add 12 new variables to `:root` with dark defaults. Add `[data-theme="light"]` block overriding 17 variables. Replace all 12 hardcoded values with `var(--...)` references in selectors. |
| `src/layouts/BaseLayout.astro` | Modify | `<html lang="es">` → `<html lang="es" data-theme="dark">`. Insert inline blocking theme script before Google Fonts `<link>`. |
| `src/components/Navbar.astro` | Modify | Insert `<button class="theme-toggle">` with inline sun/moon SVGs inside `.nav-menu`, between `.nav-links` and `.nav-cta`. Add click handler JS. Add toggle CSS. |
| `src/components/LandingsExpress.astro` | Modify | Lines 92,94: replace `rgba(255,255,255,0.12)` → `var(--card-hover-border)` and `0 20px 40px rgba(0,0,0,0.3)` → `var(--card-hover-shadow)` |

## CSS Variable Mapping

**Light overrides for existing variables** (`:root` → `[data-theme="light"]`):
```
--bg-primary:   #0a0a0f → #f8f9fa
--bg-secondary: #12121a → #ffffff
--text:         #ffffff → #1a1a2e
--text-muted:   #a0a0b0 → #495057
--border:       rgba(255,255,255,0.06) → rgba(0,0,0,0.08)
```

**New variables** (defined in `:root` with dark defaults, overridden in `[data-theme="light"]`):
```
--navbar-scrolled-bg:       rgba(10,10,15,0.85)    → rgba(255,255,255,0.85)
--btn-outline-border:       rgba(255,255,255,0.2)   → rgba(0,0,0,0.15)
--btn-outline-border-hover: rgba(255,255,255,0.5)   → rgba(0,0,0,0.3)
--btn-outline-bg-hover:     rgba(255,255,255,0.05)  → rgba(0,0,0,0.04)
--card-hover-border:        rgba(255,255,255,0.12)  → rgba(0,0,0,0.12)
--card-hover-shadow:        0 20px 40px rgba(0,0,0,0.3) → 0 10px 30px rgba(0,0,0,0.08)
--overlay-bg:               rgba(0,0,0,0.5)         → rgba(0,0,0,0.3)
--bg-glow-top:        radial-gradient(ellipse 80% 40% at 50% 0%, rgba(120,80,200,0.07), transparent)  → 0.03 opacity
--bg-glow-bottom:     radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,112,243,0.05), transparent) → 0.02 opacity
--hero-glow-top:      radial-gradient(circle, rgba(121,40,202,0.08) 0%, transparent 70%)  → 0.04 opacity
--hero-glow-bottom:   radial-gradient(circle, rgba(0,112,243,0.06) 0%, transparent 70%)   → 0.03 opacity
--cta-glow:           radial-gradient(circle at center, rgba(121,40,202,0.08) 0%, transparent 70%) → 0.04 opacity
```

**Locked — NOT in light block**: `--accent-blue: #0070f3`, `--accent-purple: #7928ca`, `--gradient: linear-gradient(135deg, #0070f3, #7928ca)`

## Toggle Button Design

Button: 36×36px, `border-radius: 50%`, `border: 1px solid var(--border)`, background transparent. Two inline SVGs (18×18px) displayed conditionally via CSS:

```css
[data-theme="dark"] .icon-sun  { display: block; }
[data-theme="dark"] .icon-moon { display: none; }
[data-theme="light"] .icon-sun  { display: none; }
[data-theme="light"] .icon-moon { display: block; }
```

Sun icon: Feathe-like circle with rays. Moon icon: crescent. Both use `currentColor` with `--text-muted`. Hover lifts to `--text`.

Click handler toggles `document.documentElement.dataset.theme`, saves to localStorage, CSS handles icon swap.

## Testing Strategy

Manual verification against all 6 spec requirements (11 scenarios):
- **R1 Default Dark**: Clear localStorage → dark renders, no flash
- **R2 Toggle**: Click → mode switches, variable values apply
- **R3 Persistence**: Set light → reload → persists across page loads
- **R4 Accent Invariance**: Compare `.btn-primary` gradient in both modes
- **R5 Grain Consistency**: Compare overlay in both modes
- **R6 Dark Regression**: Compare dark mode pre/post change

No automated visual testing in scope.

## Migration / Rollout

No migration. Rollback: remove `[data-theme="light"]` block, inline script, toggle markup, and revert `<html>` tag.

## Open Questions

None. All decisions resolved by proposal constraints and codebase patterns.
