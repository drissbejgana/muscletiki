import api from './api';

export const authService = {
  // Register
  async register(name, email, password) {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  // Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Google Login
  async googleLogin(credential) {
    try {
      const response = await api.post('/auth/google', { credential });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Google login failed';
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  },

  // Get current user
  async getMe() {
    try {
      const response = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user';
    }
  },

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Update failed';
    }
  },

  // Get current user from localStorage (with expiration check)
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user) return null;

    const parsed = JSON.parse(user);

    // Check if subscription has expired — update local state
    if (parsed.subscription?.endDate) {
      const endDate = new Date(parsed.subscription.endDate);
      if (endDate < new Date() && parsed.subscription.plan !== 'free') {
        parsed.subscription.plan = 'free';
        parsed.subscription.status = 'expired';
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    }

    return parsed;
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};