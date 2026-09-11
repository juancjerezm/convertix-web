import { expect, test } from '@playwright/test'

/* ==========================================================================
   Template previews — full-page captures that scroll on hover (desktop only)
   ========================================================================== */

test.describe('Template previews: full-page capture', () => {
  test('1. desktop uses the full-page capture', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#plantillas .template-image img', { timeout: 10_000 })

    const img = page.locator('#plantillas .template-image img').first()
    await img.scrollIntoViewIfNeeded()

    // The <source media="(hover: hover)"> must win on desktop, and the
    // full-page capture must be much taller than the 16:9 fallback (0.56)
    // and the 4:3 card frame (1.33). Measured ratios after the 1200px-wide
    // downscale hover around 1.55–2.0.
    await expect
      .poll(() => img.evaluate((el) => (el as HTMLImageElement).currentSrc))
      .toContain('-full.webp')

    await expect
      .poll(() =>
        img.evaluate((el) => {
          const image = el as HTMLImageElement
          return image.naturalWidth > 0 ? image.naturalHeight / image.naturalWidth : 0
        })
      )
      .toBeGreaterThan(1.5)
  })

  test('2. hover scrolls the preview (object-position changes)', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('#plantillas .template-card').first()
    await card.scrollIntoViewIfNeeded()

    const preview = card.locator('.template-preview')
    const initial = await preview.evaluate((el) => getComputedStyle(el).objectPosition)

    await card.hover()
    await page.waitForTimeout(1500)

    const hovered = await preview.evaluate((el) => getComputedStyle(el).objectPosition)
    expect(hovered).not.toBe(initial)
  })

  test.describe('with prefers-reduced-motion: reduce', () => {
    test('3. hover does not scroll the preview', async ({ page }) => {
      // NOTE: test.use({ reducedMotion }) is silently ignored by Playwright
      // 1.60 (not in the context-option fixture whitelist), so emulate here.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      const card = page.locator('#plantillas .template-card').first()
      await card.scrollIntoViewIfNeeded()

      const preview = card.locator('.template-preview')
      const initial = await preview.evaluate((el) => getComputedStyle(el).objectPosition)

      await card.hover()
      await page.waitForTimeout(1500)

      const after = await preview.evaluate((el) => getComputedStyle(el).objectPosition)
      expect(after).toBe(initial)
    })
  })
})
