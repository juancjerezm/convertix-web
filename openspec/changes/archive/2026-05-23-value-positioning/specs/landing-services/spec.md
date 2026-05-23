# Delta for Landing Services

## MODIFIED Requirements

### Requirement: Service Cards → Feature Cards

The system MUST render three feature cards: Desarrollo a Medida, Performance & Seguridad, and Entrega & Soporte.
(Previously: three generic service cards — Landing Pages, Corporate Sites, E-commerce — with single descriptions.)

Each card SHALL contain:
- An icon in an accent-tinted container
- A title (h3)
- A list of 5-6 deliverable bullet items using `<ul><li>`
- Visual structure: icon → title → list

#### Scenario: Visitor views feature cards
- GIVEN a visitor scrolls to the services section
- WHEN the section is in view
- THEN three distinct cards appear, each with its icon, title, and bullet list of deliverables

#### Scenario: Card hover effect
- GIVEN a visitor hovers over a feature card
- WHEN the pointer enters the card boundary
- THEN the card SHALL lift 4px via transform, display an elevated shadow, and show a gradient accent line at the top edge

#### Scenario: Theme consistency
- GIVEN the user has selected light or dark theme
- WHEN the feature cards render
- THEN card background, border, text, and accent colors SHALL use design-system CSS variables without hardcoded color values

#### Scenario: Mobile viewport
- GIVEN the viewport width is 375px
- WHEN the feature cards render
- THEN cards SHALL stack in a single column

#### Scenario: Typography and spacing
- GIVEN the feature cards render
- WHEN measured against visual quality standards
- THEN each card SHALL use generous padding (≥40px 32px), comfortable line-height (≥1.7), and bullet items with icon markers (checkmark or arrow)

### Requirement: Deliverable Content

The system MUST display exact deliverable lists per card.

#### Scenario: Desarrollo a Medida content
- GIVEN the feature cards render
- WHEN viewing the Desarrollo a Medida card
- THEN the bullet list SHALL include: Stack flexible (Astro, React o Next), Diseño 100% personalizado sin templates genéricos, Adaptable a celular/tablet/desktop, Panel de administración si el proyecto lo necesita, Integración con redes sociales, Dominio propio incluido el primer año

#### Scenario: Performance & Seguridad content
- GIVEN the feature cards render
- WHEN viewing the Performance & Seguridad card
- THEN the bullet list SHALL include: Carga instantánea sin bloat, 100/100 Lighthouse, Sin plugins de terceros ni superficie de ataque, Hosting incluido sin costo mensual, Certificado SSL de seguridad, Correos corporativos con configuración incluida

#### Scenario: Entrega & Soporte content
- GIVEN the feature cards render
- WHEN viewing the Entrega & Soporte card
- THEN the bullet list SHALL include: SEO on-page completo (meta tags, sitemap, schema), Botón de WhatsApp directo integrado, Capacitación personalizada en video, Soporte post-entrega con 4 cambios incluidos, Garantía de 7 días, Mantenimiento opcional desde $30.000/mes
