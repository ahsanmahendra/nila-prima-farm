import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Alert, Spinner } from '../components/UI'
import api from '../services/api'

export default function ProfilPage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    province: user?.province || '',
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/profile', form)
      updateUser(res.data.user || form)
      setAlert({ type: 'success', message: 'Profil berhasil diperbarui!' })
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal memperbarui profil.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="section-title mb-8">Profil Saya</h1>

      {/* Avatar card */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-ocean-400 rounded-2xl flex items-center justify-center shadow-btn flex-shrink-0">
          <span className="text-white font-display font-bold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-display font-bold text-xl text-slate-900">{user?.name}</p>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <span className={`badge mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
            {user?.role === 'admin' ? '👑 Administrator' : '🐟 Pembeli'}
          </span>
        </div>
      </div>

      {alert && <Alert {...alert} onClose={() => setAlert(null)} className="mb-5" />}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <h2 className="font-semibold text-slate-900">Edit Profil</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">No. WhatsApp</label>
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="input-field" placeholder="08xxxxxxxxxx" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="input-field resize-none" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kota</label>
            <input name="city" value={form.city} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Provinsi</label>
            <input name="province" value={form.province} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Spinner size="sm" color="white" /> Menyimpan...</> : 'Simpan Perubahan'}
          </button>
        </div>
      </form>

      {/* Email - read only */}
      <div className="card p-5 mt-4 bg-slate-50">
        <p className="text-xs font-medium text-slate-500 mb-1">Email (tidak bisa diubah)</p>
        <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
      </div>
    </div>
  )
}
