const Product = require("../../models/product.model");

const uploadProduct = async (req, res) => {
  const { category, name, subcategory, price, images, description, stock, status, type } = req.body;
  const { role } = req;

  if (role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (!category || !name || !subcategory || !price || !images || !description || !type) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (!Array.isArray(images) || images.length < 1 || images.length > 4) {
    return res.status(400).json({ success: false, message: 'You must upload between 1 and 4 images.' });
  }

  if (price < 20) {
    return res.status(400).json({ success: false, message: 'Price must be at least 20.' });
  }

  try {
    const isAvailable = await Product.findOne({ name, category, subcategory });
    if (isAvailable) {
      return res.status(400).json({ success: false, message: 'Product already exists.' });
    }

    const product = new Product({ category, name, subcategory, price, images, description, stock, status, type });
    const savedProduct = await product.save();

    return res.status(201).json({ success: true, message: 'Product created successfully.', data: savedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { name, price, stock, status, type } = req.body;
  const { role } = req;
  const { productId } = req.params;

  try {
    if (role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const isExistingProduct = await Product.findById(productId);
    if (!isExistingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (price && price < 20) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 20' });
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { name, price, stock, status, type } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Product updated successfully', data: updatedProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const { role } = req;

  try {
    if (role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const isProductExist = await Product.findById(productId);
    if (!isProductExist) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, message: 'Products retrieved successfully', data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};
