import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { formatRupiah, ORDER_STATUS, PAYMENT_STATUS } from '../../data/dummy'
import { StatusBadge, LoadingPage } from '../../components/UI'
import api from '../../services/api'

const DUMMY_ORDERS = [
  { id: 1, order_number: 'NPF-20241201-001', user_name: 'Budi Santoso', user_email: 'budi@email.com', total_amount: 425000, status: 'delivered', payment_status: 'settlement', created_at: '2024-12-01T10:00:00Z', items_count: 1 },
  { id: 2, order_number: 'NPF-20241210-002', user_name: 'Sari Dewi', user_email: 'sari@email.com', total_amount: 660000, status: 'pending', payment_status: 'pending', created_at: '2024-12-10T14:30:00Z', items_count: 2 },
  { id: 3, order_number: 'NPF-20241215-003', user_name: 'Ahmad Fauzi', user_email: 'ahmad@email.com', total_amount: 1250000, status: 'processing', payment_status: 'settlement', created_at: '2024-12-15T09:15:00Z', items_count: 3 },
  { id: 4, order_number: 'NPF-20241218-004', user_name: 'Rina Marlina', user_email: 'rina@email.com', total_amount: 380000, status: 'shipped', payment_status: 'settlement', created_at: '2024-12-18T11:00:00Z', items_count: 1 },
  { id: 5, order_number: 'NPF-20241220-005', user_name: 'Joko Widodo', user_email: 'joko@email.com', total_amount: 900000, status: 'cancelled', payment_status: 'cancel', created_at: '2024-12-20T16:45:00Z', items_count: 2 },
]

export default function AdminPesananPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders')
      setOrders(res.data.length ? res.data : DUMMY_ORDERS)
    } catch {
      setOrders(DUMMY_ORDERS)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch {
      alert('Gagal update status pesanan.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.user_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  if (loading) return <LoadingPage />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Daftar Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} pesanan ditemukan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari no. pesanan atau nama..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input-field text-sm w-auto cursor-pointer"
        >
          <option value="all">Semua Status</option>
          {Object.entries(ORDER_STATUS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['No. Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Pembayaran', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">Tidak ada pesanan ditemukan.</td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-semibold text-slate-800">{order.order_number}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{order.user_name}</p>
                    <p className="text-xs text-slate-400">{order.user_email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-slate-900">{formatRupiah(order.total_amount)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.payment_status} map={PAYMENT_STATUS} />
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer disabled:opacity-50"
                    >
                      {Object.entries(ORDER_STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/admin/pesanan/${order.id}`} className="text-xs font-semibold text-primary-600 hover:underline">
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
