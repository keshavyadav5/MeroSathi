const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true,
    min: 10
  },
  images: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 4;
      },
      message: props => `${props.value.length} exceeds the limit of 4 images!`
    },
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['trending', 'newlaunched', 'upcoming', 'uncharacterized'],
    default : 'uncharacterized',
  },
  type: {
    type: String,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;