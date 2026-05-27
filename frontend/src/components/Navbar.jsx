import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-500">
          Nila Prima Farm
        </h1>

        <div className="flex items-center gap-4">
          <ShoppingCartIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
          <UserIcon className="w-6 h-6 text-gray-700 cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;