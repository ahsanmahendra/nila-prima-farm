import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function ListPesanan() {
  const orders = [
    { id: '#001', name: 'Ahmad Hidayat', email: 'ahmad@email.com', date: '15 Apr 2026', total: 'Rp 2.500.000', status: 'Selesai' },
    { id: '#002', name: 'Siti Nurhaliza', email: 'siti@email.com', date: '18 Apr 2026', total: 'Rp 1.200.000', status: 'Proses' },
    { id: '#003', name: 'Budi Santoso', email: 'budi@email.com', date: '19 Apr 2026', total: 'Rp 1.800.000', status: 'Pending' },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800">Daftar Pesanan</h1>
          <p className="text-gray-400 text-sm font-medium">Kelola semua pesanan pelanggan</p>
        </header>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-3 text-gray-300" />
            <input className="w-full bg-white border border-gray-100 py-3 pl-12 pr-4 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-50 text-sm" placeholder="Cari berdasarkan ID atau nama pelanggan..." />
          </div>
          <button className="bg-white border border-gray-100 px-4 rounded-2xl shadow-sm flex items-center gap-2 text-sm font-bold text-gray-500">
            <FunnelIcon className="w-4 h-4" /> Semua
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">ID Pesanan</th>
                <th className="px-8 py-5">Pelanggan</th>
                <th className="px-8 py-5">Tanggal</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-gray-800">{o.id}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-800">{o.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{o.email}</p>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">{o.date}</td>
                  <td className="px-8 py-6 font-bold text-gray-800">{o.total}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${o.status === 'Selesai' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>{o.status}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="bg-[#3498db] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-100">Detail</button>
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