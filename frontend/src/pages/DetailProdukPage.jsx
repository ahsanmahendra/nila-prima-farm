import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { DUMMY_PRODUCTS, formatRupiah } from '../data/dummy'
import api from '../services/api'

// Gambar ikan nila per ID — sama dengan ProductCard
const IMGS = {
  1: '/products/nila-nirwana4.jpg',
  2: '/products/nila-kekar.jpg',
  3: '/products/nila-gesit.jpg',
  4: '/products/nila-blackprima.jpg',
}
const FALLBACK = IMGS[1]

const TAG_STYLE = {
  'best-seller':  { label: '🔥 Best Seller',   bg: '#fef3c7', color: '#92400e' },
  'new':          { label: '✨ Baru',           bg: '#d1fae5', color: '#065f46' },
  'popular':      { label: '⭐ Populer',        bg: '#dbeafe', color: '#1e40af' },
  'super-premium':{ label: '💎 Super Premium',  bg: '#ede9fe', color: '#4c1d95' },
  'premium':      { label: '🏆 Premium',        bg: '#e0e7ff', color: '#3730a3' },
  'hemat':        { label: '💰 Hemat',          bg: '#ccfbf1', color: '#134e4a' },
  'ekspor':       { label: '🌏 Ekspor',         bg: '#ffe4e6', color: '#9f1239' },
}

function StarRow({ rating, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 20 20"
            fill={i < Math.round(rating) ? '#f59e0b' : '#e2e8f0'}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#374151' }}>{rating}</span>
      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>({count} ulasan)</span>
    </div>
  )
}

