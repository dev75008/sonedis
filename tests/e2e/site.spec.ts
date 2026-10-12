import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.afterEach(async ({ page }) => {
  await page
    .locator('.hero-home__film')
    .evaluateAll((videos) => videos.forEach((video) => video.pause()))
    .catch(() => undefined)
})

test('navigation, language switch and route fallback', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('famille')
  await page.locator('.desktop-nav').getByRole('link', { name: 'Dattes', exact: true }).click()
  await expect(page).toHaveURL(/\/dattes$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dattes')
  await page.getByRole('button', { name: /English/ }).click()
  await expect(page).toHaveURL(/\/en\/dattes$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dates')
})

test('home keeps its story and video without the beige timeline section', async ({ page }) => {
  await page.goto('./')
  await expect(page.locator('#histoire .home-intro__story')).toBeVisible()
  await expect(page.locator('.story-rail')).toHaveCount(0)
  await expect(page.locator('.story-panel')).toHaveCount(0)
  const roots = page.locator('#nos-racines')
  await expect(roots.getByRole('heading')).toHaveText('Nos racines, au cœur des palmeraies.')
  await expect(roots).toContainText('Tolga, El Grous et Foughala')
  await expect(roots).toContainText('AGRODAT')
  await roots.locator('img').scrollIntoViewIfNeeded()
  await expect.poll(() => roots.locator('img').evaluate((img) => img.naturalWidth)).toBeGreaterThan(0)
  await expect(roots.locator('img')).toHaveAttribute('src', /recolte-960.webp$/)
  const film = page.locator('#histoire .home-intro__film video')
  await expect(film).toHaveJSProperty('muted', true)
  await expect(film).toHaveJSProperty('loop', true)
  await expect(film).toHaveJSProperty('autoplay', true)
})

test('About page has no beige timeline section', async ({ page }) => {
  await page.goto('./about')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.story-rail')).toHaveCount(0)
  await expect(page.locator('.story-panel')).toHaveCount(0)
})

test('contact validation gives accessible feedback', async ({ page }) => {
  await page.goto('./contact')
  await page.getByRole('button', { name: /Envoyer le message/ }).click()
  await expect(page.getByText('Ce champ est obligatoire.').first()).toBeVisible()
  await page.getByLabel('Nom complet').fill('Camille')
  await page.getByLabel('Adresse email').fill('pas-une-adresse')
  await page.getByLabel('Votre message').fill('Bonjour SONEDIS')
  await page.getByRole('button', { name: /Envoyer le message/ }).click()
  await expect(page.getByText('Saisissez une adresse email valide.')).toBeVisible()
})

test('mobile menu works and layout fits a 360px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 })
  await page.goto('./')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toBeVisible()
  const width = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(width).toBeLessThanOrEqual(361)
})

