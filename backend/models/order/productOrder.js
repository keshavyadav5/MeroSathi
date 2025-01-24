const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  product: [{
    details: {
      category: {
        type: String,
        required: true,
      },
      subcategory: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: "black"
      },
      size: {
        type: String,
        default: "m"
      }
    },
    pricing: {
      quantity: {
        type: Number,
        default: 1
      },
      printlocation: {
        type: String,
        default: 'front'
      },
      fontlogosize: {
        type: String,
        default: '4/4'
      },
      backlogosize: {
        type: String,
        default: '4/4'
      },
      price: {
        type: Number,
        required: true
      }
    },

    order: {
      orderConfirmed: {
        type: Boolean,
        default: false
      },
      shipped: {
        type: Boolean,
        default: false
      },
      orderDate: {
        type: Date,
        required: true
      },
      outForDelivery: {
        type: Boolean,
        default: false
      },
      delivered: {
        type: Boolean,
        default: false
      },
      cancel: {
        type: Boolean,
        default: false
      }
    }
  }]
})

const productOrdermodel = mongoose.model('productOrderModel', productOrderSchema);
module.exports = productOrdermodel;