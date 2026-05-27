// frontend/src/routes/AppRoutes.jsx (FIXED)
// FIX: tambah PrivateRoute dan AdminRoute
// FIX: hapus file *Page.jsx duplikat — semua pakai halaman tanpa suffix "Page"

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Auth pages ───────────────────────────────────────────────────────────────
import Login    from '../pages/Login';
import Register from '../pages/Register';

// ── Customer pages ───────────────────────────────────────────────────────────
import Katalog        from '../pages/Katalog';
import DetailProduk   from '../pages/DetailProduk';
import Keranjang      from '../pages/Keranjang';
import Checkout       from '../pages/Checkout';
import Pembayaran     from '../pages/Pembayaran';
import RiwayatPesanan from '../pages/RiwayatPesanan';
import Profil         from '../pages/Profil';

// ── Admin pages ──────────────────────────────────────────────────────────────
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import ListPesanan    from '../pages/admin/ListPesanan';
import DetailPesanan  from '../pages/admin/DetailPesanan';
import ManajemenProduk from '../pages/admin/ManajemenProduk';
import AIInsightDashboard from '../pages/admin/AIInsightDashboard'; // NEW

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * PrivateRoute — hanya bisa diakses jika sudah login
 * Redirect ke /login jika belum
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * AdminRoute — hanya bisa diakses oleh role 'admin'
 * Redirect ke /katalog jika bukan admin
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user)             return <Navigate to="/login"   replace />;
  if (user.role !== 'admin') return <Navigate to="/katalog" replace />;
  return children;
};

/**
 * GuestRoute — redirect ke home jika sudah login
 * Dipakai di halaman login & register
 */
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/katalog" replace />;
};

// ── Routes ────────────────────────────────────────────────────────────────────
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/katalog" replace />} />

      {/* Guest only */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Public */}
      <Route path="/katalog"         element={<Katalog />} />
      <Route path="/produk/:id"      element={<DetailProduk />} />

      {/* Private (login required) */}
      <Route path="/keranjang"  element={<PrivateRoute><Keranjang /></PrivateRoute>} />
      <Route path="/checkout"   element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path="/pembayaran/:orderId" element={<PrivateRoute><Pembayaran /></PrivateRoute>} />
      <Route path="/riwayat"    element={<PrivateRoute><RiwayatPesanan /></PrivateRoute>} />
      <Route path="/profil"     element={<PrivateRoute><Profil /></PrivateRoute>} />

      {/* Admin only */}
      <Route path="/admin"                  element={<AdminRoute><DashboardAdmin /></AdminRoute>} />
      <Route path="/admin/pesanan"          element={<AdminRoute><ListPesanan /></AdminRoute>} />
      <Route path="/admin/pesanan/:id"      element={<AdminRoute><DetailPesanan /></AdminRoute>} />
      <Route path="/admin/produk"           element={<AdminRoute><ManajemenProduk /></AdminRoute>} />
      <Route path="/admin/ai-insight"       element={<AdminRoute><AIInsightDashboard /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-gray-700">404</h1>
          <p className="text-gray-500">Halaman tidak ditemukan</p>
          <a href="/katalog" className="text-blue-500 underline">Kembali ke Katalog</a>
        </div>
      } />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
