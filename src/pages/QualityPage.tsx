import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { CertificationBadges, SectionLabel, ContactBlock } from '../components/Sections'

export default function QualityPage() {
  const { t, i18n } = useTranslation()
  const en = i18n.language === 'en'
  return (
    <>
      <Seo title={`${t('nav.quality')} — SONEDIS`} description={t('quality.body')} />
      <main id="main-content">
        <section className="editorial-hero">
          <div className="editorial-hero__copy">
            <p className="eyebrow">SONEDIS · {t('quality.eyebrow')}</p>
            <h1>{t('quality.title')}</h1>
            <p>{t('quality.body')}</p>
          </div>
          <figure className="editorial-hero__image">
            <img
              src="/sonedis/assets/photos/vitrine-960.webp"
              alt={
                en
                  ? 'Dates and dried fruit presented in a shop'
                  : 'Dattes et fruits secs présentés en magasin'
              }
              width="1440"
              height="960"
              fetchPriority="high"
            />
          </figure>
        </section>
        <section className="quality-copy section-pad">
          <div>
            <SectionLabel number="01">
              {en ? 'The art of care behind every fruit' : 'L’art du soin derrière chaque fruit'}
            </SectionLabel>
            <h2>{en ? 'Dates, nature and care.' : 'Dattes, nature et soin.'}</h2>
          </div>
          <div className="quality-copy__body">
            {en ? (
              <>
                <p>
                  Medjool dates are known for their generous flesh, soft texture and exceptionally sweet
                  taste. SONEDIS distributes Medjool dates of Moroccan origin.
                </p>
                <p>
                  Deglet Nour dates, from Tunisia and Algeria, have a crisp texture and a honey-like taste. In
                  Arabic, their name means “finger of light”, referring to their elongated shape and slightly
                  translucent colour.
                </p>
                <p>
                  MeCh-Degla is a dry date variety from M’Chounech, near Biskra in Algeria. It is known for
                  its floury consistency and naturally dry appearance.
                </p>
              </>
            ) : (
              <>
                <p>
                  Les dattes Medjool comptent parmi les variétés les plus renommées. Elles sont reconnues pour
                  leur chair généreuse, leur texture moelleuse et leur goût exceptionnellement sucré. Chez
                  SONEDIS, elles sont distribuées exclusivement d’origine marocaine.
                </p>
                <p>
                  Les dattes Deglet Nour, originaires de Tunisie et d’Algérie, ont une consistance croquante
                  et un délicieux goût de miel. En arabe, leur nom signifie « doigt de lumière », une
                  appellation due à leur forme allongée et leur couleur légèrement translucide.
                </p>
                <p>
                  MeCh-Degla est une variété de dattes sèches originaire de M’Chounech, près de Biskra, en
                  Algérie. Elle se distingue par sa consistance farineuse et son aspect naturellement sec.
                </p>
              </>
            )}
          </div>
        </section>
        <CertificationBadges />
        <section className="quality-copy section-pad">
          <div>
            <SectionLabel number="02">{en ? 'Storage' : 'Conservation'}</SectionLabel>
            <h2>{en ? 'How to store dates.' : 'Comment conserver les dattes.'}</h2>
          </div>
          <div className="quality-copy__body">
            {en ? (
              <>
                <p>Ripe dates are fragile and keep for only a few days.</p>
                <p>
                  Keep them in a cool, dry place. Store between 4°C and 8°C to keep them longer, and take them
                  out before serving.
                </p>
              </>
            ) : (
              <>
                <p>
                  La datte cueillie à maturité ne peut se conserver que quelques jours car elle est très
                  fragile.
                </p>
                <p>
                  Gardez-la dans un endroit frais et sec. Maintenez une température entre 4°C et 8°C pour la
                  conserver plus longtemps, et veillez à la sortir avant dégustation.
                </p>
              </>
            )}
          </div>
        </section>
        <ContactBlock compact />
      </main>
    </>
  )
}
