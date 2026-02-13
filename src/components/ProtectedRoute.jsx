import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredPlan = 'free' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check subscription level
  const planHierarchy = { free: 0, pro: 1, premium: 2 };
  const userPlanLevel = planHierarchy[user.subscription?.plan || 'free'];
  const requiredPlanLevel = planHierarchy[requiredPlan];

  if (userPlanLevel < requiredPlanLevel) {
    return <Navigate to="/subscription" />;
  }

  return children;
};