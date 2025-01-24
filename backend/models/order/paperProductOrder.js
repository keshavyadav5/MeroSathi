const mongoose = require('mongoose')

const paperproductOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [{
    details: {
      category: {
        type: String,
        required: true,
      },
      subcategory: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        // required: true,
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      format: {
        type: String,
      },
      description: {
        type: String,
        default: "",
      },
      productname: {
        type: String,
      }
    },

    pricing: {
      price: {
        type: Number,
      },
      pages: {
        type: Number,
        required: true,
      },
      copy: {
        type: Number,
        default: 1,
      },
      papersize: {
        type: String,
        default: 'A4',
      },
      papertype: {
        type: String,
        default: '80gsm',
      },
      binding: {
        type: String,
        default: 'no binding',
      },
      printingside: {
        type: String,
        default: 'single',
      },
      orientation: {
        type: String,
        default: 'portrait',
      },
      printcolor: {
        type: String,
        default: 'black&white',
      },
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
  }
  ],
}, { timestamps : true});

const PaperProductOrder = mongoose.model('PaperProductOrder', paperproductOrderSchema);
module.exports = PaperProductOrder;

