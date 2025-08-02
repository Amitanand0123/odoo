const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { 
  getAllCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../services/categoryService');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
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

// Admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin)
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('color').isHexColor().withMessage('Color must be a valid hex color'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const category = await createCategory(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
router.put('/:id', [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional(),
  body('color').isHexColor().withMessage('Color must be a valid hex color'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 