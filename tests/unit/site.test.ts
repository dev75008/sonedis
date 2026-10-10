import { describe, expect, it } from 'vitest'
import { formatTelHref, getLocalizedPath, validateContactForm } from '../../src/utils/site'

describe('localized paths', () => {
  it('adds and removes the English route prefix without changing the page', () => {
    expect(getLocalizedPath('/about', 'en')).toBe('/en/about')
    expect(getLocalizedPath('/en/about', 'fr')).toBe('/about')
    expect(getLocalizedPath('/', 'en')).toBe('/en/')
  })
})

describe('contact helpers', () => {
  it('formats the phone number as a telephone link', () => {
    expect(formatTelHref('+33 6.62.99.94.48')).toBe('tel:+33662999448')
  })

  it('requires a name, valid email and message', () => {
    expect(validateContactForm({ name: '', email: 'bad', message: '' })).toEqual({
      name: 'required',
      email: 'invalidEmail',
      message: 'required',
    })
    expect(validateContactForm({ name: 'Amina', email: 'contact@example.fr', message: 'Bonjour' })).toEqual(
      {},
    )
  })
})
