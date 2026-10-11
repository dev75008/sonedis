import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { StoryRail, SectionLabel, ActionLink } from '../components/Sections'
import { basePath } from '../utils/site'

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const en = i18n.language === 'en'
  const values = en
    ? [
        ['Respect for the land', 'Which we cultivate with care and responsibility.'],
        ['Respect for traditions', 'Which we carry forward with pride.'],
        ['Respect for our colleagues and partners', 'With whom we build lasting, trusting relationships.'],
        ['Respect for consumers', 'By offering an authentic, wholesome and flavoursome product.'],
      ]
    : [
        ['Respect de la terre', 'Que nous cultivons avec soin et responsabilité.'],
        ['Respect des traditions', 'Que nous perpétuons avec fierté.'],
        [
          'Respect de nos collaborateurs et partenaires',
          'Avec qui nous construisons des relations durables et de confiance.',
        ],
        ['Respect du consommateur', 'En lui offrant un produit authentique, sain et savoureux.'],
      ]
  return (
    <>
      <Seo title={`${t('nav.story')} — SONEDIS`} description={t('about.body')} />
      <main id="main-content">
        <section className="editorial-hero">
          <div className="editorial-hero__copy">
            <p className="eyebrow">SONEDIS · 1965</p>
            <h1>{t('about.title')}</h1>
            <p>{t('about.body')}</p>
            <ActionLink to={en ? '/en/contact' : '/contact'}>{t('common.contactUs')}</ActionLink>
          </div>
          <figure className="editorial-hero__image">
            <img
              src={`${basePath}/assets/photos/recolte-960.webp`}
              srcSet={`${basePath}/assets/photos/recolte-480.webp 480w, ${basePath}/assets/photos/recolte-960.webp 960w, ${basePath}/assets/photos/recolte-1440.webp 1440w`}
              sizes="(max-width: 780px) 90vw, 40vw"
              alt={en ? 'Date harvest beneath palm trees' : 'Récolte de dattes sous les palmiers'}
              fetchPriority="high"
              width="960"
              height="1280"
            />
          </figure>
        </section>
        <StoryRail compact omitIntro />
        <section className="values-section section-pad">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel number="02">{en ? 'Our values' : 'Nos valeurs'}</SectionLabel>
              <h2>{en ? 'Strong human values.' : 'Des valeurs humaines fortes.'}</h2>
            </div>
            <p>
              {en
                ? 'At SONEDIS, every step of our work is guided by respect.'
                : 'Chez SONEDIS, chaque étape de notre travail est guidée par le respect.'}
            </p>
          </div>
          <div className="values-grid">
            {values.map(([title, text], index) => (
              <article className="value-card" key={title}>
                <span className="eyebrow">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="quality-copy section-pad">
          <div>
            <SectionLabel number="03">
              {en ? 'From the palm to the finished product' : 'Du palmier au produit fini'}
            </SectionLabel>
            <h2>{en ? 'A regional family story.' : 'Une histoire familiale et régionale.'}</h2>
          </div>
          <div className="quality-copy__body">
            {en ? (
              <>
                <p>
                  Our family business is rooted in the emblematic palm groves of Tolga, El Grous and Foughala.
                  For several generations, we have cultivated the art of dates with passion, respecting
                  nature, traditions and the human values that have guided us from the beginning.
                </p>
                <p>
                  Through strong partnerships, including the development of Medjool in Morocco and Deglet Nour
                  in Tunisia, this regional dimension allows us to offer a range reflecting the diversity of
                  Maghreb terroirs and consumer tastes.
                </p>
                <p>
                  With our AGRODAT production unit in Biskra, Algeria, we manage the production chain from
                  palm cultivation to finished product transformation.
                </p>
              </>
            ) : (
              <>
                <p>
                  Notre société familiale est ancrée au cœur des palmeraies emblématiques de Tolga, El Grous
                  et Foughala. Depuis plusieurs générations, nous cultivons avec passion l’art de la datte,
                  dans le respect de la nature, des traditions et des valeurs humaines qui nous animent depuis
                  le début.
                </p>
                <p>
                  À travers des partenariats solides, notamment au Maroc avec la valorisation de la Medjool,
                  ou en Tunisie sur la Deglet Nour, cette dimension régionale nous permet de proposer une
                  gamme riche et adaptée, représentative de la diversité des terroirs maghrébins et des goûts
                  des consommateurs.
                </p>
                <p>
                  Grâce à notre unité de production AGRODAT, située à Biskra en Algérie, nous maîtrisons
                  l’ensemble de la chaîne de production, de la culture des palmiers à la transformation du
                  produit fini.
                </p>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
