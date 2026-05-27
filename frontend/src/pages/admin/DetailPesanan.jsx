import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function DetailPesanan() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8">
        <button className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-4">
          <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Daftar Pesanan
        </button>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">Detail Pesanan</h1>
            <p className="text-gray-400 text-sm font-medium">NPF-2026-001236 — 18 April 2026</p>
          </div>
          <span className="bg-blue-50 text-blue-500 px-4 py-1.5 rounded-full text-xs font-bold">Dibayar</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Informasi Pelanggan */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6">Informasi Pelanggan</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div><p className="text-gray-400 text-[10px] font-bold uppercase">Nama</p><p className="font-bold text-gray-800">Budi Santoso</p></div>
                <div><p className="text-gray-400 text-[10px] font-bold uppercase">Telepon</p><p className="font-bold text-gray-800">081234567890</p></div>
                <div className="col-span-2"><p className="text-gray-400 text-[10px] font-bold uppercase">Alamat</p><p className="font-medium text-gray-600">Jl. Raya Budidaya No. 123, Sukamaju, Tangerang</p></div>
              </div>
            </div>

            {/* Bukti Pembayaran */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6">Bukti Pembayaran</h3>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <img src="/sample-bukti.jpg" className="w-full h-80 object-contain p-4" alt="Bukti Transfer" />
              </div>
              <button className="w-full mt-4 py-3 border border-blue-100 text-[#3498db] text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors">Lihat Full Image</button>
            </div>
          </div>

          {/* Update Status Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-6">Update Status Pesanan</h3>
              <div className="space-y-3">
                {['Pending', 'Dibayar', 'Diproses', 'Selesai'].map((status) => (
                  <button key={status} className={`w-full py-3 rounded-2xl text-xs font-bold transition-all border ${status === 'Dibayar' ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}