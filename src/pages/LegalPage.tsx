import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'

export default function LegalPage() {
  const location = useLocation()
  const { t } = useTranslation()
  const privacy = location.pathname.includes('confidentialite') || location.pathname.includes('privacy')
  const title = privacy ? t('legal.privacyTitle') : t('legal.legalTitle')
  return (
    <main id="main-content" className="legal-page">
      <Seo title={`${title} — SONEDIS`} description={t('legal.pending')} />
      <p className="eyebrow">SONEDIS · {t('nav.contact')}</p>
      <h1>{title}</h1>
      <p>{t('legal.pending')}</p>
    </main>
  )
}
