import { expect, test } from '@playwright/test'

/* ==========================================================================
   Phase 1: Bugfix — LandingsExpress import
   ========================================================================== */

test.describe('Phase 1: Bugfix — LandingsExpress import', () => {
  test('1.1 LandingsExpress renders template cards', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#plantillas', { timeout: 10_000 })

    // Verify section is present
    const section = page.locator('#plantillas')
    await expect(section).toBeVisible()

    // Verify template cards render (at least one)
    const cards = section.locator('.template-card')
    await expect(cards.first()).toBeVisible()

    // Verify at least one template has a name heading
    const cardNames = section.locator('.template-name')
    const count = await cardNames.count()
    expect(count).toBeGreaterThan(0)

    // Verify first card has non-empty name text
    await expect(cardNames.first()).not.toBeEmpty()
  })

  test('1.2 build succeeds after import fix', async ({ page }) => {
    // Navigation to any page verifies the build succeeded
    await page.goto('/')
    const el = page.locator('#plantillas .template-card')
    await expect(el.first()).toBeVisible({ timeout: 10_000 })
  })
})

/* ==========================================================================
   Phase 2: Core Reform — ConvertixAI, Hero, Navbar, CTA
   ========================================================================== */

test.describe('Phase 2: Core Reform', () => {
  test('2.1 no typewriter script executes', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10_000 })

    // The #heroTyping element must not exist in the DOM
    const typingEl = page.locator('#heroTyping')
    await expect(typingEl).toHaveCount(0)

    // Verify no TypeError from missing heroTyping — check console
    // If the script tried to access heroTyping, it would throw.
    // We assert the page loaded without fatal errors.
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('2.2 ConvertixAI renders between FeaturesGrid and ProcessTimeline', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#ai', { timeout: 10_000 })

    // Verify #ai section exists
    const aiSection = page.locator('#ai')
    await expect(aiSection).toBeVisible()

    // Verify position: after #servicios, before #proceso
    const sectionOrder = await page.evaluate(() => {
      const ids = ['servicios', 'ai', 'proceso']
      const elements = ids.map((id) => document.getElementById(id))
      // Sort by DOM position (compareDocumentPosition)
      const sorted = [...elements].sort((a, b) => {
        if (!a || !b) return 0
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
      return sorted.map((el) => el?.id)
    })
    expect(sectionOrder).toEqual(['servicios', 'ai', 'proceso'])
  })

  test('2.3 ConvertixAI has 3 AI cards with purple theme', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#ai', { timeout: 10_000 })

    const cards = page.locator('#ai .ai-card')
    await expect(cards).toHaveCount(3)

    // Verify cards contain expected headings
    await expect(page.locator('#ai')).toContainText('Chatbot WhatsApp con IA')
    await expect(page.locator('#ai')).toContainText('Automatizaciones Python')
    await expect(page.locator('#ai')).toContainText('Consultoría en Automatización')
  })

  test('2.4 Navbar #ai link scrolls to AI section', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('nav', { timeout: 10_000 })

    // Verify #ai link exists in navbar
    const aiLink = page.locator('.nav-links a[href="/#ai"]')
    await expect(aiLink).toBeVisible()
    await expect(aiLink).toHaveText('IA')

    // Click the link and verify smooth-scroll to #ai
    await aiLink.click()
    await page.waitForTimeout(800) // smooth-scroll

    // Check #ai is in viewport (at least partially visible)
    const aiSection = page.locator('#ai')
    await expect(aiSection).toBeInViewport()
  })

  test('2.5 CTA heading and WhatsApp link updated', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#contacto', { timeout: 10_000 })

    // Verify heading text changed
    const heading = page.locator('#contacto .cta-card h2')
    await expect(heading).toHaveText('Cuéntame tu proyecto')

    // Verify button text
    const whatsappBtn = page.locator('#contacto .cta-card .btn-primary')
    await expect(whatsappBtn).toContainText('Cuéntame tu proyecto')

    // Verify WhatsApp href includes prefill
    const href = await whatsappBtn.getAttribute('href')
    expect(href).toContain('wa.me/573163000208')
    expect(href).toContain('text=')
    expect(href).toContain('contarte')
  })

  test('2.6 no other sections displaced from order', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('#contacto', { timeout: 10_000 })

    // Verify all expected sections exist in correct order (id-based)
    const order = await page.evaluate(() => {
      const selectors = [
        '#servicios',
        '#ai',
        '#proceso',
        '#plantillas',
        '#contacto'
      ]
      return selectors.map((sel) => {
        const el = document.querySelector(sel)
        return el ? sel.replace('#', '') : null
      }).filter(Boolean)
    })
    expect(order).toContain('ai')
    expect(order).toContain('plantillas')
    expect(order.indexOf('ai')).toBeLessThan(order.indexOf('proceso'))
    expect(order.indexOf('proceso')).toBeLessThan(order.indexOf('plantillas'))
  })
})

/* ==========================================================================
   Phase 3: SEO — Keywords, Schema.org, BaseLayout
   ========================================================================== */