test('history keeps the still photo and centers the silent film as a circular bubble', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const image = page.locator('#histoire .home-intro__visual img')
  await image.evaluate((element) => element.scrollIntoView({ block: 'center' }))
  await expect(image).toHaveAttribute('srcset', /histoire-palmeraie-1440\.webp/)
  await expect(image).toHaveAttribute('loading', 'lazy')
  await expect
    .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0)
  await expect(image).toHaveAttribute('alt', /route/i)
  await expect
    .poll(() => page.locator('#histoire h2').evaluate((heading) => getComputedStyle(heading).fontFamily))
    .toContain('Amiri')
  await expect.poll(() => page.evaluate(() => document.fonts.check('400 32px Amiri'))).toBe(true)
  await expect.poll(() => image.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
  await expect.poll(() => image.evaluate((element) => getComputedStyle(element).transform)).toBe('none')

  const film = page.locator('#histoire .home-intro__film video')
  await expect(film).toHaveJSProperty('muted', true)
  await expect(film).toHaveJSProperty('loop', true)
  await expect(film).toHaveJSProperty('autoplay', true)
  await expect(film).toHaveAttribute('preload', 'auto')
  await expect(film).toHaveAttribute('playsinline', '')
  await expect(film).toHaveAttribute('poster', /histoire-palmeraie-poster\.webp$/)
  await expect(film.locator('source')).toHaveAttribute('src', /histoire-palmeraie\.mp4$/)
  await expect(film).not.toHaveAttribute('controls', '')
  await expect.poll(() => page.evaluate(() => document.fonts.check('500 36px Lemonada'))).toBe(true)
  await expect(page.locator('.home-intro__varieties--left span')).toHaveCount(6)
  await expect(page.locator('.home-intro__varieties--right span')).toHaveCount(6)
  await expect(page.locator('.home-intro__varieties--left')).toContainText(/Deglet Nour.*Medjoul.*Sukari/s)
  const measurePlacement = () =>
    film.evaluate((video) => {
      const videoRect = video.getBoundingClientRect()
      const frameRect = video.parentElement!.getBoundingClientRect()
      return {
        centerOffset: Math.abs(videoRect.left + videoRect.width / 2 - (frameRect.left + frameRect.width / 2)),
        verticalOffset: Math.abs(
          videoRect.top + videoRect.height / 2 - (frameRect.top + frameRect.height / 2),
        ),
        ratio: videoRect.width / videoRect.height,
        borderRadius: getComputedStyle(video).borderRadius,
        fitsFrame: videoRect.width <= frameRect.width && videoRect.height <= frameRect.height,
      }
    })
  const desktopPlacement = await measurePlacement()
  expect(desktopPlacement.centerOffset).toBeLessThan(1)
  expect(desktopPlacement.verticalOffset).toBeLessThan(1)
  expect(desktopPlacement.ratio).toBeCloseTo(1, 2)
  expect(desktopPlacement.borderRadius).toBe('50%')
  expect(desktopPlacement.fitsFrame).toBe(true)
  const desktopBubble = await film.boundingBox()
  const leftNames = await page.locator('.home-intro__varieties--left').boundingBox()
  const rightNames = await page.locator('.home-intro__varieties--right').boundingBox()
  expect(desktopBubble && leftNames && leftNames.x + leftNames.width).toBeLessThanOrEqual(
    desktopBubble!.x + 1,
  )
  expect(rightNames && desktopBubble && rightNames.x).toBeGreaterThanOrEqual(
    desktopBubble.x + desktopBubble.width - 1,
  )

  await page.setViewportSize({ width: 360, height: 780 })
  await page.evaluate(() => new Promise(requestAnimationFrame))
  const mobilePlacement = await measurePlacement()
  expect(mobilePlacement.centerOffset).toBeLessThan(1)
  expect(mobilePlacement.verticalOffset).toBeLessThan(1)
  expect(mobilePlacement.ratio).toBeCloseTo(1, 2)
  expect(mobilePlacement.fitsFrame).toBe(true)
  const mobileBubble = await film.boundingBox()
  const mobileTopNames = await page.locator('.home-intro__varieties--left').boundingBox()
  const mobileBottomNames = await page.locator('.home-intro__varieties--right').boundingBox()
  expect(mobileBubble && mobileTopNames && mobileTopNames.y + mobileTopNames.height).toBeLessThanOrEqual(
    mobileBubble!.y,
  )
  expect(mobileBottomNames && mobileBubble && mobileBottomNames.y).toBeGreaterThanOrEqual(
    mobileBubble.y + mobileBubble.height,
  )
})

test('history film plays continuously without audio in Chromium', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime can cancel MP4 decoding.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const film = page.locator('#histoire .home-intro__film video')
  await expect.poll(() => film.evaluate((video) => video.readyState >= 2 && !video.paused)).toBe(true)
})

test('history film remains automatic with reduced motion enabled', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime can cancel MP4 decoding.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const film = page.locator('#histoire .home-intro__film video')
  await expect.poll(() => film.evaluate((video) => video.readyState >= 2 && !video.paused)).toBe(true)
})

test('intro film autoplays silently in a loop with no playback button', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect(film).toHaveJSProperty('muted', true)
  await expect(film).toHaveJSProperty('loop', true)
  await expect(film).toHaveJSProperty('autoplay', true)
  await expect(film).toHaveAttribute('poster', /intro-dates-14160251\.webp$/)
  await expect(film.locator('source')).toHaveAttribute('src', /intro-dates-14160251\.mp4$/)
  await expect(page.getByRole('button', { name: /écouter le vent/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /lire le film/i })).toHaveCount(0)
})

test('intro film starts playing automatically in Chromium', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime cancels MP4 decoding.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect.poll(() => film.evaluate((video) => video.readyState >= 2 && !video.paused)).toBe(true)
})

test('intro film also autoplays when reduced motion is enabled', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime cancels MP4 decoding.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect.poll(() => film.evaluate((video) => video.readyState >= 2 && !video.paused)).toBe(true)
  await expect(film).toHaveAttribute('poster', /intro-dates-14160251\.webp$/)
  await expect(page.getByRole('button', { name: /lire le film/i })).toHaveCount(0)
})

test('home page meets the selected axe WCAG checks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.waitForTimeout(1800)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
