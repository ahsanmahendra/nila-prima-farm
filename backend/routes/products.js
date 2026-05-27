const express = require('express')
const router = express.Router()
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const upload = require('../config/multer')

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, adminMiddleware, upload.single('image'), createProduct)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

module.exports = router
