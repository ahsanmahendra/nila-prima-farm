const { pool } = require('../config/database')
const { v4: uuidv4 } = require('uuid')
const { sendOrderInvoiceEmail } = require('../utils/brevo')
const { sendOrderCreatedWA, sendNewOrderAdminWA } = require('../utils/fonnte')

const generateOrderNumber = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `NPF-${date}-${rand}`
}

// POST /api/orders
const createOrder = async (req, res, next) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const userId = req.user.id
    const { shipping_address, items, total_amount, shipping_cost = 50000, notes } = req.body

    if (!items || !items.length) return res.status(400).json({ message: 'Items pesanan tidak boleh kosong.' })
    if (!shipping_address?.address) return res.status(400).json({ message: 'Alamat pengiriman wajib diisi.' })

    const orderNumber = generateOrderNumber()

    // Create order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, order_number, status, payment_status, total_amount, shipping_cost, shipping_address, notes)
       VALUES (?, ?, 'pending', 'pending', ?, ?, ?, ?)`,
      [userId, orderNumber, total_amount, shipping_cost, JSON.stringify(shipping_address), notes || null]
    )
    const orderId = orderResult.insertId

    // Insert order items & update stock
    for (const item of items) {
      const [products] = await conn.query('SELECT id, stock, name, price FROM products WHERE id = ? FOR UPDATE', [item.product_id])
      if (!products.length) throw Object.assign(new Error(`Produk ID ${item.product_id} tidak ditemukan.`), { status: 404 })
      if (products[0].stock < item.quantity) throw Object.assign(new Error(`Stok ${products[0].name} tidak mencukupi.`), { status: 400 })

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price || products[0].price]
      )

      await conn.query('UPDATE products SET stock = stock - ?, sold = sold + ? WHERE id = ?', [item.quantity, item.quantity, item.product_id])
    }

    // Clear user's cart
    const [carts] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [userId])
    if (carts.length) {
      await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id])
    }

    await conn.commit()

    // Fetch full order with items
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId])
    const [itemRows] = await pool.query(`
      SELECT oi.*, p.name, p.image, p.size FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
    `, [orderId])

    const fullOrder = {
  ...orderRows[0],
  shipping_address:
    typeof orderRows[0].shipping_address === 'string'
      ? JSON.parse(orderRows[0].shipping_address)
      : orderRows[0].shipping_address,
  items: itemRows,
}

    // Notifications (non-blocking)
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId])
    const user = userRows[0]

    sendOrderInvoiceEmail(user, fullOrder, itemRows).catch(console.error)
    sendOrderCreatedWA({
      phone: user.phone,
      name: user.name,
      orderNumber,
      total: total_amount,
      items: itemRows,
    }).catch(console.error)
    sendNewOrderAdminWA({
      adminPhone: process.env.ADMIN_PHONE || '081234567890',
      orderNumber,
      userName: user.name,
      total: total_amount,
      itemCount: itemRows.length,
    }).catch(console.error)

    res.status(201).json(fullOrder)
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    conn.release()
  }
}

// GET /api/orders (user's own orders)
const getOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    )

    const result = await Promise.all(orders.map(async (order) => {
      const [items] = await pool.query(`
        SELECT oi.*, p.name, p.image FROM order_items oi
        JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
      `, [order.id])
      return {
        ...order,
        shipping_address:
  typeof order.shipping_address === 'string'
    ? JSON.parse(order.shipping_address)
    : order.shipping_address || {},
        items,
      }
    }))

    res.json(result)
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id])
    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image, p.size FROM order_items oi
      JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
    `, [req.params.id])

    res.json({
      ...orders[0],
      shipping_address:
  typeof orders[0].shipping_address === 'string'
    ? JSON.parse(orders[0].shipping_address)
    : orders[0].shipping_address || {},
      items,
    })
  } catch (err) {
    next(err)
  }
}


// DELETE /api/orders/:id (user cancel — hanya pesanan pending)
const cancelOrder = async (req, res, next) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    )
    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const order = orders[0]
    if (!['pending', 'cancelled'].includes(order.status) || order.payment_status === 'settlement') {
      return res.status(400).json({ message: 'Pesanan yang sudah dibayar tidak dapat dibatalkan.' })
    }

    // Kembalikan stok
    const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
    for (const item of items) {
      await conn.query(
        'UPDATE products SET stock = stock + ?, sold = sold - ? WHERE id = ?',
        [item.quantity, item.quantity, item.product_id]
      )
    }

    await conn.query(
      "UPDATE orders SET status = 'cancelled', payment_status = 'cancel' WHERE id = ?",
      [order.id]
    )

    await conn.commit()
    res.json({ message: 'Pesanan berhasil dibatalkan.' })
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    conn.release()
  }
}

module.exports = { createOrder, getOrders, getOrderById, cancelOrder }
