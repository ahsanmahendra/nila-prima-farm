// backend/services/aiService.js
// Komunikasi ke Python Flask AI server yang membaca model.pkl

const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

/**
 * Prediksi jumlah_pembelian untuk satu produk
 * @param {object} data - { harga, stok, jumlah_terjual, nama_produk, ukuran_benih }
 */
const predictPembelian = async (data) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, data, { timeout: 5000 });
    return response.data;
  } catch (err) {
    console.error('[AI Service] Predict error:', err.message);
    return null;
  }
};

/**
 * Ambil semua prediksi produk aktif sekaligus (batch)
 */
const predictAllProducts = async (products) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-batch`, { products }, { timeout: 8000 });
    return response.data;
  } catch (err) {
    console.error('[AI Service] Batch predict error:', err.message);
    return null;
  }
};

/**
 * Cek apakah AI service aktif
 */
const healthCheck = async () => {
  try {
    const res = await axios.get(`${AI_SERVICE_URL}/health`, { timeout: 3000 });
    return res.data.status === 'ok';
  } catch {
    return false;
  }
};

module.exports = { predictPembelian, predictAllProducts, healthCheck };
