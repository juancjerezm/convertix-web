# Archive Report: template-demos

**Archived**: 2026-05-08
**Mode**: Hybrid (Engram + Filesystem)
**Verdict**: PASS WITH WARNINGS (warning fixed post-verify in commit f984277)

## Artifact IDs (Filesystem)

| Artifact | Path | Status |
|----------|------|--------|
| Proposal | `openspec/changes/archive/2026-05-08-template-demos/proposal.md` | ✅ |
| Spec (landing-express delta) | `openspec/changes/archive/2026-05-08-template-demos/specs/landing-express/spec.md` | ✅ |
| Design | `openspec/changes/archive/2026-05-08-template-demos/design.md` | ✅ |
| Tasks | `openspec/changes/archive/2026-05-08-template-demos/tasks.md` | ✅ (14/14 complete) |
| Verify Report | `openspec/changes/archive/2026-05-08-template-demos/verify-report.md` | ✅ |

## Engram Memory

No prior Engram observation IDs exist for this change — the change was executed entirely via filesystem artifacts and is now archived.

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| `landing-express` | Updated | Merged 2 new requirements (Demo URL Field, Demo Button on Template Cards) with 5 scenarios into existing main spec |
| `demo-pages` | Already present | Main spec existed at `openspec/specs/demo-pages/spec.md` |
| `template-screenshots` | Already present | Main spec existed at `openspec/specs/template-screenshots/spec.md` |

## Capabilities Delivered

- **`demo-pages`**: 4 standalone demo pages at `/demos/{slug}` with unique design systems (SaaS, Restaurant, Lawyer, Blog)
- **`template-screenshots`**: Automated Playwright screenshot pipeline capturing 1600×900 WebP files

## Modified Capabilities

- **`landing-express`**: Template cards gain `demoUrl` field in `templates.json` and secondary "Ver demo →" CTA button

## Verification Summary

| Metric | Value |
|--------|-------|
| Tasks completed | 14/14 |
| Success criteria met | 7/7 |
| Scenarios compliant | 5/5 (after post-verify fix) |
| Build errors | 0 |
| Critical issues | 0 |

## Post-Verify Fix

- **Warning**: Non-conditional `demoUrl` button guard — FIXED in commit `f984277`
- The "Missing demo URL → button not displayed" scenario was implemented after the verify report was generated

## Coverage

### Sitemap
All 4 demo routes included: `/demos/landing`, `/demos/negocio-local`, `/demos/profesional`, `/demos/blog`

### Visual
- Zero dark-theme leakage across all demos
- Zero `<script>` tags in demo page output
- All demos responsive at 375px and 1440px

## Source of Truth Updated

- `openspec/specs/landing-express/spec.md` — now reflects demo URL field + demo button requirements
- `openspec/specs/demo-pages/spec.md` — already up to date
- `openspec/specs/template-screenshots/spec.md` — already up to date

## SDD Cycle Complete

The template-demos change has been fully:
1. ✅ Proposed — 4 demo pages with unique visual identities
2. ✅ Specified — Delta specs for landing-express, full specs for demo-pages and template-screenshots
3. ✅ Designed — Architecture decisions documented (separate files, isolation strategy, Playwright pipeline)
4. ✅ Implemented — 14/14 tasks completed
5. ✅ Verified — Build passes, all scenarios compliant, warning fixed post-verify
6. ✅ Archived — Delta synced, artifacts moved to archive
