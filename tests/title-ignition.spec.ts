import { expect, type Page, test } from '@playwright/test'

/* ==========================================================================
   Title ignition — scroll-driven weight scrub contract for .section-title.
   A CSS-only (zero JS) view() timeline drives the wght axis of Space Grotesk
   Variable (300-700): the title starts unlit at 310 as it enters the viewport
   and reaches the default lit 600 around the middle of the screen. The effect
   is reversible and never leaves a title thin while it is being read.
   Without animation-timeline support, or under prefers-reduced-motion:
   reduce, the title paints the static 600 look instead.
   ========================================================================== */

const TITLE = '#servicios .section-title'
const THIN = 310
const LIT = 600

/** Numeric wght value from computed font-variation-settings ("wght" 310). */
async function wght(page: Page): Promise<number> {
  const value = await page
    .locator(TITLE)
    .evaluate((el) => getComputedStyle(el).fontVariationSettings)
  const match = value.match(/"wght"\s+([\d.]+)/)
  if (!match) throw new Error(`No wght axis in computed font-variation-settings: "${value}"`)
  return Number.parseFloat(match[1])
}

/** Scroll the title's top edge to a given fraction of the viewport height. */
async function placeTitle(page: Page, viewportFraction: number) {
  await page.locator(TITLE).evaluate((el, fraction) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY - window.innerHeight * fraction
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
  }, viewportFraction)
}

test.describe('title ignition', () => {
  test('1. the weight scrubs up as the title reaches the middle of the viewport', async ({
    page
  }) => {
    await page.goto('/')

    // Start from the top: #servicios sits below the fold, so the title is unlit.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
    await page.waitForTimeout(150)

    const unlit = await wght(page)
    expect(unlit).toBeLessThan(400)
    expect(unlit).toBeGreaterThanOrEqual(THIN - 5)

    // Partially entered (~70% of the viewport): mid-scrub. A discrete flip
    // between the two endpoints would land on 600 here and fail.
    await placeTitle(page, 0.7)
    await page.waitForTimeout(150)
    const mid = await wght(page)
    expect(mid).toBeGreaterThan(unlit)
    expect(mid).toBeLessThan(LIT - 10)

    // Centered: fully lit, matching the default 600 look.
    await placeTitle(page, 0.5)
    await page.waitForTimeout(150)
    const lit = await wght(page)
    expect(lit).toBeGreaterThan(LIT - 10)
    expect(lit - unlit).toBeGreaterThan(100)

    // Scroll back up: the scrub is reversible and the title cools down.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
    await page.waitForTimeout(150)
    expect(await wght(page)).toBeLessThan(400)
  })

  test('2. reduced motion paints the static lit title', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForTimeout(100)

    const style = await page.locator(TITLE).evaluate((el) => {
      const cs = getComputedStyle(el)
      return {
        animationName: cs.animationName,
        variation: cs.fontVariationSettings,
        weight: cs.fontWeight
      }
    })

    expect(style.animationName).toBe('none')
    // No axis override means the computed font-weight 600 is what renders.
    expect(style.variation).toBe('normal')
    expect(style.weight).toBe('600')
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('3. the CSS-only scrub still ignites the title', async ({ page }) => {
      await page.goto('/')

      // Page JS never runs, so settle from the driver with short waits
      // instead of waiting on rAF inside the page.
      await page.waitForTimeout(150)
      const unlit = await wght(page)
      expect(unlit).toBeLessThan(400)

      await placeTitle(page, 0.5)
      await page.waitForTimeout(150)
      const lit = await wght(page)
      expect(lit).toBeGreaterThan(LIT - 10)
      expect(lit - unlit).toBeGreaterThan(100)
    })
  })
})
