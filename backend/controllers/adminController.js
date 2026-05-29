const { pool } = require('../config/database')
const { sendOrderStatusEmail } = require('../utils/brevo')
const { sendStatusUpdateWA } = require('../utils/fonnte')

// GET /api/admin/orders
const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const offset = (page - 1) * limit

    let query = `
      SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
             COUNT(oi.id) as items_count
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE 1=1
    `
    const params = []

    if (status) { query += ' AND o.status = ?'; params.push(status) }
    if (search) { query += ' AND (o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?'
    params.push(Number(limit), Number(offset))

    const [orders] = await pool.query(query, params)
    res.json(orders.map(o => ({ ...o, shipping_address: o.shipping_address ? JSON.parse(o.shipping_address) : {} })))
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/orders/:id
const getAdminOrderById = async (req, res, next) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?
    `, [req.params.id])

    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.image, p.size FROM order_items oi
      JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?
    `, [req.params.id])

    const [payments] = await pool.query('SELECT * FROM payments WHERE order_id = ?', [req.params.id])

    const order = orders[0]
    res.json({
      ...order,
      shipping_address: order.shipping_address ? JSON.parse(order.shipping_address) : {},
      user: { name: order.user_name, email: order.user_email, phone: order.user_phone },
      items,
      payment: payments[0] || null,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/orders/:id
const updateAdminOrder = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Status tidak valid.' })

    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const order = orders[0]
    await pool.query('UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?', [status, req.params.id])

    // Notify user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [order.user_id])
    const user = users[0]
    if (user) {
      sendOrderStatusEmail(user, order, status).catch(console.error)
      sendStatusUpdateWA({ phone: user.phone, name: user.name, orderNumber: order.order_number, status, total: order.total_amount }).catch(console.error)
    }

    res.json({ message: 'Status pesanan berhasil diperbarui.', status })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/stats
const getAdminStats = async (req, res, next) => {
  try {
    const [[{ total_orders }]] = await pool.query('SELECT COUNT(*) as total_orders FROM orders')
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) as total_users FROM users WHERE role = 'user'")
    const [[{ total_products }]] = await pool.query('SELECT COUNT(*) as total_products FROM products WHERE is_active = 1')
    const [[{ total_revenue }]] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM orders WHERE payment_status = 'settlement'")
    const [[{ pending_orders }]] = await pool.query("SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'")

    const [recent_orders] = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC LIMIT 5
    `)

    res.json({ total_orders, total_users, total_products, total_revenue, pending_orders, recent_orders })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users
const getAdminUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC')
    res.json(users)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/orders/:id
const deleteAdminOrder = async (req, res, next) => {
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [orders] = await conn.query('SELECT * FROM orders WHERE id = ?', [req.params.id])
    if (!orders.length) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

    const order = orders[0]

    // Kembalikan stok jika belum settlement
    if (order.payment_status !== 'settlement') {
      const [items] = await conn.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
      for (const item of items) {
        await conn.query(
          'UPDATE products SET stock = stock + ?, sold = sold - ? WHERE id = ?',
          [item.quantity, item.quantity, item.product_id]
        )
      }
    }

    // Hapus semua relasi lalu order
    await conn.query('DELETE FROM order_items WHERE order_id = ?', [order.id])
    await conn.query('DELETE FROM payments WHERE order_id = ?', [order.id])
    await conn.query('DELETE FROM orders WHERE id = ?', [order.id])

    await conn.commit()
    res.json({ message: 'Pesanan berhasil dihapus.' })
  } catch (err) {
    await conn.rollback()
    next(err)
  } finally {
    conn.release()
  }
}

module.exports = { getAdminOrders, getAdminOrderById, updateAdminOrder, deleteAdminOrder, getAdminStats, getAdminUsers }
