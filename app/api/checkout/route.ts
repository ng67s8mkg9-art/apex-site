import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const catalogue = {
  'APX-P001': {
    name: 'AFTERGLOW',
    description: 'Progressive House Project',
    price: 2499,
  },

  'APX-SB002': {
    name: 'FRACTURE',
    description: 'Analog Textures',
    price: 1999,
  },

  'APX-SP003': {
    name: 'TERRAIN',
    description: 'Drums / Percussion / FX',
    price: 1799,
  },

  'APX-M004': {
    name: 'MOMENTUM',
    description: 'Melodic Sequences',
    price: 1499,
  },
} as const

type ProductCode = keyof typeof catalogue

type CheckoutItem = {
  code: string
  quantity: number
}

type PurchasedItem = {
  code: ProductCode
  quantity: number
}

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured.',
      },
      {
        status: 500,
      }
    )
  }

  const stripe = new Stripe(secretKey)

  try {
    const body = await request.json()

    const items = body.items as CheckoutItem[]

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: 'Your bag is empty.',
        },
        {
          status: 400,
        }
      )
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      []

    const purchasedItems: PurchasedItem[] = []

    for (const item of items) {
      if (
        !item ||
        typeof item.code !== 'string' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        return NextResponse.json(
          {
            error: 'Invalid cart item.',
          },
          {
            status: 400,
          }
        )
      }

      const product =
        catalogue[item.code as ProductCode]

      if (!product) {
        return NextResponse.json(
          {
            error: 'Unknown product.',
          },
          {
            status: 400,
          }
        )
      }

      const code = item.code as ProductCode

      purchasedItems.push({
        code,
        quantity: item.quantity,
      })

      lineItems.push({
        quantity: item.quantity,

        price_data: {
          currency: 'gbp',

          unit_amount: product.price,

          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      })
    }

    const origin = new URL(request.url).origin

    const session =
      await stripe.checkout.sessions.create({
        mode: 'payment',

        line_items: lineItems,

        metadata: {
          apex_items: JSON.stringify(
            purchasedItems
          ),
        },

        success_url:
          `${origin}/checkout/success` +
          '?session_id={CHECKOUT_SESSION_ID}',

        cancel_url:
          `${origin}/?checkout=cancelled#catalogue`,
      })

    if (!session.url) {
      throw new Error(
        'Stripe did not return a checkout URL.'
      )
    }

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)

    return NextResponse.json(
      {
        error: 'Unable to create checkout session.',
      },
      {
        status: 500,
      }
    )
  }
}