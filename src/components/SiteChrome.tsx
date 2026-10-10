import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { basePath, formatTelHref, getLocalizedPath } from '../utils/site'
import { gsap, useGSAP } from '../app/motion'

const navItems = [
  { to: '/about', key: 'nav.story' },
  { to: '/dattes', key: 'nav.dates' },
  { to: '/fruits-secs', enTo: '/dried-fruit', key: 'nav.nuts' },
  { to: '/quality', key: 'nav.quality' },
  { to: '/contact', key: 'nav.contact' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const header = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [menuRoute, setMenuRoute] = useState<string | null>(null)
  const open = menuRoute === location.pathname
  const pathWithoutBase = location.pathname.replace(basePath, '') || '/'
  const langPath = getLocalizedPath(pathWithoutBase, i18n.language === 'en' ? 'fr' : 'en')

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuRoute(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useGSAP(
    () => {
      if (!header.current) return
      const element = header.current
      let previous = window.scrollY
      const move = gsap.quickTo(element, 'y', { duration: 0.32, ease: 'power3.out' })
      const onScroll = () => {
        const current = window.scrollY
        if (open || current < 100 || current < previous) move(0)
        else if (current > previous + 4) move(-120)
        previous = current
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    },
    { scope: header, dependencies: [open] },
  )

  const changeLanguage = () => {
    const next = i18n.language === 'en' ? 'fr' : 'en'
    void i18n.changeLanguage(next)
    navigate(langPath)
  }

  return (
    <header className={`site-header${open ? ' is-open' : ''}`} ref={header} id="top">
      <div className="site-header__inner">
        <Link
          to={i18n.language === 'en' ? '/en' : '/'}
          className="brand-lockup"
          aria-label="SONEDIS, accueil"
        >
          <img
            src={`${basePath}/assets/brands/logo_home_page-removebg-preview-modified.png`}
            alt="SONEDIS"
            width="186"
            height="47"
          />
        </Link>
        <nav
          className="desktop-nav"
          aria-label={i18n.language === 'fr' ? 'Navigation principale' : 'Main navigation'}
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={`${i18n.language === 'en' ? '/en' : ''}${i18n.language === 'en' ? (item.enTo ?? item.to) : item.to}`}
              aria-current={
                pathWithoutBase.endsWith(item.to) || (item.enTo && pathWithoutBase.endsWith(item.enTo))
                  ? 'page'
                  : undefined
              }
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={changeLanguage}
            aria-label={`Switch to ${t('common.language')}`}
          >
            {t('common.language')}
          </button>
          <Link className="header-contact" to={i18n.language === 'en' ? '/en/contact' : '/contact'}>
            {t('common.contactUs')} <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t('nav.close') : t('nav.menu')}
            onClick={() => setMenuRoute(open ? null : location.pathname)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="mobile-menu" id="mobile-navigation" ref={menu} aria-hidden={!open}>
        <nav aria-label={i18n.language === 'fr' ? 'Navigation mobile' : 'Mobile navigation'}>
          {navItems.map((item, index) => (
            <Link
              tabIndex={open ? 0 : -1}
              key={item.to}
              to={`${i18n.language === 'en' ? '/en' : ''}${i18n.language === 'en' ? (item.enTo ?? item.to) : item.to}`}
            >
              <span>0{index + 1}</span>
              {t(item.key)}
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
          <button tabIndex={open ? 0 : -1} type="button" onClick={changeLanguage}>
            {t('common.language')} <span aria-hidden="true">↗</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  const { t, i18n } = useTranslation()
  const baseLocale = i18n.language === 'en' ? '/en' : ''
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <img
            src={`${basePath}/assets/brands/logo_home_page-removebg-preview-modified.png`}
            alt="SONEDIS"
            width="170"
            height="43"
          />
          <p>{t('hero.label')}</p>
        </div>
        <div className="site-footer__links">
          <p className="eyebrow">SONEDIS</p>
          <Link to={`${baseLocale}/about`}>{t('nav.story')}</Link>
          <Link to={`${baseLocale}/dattes`}>{t('nav.dates')}</Link>
          <Link to={`${baseLocale}${i18n.language === 'en' ? '/dried-fruit' : '/fruits-secs'}`}>
            {t('nav.nuts')}
          </Link>
          <Link to={`${baseLocale}/quality`}>{t('nav.quality')}</Link>
        </div>
        <address className="site-footer__contact">
          <p className="eyebrow">{t('nav.contact')}</p>
          <a href="https://maps.google.com/?q=Rue+de+la+for%C3%AAt+76320+Saint-Pierre-l%C3%A8s-Elbeuf">
            Rue de la forêt
            <br />
            76320 Saint-Pierre-lès-Elbeuf
          </a>
          <a href={formatTelHref('+33 6.62.99.94.48')}>+33 6.62.99.94.48</a>
          <a href="mailto:contact@sonedis.fr">contact@sonedis.fr</a>
        </address>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} SONEDIS</span>
        <div>
          <Link to={`${baseLocale}${i18n.language === 'en' ? '/legal-notice' : '/mentions-legales'}`}>
            {t('legal.legalTitle')}
          </Link>
          <Link to={`${baseLocale}${i18n.language === 'en' ? '/privacy' : '/confidentialite'}`}>
            {t('legal.privacyTitle')}
          </Link>
        </div>
        <a href="#top" className="to-top">
          ↑ <span>{i18n.language === 'fr' ? 'Haut de page' : 'Back to top'}</span>
        </a>
      </div>
    </footer>
  )
}
