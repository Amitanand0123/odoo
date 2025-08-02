import api from './api';

export const userService = {
  // Get all users (admin only)
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user status (admin only)
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/users/${userId}/status`, { isActive });
    return response.data;
  }
}; 