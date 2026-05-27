import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { DUMMY_PRODUCTS, CATEGORIES, formatRupiah } from '../data/dummy'
import api from '../services/api'

const SORTS = [
  { value: 'default',    label: 'Terpopuler' },
  { value: 'price_asc',  label: 'Harga: Rendah → Tinggi' },
  { value: 'price_desc', label: 'Harga: Tinggi → Rendah' },
  { value: 'rating',     label: 'Rating Terbaik' },
]

export default function KatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua')
  const [sort, setSort] = useState('default')

  useEffect(() => {
    api.get('/products')
      .then(r => setProducts(r.data?.length ? r.data : DUMMY_PRODUCTS))
      .catch(() => setProducts(DUMMY_PRODUCTS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = [...products]
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (category !== 'Semua') list = list.filter(p => p.category === category)
    if (sort === 'price_asc')  list.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating)
    return list
  }, [products, search, category, sort])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        color: '#fff',
        padding: '4rem 0 3.5rem',
      }}>
        <div className="container">
          {/* FIX: pakai class CSS murni, jangan campur className grid dengan style display:grid */}
          <div className="grid-hero">

            {/* Kiri — teks */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 9999, padding: '0.35rem 0.875rem',
                fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
                4 Varietas Unggulan Tersedia
              </div>

              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1rem' }}>
                Benih Ikan Nila<br />
                <span style={{ color: '#93c5fd' }}>Premium</span> Terpercaya
              </h1>

              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#bfdbfe', maxWidth: '30rem', marginBottom: '1.75rem' }}>
                Supplier benih ikan nila unggul bersertifikat SNI. Tersedia 3 variasi ukuran,
                stok terjamin, dan pengiriman ke seluruh Indonesia dengan kemasan oksigenasi.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="#produk" className="btn-white">Lihat Produk →</a>
                <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="btn-wa">
                  💬 Hubungi via WA
                </a>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap' }}>
                {[['4+', 'Varietas'], ['≥90%', 'Survival Rate'], ['10rb+', 'Pelanggan']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '0.25rem' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanan — cards info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignContent: 'start' }}>
              {[
                { icon: '🧬', title: 'Genetik Unggul', desc: 'Seleksi 6+ generasi' },
                { icon: '📋', title: 'Bersertifikat SNI', desc: 'BBPBAT tersertifikasi' },
                { icon: '🛡️', title: 'Garansi Survival', desc: 'Min. 85% atau ganti' },
                { icon: '🚚', title: 'Kirim Nasional', desc: 'Kemasan oksigenasi' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '0.75rem', padding: '1rem',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#bfdbfe' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          {/* FIX: pakai class grid-trust + trust-item dari CSS, bukan inline style konflik */}
          <div className="grid-trust">
            {[
              ['🚚', 'Pengiriman Nasional', 'Dikemas dengan oksigenasi'],
              ['🧬', 'Benih Bersertifikat', 'SNI & BBPBAT resmi'],
              ['🛡️', 'Garansi Survival Rate', 'Min 85% atau ganti'],
              ['📞', 'Konsultasi Gratis', 'Support teknis budidaya'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="trust-item">
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRODUK ═══════════════ */}
      <section id="produk" style={{ padding: '3rem 0', background: '#f8fafc' }}>
        <div className="container">

          {/* Heading */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="section-heading">Katalog Benih Ikan Nila</h2>
            <p className="section-sub">
              {filtered.length} produk tersedia · Setiap produk hadir dalam 3 variasi ukuran
            </p>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Cari benih nila..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} className="input" style={{ flex: '0 0 auto', width: 'auto', minWidth: 200, cursor: 'pointer' }}>
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: 4 }} className="scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 9999,
                  fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
                  border: '1.5px solid',
                  borderColor: category === cat ? '#2563eb' : '#e2e8f0',
                  background: category === cat ? '#2563eb' : '#fff',
                  color: category === cat ? '#fff' : '#475569',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid produk — FIX: pakai class grid-products */}
          {loading ? (
            <div className="grid-products">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ height: 200, background: '#e2e8f0', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[70, 55, 90, 100, 70].map((w, j) => (
                      <div key={j} style={{ height: j === 3 ? 34 : 12, background: '#e2e8f0', borderRadius: 6, width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#334155' }}>Produk tidak ditemukan</p>
              <p style={{ color: '#94a3b8', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Coba kata kunci atau filter lain</p>
              <button onClick={() => { setSearch(''); setCategory('Semua') }} className="btn-outline">Reset Filter</button>
            </div>
          ) : (
            <div className="grid-products">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Info harga variasi */}
          <div style={{
            marginTop: '2rem', padding: '1.25rem 1.5rem',
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem',
          }}>
            <p style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.9rem', marginBottom: '0.875rem' }}>
              📏 Panduan Harga Variasi Ukuran
            </p>
            {/* FIX: pakai class grid-harga */}
            <div className="grid-harga">
              {[
                { ukuran: '2–3 cm', harga: 'Rp 100/ekor', note: 'Pendederan awal, kolam besar' },
                { ukuran: '3–4 cm', harga: 'Rp 300/ekor', note: 'Benih siap tebar di kolam' },
                { ukuran: '4–5 cm', harga: 'Rp 500/ekor', note: 'Optimal untuk pembesaran' },
              ].map(({ ukuran, harga, note }) => (
                <div key={ukuran} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: '#fff', borderRadius: '0.625rem', padding: '0.75rem 1rem',
                  border: '1px solid #bfdbfe',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '0.5rem',
                    background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.7rem', color: '#1d4ed8', flexShrink: 0,
                  }}>{ukuran}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{ukuran}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2563eb' }}>{harga}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TENTANG ═══════════════ */}
      <section id="tentang" style={{ padding: '4rem 0', background: '#fff' }}>
        <div className="container">
          {/* FIX: pakai class grid-tentang */}
          <div className="grid-tentang">

            {/* Kiri — teks */}
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb', marginBottom: '0.75rem' }}>
                Tentang Kami
              </p>
              <h2 className="section-heading" style={{ marginBottom: '1.25rem' }}>Nila Prima Farm</h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#475569', marginBottom: '1rem' }}>
                Nila Prima Farm adalah perusahaan supplier benih ikan nila premium terpercaya yang telah berpengalaman
                sejak 2010. Kami telah melayani ribuan pembudidaya dari skala rumahan hingga tambak komersial berskala besar.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#475569', marginBottom: '1rem' }}>
                Kami senantiasa memastikan kualitas genetik benih kami adalah yang terbaik, berdasarkan
                program pemuliaan berkelanjutan dan <strong>Sertifikasi SNI dari BBPBAT</strong>.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#475569', marginBottom: '1.75rem' }}>
                Nila Prima Farm melayani pemesanan <strong>dari seluruh Indonesia</strong> dengan sistem
                pengiriman oksigenasi untuk menjaga keselamatan benih selama perjalanan.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="btn-wa">
                  💬 Hubungi Kami
                </a>
                <a href="#produk" className="btn-outline">Lihat Produk</a>
              </div>
            </div>

            {/* Kanan — gambar + card komitmen */}
            {/* FIX: tentang-img-wrapper agar floating card tidak bikin overflow */}
            <div className="tentang-img-wrapper">
              <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Oreochromis_niloticus.jpg/640px-Oreochromis_niloticus.jpg"
                  alt="Ikan Nila Nila Prima Farm"
                  style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Oreochromis-niloticus-whole.jpg/640px-Oreochromis-niloticus-whole.jpg' }}
                />
              </div>
              {/* Floating card — dalam container wrapper sehingga tidak overflow */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                background: '#fff', borderRadius: '0.875rem', padding: '1.25rem 1.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0',
                maxWidth: 240,
              }}>
                <p style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  🏆 Komitmen Kami
                </p>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
                  Kami berkomitmen memberikan benih terbaik dengan garansi survival rate minimal 85% untuk setiap pengiriman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ KEUNGGULAN ═══════════════ */}
      <section id="keunggulan" style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2563eb', marginBottom: '0.5rem' }}>
              Keunggulan Kami
            </p>
            <h2 className="section-heading">Mengapa Pilih Nila Prima Farm?</h2>
            <p className="section-sub" style={{ maxWidth: 520, margin: '0.5rem auto 0' }}>
              Kami hadir dengan standar kualitas tertinggi untuk mendukung keberhasilan usaha budidaya Anda.
            </p>
          </div>

          {/* FIX: pakai class grid-keunggulan */}
          <div className="grid-keunggulan">
            {[
              { icon: '🧬', title: 'Genetik Unggulan', desc: 'Benih hasil seleksi ketat 6+ generasi dengan program pemuliaan modern dan berkelanjutan.' },
              { icon: '🌊', title: 'Air Pegunungan Bersih', desc: 'Sumber air dari mata air pegunungan alami, bebas polutan dan patogen berbahaya.' },
              { icon: '📋', title: 'Bersertifikat Resmi', desc: 'Tersertifikasi SNI dan BBPBAT dengan dokumentasi lengkap yang bisa diverifikasi.' },
              { icon: '🚀', title: 'Pertumbuhan Cepat', desc: 'FCR efisien 1.0–1.4, masa panen lebih singkat, biaya pakan jauh lebih hemat.' },
              { icon: '🛡️', title: 'Tahan Penyakit', desc: 'Imunitas superior terhadap penyakit umum budidaya ikan nila, survival rate ≥ 90%.' },
              { icon: '📦', title: 'Kemasan Oksigenasi', desc: 'Sistem oksigen terlarut berteknologi tinggi, aman dikirim ke seluruh Indonesia.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ KONTAK / CTA ═══════════════ */}
      <section id="kontak" style={{ padding: '4rem 0', background: '#1e3a8a', color: '#fff' }}>
        <div className="container">
          {/* FIX: pakai class grid-kontak */}
          <div className="grid-kontak">

            {/* Kiri */}
            <div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, marginBottom: '1rem' }}>
                Siap Mulai Budidaya Lebih Menguntungkan?
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#bfdbfe', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Hubungi tim ahli kami untuk konsultasi gratis mengenai pilihan benih yang tepat untuk kolam dan target produksi Anda.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href="https://wa.me/628123456789" target="_blank" rel="noreferrer" className="btn-wa">
                  💬 WhatsApp Sekarang
                </a>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  border: '2px solid rgba(255,255,255,0.35)', color: '#fff',
                  padding: '0.6rem 1.4rem', borderRadius: '0.5rem',
                  fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Daftar Gratis →
                </Link>
              </div>
            </div>

            {/* Kanan — info kontak */}
            {/* FIX: pakai class grid-kontak-info */}
            <div className="grid-kontak-info">
              {[
                { icon: '📍', title: 'Alamat', val: 'Jl. Raya Budidaya No.12, Bogor, Jawa Barat' },
                { icon: '📞', title: 'Telepon/WA', val: '+62 812-3456-7890' },
                { icon: '✉️', title: 'Email', val: 'info@nilaprimafarm.id' },
                { icon: '🕐', title: 'Jam Operasional', val: 'Senin–Sabtu 08.00–17.00 WIB' },
              ].map(({ icon, title, val }) => (
                <div key={title} style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.75rem', padding: '1rem',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>{icon}</div>
                  <div style={{ fontSize: '0.72rem', color: '#93c5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>{title}</div>
                  <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
