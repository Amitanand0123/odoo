const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [2000, 'Comment cannot be more than 2000 characters']
  },
  attachments: [{
    type: String // Cloudinary URLs
  }],
  isInternal: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for vote count
commentSchema.virtual('voteCount').get(function() {
  return this.upvotes.length - this.downvotes.length;
});

// Ensure virtuals are serialized
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

// Index for better query performance
commentSchema.index({ ticket: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema); 