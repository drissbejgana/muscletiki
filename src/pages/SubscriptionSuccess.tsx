import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      return;
    }

    try {
      // This call updates the subscription in the database
      const result = await subscriptionService.verifySession(sessionId);
      
      if (result.status === 'paid') {
        setStatus('success');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#294B8E] mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">Please wait while we confirm your subscription</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your subscription has been activated
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                You now have access to all premium features!
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Redirecting to dashboard...
            </p>
          </div>
        )}

        {status === 'pending' && (
          <div>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              Payment Pending
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment is being processed
            </p>
            <button
              onClick={() => verifyPayment()}
              className="bg-[#294B8E] text-white px-6 py-2 rounded-lg hover:bg-[#1f3a6e] transition"
            >
              Check Again
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't verify your payment
            </p>
            <button
              onClick={() => navigate('/subscription/plans')}
              className="bg-[#294B8E] text-white px-6 py-2 rounded-lg hover:bg-[#1f3a6e] transition"
            >
              Back to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
}