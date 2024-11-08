const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyToken = (req, res, next) => {

  const cookie = req.headers.cookie;
  if (!cookie) {
    console.log("No cookie found");
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = cookie.split("=")[1];
  if (!token) {
    console.log("No token found in cookie");
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ success: false, message: 'Failed to authenticate token, login again.' });
    }

    req.id = decoded.userId;
    req.role = decoded.role;

    next();
  });
};

module.exports = {
  verifyToken,
};
