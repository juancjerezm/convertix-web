# Design: Value Positioning

Five self-contained Astro component edits — no new capabilities, no infrastructure changes.

## Quick Path

1. Create `FeaturesGrid.astro` (reuse `.service-card` CSS pattern + new bullet list styles)
2. Edit `Hero.astro` headline + keep typing animation
3. Edit `ProcessTimeline.astro` — rename steps, add "Método Vuelo"
4. Edit `templates.json` — update 4 price fields
5. Edit `index.astro` — rename import

## Component Architecture

| Component | Action | CSS Location |
|-----------|--------|--------------|
| `FeaturesGrid.astro` | Create | Scoped `<style>` + new `.feature-list` in global.css |
| `Hero.astro` | Modify (copy only) | No CSS changes |
| `ProcessTimeline.astro` | Modify (copy only) | No CSS changes |
| `templates.json` | Modify (data only) | N/A |
| `index.astro` | Modify (2 lines) | No CSS changes |
| `ServicesGrid.astro` | Keep (orphaned) | No delete — safe rollback |
| `LandingsExpress.astro` | No change | Verified: does NOT render `template.price` |

Dependency graph: `index.astro` → `FeaturesGrid.astro`, `Hero.astro`, `ProcessTimeline.astro`, `LandingsExpress.astro` (all independent — no cross-component dependencies).

## CSS Strategy

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Card styles location | Scoped `<style>` in FeaturesGrid.astro | Follows existing pattern: LandingsExpress has scoped styles; ServicesGrid currently uses global.css selectors — separation moves us toward component ownership |
| Bullet list styles | `global.css` (`.feature-list`, `.feature-list li`, `.feature-list li::before`) | Pseudo-elements in scoped Astro styles have selector scoping issues. Global styles are simpler and follow the proposal's stated approach |
| Checkmark color | `var(--accent-blue)` | `--accent` does NOT exist. Only `--accent-blue` (`#0070f3`) and `--accent-purple` (`#7928ca`) are available. Blue is consistent with existing `.service-icon` color |
| Card class naming | `.feature-card` (new) | Existing `.service-card` remains in global.css for ServicesGrid during transition. Naming conflict avoided |

### Variables Used

All from `global.css` `:root` — confirmed present:

| Variable | Purpose |
|----------|---------|
| `--bg-primary` | Section background |
| `--bg-secondary` | Card background |
| `--border` | Card borders |
| `--card-hover-border` | Card border on hover |
| `--card-hover-shadow` | Card shadow on hover |
| `--text-muted` | Bullet text, subtitle |
| `--accent-blue` | Checkmark color |
| `--gradient` | Section label, card accent line |
| `--radius` | Card border-radius |
| `--transition` | All transitions |

### Breakpoints

| Width | Grid | Source |
|-------|------|--------|
| >768px | 3 columns | Existing `.services-grid` desktop pattern |
| ≤768px | 2 columns (tablet) | Spec requirement — needs explicit media query |
| ≤480px | 1 column | Existing `.service-card` mobile pattern |

## Verification Report

### Confirmed Present
- ✅ `.section-label`, `.section-title`, `.section-subtitle` — lines 340–364 global.css
- ✅ CSS variables: all 12 referenced variables exist in `:root` (lines 10–36)
- ✅ `.service-card` hover pattern: `::before` gradient line, `translateY(-4px)`, box-shadow — lines 455–486
- ✅ Dark/light theme via `[data-theme="light"]` — lines 38–58
- ✅ Hero typing animation: words array `["resultados","clientes","ventas"]` — line 21 Hero.astro
- ✅ `data-number` attributes on timeline steps — lines 10, 19, 28 ProcessTimeline.astro
- ✅ LandingsExpress.astro: `template.price` NEVER rendered — only `name`, `description`, `image`, `demoUrl`

### Gaps Found
| # | Gap | Severity | Resolution |
|---|-----|----------|------------|
| 1 | `--accent` CSS variable does NOT exist | Medium | Use `var(--accent-blue)` for checkmarks |
| 2 | Spec deliverables ≠ User design requirements (see comparison below) | **High** | **BLOCKER — needs user decision before apply** |
| 3 | Spec says `"$400.000 COP"`, existing format is `"$250.000"` (no COP) | Low | Follow existing format: `"$400.000"` |
| 4 | Tablet (2-col) breakpoint not in existing `.services-grid` CSS | Low | Add explicit `@media (max-width: 768px)` rule |

### Gap #2 Detail: Deliverable Content Conflict

**Spec (`landing-services/spec.md`) says** for Card 1 (Desarrollo a Medida):
> landing pages, sitios multi-página, e-commerce, blog integrado, diseño 100% personalizado, formularios + automatizaciones

**User design requirements say** for Card 1:
> Stack flexible: Astro, React o Next, Diseño 100% personalizado, Adaptable a celular/tablet/desktop, Panel de administración, Integración con redes sociales, Dominio propio incluido el primer año

**These are fundamentally different content.** Same conflict exists for Cards 2 and 3. One must win — the spec or the user's explicit design instructions. The spec was written by a different agent, possibly outdated by the time the user provided these detailed design requirements.

## Open Questions

- [ ] **BLOCKING**: Which deliverable bullets should be used — spec content or user-provided design content? (see Gap #2 above)
- [ ] Do step descriptions in ProcessTimeline need minor adjustments to match "Despegue"/"Impulso"/"Órbita" names, or stay exactly as-is?
- [ ] Confirm: ServicesGrid.astro should be kept (not deleted) for safe rollback, or deleted as part of this change?

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content mismatch between spec and user requirements | Wrong copy shipped | Resolve Gap #2 before sdd-apply |
| Scoped CSS pseudo-elements fail in Astro | Broken checkmarks | `.feature-list li::before` defined in global.css, not scoped |
| Import path broken after rename | 500 error on landing page | `index.astro` import path verified: `../components/FeaturesGrid.astro` — same directory, no path change needed beyond filename |
| Typing animation breakage | Words don't cycle | `words` array unchanged; `el` references `#heroTyping` which remains in DOM at same position |
| "Hosting incluido sin costo mensual" claims | Invalid after future infra change | Wording is provider-agnostic — no specific platform mentioned |

## Testing Strategy

| Layer | What | How |
|-------|------|-----|
| Visual | FeaturesGrid 3-col → 2-col → 1-col | Manual viewport resize |
| Visual | Card hover effects (lift, shadow, accent line) | Manual hover on each card |
| Visual | Hero headline wraps on 375px without overflow | Chrome DevTools mobile view |
| Visual | ProcessTimeline shows "Método Vuelo" + renamed steps | Manual scroll inspection |
| Visual | Dark/light theme on FeaturesGrid cards | Theme toggle click |
| Data | `templates.json` prices match target values | `grep price src/data/templates.json` |
| Regression | All other sections unchanged (Portfolio, FAQ, Contact, etc.) | Scroll full page, verify section order |
