import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/* ==========================================================================
   Brand refresh — "Ignition" foundation
   Static warm-dark surfaces, single orange accent, self-hosted type.
   ========================================================================== */

test.describe('Brand refresh foundation', () => {
  test('1. particle canvas and animated blobs are gone', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#particle-canvas')).toHaveCount(0)
    await expect(page.locator('.bg-blobs')).toHaveCount(0)
  })

  test('2. headings use the Space Grotesk display face', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10_000 })

    const fontFamily = await page.evaluate(() => {
      const el = document.querySelector('h1')
      return el ? getComputedStyle(el).fontFamily : ''
    })
    expect(fontFamily).toContain('Space Grotesk')
  })

  test('3. body uses the warm near-black surface by default', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme'))
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')

    const backgroundColor = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    )
    expect(backgroundColor).toBe('rgb(12, 11, 10)')
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('4. hero renders visible and reveals stay visible', async ({ page }) => {
      await page.goto('/')

      await expect(page.locator('h1')).toBeVisible()

      const firstRevealOpacity = await page.evaluate(() => {
        const el = document.querySelector('.reveal')
        return el ? getComputedStyle(el).opacity : null
      })
      expect(firstRevealOpacity).toBe('1')
    })
  })

  test.describe('with prefers-reduced-motion: reduce', () => {
    test('5. reveal content is visible with no transition', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/')
      await page.waitForSelector('.reveal', { timeout: 10_000 })

      const revealOpacity = await page.evaluate(() => {
        const el = document.querySelector('.reveal')
        return el ? getComputedStyle(el).opacity : null
      })
      expect(revealOpacity).toBe('1')
    })
  })

  test('6. theme toggle switches data-theme and body background', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme'))
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    await page.waitForSelector('.theme-toggle', { timeout: 10_000 })

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const darkBackground = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    )
    expect(darkBackground).toBe('rgb(12, 11, 10)')

    await page.locator('.theme-toggle').click()

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    const lightBackground = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    )
    expect(lightBackground).toBe('rgb(246, 243, 237)')
  })

  test('7. axe-core zero violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#servicios', { timeout: 10_000 })
    await page.waitForSelector('#contacto', { timeout: 10_000 })

    const results = await new AxeBuilder({ page }).disableRules(['heading-order']).analyze()
    expect(results.violations).toEqual([])
  })
})
