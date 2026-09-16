'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from './cart-provider'

type ProductCategory =
  | 'projects'
  | 'sound-banks'
  | 'samples'
  | 'midi'
  | 'tools'

type FilterCategory = 'all' | ProductCategory

const categoryLabels: Record<ProductCategory, string> = {
  projects: 'PROJECTS',
  'sound-banks': 'SOUND BANKS',
  samples: 'SAMPLES',
  midi: 'MIDI',
  tools: 'TOOLS',
}

const products = [
  {
    code: 'APX-P001',
    slug: 'afterglow',
    category: 'projects' as ProductCategory,
    type: 'MUSIC PROJECT',
    name: 'AFTERGLOW',
    desc: 'Progressive House Project',
    specs: ['128 BPM · A MINOR', 'CUBASE 15 · 42 CHANNELS'],
    price: '£24.99',
    priceValue: 24.99,
    artClass: 'case-art-afterglow',
    id: 'projects',
  },
  {
    code: 'APX-SB002',
    slug: 'fracture',
    category: 'sound-banks' as ProductCategory,
    type: 'SOUND BANK',
    name: 'FRACTURE',
    desc: 'Analog Textures',
    specs: ['120+ PRESETS', 'SERUM · VITAL · PHASE PLANT'],
    price: '£19.99',
    priceValue: 19.99,
    artClass: 'case-art-fracture',
    id: 'sound-banks',
  },
  {
    code: 'APX-SP003',
    slug: 'terrain',
    category: 'samples' as ProductCategory,
    type: 'SAMPLE PACK',
    name: 'TERRAIN',
    desc: 'Drums / Percussion / FX',
    specs: ['800+ SAMPLES', '24-BIT · WAV'],
    price: '£17.99',
    priceValue: 17.99,
    artClass: 'case-art-terrain',
    id: 'samples',
  },
  {
    code: 'APX-M004',
    slug: 'momentum',
    category: 'midi' as ProductCategory,
    type: 'MIDI PACK',
    name: 'MOMENTUM',
    desc: 'Melodic Sequences',
    specs: ['400+ MIDI FILES', 'KEY + BPM LABELLED'],
    price: '£14.99',
    priceValue: 14.99,
    artClass: 'case-art-momentum',
    id: 'midi',
  },
]

const navigation = [
  { label: 'Projects', href: '#projects' },
  { label: 'Sound Banks', href: '#sound-banks' },
  { label: 'Samples', href: '#samples' },
  { label: 'MIDI', href: '#midi' },
  { label: 'Tools', href: '#catalogue' },
  { label: '1-to-1', href: '#sessions' },
  { label: 'About', href: '#about' },
]

function Crosshair() {
  return <span className="crosshair" aria-hidden="true" />
}

