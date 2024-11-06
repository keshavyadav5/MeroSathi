const Paperproduct = require('../../models/paperproduct.model'); 
const User = require('../../models/user.model');

const getAllUser = async (req, res) => {
  const role = req.role;
  const { page = 1, limit = 10, search = '', sort = 'name' } = req.query;
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
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      pagination: {
        total: totalUsers,
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
    const paperProducts = await Paperproduct.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Paperproduct.countDocuments(query);
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      paperProducts,
      pagination: {
        total: totalProducts,
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
