import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChartBarIcon, ShoppingBagIcon, CubeIcon, UsersIcon,
  Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon, HomeIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: ChartBarIcon },
  { to: '/admin/pesanan', label: 'Pesanan', icon: ShoppingBagIcon },
  { to: '/admin/produk', label: 'Produk', icon: CubeIcon },
  { to: '/admin/ai-insight', label: 'AI Insight', icon: ChartBarIcon },
  { to: '/admin/pengguna', label: 'Pengguna', icon: UsersIcon },
]

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-ocean-500 rounded-xl flex items-center justify-center shadow-btn">
            <span className="text-white font-display font-bold text-sm">NP</span>
          </div>
          <div>
            <p className="font-display font-bold text-slate-900">Admin Panel</p>
            <p className="text-xs text-primary-600 font-medium">Nila Prima Farm</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-primary-600 text-white shadow-btn' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-100 transition-colors">
          <HomeIcon className="w-5 h-5" /> Ke Toko
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
          <ArrowLeftOnRectangleIcon className="w-5 h-5" /> Keluar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-100 fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-10 w-64 bg-white h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-900">
              {navItems.find(n => n.to === location.pathname)?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-ocean-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
