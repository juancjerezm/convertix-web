# Landing About

## Purpose
Founder story, photo, and mission statement to build trust.

## Requirements

### Requirement: About Content
The system MUST display the founder's name, photo, and the agency mission statement.

#### Scenario: Visitor reads about section
- GIVEN a visitor scrolls to the about section
- WHEN the section renders
- THEN the founder photo, name, and mission text are visible

#### Scenario: Photo fails to load
- GIVEN the founder photo cannot be loaded
- WHEN the section renders
- THEN alt text SHALL describe the photo and remaining content remains unaffected

#### Scenario: Long mission text
- GIVEN the mission statement exceeds three lines on mobile
- WHEN the section renders
- THEN text SHALL wrap normally without clipping
