# Delta for Landing Hero

## MODIFIED Requirements

### Requirement: Hero Content

The system MUST display a hero section with a static value-proposition headline, a supporting subtitle, and two call-to-action buttons. The headline SHALL use `text-wrap: balance`.

(Previously: headline had typewriter cycling animation on highlight words)

#### Scenario: Visitor loads the page
- GIVEN a visitor navigates to the landing page
- WHEN the page renders
- THEN the hero section displays the static headline "Tu página web lista en 3 días. Y productos con IA para tu negocio."
- AND no typewriter cycling animation SHALL execute

#### Scenario: CTA buttons preserved
- GIVEN the hero section renders
- WHEN viewing the hero
- THEN both CTA buttons SHALL remain: "Quiero mi web" (primary) and "Ver plantillas" (outline)

#### Scenario: No price in hero
- GIVEN the hero section renders
- WHEN inspecting the hero content
- THEN no price figure SHALL appear in the headline, subtitle, or supporting text

#### Scenario: Mobile text overflow
- GIVEN the viewport width is 375px
- WHEN the hero renders
- THEN text SHALL wrap without overflow or horizontal scroll

#### Scenario: Headline text balance
- GIVEN the viewport width is between 375px and 1440px
- WHEN the `h1` heading renders
- THEN the headline text SHALL wrap with `text-wrap: balance` to prevent widows

## REMOVED Requirements

### Requirement: Typing Animation

(Reason: The typewriter script (Hero.astro lines 19–57) targets an element `#heroTyping` that does not exist in the markup. The script is dead code and has never been functional. ScrollReveal fade-in is the sole reveal effect.)
(Migration: None — the animation was non-functional. No visual regression expected.)
