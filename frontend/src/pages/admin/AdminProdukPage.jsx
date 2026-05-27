import { useState, useEffect } from 'react'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { DUMMY_PRODUCTS, formatRupiah } from '../../data/dummy'
import { LoadingPage, Modal, Alert, Spinner } from '../../components/UI'
import api from '../../services/api'

const EMPTY_FORM = { name: '', category: 'Standard', size: '', price: '', stock: '', description: '', tags: '' }

export default function AdminProdukPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data.length ? res.data : DUMMY_PRODUCTS)
    } catch { setProducts(DUMMY_PRODUCTS) }
    finally { setLoading(false) }
  }

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setModal(true) }
  const openEdit = (p) => {
    setEditProduct(p)
    setForm({ name: p.name, category: p.category, size: p.size, price: p.price, stock: p.stock, description: p.description || '', tags: p.tags?.join(',') || '' })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      setAlert({ type: 'error', message: 'Nama, harga, dan stok wajib diisi.' }); return
    }
    setSaving(true)
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, payload)
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...payload } : p))
        setAlert({ type: 'success', message: 'Produk berhasil diperbarui.' })
      } else {
        const res = await api.post('/products', payload)
        setProducts(prev => [...prev, res.data])
        setAlert({ type: 'success', message: 'Produk baru berhasil ditambahkan.' })
      }
      setModal(false)
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan produk.' })
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return
    setDeleteId(id)
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
      setAlert({ type: 'success', message: 'Produk berhasil dihapus.' })
    } catch {
      setAlert({ type: 'error', message: 'Gagal menghapus produk.' })
    } finally { setDeleteId(null) }
  }

  if (loading) return <LoadingPage />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Kelola Produk</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} produk terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <PlusIcon className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Produk', 'Kategori', 'Ukuran', 'Harga', 'Stok', 'Aksi'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-10 rounded-lg object-cover shrink-0" />
                      <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">{p.category}</span></td>
                  <td className="px-5 py-4"><span className="text-sm text-slate-600">{p.size}</span></td>
                  <td className="px-5 py-4"><span className="text-sm font-bold text-slate-900">{formatRupiah(p.price)}</span></td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-semibold ${p.stock < 5000 ? 'text-red-600' : 'text-green-600'}`}>
                      {p.stock?.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-500 hover:text-primary-600 transition-colors">
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={deleteId === p.id} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Modal open={modal} onClose={() => setModal(false)} title={editProduct ? 'Edit Produk' : 'Tambah Produk Baru'} maxW="max-w-xl">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Produk *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Benih Nila ..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field cursor-pointer">
                {['Standard', 'Premium', 'Super Premium'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ukuran Benih</label>
              <input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className="input-field" placeholder="3-5 cm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga/ekor (Rp) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" placeholder="850" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok (ekor) *</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" placeholder="50000" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input-field resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (pisah dengan koma)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="input-field" placeholder="premium, best-seller" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="btn-outline flex-1">Batal</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <><Spinner size="sm" color="white" /> Menyimpan...</> : 'Simpan Produk'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
