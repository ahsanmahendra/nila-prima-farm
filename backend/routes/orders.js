const express = require('express')
const router = express.Router()
const { createOrder, getOrders, getOrderById, cancelOrder } = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)
router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:id', getOrderById)

router.delete('/:id', cancelOrder)

module.exports = router
