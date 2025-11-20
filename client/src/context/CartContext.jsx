import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      const parsed = raw ? JSON.parse(raw) : null
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const addToCart = (menuItem, quantity = 1, sauce) => {
    const isWings = String(menuItem.category || '').toLowerCase() === 'wings'
    const sauceVal = isWings ? (sauce || 'Buffalo') : undefined
    setItems(prev => {
      const existing = prev.find(i => i.menuItem._id === menuItem._id && (!isWings || i.sauce === sauceVal))
      if (existing) {
        return prev.map(i =>
          i.menuItem._id === menuItem._id && (!isWings || i.sauce === sauceVal)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { menuItem, quantity, sauce: sauceVal }]
    })
  }

  const updateQuantity = (id, quantity, sauce) => {
    setItems(prev =>
      prev.map(i => {
        const isWings = String(i.menuItem.category || '').toLowerCase() === 'wings'
        const match = i.menuItem._id === id && (!isWings || i.sauce === (sauce ?? i.sauce))
        return match ? { ...i, quantity } : i
      }),
    )
  }

  const updateSauce = (id, sauce) => {
    setItems(prev => prev.map(i => {
      const isWings = String(i.menuItem.category || '').toLowerCase() === 'wings'
      if (i.menuItem._id === id && isWings) {
        return { ...i, sauce }
      }
      return i
    }))
  }

  const removeFromCart = (id, sauce) => {
    setItems(prev => prev.filter(i => {
      const isWings = String(i.menuItem.category || '').toLowerCase() === 'wings'
      return !(i.menuItem._id === id && (!isWings || i.sauce === (sauce ?? i.sauce)))
    }))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch {}
  }, [items])

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, updateSauce, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}