import api from './api';

export const userService = {
  // Get all users
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/api/users/${userId}/role`, { role });
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/api/users/${userId}/status`, { isActive });
    return response.data;
  }
}; 