# Design: Landing Reforma — Web + AI Repositioning

## Technical Approach

Four-phase incremental implementation: bugfix → core reform → SEO enrichment → visual polish. All changes confined to `src/` (Astro components + pages). No new dependencies. Each phase independently testable with Playwright E2E + axe-core.

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ConvertixAI rendering | Static Astro component, zero props, self-contained | Component already built with `id="ai"`, inline styles, no external data needed |
| Navbar #ai link position | Between Servicios (#servicios) and Páginas Express (#plantillas) | AI is a service product line; placing after Servicios groups both offerings visually |
| transition: all elimination | Replace with explicit `transition-property: transform, box-shadow, border-color, color` per card type | Prevents unintended transitions on layout properties (width, padding) during responsive breakpoint changes |
| CTA prefill strategy | URL-encoded message in WhatsApp link href | No JS needed; failsafe works even if JS blocked |
| BaseLayout title/description | No changes needed | Already includes "Chatbots con IA y Automatizaciones" + "Colombia" — spec-compliant |

## Data Flow

```
index.astro (page)
  ├── BaseLayout (provides SEO, StructuredData, Navbar, Footer via slots)
  │   ├── SEO.astro ← keywords meta (NEW)
  │   ├── StructuredData.astro ← enriched knowsAbout (MODIFIED)
  │   └── Navbar.astro ← #ai link (MODIFIED)
  ├── Hero.astro ← dead typewriter removed (MODIFIED)
  ├── FeaturesGrid.astro (#servicios)
  ├── ConvertixAI.astro (#ai) ← INSERTED between FeaturesGrid and ProcessTimeline
  ├── ProcessTimeline.astro (#proceso)
  ├── LandingsExpress.astro (#plantillas) ← import fixed (BUGFIX)
  └── CtaFinal.astro (#contacto) ← CTA text updated (MODIFIED)
```

ConvertixAI receives no props. Its CTA links directly to `wa.me/573163000208` with prefill. Navbar anchor `#ai` triggers browser smooth-scroll (already enabled via `html { scroll-behavior: smooth }` in global.css L70).

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/components/LandingsExpress.astro` | Modify | Add `import templates from '../data/templates.json'` to frontmatter (L1-2) |
| `src/components/Hero.astro` | Modify | Remove entire `<script>` block (L19-57). No markup changes — h1 already static |
| `src/pages/index.astro` | Modify | Add import for ConvertixAI; insert `<ConvertixAI />` between FeaturesGrid and ProcessTimeline |
| `src/components/Navbar.astro` | Modify | Add `<li><a href="/#ai">IA</a></li>` after Servicios link (L13) |
| `src/components/CtaFinal.astro` | Modify | h2 → "Cuéntame tu proyecto" (L8); btn text → "Cuéntame tu proyecto 📲" (L14); href updated with `?text=¡Hola! Vi tu página y quiero contarte sobre mi proyecto.` encoded |
| `src/components/SEO.astro` | Modify | Add `<meta name="keywords" content="página web Colombia, diseño web Colombia, landing page Colombia, chatbot WhatsApp Colombia, automatización Colombia, desarrollo web Colombia, IA para negocios">` after L19 |
| `src/components/StructuredData.astro` | Modify | Extend `knowsAbout` array: append `"chatbot WhatsApp Colombia"`, `"automatización Python"`, `"consultoría IA"`, `"página web Colombia"` |
| `src/styles/global.css` | Modify | Visual polish rules (see CSS decisions below) |

## CSS Decisions

All changes go into `global.css`, organized by insertion point:

**A. text-wrap (after SECTION heading rules, ~L363):**
```css
h1, h2, .section-title { text-wrap: balance; }
p { text-wrap: pretty; }
```

**B. scale-on-press (in BUTTONS section, after .btn rules ~L132):**
```css
@media (prefers-reduced-motion: no-preference) {
  .btn:active, .btn-primary:active, .btn-outline:active {
    transform: scale(0.96);
    transition: transform 0.1s ease;
  }
}
```

**C. tabular-nums (add to global.css near typography):**
```css
.price, .template-price { font-variant-numeric: tabular-nums; }
```

**D. transition specificity — fix all `transition: all` occurrences:**
- `.btn` (L129): `transition: box-shadow var(--transition), transform var(--transition)`
- `.feature-card` (FeaturesGrid L73): `transition: border-color 0.35s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94)`
- `.service-card` (L471): `transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition)`
- `.template-card` (LandingsExpress L73): `transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition)`
- `.ai-card` (ConvertixAI L98): `transition: border-color 0.35s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94)`
- `.timeline-step::before` (L575): `transition: border-color var(--transition), color var(--transition), background var(--transition)`

**E. 40×40 hit areas (in RESPONSIVE section ~L804):**
```css
.theme-toggle { width: 40px; height: 40px; }
.hamburger { min-width: 40px; min-height: 40px; display: flex; align-items: center; justify-content: center; }
.nav-links a { min-height: 40px; display: inline-flex; align-items: center; }
```

**F. image outlines (add CSS variable to :root and [data-theme="light"]):**
- `:root`: `--image-outline: rgba(255,255,255,0.08)`
- `[data-theme="light"]`: `--image-outline: rgba(0,0,0,0.06)`
- Rule: `.template-image img, .ai-card img { border: 1px solid var(--image-outline); }`

**G. font-smoothing**: Already `-webkit-font-smoothing: antialiased` on `body` (L81) — verified, no change.

**H. concentric radius**: Verified. Base `--radius: 12px`, cards use `calc(var(--radius) + 4px) = 16px`, buttons use `var(--radius) = 12px`. No nested inconsistency found — no change needed.

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | LandingsExpress compiles | `pnpm build` — fails if templates import broken |
| E2E | ConvertixAI renders between FeaturesGrid and ProcessTimeline | Playwright: assert `#ai` parent's child order |
| E2E | Navbar #ai link scrolls to section | Click link, assert `#ai` in viewport |
| E2E | CTA WhatsApp link contains correct prefill | Assert `href` includes encoded message |
| E2E | No typewriter script executes | Assert `heroTyping` element absent, no TypeError |
| a11y | ConvertixAI passes axe-core | `axe-core` scan on full page with #ai mounted |
| SEO | Keywords meta present | Assert `<meta name="keywords">` in head |
| Visual | No layout shift after CSS polish | Playwright screenshot diff (baseline vs reforma) |

## Risks

- **CSS cascade**: `text-wrap: balance` on all h2 may conflict with component-scoped h2 in FeaturesGrid/ConvertixAI. Mitigation: test each h2 individually on 375px/768px/1440px.
- **transition changes**: Removing `transition: all` limits future-proofing. Mitigation: each card component now explicitly lists animated properties — if new properties need animation, they must be added explicitly.
- **Navbar link label "IA"**: 2-char label is narrow; tap target on mobile must not overlap. `.nav-links a` gets `min-height: 40px` and `inline-flex` — test mobile tap accuracy.
- **LandingsExpress rebuild**: After adding import, verify templates.json path resolves. Build test is the gate.

## Open Questions

- [ ] Should `.template-price` be rendered in LandingsExpress cards (currently not displayed)? Spec only requires CSS rule — defer price display to Phase 5.
