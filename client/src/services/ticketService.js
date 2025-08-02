import api from './api';

export const ticketService = {
  // Get all tickets with filters
  getTickets: async (params = {}) => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  // Get single ticket
  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // Create ticket
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // Update ticket
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, commentData) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },

  // Vote on ticket
  voteTicket: async (ticketId, voteType) => {
    const response = await api.put(`/tickets/${ticketId}/vote`, { voteType });
    return response.data;
  },

  // Assign ticket
  assignTicket: async (ticketId, assignedTo) => {
    const response = await api.put(`/tickets/${ticketId}/assign`, { assignedTo });
    return response.data;
  },

  // Upload files
  uploadFiles: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}; 