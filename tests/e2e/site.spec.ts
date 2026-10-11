import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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

test('intro film uses a muted local video and has no sound control', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect(film).toHaveJSProperty('muted', true)
  await expect(film).toHaveJSProperty('loop', false)
  await expect(film).toHaveAttribute('poster', /intro-poster\.webp$/)
  await expect(page.getByRole('button', { name: /écouter le vent/i })).toHaveCount(0)
})

test('intro film autoplays in Chromium when motion is allowed', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime does not decode this MP4.')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect.poll(() => film.evaluate((video) => video.readyState >= 2 && !video.paused)).toBe(true)
})

test('reduced motion keeps the intro on its poster until requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect(film).toHaveJSProperty('paused', true)
  await expect(film).toHaveAttribute('poster', /intro-poster\.webp$/)
  await expect(page.getByRole('button', { name: 'Lire le film d’introduction' })).toBeVisible()
})

test('reduced motion lets the visitor play the film explicitly', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'The installed Windows WebKit test runtime does not decode this MP4.')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')
  await page.getByRole('button', { name: 'Lire le film d’introduction' }).click()
  await expect.poll(() => page.locator('.hero-home__film').evaluate((video) => !video.paused)).toBe(true)
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
