import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { ContactBlock } from '../components/Sections'

export default function ContactPage() {
  const { t } = useTranslation()
  return (
    <main id="main-content">
      <Seo title={`${t('nav.contact')} — SONEDIS`} description={t('contact.intro')} />
      <ContactBlock />
    </main>
  )
}
