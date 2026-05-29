const midtransClient = require('midtrans-client')
const { pool } = require('../config/database')
const { sendPaymentSuccessEmail } = require('../utils/brevo')
const { sendPaymentSuccessWA } = require('../utils/fonnte')
require('dotenv').config()

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
})

// POST /api/payment/create
const createPayment = async (req, res, next) => {
  try {
    const { order_id } = req.body
    const userId = req.user.id

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [order_id, userId])
    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const order = orders[0]
    if (order.payment_status === 'settlement') {
      return res.status(400).json({ message: 'Pesanan sudah dibayar.' })
    }

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const [items] = await pool.query(`
      SELECT oi.*, p.name FROM order_items oi
      JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
    `, [order_id])

    const itemDetails = items.map(i => ({
      id: `PRODUCT-${i.product_id}`,
      price: Math.round(i.price),
      quantity: i.quantity,
      name: i.name.substring(0, 50),
    }))

    // Add shipping as item
    itemDetails.push({
      id: 'SHIPPING',
      price: Math.round(order.shipping_cost),
      quantity: 1,
      name: 'Ongkos Kirim',
    })

    const parameter = {
      transaction_details: {
        order_id: `${order.order_number}-${Date.now()}`,
        gross_amount: Math.round(order.total_amount),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: user[0].name,
        email: user[0].email,
        phone: user[0].phone || '',
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/riwayat`,
        error: `${process.env.FRONTEND_URL}/pembayaran`,
        pending: `${process.env.FRONTEND_URL}/riwayat`,
      },
    }

    const transaction = await snap.createTransaction(parameter)

    // Save snap token
    await pool.query(
      `INSERT INTO payments (order_id, snap_token, midtrans_order_id, status, amount)
       VALUES (?, ?, ?, 'pending', ?)
       ON DUPLICATE KEY UPDATE snap_token = ?, midtrans_order_id = ?`,
      [order_id, transaction.token, parameter.transaction_details.order_id, order.total_amount, transaction.token, parameter.transaction_details.order_id]
    )

    res.json({ snap_token: transaction.token, redirect_url: transaction.redirect_url })
  } catch (err) {
    next(err)
  }
}

// POST /api/payment/webhook  (Midtrans notification)
const handleWebhook = async (req, res, next) => {
  try {
    // Parse body — bisa Buffer (dari express.raw) atau object (dari express.json)
    let notification = req.body
    if (Buffer.isBuffer(notification)) {
      notification = JSON.parse(notification.toString('utf8'))
    } else if (typeof notification === 'string') {
      notification = JSON.parse(notification)
    }
    console.log('📨 Midtrans Webhook:', notification)

    // Verify signature
    let statusResponse
    try {
      statusResponse = await coreApi.transaction.notification(notification)
    } catch {
      statusResponse = notification
    }

    const { order_id: midtransOrderId, transaction_status, fraud_status, payment_type } = statusResponse

    let paymentStatus = 'pending'
    let orderStatus = 'pending'

    if (transaction_status === 'capture') {
      paymentStatus = fraud_status === 'challenge' ? 'challenge' : 'settlement'
      if (paymentStatus === 'settlement') orderStatus = 'processing'
    } else if (transaction_status === 'settlement') {
      paymentStatus = 'settlement'
      orderStatus = 'processing'
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      paymentStatus = transaction_status
      orderStatus = transaction_status === 'cancel' ? 'cancelled' : 'pending'
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending'
    }

    // Find payment by midtrans_order_id
    const [payments] = await pool.query('SELECT * FROM payments WHERE midtrans_order_id = ?', [midtransOrderId])
    if (!payments.length) {
      console.warn('Payment not found for midtrans_order_id:', midtransOrderId)
      return res.json({ message: 'ok' })
    }

    const payment = payments[0]

    // Update payment
    await pool.query(
      'UPDATE payments SET status = ?, payment_type = ?, transaction_id = ?, paid_at = ? WHERE id = ?',
      [paymentStatus, payment_type, statusResponse.transaction_id, paymentStatus === 'settlement' ? new Date() : null, payment.id]
    )

    // Update order
    await pool.query(
      'UPDATE orders SET payment_status = ?, status = ? WHERE id = ?',
      [paymentStatus, orderStatus, payment.order_id]
    )

    // Send success notifications
    if (paymentStatus === 'settlement') {
      const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [payment.order_id])
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [orders[0].user_id])
      const user = users[0]
      const order = orders[0]

      sendPaymentSuccessEmail(user, order).catch(console.error)
      sendPaymentSuccessWA({ phone: user.phone, name: user.name, orderNumber: order.order_number, total: order.total_amount }).catch(console.error)
    }

    res.json({ message: 'Webhook processed.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createPayment, handleWebhook }
