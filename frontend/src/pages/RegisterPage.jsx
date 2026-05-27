import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/UI'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm_password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Password tidak cocok.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Visual */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-ocean-800 via-primary-800 to-primary-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=1000&fit=crop" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="font-display font-bold">NP</span>
            </div>
            <div>
              <p className="font-display font-bold text-xl">Nila Prima Farm</p>
              <p className="text-xs text-primary-300">Benih Ikan Nila Premium</p>
            </div>
          </Link>
          <h2 className="font-display font-bold text-4xl leading-tight mb-4">Bergabung dengan<br />Ribuan Pembudidaya</h2>
          <p className="text-primary-200 max-w-sm leading-relaxed">Daftar gratis dan dapatkan akses penuh ke katalog benih premium kami.</p>
          <div className="mt-10 space-y-3">
            {['Daftar 100% gratis', 'Garansi survival rate benih', 'Dukungan teknis budidaya', 'Notifikasi promo eksklusif'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-primary-100">
                <CheckCircleIcon className="w-4 h-4 text-green-400 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-ocean-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">NP</span>
            </div>
            <span className="font-display font-bold text-slate-900">Nila Prima Farm</span>
          </Link>

          <h1 className="font-display font-bold text-2xl text-slate-900 mb-1">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm mb-7">Sudah punya akun? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Masuk di sini</Link></p>

          {error && <Alert type="error" message={error} onClose={() => setError(null)} className="mb-5" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Nama lengkap Anda" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="nama@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">No. WhatsApp</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input-field" placeholder="08xxxxxxxxxx" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} required minLength={6} className="input-field pr-10" placeholder="Min. 6 karakter" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password *</label>
              <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required className="input-field" placeholder="Ulangi password" />
              {form.confirm_password && form.password !== form.confirm_password && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            <p className="text-xs text-slate-400">
              Dengan mendaftar, Anda menyetujui <a href="#" className="text-primary-600 hover:underline">Syarat & Ketentuan</a> dan <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a> kami.
            </p>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" color="white" /> Mendaftar...</> : 'Daftar Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
