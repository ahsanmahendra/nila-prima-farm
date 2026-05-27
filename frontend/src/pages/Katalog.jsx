import MainLayout from "../layouts/MainLayout";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import ProductGrid from "../components/ProductGrid";

const dummyData = [
  {
    id: 1,
    nama: "Nila Nirwana 4",
    stok: 420,
    harga: "100",
    gambar:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    nama: "Nila Gesit",
    stok: 300,
    harga: "300",
    gambar:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    nama: "Nila Kekar",
    stok: 200,
    harga: "500",
    gambar:
      "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    nama: "Nila Black Prima",
    stok: 350,
    harga: "700",
    gambar:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop",
  },
];

const Katalog = () => {
  return (
    <MainLayout>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Katalog Benih Ikan Nila
          </h1>

          <p className="text-gray-500 mb-6">
            Pilih benih ikan nila berkualitas premium untuk budidaya Anda
          </p>

          <SearchBar />
        </div>

        <ProductGrid data={dummyData} />
      </div>
    </MainLayout>
  );
};

export default Katalog;