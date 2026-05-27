import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md text-center border border-gray-100">
        <div className="bg-[#3498db] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <img src="/logo-nila.png" className="w-8 h-8 brightness-0 invert" alt="Logo" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Nila Prima Farm</h1>
        <p className="text-gray-400 mb-8 text-sm">Penjualan Benih Ikan</p>
        
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#3498db]/20" placeholder="contoh@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#3498db]/20" placeholder="Masukkan password" />
          </div>
          <button className="w-full bg-[#3498db] text-white py-3.5 rounded-xl mt-4 font-bold hover:bg-[#2980b9] shadow-lg shadow-blue-100 transition-all">Masuk</button>
        </form>
        <p className="mt-8 text-sm text-gray-500">Belum punya akun? <Link to="/register" className="text-[#3498db] font-semibold">Daftar sekarang</Link></p>
      </div>
    </div>
  );
}