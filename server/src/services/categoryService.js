const Category = require('../models/Category');

// Default categories that will be created if they don't exist
const defaultCategories = [
  { name: 'Technical', description: 'Technical issues and questions', color: '#3B82F6' },
  { name: 'Billing', description: 'Billing and payment related issues', color: '#10B981' },
  { name: 'General', description: 'General questions and support', color: '#F59E0B' },
  { name: 'Feature Request', description: 'Requests for new features', color: '#8B5CF6' },
  { name: 'Bug Report', description: 'Bug reports and issues', color: '#EF4444' }
];

// Initialize default categories
const initializeCategories = async () => {
  try {
    for (const categoryData of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      if (!existingCategory) {
        await Category.create({
          ...categoryData,
          createdBy: null // Will be set to admin user when available
        });
      }
    }
    console.log('Default categories initialized');
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Get category by name
const getCategoryByName = async (name) => {
  return await Category.findOne({ name: { $regex: new RegExp(name, 'i') } });
};

// Get category by ID
const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Get all categories
const getAllCategories = async () => {
  return await Category.find({ isActive: true }).sort({ name: 1 });
};

// Create category
const createCategory = async (categoryData, createdBy) => {
  return await Category.create({
    ...categoryData,
    createdBy
  });
};

// Update category
const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};

// Delete category
const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  initializeCategories,
  getCategoryByName,
  getCategoryById,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
}; 