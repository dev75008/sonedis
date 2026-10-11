import { Suspense, lazy, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { gsap, ScrollTrigger } from './motion'
import { basePath, canonicalOrigin } from '../utils/site'
import { Footer, Header } from '../components/SiteChrome'
import { useGSAP } from './motion'

const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ProductsPage = lazy(() => import('../pages/ProductsPage'))
const QualityPage = lazy(() => import('../pages/QualityPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const LegalPage = lazy(() => import('../pages/LegalPage'))

const pageRoutes = [
  ['/', HomePage],
  ['/en', HomePage],
  ['/about', AboutPage],
  ['/en/about', AboutPage],
  ['/dattes', ProductsPage],
  ['/en/dattes', ProductsPage],
  ['/fruits-secs', ProductsPage],
  ['/en/dried-fruit', ProductsPage],
  ['/quality', QualityPage],
  ['/en/quality', QualityPage],
  ['/contact', ContactPage],
  ['/en/contact', ContactPage],
  ['/mentions-legales', LegalPage],
  ['/en/legal-notice', LegalPage],
  ['/confidentialite', LegalPage],
  ['/en/privacy', LegalPage],
] as const

function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    let active = true
    let lenis: import('lenis').default | undefined
    let frame: ((time: number) => void) | undefined
    let onScroll: (() => void) | undefined
    void import('lenis').then(({ default: Lenis }) => {
      if (!active) return
      lenis = new Lenis({ autoRaf: false, anchors: true, smoothWheel: true, lerp: 0.09 })
      onScroll = () => ScrollTrigger.update()
      frame = (time) => lenis?.raf(time * 1000)
      lenis.on('scroll', onScroll)
      gsap.ticker.add(frame)
      gsap.ticker.lagSmoothing(0)
    })
    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh, { once: true })
    return () => {
      active = false
      if (frame) gsap.ticker.remove(frame)
      if (lenis && onScroll) lenis.off('scroll', onScroll)
      lenis?.destroy()
      window.removeEventListener('load', refresh)
    }
  }, [])
  return children
}

function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!bar.current) return
      const update = () => {
        const max = ScrollTrigger.maxScroll(window)
        gsap.set(bar.current, { scaleX: max ? window.scrollY / max : 0 })
      }
      const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update })
      update()
      return () => trigger.kill()
    },
    { scope: bar },
  )
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={bar} className="scroll-progress__bar" />
    </div>
  )
}

function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!finePointer.matches || !cursor.current) return
    const x = gsap.quickTo(cursor.current, 'x', { duration: 0.2, ease: 'power3.out' })
    const y = gsap.quickTo(cursor.current, 'y', { duration: 0.2, ease: 'power3.out' })
    const onMove = (event: PointerEvent) => {
      x(event.clientX)
      y(event.clientY)
    }
    const onPointerDown = () => gsap.to(cursor.current, { scale: 0.7, duration: 0.16 })
    const onPointerUp = () => gsap.to(cursor.current, { scale: 1, duration: 0.2 })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])
  return <div className="custom-cursor" ref={cursor} aria-hidden="true" />
}

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation()
  const page = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.fromTo(
        page.current,
        { y: 10, autoAlpha: 0.7 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: 'power3.out',
          clearProps: 'opacity,visibility,transform',
        },
      )
    },
    { scope: page, dependencies: [location.pathname], revertOnUpdate: true },
  )
  return (
    <div ref={page} key={location.pathname} className="page-transition">
      {children}
    </div>
  )
}

function NotFound() {
  const { t } = useTranslation()
  return (
    <main className="not-found">
      <p className="eyebrow">SONEDIS</p>
      <h1>404</h1>
      <Link className="text-link" to="/">
        {t('common.back')} <span aria-hidden="true">↗</span>
      </Link>
    </main>
  )
}

function OrganizationSchema() {
  const data = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SONEDIS',
      url: `${canonicalOrigin}${basePath}/`,
      logo: `${canonicalOrigin}${basePath}/assets/brands/logo_home_page-removebg-preview-modified.png`,
      email: 'contact@sonedis.fr',
      telephone: '+33 6.62.99.94.48',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rue de la forêt',
        postalCode: '76320',
        addressLocality: 'Saint-Pierre-lès-Elbeuf',
        addressCountry: 'FR',
      },
    }),
    [],
  )
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}

export default function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  useEffect(() => {
    const lang = location.pathname.split('/').filter(Boolean)[0] === 'en' ? 'en' : 'fr'
    if (i18n.language !== lang) void i18n.changeLanguage(lang)
  }, [i18n, location.pathname])
  useEffect(() => {
    if (location.hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    ScrollTrigger.update()
  }, [location.pathname, location.hash])

  return (
    <LenisProvider>
      <a className="skip-link" href="#main-content">
        {i18n.t('common.skip')}
      </a>
      <OrganizationSchema />
      <ScrollProgress />
      <Header />
      <Suspense
        fallback={<div className="route-loading" role="status" aria-label={i18n.t('common.loading')} />}
      >
        <PageTransition>
          <Routes>
            {pageRoutes.map(([path, Component]) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </Suspense>
      <Footer />
      <CustomCursor />
    </LenisProvider>
  )
}
