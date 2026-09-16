'use client'

import { useCart } from '../../cart-provider'

type AddToCartButtonProps = {
  code: string
  slug: string
  name: string
  type: string
  price: number
}

export default function AddToCartButton({
  code,
  slug,
  name,
  type,
  price,
}: AddToCartButtonProps) {
  const { addItem } = useCart()

  return (
    <button
      type="button"
      className="button button-dark"
      onClick={() =>
        addItem({
          code,
          slug,
          name,
          type,
          price,
        })
      }
    >
      ADD TO BAG
    </button>
  )
}