const express = require('express')
const router = express.Router()
const { createPayment, handleWebhook } = require('../controllers/paymentController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, createPayment)
router.post('/webhook', handleWebhook) // no auth - called by Midtrans server

module.exports = router
