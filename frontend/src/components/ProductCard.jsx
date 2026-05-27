import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatRupiah } from '../data/dummy'


const TAG_MAP = {
  'best-seller':   { label: '🔥 Best Seller',   bg: '#fef3c7', color: '#92400e' },
  'new':           { label: '✨ Baru',           bg: '#d1fae5', color: '#065f46' },
  'popular':       { label: '⭐ Populer',        bg: '#dbeafe', color: '#1e40af' },
  'super-premium': { label: '💎 Super Premium',  bg: '#ede9fe', color: '#4c1d95' },
  'premium':       { label: '🏆 Premium',        bg: '#e0e7ff', color: '#3730a3' },
  'hemat':         { label: '💰 Hemat',          bg: '#ccfbf1', color: '#134e4a' },
  'ekspor':        { label: '🌏 Ekspor',         bg: '#ffe4e6', color: '#9f1239' },
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const variants = [
  { size: '2-3 cm', price: 100 },
  { size: '3-4 cm', price: 300 },
  { size: '4-5 cm', price: 500 },
]
  const [sel, setSel] = useState(variants[0])
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const LOCAL_IMAGES = {
  1: '/products/nila-nirwana4.jpg',
  2: '/products/nila-kekar.jpg',
  3: '/products/nila-gesit.jpg',
  4: '/products/nila-blackprima.jpg',
}

const imgSrc =
  product.image ||
  LOCAL_IMAGES[product.id] ||
  '/products/nila-gesit.jpg'

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    setAdding(true)
    try {
      await addToCart(product.id, 100)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch { /* noop */ }
    finally { setAdding(false) }
  }

  const tag = product.tags?.[0]
  const tagStyle = TAG_MAP[tag]

  return (
    <Link to={`/produk/${product.id}`} className="card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>

      {/* Gambar — fixed 200px tinggi */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          loading="lazy"
        />
        {/* Tag */}
        {tagStyle && (
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: tagStyle.bg, color: tagStyle.color,
            fontSize: '0.7rem', fontWeight: 700,
            padding: '0.2rem 0.5rem', borderRadius: '0.375rem',
          }}>{tagStyle.label}</span>
        )}
        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
        >
          <HeartIcon style={{ width: 15, height: 15, color: '#94a3b8' }} />
        </button>
        {/* Stok terbatas */}
        {product.stock < 600 && (
          <span style={{
            position: 'absolute', bottom: 10, left: 10,
            background: '#ef4444', color: '#fff',
            fontSize: '0.68rem', fontWeight: 700,
            padding: '0.2rem 0.5rem', borderRadius: '0.375rem',
          }}>⚡ Stok Terbatas</span>
        )}
      </div>

      {/* Konten */}
      <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>

        {/* Kategori */}
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category}
        </span>

        {/* Nama */}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, margin: 0 }}>
          {product.name}
        </h3>

        {/* Stok & terjual */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
          <span>📦 Stok <strong style={{ color: '#334155' }}>{product.stock?.toLocaleString('id-ID')}</strong> ekor</span>
          {product.sold > 0 && <span>{product.sold?.toLocaleString('id-ID')} terjual</span>}
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill={i < Math.round(product.rating) ? '#f59e0b' : '#e2e8f0'}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>{product.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({product.review_count})</span>
        </div>

        {/* Variant selector */}
        <div onClick={e => { e.preventDefault(); e.stopPropagation() }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', fontWeight: 500 }}>Pilih Ukuran:</div>
          <select
            value={sel.size}
            onChange={e => {
              e.preventDefault()
              e.stopPropagation()
              const v = variants.find(v => v.size === e.target.value)
              if (v) setSel(v)
            }}
            style={{
              width: '100%', padding: '0.5rem 0.75rem',
              fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
              border: '1px solid #cbd5e1', borderRadius: '0.5rem',
              background: '#fff', color: '#374151',
              fontWeight: 600, cursor: 'pointer', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = '#cbd5e1'}
          >
            {variants.map(v => (
              <option key={v.size} value={v.size}>
                {v.size} — {formatRupiah(v.price)}/ekor
              </option>
            ))}
          </select>
        </div>

        {/* Harga & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.25rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>per ekor</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{formatRupiah(sel.price)}</div>
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
              fontSize: '0.8rem', fontWeight: 700,
              background: added ? '#16a34a' : '#2563eb',
              color: '#fff', border: 'none', cursor: 'pointer',
              transition: 'background 0.15s',
              opacity: adding ? 0.7 : 1, flexShrink: 0,
            }}
            onMouseEnter={e => { if (!added) e.currentTarget.style.background = '#1d4ed8' }}
            onMouseLeave={e => { if (!added) e.currentTarget.style.background = '#2563eb' }}
          >
            <ShoppingCartIcon style={{ width: 14, height: 14 }} />
            {adding ? '...' : added ? '✓ Ditambah' : 'Tambah'}
          </button>
        </div>
      </div>
    </Link>
  )
}
