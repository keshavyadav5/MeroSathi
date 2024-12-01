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
  const { page = 1, limit = 10, search = '', sort = 'name' } = req.query;

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { subcategory: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  try {
    const productQuery = Product.find(query).sort(sort);
    const paperProductQuery = Paperproduct.find(query).sort(sort);

    const [products, paperProducts] = await Promise.all([productQuery, paperProductQuery]);

    // Combine results and sort
    const combinedResults = [...products, ...paperProducts].sort((a, b) =>
      a[sort] > b[sort] ? 1 : -1
    );

    // Apply global pagination
    const startIndex = (page - 1) * limit;
    const paginatedResults = combinedResults.slice(startIndex, startIndex + parseInt(limit));

    const totalProductCount = await Product.countDocuments(query);
    const totalPaperProductCount = await Paperproduct.countDocuments(query);
    const totalCount = totalProductCount + totalPaperProductCount;

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: paginatedResults,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
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
