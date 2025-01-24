const express = require('express');
const router = express.Router();

const { verifyToken } = require('../utils/verify');
const {
  uploadPaperProductOrder,
  updatePaperProductOrder,
  getAllPaperProductOrder
} = require('../controller/order/paperproductController');

const {
  uploadproductOrder,
  updateProductOrder
} = require('../controller/order/productController');

// paper product order routes
router.post('/upload', verifyToken, uploadPaperProductOrder);
router.post('/update/:orderId', verifyToken, updatePaperProductOrder);
router.get('/getAllPapaerProductOrder', verifyToken, getAllPaperProductOrder);

//product oreder routes
router.post('/product/upload', verifyToken, uploadproductOrder)
router.post('/update/product/:orderId', verifyToken, updateProductOrder);

module.exports = router