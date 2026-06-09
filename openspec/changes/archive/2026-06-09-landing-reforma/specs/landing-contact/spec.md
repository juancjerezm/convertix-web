# Delta for Landing Contact

## MODIFIED Requirements

### Requirement: Contact Channels
The system MUST provide three contact channels: a form, a WhatsApp link with prefill message, and a visible email address. The CTA heading SHALL read "Cuéntame tu proyecto" and the WhatsApp button SHALL read "Cuéntame tu proyecto 📲".

(Previously: CTA heading was "¿Hablamos hoy?" and WhatsApp button was "💬 Escribime ahora" without message prefill)

#### Scenario: Visitor opens contact section
- GIVEN a visitor scrolls to the contact section
- WHEN the section renders
- THEN the heading displays "Cuéntame tu proyecto"
- AND the WhatsApp button label is "Cuéntame tu proyecto 📲"
- AND a form with name, email, and message fields, and the agency email are visible

#### Scenario: Visitor uses WhatsApp
- GIVEN the contact section is visible
- WHEN a visitor clicks the WhatsApp button
- THEN the WhatsApp deep link SHALL open to `https://wa.me/573163000208?text=¡Hola!%20Vi%20tu%20página%20y%20quiero%20contarte%20sobre%20mi%20proyecto.`
- AND the prefill message SHALL be "¡Hola! Vi tu página y quiero contarte sobre mi proyecto."

#### Scenario: Form remains secondary option
- GIVEN the CTA copy has changed
- WHEN the contact section renders
- THEN the Netlify form with name, email, and message fields SHALL remain functional
- AND honeypot + Turnstile anti-spam SHALL remain active
