# Landing Contact

## Purpose
Contact form, WhatsApp link, and email for client inquiries.

## Requirements

### Requirement: Contact Channels
The system MUST provide three contact channels: a form, a WhatsApp link, and a visible email address.

#### Scenario: Visitor opens contact section
- GIVEN a visitor scrolls to the contact section
- WHEN the section renders
- THEN a form with name, email, and message fields, a WhatsApp button, and the agency email are all visible

### Requirement: Form Validation
The system MUST validate that required fields are filled before submission.

#### Scenario: Visitor submits incomplete form
- GIVEN the contact form is visible
- WHEN a visitor submits without filling required fields
- THEN the form SHALL display validation errors and prevent submission

#### Scenario: Visitor uses WhatsApp
- GIVEN the contact section is visible
- WHEN a visitor clicks the WhatsApp button
- THEN the WhatsApp deep link opens to the agency number
