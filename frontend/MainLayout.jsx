import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function MainLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const fn = (e) => { if (!profileRef.current?.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/#produk', label: 'Produk' },
    { to: '/#tentang', label: 'Tentang' },
    { to: '/#kontak', label: 'Kontak' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── TOP BAR ─── */}
      <div style={{ background: '#1e3a8a', color: '#bfdbfe', fontSize: '0.78rem', padding: '0.45rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>📍 Jl. Raya Budidaya No.12, Bogor, Jawa Barat</span>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span>📞 +62 812-3456-7890</span>
            <span>✉️ info@nilaprimafarm.id</span>
          </div>
        </div>
      </div>

      {/* ─── NAVBAR ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, width: '100%',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.2s',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '0.625rem',
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.5px' }}>NP</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.2 }}>Nila Prima Farm</div>
              <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600, lineHeight: 1.2 }}>Benih Ikan Nila Premium</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden lg:flex">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: location.pathname === to ? '#2563eb' : '#475569',
                background: location.pathname === to ? '#eff6ff' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}
                onMouseEnter={e => { if (location.pathname !== to) { e.target.style.color = '#2563eb'; e.target.style.background = '#f8fafc' } }}
                onMouseLeave={e => { if (location.pathname !== to) { e.target.style.color = '#475569'; e.target.style.background = 'transparent' } }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Cart */}
            <Link to="/keranjang" style={{ position: 'relative', padding: '0.5rem', borderRadius: '0.5rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ShoppingCartIcon style={{ width: 22, height: 22 }} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2,
                  minWidth: 18, height: 18,
                  background: '#2563eb', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700,
                  borderRadius: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                }}>{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.75rem', borderRadius: '0.5rem',
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#2563eb', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                  }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden md:block" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </span>
                  <ChevronDownIcon style={{ width: 14, height: 14, color: '#9ca3af', transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'none' }} className="hidden md:block" />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    width: 200, background: '#fff',
                    borderRadius: '0.75rem', border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    zIndex: 200, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    {[
                      ['/profil', '👤', 'Profil Saya'],
                      ['/riwayat', '📋', 'Riwayat Pesanan'],
                      ...(user.role === 'admin' ? [['/admin', '⚙️', 'Admin Panel']] : []),
                    ].map(([to, icon, label]) => (
                      <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 1rem', fontSize: '0.875rem', color: '#374151', transition: 'background 0.15s', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>{icon}</span>{label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '0.375rem 0' }}>
                      <button onClick={() => { logout(); navigate('/') }} style={{
                        width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.625rem 1rem', fontSize: '0.875rem', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span>🚪</span> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                <Link to="/login" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569', textDecoration: 'none', borderRadius: '0.5rem', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.color = '#2563eb'; e.target.style.background = '#f8fafc' }}
                  onMouseLeave={e => { e.target.style.color = '#475569'; e.target.style.background = 'transparent' }}
                >Masuk</Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.125rem' }}>Daftar</Link>
              </div>
            )}

            {/* Hamburger */}
            <button className="lg:hidden" onClick={() => setMobileOpen(v => !v)} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', color: '#475569' }}>
              {mobileOpen ? <XMarkIcon style={{ width: 22, height: 22 }} /> : <Bars3Icon style={{ width: 22, height: 22 }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid #f1f5f9', background: '#fff', padding: '0.75rem 1.5rem 1rem' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', padding: '0.75rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
            {!user ? (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/login" className="btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}>Masuk</Link>
                <Link to="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem' }}>Daftar</Link>
              </div>
            ) : (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                {[['/profil','👤 Profil'],['/riwayat','📋 Riwayat']].map(([to, l]) => (
                  <Link key={to} to={to} style={{ display: 'block', padding: '0.625rem 0.75rem', fontSize: '0.875rem', color: '#374151', textDecoration: 'none', borderRadius: '0.375rem' }}>{l}</Link>
                ))}
                <button onClick={() => { logout(); navigate('/') }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.625rem 0.75rem', fontSize: '0.875rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '0.375rem' }}>
                  🚪 Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ─── CONTENT ─── */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0f172a', color: '#cbd5e1', marginTop: 'auto' }}>
        <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem' }}>
            {/* Brand */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>NP</span>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f5f9' }}>Nila Prima Farm</div>
                  <div style={{ fontSize: '0.72rem', color: '#60a5fa' }}>Benih Ikan Nila Premium</div>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94a3b8', maxWidth: '20rem' }}>
                Supplier benih ikan nila premium terpercaya sejak 2010. Kualitas genetik terbaik, bersertifikat SNI untuk hasil panen maksimal.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '1rem' }}>Menu</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[['/', 'Beranda'], ['/keranjang', 'Keranjang'], ['/riwayat', 'Riwayat'], ['/profil', 'Profil']].map(([to, l]) => (
                  <Link key={to} to={to} style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#f1f5f9'}
                    onMouseLeave={e => e.target.style.color = '#94a3b8'}
                  >{l}</Link>
                ))}
              </div>
            </div>

            {/* Kontak */}
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '1rem' }}>Kontak</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                <span>📍 Jl. Raya Budidaya No.12, Bogor</span>
                <span>📞 +62 812-3456-7890</span>
                <span>✉️ info@nilaprimafarm.id</span>
                <span>🕐 Senin–Sabtu, 08.00–17.00</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1e293b', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>© 2025 Nila Prima Farm. All rights reserved.</span>
            <span style={{ fontSize: '0.8rem', color: '#334155' }}>Pembayaran aman via Midtrans</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
