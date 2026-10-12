import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import RootsSection from '../components/RootsSection'
import {
  BrandScenes,
  CertificationBadges,
  ClientMarquee,
  ContactBlock,
  Gallery,
  SectionLabel,
} from '../components/Sections'
import { basePath } from '../utils/site'
import { gsap, motion, SplitText, useGSAP } from '../app/motion'
import { Link } from 'react-router-dom'

function magneticMove(event: ReactPointerEvent<HTMLAnchorElement>) {
  if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
  const bounds = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty(
    '--magnet-x',
    `${(event.clientX - bounds.left - bounds.width / 2) * 0.035}px`,
  )
  event.currentTarget.style.setProperty(
    '--magnet-y',
    `${(event.clientY - bounds.top - bounds.height / 2) * 0.035}px`,
  )
}

function magneticReset(event: ReactPointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.setProperty('--magnet-x', '0px')
  event.currentTarget.style.setProperty('--magnet-y', '0px')
}

const dateVarietiesLeft = ['Deglet Nour', 'Medjoul', 'Sukari', 'Ajwa', 'Barhi', 'Khalas']
const dateVarietiesRight = ['Khadrawy', 'Zahidi', 'Halawy', 'Sayer', 'Thoory', 'Dayri']

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const hero = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const film = useRef<HTMLVideoElement>(null)
  const historyFilm = useRef<HTMLVideoElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const mdd = useRef<HTMLElement>(null)
  useEffect(() => {
    const video = film.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    void video.play().catch(() => undefined)
  }, [])

  useEffect(() => {
    const video = historyFilm.current
    if (!video) return
    video.defaultMuted = true
    video.muted = true
    const retryPlayback = () => void video.play().catch(() => undefined)
    video.addEventListener('canplay', retryPlayback)
    retryPlayback()
    return () => {
      video.removeEventListener('canplay', retryPlayback)
      video.pause()
    }
  }, [])

  useGSAP(
    () => {
      if (!title.current || !hero.current) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(title.current!, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
        })
        gsap.from(split.lines, {
          yPercent: 108,
          duration: motion.duration.feature,
          ease: motion.ease.reveal,
          stagger: motion.stagger.words,
        })
        gsap.from('.hero-home__label, .hero-home__intro', {
          y: motion.distance.small,
          autoAlpha: 0,
          duration: motion.duration.reveal,
          ease: motion.ease.reveal,
          stagger: 0.13,
          delay: 0.2,
        })
        gsap.from('.hero-home__visual', {
          clipPath: 'inset(0 0 100% 0 round 45% 45% 4rem 4rem)',
          duration: motion.duration.feature,
          ease: motion.ease.scene,
          delay: 0.1,
        })
        const image = hero.current!.querySelector('img')
        if (image)
          gsap.to(image, {
            yPercent: -7,
            ease: 'none',
            scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: 0.5 },
          })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: hero },
  )
  useGSAP(
    () => {
      const line = mdd.current?.querySelector('.process-line__draw')
      if (line)
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: motion.duration.feature,
            ease: motion.ease.scene,
            scrollTrigger: { trigger: mdd.current, start: 'top 72%', once: true },
          },
        )
    },
    { scope: mdd },
  )

  const language = i18n.language
  return (
    <>
      <Seo title={t('seo.homeTitle')} description={t('seo.homeDescription')} />
      <main id="main-content">
        <section className="hero-home" ref={hero} id="top">
          <div className="hero-home__copy" ref={copy}>
            <p className="hero-home__label">{t('hero.label')}</p>
            <h1 ref={title}>{t('hero.title')}</h1>
            <p className="hero-home__intro">{t('hero.intro')}</p>
          </div>
          <div className="hero-home__visual" aria-hidden="true">
            <video
              ref={film}
              className="hero-home__film"
              autoPlay
              muted
              playsInline
              preload="auto"
              width="1920"
              height="1080"
              poster={`${basePath}/assets/video/intro-dates-14160251.webp`}
              loop
            >
              <source src={`${basePath}/assets/video/intro-dates-14160251.mp4`} type="video/mp4" />
            </video>
          </div>
        </section>

        <section className="home-intro section-pad" id="histoire">
          <div className="home-intro__story">
            <svg
              className="home-intro__arcade home-intro__arcade--left"
              viewBox="0 0 120 480"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7 8h106v464H7zM13 14h94v452H13z" />
              <path d="M7 160h106M7 320h106M13 166h94M13 326h94" />
              <path d="M19 157V80c0-28 24-30 41-64 17 34 41 36 41 64v77M29 157V83c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M19 317v-77c0-28 24-30 41-64 17 34 41 36 41 64v77M29 317v-74c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M19 477v-77c0-28 24-30 41-64 17 34 41 36 41 64v77M29 477v-74c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M7 157h106M7 317h106M7 477h106" />
              <path d="M19 157h10m62 0h10M19 317h10m62 0h10M19 477h10m62 0h10" />
              <path d="M55 41c-5 6-5 12 0 17 5-5 5-11 0-17Zm0 160c-5 6-5 12 0 17 5-5 5-11 0-17Zm0 160c-5 6-5 12 0 17 5-5 5-11 0-17Z" />
            </svg>
            <svg
              className="home-intro__arcade home-intro__arcade--right"
              viewBox="0 0 120 480"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7 8h106v464H7zM13 14h94v452H13z" />
              <path d="M7 160h106M7 320h106M13 166h94M13 326h94" />
              <path d="M19 157V80c0-28 24-30 41-64 17 34 41 36 41 64v77M29 157V83c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M19 317v-77c0-28 24-30 41-64 17 34 41 36 41 64v77M29 317v-74c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M19 477v-77c0-28 24-30 41-64 17 34 41 36 41 64v77M29 477v-74c0-19 19-23 31-49 12 26 31 30 31 49v74" />
              <path d="M7 157h106M7 317h106M7 477h106" />
              <path d="M19 157h10m62 0h10M19 317h10m62 0h10M19 477h10m62 0h10" />
              <path d="M55 41c-5 6-5 12 0 17 5-5 5-11 0-17Zm0 160c-5 6-5 12 0 17 5-5 5-11 0-17Zm0 160c-5 6-5 12 0 17 5-5 5-11 0-17Z" />
            </svg>
            <h2>{t('about.title')}</h2>
            <div className="home-intro__copy">
              <p>{t('about.body')}</p>
              <Link className="text-link" to={language === 'en' ? '/en/about' : '/about'}>
                {t('about.link')} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <figure className="home-intro__visual">
            <img
              src={`${basePath}/assets/photos/histoire-palmeraie-960.webp`}
              srcSet={`${basePath}/assets/photos/histoire-palmeraie-480.webp 480w, ${basePath}/assets/photos/histoire-palmeraie-960.webp 960w, ${basePath}/assets/photos/histoire-palmeraie-1440.webp 1440w`}
              sizes="(max-width: 780px) calc(100vw - 2rem), 88vw"
              alt={
                language === 'en'
                  ? 'A road leads through sandy ground toward a date palm grove'
                  : 'Une route traverse un terrain sablonneux vers une palmeraie'
              }
              width="1440"
              height="972"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure className="home-intro__film">
            <img
              className="home-intro__film-backdrop"
              src={`${basePath}/assets/video/histoire-palmeraie-poster.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <div className="home-intro__varieties home-intro__varieties--left" aria-hidden="true">
              {dateVarietiesLeft.map((variety) => (
                <span key={variety}>{variety}</span>
              ))}
            </div>
            <div className="home-intro__varieties home-intro__varieties--right" aria-hidden="true">
              {dateVarietiesRight.map((variety) => (
                <span key={variety}>{variety}</span>
              ))}
            </div>
            <video
              ref={historyFilm}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              width="478"
              height="850"
              poster={`${basePath}/assets/video/histoire-palmeraie-poster.webp`}
              aria-label={
                language === 'en'
                  ? 'A silent film moving through a sunlit date palm grove'
                  : 'Vidéo muette au cœur d’une palmeraie ensoleillée'
              }
            >
              <source src={`${basePath}/assets/video/histoire-palmeraie.mp4`} type="video/mp4" />
            </video>
          </figure>
        </section>

        {language === 'fr' && <RootsSection />}

        <section className="products-section section-pad" id="produits">
          <div className="section-heading section-heading--split">
            <div>
              <SectionLabel number="03">{t('products.eyebrow')}</SectionLabel>
              <h2>{t('products.title')}</h2>
            </div>
            <p>
              {language === 'fr'
                ? 'Dattes et fruits secs : retrouvez les familles de produits présentées par SONEDIS.'
                : 'Dates and dried fruit: explore the product families featured by SONEDIS.'}
            </p>
          </div>
          <div className="products-section__cards">
            <Link
              className="feature-product"
              to={language === 'en' ? '/en/dattes' : '/dattes'}
              onPointerMove={magneticMove}
              onPointerLeave={magneticReset}
            >
              <span className="feature-product__image">
                <img src={`${basePath}/assets/photos/dattes-origine-960.webp`} alt="" loading="lazy" />
              </span>
              <span className="feature-product__index">01 / 02</span>
              <span className="feature-product__copy">
                <h3>{t('products.dates')}</h3>
                <p>{t('products.dateCard')}</p>
                <span className="feature-product__more">
                  {t('products.details')}
                  <b aria-hidden="true">↗</b>
                </span>
              </span>
            </Link>
            <Link
              className="feature-product"
              to={language === 'en' ? '/en/dried-fruit' : '/fruits-secs'}
              onPointerMove={magneticMove}
              onPointerLeave={magneticReset}
            >
              <span className="feature-product__image">
                <img src={`${basePath}/assets/products/Sachet_pistaches-900.webp`} alt="" loading="lazy" />
              </span>
              <span className="feature-product__index">02 / 02</span>
              <span className="feature-product__copy">
                <h3>{t('products.nuts')}</h3>
                <p>{t('products.nutsCard')}</p>
                <span className="feature-product__more">
                  {t('products.details')}
                  <b aria-hidden="true">↗</b>
                </span>
              </span>
            </Link>
          </div>
        </section>

        <BrandScenes />

        <section className="mdd-section section-pad" id="mdd" ref={mdd}>
          <div className="mdd-section__grid">
            <div className="mdd-section__copy">
              <SectionLabel number="05">{t('mdd.eyebrow')}</SectionLabel>
              <h2>{t('mdd.title')}</h2>
              <p>{t('mdd.body')}</p>
            </div>
            <div className="process-line" aria-label={t('mdd.title')}>
              <span className="process-line__draw" aria-hidden="true" />
              {(['own', 'factory', 'private'] as const).map((step, index) => (
                <div className="process-step" key={step}>
                  <i aria-hidden="true" />
                  <b>
                    {String(index + 1).padStart(2, '0')}
                    <br />
                    {t(`mdd.${step}`)}
                  </b>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ClientMarquee />
        <CertificationBadges />
        <Gallery />
        <ContactBlock compact />
      </main>
    </>
  )
}
