const productOrdermodel = require("../../models/order/productOrder");

const uploadproductOrder = async (req, res) => {
  const {
    category,
    subcategory,
    logo,
    name,
    color,
    size,
    quantity,
    printlocation,
    fontlogosize,
    backlogosize,
    price
  } = req.body;

  const role = req.role;
  const userId = req.id;

  try {
    if (role !== 'user') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!category || !subcategory || !name || !price) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newProduct = {
      details: {
        category,
        subcategory,
        logo,
        name,
        color,
        size,
      },
      pricing: {
        quantity,
        printlocation,
        fontlogosize,
        backlogosize,
        price
      }
    };

    let cart = await productOrdermodel.findOne({ userId });

    if (!cart) {
      cart = await productOrdermodel.create({ userId, products: [newProduct] });
    }

    cart.product.push(newProduct);
    await cart.save();

    return res.status(201).json({
      message: "Product added to cart successfully",
      products: cart,
    });

  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    return res.status(500).json({ success: false, message: 'Not able to add to cart' });
  }
};

const updateProductOrder = async (req, res) => {
  const { orderConfirmed, shipped, outForDelivery, delivered, cancel } = req.body;
  const userId = req.id;
  const productId = req.params.cartId;
  const role = req.role;

  try {
    if (role !== 'user') {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cart = await productOrdermodel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const products = cart.product.find((product) => product._id.toString() === productId);

    if (!products) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    products.order.orderConfirmed = orderConfirmed;
    products.order.shipped = shipped;
    products.order.outForDelivery = outForDelivery;
    products.order.delivered = delivered;
    products.order.cancel = cancel;
    await cart.save();

    return res.status(200).json({ success: true, message: "Product quantity updated successfully" });

  } catch (error) {
    console.error("Error updating cart:", error.message);
    return res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

module.exports = {
  uploadproductOrder,
  updateProductOrder,
}