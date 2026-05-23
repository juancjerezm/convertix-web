## Exploration: value-positioning

### Current State

Convertix Web is an Astro 6.2.2 static landing page for a web development agency. The current page structure (index.astro) is: Hero → ServicesGrid → ProcessTimeline → LandingsExpress → Portfolio → About → FAQ → ContactForm → CtaFinal.

**Hero.astro** leads with speed (“Tu web lista en 5 días. Sin vueltas.”) and direct communication. No pricing. Typewriter cycles through “resultados / clientes / ventas”.

**ServicesGrid.astro** has 3 generic cards: Landing Pages, Sitios Web Corporativos, E-commerce. Descriptions are high-level and do not list specific deliverables. The visual pattern (`.service-card`) uses gradient top-border on hover, dark card background, icon + h3 + paragraph.

**ProcessTimeline.astro** shows 3 steps (Descubrimiento → Diseño & Desarrollo → Lanzamiento) with a horizontal connecting line. No branded methodology name.

**LandingsExpress.astro** renders template cards from `templates.json`. The component does NOT display the `price` field; only name, description, image, CTA and optional demo link.

**templates.json** currently lists prices: Landing Page $250K, Profesional $280K, Negocio Local $320K, Blog $350K. These are OUT OF SYNC with FAQ.astro, which states “landing express arranca en $400.000 COP”.

**FAQ.astro** is the source of truth for pricing: landing express $400K, sitio completo desde $1.4M, mantenimiento desde $30K/mes, hosting $0 (estático, sin DB).

**Styling conventions** from global.css:
- CSS custom properties for theming (dark/light via `data-theme`)
- `.section-label`, `.section-title`, `.section-subtitle` pattern
- Cards: `var(--bg-secondary)` background, `var(--border)` border, `calc(var(--radius) + 4px)` radius, hover with gradient top border via `::before`
- Responsive: 3-column grids collapse to 1fr at ≤768px
- `reveal` class for scroll-triggered visibility

### Affected Areas

- `src/components/ServicesGrid.astro` — will be REPLACED by FeaturesGrid.astro (new file)
- `src/components/Hero.astro` — copy update to communicate value against market pricing
- `src/components/ProcessTimeline.astro` — add branded methodology name, possibly rename step titles
- `src/data/templates.json` — update prices to match FAQ ($400K base)
- `src/pages/index.astro` — import name change if ServicesGrid → FeaturesGrid
- `src/styles/global.css` — may need new selectors for feature lists (bulleted/emoji lists inside cards)

### Rocket Launch Comparison

Rocket Launch’s landing page (competitor at $699.900 COP) has:
1. **Hero with anchored pricing** — “41% OFF” badge, checkout-style price display
2. **3-column “Ficha Técnica”** — highly detailed deliverables per column (Presencia & Diseño / Hosting & Servidor / Crecimiento & Soporte)
3. **Named methodology “ZERO-G”** — 3 steps with sub-bullets, branded and memorable
4. **Strong social proof** — case studies, metrics

Convertix currently lacks:
- Transparency: visitors don’t see exactly what they get
- Value anchoring: no frame of reference against market pricing
- Methodology branding: process feels generic

### Proposed FeaturesGrid Structure

Replace ServicesGrid with a 3-column **“¿Qué incluye tu web?”** grid. Each column is a card with an icon, title, and a list of deliverables (not paragraphs). Use the existing `.service-card` visual pattern for consistency.

**Column 1 — 💻 Desarrollo a Medida**
- Código 100% personalizado, sin plantillas genéricas
- Diseño responsive (mobile-first)
- Animaciones y microinteracciones
- Componentes reutilizables y escalables
- Integraciones: WhatsApp, redes sociales, newsletter
- SEO técnico: schema, sitemap, meta tags, velocidad

