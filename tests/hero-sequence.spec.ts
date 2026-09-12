import { expect, test } from '@playwright/test'

/* ==========================================================================
   Hero live sequence — progressive enhancement contract.
   With JS and motion allowed, the mock terminal types itself and the
   document automation rows pop in. Without JS, or under
   prefers-reduced-motion: reduce, the final frame is painted immediately
   (and any JS failure settles it < 7s).
   ========================================================================== */

function finalStateProbe() {
  const oks = document.querySelectorAll('.mock-window-body .mock-ok')
  const lastOk = oks[oks.length - 1] ?? null
  const fileRow = document.querySelector('.mock-row-file')
  const okRows = document.querySelectorAll('.mock-row-ok')
  const number = document.querySelector('.hero h1 .highlight-orange')
  const caret = document.querySelector('.caret')
  const commands = document.querySelectorAll('.mock-window-body .type-text')

  const shown = (el: Element | null) => {
    if (!el) return false
    const style = getComputedStyle(el)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number.parseFloat(style.opacity) > 0.9
    )
  }

  return {
    lastOkText: lastOk?.textContent?.trim() ?? '',
    lastOkShown: shown(lastOk),
    fileRowText: fileRow?.textContent?.trim() ?? '',
    fileRowShown: shown(fileRow),
    okRowsText: Array.from(okRows).map((el) => el.textContent?.trim() ?? ''),
    okRowsShown: Array.from(okRows).every((el) => shown(el)),
    numberShown: shown(number),
    commands: Array.from(commands).map((el) => el.textContent?.trim() ?? ''),
    caretAnimation: caret ? getComputedStyle(caret).animationName : 'none'
  }
}

const finalFrame = () => ({
  lastOkText: expect.stringContaining('tu-negocio.com'),
  lastOkShown: true,
  fileRowText: 'factura-1042.pdf',
  fileRowShown: true,
  okRowsText: ['✓ datos extraídos', '✓ registrada en tu sistema'],
  okRowsShown: true,
  numberShown: true,
  commands: ['pnpm build', 'convertix deploy'],
  caretAnimation: 'none'
})

test.describe('hero live sequence', () => {
  test('1. with JS the sequence reaches the final frame within ~7s', async ({ page }) => {
    await page.goto('/')

    // Gated start: the last confirmation row is hidden until the sequence pops it in.
    await expect(page.locator('.mock-row-ok').last()).toBeHidden()

    await expect
      .poll(async () => page.evaluate(finalStateProbe), {
        timeout: 7_000,
        message: 'the hero sequence should settle on the final frame within 7s'
      })
      .toEqual(finalFrame())
  })

  test('2. reduced motion paints the final frame immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const started = Date.now()
    await expect
      .poll(async () => page.evaluate(finalStateProbe), { timeout: 700 })
      .toEqual(finalFrame())
    expect(Date.now() - started).toBeLessThan(700)
  })

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })

    test('3. the final frame is fully visible', async ({ page }) => {
      await page.goto('/')

      await expect
        .poll(async () => page.evaluate(finalStateProbe), { timeout: 2_000 })
        .toEqual(finalFrame())

      await expect(page.locator('.mock-window-body .mock-ok').last()).toBeVisible()
      await expect(page.locator('.mock-row-file')).toBeVisible()
      await expect(page.locator('.mock-row-ok')).toHaveCount(2)
      await expect(page.locator('.mock-row-ok').first()).toBeVisible()
      await expect(page.locator('.mock-row-ok').last()).toBeVisible()
    })
  })
})
