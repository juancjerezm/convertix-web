# Delta for Landing Process

## MODIFIED Requirements

### Requirement: Process Steps

The system MUST display three sequential steps under the branded section header "Método Vuelo".
(Previously: generic "Proceso" / "Cómo trabajamos" header with steps: Descubrimiento, Diseño & Desarrollo, Lanzamiento.)

#### Scenario: Section branding
- GIVEN a visitor scrolls to the process section
- WHEN the section renders
- THEN the section SHALL display "Método Vuelo" as the branded methodology header, replacing "Cómo trabajamos"

#### Scenario: Step titles
- GIVEN the process section renders
- WHEN viewing the timeline
- THEN Step 1 SHALL be "Despegue", Step 2 SHALL be "Impulso", and Step 3 SHALL be "Órbita"

#### Scenario: Step descriptions preserved
- GIVEN the steps are renamed
- WHEN viewing each step
- THEN each step SHALL retain its existing description paragraph without content changes

#### Scenario: Mobile stacking
- GIVEN the viewport is a mobile device
- WHEN the process section renders
- THEN steps SHALL stack vertically maintaining sequential order (1 → 2 → 3)
