# Landing SEO

## Purpose
Search engine and social media metadata for discovery and sharing.

## Requirements

### Requirement: Meta Tags
The system MUST include a page title and meta description in the document head.

#### Scenario: Search engine crawls the page
- GIVEN a search bot requests the page
- WHEN the HTML is served
- THEN the `<title>` tag and `<meta name="description">` are present with relevant content

### Requirement: Open Graph
The system MUST include Open Graph tags for social sharing.

#### Scenario: Page is shared on social media
- GIVEN a user shares the page URL
- WHEN the platform scrapes the page
- THEN `og:title`, `og:description`, `og:image`, and `og:url` tags are present

### Requirement: Sitemap
The system MUST generate a `sitemap.xml` with all page URLs at build time.

#### Scenario: Sitemap is requested
- GIVEN the site is deployed
- WHEN `/sitemap.xml` is requested
- THEN an XML sitemap listing all pages is served
