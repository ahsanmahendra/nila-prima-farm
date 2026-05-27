import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); setCartCount(0); return }
    try {
      setLoading(true)
      const res = await api.get('/cart')
      setCart(res.data.items || [])
      setCartCount(res.data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0)
    } catch {
      setCart([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (itemData) => {
  const res = await api.post('/cart', itemData)

  await fetchCart()
  return res.data
}

  const updateCart = async (itemId, quantity) => {
    await api.put(`/cart/${itemId}`, { quantity })
    await fetchCart()
  }

  const removeFromCart = async (itemId) => {
    await api.delete(`/cart/${itemId}`)
    await fetchCart()
  }

  const clearCart = () => {
    setCart([])
    setCartCount(0)
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, totalPrice, addToCart, updateCart, removeFromCart, fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export default CartContext
