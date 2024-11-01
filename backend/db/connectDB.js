const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error to connect with database', error.message);
    process.exit(1);
  }
}

module.exports = connectDb