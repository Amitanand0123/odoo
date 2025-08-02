const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Support Agent)
router.get('/', authorize('admin', 'support_agent'), async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
router.get('/:id', authorize('admin'), async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
router.put('/:id/role', authorize('admin'), [
  body('role').isIn(['end_user', 'support_agent', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const User = require('../models/User');
    const { role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
router.put('/:id/status', authorize('admin'), [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const User = require('../models/User');
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }
    
    user.isActive = isActive;
    await user.save();
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 