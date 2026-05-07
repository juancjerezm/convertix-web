import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEMOS = ['landing', 'negocio-local', 'profesional', 'blog'];
const BASE_URL = 'http://localhost:4321';
const OUTPUT_DIR = path.join(ROOT, 'public', 'templates');
const VIEWPORT = { width: 1600, height: 900 };

async function checkServer() {
  try {
    const res = await fetch(`${BASE_URL}/demos/landing`);
    return res.ok;
  } catch {
    return false;
  }
}

async function captureDemo(browser, slug) {
  const url = `${BASE_URL}/demos/${slug}/`;
  const outputPath = path.join(OUTPUT_DIR, `${slug}.webp`);
  const tmpPath = path.join(OUTPUT_DIR, `${slug}.tmp.jpg`);

  console.log(`  → ${slug}: navigating to ${url}`);

  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Extra wait for fonts and images to render
    await page.waitForTimeout(2000);

    // Playwright only supports PNG/JPEG natively, so capture JPEG then convert with sharp
    await page.screenshot({
      path: tmpPath,
      type: 'jpeg',
      quality: 90,
      clip: { x: 0, y: 0, ...VIEWPORT },
    });

    // Convert JPEG to WebP with sharp
    await sharp(tmpPath)
      .resize(1600, 900, { fit: 'fill' })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Clean up temp file
    await unlink(tmpPath).catch(() => {});

    const { size } = await stat(outputPath);
    console.log(`  ✓ ${slug}: ${(size / 1024).toFixed(1)} KB`);
    return { slug, success: true, size };
  } catch (err) {
    console.error(`  ✗ ${slug}: FAILED — ${err.message}`);
    return { slug, success: false, error: err.message };
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('=== Template Screenshot Capture ===\n');

  // Check preview server
  console.log('Checking preview server...');
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('\n✗ Preview server is not running at http://localhost:4321');
    console.log('  Run: npm run build && npm run preview first');
    process.exitCode = 1;
    return;
  }
  console.log('  ✓ Server is reachable\n');

  // Ensure output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Launch browser
  console.log('Launching headless Chromium...');
  const browser = await chromium.launch({ headless: true });

  try {
    const results = await Promise.all(
      DEMOS.map((slug) => captureDemo(browser, slug))
    );

    // Summary
    console.log('\n=== Summary ===');
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    for (const r of successful) {
      console.log(`  ✓ ${r.slug}.webp — ${(r.size / 1024).toFixed(1)} KB`);
    }
    for (const r of failed) {
      console.log(`  ✗ ${r.slug} — ${r.error}`);
    }

    console.log(`\n${successful.length}/${DEMOS.length} screenshots captured.`);

    if (failed.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exitCode = 1;
});
