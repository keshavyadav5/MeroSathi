const paperproductOrdermodel = require("../../models/order/paperProductOrder");
const productOrdermodel = require("../../models/order/productOrder");


const uploadPaperProductOrder = async (req, res) => {
  const {
    category,
    subcategory,
    imageUrl,
    price,
    name,
    description,
    pages,
    copy,
    size,
    format,
    papersize,
    papertype,
    binding,
    printingside,
    orientation,
    printcolor,
    productname,
  } = req.body;

  const role = req.role;
  const id = req.id;

  try {
    if (role !== 'user') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const product = {
      details: {
        category,
        subcategory,
        imageUrl,
        name,
        size,
        format,
        description,
        productname
      },
      pricing: {
        price,
        pages,
        copy,
        papersize,
        papertype,
        binding,
        printingside,
        orientation,
        printcolor,
      },
    };

    let cart = await paperproductOrdermodel.findOne({ userId: id });
    if (!cart) {
      cart = await paperproductOrdermodel.create({ userId: id, products: [product] });
    } else {
      const existingProduct = cart.products.find(
        (p) =>
          p.details.productname === product.details.productname &&
          p.details.category === product.details.category &&
          p.details.subcategory === product.details.subcategory
      );

      cart.products.push(product);
      await cart.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Product added to cart successfully',
      products: cart.products,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error.message);
    return res.status(500).json({ success: false, message: 'Not able to add to cart' });
  }
};


const updatePaperProductOrder = async (req, res) => {
  const { orderConfirmed, shipped, outForDelivery, delivered, cancel } = req.body;
  const userId = req.id;
  const productId = req.params.cartId;
  const role = req.role;

  try {
    if (role !== 'user') {
      return res.status(403).json({ success: false, message: 'You are not authorized' });
    }

    const cart = await paperproductOrdermodel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const product = cart.products.find(item => item._id.toString() === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    product.order.orderConfirmed = orderConfirmed;
    product.order.shipped = shipped;
    product.order.outForDelivery = outForDelivery;
    product.order.delivered = delivered;
    product.order.cancel = cancel;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      cart,
    });
  } catch (error) {
    console.error("Error updating product in cart:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPaperProductOrder = async (req, res) => {
  const userId = req.id;
  const role = req.role;
  try {
    if (role !== 'user') {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cart = await paperproductOrdermodel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "No items in paper product cart",
        totalItems: 0,
        data: [],
      });
    }

    const productCart = await productOrdermodel.findOne({ userId });
    if (!productCart) {
      return res.status(200).json({
        success: true,
        message: "No items in product cart",
        totalItems: 0,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart items",
      totalItems: cart.products.length + productCart.product.length,
      data: cart.products,
      productCartData: productCart.product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  uploadPaperProductOrder,
  updatePaperProductOrder,
  getAllPaperProductOrder
};
