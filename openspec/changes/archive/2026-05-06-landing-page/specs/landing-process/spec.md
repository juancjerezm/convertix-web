# Landing Process

## Purpose
Visual timeline showing the 3-step delivery workflow.

## Requirements

### Requirement: Process Steps
The system MUST display three sequential steps representing the agency workflow.

#### Scenario: Visitor views the process
- GIVEN a visitor scrolls to the process section
- WHEN the section renders
- THEN three steps appear in numbered order with step name and brief description each

#### Scenario: Narrow viewport
- GIVEN the viewport is a mobile device
- WHEN the process section renders
- THEN steps SHALL stack vertically maintaining sequential order
