import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../lib/supabase-admin'

type PurchasedItem = {
  code: string
  quantity: number
}

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
      const apexItems =
        session.metadata?.apex_items

      if (!apexItems) {
        console.error(
          'Paid checkout is missing APEX item metadata:',
          session.id
        )

        return NextResponse.json(
          {
            error: 'Missing APEX order metadata.',
          },
          {
            status: 500,
          }
        )
      }

      let purchasedItems: PurchasedItem[]

      try {
        purchasedItems =
          JSON.parse(apexItems) as PurchasedItem[]

        if (
          !Array.isArray(purchasedItems) ||
          purchasedItems.length === 0
        ) {
          throw new Error(
            'APEX item list is empty or invalid.'
          )
        }
      } catch (error) {
        console.error(
          'Unable to parse APEX item metadata:',
          error
        )

        return NextResponse.json(
          {
            error: 'Invalid APEX order metadata.',
          },
          {
            status: 500,
          }
        )
      }

      const { error } = await supabaseAdmin
        .from('orders')
        .upsert(
          {
            stripe_session_id: session.id,
            stripe_event_id: event.id,
            customer_email:
              session.customer_details?.email ??
              null,
            payment_status:
              session.payment_status,
            amount_total:
              session.amount_total ?? null,
            currency:
              session.currency ?? null,
            items: purchasedItems,
          },
          {
            onConflict: 'stripe_session_id',
            ignoreDuplicates: true,
          }
        )

      if (error) {
        console.error(
          'Unable to record APEX order:',
          error
        )

        return NextResponse.json(
          {
            error: 'Unable to record order.',
          },
          {
            status: 500,
          }
        )
      }

      console.log(
        'Recorded paid APEX order:',
        session.id,
        purchasedItems
      )
    }
  }

  return NextResponse.json({
    received: true,
  })
}