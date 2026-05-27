import React from 'react';
import Navbar from '../components/Navbar';
import { UserCircleIcon, MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function Profil() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Profil Pengguna</h1>

        <div className="space-y-6">
          {/* Header Profil */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#3498db]">
                <UserCircleIcon className="w-12 h-12" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white border border-gray-100 p-1.5 rounded-full shadow-sm">
                <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Budi Santoso</h2>
              <p className="text-sm text-gray-400 italic">budi.santoso@email.com</p>
            </div>
          </div>

          {/* Form Informasi Pribadi */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5 text-[#3498db]" /> Informasi Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Nama Lengkap</label>
                <input className="w-full border border-gray-100 p-3 rounded-xl bg-gray-50" defaultValue="Budi Santoso" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Nomor Telepon</label>
                <input className="w-full border border-gray-100 p-3 rounded-xl bg-gray-50" defaultValue="081234567890" />
              </div>
            </div>
          </div>

          {/* Form Alamat */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-[#3498db]" /> Alamat Pengiriman
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Alamat Lengkap</label>
                <textarea className="w-full border border-gray-100 p-3 rounded-xl bg-gray-50" rows="3">Jl. Raya Budidaya No. 123, RT 05/RW 03, Sukamaju, Cipondoh, Tangerang, Banten 15148</textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className="border border-gray-100 p-3 rounded-xl bg-gray-50" defaultValue="Tangerang" placeholder="Kota" />
                <input className="border border-gray-100 p-3 rounded-xl bg-gray-50" defaultValue="15148" placeholder="Kode Pos" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Batal</button>
            <button className="px-8 py-3 bg-[#3498db] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-[#2980b9] transition-all">Simpan Perubahan</button>
          </div>
        </div>
      </main>
    </div>
  );
}