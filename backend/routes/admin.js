const express = require('express');
const { verifyToken } = require('../utils/verify');
const { getAllUser, getAllProducts } = require('../controller/admin/admin');
const router = express.Router();


router.get('/getAllUsers', verifyToken, getAllUser);
router.get('/getAllProducts',verifyToken, getAllProducts);

module.exports = router