import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  fullyParallel: false,
  use: {
    headless: true,
    baseURL: 'http://localhost:4321',
    screenshot: 'off',
    video: 'off',
  },
  // Auto-start Astro dev server if not already running
  webServer: {
    command: 'pnpm dev',
    port: 4321,
    timeout: 30_000,
    reuseExistingServer: true,
  },
});
