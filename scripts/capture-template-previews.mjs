/**
 * Capture full-page previews for the #plantillas section.
 *
 * Usage:
 *   1. Start the dev server:  pnpm dev
 *   2. Capture previews:      node scripts/capture-template-previews.mjs
 *
 * Override the server URL with BASE_URL (default: http://localhost:4321).
 * Output: public/templates/{id}-full.webp — width 1200, WebP quality 78
 * (retried at 68 when a file exceeds the 300 KB budget).
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = process.env.BASE_URL ?? 'http://localhost:4321'
const OUTPUT_DIR = path.join(ROOT, 'public', 'templates')
const MAX_FILE_BYTES = 300 * 1024
const MAX_TOTAL_BYTES = 1.2 * 1024 * 1024

async function capture(browser, id) {
  const url = `${BASE}/demos/${id}`
  const outputPath = path.join(OUTPUT_DIR, `${id}-full.webp`)
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1
  })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    await page.evaluate(() => document.fonts.ready.then(() => undefined))
    await page.waitForTimeout(300)

    const raw = await page.screenshot({ fullPage: true, type: 'png' })
    const pipeline = (quality) =>
      sharp(raw)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer({ resolveWithObject: true })

    let quality = 78
    let output = await pipeline(quality)
    if (output.info.size > MAX_FILE_BYTES) {
      quality = 68
      output = await pipeline(quality)
    }

    await writeFile(outputPath, output.data)

    const { width, height, size } = output.info
    const overBudget = size > MAX_FILE_BYTES ? ' — ⚠ over 300 KB budget' : ''
    console.log(`  ✓ ${outputPath} — ${width}×${height}px — ${(size / 1024).toFixed(1)} KB (q${quality})${overBudget}`)
    return size
  } finally {
    await page.close()
  }
}

async function main() {
  const templates = JSON.parse(await readFile(path.join(ROOT, 'src', 'data', 'templates.json'), 'utf8'))
  const ids = templates.map((template) => template.id)

  console.log(`Capturing ${ids.length} full-page previews from ${BASE}\n`)

  try {
    const response = await fetch(`${BASE}/demos/${ids[0]}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    console.error(`✗ Dev server not reachable at ${BASE} — start it with: pnpm dev`)
    console.error(`  (${error.message})`)
    process.exitCode = 1
    return
  }

  const browser = await chromium.launch({ headless: true })
  try {
    let total = 0
    let failures = 0

    for (const id of ids) {
      try {
        total += await capture(browser, id)
      } catch (error) {
        failures += 1
        console.error(`  ✗ ${id}: ${error.message}`)
      }
    }

    console.log(`\nTotal: ${(total / 1024).toFixed(1)} KB across ${ids.length - failures} file(s)`)
    if (total > MAX_TOTAL_BYTES) {
      console.warn(`⚠ Total exceeds the ${(MAX_TOTAL_BYTES / 1024 / 1024).toFixed(1)} MB budget`)
    }
    if (failures > 0) {
      process.exitCode = 1
    }
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message)
  process.exitCode = 1
})
