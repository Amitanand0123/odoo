const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  voteTicket,
  assignTicket
} = require('../controllers/ticketController');

const router = express.Router();

// Validation middleware
const ticketValidation = [
  body('subject')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent')
];

const updateTicketValidation = [
  body('subject')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Subject must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be low, medium, high, or urgent'),
  body('status')
    .optional()
    .isIn(['open', 'in_progress', 'resolved', 'closed'])
    .withMessage('Status must be open, in_progress, resolved, or closed')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters')
];

const voteValidation = [
  body('voteType')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be upvote or downvote')
];

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.route('/')
  .get(getTickets)
  .post(ticketValidation, createTicket);

router.route('/:id')
  .get(getTicket)
  .put(updateTicketValidation, updateTicket)
  .delete(deleteTicket);

router.route('/:id/comments')
  .post(commentValidation, addComment);

router.route('/:id/vote')
  .put(voteValidation, voteTicket);

router.route('/:id/assign')
  .put(authorize('support_agent', 'admin'), assignTicket);

module.exports = router; 