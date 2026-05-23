# Landing Pricing Specification

## Purpose
Price data in `templates.json` synced to FAQ-anchored values. Prices exist as data only — not rendered in template cards.

## Requirements

### Requirement: Price Data Sync

The system SHALL store pricing data in `templates.json` with FAQ-consistent values.

#### Scenario: Landing page price
- GIVEN templates.json is loaded
- WHEN reading the landing template entry
- THEN the price field SHALL be "$400.000 COP"

#### Scenario: Profesional price
- GIVEN templates.json is loaded
- WHEN reading the profesional template entry
- THEN the price field SHALL be "$450.000 COP"

#### Scenario: Negocio Local price
- GIVEN templates.json is loaded
- WHEN reading the negocio-local template entry
- THEN the price field SHALL be "$500.000 COP"

#### Scenario: Blog Profesional price
- GIVEN templates.json is loaded
- WHEN reading the blog template entry
- THEN the price field SHALL be "$550.000 COP"

### Requirement: Price Not Rendered in Cards

The system MUST NOT display prices in template cards.

#### Scenario: Template card rendering
- GIVEN template cards are rendered in the UI
- WHEN inspecting the card content
- THEN no price value from templates.json SHALL appear in the card markup
