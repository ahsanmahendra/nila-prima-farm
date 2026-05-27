// frontend/src/pages/admin/AIInsightDashboard.jsx
// Dashboard AI Insight untuk admin — prediksi + data realtime + visualisasi

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n) => Number(n || 0).toLocaleString('id-ID');
const fmtRp = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color = 'blue' }) => {
  const colors = {
    blue  : 'bg-blue-50   border-blue-100   text-blue-600',
    green : 'bg-green-50  border-green-100  text-green-600',
    orange: 'bg-orange-50 border-orange-100 text-orange-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
};

// ── Bar chart sederhana (CSS-based) ──────────────────────────────────────────
const MiniBarChart = ({ data, valueKey, labelKey, color = '#3B82F6' }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-32 truncate">{item[labelKey]}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center pl-2 transition-all duration-700"
              style={{
                width     : `${Math.max(4, (item[valueKey] / max) * 100)}%`,
                backgroundColor: color,
              }}
            >
              <span className="text-white text-[10px] font-semibold whitespace-nowrap">
                {fmt(item[valueKey])}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const StokBadge = ({ stok }) => {
  if (stok < 100)  return <span className="text-xs bg-red-100    text-red-600    px-2 py-0.5 rounded-full font-medium">Kritis</span>;
  if (stok < 500)  return <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Rendah</span>;
  if (stok < 1000) return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">Sedang</span>;
  return               <span className="text-xs bg-green-100  text-green-600  px-2 py-0.5 rounded-full font-medium">Aman</span>;
};

// ── Main Component ────────────────────────────────────────────────────────────
const AIInsightDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchInsight = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/ai/insight');
      setData(res.data);
      setLastUpdate(new Date());
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal mengambil data AI insight');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsight();
    // Auto-refresh setiap 5 menit
    const interval = setInterval(fetchInsight, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchInsight]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full
                        animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Memuat data AI...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-700 font-semibold">{error}</p>
        <button onClick={fetchInsight} className="mt-4 text-sm text-blue-500 underline">Coba lagi</button>
      </div>
    </div>
  );

  const {
    ai_online, total_produk, total_terjual, total_revenue,
    top_produk, stok_kritis, ranking_produk, predictions
  } = data || {};

  // Siapkan data chart
  const rankingChart = (ranking_produk || []).map(p => ({
    nama_produk : p.nama_produk,
    jumlah_terjual: Number(p.jumlah_terjual),
  }));

  const predChart = (predictions || [])
    .filter(p => p.prediksi_pembelian)
    .slice(0, 6)
    .map(p => ({
      nama_produk: `${p.nama_produk} (${p.ukuran_benih || p.size || ''})`,
      prediksi   : p.prediksi_pembelian,
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              AI Insight Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Data realtime + prediksi Linear Regression
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* AI Status */}
            <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium
              ${ai_online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <div className={`w-2 h-2 rounded-full ${ai_online ? 'bg-green-500' : 'bg-red-500'}`} />
              AI Model {ai_online ? 'Online' : 'Offline'}
            </div>
            {/* Refresh */}
            <button
              onClick={() => { setLoading(true); fetchInsight(); }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-gray-200
                         rounded-full hover:bg-gray-50 transition text-gray-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.65-5M20 15A9 9 0 015.35 20"/>
              </svg>
              Refresh
            </button>
            {lastUpdate && (
              <span className="text-xs text-gray-400">
                Update: {lastUpdate.toLocaleTimeString('id-ID')}
              </span>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            color="blue"   label="Total Produk"
            value={fmt(total_produk)}
            sub="Jenis benih tersedia"
          />
          <StatCard
            color="green"  label="Total Terjual"
            value={`${fmt(total_terjual)} ekor`}
            sub="Semua produk settlement"
          />
          <StatCard
            color="purple" label="Total Revenue"
            value={fmtRp(total_revenue)}
            sub="Transaksi settlement"
          />
          <StatCard
            color="orange" label="Stok Kritis"
            value={`${stok_kritis?.length || 0} produk`}
            sub="Di bawah 500 ekor"
          />
        </div>

        {/* ── Top Produk highlight ── */}
        {top_produk && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 mb-6 text-white">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">
              🏆 Produk Paling Laris
            </p>
            <p className="text-2xl font-bold">{top_produk.nama_produk}</p>
            <div className="flex gap-6 mt-3 text-sm">
              <div>
                <p className="text-blue-200 text-xs">Ukuran</p>
                <p className="font-semibold">{top_produk.ukuran_benih || top_produk.size || '-'}</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Terjual</p>
                <p className="font-semibold">{fmt(top_produk.jumlah_terjual)} ekor</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Harga</p>
                <p className="font-semibold">{fmtRp(top_produk.harga)}/ekor</p>
              </div>
              <div>
                <p className="text-blue-200 text-xs">Stok</p>
                <p className="font-semibold">{fmt(top_produk.stok)} ekor</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ranking penjualan realtime */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-700 mb-1">📊 Ranking Penjualan Realtime</h2>
            <p className="text-xs text-gray-400 mb-4">Berdasarkan data transaksi settlement</p>
            {rankingChart.length > 0
              ? <MiniBarChart data={rankingChart} valueKey="jumlah_terjual" labelKey="nama_produk" color="#3B82F6" />
              : <p className="text-sm text-gray-400">Belum ada data penjualan</p>
            }
          </div>

          {/* Prediksi AI */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-700">🤖 Prediksi Permintaan (AI)</h2>
              {!ai_online && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                  Model Offline
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">Hasil prediksi Linear Regression (ekor)</p>
            {predChart.length > 0
              ? <MiniBarChart data={predChart} valueKey="prediksi" labelKey="nama_produk" color="#8B5CF6" />
              : <p className="text-sm text-gray-400">
                  {ai_online ? 'Belum ada prediksi' : 'Nyalakan AI server untuk melihat prediksi'}
                </p>
            }
          </div>
        </div>

        {/* ── Stok kritis ── */}
        {stok_kritis?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
            <h2 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
              ⚠️ Produk Stok Kritis — Perlu Restock Segera
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stok_kritis.map((p, i) => (
                <div key={i} className="bg-white rounded-xl border border-orange-100 p-3">
                  <p className="font-medium text-sm text-gray-800">{p.nama_produk}</p>
                  <p className="text-xs text-gray-500">{p.ukuran_benih || p.size}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-orange-600">{fmt(p.stok)} ekor</span>
                    <StokBadge stok={Number(p.stok)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tabel semua produk + prediksi ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">📋 Detail Produk & Prediksi AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">Data realtime dari database + hasil prediksi model</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Produk','Ukuran','Harga','Stok','Terjual','Revenue','Prediksi AI','Status Stok']
                    .map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {(predictions || ranking_produk || []).map((p, i) => (
                  <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nama_produk}</td>
                    <td className="px-4 py-3 text-gray-500">{p.ukuran_benih || p.size || '-'}</td>
                    <td className="px-4 py-3">{fmtRp(p.harga)}</td>
                    <td className="px-4 py-3">{fmt(p.stok)}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{fmt(p.jumlah_terjual)}</td>
                    <td className="px-4 py-3">{fmtRp(p.total_revenue)}</td>
                    <td className="px-4 py-3">
                      {p.prediksi_pembelian != null
                        ? <span className="text-purple-600 font-semibold">{fmt(p.prediksi_pembelian)} ekor</span>
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3"><StokBadge stok={Number(p.stok)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Prediksi dihasilkan oleh model Linear Regression yang dilatih dari dataset transaksi Jan–Jun 2026.
          Akurasi bergantung pada ketersediaan data historis.
        </p>
      </div>
    </div>
  );
};

export default AIInsightDashboard;
