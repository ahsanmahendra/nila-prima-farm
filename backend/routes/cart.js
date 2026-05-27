const express = require('express')
const router = express.Router()
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)
router.get('/', getCart)
router.post('/', addToCart)
router.put('/:id', updateCartItem)
router.delete('/:id', removeFromCart)

module.exports = router
