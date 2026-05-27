const express = require('express')
const router = express.Router()
const { getAdminOrders, getAdminOrderById, updateAdminOrder, getAdminStats, getAdminUsers } = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

router.use(authMiddleware, adminMiddleware)

router.get('/stats', getAdminStats)
router.get('/orders', getAdminOrders)
router.get('/orders/:id', getAdminOrderById)
router.put('/orders/:id', updateAdminOrder)
router.get('/users', getAdminUsers)

module.exports = router
