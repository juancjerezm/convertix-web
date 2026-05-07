# Demo Pages

## Purpose
Standalone demo pages at `/demos/{slug}` showcasing template design styles with self-contained visual identities.

## Requirements

### Requirement: Demo Page URLs
The system MUST serve four separate demo pages at `/demos/landing`, `/demos/negocio-local`, `/demos/profesional`, and `/demos/tienda-online`.

#### Scenario: Visitor navigates to each demo URL
- GIVEN the site is built and served
- WHEN a visitor navigates to `/demos/landing`
- THEN a fully styled demo page renders at that URL

#### Scenario: Non-existent demo slug
- GIVEN the site is built
- WHEN a visitor navigates to `/demos/inexistente`
- THEN the server returns a 404 status

### Requirement: Distinct Visual Identities
Each demo page MUST have a completely different visual identity: unique color palette, typography choices, and layout structure. No shared design system or theme.

#### Scenario: Color palette isolation
- GIVEN the site renders demo pages
- WHEN comparing `/demos/landing` and `/demos/negocio-local`
- THEN primary colors differ between pages (blue vs olive/terracotta)

#### Scenario: Typography isolation
- GIVEN the site renders demo pages
- WHEN comparing `/demos/profesional` and `/demos/tienda-online`
- THEN font families and type scale differ between pages

#### Scenario: No dark theme leakage
- GIVEN the main Convertix site uses a dark theme
- WHEN inspecting any demo page's background color
- THEN the background is white or cream, not dark, and no Convertix brand colors appear in computed styles

### Requirement: Self-Contained Documents
Each demo page MUST be a complete, self-contained HTML document with its own `<html>`, `<head>`, and inline `<style>` block. It MUST NOT import BaseLayout, global.css, or any shared layout component.

#### Scenario: Page source inspection
- GIVEN a built demo page
- WHEN viewing the page source
- THEN the output contains `<html>`, `<head>`, an inline `<style>` block, and no evidence of BaseLayout or global layout wrappers

#### Scenario: Global CSS isolation
- GIVEN the project has a `global.css` with dark theme styles
- WHEN a demo page loads
- THEN no global.css styles appear in the page's computed styles

### Requirement: Back to Convertix Link
Each demo page MUST include a "← Volver a Convertix" link pointing to `/`.

#### Scenario: Link presence
- GIVEN any demo page renders
- WHEN the page loads
- THEN a visible link with text "← Volver a Convertix" is present, pointing to `/`

#### Scenario: Link navigation
- GIVEN a visitor is on `/demos/landing`
- WHEN they click "← Volver a Convertix"
- THEN the browser navigates to `/`

### Requirement: Mobile Responsiveness
Each demo page MUST render correctly at 375px and 1440px viewport widths.

#### Scenario: Mobile viewport
- GIVEN the viewport width is 375px
- WHEN a demo page renders
- THEN all content fits without horizontal scroll and text remains readable

#### Scenario: Desktop viewport
- GIVEN the viewport width is 1440px
- WHEN a demo page renders
- THEN content uses the available width without breaking layout or overflowing

### Requirement: Zero Build-Time JavaScript
Each demo page MUST ship zero JavaScript at build time.

#### Scenario: No script tags in output
- GIVEN the project is built with `npm run build`
- WHEN inspecting the HTML output of any demo page
- THEN no `<script>` tags are present in the source

#### Scenario: Astro component inspection
- GIVEN the demo page source files are Astro components
- WHEN reviewing each `.astro` file
- THEN no client directives (`client:load`, `client:visible`, etc.) are used

### Requirement: Design Briefs
Each demo page MUST implement its specified design brief with required layout sections.

#### Scenario: Landing SaaS demo
- GIVEN the `/demos/landing` page renders
- THEN it displays a hero section, features grid, pricing tiers, and testimonials section using white background and blue #2563eb accents

#### Scenario: Negocio Local demo
- GIVEN the `/demos/negocio-local` page renders
- THEN it displays a hero, menu sections, location/hours, using cream #fef7e7 background with olive #4a6741 and terracotta #c67b5c

#### Scenario: Profesional demo
- GIVEN the `/demos/profesional` page renders
- THEN it displays a hero with photo placeholder, services icons, about section, and contact form layout using white background with navy #1e3a5f and gold #c9a84c

#### Scenario: Tienda Online demo
- GIVEN the `/demos/tienda-online` page renders
- THEN it displays a product grid, category navigation, featured banner, and newsletter section using white background with coral #ff6b6b and black #1a1a2e
