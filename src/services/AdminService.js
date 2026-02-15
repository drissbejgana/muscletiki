import api from './api';

export const adminService = {
  // ─── Stats ─────────────────────────────────────────────────────────────────
  async getDashboardStats() {
    try {
      const r = await api.get('/admin/stats');
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch stats'; }
  },

  // ─── Users ─────────────────────────────────────────────────────────────────
  async getAllUsers(params = {}) {
    try {
      const r = await api.get('/admin/users', { params });
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch users'; }
  },
  async getUserDetails(userId) {
    try {
      const r = await api.get(`/admin/users/${userId}`);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch user'; }
  },
  async deleteUser(userId) {
    try {
      const r = await api.delete(`/admin/users/${userId}`);
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to delete user'; }
  },

  // ─── Subscriptions ─────────────────────────────────────────────────────────
  async getAllSubscriptions(params = {}) {
    try {
      const r = await api.get('/admin/subscriptions', { params });
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch subscriptions'; }
  },
  async updateUserSubscription(userId, data) {
    try {
      const r = await api.put(`/admin/subscriptions/${userId}`, data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update subscription'; }
  },

  // ─── Workouts ──────────────────────────────────────────────────────────────
  async getWorkouts(params = {}) {
    try {
      const r = await api.get('/admin/workouts', { params });
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch workouts'; }
  },
  async createWorkout(data) {
    try {
      const r = await api.post('/admin/workouts', data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to create workout'; }
  },
  async updateWorkout(id, data) {
    try {
      const r = await api.put(`/admin/workouts/${id}`, data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update workout'; }
  },
  async deleteWorkout(id) {
    try {
      const r = await api.delete(`/admin/workouts/${id}`);
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to delete workout'; }
  },

  // ─── Routines ──────────────────────────────────────────────────────────────
  async getRoutines(params = {}) {
    try {
      const r = await api.get('/admin/routines', { params });
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch routines'; }
  },
  async createRoutine(data) {
    try {
      const r = await api.post('/admin/routines', data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to create routine'; }
  },
  async updateRoutine(id, data) {
    try {
      const r = await api.put(`/admin/routines/${id}`, data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update routine'; }
  },
  async deleteRoutine(id) {
    try {
      const r = await api.delete(`/admin/routines/${id}`);
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to delete routine'; }
  },

  // ─── Muscle Exercises ──────────────────────────────────────────────────────
  /** Get all muscle groups with their exercises (admin) */
  async getMuscleExercises() {
    try {
      const r = await api.get('/admin/muscle-exercises');
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch muscle exercises'; }
  },

  /** Get one muscle group by muscleId */
  async getOneMuscle(muscleId) {
    try {
      const r = await api.get(`/admin/muscle-exercises/${muscleId}`);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch muscle'; }
  },

  /**
   * Add a new exercise to a muscle group.
   * data: { exerciseId, name:{en,fr}, difficulty, videos:{male,female}, steps:{en,fr} }
   */
  async addExercise(muscleId, data) {
    try {
      const r = await api.post(`/admin/muscle-exercises/${muscleId}/exercises`, data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to add exercise'; }
  },

  /** Update all fields of an existing exercise */
  async updateExercise(muscleId, exerciseId, data) {
    try {
      const r = await api.put(`/admin/muscle-exercises/${muscleId}/exercises/${exerciseId}`, data);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update exercise'; }
  },

  /** Permanently delete an exercise from a muscle group */
  async deleteExercise(muscleId, exerciseId) {
    try {
      const r = await api.delete(`/admin/muscle-exercises/${muscleId}/exercises/${exerciseId}`);
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to delete exercise'; }
  },

  /**
   * Update video URLs for a specific exercise + gender.
   * gender: 'male' | 'female' | 'both'
   */
  async updateExerciseVideos(muscleId, exerciseId, { gender, front, side }) {
    try {
      const r = await api.put(
        `/admin/muscle-exercises/${muscleId}/exercises/${exerciseId}/videos`,
        { gender, front, side }
      );
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update videos'; }
  },

  /** Toggle isActive on an exercise */
  async toggleExerciseActive(muscleId, exerciseId, isActive) {
    try {
      const r = await api.put(
        `/admin/muscle-exercises/${muscleId}/exercises/${exerciseId}/active`,
        { isActive }
      );
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to toggle exercise'; }
  },
};
