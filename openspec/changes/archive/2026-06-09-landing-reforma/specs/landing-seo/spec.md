# Delta for Landing SEO

## ADDED Requirements

### Requirement: Structured Data Enrichment
Schema.org `ProfessionalService` JSON-LD MUST include enriched `knowsAbout` with AI/automation keywords.

#### Scenario: Schema.org includes AI terms
- GIVEN the page is served
- WHEN validating JSON-LD with Google Rich Results Test
- THEN `knowsAbout` SHALL include "chatbot WhatsApp Colombia", "automatización Python", "consultoría IA", and "página web Colombia"

### Requirement: Default Metadata Update
The default title and description in `BaseLayout.astro` SHOULD include Colombia + AI positioning.

#### Scenario: Title includes Colombia
- GIVEN no page-specific title override is set
- WHEN the page renders
- THEN the `<title>` SHALL contain "Colombia"

#### Scenario: Description includes AI keywords
- GIVEN no page-specific description override is set
- WHEN the page renders
- THEN `<meta name="description">` SHALL mention both web and AI services for Colombian SMEs

## MODIFIED Requirements

### Requirement: Meta Tags
The system MUST include a `<title>`, `<meta name="description">`, and `<meta name="keywords">` in the document head.

(Previously: keywords meta tag was absent)

#### Scenario: Search engine crawls the page
- GIVEN a search bot requests the page
- WHEN the HTML is served
- THEN `<title>`, `<meta name="description">`, and `<meta name="keywords">` SHALL be present

#### Scenario: Keywords include target terms
- GIVEN the page HTML is inspected
- WHEN reading `<meta name="keywords">`
- THEN the content SHALL include "página web Colombia", "diseño web Colombia", "landing page Colombia", "chatbot WhatsApp Colombia", and "automatización Colombia"
