import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { formatRupiah, ORDER_STATUS, PAYMENT_STATUS } from '../data/dummy'
import { StatusBadge, LoadingPage, EmptyState, Alert } from '../components/UI'
import api from '../services/api'

const DUMMY_ORDERS = [
  {
    id: 1,
    order_number: 'NPF-20241201-001',
    created_at: '2024-12-01T10:00:00Z',
    status: 'delivered',
    payment_status: 'settlement',
    total_amount: 425000,
    items: [
      { name: 'Benih Nila Larasati F6', quantity: 500, price: 850 }
    ]
  },
  {
    id: 2,
    order_number: 'NPF-20241210-002',
    created_at: '2024-12-10T14:30:00Z',
    status: 'pending',
    payment_status: 'pending',
    total_amount: 660000,
    items: [
      { name: 'Benih Nila Gesit Plus', quantity: 500, price: 1200 }
    ]
  },
]

export default function RiwayatPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const location = useLocation()
  const [successMsg, setSuccessMsg] = useState(location.state?.success ? 'Pembayaran berhasil! Pesanan Anda sedang diproses.' : null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/orders')
        setOrders(res.data.length ? res.data : DUMMY_ORDERS)
      } catch {
        setOrders(DUMMY_ORDERS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = orders.filter(o => filter === 'all' || o.status === filter)

  if (loading) return <LoadingPage />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="section-title mb-2">Riwayat Pesanan</h1>
      <p className="text-slate-500 text-sm mb-6">{orders.length} total pesanan</p>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} className="mb-5" />}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {[
          ['all', 'Semua'],
          ['pending', 'Menunggu'],
          ['processing', 'Diproses'],
          ['shipped', 'Dikirim'],
          ['delivered', 'Selesai'],
          ['cancelled', 'Dibatalkan'],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              filter === val ? 'bg-primary-600 text-white shadow-btn' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<span className="text-4xl">📋</span>}
          title="Belum Ada Pesanan"
          description="Pesanan Anda akan muncul di sini setelah berbelanja."
          action={<Link to="/" className="btn-primary">Mulai Belanja</Link>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div key={order.id} className="card p-5 hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{order.order_number}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={order.status} map={ORDER_STATUS} />
                  <StatusBadge status={order.payment_status} map={PAYMENT_STATUS} />
                </div>
              </div>

              {/* Items preview */}
              <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                {order.items?.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-700 font-medium">{item.name}</span>
                    <span className="text-slate-500">{item.quantity?.toLocaleString('id-ID')} ekor × {formatRupiah(item.price)}</span>
                  </div>
                ))}
                {order.items?.length > 2 && (
                  <p className="text-xs text-slate-400">+{order.items.length - 2} produk lainnya</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Pembayaran</p>
                  <p className="font-bold text-primary-700">{formatRupiah(order.total_amount)}</p>
                </div>
                <div className="flex gap-2">
                  {order.payment_status === 'pending' && (
                    <Link to="/pembayaran" state={{ order }} className="btn-primary text-xs py-2 px-4">
                      Bayar Sekarang
                    </Link>
                  )}
                  <Link to={`/riwayat/${order.id}`} className="btn-outline text-xs py-2 px-4">
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
