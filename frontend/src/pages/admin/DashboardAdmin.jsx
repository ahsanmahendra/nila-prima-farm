import React from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import { ShoppingCartIcon, BanknotesIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function DashboardAdmin() {
  const stats = [
    { label: 'Total Pesanan', value: '1,245', trend: '+12%', icon: ShoppingCartIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Pendapatan', value: 'Rp 28,5 jt', trend: '+8%', icon: BanknotesIcon, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Pengguna', value: '856', trend: '+5%', icon: UsersIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-800">Dashboard</h1>
          <p className="text-gray-400 text-sm font-medium">Selamat datang kembali, Admin</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h2 className="text-2xl font-black text-gray-800">{stat.value}</h2>
                <span className="text-[10px] font-bold text-green-500 mt-1 inline-block">{stat.trend} dari bulan lalu</span>
              </div>
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart Placeholder & Recent Orders */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Grafik Pendapatan</h3>
            <select className="text-xs font-bold text-gray-400 border-none bg-transparent outline-none">
              <option>6 Bulan Terakhir</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
            <p className="text-gray-400 text-xs font-medium italic">[ Area Grafik Line Chart ]</p>
          </div>
        </div>
      </main>
    </div>
  );
}