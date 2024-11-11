const express = require('express');
const router = express.Router();
const { paperProductCart, updatePaperProductCart, deletePaperProductCart, getAllCartsItems } = require('../controller/paperProduct/PaperproductCart.controller');
const { verifyToken } = require('../utils/verify');

router.post('/add-cart-paperproduct', verifyToken, paperProductCart);
router.post('/update-cart-paperproduct/:cartId', verifyToken, updatePaperProductCart)
router.delete('/delete-cart-paperproduct/:cartId', verifyToken, deletePaperProductCart)
router.get('/getAll-cart-items', verifyToken, getAllCartsItems)

module.exports = router;
