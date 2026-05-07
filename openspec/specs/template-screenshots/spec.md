# Template Screenshots

## Purpose
Automated screenshot capture of demo pages at 1600×900 resolution, saved as WebP files for use as template thumbnails.

## Requirements

### Requirement: Screenshot Dimensions
Captured screenshots MUST be 1600×900 pixels with a 16:9 aspect ratio.

#### Scenario: Correct dimensions
- GIVEN the screenshot script runs against a demo page
- WHEN the capture completes
- THEN the output image is exactly 1600 pixels wide and 900 pixels tall

#### Scenario: Aspect ratio validation
- GIVEN a captured screenshot file
- WHEN computing width divided by height
- THEN the ratio equals 16:9 (approximately 1.778)

### Requirement: WebP Output
Screenshots MUST be saved as WebP format files at `public/templates/{slug}.webp`.

#### Scenario: Files created at correct paths
- GIVEN the script runs successfully against all four demos
- WHEN checking the output directory
- THEN files exist at `public/templates/landing.webp`, `public/templates/negocio-local.webp`, `public/templates/profesional.webp`, and `public/templates/tienda-online.webp`

#### Scenario: Format validation
- GIVEN a screenshot file at `public/templates/{slug}.webp`
- WHEN inspecting the file header bytes
- THEN the file signature matches the WebP format (RIFF header with WEBP subtype)

#### Scenario: templates.json updated after capture
- GIVEN the screenshot script completes
- WHEN reading `templates.json`
- THEN each template's `image` field points to its corresponding WebP file (e.g., `/templates/landing.webp`) instead of the previous SVG

### Requirement: Script Execution
The screenshot capture MUST be runnable via `node scripts/screenshots.ts` after the site is built and a preview server is running.

#### Scenario: Successful execution
- GIVEN `npm run build` completed successfully and `npm run preview` is serving the site
- WHEN running `node scripts/screenshots.ts`
- THEN the script launches headless Chromium, captures all four demos, saves WebP files, and exits with code 0

#### Scenario: Preview server not running
- GIVEN the preview server is not running
- WHEN running `node scripts/screenshots.ts`
- THEN the script fails with a clear error message indicating the server is unreachable