function ProductCase({
  name,
  type,
  artClass,
}: {
  name: string
  type: string
  artClass: string
}) {
  return (
    <div className="catalogue-case" aria-hidden="true">
      <div className="catalogue-case-shadow" />

      <div className="catalogue-case-spine">
        <span>{type}</span>
      </div>

      <div className={`catalogue-case-front ${artClass}`}>
        <div className="catalogue-case-glass" />

        <div className="catalogue-case-brand">
          APEX
        </div>

        <div className="catalogue-case-title">
          <small>
            APEX / FORENSIC SOUND DESIGN
          </small>

          <strong>{name}</strong>
        </div>
      </div>

      <div className="catalogue-case-edge" />
    </div>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const [activeFilter, setActiveFilter] =
    useState<FilterCategory>('all')

  const {
    addItem,
    itemCount,
    openCart,
  } = useCart()

  function closeMenu() {
    setMenuOpen(false)
  }

  const availableCategories = useMemo(() => {
    const categories = new Set<ProductCategory>()

    products.forEach((product) => {
      categories.add(product.category)
    })

    return Array.from(categories)
  }, [])

  const visibleProducts = useMemo(() => {
    if (activeFilter === 'all') {
      return products
    }

    return products.filter(
      (product) =>
        product.category === activeFilter
    )
  }, [activeFilter])

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <main>
      <header className="site-header shell">
        <a
          className="brand"
          href="#top"
          aria-label="APEX home"
          onClick={closeMenu}
        >
          <img
            src="/apex-forensic.png"
            alt="APEX Forensic Sound Design"
          />
        </a>

        <nav
          className="main-nav"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div
          className="utility-nav"
          aria-label="Utilities"
        >
          <button
            type="button"
            aria-label="Search"
          >
            ⌕
          </button>

          <span className="utility-rule" />

          <button
            type="button"
            aria-label={`Bag with ${itemCount} items`}
            onClick={openCart}
          >
            ▢ <small>({itemCount})</small>
          </button>

          <button
            type="button"
            className={`menu-toggle ${
              menuOpen
                ? 'menu-toggle-open'
                : ''
            }`}
            aria-label={
              menuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() =>
              setMenuOpen(
                (open) => !open
              )
            }
          >
            <span />
            <span />
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`mobile-menu ${
            menuOpen
              ? 'mobile-menu-open'
              : ''
          }`}
        >
          <div className="mobile-menu-inner">
            <div className="mobile-menu-header mono">
              <span>
                APX / NAVIGATION
              </span>

              <Crosshair />
            </div>

            <nav
              className="mobile-menu-nav"
              aria-label="Mobile navigation"
            >
              {navigation.map(
                (item, index) => (
                  <a
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    onClick={
                      closeMenu
                    }
                  >
                    <span className="mobile-menu-number mono">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <span>
                      {item.label}
                    </span>

                    <span className="mobile-menu-arrow">
                      →
                    </span>
                  </a>
                )
              )}
            </nav>

            <div className="mobile-menu-footer mono">
              SOUND / ANALYSE /
              BUILD / REPEAT
            </div>
          </div>
        </div>
      </header>

      <section
        className="hero shell"
        id="top"
      >
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span>001</span>

            <span className="hairline" />

            <span>
              // FEATURED RELEASE
            </span>
          </div>

          <div className="hero-wordmark">
            APEX
          </div>

          <div className="hero-tagline">
            FORENSIC SOUND DESIGN
          </div>

          <div className="hero-rule" />

          <p className="hero-subhead">
            Music projects, sound
            banks, samples and tools
            — engineered to be pulled
            apart, studied and used.
          </p>

          <div className="hero-actions">
            <a
              className="button button-dark"
              href="#projects"
            >
              EXPLORE PROJECTS{' '}
              <span>→</span>
            </a>

            <a
              className="text-link"
              href="#catalogue"
            >
              VIEW CATALOGUE
            </a>
          </div>

          <div
            className="category-readout"
            aria-label="Catalogue counts"
          >
            <Crosshair />

            <div>
              <small>PROJECTS</small>
              <strong>04</strong>
            </div>

            <div>
              <small>
                SOUND BANKS
              </small>
              <strong>12</strong>
            </div>

            <div>
              <small>SAMPLES</small>
              <strong>28</strong>
            </div>

            <div>
              <small>MIDI</small>
              <strong>16</strong>
            </div>

            <div>
              <small>TOOLS</small>
              <strong>07</strong>
            </div>
          </div>
        </div>

        <div className="hero-product">
          <div className="lab-note">
            SOUND
            <br />
            ANALYSE
            <br />
            BUILD
            <br />
            REPEAT
            <Crosshair />
          </div>

          <Link
            href="/product/afterglow"
            className="case-wrap"
            aria-label="View Afterglow product"
          >
            <img
              src="/afterglow-product.png"
              alt="APEX Afterglow music project case"
            />
          </Link>

          <div className="hero-meta">
            <span className="mono">
              APX-P001
            </span>

            <h2>AFTERGLOW</h2>

            <p>
              PROGRESSIVE HOUSE
              <br />
              PROJECT
            </p>

            <div className="meta-rule" />

            <p className="mono">
              128 BPM · A MINOR
              <br />
              CUBASE 15
              <br />
              42 CHANNELS
            </p>

            <div className="price-line">
              <span />

              <strong>
                £24.99
              </strong>
            </div>

            <button
              type="button"
              className="button button-dark"
              onClick={() =>
                addItem({
                  code: 'APX-P001',
                  slug: 'afterglow',
                  name: 'AFTERGLOW',
                  type: 'MUSIC PROJECT',
                  price: 24.99,
                })
              }
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </section>

      <div className="manifesto shell">
        <span>
          PRECISION TOOLS FOR
          CREATIVE MINDS
        </span>

        <span className="manifesto-line" />

        <span>APX-001</span>
      </div>

      <section className="pillars">
        <div className="shell pillars-grid">
          <article>
            <span className="icon">
              ◇
            </span>

            <div>
              <strong>
                DECONSTRUCT
              </strong>

              <small>
                REAL PROJECTS
              </small>
            </div>
          </article>

          <article>
            <span className="icon">
              ∿
            </span>

            <div>
              <strong>
                EXPLORE
              </strong>

              <small>
                UNIQUE SOUNDS
              </small>
            </div>
          </article>

          <article>
            <span className="icon">
              ⊞
            </span>

            <div>
              <strong>
                BUILD
              </strong>

              <small>
                YOUR OWN SOUND
              </small>
            </div>
          </article>

          <article>
            <span className="icon">
              ◎
            </span>

            <div>
              <strong>
                GO FURTHER
              </strong>

              <small>
                A DEEPER PROCESS
              </small>
            </div>
          </article>
        </div>
      </section>

      <section
        className="catalogue shell"
        id="catalogue"
      >
        <div className="section-heading">
          <div>
            <span className="mono">
              // CATALOGUE
            </span>

            <h2>
              LATEST RELEASES
            </h2>

            <p>
              Tools for a deeper
              process.
            </p>
          </div>

          <button
            type="button"
            className="catalogue-reset text-link"
            onClick={() =>
              setActiveFilter('all')
            }
          >
            VIEW ALL →
          </button>
        </div>

        <div
          className="catalogue-filters"
          aria-label="Filter catalogue"
        >
          <button
            type="button"
            className={
              activeFilter === 'all'
                ? 'catalogue-filter catalogue-filter-active'
                : 'catalogue-filter'
            }
            onClick={() =>
              setActiveFilter('all')
            }
          >
            <span className="mono">
              00
            </span>

            <strong>ALL</strong>

            <small>
              {String(
                products.length
              ).padStart(2, '0')}
            </small>
          </button>

          {availableCategories.map(
            (category, index) => {
              const count =
                products.filter(
                  (product) =>
                    product.category ===
                    category
                ).length

              return (
                <button
                  key={category}
                  type="button"
                  className={
                    activeFilter ===
                    category
                      ? 'catalogue-filter catalogue-filter-active'
                      : 'catalogue-filter'
                  }
                  onClick={() =>
                    setActiveFilter(
                      category
                    )
                  }
                >
                  <span className="mono">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      '0'
                    )}
                  </span>

                  <strong>
                    {
                      categoryLabels[
                        category
                      ]
                    }
                  </strong>

                  <small>
                    {String(
                      count
                    ).padStart(
                      2,
                      '0'
                    )}
                  </small>
                </button>
              )
            }
          )}
        </div>

        <div className="catalogue-status mono">
          <span>
            FILTER /{' '}
            {activeFilter === 'all'
              ? 'ALL'
              : categoryLabels[
                  activeFilter
                ]}
          </span>

          <span className="catalogue-status-line" />

          <span>
            {String(
              visibleProducts.length
            ).padStart(2, '0')}{' '}
            ITEMS
          </span>
        </div>

        <div className="product-grid">
          {visibleProducts.map(
            (product) => (
              <article
                className="product-card"
                key={product.code}
                id={product.id}
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="product-card-link"
                  aria-label={`View ${product.name}`}
                >
                  <div className="product-object">
                    <ProductCase
                      name={product.name}
                      type={product.type}
                      artClass={product.artClass}
                    />
                  </div>

                  <div className="product-code-row">
                    <span className="mono">
                      {product.code}
                    </span>

                    <Crosshair />
                  </div>

                  <small className="mono product-type">
                    {product.type}
                  </small>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-desc">
                    {product.desc}
                  </p>

                  <div className="product-rule" />

                  <div className="product-specs mono">
                    {product.specs.map(
                      (spec) => (
                        <span key={spec}>
                          {spec}
                        </span>
                      )
                    )}
                  </div>

                  <strong className="product-price">
                    {product.price}
                  </strong>
                </Link>

                <button
                  type="button"
                  className="button button-dark product-button"
                  onClick={() =>
                    addItem({
                      code: product.code,
                      slug: product.slug,
                      name: product.name,
                      type: product.type,
                      price: product.priceValue,
                    })
                  }
                >
                  ADD TO BAG
                </button>
              </article>
            )
          )}
        </div>
      </section>

      <section
        className="sessions shell"
        id="sessions"
      >
        <div className="sessions-card">
          <div className="sessions-copy">
            <span className="mono">
              APX-SVC01 // DIRECT
              SESSION
            </span>

            <h2>
              1-TO-1
              <br />
              PRODUCTION SESSIONS
            </h2>

            <p>
              Work directly with me on
              your track, mix,
              arrangement, sound design
              or workflow.
            </p>

            <div className="session-specs mono">
              <span>60 MIN</span>
              <span>ONLINE</span>
              <span>
                SCREEN SHARE
              </span>
              <span>
                YOUR PROJECT
              </span>
            </div>

            <a
              className="button button-dark"
              href="mailto:hello@apexsounddesign.com?subject=1-to-1%20production%20session"
            >
              BOOK A SESSION →
            </a>
          </div>

          <div
            className="session-visual"
            aria-hidden="true"
          >
            <div className="scope scope-1" />
            <div className="scope scope-2" />
            <div className="scope scope-3" />

            <Crosshair />

            <span className="scope-label mono">
              SIGNAL / ANALYSIS /
              RESPONSE
            </span>
          </div>
        </div>
      </section>

      <section
        className="about shell"
        id="about"
      >
        <span className="mono">
          // ABOUT APEX
        </span>

        <div className="about-grid">
          <h2>
            Designed for producers who
            want to understand the
            process, not just own the
            files.
          </h2>

          <p>
            APEX builds music projects,
            sound banks, samples and
            production tools with the
            workings left visible. Pull
            them apart. Study the
            decisions. Take what works.
            Build something that sounds
            like you.
          </p>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>APEX</strong>

          <span>
            FORENSIC SOUND DESIGN
          </span>
        </div>

        <div className="mono footer-meta">
          SOUND / ANALYSE / BUILD /
          REPEAT
        </div>
      </footer>
    </main>
  )
}