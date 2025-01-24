const express = require('express')
const dotenv = require('dotenv')
const db = require('./db/connectDB')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
dotenv.config();
const authRouter = require('./routes/auth.route')
const product = require('./routes/product.route')
const adminRoute = require('./routes/admin')
const cart = require('./routes/user.route')
const order = require('./routes/order.route')

// Middleware
app.use(cors({
  origin: 'http://localhost:1920',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());


app.use('/api/auth', authRouter)
app.use('/api', product)
app.use('/api/admin', adminRoute)
app.use('/api/user', cart)
app.use('/api/order', order)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  db()
  console.log('Server is running on port 3000');
})