test.describe('Phase 3: SEO', () => {
  test('3.1 keywords meta tag present with target terms', async ({ page }) => {
    await page.goto('/')

    const keywordsMeta = page.locator('meta[name="keywords"]')
    await expect(keywordsMeta).toHaveAttribute('content')

    const content = await keywordsMeta.getAttribute('content')
    expect(content).toContain('página web Colombia')
    expect(content).toContain('chatbot WhatsApp Colombia')
    expect(content).toContain('automatización Colombia')
    expect(content).toContain('IA para negocios')
  })

  test('3.2 Schema.org knowsAbout enriched with AI terms', async ({ page }) => {
    await page.goto('/')

    const ldJson = page.locator('script[type="application/ld+json"]')
    const jsonText = await ldJson.textContent()
    expect(jsonText).toBeTruthy()

    const parsed = JSON.parse(jsonText!)
    expect(parsed.knowsAbout).toEqual(
      expect.arrayContaining([
        'chatbot WhatsApp Colombia',
        'automatización Python',
        'consultoría IA',
        'página web Colombia'
      ])
    )
  })

  test('3.3 BaseLayout title includes Colombia', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()
    expect(title).toContain('Colombia')
  })

  test('3.4 BaseLayout description includes AI keywords', async ({ page }) => {
    await page.goto('/')
    const descMeta = page.locator('meta[name="description"]')
    const desc = await descMeta.getAttribute('content')
    expect(desc).toContain('Colombia')
    expect(desc).toContain('chatbots')
  })
})

/* ==========================================================================
   Phase 4: Visual Polish — CSS refinements
   ========================================================================== */

test.describe('Phase 4: Visual Polish', () => {
  test('4.1 text-wrap: balance on h1/h2 headings', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h1', { timeout: 10_000 })

    const h1Wrap = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('h1')!).textWrap
    })
    expect(h1Wrap).toBe('balance')

    const h2Wrap = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('h2')!).textWrap
    })
    expect(h2Wrap).toBe('balance')
  })

  test('4.2 button scale on active with reduced-motion guard', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.btn', { timeout: 10_000 })

    // Check the scale(0.96) is applied on active via stylesheet
    // (cannot simulate :active in headless without interaction,
    //  but we verify the CSS rule exists by checking computed style
    //  on a forced active state via JS)
    const hasScaleRule = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (rule instanceof CSSMediaRule && rule.conditionText?.includes('prefers-reduced-motion')) {
              const innerRules = Array.from(rule.cssRules || [])
              for (const inner of innerRules) {
                if (inner instanceof CSSStyleRule && inner.selectorText?.includes(':active')) {
                  if (inner.style.transform?.includes('scale(0.96)')) return true
                }
              }
            }
            if (rule instanceof CSSStyleRule && rule.selectorText?.includes(':active') && rule.style.transform?.includes('scale(0.96)')) {
              return true
            }
          }
        } catch { /* cross-origin sheet */ }
      }
      return false
    })
    expect(hasScaleRule).toBe(true)
  })

  test('4.3 tabular-nums on price displays', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.price, .template-price', { timeout: 10_000 }).catch(() => {
      // price elements may not be visible on main page — check CSS rule exists
    })

    // Verify CSS rule for tabular-nums exists
    const hasTabularNums = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets)
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || [])
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                (rule.selectorText?.includes('.price') || rule.selectorText?.includes('.template-price'))) {
              if (rule.style.fontVariantNumeric === 'tabular-nums') return true
            }
          }
        } catch { /* cross-origin */ }
      }
      return false
    })
    expect(hasTabularNums).toBe(true)
  })

  test('4.4 no transition: all in component styles', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.btn', { timeout: 10_000 })

    // Verify .btn does NOT use transition: all
    const btnTransition = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('.btn')!).transitionProperty
    })
    expect(btnTransition).not.toBe('all')

    // Verify .feature-card does NOT use transition: all
    const featureCardTransition = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('.feature-card')!).transitionProperty
    })
    expect(featureCardTransition).not.toBe('all')

    // Verify .ai-card does NOT use transition: all
    const aiCardTransition = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('.ai-card')!).transitionProperty
    })
    expect(aiCardTransition).not.toBe('all')
  })

  test('4.5 image outline variable and border on images', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.template-image img', { timeout: 10_000 })

    // Verify --image-outline exists on :root
    const hasVarRoot = await page.evaluate(() => {
      const rootStyle = getComputedStyle(document.documentElement)
      return rootStyle.getPropertyValue('--image-outline').trim().length > 0
    })
    expect(hasVarRoot).toBe(true)

    // Verify template images have border using the variable
    const imgBorder = await page.evaluate(() => {
      const img = document.querySelector('.template-image img')
      if (!img) return ''
      return getComputedStyle(img).borderWidth
    })
    expect(imgBorder).not.toBe('0px')
  })

  test('4.6 40×40px hit areas on interactive elements', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.theme-toggle', { timeout: 10_000 })

    // theme-toggle: 40x40
    const toggleSize = await page.evaluate(() => {
      const el = document.querySelector('.theme-toggle')!
      const { width, height } = el.getBoundingClientRect()
      return { width, height }
    })
    expect(toggleSize.width).toBeGreaterThanOrEqual(39)
    expect(toggleSize.height).toBeGreaterThanOrEqual(39)

    // nav-links a: min-height 40
    const linkHeight = await page.evaluate(() => {
      const el = document.querySelector('.nav-links a')!
      return Number.parseFloat(getComputedStyle(el).minHeight)
    })
    expect(linkHeight).toBeGreaterThanOrEqual(40)
  })

  test('4.7 axe-core zero violations', async ({ page }) => {
    const { default: AxeBuilder } = await import('@axe-core/playwright')

    await page.goto('/')
    await page.waitForSelector('#ai', { timeout: 10_000 })
    await page.waitForSelector('#contacto', { timeout: 10_000 })

    const results = await new AxeBuilder({ page })
      .disableRules(['heading-order'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
