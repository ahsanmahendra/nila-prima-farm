import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import KatalogPage        from './pages/KatalogPage'
import DetailProdukPage   from './pages/DetailProdukPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import KeranjangPage      from './pages/KeranjangPage'
import CheckoutPage       from './pages/CheckoutPage'
import PembayaranPage     from './pages/PembayaranPage'
import RiwayatPage        from './pages/RiwayatPage'
import DetailPesananPage  from './pages/DetailPesananPage'
import ProfilPage         from './pages/ProfilPage'

// Admin pages
import AdminDashboardPage     from './pages/admin/AdminDashboardPage'
import AdminPesananPage       from './pages/admin/AdminPesananPage'
import AdminDetailPesananPage from './pages/admin/AdminDetailPesananPage'
import AdminProdukPage        from './pages/admin/AdminProdukPage'
import AIInsightDashboard     from './pages/admin/AIInsightDashboard'  // NEW

// Guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route path="/admin" element={
        <AdminRoute><AdminLayout><AdminDashboardPage /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/pesanan" element={
        <AdminRoute><AdminLayout><AdminPesananPage /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/pesanan/:id" element={
        <AdminRoute><AdminLayout><AdminDetailPesananPage /></AdminLayout></AdminRoute>
      } />
      <Route path="/admin/produk" element={
        <AdminRoute><AdminLayout><AdminProdukPage /></AdminLayout></AdminRoute>
      } />
      {/* NEW: AI Insight */}
      <Route path="/admin/ai-insight" element={
        <AdminRoute><AdminLayout><AIInsightDashboard /></AdminLayout></AdminRoute>
      } />

      {/* Public */}
      <Route path="/" element={
        <MainLayout><KatalogPage /></MainLayout>
      } />
      <Route path="/produk/:id" element={
        <MainLayout><DetailProdukPage /></MainLayout>
      } />

      {/* Protected */}
      <Route path="/keranjang" element={
        <MainLayout><KeranjangPage /></MainLayout>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute><MainLayout><CheckoutPage /></MainLayout></ProtectedRoute>
      } />
      <Route path="/pembayaran" element={
        <ProtectedRoute><MainLayout><PembayaranPage /></MainLayout></ProtectedRoute>
      } />
      <Route path="/riwayat" element={
        <ProtectedRoute><MainLayout><RiwayatPage /></MainLayout></ProtectedRoute>
      } />
      <Route path="/riwayat/:id" element={
        <ProtectedRoute><MainLayout><DetailPesananPage /></MainLayout></ProtectedRoute>
      } />
      <Route path="/profil" element={
        <ProtectedRoute><MainLayout><ProfilPage /></MainLayout></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
