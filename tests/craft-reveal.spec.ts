import { expect, type Page, test } from '@playwright/test'

/* ==========================================================================
   Craft reveal — scroll-driven veil draw contract for inner blocks.
   A CSS-only (zero JS) view() timeline slides a gradient mask (three times
   the block height) over the block, so it emerges from a soft-edged veil
   while it is on screen and re-veils when scrolling back up. Repeated cards
   cascade: even siblings run a +3% range offset. Sections themselves never
   animate. Without animation-timeline support, with JavaScript disabled, or
   under prefers-reduced-motion: reduce, the blocks paint fully visible with
   no mask.
   ========================================================================== */

declare global {
  interface Window {
    __vtCalls?: number
  }
}

/** A real inner block: small, so the veil edge crosses it in-view. */
const BLOCK = '#servicios .section-subtitle'

/**
 * The veil position as the computed `mask-position` Y value, in percent:
 * 100% means fully veiled (block hidden behind the transparent mask
 * region), 0% means fully visible (block inside the black cap).
 */
async function veilY(page: Page): Promise<number> {
  const value = await page.locator(BLOCK).evaluate((el) => getComputedStyle(el).maskPosition)
  const parts = value.trim().split(/\s+/)
  const y = parts[1] ?? parts[0]
  const parsed = Number.parseFloat(y)
  if (Number.isNaN(parsed)) throw new Error(`Unexpected mask-position: "${value}"`)
  return parsed
}

/**
 * Scroll so the block's cover() progress equals `fraction`: 0 puts the block
 * top at the viewport bottom, 0.5 centers it, and 1 puts the block bottom at
 * the viewport top. Height-independent, so the scrub stays mid-draw for any
 * targeted block size.
 */
