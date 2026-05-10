# theme-toggle Specification

## Purpose

Light/dark mode switching with localStorage persistence and OS preference detection. Theme applies before first paint via inline blocking script. Accent colors, gradients, and grain texture remain identical across modes.

## Requirements

| # | Requirement | Strength | Scenarios |
|---|-------------|----------|-----------|
| R1 | Default Dark Mode | MUST | 3 |
| R2 | Theme Toggle | MUST | 2 |
| R3 | Preference Persistence | MUST | 3 |
| R4 | Accent Color Invariance | MUST | 3 |
| R5 | Grain Texture Consistency | MUST | 1 |
| R6 | Dark Mode Regression | MUST | 1 |

### Requirement: Default Dark Mode

The system MUST render dark theme on first visit. When no `theme` key exists in localStorage, the system MUST use `prefers-color-scheme` as fallback. If neither is set, dark mode is the default.

#### Scenario: First visit — no stored preference, no OS preference

- GIVEN localStorage has no `theme` key AND OS `prefers-color-scheme` is unset
- WHEN the page loads
- THEN `<html data-theme="dark">` is set before first paint

#### Scenario: First visit — OS prefers dark

- GIVEN localStorage has no `theme` key AND `prefers-color-scheme: dark`
- WHEN the page loads
- THEN `<html data-theme="dark">` is set before first paint

#### Scenario: First visit — OS prefers light

- GIVEN localStorage has no `theme` key AND `prefers-color-scheme: light`
- WHEN the page loads
- THEN `<html data-theme="light">` is set before first paint

### Requirement: Theme Toggle

The system MUST provide a toggle button in the Navbar that switches the `data-theme` attribute.

#### Scenario: Switch dark to light

- GIVEN `<html data-theme="dark">`
- WHEN visitor clicks the theme toggle
- THEN `data-theme` changes to `"light"` AND light mode colors render

#### Scenario: Switch light to dark

- GIVEN `<html data-theme="light">`
- WHEN visitor clicks the theme toggle
- THEN `data-theme` changes to `"dark"` AND dark mode colors render

### Requirement: Preference Persistence

The system MUST persist the user's choice to localStorage under the `theme` key (`"dark"` or `"light"`). On subsequent visits, stored preference MUST override OS preference and MUST apply before first paint.

#### Scenario: Save preference on toggle

- GIVEN `data-theme` is `"dark"`
- WHEN visitor clicks toggle to switch to light
- THEN localStorage `theme` is set to `"light"`

#### Scenario: Stored light overrides OS dark

- GIVEN localStorage `theme = "light"` AND OS `prefers-color-scheme: dark`
- WHEN the page reloads
- THEN `<html data-theme="light">` is set before first paint AND no dark flash occurs

#### Scenario: Stored dark overrides OS light

- GIVEN localStorage `theme = "dark"` AND OS `prefers-color-scheme: light`
- WHEN the page reloads
- THEN `<html data-theme="dark">` is set before first paint AND no light flash occurs

### Requirement: Accent Color Invariance

Accent colors (`--accent-blue: #0070f3`, `--accent-purple: #7928ca`) and the CTA button gradient MUST render identically in both light and dark modes.

#### Scenario: Accent blue identical

- GIVEN the page is in light mode
- WHEN any element renders with `--accent-blue`
- THEN the color is `#0070f3` — matching dark mode

#### Scenario: Accent purple identical

- GIVEN the page is in light mode
- WHEN any element renders with `--accent-purple`
- THEN the color is `#7928ca` — matching dark mode

#### Scenario: CTA gradient identical

- GIVEN the page is in light mode
- WHEN the CTA button renders
- THEN its gradient matches the dark mode gradient exactly

### Requirement: Grain Texture Consistency

The grain/noise overlay MUST render identically in both modes.

#### Scenario: Grain unchanged in light mode

- GIVEN the page is in light mode
- WHEN the grain texture overlay renders
- THEN opacity, blend mode, and appearance match dark mode

### Requirement: Dark Mode Regression

Dark mode MUST render identically to its pre-change state.

#### Scenario: No visual regression in dark mode

- GIVEN the page is in dark mode
- WHEN comparing pre-change and post-change rendering
- THEN backgrounds, text, borders, shadows, and glows are pixel-identical
