import api from './api';

export const subscriptionService = {
  // Get plans
  async getPlans() {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch plans';
    }
  },

  async createCheckout(priceId, planType) {
    try {
      const response = await api.post('/subscriptions/create-checkout-session', {
        priceId,
        planType  // 'premium_5day' or 'premium_annual'
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Checkout failed';
    }
  },

  // Verify session after payment
async verifySession(sessionId) {
  const response = await api.get(`/subscriptions/verify-session/${sessionId}`);
  
  // ✅ If payment successful, refresh user from backend
  if (response.data.success && response.data.subscription) {
        const response = await api.get('/auth/me');
        localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data;
},


  // Manually sync subscription with Stripe
  async syncSubscription() {
    try {
      const response = await api.post('/subscriptions/sync');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Sync failed';
    }
  }
,
  // Get current subscription
  async getCurrentSubscription() {
    try {
      const response = await api.get('/subscriptions/current');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch subscription';
    }
  },

  // Cancel subscription
  async cancelSubscription(userId) {
    try {
      const response = await api.post('/subscriptions/cancel',{userId});
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Cancellation failed';
    }
  },

  // Reactivate subscription
  async reactivateSubscription() {
    try {
      const response = await api.post('/subscriptions/reactivate');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Reactivation failed';
    }
  }
};