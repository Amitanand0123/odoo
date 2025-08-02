const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getAllCategories } = require('../services/categoryService');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (for now, can be made private if needed)
router.get('/', async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 