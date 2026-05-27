import React from 'react';
import Navbar from '../components/Navbar';
import { ClipboardDocumentIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function Pembayaran() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 md:p-10">
        <button className="text-gray-400 text-sm mb-4 flex items-center gap-1">← Kembali</button>
        <h1 className="text-2xl font-bold text-gray-800">Pembayaran</h1>
        <p className="text-gray-400 text-sm mb-8">Silakan transfer sesuai nominal dan upload bukti pembayaran</p>

        <div className="space-y-6">
          {/* Informasi Pesanan */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">No. Pesanan</p>
              <p className="text-sm font-bold text-gray-800">NPF-2026-001235</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Tanggal Pesanan</p>
              <p className="text-sm font-bold text-gray-800">21 April 2026</p>
            </div>
          </div>

          {/* Instruksi Rekening */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2">Total Pembayaran</p>
            <h2 className="text-3xl font-extrabold text-[#3498db] mb-8">Rp 120.000</h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 inline-block w-full max-w-sm">
              <p className="text-xs text-gray-400 mb-1">Bank Mandiri</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl font-mono font-bold text-gray-800">1234567890</span>
                <button className="text-[#3498db] hover:bg-blue-50 p-1 rounded"><ClipboardDocumentIcon className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium uppercase">PT Nila Prima Farm</p>
            </div>
          </div>

          {/* Upload Bukti */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-center">Upload Bukti Pembayaran</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <CloudArrowUpIcon className="w-10 h-10 text-gray-300" />
              <p className="text-xs text-gray-400 text-center">Klik untuk upload atau drag and drop<br/>PNG, JPG (Maks. 5MB)</p>
            </div>
            <button className="w-full bg-[#3498db] text-white py-4 rounded-2xl mt-8 font-bold shadow-lg shadow-blue-100">Kirim Bukti Pembayaran</button>
          </div>
        </div>
      </main>
    </div>
  );
}