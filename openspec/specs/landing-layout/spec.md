# Landing Layout

## Purpose
Component composition order in `index.astro` — the single source of truth for section ordering on the landing page.

## Requirements

### Requirement: FeaturesGrid Import

The system SHALL import and render `FeaturesGrid.astro` in place of `ServicesGrid.astro` within `index.astro`.

#### Scenario: Import statement
- GIVEN index.astro is compiled
- WHEN the import section is processed
- THEN the import for ServicesGrid SHALL be absent and the import for FeaturesGrid SHALL be present

#### Scenario: Render position
- GIVEN index.astro renders the landing page
- WHEN the component tree is evaluated
- THEN FeaturesGrid SHALL render in the same slot position that ServicesGrid previously occupied (after Hero, before ProcessTimeline)

#### Scenario: No other section displacement
- GIVEN the import is changed
- WHEN the page renders
- THEN all other sections (ProcessTimeline, LandingsExpress, Portfolio, About, FAQ, ContactForm, CtaFinal) SHALL remain in their existing order
