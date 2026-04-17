const User = require('../models/User');

// @desc    Get all users (with pagination and filtering)
// @route   GET /api/users
// @access  Private/Admin/Manager
exports.getUsers = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    let filters = JSON.parse(queryStr);
    
    // Custom search across name and email
    if (filters.search) {
      filters.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
      delete filters.search;
    }

    query = User.find(filters).populate('createdBy', 'name email').populate('updatedBy', 'name email');

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(filters);

    query = query.skip(startIndex).limit(limit);

    const users = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      total,
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Manager restriction
    if (req.user.role === 'Manager' && user.role === 'Admin') {
      return res.status(403).json({ success: false, message: 'Managers cannot view Admin details' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    // Add createdBy user
    req.body.createdBy = req.user.id;

    // Optional generate password if not provided
    if(!req.body.password) {
        req.body.password = Math.random().toString(36).slice(-8) + 'A1!'; // Simple auto-generate
    }

    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message, error: err.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
exports.updateUser = async (req, res) => {
  try {
    // Remove password from req.body if it's empty so it doesn't trigger validation errors
    if (!req.body.password) {
      delete req.body.password;
    }
    
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Manager Cannot update Admin or update someone to Admin
    if (req.user.role === 'Manager') {
      if (user.role === 'Admin') {
         return res.status(403).json({ success: false, message: 'Managers cannot update Admins' });
      }
      if (req.body.role === 'Admin') {
         return res.status(403).json({ success: false, message: 'Managers cannot assign Admin role' });
      }
    }

    req.body.updatedBy = req.user.id;

    // Use save() if password is included to trigger hash
    if(req.body.password) {
       user.name = req.body.name || user.name;
       user.email = req.body.email || user.email;
       user.role = req.body.role || user.role;
       user.status = req.body.status || user.status;
       user.password = req.body.password;
       user.updatedBy = req.user.id;
       await user.save();
    } else {
       user = await User.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
       });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message, error: err.message });
  }
};

// @desc    Delete/Deactivate user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Soft delete (deactivate)
    user.status = 'inactive';
    user.updatedBy = req.user.id;
    await user.save();

    res.status(200).json({
      success: true,
      data: {},
      message: 'User soft deleted'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
