import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // If logged in, refresh from backend to sync subscription status
    if (currentUser && authService.isAuthenticated()) {
      authService.getMe()
        .then((freshUser) => {
          // Check expiration on fresh data too
          if (freshUser.subscription?.endDate) {
            const endDate = new Date(freshUser.subscription.endDate);
            if (endDate < new Date() && freshUser.subscription.plan !== 'free') {
              freshUser.subscription.plan = 'free';
              freshUser.subscription.status = 'expired';
            }
          }
          setUser(freshUser);
        })
        .catch(() => {
          // Token invalid, keep local state
        });
    }
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const googleLogin = async (credential) => {
    const data = await authService.googleLogin(credential);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  // Refresh user data (useful after subscription changes)
  const refreshUser = async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
      return freshUser;
    } catch (err) {
      return null;
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
    refreshUser
  };
};
