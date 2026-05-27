// backend/server.js (FIXED — tambahkan bagian yang ditandai FIX)
// Diff dari server.js asli:
//   + import rateLimiter
//   + apply authLimiter ke /api/auth/*
//   + apply apiLimiter global
//   + register /api/ai routes

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const app        = express();

// FIX: Rate limiter
const { authLimiter, apiLimiter } = require('./middleware/rateLimiter');

// ── Routes (existing) ────────────────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');
const orderRoutes   = require('./routes/orders');
const paymentRoutes = require('./routes/payment');
const adminRoutes   = require('./routes/admin');

// FIX: AI routes baru
const aiRoutes = require('./routes/aiRoutes');

// ── Middleware ────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('CORS not allowed'));
  },
  credentials: true,
}));

// Raw body untuk Midtrans webhook (harus sebelum express.json)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// FIX: Global API rate limiter
app.use('/api', apiLimiter);

// ── Route registration ────────────────────────────────────────────────────────

// FIX: Rate limiter khusus auth
app.use('/api/auth',     authLimiter, authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin',    adminRoutes);

// FIX: AI routes
app.use('/api/ai',       aiRoutes);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message || err);
  console.error('[Error Stack]', err.stack);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`   AI service expected at ${process.env.AI_SERVICE_URL || 'http://localhost:5001'}`);
});

module.exports = app;
