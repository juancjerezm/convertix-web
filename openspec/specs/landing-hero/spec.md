# Landing Hero

## Purpose
Primary visual introduction with headline, subtitle, and calls to action.

## Requirements

### Requirement: Hero Content
The system MUST display a hero section with a headline, supporting subtitle, and two call-to-action buttons.

#### Scenario: Visitor loads the page
- GIVEN a visitor navigates to the landing page
- WHEN the page renders
- THEN the hero section displays the agency headline, a descriptive subtitle, and two visible CTA buttons

#### Scenario: Long headline text
- GIVEN the headline text exceeds one line on mobile viewport (375px)
- WHEN the page renders
- THEN text SHALL wrap without overflow or truncation
