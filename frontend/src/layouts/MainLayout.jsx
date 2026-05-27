import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Chatbot from '../components/Chatbot'

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
    const fn = (e) => {
      if (!profileRef.current?.contains(e.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', fn)

    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const navLinks = [
    { to: '/', label: 'Beranda', type: 'route' },
    { to: '#produk', label: 'Produk', type: 'anchor' },
    { to: '#tentang', label: 'Tentang', type: 'anchor' },
    { to: '#kontak', label: 'Kontak', type: 'anchor' },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          background: '#1e3a8a',
          color: '#bfdbfe',
          fontSize: '0.78rem',
          padding: '0.45rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <span>
            📍 Jl. Raya Dramaga, Bogor, Jawa Barat
          </span>

          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
            }}
          >
            <span>📞 +62 812-1228-9098</span>
            <span>✉️ info@nilaprimafarm.id</span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: scrolled
            ? '0 2px 12px rgba(0,0,0,0.08)'
            : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
          }}
        >
          {/* LOGO */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '0.625rem',
                background:
                  'linear-gradient(135deg, #1d4ed8, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 2px 8px rgba(37,99,235,0.35)',
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px',
                }}
              >
                NP
              </span>
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                Nila Prima Farm
              </div>

              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#2563eb',
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Benih Ikan Nila Premium
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            className="hidden lg:flex"
          >
            {navLinks.map(({ to, label, type }) =>
              type === 'anchor' ? (
                <a
                  key={to}
                  href={to}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#475569',
                    background: 'transparent',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#2563eb'
                    e.target.style.background = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#475569'
                    e.target.style.background = 'transparent'
                  }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color:
                      location.pathname === to
                        ? '#2563eb'
                        : '#475569',
                    background:
                      location.pathname === to
                        ? '#eff6ff'
                        : 'transparent',
                    transition: 'all 0.15s',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              )
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {/* CART */}
            <Link
              to="/keranjang"
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCartIcon
                style={{ width: 22, height: 22 }}
              />

              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 18,
                    height: 18,
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {user ? (
              <div
                ref={profileRef}
                style={{ position: 'relative' }}
              >
                <button
                  onClick={() =>
                    setProfileOpen((v) => !v)
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                    }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>

                  <span
                    className="hidden md:block"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                    }}
                  >
                    {user.name}
                  </span>

                  <ChevronDownIcon
                    style={{
                      width: 14,
                      height: 14,
                      color: '#9ca3af',
                    }}
                    className="hidden md:block"
                  />
                </button>

                {profileOpen && (
  <div
    style={{
      position: 'absolute',
      top: '110%',
      right: 0,
      width: 180,
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      zIndex: 200,
    }}
  >
    {user.role === 'admin' && (
      <Link
        to="/admin"
        style={{
          display: 'block',
          padding: '0.85rem 1rem',
          fontSize: '0.875rem',
          color: '#2563eb',
          textDecoration: 'none',
          fontWeight: 600,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        Dashboard Admin
      </Link>
    )}

    <Link
      to="/profil"
      style={{
        display: 'block',
        padding: '0.85rem 1rem',
        fontSize: '0.875rem',
        color: '#374151',
        textDecoration: 'none',
      }}
    >
      Profil Saya
    </Link>

    <Link
      to="/riwayat"
      style={{
        display: 'block',
        padding: '0.85rem 1rem',
        fontSize: '0.875rem',
        color: '#374151',
        textDecoration: 'none',
      }}
    >
      Riwayat Pesanan
    </Link>

    <button
      onClick={() => {
        logout()
        navigate('/login')
      }}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '0.85rem 1rem',
        fontSize: '0.875rem',
        color: '#dc2626',
        background: '#fff',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>
  </div>
)}
              </div>
            ) : (
              <div
                className="hidden sm:flex"
                style={{
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <Link
                  to="/login"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#475569',
                    textDecoration: 'none',
                  }}
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  className="btn-primary"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.5rem 1.125rem',
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* MOBILE BUTTON */}
            <button
              className="lg:hidden"
              onClick={() =>
                setMobileOpen((v) => !v)
              }
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              {mobileOpen ? (
                <XMarkIcon
                  style={{ width: 22, height: 22 }}
                />
              ) : (
                <Bars3Icon
                  style={{ width: 22, height: 22 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div
            style={{
              borderTop: '1px solid #f1f5f9',
              background: '#fff',
              padding: '0.75rem 1.5rem 1rem',
            }}
          >
            {navLinks.map(({ to, label, type }) =>
              type === 'anchor' ? (
                <a
                  key={to}
                  href={to}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#374151',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#374151',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              )
            )}
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* CHATBOT */}
      <Chatbot />
    </div>
  )
}