export const SIZE_VARIANTS = [
  { size: '2-3 cm', price: 100 },
  { size: '3-4 cm', price: 300 },
  { size: '4-5 cm', price: 500 },
]

export const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Nila Nirwana 4',
    category: 'Premium',
    price: 100,
    stock: 1200,
    sold: 8400,
    rating: 4.9,
    review_count: 234,
    variants: SIZE_VARIANTS,
    description: 'Nila Nirwana 4 merupakan varietas unggulan hasil pemuliaan Balai Riset Perikanan Budidaya Air Tawar. Pertumbuhan cepat, tubuh relatif dalam, dan tahan terhadap berbagai kondisi kolam.',
    specs: { 'Survival Rate': '>90%', 'FCR': '1.2–1.4', 'Waktu Panen': '4–5 bulan', 'Bobot Panen': '300–400 g' },
    tags: ['best-seller', 'premium'],
  },
  {
    id: 2,
    name: 'Nila Kekar',
    category: 'Super Premium',
    price: 100,
    stock: 850,
    sold: 5200,
    rating: 4.8,
    review_count: 189,
    variants: SIZE_VARIANTS,
    description: 'Nila Kekar dikenal dengan tubuh besar dan dagingnya yang tebal. Hasil seleksi strain lokal terbaik Indonesia dengan ketahanan penyakit superior.',
    specs: { 'Survival Rate': '>92%', 'FCR': '1.1–1.3', 'Waktu Panen': '3.5–4 bulan', 'Bobot Panen': '400–500 g' },
    tags: ['new', 'super-premium'],
  },
  {
    id: 3,
    name: 'Nila Gesit',
    category: 'Standard',
    price: 100,
    stock: 2000,
    sold: 21300,
    rating: 4.7,
    review_count: 567,
    variants: SIZE_VARIANTS,
    description: 'Nila Gesit adalah pilihan terbaik untuk pembudidaya yang menginginkan hasil cepat dengan biaya terjangkau. Adaptif terhadap berbagai jenis kolam.',
    specs: { 'Survival Rate': '>88%', 'FCR': '1.3–1.5', 'Waktu Panen': '4–5 bulan', 'Bobot Panen': '250–350 g' },
    tags: ['popular', 'hemat'],
  },
  {
    id: 4,
    name: 'Nila Black Prima',
    category: 'Premium',
    price: 100,
    stock: 600,
    sold: 3800,
    rating: 4.8,
    review_count: 145,
    variants: SIZE_VARIANTS,
    description: 'Nila Black Prima merupakan strain nila hitam premium dengan warna kulit gelap yang diminati pasar ekspor. Daging putih bersih dan tebal.',
    specs: { 'Survival Rate': '>89%', 'FCR': '1.2–1.4', 'Waktu Panen': '4–5 bulan', 'Bobot Panen': '350–450 g' },
    tags: ['premium', 'ekspor'],
  },
]

export const CATEGORIES = ['Semua', 'Standard', 'Premium', 'Super Premium']

export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export const ORDER_STATUS = {
  pending:    { label: 'Menunggu Pembayaran', color: 'bg-amber-100 text-amber-700' },
  processing: { label: 'Diproses',            color: 'bg-blue-100 text-blue-700' },
  shipped:    { label: 'Dikirim',             color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Diterima',            color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Dibatalkan',          color: 'bg-red-100 text-red-700' },
}

export const PAYMENT_STATUS = {
  pending:    { label: 'Menunggu',    color: 'bg-amber-100 text-amber-700' },
  settlement: { label: 'Lunas',      color: 'bg-green-100 text-green-700' },
  expire:     { label: 'Kadaluarsa', color: 'bg-slate-100 text-slate-600' },
  cancel:     { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
}
