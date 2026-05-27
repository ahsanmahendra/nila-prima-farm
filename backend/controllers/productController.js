const { pool } = require('../config/database')

// Helper parse array aman
const safeArray = (value) => {
  try {
    if (!value) return []

    // kalau sudah array
    if (Array.isArray(value)) {
      return value
    }

    // kalau string
    if (typeof value === 'string') {

      // coba parse JSON
      try {
        const parsed = JSON.parse(value)

        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch (err) {
        // bukan JSON → split koma
        return value.split(',').map(v => v.trim())
      }
    }

    return []
  } catch (err) {
    return []
  }
}

// Helper parse object aman
const safeObject = (value) => {
  try {
    if (!value) return {}

    // kalau sudah object
    if (typeof value === 'object') {
      return value
    }

    // kalau string JSON
    if (typeof value === 'string') {
      return JSON.parse(value)
    }

    return {}
  } catch (err) {
    return {}
  }
}

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort } = req.query

    let query = 'SELECT * FROM products WHERE is_active = 1'
    const params = []

    if (search) {
      query += ' AND name LIKE ?'
      params.push(`%${search}%`)
    }

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    const sortMap = {
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      newest: 'created_at DESC',
      rating: 'rating DESC',
    }

    query += ` ORDER BY ${sortMap[sort] || 'sold DESC'}`

    const [rows] = await pool.query(query, params)

    const products = rows.map((p) => ({
      ...p,
      images: safeArray(p.images),
      tags: safeArray(p.tags),
      specs: safeObject(p.specs),
    }))

    res.json(products)
  } catch (err) {
    next(err)
  }
}

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND is_active = 1',
      [req.params.id]
    )

    if (!rows.length) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan.',
      })
    }

    const p = rows[0]

    res.json({
      ...p,
      images: safeArray(p.images),
      tags: safeArray(p.tags),
      specs: safeObject(p.specs),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      size,
      price,
      stock,
      description,
      tags,
      specs,
    } = req.body

    if (!name || !price || !stock) {
      return res.status(400).json({
        message: 'Nama, harga, dan stok wajib diisi.',
      })
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null

    const formattedTags = JSON.stringify(
      Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
          ? tags.split(',').map(t => t.trim())
          : []
    )

    const formattedSpecs = JSON.stringify(
      typeof specs === 'object'
        ? specs
        : {}
    )

    const [result] = await pool.query(
      `INSERT INTO products
      (
        name,
        category,
        size,
        price,
        stock,
        description,
        image,
        tags,
        specs,
        rating,
        review_count,
        sold,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 1)`,
      [
        name,
        category || 'Standard',
        size || null,
        Number(price),
        Number(stock),
        description || null,
        image,
        formattedTags,
        formattedSpecs,
      ]
    )

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json(rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      size,
      price,
      stock,
      description,
      tags,
      specs,
      is_active,
    } = req.body

    const [existing] = await pool.query(
      'SELECT id FROM products WHERE id = ?',
      [req.params.id]
    )

    if (!existing.length) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan.',
      })
    }

    const updateFields = {}

    if (name !== undefined) updateFields.name = name
    if (category !== undefined) updateFields.category = category
    if (size !== undefined) updateFields.size = size
    if (price !== undefined) updateFields.price = Number(price)
    if (stock !== undefined) updateFields.stock = Number(stock)
    if (description !== undefined) updateFields.description = description

    if (tags !== undefined) {
      updateFields.tags = JSON.stringify(
        Array.isArray(tags)
          ? tags
          : typeof tags === 'string'
            ? tags.split(',').map(t => t.trim())
            : []
      )
    }

    if (specs !== undefined) {
      updateFields.specs = JSON.stringify(
        typeof specs === 'object'
          ? specs
          : {}
      )
    }

    if (is_active !== undefined) {
      updateFields.is_active = is_active
    }

    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`
    }

    const keys = Object.keys(updateFields)

    if (!keys.length) {
      return res.status(400).json({
        message: 'Tidak ada data yang diupdate.',
      })
    }

    const setClause = keys
      .map((k) => `${k} = ?`)
      .join(', ')

    await pool.query(
      `UPDATE products
       SET ${setClause}, updated_at = NOW()
       WHERE id = ?`,
      [...Object.values(updateFields), req.params.id]
    )

    const [rows] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    )

    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM products WHERE id = ?',
      [req.params.id]
    )

    if (!existing.length) {
      return res.status(404).json({
        message: 'Produk tidak ditemukan.',
      })
    }

    await pool.query(
      'UPDATE products SET is_active = 0 WHERE id = ?',
      [req.params.id]
    )

    res.json({
      message: 'Produk berhasil dihapus.',
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}