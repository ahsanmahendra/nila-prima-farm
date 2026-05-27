import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/UI'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-ocean-700">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="font-display font-bold">NP</span>
            </div>
            <div>
              <p className="font-display font-bold text-xl">Nila Prima Farm</p>
              <p className="text-xs text-primary-300 tracking-wide">Benih Ikan Nila Premium</p>
            </div>
          </Link>
          <h2 className="font-display font-bold text-4xl leading-tight mb-4">Selamat Datang<br />Kembali!</h2>
          <p className="text-primary-200 max-w-sm leading-relaxed">Masuk untuk mengelola pesanan, lacak pengiriman, dan dapatkan penawaran eksklusif member.</p>
          <div className="mt-10 space-y-4">
            {[['🚀', 'Akses katalog lengkap 6+ varietas'], ['📦', 'Lacak status pesanan real-time'], ['💎', 'Harga spesial untuk member']].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-primary-100">
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-ocean-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">NP</span>
            </div>
            <span className="font-display font-bold text-slate-900">Nila Prima Farm</span>
          </Link>

          <h1 className="font-display font-bold text-2xl text-slate-900 mb-1">Masuk ke Akun</h1>
          <p className="text-slate-500 text-sm mb-7">Belum punya akun? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Daftar gratis</Link></p>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-5" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:underline">Lupa password?</a>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input-field pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Spinner size="sm" color="white" /> Masuk...</> : 'Masuk'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2">Demo Akun:</p>
            <div className="space-y-1 text-xs text-slate-500">
              <p>👤 User: <span className="font-mono">user@demo.com</span> / <span className="font-mono">demo123</span></p>
              <p>👑 Admin: <span className="font-mono">admin@demo.com</span> / <span className="font-mono">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
