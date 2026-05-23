# Delta for Landing Hero

## MODIFIED Requirements

### Requirement: Hero Content

The system MUST display a hero section with the value-proposition headline, a supporting subtitle, and two call-to-action buttons.
(Previously: headline "Tu web lista en 5 días. Sin vueltas." with typing animation on "5 días" cycling through timing variants.)

#### Scenario: Visitor loads the page
- GIVEN a visitor navigates to the landing page
- WHEN the page renders
- THEN the hero section displays the headline "La web que tu negocio necesita, con la tecnología que usan las startups, sin pagar de más." with the words "resultados", "clientes", "ventas" cycling in the highlight span

#### Scenario: Typing animation preserved
- GIVEN the page has loaded
- WHEN the typing animation runs
- THEN the highlight words SHALL cycle through "resultados", "clientes", "ventas" in sequence with the existing typewriter effect

#### Scenario: CTA buttons preserved
- GIVEN the hero section renders
- WHEN viewing the hero
- THEN both CTA buttons SHALL remain: "Quiero mi web" (primary) and "Ver plantillas" (outline)

#### Scenario: No price in hero
- GIVEN the hero section renders
- WHEN inspecting the hero content
- THEN no price figure or currency amount SHALL appear in the headline, subtitle, or supporting text

#### Scenario: Mobile text overflow
- GIVEN the viewport width is 375px
- WHEN the hero renders with the new headline
- THEN text SHALL wrap without overflow or horizontal scroll
