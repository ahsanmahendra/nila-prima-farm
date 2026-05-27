import React from 'react';
import Navbar from '../components/Navbar';

export default function Riwayat() {
  const transactions = [
    { id: 'NPF-2026-001238', date: '21 April 2026', total: 'Rp 50.000', status: 'Selesai' },
    { id: 'NPF-2026-001237', date: '20 April 2026', total: 'Rp 105.000', status: 'Diproses' },
    { id: 'NPF-2026-001236', date: '18 April 2026', total: 'Rp 25.000', status: 'Dibayar' },
  ];

  const statusColor = (s) => {
    if (s === 'Selesai') return 'bg-green-50 text-green-600';
    if (s === 'Diproses') return 'bg-purple-50 text-purple-600';
    if (s === 'Dibayar') return 'bg-blue-50 text-blue-600';
    return 'bg-orange-50 text-orange-600';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Riwayat Transaksi</h1>
        <p className="text-gray-400 text-sm mb-8">Lihat semua transaksi pembelian benih ikan nila Anda</p>

        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-400 border-b border-gray-50">
              <tr>
                <th className="px-8 py-5">ID Transaksi</th>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-sm text-gray-800">{t.id}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">{t.date}</td>
                  <td className="px-8 py-6 font-bold text-sm text-[#3498db]">{t.total}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${statusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-xs font-bold text-gray-400 hover:text-[#3498db]">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}