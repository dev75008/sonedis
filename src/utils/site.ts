export const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
export const canonicalOrigin = 'https://dev75008.github.io'

export function getLocalizedPath(path: string, locale: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  const withoutLocale = clean.replace(/^en\/?/, '')
  const localized = locale === 'en' ? `en/${withoutLocale}` : withoutLocale
  return `/${localized}`.replace(/\/$/, '/')
}

export function formatTelHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

export function validateContactForm(values: {
  name: string
  email: string
  message: string
}): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!values.name.trim()) errors.name = 'required'
  if (!values.message.trim()) errors.message = 'required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'invalidEmail'
  return errors
}
