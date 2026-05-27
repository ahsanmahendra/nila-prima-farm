// backend/controllers/aiController.js

const { pool } = require('../config/database');
const { predictAllProducts, healthCheck } = require('../services/aiService');

// ── Helper: ambil data produk realtime dari MySQL ────────────────────────────
const getProductsRealtime = async () => {
  const sql = `
    SELECT
      p.id,
      p.name        AS nama_produk,
      p.size        AS ukuran_benih,
      p.price       AS harga,
      p.stock       AS stok,
      p.sold        AS jumlah_terjual,
      p.category    AS kategori_produk,
      COUNT(oi.id)  AS total_transaksi,
      COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
    FROM products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'completed'
    GROUP BY p.id
    ORDER BY p.sold DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};

// ── GET /api/ai/insight ──────────────────────────────────────────────────────
const getInsight = async (req, res, next) => {
  try {
    const products = await getProductsRealtime();
    if (!products.length) {
      return res.json({ message: 'Belum ada data produk', products: [], predictions: [] });
    }

    const aiResult = await predictAllProducts(products);
    const aiOnline = !!aiResult;

    const predictions = aiOnline
      ? aiResult.predictions
      : products.map(p => ({ ...p, prediksi_pembelian: null }));

    const ranking    = [...products].sort((a, b) => b.jumlah_terjual - a.jumlah_terjual);
    const topProduk  = ranking[0] || null;
    const stokKritis = products.filter(p => Number(p.stok) < 500);

    const totalRevenue = products.reduce((sum, p) => sum + Number(p.total_revenue), 0);
    const totalTerjual = products.reduce((sum, p) => sum + Number(p.jumlah_terjual), 0);

    return res.json({
      ai_online      : aiOnline,
      total_produk   : products.length,
      total_terjual  : totalTerjual,
      total_revenue  : totalRevenue,
      top_produk     : topProduk,
      stok_kritis    : stokKritis,
      ranking_produk : ranking,
      predictions,
      timestamp      : new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/ai/predict ─────────────────────────────────────────────────────
const predictOne = async (req, res, next) => {
  try {
    const { nama_produk, ukuran_benih } = req.body;
    if (!nama_produk || !ukuran_benih) {
      return res.status(400).json({ error: 'nama_produk dan ukuran_benih wajib diisi' });
    }

    const products = await getProductsRealtime();
    const produk   = products.find(
      p => p.nama_produk === nama_produk && p.ukuran_benih === ukuran_benih
    );

    if (!produk) return res.status(404).json({ error: 'Produk tidak ditemukan' });

    const aiResult = await predictAllProducts([produk]);
    const pred     = aiResult?.predictions?.[0]?.prediksi_pembelian ?? null;

    return res.json({
      nama_produk,
      ukuran_benih,
      data_realtime      : produk,
      prediksi_pembelian : pred,
      satuan             : 'ekor',
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/ai/chat ────────────────────────────────────────────────────────
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Pesan kosong' });

    const msg      = message.toLowerCase().trim();
    const products = await getProductsRealtime();
    const aiResult = await predictAllProducts(products);
    const predictions = aiResult?.predictions || [];

    let reply = '';

    // Intent: produk paling diminati
    if (/diminati|terlaris|laris|populer|terbanyak|paling laku/.test(msg)) {
      const top  = predictions.length
        ? predictions[0]
        : [...products].sort((a, b) => b.jumlah_terjual - a.jumlah_terjual)[0];
      const pred = top?.prediksi_pembelian;
      reply = `Berdasarkan hasil prediksi AI dan data penjualan realtime, `
            + `**${top.nama_produk}** (ukuran ${top.ukuran_benih}) diprediksi menjadi produk `
            + `dengan permintaan tertinggi.`
            + (pred ? ` Prediksi pembelian: **${Number(pred).toLocaleString('id-ID')} ekor**.` : '')
            + ` Stok tersisa **${Number(top.stok).toLocaleString('id-ID')} ekor**, `
            + `total terjual **${Number(top.jumlah_terjual).toLocaleString('id-ID')} ekor**.`;
    }

    // Intent: prediksi penjualan
    else if (/prediksi|minggu depan|forecast|proyeksi/.test(msg)) {
      const top3 = predictions.slice(0, 3);
      if (top3.length) {
        const list = top3.map((p, i) =>
          `${i + 1}. **${p.nama_produk}** (${p.ukuran_benih}): ~${Number(p.prediksi_pembelian || 0).toLocaleString('id-ID')} ekor`
        ).join('\n');
        reply = `Prediksi permintaan berdasarkan model AI:\n\n${list}\n\nPrediksi dihitung berdasarkan harga, stok saat ini, dan riwayat penjualan.`;
      } else {
        reply = 'Model AI sedang tidak tersedia. Coba lagi nanti.';
      }
    }

    // Intent: stok perlu ditambah
    else if (/stok|tambah|habis|kosong|kritis|restock/.test(msg)) {
      const kritis = products.filter(p => Number(p.stok) < 500).sort((a, b) => a.stok - b.stok);
      if (kritis.length) {
        const list = kritis.map(p =>
          `• **${p.nama_produk}** (${p.ukuran_benih}): sisa **${Number(p.stok).toLocaleString('id-ID')} ekor**`
        ).join('\n');
        reply = `Produk dengan stok kritis (di bawah 500 ekor):\n\n${list}`;
      } else {
        reply = 'Semua produk masih memiliki stok yang cukup.';
      }
    }

    // Intent: rekomendasi pemula
    else if (/pemula|baru|cocok|mudah|rekomendasi|saran/.test(msg)) {
      const murah = [...products].sort((a, b) => a.harga - b.harga)[0];
      reply = `Untuk pemula, kami merekomendasikan **${murah.nama_produk}** ukuran **${murah.ukuran_benih}** `
            + `dengan harga **Rp ${Number(murah.harga).toLocaleString('id-ID')}/ekor**. `
            + `Ukuran kecil lebih mudah dirawat dan cocok untuk kolam skala rumahan.`;
    }

    // Intent: produk termurah
    else if (/murah|hemat|terjangkau|ekonomis|harga rendah/.test(msg)) {
      const sorted   = [...products].sort((a, b) => a.harga - b.harga);
      const termurah = sorted[0];
      const list     = sorted.slice(0, 3).map(p =>
        `• **${p.nama_produk}** (${p.ukuran_benih}): Rp ${Number(p.harga).toLocaleString('id-ID')}/ekor`
      ).join('\n');
      reply = `Produk dengan harga paling terjangkau:\n\n${list}\n\n`
            + `**${termurah.nama_produk}** (${termurah.ukuran_benih}) adalah pilihan paling ekonomis.`;
    }

    // Intent: daftar produk
    else if (/daftar|semua produk|produk apa|ada apa|tersedia/.test(msg)) {
      const list = products.map(p =>
        `• **${p.nama_produk}** (${p.ukuran_benih}) — Rp ${Number(p.harga).toLocaleString('id-ID')}/ekor, stok ${Number(p.stok).toLocaleString('id-ID')} ekor`
      ).join('\n');
      reply = `Produk benih ikan nila yang tersedia:\n\n${list}`;
    }

    // Intent: sapaan
    else if (/halo|hai|hello|hi|selamat|pagi|siang|sore|malam/.test(msg)) {
      reply = `Halo! Saya asisten AI Nila Prima Farm 🐟\n\n`
            + `Saya bisa membantu dengan:\n`
            + `• Produk paling diminati\n`
            + `• Prediksi penjualan AI\n`
            + `• Rekomendasi untuk pemula\n`
            + `• Cek stok kritis\n`
            + `• Produk termurah`;
    }

    // Default
    else {
      reply = `Maaf, saya belum mengerti. Coba tanyakan:\n`
            + `• "Produk apa yang paling diminati?"\n`
            + `• "Prediksi penjualan minggu depan?"\n`
            + `• "Stok apa yang perlu ditambah?"\n`
            + `• "Produk terbaik untuk pemula?"\n`
            + `• "Produk termurah?"`;
    }

    return res.json({ reply, timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/ai/health ───────────────────────────────────────────────────────
const aiHealth = async (req, res) => {
  const online = await healthCheck();
  return res.json({ ai_service: online ? 'online' : 'offline' });
};

module.exports = { getInsight, predictOne, chat, aiHealth };
