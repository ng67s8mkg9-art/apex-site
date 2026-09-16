import Link from 'next/link'
import { notFound } from 'next/navigation'
import AddToCartButton from './add-to-cart-button'

const products = {
  afterglow: {
    code: 'APX-P001',
    category: 'MUSIC PROJECT',
    name: 'AFTERGLOW',
    description: 'Progressive House Project',
    intro:
      'A complete production project built to be opened, pulled apart and studied. Explore the arrangement, sound choices, processing and workflow behind the finished track.',
    specs: [
      ['TEMPO', '128 BPM'],
      ['KEY', 'A MINOR'],
      ['DAW', 'CUBASE 15'],
      ['CHANNELS', '42'],
    ],
    included: [
      'Complete Cubase project',
      'Audio and MIDI arrangement',
      'Processing and routing',
      'Production notes',
    ],
    requirements: [
      'Cubase 15 or later',
      'Third-party plugins may be required',
      'Full plugin list supplied before purchase',
    ],
    price: '£24.99',
    priceValue: 24.99,
    artClass: 'case-art-afterglow',
  },

  fracture: {
    code: 'APX-SB002',
    category: 'SOUND BANK',
    name: 'FRACTURE',
    description: 'Analog Textures',
    intro:
      'A focused collection of production-ready sounds designed for electronic music. Built for immediate use, but structured so you can reverse-engineer the sound design behind them.',
    specs: [
      ['CONTENT', '120+ PRESETS'],
      ['SERUM', 'SUPPORTED'],
      ['VITAL', 'SUPPORTED'],
      ['PHASE PLANT', 'SUPPORTED'],
    ],
    included: [
      '120+ presets',
      'Bass, leads, pads and textures',
      'Macro assignments',
      'Organised preset folders',
    ],
    requirements: [
      'Compatible synth version required',
      'Serum / Vital / Phase Plant',
      'Installation instructions included',
    ],
    price: '£19.99',
    priceValue: 19.99,
    artClass: 'case-art-fracture',
  },

  terrain: {
    code: 'APX-SP003',
    category: 'SAMPLE PACK',
    name: 'TERRAIN',
    description: 'Drums / Percussion / FX',
    intro:
      'A detailed sample library built for fast production and deeper experimentation, with clearly organised material for drums, percussion and effects.',
    specs: [
      ['CONTENT', '800+ SAMPLES'],
      ['FORMAT', '24-BIT WAV'],
      ['TYPE', 'ONE-SHOTS + FX'],
      ['LABELS', 'ORGANISED'],
    ],
    included: [
      'Drum one-shots',
      'Percussion',
      'FX and transitions',
      'Organised WAV folders',
    ],
    requirements: [
      'Any DAW that supports WAV',
      'No third-party plugins required',
    ],
    price: '£17.99',
    priceValue: 17.99,
    artClass: 'case-art-terrain',
  },

  momentum: {
    code: 'APX-M004',
    category: 'MIDI PACK',
    name: 'MOMENTUM',
    description: 'Melodic Sequences',
    intro:
      'A collection of melodic ideas designed to accelerate writing without locking you into finished loops. Edit the notes, change the sound and make the material your own.',
    specs: [
      ['CONTENT', '400+ MIDI FILES'],
      ['KEY', 'LABELLED'],
      ['BPM', 'LABELLED'],
      ['FORMAT', 'STANDARD MIDI'],
    ],
    included: [
      'Melodic sequences',
      'Chord progressions',
      'Bass patterns',
      'Key and BPM labelling',
    ],
    requirements: [
      'Any DAW that supports MIDI',
      'No third-party plugins required',
    ],
    price: '£14.99',
    priceValue: 14.99,
    artClass: 'case-art-momentum',
  },
}

type ProductSlug = keyof typeof products

function ProductCase({
  name,
  category,
  artClass,
}: {
  name: string
  category: string
  artClass: string
}) {
  return (
    <div className="catalogue-case product-detail-case" aria-hidden="true">
      <div className="catalogue-case-shadow" />

      <div className="catalogue-case-spine">
        <span>{category}</span>
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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = products[slug as ProductSlug]

  if (!product) {
    notFound()
  }

  return (
    <main className="product-page">
      <header className="product-page-header shell">
        <Link
          href="/"
          className="brand"
          aria-label="APEX home"
        >
          <img
            src="/apex-forensic.png"
            alt="APEX Forensic Sound Design"
          />
        </Link>

        <Link
          href="/#catalogue"
          className="text-link"
        >
          ← BACK TO CATALOGUE
        </Link>
      </header>

      <section className="product-detail shell">
        <div className="product-detail-visual">
          <ProductCase
            name={product.name}
            category={product.category}
            artClass={product.artClass}
          />
        </div>

        <div className="product-detail-copy">
          <div className="product-detail-code mono">
            <span>{product.code}</span>
            <span>// {product.category}</span>
          </div>

          <h1>{product.name}</h1>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-rule" />

          <p className="product-detail-intro">
            {product.intro}
          </p>

          <div className="product-detail-spec-grid">
            {product.specs.map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="product-detail-buy">
            <strong>
              {product.price}
            </strong>

            <AddToCartButton
              code={product.code}
              slug={slug}
              name={product.name}
              type={product.category}
              price={product.priceValue}
            />
          </div>
        </div>
      </section>

      <section className="product-information shell">
        <div className="product-info-block">
          <span className="mono">
            01 // WHAT&apos;S INCLUDED
          </span>

          <h2>
            Inside the product.
          </h2>

          <ul>
            {product.included.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="product-info-block">
          <span className="mono">
            02 // REQUIREMENTS
          </span>

          <h2>
            Before you open it.
          </h2>

          <ul>
            {product.requirements.map((item) => (
              <li key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>
            APEX
          </strong>

          <span>
            FORENSIC SOUND DESIGN
          </span>
        </div>

        <div className="mono footer-meta">
          SOUND / ANALYSE / BUILD / REPEAT
        </div>
      </footer>
    </main>
  )
}