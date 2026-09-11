import { expect, type Page, test } from '@playwright/test'

/* ==========================================================================
   Process timeline — scroll-driven "trajectory" contract.
   A CSS-only (zero JS) flight path draws left -> right over the dashed
   timeline as the section scrolls in, with a spark at the drawing frontier
   and the badges igniting 1 -> 2 -> 3. Without animation-timeline support,
   or under prefers-reduced-motion: reduce, the static completed design is
   painted instead: solid line fully drawn, no spark, neutral badges.
   ========================================================================== */

const FILL = '.trajectory-fill'
const SPARK = '.trajectory-spark'

/** Scroll the timeline to the middle of the viewport (instant, no smooth). */
async function centerTimeline(page: Page) {
  await page.locator('.timeline').evaluate((el) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY - (window.innerHeight - rect.height) / 2
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior })
  })
}

/** Wait a deterministic number of animation frames. */
async function settle(page: Page, frames: number) {
  await page.evaluate(
    (count) =>
      new Promise<void>((resolve) => {
        const next = (left: number) => {
          if (left <= 0) {
            resolve()
            return
          }
          requestAnimationFrame(() => next(left - 1))
        }
        next(count)
      }),
    frames
  )
}

/** scaleX of the fill: matrix `a`, or 1 when transform is none. */
async function fillScaleX(page: Page): Promise<number> {
  return page.locator(FILL).evaluate((el) => {
    const transform = getComputedStyle(el).transform
    if (transform === 'none') return 1
    return new DOMMatrixReadOnly(transform).a
  })
}

test.describe('process timeline trajectory', () => {
  test('1. the line draws left to right as the timeline scrolls into view', async ({ page }) => {
    await page.goto('/')

    // Start from the top: the timeline must sit below the fold, undrawn.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
    await settle(page, 3)

    expect(await fillScaleX(page)).toBeLessThan(0.3)
    await expect(page.locator(SPARK)).toHaveCount(1)

    await centerTimeline(page)
    await settle(page, 3)
    expect(await fillScaleX(page)).toBeGreaterThan(0.9)
  })

  test('2. reduced motion paints the completed static line', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await centerTimeline(page)
    await settle(page, 2)

    expect(await fillScaleX(page)).toBeGreaterThan(0.9)
    expect(await page.locator(FILL).evaluate((el) => getComputedStyle(el).animationName)).toBe(
      'none'
    )
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('3. the CSS-only draw still reaches the completed state', async ({ page }) => {
      await page.goto('/')
      await centerTimeline(page)

      // With JS disabled page-side rAF callbacks never fire, so settle from
      // the driver instead of waiting on a frame inside the page.
      await page.waitForTimeout(200)
      expect(await fillScaleX(page)).toBeGreaterThan(0.9)
    })
  })
})
