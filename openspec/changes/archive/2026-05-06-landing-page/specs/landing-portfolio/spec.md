# Landing Portfolio

## Purpose
Showcase the Autos JC project as proof of commercial delivery capability.

## Requirements

### Requirement: Project Showcase
The system MUST display Autos JC project with screenshots, technology badges, and a project description.

#### Scenario: Visitor views portfolio
- GIVEN a visitor scrolls to the portfolio section
- WHEN the section renders
- THEN project screenshots, tech stack badges, and a short description are visible

### Requirement: External Link
The system MUST include a link to the live Autos JC application.

#### Scenario: Visitor clicks project link
- GIVEN the portfolio section is visible
- WHEN a visitor clicks the project link
- THEN the live Autos JC site opens in a new tab

#### Scenario: Images fail to load
- GIVEN screenshot images fail to load
- WHEN the section renders
- THEN alt text SHALL describe each image and the project link remains functional
