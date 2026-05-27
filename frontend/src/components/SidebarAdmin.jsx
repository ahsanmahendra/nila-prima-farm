import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  ShoppingBagIcon, 
  CubeIcon, 
  UsersIcon, 
  Cog6ToothIcon,
  SparklesIcon   // ← tambah ini
} from '@heroicons/react/24/outline';

const SidebarAdmin = () => {
  const location = useLocation();

 const menus = [
  { name: 'Dashboard', icon: Squares2X2Icon, path: '/admin' },
  { name: 'Pesanan', icon: ShoppingBagIcon, path: '/admin/pesanan' },
  { name: 'Produk', icon: CubeIcon, path: '/admin/produk' },
  { name: 'Pengguna', icon: UsersIcon, path: '/admin/pengguna' },
  { name: 'AI Insight', icon: SparklesIcon, path: '/admin/ai-insight' },
  { name: 'Pengaturan', icon: Cog6ToothIcon, path: '/admin/pengaturan' },
];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0 flex flex-col p-6">
      <div className="mb-10">
        <h1 className="font-bold text-xl text-gray-800">Nila Prima Farm</h1>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-[#3498db] text-white shadow-lg shadow-blue-100' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <menu.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarAdmin;