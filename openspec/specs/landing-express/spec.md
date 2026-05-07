# Landings Express

## Purpose
Budget template tier with preview grid and WhatsApp contact CTA.

## Requirements

### Requirement: Template Grid
The system MUST display at least four pre-built template preview cards in a grid layout.

#### Scenario: Visitor explores budget templates
- GIVEN a visitor scrolls to the Landings Express section
- WHEN the section renders
- THEN a grid of four or more template preview cards is visible, each showing a template name and thumbnail

### Requirement: Contact CTA
The system MUST include a WhatsApp link as the primary call to action for this section.

#### Scenario: Visitor taps the CTA
- GIVEN the Landings Express section is visible
- WHEN a visitor clicks the contact button
- THEN the WhatsApp deep link opens to the agency number with a pre-filled message referencing templates

#### Scenario: No templates available
- GIVEN template images fail to load
- WHEN the section renders
- THEN cards SHALL display placeholder visuals with template names still visible
