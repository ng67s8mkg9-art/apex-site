import Link from 'next/link'
import Stripe from 'stripe'
import ClearCart from './clear-cart'
import { supabaseAdmin } from '../../lib/supabase-admin'

const productFiles: Record<string, string> = {
  'APX-P001': 'APX-P001-afterglow.zip',
}

type PurchasedItem = {
  code: string
  quantity: number
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string
  }>
}) {
  const { session_id } = await searchParams
  const secretKey =
    process.env.STRIPE_SECRET_KEY

  let paymentConfirmed = false
  let downloadUrl: string | null = null

  if (session_id && secretKey) {
    try {
      const stripe = new Stripe(
        secretKey
      )

      const session =
        await stripe.checkout.sessions.retrieve(
          session_id
        )

      paymentConfirmed =
        session.payment_status === 'paid'

      if (paymentConfirmed) {
        const apexItems =
          session.metadata?.apex_items

        if (apexItems) {
          try {
            const purchasedItems =
              JSON.parse(
                apexItems
              ) as PurchasedItem[]

            const firstItem =
              purchasedItems[0]

            const filePath =
              productFiles[firstItem?.code]

            if (filePath) {
              const { data, error } =
                await supabaseAdmin.storage
                  .from('apex-products')
                  .createSignedUrl(
                    filePath,
                    60 * 60,
                    {
                      download: true,
                    }
                  )

              if (!error) {
                downloadUrl =
                  data.signedUrl
              } else {
                console.error(
                  'Unable to create signed download URL:',
                  error
                )
              }
            }
          } catch (error) {
            console.error(
              'Unable to read checkout metadata:',
              error
            )
          }
        }
      }
    } catch {
      paymentConfirmed = false
    }
  }

  if (!paymentConfirmed) {
    return (
      <main className="checkout-success-page">
        <section className="checkout-success-card shell">
          <span className="mono">
            APX / PAYMENT STATUS
          </span>

          <h1>
            PAYMENT NOT CONFIRMED.
          </h1>

          <p>
            We couldn&apos;t verify a
            completed payment for this
            checkout session.
          </p>

          <div className="checkout-success-actions">
            <Link
              href="/"
              className="button button-dark"
            >
              RETURN TO APEX
            </Link>

            <Link
              href="/#catalogue"
              className="text-link"
            >
              VIEW CATALOGUE
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <>
      <ClearCart />

      <main className="checkout-success-page">
        <section className="checkout-success-card shell">
          <span className="mono">
            APX / ORDER CONFIRMED
          </span>

          <h1>
            PAYMENT COMPLETE.
          </h1>

          <p>
            Your payment was
            successfully verified.
          </p>

          <div className="checkout-success-actions">
            {downloadUrl && (
              <a
                href={downloadUrl}
                className="button button-dark"
              >
                DOWNLOAD PURCHASE
              </a>
            )}

            <Link
              href="/"
              className="text-link"
            >
              RETURN TO APEX
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}