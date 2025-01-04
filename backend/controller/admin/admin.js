const Paperproduct = require('../../models/paperproduct.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model');

const getAllUser = async (req, res) => {
  const role = req.role;
  const { page = 1, limit = 12, search = '', sort = 'name' } = req.query;
  try {
    if (role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);
    const maleuser = await User.countDocuments({ gender: 'male' });
    const totalAdmin = await User.countDocuments({ role: 'admin' })
    const femaleuser = await User.countDocuments({ gender: 'female' })
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      pagination: {
        total: totalUsers,
        maleuser: maleuser,
        totalAdmin: totalAdmin,
        femaleuser: femaleuser,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getAllProducts = async (req, res) => {
  const { page = 1, limit = null, search = '', sort = 'name' } = req.query;

  try {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { subcategory: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    // Fetch data concurrently
    const productQuery = Product.find(query);
    const paperProductQuery = Paperproduct.find(query);

    const [products, paperProducts] = await Promise.all([
      productQuery,
      paperProductQuery,
    ]);

    // Combine and sort results
    let combinedResults = [...products, ...paperProducts];
    if (sort) {
      combinedResults = combinedResults.sort((a, b) =>
        a[sort] > b[sort] ? 1 : -1
      );
    }

    // Apply pagination if limit is provided
    const total = combinedResults.length;
    const paginatedResults =
      limit !== null
        ? combinedResults.slice((page - 1) * limit, page * limit)
        : combinedResults;

    // Response
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: paginatedResults,
      pagination: {
        total,
        page: parseInt(page),
        limit: limit !== null ? parseInt(limit) : total,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  getAllUser,
  getAllProducts,
};
