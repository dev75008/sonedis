import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import {
  ActionLink,
  BrandScenes,
  CertificationBadges,
  ClientMarquee,
  ContactBlock,
  Gallery,
  SectionLabel,
  StoryRail,
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

type WindNodes = {
  sources: AudioBufferSourceNode[]
  oscillators: OscillatorNode[]
  gains: GainNode[]
}

function makeWindBuffer(context: AudioContext) {
  const seconds = 7
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const channel = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < channel.length; i += 1) {
    brown = brown * 0.985 + (Math.random() * 2 - 1) * 0.035
    channel[i] = brown * 2.6
  }
  const fadeSamples = Math.floor(context.sampleRate * 0.25)
  for (let i = 0; i < fadeSamples; i += 1) {
    const mix = i / fadeSamples
    const joined = channel[i]! * (1 - mix) + channel[channel.length - fadeSamples + i]! * mix
    channel[i] = joined
    channel[channel.length - fadeSamples + i] = joined
  }
  return buffer
}

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const hero = useRef<HTMLElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const mdd = useRef<HTMLElement>(null)
  const windContext = useRef<AudioContext | null>(null)
  const windNodes = useRef<WindNodes | null>(null)
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [windOn, setWindOn] = useState(false)
  const supportsWind = typeof window !== 'undefined' && typeof window.AudioContext === 'function'

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', syncPreference)
    return () => preference.removeEventListener('change', syncPreference)
  }, [])

  useEffect(
    () => () => {
      for (const source of windNodes.current?.sources ?? []) source.stop()
      for (const oscillator of windNodes.current?.oscillators ?? []) oscillator.stop()
      void windContext.current?.close()
    },
    [],
  )

  const toggleWind = async () => {
    if (windOn) {
      const nodes = windNodes.current
      const context = windContext.current
      if (nodes && context) {
        const stopAt = context.currentTime + 0.35
        for (const gain of nodes.gains) {
          gain.gain.cancelScheduledValues(context.currentTime)
          gain.gain.setTargetAtTime(0, context.currentTime, 0.12)
        }
        for (const source of nodes.sources) source.stop(stopAt)
        for (const oscillator of nodes.oscillators) oscillator.stop(stopAt)
      }
      windNodes.current = null
      setWindOn(false)
      return
    }

    try {
      const AudioContextClass = window.AudioContext
      if (!AudioContextClass) return
      const context = windContext.current ?? new AudioContextClass()
      windContext.current = context
      await context.resume()

      const buffer = makeWindBuffer(context)
      const source = context.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const lowPass = context.createBiquadFilter()
      lowPass.type = 'lowpass'
      lowPass.frequency.value = 850
      const highPass = context.createBiquadFilter()
      highPass.type = 'highpass'
      highPass.frequency.value = 90
      const mainGain = context.createGain()
      mainGain.gain.setValueAtTime(0, context.currentTime)
      mainGain.gain.linearRampToValueAtTime(0.13, context.currentTime + 0.8)

      const gust = context.createOscillator()
      gust.frequency.value = 0.12
      const gustDepth = context.createGain()
      gustDepth.gain.value = 0.055
      gust.connect(gustDepth).connect(mainGain.gain)
      source.connect(lowPass).connect(highPass).connect(mainGain).connect(context.destination)

      const airSource = context.createBufferSource()
      airSource.buffer = buffer
      airSource.loop = true
      const airFilter = context.createBiquadFilter()
      airFilter.type = 'highpass'
      airFilter.frequency.value = 520
      const airGain = context.createGain()
      airGain.gain.setValueAtTime(0, context.currentTime)
      airGain.gain.linearRampToValueAtTime(0.018, context.currentTime + 0.9)
      airSource.connect(airFilter).connect(airGain).connect(context.destination)

      source.start()
      airSource.start()
      gust.start()
      windNodes.current = {
        sources: [source, airSource],
        oscillators: [gust],
        gains: [mainGain, airGain],
      }
      setWindOn(true)
    } catch {
      setWindOn(false)
    }
  }
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
        gsap.from('.hero-home__label, .hero-home__intro, .hero-home__cta', {
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
            <div className="hero-home__cta">
              <ActionLink to={language === 'en' ? '/en/about' : '/about'} light>
                {t('hero.cta')}
              </ActionLink>
              <span className="hero-home__caption">
                {t('common.from')} <span aria-hidden="true">·</span> Biskra
              </span>
            </div>
          </div>
          <div className="hero-home__visual" aria-hidden="true">
            <video
              className="hero-home__film"
              autoPlay={!reducedMotion}
              muted
              playsInline
              preload={reducedMotion ? 'none' : 'auto'}
              poster={`${basePath}/assets/video/intro-poster.webp`}
            >
              <source src={`${basePath}/assets/video/intro-biskra.mp4`} type="video/mp4" />
            </video>
          </div>
          {supportsWind && (
            <button
              className="hero-film__sound"
              type="button"
              onClick={toggleWind}
              aria-pressed={windOn}
              aria-label={windOn ? t('hero.soundOff') : t('hero.soundOn')}
            >
              <span aria-hidden="true">{windOn ? '◖))' : '◖'}</span>
              {windOn ? t('hero.soundOff') : t('hero.soundOn')}
            </button>
          )}
          <a className="hero-home__scroll" href="#histoire">
            {language === 'fr' ? 'Défiler pour découvrir' : 'Scroll to explore'}{' '}
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="home-intro section-pad" id="histoire">
          <div>
            <SectionLabel number="01">{t('about.eyebrow')}</SectionLabel>
            <h2>{t('about.title')}</h2>
          </div>
          <div className="home-intro__copy">
            <p>{t('about.body')}</p>
            <Link className="text-link" to={language === 'en' ? '/en/about' : '/about'}>
              {t('about.link')} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <StoryRail />

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
