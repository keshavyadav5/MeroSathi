const express = require('express');
const { Signup,
  Signin,
  verifyEmail,
  signOut,
  updateUser,
  updatePassword,
  deleteUser }
  = require('../controller/auth.controller');

const { verifyToken } = require('../utils/verify');
const router = express.Router();


router.post('/signup', Signup);
router.post('/signin', Signin);
router.post('/signout', signOut)
router.post('/update/:userId', verifyToken, updateUser)
router.post('/update-password/:userId', verifyToken, updatePassword)
router.delete('/delete-user/:userId', verifyToken, deleteUser)

// router.post('/verify-email', verifyEmail)

module.exports = router