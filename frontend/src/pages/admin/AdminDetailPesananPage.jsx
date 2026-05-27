import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { formatRupiah, ORDER_STATUS, PAYMENT_STATUS } from '../../data/dummy'
import { StatusBadge, LoadingPage, Alert } from '../../components/UI'
import api from '../../services/api'

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
    { id: 1, name: 'Benih Nila Larasati F6', size: '3-5 cm', quantity: 500, price: 850, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=80&h=80&fit=crop' },
  ],
  payment: { method: 'Bank Transfer BCA', transaction_id: 'TXN-ABC123', paid_at: '2024-12-01T10:30:00Z' },
}

export default function AdminDetailPesananPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [alert, setAlert] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/admin/orders/${id}`)
        setOrder(res.data)
        setNewStatus(res.data.status)
      } catch {
        setOrder(DUMMY_ORDER)
        setNewStatus(DUMMY_ORDER.status)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleUpdateStatus = async () => {
    if (newStatus === order.status) return
    setUpdating(true)
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus })
      setOrder(prev => ({ ...prev, status: newStatus }))
      setAlert({ type: 'success', message: `Status pesanan berhasil diubah ke: ${ORDER_STATUS[newStatus]?.label}` })
    } catch {
      setAlert({ type: 'error', message: 'Gagal mengubah status pesanan.' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingPage />
  if (!order) return <div className="p-8 text-center text-slate-500">Pesanan tidak ditemukan.</div>

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <Link to="/admin/pesanan" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Detail Pesanan</h1>
          <p className="text-slate-500 text-sm font-mono">{order.order_number}</p>
        </div>
      </div>

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Produk Dipesan</h2>
            <div className="space-y-3">
              {order.items?.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-slate-50 rounded-xl p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">Ukuran: {item.size}</p>
                    <p className="text-xs text-slate-500">{item.quantity?.toLocaleString('id-ID')} ekor × {formatRupiah(item.price)}</p>
                  </div>
                  <p className="font-bold text-slate-900 text-sm shrink-0">{formatRupiah(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatRupiah(order.total_amount - order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Ongkir</span>
                <span className="font-medium">{formatRupiah(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t border-slate-100">
                <span>Total</span>
                <span className="text-primary-700">{formatRupiah(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Alamat Pengiriman</h2>
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 space-y-1">
              <p className="font-semibold">{order.user?.name}</p>
              <p>{order.user?.phone}</p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}</p>
            </div>
            {order.notes && (
              <div className="mt-3 bg-amber-50 rounded-xl p-3 text-sm text-amber-800">
                <span className="font-semibold">Catatan: </span>{order.notes}
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Informasi Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Metode', order.payment?.method || '-'],
                ['ID Transaksi', order.payment?.transaction_id || '-'],
                ['Status', ''],
                ['Waktu Bayar', order.payment?.paid_at ? new Date(order.payment.paid_at).toLocaleString('id-ID') : '-'],
              ].map(([label, val], i) => (
                <div key={label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  {i === 2
                    ? <StatusBadge status={order.payment_status} map={PAYMENT_STATUS} />
                    : <p className="text-sm font-semibold text-slate-800 font-mono truncate">{val}</p>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-3">Pelanggan</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-ocean-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">{order.user?.name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{order.user?.name}</p>
                <p className="text-xs text-slate-500">{order.user?.email}</p>
              </div>
            </div>
            <a href={`https://wa.me/${order.user?.phone}`} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 btn-outline text-sm py-2">
              💬 WhatsApp Pelanggan
            </a>
          </div>

          {/* Status Update */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 mb-1">Update Status</h2>
            <p className="text-xs text-slate-500 mb-3">Status saat ini:</p>
            <StatusBadge status={order.status} map={ORDER_STATUS} />

            <div className="mt-4 space-y-3">
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="input-field text-sm cursor-pointer"
              >
                {Object.entries(ORDER_STATUS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={updating || newStatus === order.status}
                className="w-full btn-primary py-2.5 text-sm disabled:opacity-50"
              >
                {updating ? 'Menyimpan...' : 'Simpan Status'}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="card p-5 bg-slate-50 border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Info Pesanan</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Pesanan</span>
                <span className="font-mono font-semibold text-slate-800">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dibuat</span>
                <span className="text-slate-700">{new Date(order.created_at).toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
