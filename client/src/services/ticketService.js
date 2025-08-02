import api from './api';

export const ticketService = {
  // Get all tickets
  getTickets: async (params = {}) => {
    const response = await api.get('/api/tickets', { params });
    return response.data;
  },

  // Get ticket by ID
  getTicket: async (id) => {
    const response = await api.get(`/api/tickets/${id}`);
    return response.data;
  },

  // Create ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/api/tickets', ticketData);
    return response.data;
  },

  // Update ticket
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/api/tickets/${id}`, ticketData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/api/tickets/${id}`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/api/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  // Vote on ticket
  voteTicket: async (ticketId, voteType) => {
    const response = await api.put(`/api/tickets/${ticketId}/vote`, { voteType });
    return response.data;
  },

  // Vote on comment
  voteComment: async (ticketId, commentId, voteType) => {
    const response = await api.put(`/api/tickets/${ticketId}/comments/${commentId}/vote`, { voteType });
    return response.data;
  },

  // Reply to comment
  replyToComment: async (ticketId, commentId, replyData) => {
    const response = await api.post(`/api/tickets/${ticketId}/comments/${commentId}/reply`, {
      content: replyData.content,
      parentComment: commentId
    });
    return response.data;
  },

  // Assign ticket
  assignTicket: async (ticketId, assignedTo) => {
    const response = await api.put(`/api/tickets/${ticketId}/assign`, { assignedTo });
    return response.data;
  },

  // Upload files
  uploadFiles: async (formData) => {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}; 