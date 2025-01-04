const express = require('express');
const router = express.Router();
const {
  paperProductCart,
  updatePaperProductCart,
  deletePaperProductCart,
  getAllCartsItems
} = require('../controller/paperProduct/PaperproductCart.controller');

const { verifyToken } = require('../utils/verify');
const validateProduct = require('../utils/validateProduct');
const {
  addProductToCart,
  updateProductCart,
  deleteProductToCart
} = require('../controller/product/productCart.controller');

router.post('/add-cart-paperproduct', verifyToken, validateProduct, paperProductCart);
router.patch('/update-cart-paperproduct/:cartId', verifyToken, updatePaperProductCart)
router.delete('/delete-cart-paperproduct/:cartId', verifyToken, deletePaperProductCart)
router.get('/getAll-cart-items', verifyToken, getAllCartsItems)

router.post('/add-cart-product', verifyToken, addProductToCart);
router.patch('/update-cart-product/:cartId', verifyToken, updateProductCart);
router.delete('/delete-cart-product/:cartId', verifyToken, deleteProductToCart);

module.exports = router;
