'use client'

import Link from 'next/link'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type CartProduct = {
  code: string
  slug: string
  name: string
  type: string
  price: number
}

export type CartItem = CartProduct & {
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  addItem: (product: CartProduct) => void
  removeItem: (code: string) => void
  increaseItem: (code: string) => void
  decreaseItem: (code: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(
  null
)

const STORAGE_KEY = 'apex-cart'

export function CartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [checkoutLoading, setCheckoutLoading] =
    useState(false)

  const [checkoutError, setCheckoutError] =
    useState('')

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        STORAGE_KEY
      )

      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // Ignore invalid or unavailable local storage.
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) {
      return
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    )
  }, [items, loaded])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [isOpen])

  function addItem(product: CartProduct) {
    setCheckoutError('')

    setItems((current) => {
      const existing = current.find(
        (item) => item.code === product.code
      )

      if (existing) {
        return current.map((item) =>
          item.code === product.code
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...current,
        {
          ...product,
          quantity: 1,
        },
      ]
    })

    setIsOpen(true)
  }

  function removeItem(code: string) {
    setCheckoutError('')

    setItems((current) =>
      current.filter(
        (item) => item.code !== code
      )
    )
  }

  function increaseItem(code: string) {
    setCheckoutError('')

    setItems((current) =>
      current.map((item) =>
        item.code === code
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  function decreaseItem(code: string) {
    setCheckoutError('')

    setItems((current) =>
      current
        .map((item) =>
          item.code === code
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }

  function clearCart() {
  window.localStorage.removeItem(STORAGE_KEY)
  setItems([])
  setCheckoutError('')
  setIsOpen(false)
}

  async function handleCheckout() {
    if (
      checkoutLoading ||
      items.length === 0
    ) {
      return
    }

    setCheckoutLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch(
        '/api/checkout',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            items: items.map(
              (item) => ({
                code: item.code,
                quantity:
                  item.quantity,
              })
            ),
          }),
        }
      )

      const data = await response.json()

      if (
        !response.ok ||
        typeof data.url !== 'string'
      ) {
        throw new Error(
          data.error ||
            'Unable to start checkout.'
        )
      }

      window.location.href = data.url
    } catch (error) {
      if (error instanceof Error) {
        setCheckoutError(
          error.message
        )
      } else {
        setCheckoutError(
          'Unable to start checkout.'
        )
      }

      setCheckoutLoading(false)
    }
  }

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  )

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      isOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      increaseItem,
      decreaseItem,
      clearCart,
      openCart: () =>
        setIsOpen(true),
      closeCart: () =>
        setIsOpen(false),
    }),
    [
      items,
      isOpen,
      itemCount,
      subtotal,
    ]
  )

  return (
    <CartContext.Provider value={value}>
      {children}

      {isOpen && (
        <div
          className="cart-layer"
          aria-live="polite"
        >
          <button
            type="button"
            className="cart-backdrop"
            aria-label="Close bag"
            onClick={() =>
              setIsOpen(false)
            }
          />

          <aside
            className="cart-drawer"
            aria-label="Shopping bag"
          >
            <div className="cart-header">
              <div>
                <span className="mono">
                  APX / BAG
                </span>

                <h2>YOUR BAG</h2>
              </div>

              <button
                type="button"
                className="cart-close"
                aria-label="Close bag"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="mono">
                  00 ITEMS
                </span>

                <h3>
                  YOUR BAG IS EMPTY.
                </h3>

                <p>
                  Add a project, sound
                  bank, sample pack or
                  MIDI pack to get
                  started.
                </p>

                <button
                  type="button"
                  className="button button-dark"
                  onClick={() =>
                    setIsOpen(false)
                  }
                >
                  CONTINUE BROWSING
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map(
                    (item) => (
                      <article
                        className="cart-item"
                        key={item.code}
                      >
                        <div className="cart-item-top">
                          <div>
                            <span className="mono cart-item-code">
                              {
                                item.code
                              }
                            </span>

                            <Link
                              href={`/product/${item.slug}`}
                              className="cart-item-name"
                              onClick={() =>
                                setIsOpen(
                                  false
                                )
                              }
                            >
                              {
                                item.name
                              }
                            </Link>

                            <span className="mono cart-item-type">
                              {
                                item.type
                              }
                            </span>
                          </div>

                          <strong>
                            £
                            {(
                              item.price *
                              item.quantity
                            ).toFixed(
                              2
                            )}
                          </strong>
                        </div>

                        <div className="cart-item-controls">
                          <div
                            className="cart-quantity"
                            aria-label={`Quantity for ${item.name}`}
                          >
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              onClick={() =>
                                decreaseItem(
                                  item.code
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              onClick={() =>
                                increaseItem(
                                  item.code
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove mono"
                            onClick={() =>
                              removeItem(
                                item.code
                              )
                            }
                          >
                            REMOVE
                          </button>
                        </div>
                      </article>
                    )
                  )}
                </div>

                <div className="cart-footer">
                  <div className="cart-subtotal">
                    <span className="mono">
                      SUBTOTAL
                    </span>

                    <strong>
                      £
                      {subtotal.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <p className="mono cart-note">
                    DIGITAL PRODUCTS /
                    INSTANT DELIVERY
                  </p>

                  {checkoutError && (
                    <p
                      className="mono"
                      role="alert"
                      style={{
                        margin:
                          '18px 0 0',
                        fontSize: '9px',
                        lineHeight: 1.5,
                      }}
                    >
                      {checkoutError}
                    </p>
                  )}

                  <button
                    type="button"
                    className="button button-dark"
                    disabled={
                      checkoutLoading
                    }
                    onClick={
                      handleCheckout
                    }
                    style={{
                      width: '100%',
                      marginTop:
                        '22px',
                    }}
                  >
                    {checkoutLoading
                      ? 'OPENING CHECKOUT...'
                      : 'CHECKOUT →'}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}