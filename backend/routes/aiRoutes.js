// backend/routes/aiRoutes.js

const express = require('express');
const router  = express.Router();
const { getInsight, predictOne, chat, aiHealth } = require('../controllers/aiController');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public (chatbot bisa diakses siapa saja)
router.post('/chat',    authMiddleware, chat);
router.get('/health',   aiHealth);

// Admin only
router.get('/insight',  authMiddleware, adminMiddleware, getInsight);
router.post('/predict', authMiddleware, adminMiddleware, predictOne);

module.exports = router;
