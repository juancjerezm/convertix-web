# Delta for Landing Express

## ADDED Requirements

### Requirement: Demo URL Field
`templates.json` MUST include a `demoUrl` field for each template entry, pointing to the corresponding demo page.

#### Scenario: Templates data includes demo URLs
- GIVEN `templates.json` is read
- WHEN iterating over template entries
- THEN each entry has a `demoUrl` field with a value like `/demos/landing`, `/demos/negocio-local`, `/demos/profesional`, or `/demos/tienda-online`

#### Scenario: Missing demo URL
- GIVEN a template entry lacks the `demoUrl` field
- WHEN the template card renders
- THEN the "Ver demo →" button is not displayed

### Requirement: Demo Button on Template Cards
Template cards MUST display a secondary "Ver demo →" button linking to the template's `demoUrl`. The button MUST open in the same tab and MUST be visually distinct from the WhatsApp primary CTA.

#### Scenario: Demo button presence
- GIVEN the Landings Express section is visible
- WHEN a template card renders
- THEN each card displays a "Ver demo →" button alongside the WhatsApp CTA

#### Scenario: Demo button navigation
- GIVEN a visitor views a template card for "Landing Page"
- WHEN they click "Ver demo →"
- THEN the browser navigates to `/demos/landing` in the same tab (no `target="_blank"`)

#### Scenario: Visual distinction from WhatsApp CTA
- GIVEN the Landings Express section renders
- WHEN comparing the "Ver demo →" button with the WhatsApp CTA button
- THEN the demo button uses a visually distinct outline style (`btn-outline` equivalent), while the WhatsApp button remains the primary filled style
