import Link from 'next/link'
import Stripe from 'stripe'
import ClearCart from './clear-cart'

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
            You&apos;ll receive the
            order details at the email
            address used during
            checkout.
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
    </>
  )
}