async function placeBlock(page: Page, coverFraction: number) {
  await page.locator(BLOCK).evaluate((el, fraction) => {
    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const top = viewportHeight - fraction * (viewportHeight + rect.height)
    window.scrollTo({ top: rect.top + window.scrollY - top, behavior: 'instant' as ScrollBehavior })
  }, coverFraction)
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

test.describe('craft reveal', () => {
  test('1. a block emerges from the veil on entry and re-veils when scrolling back up', async ({
    page
  }) => {
    await page.goto('/')
    await page.waitForSelector(BLOCK, { timeout: 10_000 })

    // Page top: the block sits below the fold, fully veiled.
    await settle(page, 3)
    expect(await veilY(page)).toBeGreaterThan(95)

    // Midway through the cover range: mid-draw. A discrete flip would land
    // on 0 or 100, and a veil stalled off-screen would read 100.
    await placeBlock(page, 0.45)
    await settle(page, 3)
    const mid = await veilY(page)
    expect(mid).toBeGreaterThan(5)
    expect(mid).toBeLessThan(95)

    // Well into view: fully revealed, no mask offset left.
    await placeBlock(page, 0.7)
    await settle(page, 3)
    expect(await veilY(page)).toBeLessThan(1)

    // Scroll back up: the scrub is reversible and the block re-veils.
    await placeBlock(page, 0.45)
    await settle(page, 3)
    expect(await veilY(page)).toBeGreaterThan(5)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }))
    await settle(page, 3)
    expect(await veilY(page)).toBeGreaterThan(95)
  })

  test('2. reduced motion paints the static unmasked block', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.waitForSelector(BLOCK, { timeout: 10_000 })

    const atTop = await page.locator(BLOCK).evaluate((el) => {
      const cs = getComputedStyle(el)
      return { mask: cs.maskImage, animation: cs.animationName, opacity: cs.opacity }
    })
    expect(atTop.animation).toBe('none')
    expect(atTop.mask).toBe('none')
    expect(atTop.opacity).toBe('1')

    // In view it stays unclipped: no mask is ever painted.
    await placeBlock(page, 0.3)
    await page.waitForTimeout(150)
    expect(await veilY(page)).toBe(0)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('3. the CSS-only draw still reaches the revealed state in view', async ({ page }) => {
      await page.goto('/')

      // Page JS never runs, so settle from the driver with short waits
      // instead of waiting on rAF inside the page.
      await page.waitForTimeout(150)
      expect(await veilY(page)).toBeGreaterThan(95)

      await placeBlock(page, 0.7)
      await page.waitForTimeout(250)
      expect(await veilY(page)).toBeLessThan(1)
    })
  })

  test('4. theme toggle still flips through the View Transition path', async ({ page }) => {
    await page.addInitScript(() => {
      window.__vtCalls = 0
      const original = Document.prototype.startViewTransition
      if (typeof original !== 'function') return
      document.startViewTransition = (callback) => {
        window.__vtCalls = (window.__vtCalls ?? 0) + 1
        return original.call(document, callback)
      }
    })
    await page.addInitScript(() => localStorage.removeItem('theme'))
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    // Without the View Transitions API the Navbar takes its fallback path;
    // the fallback toggle itself is covered by the brand-refresh theme test.
    test.skip(
      !(await page.evaluate(() => typeof document.startViewTransition === 'function')),
      'View Transitions API unavailable in this browser'
    )
    await page.waitForSelector('.theme-toggle', { timeout: 10_000 })

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    await page.locator('.theme-toggle').click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light')
    expect(await page.evaluate(() => window.__vtCalls ?? 0)).toBeGreaterThan(0)
  })

  test('5. the veil edge is visible on screen mid-draw (regression guard)', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector(BLOCK, { timeout: 10_000 })

    // Cover 45%: the middle of the scrub (range cover 35% -> 55%).
    await placeBlock(page, 0.45)
    await settle(page, 3)

    const probe = await page.locator(BLOCK).evaluate((el) => {
      const parts = getComputedStyle(el).maskPosition.trim().split(/\s+/)
      const y = Number.parseFloat(parts[1] ?? parts[0]) / 100
      const rect = el.getBoundingClientRect()
      // The block window sits at [2h·y, h + 2h·y] in mask coordinates and
      // the veil band spans 48% -> 52% of the 3h mask, so the on-screen
      // center of the moving edge is rect.top + (1.5 - 2y)·h.
      const edgeCenter = rect.top + (1.5 - 2 * y) * rect.height
      return { yPercent: y * 100, edgeCenter, viewportHeight: window.innerHeight }
    })

    // Partially veiled: a discrete 0/100 flip would not prove a live scrub.
    expect(probe.yPercent).toBeGreaterThan(5)
    expect(probe.yPercent).toBeLessThan(95)

    // The regression: with the old whole-section range the moving edge
    // stayed off-screen. The veil edge must cross the viewport on screen.
    expect(probe.edgeCenter).toBeGreaterThan(0)
    expect(probe.edgeCenter).toBeLessThan(probe.viewportHeight)
  })

  test('6. repeated cards cascade instead of wiping in unison', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.templates-grid .template-card')
    await cards.first().waitFor({ state: 'attached', timeout: 10_000 })

    // Park the first card mid-draw: the second card shares the grid row, so
    // any mask-position gap between them comes from the +3% cascade offset.
    await cards.first().evaluate((el) => {
      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const top = viewportHeight - 0.45 * (viewportHeight + rect.height)
      window.scrollTo({ top: rect.top + window.scrollY - top, behavior: 'instant' as ScrollBehavior })
    })
    await settle(page, 3)

    const ys = await cards.evaluateAll((els) =>
      els.slice(0, 2).map((el) => {
        const parts = getComputedStyle(el).maskPosition.trim().split(/\s+/)
        return Number.parseFloat(parts[1] ?? parts[0])
      })
    )

    expect(ys).toHaveLength(2)
    expect(Math.abs(ys[0] - ys[1])).toBeGreaterThan(5)
  })
})
