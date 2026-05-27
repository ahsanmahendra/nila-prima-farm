// backend/middleware/rateLimiter.js
// Fix: Tambah rate limiting di endpoint auth

const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs : 15 * 60 * 1000, // 15 menit
  max      : 10,              // maks 10 request per window
  message  : { error: 'Terlalu banyak percobaan login. Coba lagi setelah 15 menit.' },
  standardHeaders: true,
  legacyHeaders  : false,
});

const apiLimiter = rateLimit({
  windowMs : 1 * 60 * 1000,  // 1 menit
  max      : 60,
  message  : { error: 'Rate limit tercapai. Coba lagi setelah 1 menit.' },
});

module.exports = { authLimiter, apiLimiter };
