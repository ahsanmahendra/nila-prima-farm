import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../data/dummy'
import { QuantityCounter, EmptyState, LoadingPage } from '../components/UI'

export default function KeranjangPage() {
  const { cart, loading, totalPrice, updateCart, removeFromCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [removing, setRemoving] = useState(null)

  const handleRemove = async (itemId) => {
    setRemoving(itemId)
    try { await removeFromCart(itemId) }
    finally { setRemoving(null) }
  }

  const handleQuantity = async (itemId, qty) => {
    if (qty < 10) return
    await updateCart(itemId, qty)
  }

  if (!user) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <EmptyState
        icon={<span className="text-3xl">🛒</span>}
        title="Masuk untuk Melihat Keranjang"
        description="Silakan login untuk mengelola keranjang belanja Anda."
        action={<Link to="/login" className="btn-primary">Masuk Sekarang</Link>}
      />
    </div>
  )

  if (loading) return <LoadingPage />

  if (cart.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <EmptyState
        icon={<span className="text-4xl">🛒</span>}
        title="Keranjang Masih Kosong"
        description="Tambahkan benih ikan nila favorit Anda ke keranjang."
        action={<Link to="/" className="btn-primary">Mulai Belanja</Link>}
      />
    </div>
  )

  const shipping = 50000
  const grandTotal = totalPrice + shipping

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="section-title mb-8">Keranjang Belanja</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className={`card p-4 flex gap-4 items-start transition-opacity ${removing === item.id ? 'opacity-50' : ''}`}>
              <Link to={`/produk/${item.product_id}`} className="shrink-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=120&h=90&fit=crop'}
                  alt={item.name}
                  className="w-24 h-20 object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/produk/${item.product_id}`} className="font-semibold text-slate-900 hover:text-primary-600 transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{item.size && `Ukuran: ${item.size}`}</p>
                <p className="text-primary-600 font-semibold text-sm mt-1">{formatRupiah(item.price)}/ekor</p>

                <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                  <QuantityCounter
                    value={item.quantity}
                    onChange={(q) => handleQuantity(item.id, q)}
                    min={10}
                    max={item.stock || 99999}
                    size="sm"
                  />
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-slate-900">{formatRupiah(item.price * item.quantity)}</p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={removing === item.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-5">Ringkasan Pesanan</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal ({cart.length} produk)</span>
                <span className="font-semibold text-slate-800">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Estimasi Ongkir</span>
                <span className="font-semibold text-slate-800">{formatRupiah(shipping)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg text-primary-700">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-3.5 text-base"
            >
              Lanjut ke Checkout →
            </button>

            <Link to="/" className="block text-center text-sm text-slate-500 hover:text-primary-600 mt-3 transition-colors">
              ← Lanjut Belanja
            </Link>

            {/* Info */}
            <div className="mt-5 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              🚚 Kemasan oksigenasi untuk keamanan pengiriman benih jarak jauh.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
