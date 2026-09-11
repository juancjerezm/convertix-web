import { expect, type Page, test } from '@playwright/test'

/* ==========================================================================
   Kinetic band ("Banda Ignition") — CSS-only marquee contract.
   A decorative strip loops the six brand phrases leftwards forever using
   nothing but CSS keyframes: no JS, no canvas, no particles. It must sit
   between the hero and the services grid, stay decorative (aria-hidden, no
   focusables), freeze under prefers-reduced-motion: reduce, and never
   introduce horizontal overflow.
   ========================================================================== */

const BAND = '.kinetic-band'
const TRACK = '.kinetic-band-track'
const ITEM = '.kinetic-band-item'

const PHRASES = [
  'PÁGINAS WEB EN 3 DÍAS',
  'HERRAMIENTAS CON IA',
  'AUTOMATIZACIÓN CON IA',
  'PÁGINAS EXPRESS',
  'SEO LOCAL',
  'SIN AGENCIA, SIN VUELTAS'
]

/** documentElement horizontal overflow in pixels (0 or negative = none). */
async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
}

test.describe('kinetic band', () => {
  test('1. renders between hero and features with the six phrases', async ({ page }) => {
    await page.goto('/')

    const band = page.locator(BAND)
    await expect(band).toHaveCount(1)

    // Document order proves the placement: hero -> band -> features.
    const between = await page.evaluate(() => {
      const hero = document.querySelector('.hero')
      const strip = document.querySelector('.kinetic-band')
      const features = document.querySelector('.features')
      if (!hero || !strip || !features) return false
      const follows = (base: Element, other: Element) =>
        (base.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
      return follows(hero, strip) && follows(strip, features)
    })
    expect(between).toBe(true)

    // Decorative: no focusable elements and no scripts inside the band.
    await expect(band.locator('a, button, input, select, textarea, [tabindex]')).toHaveCount(0)
    await expect(band.locator('script')).toHaveCount(0)

    // The repeated visual track stays out of the accessibility tree.
    const track = page.locator(TRACK)
    await expect(track).toHaveAttribute('aria-hidden', 'true')

    for (const phrase of PHRASES) {
      await expect(track).toContainText(phrase)
    }
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('2. the marquee runs from CSS alone', async ({ page }) => {
      await page.goto('/')
      await expect(page.locator(TRACK)).toBeVisible()

      // With JS disabled page-side rAF never fires, so settle from the driver.
      await page.waitForTimeout(250)

      const animation = await page.locator(TRACK).evaluate((el) => {
        const style = getComputedStyle(el)
        return {
          name: style.animationName,
          duration: style.animationDuration,
          iterationCount: style.animationIterationCount,
          playState: style.animationPlayState
        }
      })

      expect(animation.name).toBe('kinetic-marquee')
      expect(animation.duration).toBe('22s')
      expect(animation.iterationCount).toBe('infinite')
      expect(animation.playState).toBe('running')
    })
  })

  test('3. reduced motion freezes the band and keeps it legible', async ({ page }) => {
    // Playwright 1.60 ignores test.use({ reducedMotion }); emulate it instead.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const track = page.locator(TRACK)
    const animationName = await track.evaluate((el) => getComputedStyle(el).animationName)
    expect(animationName).toBe('none')

    // The duplicate group is hidden; the first copy stays readable.
    await expect(page.locator('.kinetic-band-group').nth(1)).toBeHidden()
    const items = page.locator('.kinetic-band-group').first().locator(ITEM)
    await expect(items).toHaveCount(PHRASES.length)
    await expect(items.first()).toBeVisible()
    await expect(items.last()).toBeVisible()

    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
  })

  test.describe('at 1280px wide', () => {
    test.use({ viewport: { width: 1280, height: 720 } })

    test('4. the band introduces no horizontal overflow', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('load')
      await expect(page.locator(BAND)).toBeVisible()

      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1)
    })
  })
})
