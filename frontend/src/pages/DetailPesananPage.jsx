import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { formatRupiah, ORDER_STATUS, PAYMENT_STATUS } from '../data/dummy'
import { StatusBadge, LoadingPage, Alert } from '../components/UI'
import api from '../services/api'

const DUMMY_ORDER = {
  id: 1,
  order_number: 'NPF-20241201-001',
  created_at: '2024-12-01T10:00:00Z',
  status: 'delivered',
  payment_status: 'settlement',
  total_amount: 475000,
  shipping_cost: 50000,
  notes: 'Tolong kemas dengan hati-hati.',
  user: { name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890' },
  shipping_address: { address: 'Jl. Merdeka No. 10', city: 'Bogor', province: 'Jawa Barat', postal_code: '16110' },
  items: [
    { id: 1, name: 'Benih Nila Larasati F6', size: '3-5 cm', quantity: 500, price: 850 },
  ],
  payment: { method: 'Bank Transfer BCA', transaction_id: 'TXN-ABC123', paid_at: '2024-12-01T10:30:00Z' },
}

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STATUS_LABELS = { pending: 'Menunggu', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Selesai' }
const STATUS_ICONS  = { pending: '🕐', processing: '⚙️', shipped: '🚚', delivered: '✅' }

export default function DetailPesananPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data)
      } catch {
        setOrder(DUMMY_ORDER)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleCopy = () => {
    navigator.clipboard.writeText(order.order_number)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <LoadingPage />
  if (!order) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">🔍</div>
      <p className="font-bold text-lg text-slate-800 mb-2">Pesanan tidak ditemukan</p>
      <p className="text-slate-500 mb-6 text-sm">Pesanan dengan ID ini tidak ada atau sudah dihapus.</p>
      <Link to="/riwayat" className="btn-primary">← Kembali ke Riwayat</Link>
    </div>
  )

  const currentStepIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const subtotal = order.total_amount - (order.shipping_cost || 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/riwayat" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-xl text-slate-900">Detail Pesanan</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-slate-500 font-mono">{order.order_number}</p>
            <button onClick={handleCopy} className="text-slate-400 hover:text-primary-600 transition-colors" title="Salin nomor pesanan">
              <ClipboardDocumentIcon className="w-4 h-4" />
            </button>
            {copied && <span className="text-xs text-green-600 font-medium">Tersalin!</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.status} map={ORDER_STATUS} />
          <StatusBadge status={order.payment_status} map={PAYMENT_STATUS} />
        </div>
      </div>

      {/* Tombol bayar kalau masih pending */}
      {order.payment_status === 'pending' && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-amber-800 text-sm">⏳ Menunggu Pembayaran</p>
            <p className="text-xs text-amber-700 mt-0.5">Segera selesaikan pembayaran agar pesanan diproses.</p>
          </div>
          <Link to="/pembayaran" state={{ order }} className="btn-primary text-sm py-2 px-5 shrink-0">
            Bayar Sekarang
          </Link>
        </div>
      )}

      {/* Tracker status */}
      {!isCancelled && (
        <div className="card p-5 mb-5">
          <h2 className="font-semibold text-slate-900 mb-5 text-sm">Status Pesanan</h2>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done    = i <= currentStepIndex
              const current = i === currentStepIndex
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${
                      done ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'
                    } ${current ? 'ring-4 ring-primary-100' : ''}`}>
                      {STATUS_ICONS[step]}
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${done ? 'text-primary-700' : 'text-slate-400'}`}>
                      {STATUS_LABELS[step]}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-1 rounded-full mb-5 ${i < currentStepIndex ? 'bg-primary-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <Alert type="error" message="Pesanan ini telah dibatalkan." className="mb-5" />
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Kiri */}
        <div className="lg:col-span-2 space-y-5">

          {/* Produk */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Produk Dipesan</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={item.id ?? i} className="flex gap-4 items-center bg-slate-50 rounded-xl p-3">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-16 h-14 rounded-lg object-cover shrink-0" />
                    : <div className="w-16 h-14 rounded-lg bg-blue-100 flex items-center justify-center text-2xl shrink-0">🐟</div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    {item.size && <p className="text-xs text-slate-500">Ukuran: {item.size}</p>}
                    <p className="text-xs text-slate-500">{item.quantity?.toLocaleString('id-ID')} ekor × {formatRupiah(item.price)}</p>
                  </div>
                  <p className="font-bold text-slate-900 text-sm shrink-0">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Ringkasan biaya */}
            <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-800">{formatRupiah(subtotal)}</span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ongkos Kirim</span>
                  <span className="font-medium text-slate-800">{formatRupiah(order.shipping_cost)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                <span className="text-slate-900">Total</span>
                <span className="text-primary-700">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Alamat pengiriman */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Alamat Pengiriman</h2>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 space-y-1">
              <p className="font-semibold">{order.user?.name}</p>
              {order.user?.phone && <p className="text-slate-500">{order.user.phone}</p>}
              {order.shipping_address ? (
                <>
                  <p>{order.shipping_address.address}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}</p>
                </>
              ) : (
                <p className="text-slate-400 italic">Alamat tidak tersedia</p>
              )}
            </div>
            {order.notes && (
              <div className="mt-3 bg-amber-50 rounded-xl p-3 text-sm text-amber-800">
                <span className="font-semibold">📝 Catatan: </span>{order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Kanan */}
        <div className="space-y-5">

          {/* Info pembayaran */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Pembayaran</h2>
            <div className="space-y-3">
              {[
                ['Metode', order.payment?.method || '-'],
                ['ID Transaksi', order.payment?.transaction_id || '-'],
                ['Waktu Bayar', order.payment?.paid_at
                  ? new Date(order.payment.paid_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                  : '-'],
              ].map(([label, val]) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 font-mono truncate">{val}</p>
                </div>
              ))}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Status Pembayaran</p>
                <StatusBadge status={order.payment_status} map={PAYMENT_STATUS} />
              </div>
            </div>
          </div>

          {/* Info pesanan */}
          <div className="card p-5 bg-slate-50 border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Info Pesanan</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Pesanan</span>
                <span className="font-mono font-semibold text-slate-800">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal</span>
                <span className="text-slate-700">
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Bantuan */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-2 text-sm">Butuh Bantuan?</h2>
            <p className="text-xs text-slate-500 mb-3">Hubungi kami via WhatsApp untuk pertanyaan seputar pesanan ini.</p>
            <a
              href={`https://wa.me/6285279351500?text=Halo,%20saya%20ingin%20menanyakan%20pesanan%20${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 btn-outline text-sm py-2"
            >
              💬 Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
