const express = require('express')
const dotenv = require('dotenv')
const db = require('./db/connectDB')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
dotenv.config();
const authRouter = require('./routes/auth.route')
const paperProduct = require('./routes/product.route')

// Middleware
app.use(cors({
  origin: 'http://localhost:1920',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());


app.use('/api/auth', authRouter)
app.use('/api',paperProduct)


const port = process.env.PORT || 3000;
app.listen(3000, () => {
  db()
  console.log('Server is running on port 3000');
})