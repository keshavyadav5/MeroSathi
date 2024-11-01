const mongoose = require('mongoose');

const paperProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['trending', 'newlaunched', 'upcoming'],
    required : true
  }
})

const Paperproduct = mongoose.model('PapaerProduct', paperProductSchema)
module.exports = Paperproduct;