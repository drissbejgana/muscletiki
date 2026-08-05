import api from './api';

/**
 * Workout Programs — multi-week plans with per-user enrollment and progress.
 * Browse endpoints work anonymously; the rest require a token (added by the
 * api interceptor).
 */
export const programService = {
  // ─── Browse ────────────────────────────────────────────────────────────────
  async getPrograms(params = {}) {
    try {
      const r = await api.get('/programs', { params });
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch programs'; }
  },

  async getProgram(slug) {
    try {
      const r = await api.get(`/programs/${slug}`);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch program'; }
  },

  // ─── Enrollment & progress ─────────────────────────────────────────────────
  async enroll(id) {
    try {
      const r = await api.post(`/programs/${id}/enroll`);
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to start program'; }
  },

  async unenroll(id) {
    try {
      const r = await api.delete(`/programs/${id}/enroll`);
      return r.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to leave program'; }
  },

  async setDayComplete(id, week, day, completed = true) {
    try {
      const r = await api.post(`/programs/${id}/progress`, { week, day, completed });
      return r.data.data;
    } catch (e) { throw e.response?.data?.message || 'Failed to update progress'; }
  },

  async getMyPrograms() {
    try {
      const r = await api.get('/programs/my/enrollments');
      return r.data.data || [];
    } catch (e) { throw e.response?.data?.message || 'Failed to fetch your programs'; }
  },
};

export default programService;
