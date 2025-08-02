const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendUpgradeRequestNotification } = require('../services/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          category: user.category,
          profileImage: user.profileImage
        },
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        category: user.category,
        profileImage: user.profileImage
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('category', 'name color');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, category, profileImage } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.category = category || user.category;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Request role upgrade
// @route   POST /api/auth/upgrade-request
// @access  Private
const requestUpgrade = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'end_user') {
      return res.status(400).json({ message: 'Only end users can request upgrades' });
    }

    if (user.upgradeRequest) {
      return res.status(400).json({ message: 'Upgrade request already pending' });
    }

    user.upgradeRequest = true;
    user.upgradeRequestDate = new Date();
    await user.save();

    // Send notification to admins
    const admins = await User.find({ role: 'admin', isActive: true });
    if (admins.length > 0) {
      await sendUpgradeRequestNotification(user, admins);
    }

    res.json({
      success: true,
      message: 'Upgrade request submitted successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  requestUpgrade,
  changePassword
}; 