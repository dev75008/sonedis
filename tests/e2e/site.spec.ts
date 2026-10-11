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

test('history section displays the optimized color-graded grove photo', async ({ page }) => {
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
  await expect
    .poll(() => image.evaluate((element) => getComputedStyle(element).animationName))
    .toBe('history-photo-drift')
  await expect.poll(() => image.evaluate((element) => getComputedStyle(element).animationDuration)).toBe('5s')
  await expect
    .poll(() =>
      image.evaluate((element) =>
        element.getAnimations().some((animation) => animation.playState === 'running'),
      ),
    )
    .toBe(true)
  const initialFrame = await image.evaluate((element) => getComputedStyle(element).transform)
  await page.waitForTimeout(900)
  const movingFrame = await image.evaluate((element) => getComputedStyle(element).transform)
  expect(movingFrame).not.toBe(initialFrame)
})

test('history photo stays still when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const image = page.locator('#histoire .home-intro__visual img')
  await image.evaluate((element) => element.scrollIntoView({ block: 'center' }))
  await expect.poll(() => image.evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
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
