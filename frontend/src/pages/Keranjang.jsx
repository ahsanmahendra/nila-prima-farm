import React from 'react';
import Navbar from '../components/Navbar';
import { TrashIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Keranjang() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <Link to="/" className="flex items-center gap-2 text-gray-400 mb-6 text-sm"><ChevronLeftIcon className="w-4 h-4" /> Lanjut Belanja</Link>
        <h1 className="text-2xl font-bold mb-8 text-gray-800">Keranjang Belanja</h1>
        
        <div className="flex flex-col lg:row gap-8">
          <div className="flex-1 space-y-4">
            {/* Item Keranjang */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <img src="/fish.jpg" className="w-20 h-20 rounded-2xl object-cover" alt="fish" />
              <div className="flex-1">
                <h3 className="font-bold text-sm">Nila Nirwana 4</h3>
                <p className="text-xs text-gray-400">Ukuran: 3-4 cm</p>
                <p className="text-[#3498db] font-bold text-sm mt-1 text-sm">Rp 300 <span className="text-gray-300 font-normal">/ ekor</span></p>
              </div>
              <div className="flex items-center border rounded-xl px-3 py-1 gap-4">
                <button className="text-gray-400">-</button><span>100</span><button className="text-gray-400">+</button>
              </div>
              <button className="p-2 text-gray-300 hover:text-red-500"><TrashIcon className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="w-full lg:w-80 bg-white p-6 rounded-[32px] border border-gray-100 h-fit shadow-sm">
            <h3 className="font-bold mb-4">Ringkasan Belanja</h3>
            <div className="flex justify-between text-sm mb-2 text-gray-500"><span>Subtotal</span><span className="font-bold text-gray-800">Rp 30.000</span></div>
            <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg text-[#3498db]"><span>Total</span><span>Rp 30.000</span></div>
            <Link to="/checkout" className="block w-full bg-[#3498db] text-white text-center py-4 rounded-2xl mt-6 font-bold">Checkout</Link>
          </div>
        </div>
      </main>
    </div>
  );
}