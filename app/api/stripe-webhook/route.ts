import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      {
        error: 'Stripe webhook is not configured.',
      },
      {
        status: 500,
      }
    )
  }

  const stripe = new Stripe(secretKey)

  const signature =
    request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      {
        error: 'Missing Stripe signature.',
      },
      {
        status: 400,
      }
    )
  }

  const body = await request.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (error) {
    console.error(
      'Stripe webhook signature verification failed:',
      error
    )

    return NextResponse.json(
      {
        error: 'Invalid webhook signature.',
      },
      {
        status: 400,
      }
    )
  }

  if (
    event.type ===
    'checkout.session.completed'
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      console.log(
        'Verified paid Stripe checkout:',
        session.id
      )

      // Later, this is where we will:
      // 1. record the order
      // 2. identify purchased products
      // 3. send secure download links
      // 4. prevent duplicate fulfilment
    }
  }

  return NextResponse.json({
    received: true,
  })
}