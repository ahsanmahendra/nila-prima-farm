import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon, UsersIcon, CubeIcon, CurrencyDollarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { formatRupiah, ORDER_STATUS, PAYMENT_STATUS } from '../../data/dummy'
import { StatusBadge, LoadingPage } from '../../components/UI'
import api from '../../services/api'

const DUMMY_STATS = {
  total_orders: 248,
  total_users: 1342,
  total_products: 6,
  total_revenue: 48750000,
  pending_orders: 12,
  recent_orders: [
    { id: 1, order_number: 'NPF-001', user_name: 'Budi Santoso', total_amount: 425000, status: 'delivered', payment_status: 'settlement', created_at: new Date().toISOString() },
    { id: 2, order_number: 'NPF-002', user_name: 'Sari Dewi', total_amount: 660000, status: 'pending', payment_status: 'pending', created_at: new Date().toISOString() },
    { id: 3, order_number: 'NPF-003', user_name: 'Ahmad Fauzi', total_amount: 1250000, status: 'processing', payment_status: 'settlement', created_at: new Date().toISOString() },
    { id: 4, order_number: 'NPF-004', user_name: 'Rina Marlina', total_amount: 380000, status: 'shipped', payment_status: 'settlement', created_at: new Date().toISOString() },
  ],
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data)
      } catch {
        setStats(DUMMY_STATS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) return <LoadingPage />

  const statCards = [
    { label: 'Total Pesanan', value: stats.total_orders?.toLocaleString('id-ID'), icon: ShoppingBagIcon, color: 'from-primary-500 to-primary-600', sub: `${stats.pending_orders} menunggu` },
    { label: 'Total Pengguna', value: stats.total_users?.toLocaleString('id-ID'), icon: UsersIcon, color: 'from-ocean-500 to-ocean-600', sub: 'terdaftar' },
    { label: 'Total Produk', value: stats.total_products?.toLocaleString('id-ID'), icon: CubeIcon, color: 'from-violet-500 to-violet-600', sub: 'varietas aktif' },
    { label: 'Total Pendapatan', value: formatRupiah(stats.total_revenue), icon: CurrencyDollarIcon, color: 'from-emerald-500 to-emerald-600', sub: 'all time' },
  ]

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Selamat datang di panel admin Nila Prima Farm.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
              <p className="font-display font-bold text-slate-900 text-xl leading-tight">{value}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-900">Pesanan Terbaru</h2>
          <Link to="/admin/pesanan" className="text-xs text-primary-600 font-semibold hover:underline">Lihat semua →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-500 pb-3">No. Pesanan</th>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3">Pelanggan</th>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3 hidden sm:table-cell">Tanggal</th>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3">Total</th>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recent_orders?.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="text-sm font-mono font-medium text-slate-800">{order.order_number}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-slate-700">{order.user_name}</span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm font-semibold text-slate-800">{formatRupiah(order.total_amount)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={order.status} map={ORDER_STATUS} />
                    </div>
                  </td>
                  <td className="py-3">
                    <Link to={`/admin/pesanan/${order.id}`} className="text-xs text-primary-600 font-semibold hover:underline">Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: '📦', title: 'Kelola Produk', desc: 'Tambah, edit, hapus produk', to: '/admin/produk', color: 'from-violet-50 to-violet-100 border-violet-200' },
          { icon: '📋', title: 'Daftar Pesanan', desc: 'Lihat dan update pesanan', to: '/admin/pesanan', color: 'from-primary-50 to-primary-100 border-primary-200' },
          { icon: '👥', title: 'Data Pengguna', desc: 'Kelola akun pengguna', to: '/admin/pengguna', color: 'from-ocean-50 to-ocean-100 border-ocean-200' },
        ].map(({ icon, title, desc, to, color }) => (
          <Link key={to} to={to} className={`card p-5 bg-gradient-to-br ${color} hover:-translate-y-1`}>
            <span className="text-3xl block mb-3">{icon}</span>
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
