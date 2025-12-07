import api from './api';

export const workoutService = {
  // Get all workouts
  async getWorkouts(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/workouts?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch workouts';
    }
  },

  // Get single workout
  async getWorkout(id) {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch workout';
    }
  },

  // Create workout
  async createWorkout(workoutData) {
    try {
      const response = await api.post('/workouts', workoutData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create workout';
    }
  },

  // Rate workout
  async rateWorkout(id, rating, comment) {
    try {
      const response = await api.post(`/workouts/${id}/rate`, {
        rating,
        comment
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to rate workout';
    }
  },

  // Save workout
  async saveWorkout(id) {
    try {
      const response = await api.post(`/workouts/${id}/save`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to save workout';
    }
  },

  // Complete workout
  async completeWorkout(id, exercises) {
    try {
      const response = await api.post(`/workouts/${id}/complete`, {
        exercises
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to complete workout';
    }
  },

  // Get saved workouts
  async getSavedWorkouts() {
    try {
      const response = await api.get('/workouts/user/saved');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch saved workouts';
    }
  },

  // Get workout history
  async getWorkoutHistory() {
    try {
      const response = await api.get('/workouts/user/history');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch history';
    }
  }
};