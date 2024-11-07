const Paperproduct = require("../../models/paperproduct.model");

const uploadPaperProduct = async (req, res) => {
  const { name, category, subcategory, image, price, status } = req.body;
  const role = req.role;

  try {
    if (role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!name || !category || !subcategory || !image || !price || !status) {
      return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    if (price < 1) {
      return res.status(400).json({ success: false, message: "Price should be greater or equal to 1" });
    }

    const isAvailable = await Paperproduct.findOne({ name, category, subcategory });
    if (isAvailable) {
      return res.status(400).json({ success: false, message: "Product already exists" });
    }

    const paperProduct = new Paperproduct({
      name,
      category,
      subcategory,
      image,
      price,
      status
    });

    await paperProduct.save();
    return res.status(201).json({
      success: true,
      message: "Paper product created successfully",
      data: paperProduct
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: "Unable to save your product" });
  }
}

const deletePaperProduct = async (req, res) => {
  const productId = req.params.productId;
  const role = req.role;
  try {
    if (role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await Paperproduct.findByIdAndDelete(productId);

    return res.status(200).json({ success: true, message: "Product deleted successfully" })

  } catch (error) {
    return res.status(400).json({ success: false, message: 'unauthorized' })
  }
}

const updatePaperProduct = async (req, res) => {
  const productId = req.params.productId;
  const role = req.role;
  const { name, category, subcategory, price, status } = req.body;
 
  try {
    if (role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Name, image, and price are required" });
    }

    const isAvailable = await Paperproduct.findOne({
      name,
      category,
      subcategory,
      _id: { $ne: productId }
    });

    if (isAvailable) {
      return res.status(400).json({ success: false, message: "Product with same name, category, and subcategory already exists" });
    }

    const updatedPaperProduct = await Paperproduct.findByIdAndUpdate(
      productId,
      { name, category, subcategory, price, status },
      { new: true }
    );

    if (!updatedPaperProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, message: "Updated successfully", data: updatedPaperProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPaperProduct = async (req, res) => {
  try {
    const paperProducts = await Paperproduct.find();
    return res.status(200).json({ success: true, data: paperProducts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching products", error: error.message });
  }
};

module.exports = {
  uploadPaperProduct,
  deletePaperProduct,
  updatePaperProduct,
  getPaperProduct
}
