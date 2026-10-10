import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import { ProductGrid, ProductHeroImage, SectionLabel, ContactBlock } from '../components/Sections'
import { datesProducts, driedFruitProducts } from '../data'
import { basePath } from '../utils/site'

export default function ProductsPage() {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const dates = location.pathname.includes('dattes') || location.pathname.includes('/dates')
  const en = i18n.language === 'en'
  const title = dates ? t('products.dates') : t('products.nuts')
  const description = dates ? t('products.datesIntro') : t('products.nutsIntro')
  return (
    <>
      <Seo title={`${title} — SONEDIS`} description={description} />
      <main id="main-content">
        <section className="collection-hero">
          <div className="collection-hero__copy">
            <SectionLabel number="03">{t('products.eyebrow')}</SectionLabel>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {dates ? (
            <ProductHeroImage
              src="DATTES-BRANCHEES-BILKIS-1KG-PREMIUM-ALGERIE"
              alt={en ? 'BILKIS Deglet Nour dates box' : 'Boîte de dattes Deglet Nour BILKIS'}
              name={t('products.dates')}
            />
          ) : (
            <figure className="product-hero-image">
              <img
                src={`${basePath}/assets/products/Sachet_pistaches-900.webp`}
                srcSet={`${basePath}/assets/products/Sachet_pistaches-480.webp 480w, ${basePath}/assets/products/Sachet_pistaches-900.webp 900w`}
                sizes="(max-width: 760px) 100vw, 52vw"
                alt={en ? 'SONEDIS pistachio pouch' : 'Sachet SONEDIS de pistaches'}
                fetchPriority="high"
              />
              <span>{t('products.nuts')}</span>
            </figure>
          )}
        </section>
        <section className="product-listing section-pad">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel number="01">{title}</SectionLabel>
              <h2>{en ? 'Our selection.' : 'Notre sélection.'}</h2>
            </div>
            <p>{description}</p>
          </div>
          <ProductGrid products={dates ? datesProducts : driedFruitProducts} />
        </section>
        {dates && (
          <section className="quality-copy section-pad">
            <div>
              <SectionLabel number="02">{en ? 'A date from the oasis' : 'Le fruit des oasis'}</SectionLabel>
              <h2>{en ? 'A fruit with many varieties.' : 'Un fruit, plusieurs variétés.'}</h2>
            </div>
            <div className="quality-copy__body">
              {en ? (
                <>
                  <p>
                    The date is a berry, the fruit of the date palm. This emblematic tree of Saharan oases
                    originates in the arid regions of the Near and Middle East.
                  </p>
                  <p>
                    Deglet Nour is known as the “queen of dates”. SONEDIS offers it on the branch and loose,
                    in different quality grades. The site also presents Medjool dates, Sukari dates and date
                    paste.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    La datte est une baie, fruit du palmier-dattier. Arbre fruitier emblématique des oasis
                    sahariennes, le palmier-dattier est originaire des zones arides du Proche et du
                    Moyen-Orient.
                  </p>
                  <p>
                    La Deglet Nour, surnommée la « reine des dattes », est proposée en branchées et en régime,
                    avec différentes catégories de qualité. Le site présente également des dattes Medjool,
                    Sukari et de la pâte de dattes.
                  </p>
                </>
              )}
            </div>
          </section>
        )}
        {!dates && (
          <section className="quality-copy section-pad">
            <div>
              <SectionLabel number="02">{en ? 'Dried fruit' : 'Fruits secs'}</SectionLabel>
              <h2>{en ? 'Crunchy or soft.' : 'Croquants ou moelleux.'}</h2>
            </div>
            <div className="quality-copy__body">
              {en ? (
                <>
                  <p>
                    Dried fruits and nuts make excellent snacks. Dried fruit has been dehydrated, while nuts
                    are naturally dry seeds protected by a hard shell.
                  </p>
                  <p>SONEDIS features almonds, peanuts, raisins, walnut kernels and pistachios.</p>
                </>
              ) : (
                <>
                  <p>
                    Croquants ou moelleux, les fruits secs constituent d’excellents en-cas à grignoter pour se
                    faire plaisir. Les fruits secs à coque sont naturellement secs, tandis que les fruits
                    séchés ont subi une déshydratation.
                  </p>
                  <p>
                    SONEDIS présente des amandes, des cacahuètes, des raisins, des cerneaux de noix et des
                    pistaches.
                  </p>
                </>
              )}
            </div>
          </section>
        )}
        <ContactBlock compact />
      </main>
    </>
  )
}
