const { pool } = require('../config/database')

// GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, city, province, postal_code, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' })
    res.json(rows[0])
  } catch (err) {
    next(err)
  }
}

// PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, province, postal_code } = req.body
    if (!name) return res.status(400).json({ message: 'Nama wajib diisi.' })

    await pool.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, city = ?, province = ?, postal_code = ?, updated_at = NOW() WHERE id = ?',
      [name, phone || null, address || null, city || null, province || null, postal_code || null, req.user.id]
    )

    const [rows] = await pool.query(
      'SELECT id, name, email, phone, address, city, province, postal_code, role FROM users WHERE id = ?',
      [req.user.id]
    )

    res.json({ message: 'Profil berhasil diperbarui.', user: rows[0] })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, updateProfile }