export default function DetailProdukPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [selectedVariant, setVariant] = useState(null)
  const [qty, setQty]                 = useState(100)
  const [adding, setAdding]           = useState(false)
  const [added, setAdded]             = useState(false)
  const [alert, setAlert]             = useState(null) // { type, msg }
  const [imgErr, setImgErr]           = useState(false)

  useEffect(() => {
  setLoading(true)

  const found = DUMMY_PRODUCTS.find(
    p => p.id === parseInt(id)
  )

  setProduct(found || null)
  setVariant(found?.variants?.[0] || null)

  setLoading(false)
}, [id])

  const handleAdd = async () => {
  if (!user) {
    navigate('/login')
    return false
  }

  setAdding(true)

  try {
    await addToCart({
  product_id: product.id,
  quantity: qty,
  size: selectedVariant?.size,
  price: selectedVariant?.price || product.price
})

    setAdded(true)

    setAlert({
      type: 'success',
      msg: `${qty.toLocaleString('id-ID')} ekor ${product.name} berhasil ditambahkan!`
    })

    setTimeout(() => {
      setAdded(false)
      setAlert(null)
    }, 3000)

    return true

  } catch (err) {
    console.error(err)

    setAlert({
      type: 'error',
      msg: 'Gagal menambahkan ke keranjang.'
    })

    return false
  } finally {
    setAdding(false)
  }
}

  const handleBuy = async () => {
  const success = await handleAdd()

  if (success) {
    navigate('/keranjang')
  }
}

  // ── Loading skeleton ──
  if (loading) return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div style={{ background: '#e2e8f0', borderRadius: '1rem', height: 400, animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[30, 60, 40, 80, 60].map((w, i) => (
            <div key={i} style={{ height: i === 1 ? 28 : 16, background: '#e2e8f0', borderRadius: 8, width: `${w}%`, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      </div>
    </div>
  )

  // ── Tidak ditemukan ──
  if (!product) return (
    <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐟</div>
      <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: '#334155', marginBottom: '0.5rem' }}>
        Produk tidak ditemukan
      </h2>
      <Link to="/" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
        ← Kembali ke Katalog
      </Link>
    </div>
  )

  const imgSrc = imgErr ? FALLBACK : (IMGS[product.id] || FALLBACK)
  const variants = product.variants || []
  const activePrice = selectedVariant?.price ?? product.price
  const totalPrice = activePrice * qty

  return (
    <div style={{ background: '#f8fafc', minHeight: '60vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
            onMouseLeave={e => e.target.style.textDecoration = 'none'}
          >Katalog</Link>
          <span>/</span>
          <span style={{ color: '#475569', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Alert */}
        {alert && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
            background: alert.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${alert.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: alert.type === 'success' ? '#166534' : '#991b1b',
            fontWeight: 600, fontSize: '0.875rem',
          }}>
            {alert.type === 'success' ? '✅' : '❌'} {alert.msg}
            <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit', opacity: 0.6 }}>✕</button>
          </div>
        )}

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}
          className="flex flex-col lg:grid">

          {/* ── Kiri: Gambar ── */}
          <div>
            <div style={{
              borderRadius: '1rem', overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              background: '#fff',
            }}>
              <img
                src={imgSrc}
                alt={product.name}
                onError={() => setImgErr(true)}
                style={{ width: '100%', height: 420, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
            </div>

            {/* Tags di bawah gambar */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.875rem' }}>
              {product.tags?.map(tag => {
                const ts = TAG_STYLE[tag]
                return ts ? (
                  <span key={tag} style={{
                    background: ts.bg, color: ts.color,
                    padding: '0.25rem 0.75rem', borderRadius: 9999,
                    fontSize: '0.78rem', fontWeight: 700,
                  }}>{ts.label}</span>
                ) : null
              })}
            </div>
          </div>

          {/* ── Kanan: Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Kategori + Nama + Rating */}
            <div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: '#2563eb',
              }}>{product.category}</span>
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, margin: '0.375rem 0 0.625rem' }}>
                {product.name}
              </h1>
              <StarRow rating={product.rating} count={product.review_count} />
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.5rem' }}>
                📦 Stok tersedia: <strong style={{ color: '#1e293b' }}>{product.stock?.toLocaleString('id-ID')} ekor</strong>
                {product.sold > 0 && <span style={{ marginLeft: '0.875rem' }}>✅ {product.sold?.toLocaleString('id-ID')} terjual</span>}
              </p>
            </div>

            {/* Kotak harga */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              border: '1px solid #bfdbfe', borderRadius: '0.875rem',
              padding: '1.125rem 1.25rem',
            }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginBottom: '0.25rem' }}>Harga per ekor</p>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#1d4ed8', lineHeight: 1 }}>{formatRupiah(activePrice)}</p>
              {qty > 1 && (
                <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
                  Total <strong style={{ color: '#1e293b' }}>{qty.toLocaleString('id-ID')} ekor</strong>:{' '}
                  <strong style={{ color: '#1d4ed8' }}>{formatRupiah(totalPrice)}</strong>
                </p>
              )}
            </div>

            {/* Pilih ukuran */}
            {variants.length > 0 && (
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                  Pilih Ukuran Benih:
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  {variants.map(v => {
                    const active = selectedVariant?.size === v.size
                    return (
                      <button
                        key={v.size}
                        onClick={() => setVariant(v)}
                        style={{
                          padding: '0.625rem 1.125rem', borderRadius: '0.625rem',
                          border: `2px solid ${active ? '#2563eb' : '#e2e8f0'}`,
                          background: active ? '#eff6ff' : '#fff',
                          color: active ? '#1d4ed8' : '#475569',
                          fontWeight: 700, fontSize: '0.875rem',
                          cursor: 'pointer', transition: 'all 0.15s',
                          textAlign: 'center', minWidth: 90,
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = '#93c5fd' }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = '#e2e8f0' }}
                      >
                        <div>{v.size}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: active ? '#2563eb' : '#94a3b8', marginTop: 2 }}>
                          {formatRupiah(v.price)}/ekor
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Jumlah */}
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '0.625rem' }}>
                Jumlah (ekor):
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setQty(q => Math.max(10, q - 100))}
                  style={{
                    width: 38, height: 38, borderRadius: '0.5rem',
                    border: '1.5px solid #e2e8f0', background: '#fff',
                    fontWeight: 700, fontSize: '1.2rem', color: '#374151',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>−</button>
                <input
                  type="number"
                  value={qty}
                  min={10}
                  max={product.stock || 99999}
                  onChange={e => setQty(Math.max(10, Math.min(product.stock || 99999, parseInt(e.target.value) || 10)))}
                  style={{
                    width: 90, height: 38, textAlign: 'center', fontWeight: 700,
                    fontSize: '0.95rem', border: '1.5px solid #e2e8f0',
                    borderRadius: '0.5rem', outline: 'none',
                    fontFamily: 'Inter, sans-serif', color: '#1e293b',
                  }}
                />
                <button
                  onClick={() => setQty(q => Math.min(product.stock || 99999, q + 100))}
                  style={{
                    width: 38, height: 38, borderRadius: '0.5rem',
                    border: '1.5px solid #e2e8f0', background: '#fff',
                    fontWeight: 700, fontSize: '1.2rem', color: '#374151',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>+</button>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginLeft: '0.25rem' }}>Min. 10 ekor</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleAdd}
                disabled={adding || product.stock === 0}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.875rem', borderRadius: '0.625rem', border: 'none',
                  background: added ? '#16a34a' : '#2563eb',
                  color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  transition: 'background 0.15s', opacity: adding ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!added && !adding) e.currentTarget.style.background = '#1d4ed8' }}
                onMouseLeave={e => { if (!added) e.currentTarget.style.background = adding ? '#2563eb' : added ? '#16a34a' : '#2563eb' }}
              >
                <ShoppingCartIcon style={{ width: 18, height: 18 }} />
                {adding ? 'Menambahkan...' : added ? '✓ Ditambahkan!' : 'Tambah ke Keranjang'}
              </button>
              <button
                onClick={handleBuy}
                disabled={adding}
                style={{
                  flex: 1, padding: '0.875rem', borderRadius: '0.625rem',
                  border: '2px solid #2563eb', background: '#fff',
                  color: '#2563eb', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                Beli Sekarang
              </button>
            </div>

            {/* Spesifikasi */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: '0.875rem', padding: '1.125rem',
              }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.875rem' }}>
                  📊 Spesifikasi Benih
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} style={{
                      background: '#f8fafc', borderRadius: '0.5rem',
                      padding: '0.625rem 0.75rem', border: '1px solid #f1f5f9',
                    }}>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginTop: '0.125rem' }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deskripsi */}
            {product.description && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.125rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.625rem' }}>
                  📝 Deskripsi Produk
                </p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: '#64748b' }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Jaminan */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem',
              padding: '1rem', background: '#f0fdf4', borderRadius: '0.75rem', border: '1px solid #bbf7d0',
            }}>
              {[
                ['🛡️', 'Garansi Survival', 'Min. 85% atau ganti'],
                ['🚚', 'Kirim Nasional', 'Kemasan oksigenasi'],
                ['🧬', 'Benih Bersertifikat', 'SNI & BBPBAT'],
                ['📞', 'Konsultasi Gratis', 'Support teknis'],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.125rem' }}>{icon}</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>{title}</p>
                    <p style={{ fontSize: '0.68rem', color: '#4ade80' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
