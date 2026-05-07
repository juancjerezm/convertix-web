# Landing Services

## Purpose
Showcase three core service offerings in a card grid.

## Requirements

### Requirement: Service Cards
The system MUST render three service cards: Landing Pages, Corporate Sites, and E-commerce.

#### Scenario: Visitor views services
- GIVEN a visitor scrolls to the services section
- WHEN the section is in view
- THEN three distinct cards appear, each with an icon, title, and short description

#### Scenario: Mobile viewport
- GIVEN the viewport width is 375px
- WHEN the services section renders
- THEN cards SHALL stack vertically in a single column
