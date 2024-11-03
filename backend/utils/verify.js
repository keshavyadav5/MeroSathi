const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config();

const verifyToken = async (req, ress, next) => {
  const cookie = req.headers.cookie;

  if (!cookie) {
    return ress.status(401).send({ message: 'Unauthorized' });
  }
  const token = cookie.split("=")[1];

  if (!token) {
    return ress.status(401).send({ message: 'Unauthorized' });
  }

  jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return ress.status(403).send({ message: 'Failed to authenticate token, login again.' });
    }
    req.id = user.userId,
      req.role = user.role

    next();

  })
}

module.exports = {
  verifyToken
}