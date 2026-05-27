import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Checkout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-400 text-sm mb-8">Lengkapi data pengiriman untuk melanjutkan</p>
        
        <div className="flex flex-col lg:row gap-8">
          <div className="flex-1 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-4">Informasi Pengiriman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <input className="w-full border border-gray-100 p-3 rounded-xl md:col-span-2" placeholder="Nama Lengkap" />
              <input className="w-full border border-gray-100 p-3 rounded-xl" placeholder="Nomor Telepon" />
              <input className="w-full border border-gray-100 p-3 rounded-xl" placeholder="Kota" />
              <textarea className="w-full border border-gray-100 p-3 rounded-xl md:col-span-2" placeholder="Alamat Lengkap" rows="3"></textarea>
            </div>
          </div>
          
          <div className="w-full lg:w-80 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-fit">
            <h3 className="font-bold mb-4">Ringkasan Pesanan</h3>
            <div className="text-xs space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between"><span>Nila Nirwana 4 (100x)</span><span>Rp 30.000</span></div>
              <div className="flex justify-between text-green-500"><span>Ongkos Kirim</span><span>Gratis</span></div>
            </div>
            <div className="flex justify-between font-bold text-xl text-[#3498db]"><span>Total</span><span>Rp 30.000</span></div>
            <Link to="/pembayaran" className="block w-full bg-[#3498db] text-white text-center py-4 rounded-2xl mt-8 font-bold shadow-lg shadow-blue-100">Bayar Sekarang</Link>
          </div>
        </div>
      </main>
    </div>
  );
}