const axios = require('axios')
require('dotenv').config()

const FONNTE_URL = 'https://api.fonnte.com/send'
const TOKEN = process.env.FONNTE_TOKEN

const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

const sendWA = async (phone, message) => {
  if (!TOKEN || !phone) {
    console.warn('⚠️  Fonnte: token atau nomor tidak tersedia, skip WA.')
    return
  }
  // Normalize phone: strip leading 0, add 62
  const normalized = phone.replace(/^0/, '62').replace(/\D/g, '')
  try {
    const res = await axios.post(
      FONNTE_URL,
      { target: normalized, message, countryCode: '62' },
      { headers: { Authorization: TOKEN } }
    )
    console.log(`📱 WA sent to ${normalized}:`, res.data)
  } catch (err) {
    console.error('❌ Fonnte WA error:', err.response?.data || err.message)
  }
}

// 1. Notifikasi pesanan masuk (ke admin & user)
const sendOrderCreatedWA = async ({ phone, name, orderNumber, total, items }) => {
  const itemLines = items.map(i => `  • ${i.name} — ${i.quantity?.toLocaleString('id-ID')} ekor`).join('\n')
  const message = `🐟 *Nila Prima Farm*
━━━━━━━━━━━━━━━
Halo, *${name}*!

Pesanan Anda telah berhasil dibuat. 🎉

📋 *No. Pesanan:* ${orderNumber}
📦 *Produk:*
${itemLines}

💰 *Total Pembayaran:*
${formatRupiah(total)}

⏳ *Status:* Menunggu Pembayaran

Segera selesaikan pembayaran agar pesanan diproses. 
Terima kasih telah berbelanja di Nila Prima Farm! 🙏`

  await sendWA(phone, message)
}

// 2. Notifikasi pembayaran berhasil
const sendPaymentSuccessWA = async ({ phone, name, orderNumber, total }) => {
  const message = `✅ *Pembayaran Berhasil!*
━━━━━━━━━━━━━━━
Halo, *${name}*!

Pembayaran Anda telah dikonfirmasi. 

📋 *No. Pesanan:* ${orderNumber}
💰 *Total Dibayar:* ${formatRupiah(total)}
📦 *Status:* Sedang Diproses

Tim kami akan segera menyiapkan benih Anda.
Notifikasi pengiriman akan dikirim berikutnya.

🐟 *Nila Prima Farm*
+62 812-3456-7890`

  await sendWA(phone, message)
}

// 3. Notifikasi update status
const sendStatusUpdateWA = async ({ phone, name, orderNumber, status, total }) => {
  const statusEmoji = {
    processing: '🔧 Sedang Diproses',
    shipped: '🚚 Dalam Pengiriman',
    delivered: '✅ Telah Diterima',
    cancelled: '❌ Dibatalkan',
  }
  const label = statusEmoji[status] || status

  const message = `📦 *Update Pesanan*
━━━━━━━━━━━━━━━
Halo, *${name}*!

Ada pembaruan untuk pesanan Anda:

📋 *No. Pesanan:* ${orderNumber}
💰 *Total:* ${formatRupiah(total)}
🔔 *Status Terbaru:* ${label}

${status === 'shipped' ? '🐠 Benih dikemas dengan oksigenasi khusus untuk keamanan pengiriman jarak jauh.' : ''}
${status === 'delivered' ? '🎉 Selamat! Semoga budidaya Anda sukses dan menguntungkan.' : ''}

🐟 *Nila Prima Farm*`

  await sendWA(phone, message)
}

// 4. Notifikasi ke admin saat pesanan baru masuk
const sendNewOrderAdminWA = async ({ adminPhone, orderNumber, userName, total, itemCount }) => {
  const message = `🔔 *Pesanan Baru Masuk!*
━━━━━━━━━━━━━━━
📋 *No. Pesanan:* ${orderNumber}
👤 *Pelanggan:* ${userName}
📦 *Jumlah Item:* ${itemCount} produk
💰 *Total:* ${formatRupiah(total)}

Segera cek panel admin untuk detail pesanan.
🔗 Admin Panel: ${process.env.FRONTEND_URL}/admin/pesanan`

  await sendWA(adminPhone, message)
}

// 5. Reminder checkout (bisa dipanggil via cron job)
const sendCheckoutReminderWA = async ({ phone, name }) => {
  const message = `🛒 *Ada yang Tertinggal di Keranjang!*
━━━━━━━━━━━━━━━
Halo, *${name}*! 

Anda memiliki item yang belum di-checkout di Nila Prima Farm.

Jangan sampai kehabisan stok! Benih kami tersedia terbatas.

👉 Selesaikan pembelian Anda:
${process.env.FRONTEND_URL}/keranjang

🐟 *Nila Prima Farm* — Benih Ikan Nila Premium`

  await sendWA(phone, message)
}

module.exports = {
  sendOrderCreatedWA,
  sendPaymentSuccessWA,
  sendStatusUpdateWA,
  sendNewOrderAdminWA,
  sendCheckoutReminderWA,
}
