const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
