const express = require('express');
const { verifyToken } = require('../utils/verify');
const {
  uploadPaperProduct,
  deletePaperProduct,
  updatePaperProduct,
  getPaperProduct
} = require('../controller/paperProduct/paperProduct');
const router = express.Router();

// paper product routes 
router.post('/paper-product/upload',verifyToken, uploadPaperProduct)
router.post('/paper-product/delete/:productId', verifyToken, deletePaperProduct)
router.patch('/paper-product/update/:productId', verifyToken, updatePaperProduct)
router.get('/paper-product', getPaperProduct)

module.exports = router