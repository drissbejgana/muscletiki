import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredPlan = 'free' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Check subscription expiration
  const subscription = user.subscription;
  let effectivePlan = subscription?.plan || 'free';

  if (subscription?.endDate) {
    const endDate = new Date(subscription.endDate);
    const now = new Date();
    if (endDate < now) {
      // Subscription expired — treat as free
      effectivePlan = 'free';
    }
  }

  // Check subscription level
  const planHierarchy = { free: 0, pro: 1, premium: 2 };
  const userPlanLevel = planHierarchy[effectivePlan] ?? 0;
  const requiredPlanLevel = planHierarchy[requiredPlan] ?? 0;

  if (userPlanLevel < requiredPlanLevel) {
    return <Navigate to="/subscription" />;
  }

  return children;
};
