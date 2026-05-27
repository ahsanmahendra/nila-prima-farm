const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token autentikasi diperlukan.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const [rows] = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [decoded.id])
    if (!rows.length) return res.status(401).json({ message: 'Pengguna tidak ditemukan.' })

    req.user = rows[0]
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token sudah kedaluwarsa.' })
    return res.status(401).json({ message: 'Token tidak valid.' })
  }
}

module.exports = authMiddleware
