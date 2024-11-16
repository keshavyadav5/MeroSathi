const express = require('express');
const router = express.Router();
const { paperProductCart, updatePaperProductCart, deletePaperProductCart, getAllCartsItems } = require('../controller/paperProduct/PaperproductCart.controller');
const { verifyToken } = require('../utils/verify');
const validateProduct = require('../utils/validateProduct');

router.post('/add-cart-paperproduct', verifyToken,validateProduct, paperProductCart);
router.post('/update-cart-paperproduct/:cartId', verifyToken, updatePaperProductCart)
router.delete('/delete-cart-paperproduct/:cartId', verifyToken, deletePaperProductCart)
router.get('/getAll-cart-items', verifyToken, getAllCartsItems)

module.exports = router;
