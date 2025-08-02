const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { sendTicketNotification } = require('../services/emailService');
const { getCategoryByName } = require('../services/categoryService');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const { status, category, search, sortBy, sortOrder, page, limit, assignedTo } = req.query;
    
    let query = {};
    
    // Build query based on user role
    if (req.user.role === 'end_user') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'support_agent') {
      if (assignedTo === 'me') {
        // Show tickets assigned to this support agent
        query.assignedTo = req.user.id;
      } else if (assignedTo) {
        // Show tickets assigned to specific user
        query.assignedTo = assignedTo;
      }
      // If no assignedTo filter, show all tickets (for support agents)
    }
    
    if (status) query.status = status;
    if (category) {
      // Handle category filtering - if it's a string (category name), find the category
      if (typeof category === 'string' && category.trim()) {
        const categoryDoc = await getCategoryByName(category);
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      } else {
        query.category = category;
      }
    }
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }
    
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .populate('category', 'name color')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      success: true,
      data: tickets,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .populate('category', 'name color')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check access permissions
    if (req.user.role === 'end_user' && ticket.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }
    
    // Increment view count
    ticket.viewCount += 1;
    await ticket.save();
    
    // Get comments
    const comments = await Comment.find({ ticket: ticket._id })
      .populate('author', 'name email profileImage role')
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: {
        ticket,
        comments
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, attachments } = req.body;
    
    // Handle category - if it's a string (category name), find the category
    let categoryId = category;
    if (typeof category === 'string' && category.trim()) {
      const categoryDoc = await getCategoryByName(category);
      if (!categoryDoc) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      categoryId = categoryDoc._id;
    }
    
    const ticket = await Ticket.create({
      subject,
      description,
      category: categoryId,
      priority,
      createdBy: req.user.id,
      assignedTo: undefined, // Tickets are unassigned initially
      attachments: attachments || []
    });
    
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .populate('category', 'name color');
    
    // Send email notifications asynchronously to avoid blocking the response
    setImmediate(async () => {
      try {
        const supportUsers = await User.find({ 
          role: { $in: ['support_agent', 'admin'] }, 
          isActive: true 
        });
        
        for (const user of supportUsers) {
          try {
            await sendTicketNotification(populatedTicket, 'created', user);
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError.message);
          }
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError.message);
      }
    });
    
    res.status(201).json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, status, assignedTo } = req.body;
    
    let ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check permissions - end users can only update their own tickets
    if (req.user.role === 'end_user' && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }
    
    // Support agents and admins can update any ticket
    
    const oldStatus = ticket.status;
    
    if (subject !== undefined) ticket.subject = subject;
    if (description !== undefined) ticket.description = description;
    if (category !== undefined) ticket.category = category;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    
    // Set resolved/closed dates
    if (status === 'resolved' && oldStatus !== 'resolved') {
      ticket.resolvedAt = new Date();
    }
    if (status === 'closed' && oldStatus !== 'closed') {
      ticket.closedAt = new Date();
    }
    
    const updatedTicket = await ticket.save();
    
    const populatedTicket = await Ticket.findById(updatedTicket._id)
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .populate('category', 'name color');
    
    // Send notification to ticket creator
    try {
      const creator = await User.findById(ticket.createdBy);
      if (creator) {
        await sendTicketNotification(populatedTicket, 'updated', creator);
      }
    } catch (emailError) {
      console.error('Failed to send update notification:', emailError.message);
      // Don't fail the update if email fails
    }
    
    res.json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check permissions
    if (req.user.role === 'end_user' && ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }
    
    // Delete associated comments
    await Comment.deleteMany({ ticket: ticket._id });
    
    await ticket.remove();
    
    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content, attachments, isInternal } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check permissions for internal comments
    if (isInternal && req.user.role === 'end_user') {
      return res.status(403).json({ message: 'End users cannot add internal comments' });
    }
    
    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user.id,
      content,
      attachments: attachments || [],
      isInternal: isInternal || false
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email profileImage role');
    
    // Send notification to ticket creator (if not internal)
    if (!isInternal) {
      const creator = await User.findById(ticket.createdBy);
      if (creator && creator._id.toString() !== req.user.id) {
        await sendTicketNotification(ticket, 'commented', creator);
      }
    }
    
    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Vote on ticket
// @route   PUT /api/tickets/:id/vote
// @access  Private
const voteTicket = async (req, res) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    ticket.upvotes = ticket.upvotes.filter(id => id.toString() !== userId);
    ticket.downvotes = ticket.downvotes.filter(id => id.toString() !== userId);
    
    // Add new vote
    if (voteType === 'upvote') {
      ticket.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      ticket.downvotes.push(userId);
    }
    
    await ticket.save();
    
    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('upvotes', 'name')
      .populate('downvotes', 'name');
    
    res.json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Assign ticket
// @route   PUT /api/tickets/:id/assign
// @access  Private (Support Agent, Admin)
const assignTicket = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if assigned user is a support agent or admin
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['support_agent', 'admin'].includes(assignedUser.role)) {
      return res.status(400).json({ message: 'Can only assign to support agents or admins' });
    }
    
    ticket.assignedTo = assignedTo || null;
    
    const updatedTicket = await ticket.save();
    
    const populatedTicket = await Ticket.findById(updatedTicket._id)
      .populate('createdBy', 'name email profileImage')
      .populate('assignedTo', 'name email profileImage')
      .populate('category', 'name color');
    
    // Send notification to ticket creator
    const creator = await User.findById(ticket.createdBy);
    if (creator) {
      await sendTicketNotification(populatedTicket, 'assigned', creator);
    }
    
    res.json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  addComment,
  voteTicket,
  assignTicket
}; 