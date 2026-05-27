const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Data sudah ada (duplikasi).' })
  }

  if (err.message && err.message.includes('file')) {
    return res.status(400).json({ message: err.message })
  }

  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan pada server.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorMiddleware
