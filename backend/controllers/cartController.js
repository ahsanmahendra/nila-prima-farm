const { pool } = require('../config/database')

// GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id

    // Get or create cart
    let [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId])
    if (!carts.length) {
      const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId])
      carts = [{ id: result.insertId }]
    }
    const cartId = carts[0].id

    const [items] = await pool.query(`
      SELECT ci.id, ci.product_id, ci.quantity,
             p.name, p.price, p.image, p.stock, p.size
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
    `, [cartId])

    res.json({ cart_id: cartId, items })
  } catch (err) {
    next(err)
  }
}

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { product_id, quantity = 1 } = req.body

    if (!product_id) return res.status(400).json({ message: 'product_id wajib diisi.' })
    if (quantity < 1) return res.status(400).json({ message: 'Quantity harus minimal 1.' })

    // Check product
    const [products] = await pool.query(
  'SELECT id, stock FROM products WHERE id = ?',
  [product_id]
)
    if (!products.length) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
    if (products[0].stock < quantity) return res.status(400).json({ message: 'Stok tidak mencukupi.' })

    // Get or create cart
    let [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId])
    if (!carts.length) {
      const [r] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId])
      carts = [{ id: r.insertId }]
    }
    const cartId = carts[0].id

    // Check if item exists
    const [existing] = await pool.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id])

    if (existing.length) {
      const newQty = existing[0].quantity + quantity
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id])
    } else {
      await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, product_id, quantity])
    }

    res.status(201).json({ message: 'Produk berhasil ditambahkan ke keranjang.' })
  } catch (err) {
    next(err)
  }
}

// PUT /api/cart/:id
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity tidak valid.' })

    const [items] = await pool.query(`
      SELECT ci.id FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      WHERE ci.id = ? AND c.user_id = ?
    `, [req.params.id, req.user.id])

    if (!items.length) return res.status(404).json({ message: 'Item tidak ditemukan.' })

    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id])
    res.json({ message: 'Keranjang diperbarui.' })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/cart/:id
const removeFromCart = async (req, res, next) => {
  try {
    const [items] = await pool.query(`
      SELECT ci.id FROM cart_items ci
      JOIN carts c ON c.id = ci.cart_id
      WHERE ci.id = ? AND c.user_id = ?
    `, [req.params.id, req.user.id])

    if (!items.length) return res.status(404).json({ message: 'Item tidak ditemukan.' })

    await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id])
    res.json({ message: 'Item dihapus dari keranjang.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart }
