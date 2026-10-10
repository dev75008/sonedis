import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { basePath, canonicalOrigin, getLocalizedPath } from '../utils/site'

type Props = { title: string; description: string; image?: string }

export default function Seo({ title, description, image = `${basePath}/assets/og-sonedis.png` }: Props) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const canonical = `${canonicalOrigin}${basePath}${location.pathname === '/' ? '/' : location.pathname}`
  const fr = `${canonicalOrigin}${basePath}${getLocalizedPath(location.pathname, 'fr')}`
  const en = `${canonicalOrigin}${basePath}${getLocalizedPath(location.pathname, 'en')}`
  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="fr" href={fr} />
      <link rel="alternate" hrefLang="en" href={en} />
      <link rel="alternate" hrefLang="x-default" href={fr} />
      <meta property="og:site_name" content="SONEDIS" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${canonicalOrigin}${image}`} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${canonicalOrigin}${image}`} />
    </Helmet>
  )
}
