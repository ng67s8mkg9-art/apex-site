'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '../../cart-provider'

export default function ClearCart() {
  const { clearCart } = useCart()
  const hasCleared = useRef(false)

  useEffect(() => {
    if (hasCleared.current) {
      return
    }

    hasCleared.current = true
    clearCart()
  }, [clearCart])

  return null
}