# Delta for Landing Layout

## ADDED Requirements

### Requirement: ConvertixAI Insertion
The system MUST render `<ConvertixAI />` between FeaturesGrid and ProcessTimeline in `index.astro`.

#### Scenario: AI section present
- GIVEN index.astro is compiled
- WHEN the component tree is evaluated
- THEN `<ConvertixAI />` SHALL render after FeaturesGrid and before ProcessTimeline
- AND the `#ai` section ID SHALL be stable for Navbar linking

### Requirement: Navbar AI Link
The Navbar MUST include an `#ai` link between existing navigation items.

#### Scenario: AI link visible in desktop nav
- GIVEN the page is loaded at ≥768px width
- WHEN inspecting the Navbar
- THEN a link with `href="#ai"` and label "IA" SHALL be present

#### Scenario: AI link visible in mobile menu
- GIVEN the hamburger menu is opened at <768px width
- WHEN inspecting the mobile nav
- THEN the `#ai` link SHALL appear and scroll to `#ai` on tap

### Requirement: Visual Polish — Global Styles
The system SHALL apply CSS refinements for readability and interaction feedback.

| Rule | Target | Value |
|------|--------|-------|
| Heading balance | All `h1, h2` | `text-wrap: balance` |
| Paragraph wrapping | All `p` in global styles | `text-wrap: pretty` |
| Button press | All `.btn` elements | `transition-transform` + `:active { transform: scale(0.96) }` |
| Price numbers | Price displays | `font-variant-numeric: tabular-nums` |
| Transitions explicit | Interactive elements | `transition-property: transform, box-shadow, border-color` (not `all`) |
| Hit area | Interactive elements | `min-height: 40px; min-width: 40px` |
| Image depth | All `img` in content | `border: 1px solid var(--border)` |

#### Scenario: Button press feedback
- GIVEN any `.btn` element on the page
- WHEN the user presses (active state) the button
- THEN the button SHALL scale to 0.96 with a smooth transition

#### Scenario: Headings prevent widows
- GIVEN any section heading (`h1` or `h2`)
- WHEN the heading wraps to multiple lines
- THEN line breaks SHALL be balanced via `text-wrap: balance`

## MODIFIED Requirements

### Requirement: FeaturesGrid Import

The system SHALL import and render `FeaturesGrid.astro` in place of `ServicesGrid.astro` within `index.astro`. The `ConvertixAI` import SHALL also be present.

(Previously: only FeaturesGrid replacement was specified; ConvertixAI was not imported)

#### Scenario: Import statement
- GIVEN index.astro is compiled
- WHEN the import section is processed
- THEN the import for ServicesGrid SHALL be absent and imports for FeaturesGrid AND ConvertixAI SHALL be present

#### Scenario: Render position
- GIVEN index.astro renders the landing page
- WHEN the component tree is evaluated
- THEN FeaturesGrid SHALL render after Hero, ConvertixAI SHALL render after FeaturesGrid, and ProcessTimeline SHALL render after ConvertixAI

#### Scenario: No other section displacement
- GIVEN the imports are changed
- WHEN the page renders
- THEN all other sections (LandingsExpress, Portfolio, About, FAQ, ContactForm, CtaFinal) SHALL remain in their existing order
