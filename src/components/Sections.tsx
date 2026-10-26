import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { basePath, formatTelHref, validateContactForm } from '../utils/site'
import { galleryItems, galleryFile, type Product, productFile } from '../data'
import { Flip, gsap, useGSAP } from '../app/motion'

export function SectionLabel({ children }: { number: string; children: ReactNode }) {
  return <div className="section-label">{children}</div>
}

export function ActionLink({
  to,
  children,
  light = false,
}: {
  to: string
  children: ReactNode
  light?: boolean
}) {
  return (
    <Link className={`action-link${light ? ' action-link--light' : ''}`} to={to}>
      <span>{children}</span>
      <b aria-hidden="true">↗</b>
    </Link>
  )
}

export function StoryRail({
  compact = false,
  omitIntroBody = false,
}: {
  compact?: boolean
  omitIntroBody?: boolean
}) {
  const { t } = useTranslation()
  const rail = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!rail.current || !track.current) return
      const media = gsap.matchMedia()
      media.add('(min-width: 780px) and (prefers-reduced-motion: no-preference)', () => {
        const panels = track.current!
        gsap.to(panels, {
          x: () => -(panels.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: rail.current,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${panels.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => media.revert()
    },
    { scope: rail },
  )

  const milestones = [
    { mark: '1965', title: t('about.origin'), text: t('hero.label') },
    { mark: 'II', title: t('about.heritage'), text: t('about.body') },
    { mark: '→', title: t('about.today'), text: t('brands.intro') },
  ]
  return (
    <section
      className={`story-rail${compact ? ' story-rail--compact' : ''}`}
      ref={rail}
      aria-label={t('about.eyebrow')}
    >
      <div className="story-rail__intro">
        <SectionLabel number="01">{t('about.eyebrow')}</SectionLabel>
        <h2>{t('about.title')}</h2>
        {!omitIntroBody && <p>{t('about.body')}</p>}
      </div>
      <div className="story-track" ref={track}>
        {milestones.map((item, index) => (
          <article className="story-panel" key={item.mark}>
            <span className="story-panel__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="story-panel__mark">{item.mark}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            {index < milestones.length - 1 && (
              <span className="story-panel__connector" aria-hidden="true">
                ⟶
              </span>
            )}
          </article>
        ))}
      </div>
      <p className="story-rail__hint">
        {t('common.from')} <span aria-hidden="true">↓</span>
      </p>
    </section>
  )
}

export function BrandScenes() {
  const { t } = useTranslation()
  const brands = [
    {
      id: 'bilkis',
      name: 'BILKIS',
      image: 'bilkis.jpg',
      product: 'DATTES-BRANCHEES-BILKIS-1KG-PREMIUM-ALGERIE.jpg',
      tone: 'plum',
    },
    { id: 'laya', name: 'LAYA', image: 'laya.jpg', product: null, tone: 'laya' },
    {
      id: 'agrodat',
      name: 'AGRODAT',
      image: 'Agrodat.jpg',
      product: 'Pate_dattes_Agrodat_1kg.jpg',
      tone: 'agrodat',
    },
  ]
  return (
    <section className="brand-scenes section-pad" id="marques">
      <div className="section-heading section-heading--split">
        <div>
          <SectionLabel number="04">{t('brands.eyebrow')}</SectionLabel>
          <h2>{t('brands.title')}</h2>
        </div>
        <p>{t('brands.intro')}</p>
      </div>
      <div className="brand-scenes__grid">
        {brands.map((brand, index) => (
          <article className={`brand-card brand-card--${brand.tone}`} key={brand.id}>
            <div className="brand-card__top">
              <span>0{index + 1}</span>
              <img src={`${basePath}/assets/brands/${brand.image}`} alt={brand.name} loading="lazy" />
            </div>
            <div className="brand-card__product">
              {brand.product ? (
                <img src={`${basePath}/assets/products/${brand.product}`} alt="" loading="lazy" />
              ) : (
                <span className="brand-card__mark" aria-hidden="true">
                  {brand.name}
                </span>
              )}
            </div>
            <h3 className="sr-only">{brand.name}</h3>
            <p>{t(`brands.${brand.id}`)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

const clientLogos = [
  { file: 'E.Leclerc-Logo.wine_-2048x421.png', name: 'E.Leclerc' },
  { file: 'carrefour-group-vector-logo-11573932015tphxnjw09y-removebg-preview-1-1.png', name: 'Carrefour' },
  { file: 'Logo_Auchan_2015.svg.png', name: 'Auchan' },
  { file: 'Super_U_logo_2009.svg.png', name: 'Super U' },
  { file: 'unnamed-removebg-preview-1.png', name: 'Logo client supplémentaire présenté sur le site SONEDIS' },
]

export function ClientMarquee() {
  const { t, i18n } = useTranslation()
  const track = useRef<HTMLDivElement>(null)
  const animation = useRef<gsap.core.Tween | null>(null)
  useGSAP(
    () => {
      if (!track.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      animation.current = gsap.to(track.current, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 })
      return () => animation.current?.kill()
    },
    { scope: track },
  )
  return (
    <section className="client-section section-pad" id="clients">
      <div className="section-heading section-heading--split">
        <div>
          <SectionLabel number="06">{t('clients.eyebrow')}</SectionLabel>
          <h2>{t('clients.title')}</h2>
        </div>
        <p>{t('clients.body')}</p>
      </div>
      <div
        className="marquee-window"
        onMouseEnter={() => animation.current?.pause()}
        onMouseLeave={() => animation.current?.resume()}
        onFocus={() => animation.current?.pause()}
        onBlur={() => animation.current?.resume()}
        aria-label={t('clients.eyebrow')}
      >
        <div className="marquee-track" ref={track}>
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
              {clientLogos.map((client) => (
                <div className="client-logo" key={client.name}>
                  <img
                    src={`${basePath}/assets/clients/${client.file}`}
                    alt={
                      copy === 0
                        ? client.name.startsWith('Logo client') && i18n.language === 'en'
                          ? 'Additional retail client logo'
                          : client.name
                        : ''
                    }
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const certifications = [
  { name: 'IFS', file: 'IFS_Logo.jpg' },
  { name: 'IFS Broker', file: 'IFS-Broker-Logo-1210x800-01.jpg' },
  { name: 'SMETA', file: 'smeta-certification-logo-png_seeklogo-615209.png' },
  { name: 'BRC', file: 'Logo_BRC-removebg-preview.png' },
  { name: 'AB', file: 'AB.svg.png' },
]

export function CertificationBadges() {
  const { t } = useTranslation()
  const section = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const badges = gsap.utils.toArray<HTMLElement>('.certification-badge')
      gsap.from(badges, {
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section.current, start: 'top 78%', once: true },
      })
    },
    { scope: section },
  )
  return (
    <section className="certification-section section-pad" ref={section} id="qualite">
      <div className="section-heading section-heading--split">
        <div>
          <SectionLabel number="07">{t('quality.eyebrow')}</SectionLabel>
          <h2>{t('quality.title')}</h2>
        </div>
        <p>{t('quality.body')}</p>
      </div>
      <div className="certification-grid">
        {certifications.map((item, index) => (
          <details className="certification-badge" key={item.name}>
            <summary aria-label={`${item.name} — ${t('quality.detail')}`}>
              <span className="certification-badge__index">0{index + 1}</span>
              <img src={`${basePath}/assets/certifications/${item.file}`} alt={item.name} loading="lazy" />
              <span className="certification-badge__name">{item.name}</span>
            </summary>
            <p>{t('quality.detail')}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Gallery() {
  const { t, i18n } = useTranslation()
  const [active, setActive] = useState<number | null>(null)
  const startX = useRef<number | null>(null)
  const activeImage = useRef<HTMLImageElement>(null)
  const galleryRef = useRef<HTMLElement>(null)
  const index = active ?? 0

  const open = (next: number) => {
    const source = document.querySelector(`[data-flip-id="gallery-${next}"]`)
    const before = source ? Flip.getState(source) : undefined
    setActive(next)
    requestAnimationFrame(() => {
      if (before && activeImage.current)
        Flip.from(before, {
          targets: activeImage.current,
          duration: 0.7,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
        })
    })
  }
  const close = () => {
    if (active === null) return
    const before = activeImage.current ? Flip.getState(activeImage.current) : undefined
    const closingIndex = active
    setActive(null)
    requestAnimationFrame(() => {
      const target = document.querySelector(`[data-flip-id="gallery-${closingIndex}"]`)
      if (before && target)
        Flip.from(before, {
          targets: target,
          duration: 0.5,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
        })
    })
  }
  const move = (delta: number) =>
    setActive((current) =>
      current === null ? null : (current + delta + galleryItems.length) % galleryItems.length,
    )
  useEffect(() => {
    if (active === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])
  useEffect(() => {
    if (active !== null) activeImage.current?.focus()
  }, [active])
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.gallery-card')
      gsap.from(cards, {
        y: 32,
        opacity: 0,
        duration: 0.65,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: galleryRef.current, start: 'top 78%', once: true },
      })
    },
    { scope: galleryRef },
  )

  return (
    <section className="gallery-section section-pad" ref={galleryRef} id="galerie">
      <div className="section-heading section-heading--split">
        <div>
          <SectionLabel number="08">{t('common.gallery')}</SectionLabel>
          <h2>{t('gallery.title')}</h2>
        </div>
        <p>{t('common.from')} · SONEDIS</p>
      </div>
      <div className="gallery-grid">
        {galleryItems.map((item, itemIndex) => (
          <button
            className={`gallery-card gallery-card--${itemIndex % 4}`}
            key={item.src}
            type="button"
            onClick={() => open(itemIndex)}
            aria-label={`${t('gallery.open')}: ${i18n.language === 'en' ? item.altEn : item.alt}`}
          >
            <img
              data-flip-id={`gallery-${itemIndex}`}
              src={`${basePath}${galleryFile(item.src, 960)}`}
              srcSet={`${basePath}${galleryFile(item.src, 480)} 480w, ${basePath}${galleryFile(item.src, 960)} 960w, ${basePath}${galleryFile(item.src, 1440)} 1440w`}
              sizes="(max-width: 680px) 90vw, (max-width: 1100px) 44vw, 29vw"
              alt={i18n.language === 'en' ? item.altEn : item.alt}
              loading="lazy"
              width={item.width}
              height={item.height}
            />
            <span>{String(itemIndex + 1).padStart(2, '0')}</span>
            <b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>
      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('common.gallery')}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
          onTouchStart={(event) => {
            startX.current = event.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            const delta =
              startX.current === null
                ? 0
                : (event.changedTouches[0]?.clientX ?? startX.current) - startX.current
            if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1)
            startX.current = null
          }}
        >
          <button className="lightbox__close" type="button" onClick={close} aria-label={t('gallery.close')}>
            ×
          </button>
          <button
            className="lightbox__arrow lightbox__arrow--left"
            type="button"
            aria-label={t('gallery.previous')}
            onClick={() => move(-1)}
          >
            ←
          </button>
          <figure>
            <img
              ref={activeImage}
              tabIndex={-1}
              data-flip-id={`gallery-${index}`}
              src={`${basePath}${galleryFile(galleryItems[index]!.src, 1440)}`}
              alt={i18n.language === 'en' ? galleryItems[index]!.altEn : galleryItems[index]!.alt}
            />
            <figcaption>
              {i18n.language === 'en' ? galleryItems[index]!.altEn : galleryItems[index]!.alt}{' '}
              <span>
                {String(index + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </span>
            </figcaption>
          </figure>
          <button
            className="lightbox__arrow lightbox__arrow--right"
            type="button"
            aria-label={t('gallery.next')}
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      )}
    </section>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  const { t, i18n } = useTranslation()
  const [selected, setSelected] = useState<Product | null>(null)
  const cardGrid = useRef<HTMLDivElement>(null)
  const select = (product: Product) => {
    const element = cardGrid.current?.querySelector(`[data-flip-id="product-${product.id}"]`)
    const before = element ? Flip.getState(element) : undefined
    setSelected(product)
    requestAnimationFrame(() => {
      const destination = document.querySelector(`[data-flip-id="product-detail-${product.id}"]`)
      if (before && destination)
        Flip.from(before, {
          targets: destination,
          duration: 0.7,
          ease: 'power3.inOut',
          scale: true,
          absolute: true,
        })
    })
  }
  const dismiss = () => setSelected(null)
  useEffect(() => {
    if (!selected) return
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [selected])
  return (
    <>
      <div className="product-grid" ref={cardGrid}>
        {products.map((product, index) => (
          <button className="product-card" type="button" key={product.id} onClick={() => select(product)}>
            <span className="product-card__number">{String(index + 1).padStart(2, '0')}</span>
            <span className="product-card__image">
              <img
                data-flip-id={`product-${product.id}`}
                src={`${basePath}${productFile(product.image, 900)}`}
                srcSet={`${basePath}${productFile(product.image, 480)} 480w, ${basePath}${productFile(product.image, 900)} 900w`}
                sizes="(max-width: 640px) 88vw, (max-width: 1000px) 42vw, 28vw"
                alt={i18n.language === 'en' ? product.altEn : product.alt}
                loading="lazy"
              />
            </span>
            <span className="product-card__copy">
              <b>{i18n.language === 'en' ? product.nameEn : product.name}</b>
              <span>
                {t('products.details')} <i aria-hidden="true">↗</i>
              </span>
            </span>
          </button>
        ))}
      </div>
      {selected && (
        <div
          className="product-detail"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismiss()
          }}
        >
          <button
            className="product-detail__close"
            onClick={dismiss}
            type="button"
            aria-label={t('gallery.close')}
          >
            ×
          </button>
          <div className="product-detail__image">
            <img
              data-flip-id={`product-detail-${selected.id}`}
              src={`${basePath}${productFile(selected.image, 900)}`}
              alt={i18n.language === 'en' ? selected.altEn : selected.alt}
            />
          </div>
          <div className="product-detail__copy">
            <p className="eyebrow">{t('products.eyebrow')}</p>
            <h2 id="product-detail-title">{i18n.language === 'en' ? selected.nameEn : selected.name}</h2>
            <p>{i18n.language === 'en' ? selected.descriptionEn : selected.description}</p>
            <button className="text-link" type="button" onClick={dismiss}>
              {t('gallery.close')} <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function ContactForm() {
  const { t } = useTranslation()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'missing'>('idle')
  const form = useRef<HTMLFormElement>(null)
  const update = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    if (errors[field]) setErrors(validateContactForm(next))
    if (status === 'error') setStatus('idle')
  }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trap = form.current?.elements.namedItem('company-site')
    if (trap instanceof HTMLInputElement && trap.value) return
    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY
    if (!endpoint && !accessKey) {
      setStatus('missing')
      return
    }
    setStatus('loading')
    try {
      const target = endpoint || 'https://api.web3forms.com/submit'
      const body = accessKey
        ? {
            access_key: accessKey,
            ...values,
            subject: 'Message depuis le site SONEDIS',
            from_name: 'Site SONEDIS',
            botcheck: '',
          }
        : { ...values, _gotcha: '' }
      const response = await fetch(target, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) throw new Error('form submit failed')
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
      setErrors({})
      form.current?.reset()
    } catch {
      setStatus('error')
    }
  }
  return (
    <form className="contact-form" ref={form} onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company-site">{t('contact.honeypot')}</label>
        <input id="company-site" name="company-site" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={`form-field${errors.name ? ' has-error' : ''}`}>
        <input
          id="name"
          name="name"
          value={values.name}
          onChange={(event) => update('name', event.target.value)}
          onBlur={() => {
            if (values.name.trim()) setErrors((current) => ({ ...current, name: '' }))
          }}
          placeholder=" "
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required
        />
        <label htmlFor="name">
          {t('contact.name')} <span>*</span>
        </label>
        {errors.name && <small id="name-error">{t(`contact.${errors.name}`)}</small>}
      </div>
      <div className={`form-field${errors.email ? ' has-error' : ''}`}>
        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => update('email', event.target.value)}
          onBlur={() => {
            if (values.email)
              setErrors((current) => ({ ...current, email: validateContactForm(values).email ?? '' }))
          }}
          placeholder=" "
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        <label htmlFor="email">
          {t('contact.email')} <span>*</span>
        </label>
        {errors.email && <small id="email-error">{t(`contact.${errors.email}`)}</small>}
      </div>
      <div className={`form-field form-field--message${errors.message ? ' has-error' : ''}`}>
        <textarea
          id="message"
          name="message"
          value={values.message}
          onChange={(event) => update('message', event.target.value)}
          onBlur={() => {
            if (values.message.trim()) setErrors((current) => ({ ...current, message: '' }))
          }}
          placeholder=" "
          rows={3}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          required
        />
        <label htmlFor="message">
          {t('contact.message')} <span>*</span>
        </label>
        {errors.message && <small id="message-error">{t(`contact.${errors.message}`)}</small>}
      </div>
      <div className="contact-form__bottom">
        <button className="action-link action-link--dark" type="submit" disabled={status === 'loading'}>
          <span>{status === 'loading' ? t('contact.sending') : t('contact.send')}</span>
          <b aria-hidden="true">↗</b>
        </button>
        <p
          className={`form-status form-status--${status}`}
          aria-live="polite"
          role={status === 'error' ? 'alert' : undefined}
        >
          {status === 'success'
            ? t('contact.success')
            : status === 'error'
              ? t('contact.error')
              : status === 'missing'
                ? t('contact.missing')
                : ''}
        </p>
      </div>
    </form>
  )
}

export function ContactBlock({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  return (
    <section
      className={`contact-section section-pad${compact ? ' contact-section--compact' : ''}`}
      id="contact"
    >
      <div className="contact-section__intro">
        <SectionLabel number="10">{t('contact.eyebrow')}</SectionLabel>
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.intro')}</p>
        <address className="contact-details">
          <div>
            <span>{t('contact.address')}</span>
            <a href="https://maps.google.com/?q=Rue+de+la+for%C3%AAt+76320+Saint-Pierre-l%C3%A8s-Elbeuf">
              Rue de la forêt,
              <br />
              76320 Saint-Pierre-lès-Elbeuf
            </a>
          </div>
          <div>
            <span>{t('contact.phone')}</span>
            <a href={formatTelHref('+33 6.62.99.94.48')}>+33 6.62.99.94.48</a>
          </div>
          <div>
            <span>{t('contact.emailLabel')}</span>
            <a href="mailto:contact@sonedis.fr">contact@sonedis.fr</a>
          </div>
        </address>
      </div>
      <ContactForm />
    </section>
  )
}

export function ProductHeroImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  return (
    <div className="product-hero-image">
      <img
        src={`${basePath}${productFile(src, 900)}`}
        srcSet={`${basePath}${productFile(src, 480)} 480w, ${basePath}${productFile(src, 900)} 900w`}
        sizes="(max-width: 760px) 100vw, 52vw"
        alt={alt}
        fetchPriority="high"
      />
      <span>{name}</span>
    </div>
  )
}
