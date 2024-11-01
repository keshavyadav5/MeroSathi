const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateTokenAndSetCookie = (res, userId, role) => {
  const token = jwt.sign({ userId, role }, process.env.SECRET_KEY, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "strict",
  });

  return token;
};

module.exports = generateTokenAndSetCookie;
