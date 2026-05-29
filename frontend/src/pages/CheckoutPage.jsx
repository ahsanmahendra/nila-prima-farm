import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../data/dummy'
import { Alert, Spinner } from '../components/UI'
import api from '../services/api'
import { lazy, Suspense } from 'react'
const MapPicker = lazy(() => import('../components/MapPicker'))

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    notes: '',
    lat: null,
    lng: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const shipping = 50000
  const grandTotal = totalPrice + shipping

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError('Nama penerima harus diisi minimal 2 karakter.')
      return
    }

    const phoneClean = form.phone.replace(/[\s\-().]/g, '')
    const phoneValid = /^(\+62|62|08)\d{8,12}$/.test(phoneClean)
    if (!phoneClean || !phoneValid) {
      setError('Nomor WhatsApp tidak valid. Contoh: 08123456789')
      return
    }

    if (!form.address.trim() || form.address.trim().length < 10) {
      setError('Alamat lengkap harus diisi minimal 10 karakter.')
      return
    }
    if (!form.city.trim()) {
      setError('Kota / Kabupaten harus diisi.')
      return
    }
    if (!form.province.trim()) {
      setError('Provinsi harus diisi.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/orders', {
        shipping_address: {
          ...form,
          lat: form.lat,
          lng: form.lng,
        },
        items: cart.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
        total_amount: grandTotal,
        shipping_cost: shipping,
      })
      navigate('/pembayaran', { state: { order: res.data } })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pesanan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="section-title mb-8">Checkout</h1>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-6" />}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipient */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                Data Penerima
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Penerima *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Nama lengkap" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">No. WhatsApp *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required type="tel" className="input-field" placeholder="08xxxxxxxxxx" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                Alamat Pengiriman
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat Lengkap *</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="input-field resize-none" placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lokasi di Peta <span className="text-slate-400 font-normal">(opsional)</span></label>
                  <Suspense fallback={<div className="h-72 bg-slate-100 rounded-xl flex items-center justify-center text-sm text-slate-400">Memuat peta...</div>}>
                    <MapPicker
                      lat={form.lat}
                      lng={form.lng}
                      onLocationSelect={(lat, lng) => setForm(f => ({ ...f, lat, lng }))}
                    />
                  </Suspense>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kota / Kabupaten *</label>
                    <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="Contoh: Bogor" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Provinsi *</label>
                    <input name="province" value={form.province} onChange={handleChange} required className="input-field" placeholder="Contoh: Jawa Barat" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Kode Pos</label>
                    <input name="postal_code" value={form.postal_code} onChange={handleChange} className="input-field" placeholder="16XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Catatan (opsional)</label>
                    <input name="notes" value={form.notes} onChange={handleChange} className="input-field" placeholder="Patokan, instruksi khusus..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="card p-6 bg-ocean-50 border-ocean-100">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                Info Pengiriman
              </h2>
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-ocean-100">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Pengiriman Khusus Benih Ikan</p>
                  <p className="text-xs text-slate-500 mt-0.5">Dikemas dengan sistem oksigenasi. Estimasi 1–3 hari. Pengiriman Senin–Jumat.</p>
                  <p className="text-primary-600 font-semibold text-sm mt-1">{formatRupiah(shipping)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-slate-900 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto scrollbar-hide">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=60&h=60&fit=crop'} className="w-12 h-10 rounded-lg object-cover" alt={item.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity?.toLocaleString('id-ID')} ekor</p>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 shrink-0">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Ongkir</span>
                  <span className="font-semibold">{formatRupiah(shipping)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-primary-700">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-base mt-5 flex items-center justify-center gap-2"
              >
                {loading ? <><Spinner size="sm" color="white" /> Memproses...</> : 'Buat Pesanan →'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
