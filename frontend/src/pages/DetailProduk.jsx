export default function DetailProduk() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 bg-white mt-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
        <img src="/fish-detail.jpg" className="w-full md:w-1/2 h-80 object-cover rounded-2xl" alt="Product" />
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Nila Nirwana 4</h1>
          <p className="text-green-500 text-sm font-medium">✓ Stok tersedia: 420 ekor</p>
          <div className="grid grid-cols-3 gap-2">
            <button className="border-2 border-[#3498db] p-3 rounded-xl text-center"><p className="text-xs">2-3 cm</p><p className="font-bold text-[#3498db]">Rp 100</p></button>
          </div>
          <button className="w-full bg-[#3498db] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Tambah ke Keranjang</button>
        </div>
      </main>
    </div>
  );
}