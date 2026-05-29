import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { formatRupiah, PAYMENT_STATUS } from '../data/dummy'
import { Alert, Spinner, StatusBadge } from '../components/UI'
import api from '../services/api'

export default function PembayaranPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(state?.order || null)
  const [loading, setLoading] = useState(!state?.order)
  const [payLoading, setPayLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snapLoaded, setSnapLoaded] = useState(false)

  // Load Midtrans Snap script
  useEffect(() => {
    if (window.snap) { setSnapLoaded(true); return }
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'your_client_key')
    script.onload = () => setSnapLoaded(true)
    document.head.appendChild(script)
    return () => { /* don't remove - keep for session */ }
  }, [])

  useEffect(() => {
    if (!order && !state?.orderId) { navigate('/'); return }
    if (!order && state?.orderId) {
      api.get(`/orders/${state.orderId}`)
        .then(r => setOrder(r.data))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false))
    }
  }, [order, state, navigate])

  const handlePay = async () => {
    if (!snapLoaded) { setError('Payment gateway belum siap. Tunggu sebentar.'); return }
    setPayLoading(true)
    setError(null)
    try {
      const res = await api.post('/payments/create', { order_id: order.id })
      const { snap_token } = res.data

      window.snap.pay(snap_token, {
        onSuccess: async (result) => {
          await api.post('/payments/webhook', { ...result, order_id: order.id })
          navigate('/riwayat', { state: { success: true } })
        },
        onPending: (result) => {
          navigate('/riwayat', { state: { pending: true } })
        },
        onError: (result) => {
          setError('Pembayaran gagal. Silakan coba lagi.')
          setPayLoading(false)
        },
        onClose: () => {
          setPayLoading(false)
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat halaman pembayaran.')
      setPayLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-96 flex items-center justify-center">
      <Spinner size="xl" />
    </div>
  )

  if (!order) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-ocean-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💳</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Selesaikan Pembayaran</h1>
        <p className="text-slate-500 text-sm mt-1">Pesanan #{order.order_number || order.id} menunggu pembayaran</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-5" />}

      <div className="card p-6 mb-5">
        {/* Order Summary */}
        <h2 className="font-semibold text-slate-900 mb-4">Detail Pesanan</h2>
        <div className="space-y-3 mb-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-800">{item.name || item.product_name}</p>
                <p className="text-xs text-slate-500">{item.quantity?.toLocaleString('id-ID')} ekor × {formatRupiah(item.price)}</p>
              </div>
              <p className="text-sm font-semibold text-slate-800">{formatRupiah(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium">{formatRupiah(order.subtotal || order.total_amount - (order.shipping_cost || 50000))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Ongkir</span>
            <span className="font-medium">{formatRupiah(order.shipping_cost || 50000)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
            <span>Total Pembayaran</span>
            <span className="text-primary-700 text-lg">{formatRupiah(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card p-5 mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1">Status Pembayaran</p>
          <StatusBadge status={order.payment_status || 'pending'} map={PAYMENT_STATUS} />
        </div>
        <p className="text-xs text-slate-400">ID: {order.id}</p>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
        <p className="text-sm font-semibold text-slate-800 mb-3">Metode Pembayaran Tersedia</p>
        <div className="flex flex-wrap gap-2">
          {['BCA', 'Mandiri', 'BNI', 'BRI', 'QRIS', 'GoPay', 'OVO', 'ShopeePay', 'Alfamart'].map(m => (
            <span key={m} className="text-xs bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{m}</span>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">Pembayaran diproses oleh Midtrans (secure & terpercaya)</p>
      </div>

      {/* Pay Button */}
      {(order.payment_status === 'pending' || !order.payment_status) && (
        <button
          onClick={handlePay}
          disabled={payLoading || !snapLoaded}
          className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3"
        >
          {payLoading ? (
            <><Spinner size="sm" color="white" /> Membuka Pembayaran...</>
          ) : !snapLoaded ? (
            <><Spinner size="sm" color="white" /> Memuat Gateway...</>
          ) : (
            <>💳 Bayar Sekarang — {formatRupiah(order.total_amount)}</>
          )}
        </button>
      )}

      {order.payment_status === 'settlement' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
          <p className="text-green-700 font-semibold text-lg">✅ Pembayaran Berhasil!</p>
          <p className="text-green-600 text-sm mt-1">Pesanan Anda sedang diproses.</p>
        </div>
      )}

      <div className="text-center mt-4">
        <Link to="/riwayat" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
          Lihat Semua Pesanan →
        </Link>
      </div>
    </div>
  )
}
