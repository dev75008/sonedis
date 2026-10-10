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

test('intro film has a muted video and a palm grove poster', async ({ page }) => {
  await page.goto('./')
  const film = page.locator('.hero-home__film')
  await expect(film).toHaveJSProperty('muted', true)
  await expect(film).toHaveAttribute('poster', /intro-poster\.webp$/)
})

test('wind control is only shown when Web Audio is available', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: undefined })
  })
  await page.goto('./')
  await expect(page.getByRole('button', { name: 'Écouter le vent' })).toHaveCount(0)
})

test('desert wind audio starts only after opt-in', async ({ page }) => {
  await page.goto('./')
  const supported = await page.evaluate(() => typeof window.AudioContext === 'function')
  test.skip(!supported, 'This headless browser does not expose the Web Audio API')
  const sound = page.getByRole('button', { name: 'Écouter le vent' })
  await sound.click()
  await expect(page.getByRole('button', { name: 'Couper le son' })).toHaveAttribute('aria-pressed', 'true')
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
