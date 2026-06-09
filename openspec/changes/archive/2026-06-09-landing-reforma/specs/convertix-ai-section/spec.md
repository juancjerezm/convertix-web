# Convertix AI Section

## Purpose
AI product showcase: 3 cards (Chatbot WhatsApp, Automatizaciones Python, Consultoría IA) placed between FeaturesGrid and ProcessTimeline, using `accent-purple` theme and `id="ai"` anchor.

## Requirements

### Requirement: AI Section Placement
The system MUST render `<ConvertixAI />` in `index.astro` immediately after `<FeaturesGrid />` and before `<ProcessTimeline />`.

#### Scenario: Section renders in correct position
- GIVEN the landing page is loaded
- WHEN the DOM is inspected
- THEN the `#ai` element SHALL appear after `#servicios` and before `#proceso`

#### Scenario: No section displacement
- GIVEN the ConvertixAI section is inserted
- WHEN the page renders
- THEN all other sections SHALL remain in their existing order

### Requirement: AI Product Cards
The system SHALL display three product cards with icon, title, description, and CTA.

#### Scenario: Three cards visible
- GIVEN the ConvertixAI section renders
- WHEN viewing the section
- THEN three distinct cards SHALL be visible for Chatbot WhatsApp, Automatizaciones Python, and Consultoría IA

#### Scenario: Cards use purple theme
- GIVEN the section renders in dark or light theme
- WHEN inspecting card accents
- THEN each card SHALL use `var(--accent-purple)` for highlights, borders, and glow effects

### Requirement: AI Section Anchor
The section MUST have `id="ai"` for Navbar deep-linking.

#### Scenario: Navbar link scrolls to AI section
- GIVEN the Navbar includes an `#ai` link
- WHEN a user clicks "IA" in the Navbar
- THEN the page SHALL smooth-scroll to the ConvertixAI section

### Requirement: ScrollReveal Animation
The section MUST trigger ScrollReveal fade-in when scrolled into view.

#### Scenario: Cards animate on scroll
- GIVEN the ConvertixAI section is below the fold
- WHEN the user scrolls until the section enters the viewport
- THEN cards SHALL fade in with the `reveal` animation class

### Requirement: Accessibility
The section MUST pass axe-core audits with zero violations.

#### Scenario: No a11y violations
- GIVEN the page is loaded with the ConvertixAI section
- WHEN axe-core scans the section
- THEN zero accessibility violations SHALL be reported
