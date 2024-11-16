const paperProductCartModel = require("../../models/cart/paperproductcart.model");

const paperProductCart = async (req, res) => {
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
  } = req.body;
console.log(req.body);

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

    let cart = await paperProductCartModel.findOne({ userId: id });
    if (!cart) {
      cart = await paperProductCartModel.create({ userId: id, products: [product] });
    } else {
      const existingProduct = cart.products.find(
        (p) =>
          p.details.name === product.details.name &&
          p.details.category === product.details.category &&
          p.details.subcategory === product.details.subcategory
      );

      if (existingProduct) {
        return res.status(400).json({ success: false, message: 'Product already in cart' });
      }

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


const updatePaperProductCart = async (req, res) => {
  const { copy } = req.body;
  const userId = req.id;
  const productId = req.params.cartId;
  const role = req.role;

  try {
    if (role !== 'user') {
      return res.status(403).json({ success: false, message: 'You are not authorized' });
    }

    if (copy <= 0 || copy > 5) {
      return res.status(400).json({ success: false, message: 'You cannot select more than 5 copies' });
    }

    const cart = await paperProductCartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    console.log(cart.products);

    const product = cart.products.find(item => item._id.toString() === productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    product.pricing.copy = copy;
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

const deletePaperProductCart = async (req, res) => {
  const userId = req.id;
  const productId = req.params.cartId;
  const role = req.role;

  try {
    if (role !== 'user') {
      return res.status(403).json({ success: false, message: 'You are not authorized' });
    }

    const cart = await paperProductCartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(item => item._id.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();
    return res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Unable to delete the cart item' });
  }
};

const getAllCartsItems = async (req, res) => {
  const userId = req.id;
  const role = req.role;
  try {
    if (role !== 'user') {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cart = await paperProductCartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "No items in cart",
        totalItems: 0,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart items",
      totalItems: cart.products.length,
      data: cart.products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};





module.exports = {
  paperProductCart,
  updatePaperProductCart,
  deletePaperProductCart,
  getAllCartsItems
};