**Column 2 — 🛡️ Performance & Seguridad**
- Hosting gratuito (estático, sin costo mensual)
- Certificado SSL incluido
- Velocidad de carga optimizada (< 2s)
- Sin plugins ni dependencias innecesarias
- Código limpio, auditado y mantenible
- Backup automático del repositorio

**Column 3 — 🚀 Entrega & Soporte**
- Dominio propio (primer año incluido)
- Formularios conectados a WhatsApp / email
- Google Analytics + Search Console configurados
- Avances cada 2 días con acceso a preview
- 4 rondas de ajustes sin costo adicional
- Soporte post-entrega: primer mes gratis

> **Note on “correos corporativos”**: We do NOT list “correos ilimitados” because Convertix does not yet have Hetzner+VPS+HestiaCP infrastructure. If the user wants to mention email, phrase it as “Configuración de correos corporativos incluida” (meaning we set them up, not that we host them unlimited).

### Hero Value Proposition Update

Current hero emphasizes speed and directness. New angle:
- Still NO price in hero.
- Communicate: “What agencies charge $700K for, we deliver with better technology and zero hidden costs.”
- Keep the “5 días” promise but frame it as part of the value, not the only value.

Suggested headline direction:
> “Tu web profesional, lista en 5 días. Toda la funcionalidad que cobran $700K, sin costos ocultos.”

Or softer:
> “La web que tu negocio necesita, sin pagar de más. Desarrollo a medida, lista en 5 días.”

### Methodology Branding Options

The user requested 2–3 options for naming the 3-step process.

| Name | Rationale | Tone |
|------|-----------|------|
| **Método Vuelo** | Evokes taking off, launching, progress. “Despegar en 3 fases.” | Friendly, aspirational |
| **Sistema Órbita** | Implies continuous success orbiting the client. “3 ciclos para alcanzar órbita.” | Modern, tech-forward |
| **Protocolo CX** | Branded under Convertix. Professional, concise. “3 etapas, zero dispersión.” | Corporate, clean |

**Recommendation**: **Método Vuelo** is the strongest. It’s memorable, implies launch (directly contrasting with Rocket Launch’s “ZERO-G”), and translates naturally to the 3 steps: `Despegue` (Descubrimiento), `Impulso` (Diseño & Desarrollo), `Órbita` (Lanzamiento). But changing step titles risks confusing existing users. Safer: keep step titles as-is and brand the section header: **“Método Vuelo: Cómo trabajamos”**.

### Risks

1. **ServicesGrid replacement** — deleting ServicesGrid removes the “Landing Pages / Corporativos / E-commerce” framing. Ensure the new FeaturesGrid still communicates that Convertix handles multiple project types (FAQ and FeaturesGrid together should cover this).
2. **Hero copy sensitivity** — mentioning market pricing ($700K) must NOT sound like attacking a specific competitor. Use generic phrasing: “lo que en el mercado cuesta $700K”.
3. **Hosting claim consistency** — “Hosting $0/mes” is true today (Netlify static). If the user migrates to Hetzner VPS in the future, this claim will need updating. Add a note in the spec: hosting line must be easy to change.
4. **Template JSON price update** — currently the `price` field is unused in LandingsExpress.astro. Updating JSON is safe, but verify no other component or script consumes it.
5. **CSS scope** — FeaturesGrid will need a bulleted/emoji list style inside cards. The existing `.service-card p` style targets paragraphs; adding `<ul>` inside cards may need new CSS rules.
6. **Dark/light theme** — any new component must use `var(--*)` tokens, no hardcoded colors.

### Ready for Proposal

**Yes.** The exploration is clear enough to proceed to proposal. The orchestrator should ask the user:
1. Which methodology name they prefer (Método Vuelo / Sistema Órbita / Protocolo CX)?
2. Confirm the exact hero headline direction (value-anchor vs. soft)?
3. Should we mention “correos corporativos” in the FeaturesGrid at all, or omit until Hetzner infrastructure is ready?
