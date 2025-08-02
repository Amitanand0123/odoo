const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendTicketNotification } = require('../services/emailService');
const { getCategoryByName } = require('../services/categoryService');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    const { status, category, priority, search, sortBy, sortOrder, page, limit, assignedTo } = req.query;
    
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
    if (priority) query.priority = priority;
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
    console.log('Getting ticket with ID:', req.params.id);
    
    // Validate ticket ID format
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({ message: 'Invalid ticket ID format' });
    }
    
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email profileImage role')
      .populate('assignedTo', 'name email profileImage role')
      .populate('category', 'name color')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate('statusHistory.changedBy', 'name email role')
      .populate('priorityHistory.changedBy', 'name email role')
      .populate('assignmentHistory.assignedBy', 'name email role')
      .populate('assignmentHistory.oldAssignedTo', 'name email role')
      .populate('assignmentHistory.newAssignedTo', 'name email role');
    
    console.log('Found ticket:', ticket ? 'Yes' : 'No');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check access permissions
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user.id);
    console.log('Ticket created by:', ticket.createdBy._id.toString());
    
    if (req.user.role === 'end_user' && ticket.createdBy._id.toString() !== req.user.id) {
      console.log('Access denied: End user trying to access ticket not created by them');
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }
    
    // Increment view count
    ticket.viewCount += 1;
    await ticket.save();
    
    // Get comments (only top-level comments)
    const comments = await Comment.find({ 
      ticket: ticket._id,
      parentComment: null 
    })
      .populate('author', 'name email profileImage role')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email profileImage role'
        }
      })
      .sort({ createdAt: 1 });
    
    console.log('Found comments:', comments.length);
    
    res.json({
      success: true,
      data: {
        ticket,
        comments
      }
    });
  } catch (error) {
    console.error('Error in getTicket:', error);
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
    
    console.log('Creating ticket for user:', req.user.id, 'Role:', req.user.role);
    
    const ticket = await Ticket.create({
      subject,
      description,
      category: categoryId,
      priority,
      createdBy: req.user.id,
      assignedTo: undefined, // Tickets are unassigned initially
      attachments: attachments || []
    });
    
    console.log('Ticket created with ID:', ticket._id, 'Created by:', ticket.createdBy);
    
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
    const oldPriority = ticket.priority;
    const oldAssignedTo = ticket.assignedTo;
    
    // Track status changes
    if (status !== undefined && status !== oldStatus) {
      ticket.statusHistory.push({
        oldStatus: oldStatus,
        newStatus: status,
        changedBy: req.user.id,
        changedAt: new Date(),
        reason: req.body.statusReason || 'Status updated'
      });
    }
    
    // Track priority changes
    if (priority !== undefined && priority !== oldPriority) {
      ticket.priorityHistory.push({
        oldPriority: oldPriority,
        newPriority: priority,
        changedBy: req.user.id,
        changedAt: new Date(),
        reason: req.body.priorityReason || 'Priority updated'
      });
    }
    
    // Track assignment changes
    if (assignedTo !== undefined && assignedTo?.toString() !== oldAssignedTo?.toString()) {
      ticket.assignmentHistory.push({
        oldAssignedTo: oldAssignedTo,
        newAssignedTo: assignedTo,
        assignedBy: req.user.id,
        assignedAt: new Date(),
        reason: req.body.assignmentReason || 'Ticket reassigned'
      });
    }
    
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
    
    // Send notification to ticket creator (if not internal) - asynchronously to avoid blocking
    if (!isInternal) {
      setImmediate(async () => {
        try {
          const creator = await User.findById(ticket.createdBy);
          if (creator && creator._id.toString() !== req.user.id) {
            await sendTicketNotification(ticket, 'commented', creator);
          }
        } catch (emailError) {
          console.error('Failed to send comment notification email:', emailError.message);
          // Don't fail the comment creation if email fails
        }
      });
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

// @desc    Vote on comment
// @route   PUT /api/tickets/:ticketId/comments/:commentId/vote
// @access  Private
const voteComment = async (req, res) => {
  try {
    console.log('Vote comment request:', {
      ticketId: req.params.ticketId,
      commentId: req.params.commentId,
      voteType: req.body.voteType,
      userId: req.user.id
    });

    const { voteType } = req.body; // 'upvote' or 'downvote'
    const { commentId } = req.params;
    
    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      console.log('Comment not found:', commentId);
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const userId = req.user.id;
    
    // Remove existing votes
    comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId);
    comment.downvotes = comment.downvotes.filter(id => id.toString() !== userId);
    
    // Add new vote
    if (voteType === 'upvote') {
      comment.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      comment.downvotes.push(userId);
    }
    
    await comment.save();
    
    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email profileImage role')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name');
    
    console.log('Comment vote successful:', {
      commentId,
      voteType,
      voteCount: updatedComment.voteCount
    });
    
    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    console.error('Error in voteComment:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reply to comment
// @route   POST /api/tickets/:ticketId/comments/:commentId/reply
// @access  Private
const replyToComment = async (req, res) => {
  try {
    const { content, isInternal = false } = req.body;
    const { ticketId, commentId } = req.params;
    
    // Validate ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Validate parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }
    
    // Create reply comment
    const reply = new Comment({
      ticket: ticketId,
      author: req.user.id,
      content,
      isInternal,
      parentComment: commentId
    });
    
    await reply.save();
    
    // Add reply to parent comment
    parentComment.replies.push(reply._id);
    await parentComment.save();
    
    // Populate the reply with author info
    const populatedReply = await Comment.findById(reply._id)
      .populate('author', 'name email profileImage role')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name');
    
    // Create notification for parent comment author
    setImmediate(async () => {
      try {
        const parentAuthor = await User.findById(parentComment.author);
        if (parentAuthor && parentAuthor._id.toString() !== req.user.id.toString()) {
          // Create notification
          const notification = new Notification({
            recipient: parentAuthor._id,
            sender: req.user.id,
            ticket: ticketId,
            type: 'comment_reply',
            title: 'New Reply to Your Comment',
            message: `${req.user.name} replied to your comment on ticket: ${ticket.subject}`,
            metadata: {
              commentId: reply._id,
              replyContent: content
            }
          });
          await notification.save();

          // Send email notification
          await sendTicketNotification(ticket, 'comment_reply', parentAuthor, {
            commentAuthor: req.user.name,
            commentContent: content
          });
        }
      } catch (error) {
        console.error('Error creating reply notification:', error);
      }
    });
    
    res.status(201).json({
      success: true,
      data: populatedReply
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
  assignTicket,
  voteComment,
  replyToComment
}; 