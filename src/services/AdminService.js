import api from './api';

export const adminService = {
  // Get dashboard stats
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/stats');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch stats';
    }
  },

  // Get all subscriptions
  async getAllSubscriptions(params = {}) {
    try {
      const response = await api.get('/admin/subscriptions', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch subscriptions';
    }
  },

  // Get all users
  async getAllUsers(params = {}) {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch users';
    }
  },

  // Get user details
  async getUserDetails(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user details';
    }
  },

  // Update user subscription
  async updateUserSubscription(userId, data) {
    try {
      const response = await api.put(`/admin/subscriptions/${userId}`, data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update subscription';
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete user';
    }
  }
};