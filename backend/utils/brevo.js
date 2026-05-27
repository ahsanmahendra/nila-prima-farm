const Brevo = require('@getbrevo/brevo')
require('dotenv').config()

const apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

const SENDER = {
  email: process.env.BREVO_SENDER_EMAIL || 'noreply@nilaprimafarm.id',
  name: process.env.BREVO_SENDER_NAME || 'Nila Prima Farm',
}

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

// Base email template
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Nila Prima Farm</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; color: #1e293b; }
    .wrapper { max-width: 600px; margin: 30px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: #bae6fd; margin: 4px 0 0; font-size: 13px; }
    .body { padding: 32px; }
    .greeting { font-size: 16px; color: #334155; margin-bottom: 20px; }
    .info-box { background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .label { color: #64748b; }
    .value { font-weight: 600; color: #1e293b; }
    .total-row { background: #eff6ff; border-radius: 8px; padding: 12px 16px; margin-top: 12px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; }
    .total-row .amount { color: #1d6fce; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-paid { background: #d1fae5; color: #065f46; }
    .btn { display: inline-block; background: linear-gradient(135deg, #1d6fce, #0284c7); color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .divider { height: 1px; background: #e2e8f0; margin: 20px 0; }
    table.items { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table.items th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 12px; color: #64748b; font-weight: 600; }
    table.items td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🐟 Nila Prima Farm</h1>
      <p>Supplier Benih Ikan Nila Premium Terpercaya</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© 2025 Nila Prima Farm · Jl. Raya Budidaya No.12, Bogor · +62 812-3456-7890</p>
      <p>Email ini dikirim secara otomatis, harap tidak membalas.</p>
    </div>
  </div>
</body>
</html>
`

// Send generic email
const sendEmail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail()
    sendSmtpEmail.sender = SENDER
    sendSmtpEmail.to = [{ email: to.email, name: to.name || to.email }]
    sendSmtpEmail.subject = subject
    sendSmtpEmail.htmlContent = html

    await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log(`📧 Email sent to ${to.email}: ${subject}`)
  } catch (err) {
    console.error('❌ Brevo email error:', err.message)
  }
}

// 1. Welcome / Registration email
const sendWelcomeEmail = async (user) => {
  const html = baseTemplate(`
    <p class="greeting">Halo, <strong>${user.name}</strong>! 👋</p>
    <p>Selamat bergabung di <strong>Nila Prima Farm</strong>! Akun Anda telah berhasil dibuat.</p>
    <div class="info-box">
      <div class="info-row"><span class="label">Nama</span><span class="value">${user.name}</span></div>
      <div class="info-row"><span class="label">Email</span><span class="value">${user.email}</span></div>
      <div class="info-row"><span class="label">Terdaftar</span><span class="value">${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
    </div>
    <p>Kini Anda bisa mulai menjelajahi katalog benih ikan nila premium kami dan memesan langsung melalui website.</p>
    <a href="${process.env.FRONTEND_URL}" class="btn">🛒 Mulai Belanja Sekarang</a>
    <p style="font-size:13px; color:#64748b;">Ada pertanyaan? Hubungi kami di WhatsApp +62 812-3456-7890</p>
  `)

  await sendEmail({ to: { email: user.email, name: user.name }, subject: '🐟 Selamat Datang di Nila Prima Farm!', html })
}

// 2. Order invoice email
const sendOrderInvoiceEmail = async (user, order, items) => {
  const itemsHtml = items.map(i => `
    <tr>
      <td>${i.name}</td>
      <td>${i.quantity?.toLocaleString('id-ID')} ekor</td>
      <td>${formatRupiah(i.price)}</td>
      <td><strong>${formatRupiah(i.price * i.quantity)}</strong></td>
    </tr>
  `).join('')

  const html = baseTemplate(`
    <p class="greeting">Halo, <strong>${user.name}</strong>!</p>
    <p>Pesanan Anda telah berhasil dibuat. Berikut adalah detail invoice pesanan Anda:</p>

    <div class="info-box">
      <div class="info-row"><span class="label">No. Pesanan</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Tanggal</span><span class="value">${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
      <div class="info-row">
        <span class="label">Status Pembayaran</span>
        <span class="status-badge status-pending">⏳ Menunggu Pembayaran</span>
      </div>
    </div>

    <h3 style="font-size:14px; color:#475569; margin-bottom:8px;">Detail Produk</h3>
    <table class="items">
      <thead><tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div class="info-box">
      <div class="info-row"><span class="label">Subtotal</span><span class="value">${formatRupiah(order.total_amount - order.shipping_cost)}</span></div>
      <div class="info-row"><span class="label">Ongkir</span><span class="value">${formatRupiah(order.shipping_cost)}</span></div>
    </div>
    <div class="total-row"><span>Total Pembayaran</span><span class="amount">${formatRupiah(order.total_amount)}</span></div>

    <a href="${process.env.FRONTEND_URL}/pembayaran" class="btn">💳 Selesaikan Pembayaran</a>
    <p style="font-size:13px; color:#94a3b8;">Pesanan akan dibatalkan otomatis jika pembayaran tidak dilakukan dalam 24 jam.</p>
  `)

  await sendEmail({ to: { email: user.email, name: user.name }, subject: `📦 Invoice Pesanan #${order.order_number} - Nila Prima Farm`, html })
}

// 3. Payment success email
const sendPaymentSuccessEmail = async (user, order) => {
  const html = baseTemplate(`
    <p class="greeting">Halo, <strong>${user.name}</strong>! 🎉</p>
    <p>Pembayaran Anda telah <strong>berhasil dikonfirmasi</strong>. Pesanan Anda sedang kami proses.</p>

    <div class="info-box">
      <div class="info-row"><span class="label">No. Pesanan</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Total Dibayar</span><span class="value">${formatRupiah(order.total_amount)}</span></div>
      <div class="info-row">
        <span class="label">Status</span>
        <span class="status-badge status-paid">✅ Lunas</span>
      </div>
    </div>

    <p>Tim kami akan segera memproses dan mempersiapkan benih Anda untuk pengiriman. Anda akan mendapatkan notifikasi ketika pesanan dikirim.</p>
    <a href="${process.env.FRONTEND_URL}/riwayat" class="btn">📋 Lacak Pesanan</a>
  `)

  await sendEmail({ to: { email: user.email, name: user.name }, subject: `✅ Pembayaran Berhasil - Pesanan #${order.order_number}`, html })
}

// 4. Order status update email
const sendOrderStatusEmail = async (user, order, newStatus) => {
  const statusMap = {
    processing: { label: '🔧 Sedang Diproses', desc: 'Pesanan Anda sedang kami siapkan dengan penuh perhatian.' },
    shipped: { label: '🚚 Dalam Pengiriman', desc: 'Benih Anda sudah dalam perjalanan dengan kemasan oksigenasi khusus.' },
    delivered: { label: '✅ Telah Diterima', desc: 'Pesanan Anda telah berhasil diterima. Selamat berbudidaya!' },
    cancelled: { label: '❌ Dibatalkan', desc: 'Pesanan Anda telah dibatalkan. Hubungi kami jika ada pertanyaan.' },
  }
  const info = statusMap[newStatus] || { label: newStatus, desc: '' }

  const html = baseTemplate(`
    <p class="greeting">Halo, <strong>${user.name}</strong>!</p>
    <p>Ada pembaruan status untuk pesanan Anda:</p>

    <div class="info-box">
      <div class="info-row"><span class="label">No. Pesanan</span><span class="value">${order.order_number}</span></div>
      <div class="info-row"><span class="label">Status Terbaru</span><span class="value">${info.label}</span></div>
      <div class="info-row"><span class="label">Total</span><span class="value">${formatRupiah(order.total_amount)}</span></div>
    </div>

    <p>${info.desc}</p>
    <a href="${process.env.FRONTEND_URL}/riwayat" class="btn">📋 Lihat Detail Pesanan</a>
  `)

  await sendEmail({ to: { email: user.email, name: user.name }, subject: `📦 Update Pesanan #${order.order_number}: ${info.label}`, html })
}

module.exports = {
  sendWelcomeEmail,
  sendOrderInvoiceEmail,
  sendPaymentSuccessEmail,
  sendOrderStatusEmail,
}
