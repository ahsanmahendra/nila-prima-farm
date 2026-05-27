const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// REGISTER
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' })
    }

    // FIX: validasi format email
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Format email tidak valid.' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter.' })
    }

    const emailLower = email.toLowerCase().trim()

    // FIX: cek duplicate email eksplisit
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [emailLower])
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah digunakan.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, emailLower, hashedPassword, phone || null, 'user']
    )

    res.status(201).json({
      message: 'Registrasi berhasil.',
      user: { id: result.insertId, name, email: emailLower, role: 'user' }
    })
  } catch (err) {
    next(err)
  }
}

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // FIX: validasi format email
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' })
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const user = rows[0]
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' })
    }

    const token = generateToken(user)
    delete user.password

    res.json({ token, user, message: 'Login berhasil.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login }