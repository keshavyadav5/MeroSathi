const express = require('express');
const { verifyToken } = require('../utils/verify');
const {
  uploadPaperProduct,
  deletePaperProduct,
  updatePaperProduct, 
  getPaperProduct
} = require('../controller/paperProduct/paperProduct');

const { 
  uploadProduct, 
  updateProduct,
  getProduct,
  deleteProduct
} = require('../controller/product/product.controller');
const { uploadPaperProductOrder } = require('../controller/order/paperproductController');
const router = express.Router();

// paper product routes 
router.post('/paper-product/upload',verifyToken, uploadPaperProduct)
router.delete('/paper-product/delete/:productId', verifyToken, deletePaperProduct)
router.patch('/paper-product/update/:productId', verifyToken, updatePaperProduct)
router.get('/paper-product', getPaperProduct)

// product routes except paper product
router.post('/product/upload',verifyToken, uploadProduct);
router.delete('/product/delete/:productId',verifyToken, deleteProduct)
router.patch('/product/update/:productId',verifyToken,updateProduct);
router.get('/product/getProduct',getProduct)

module.exports = router