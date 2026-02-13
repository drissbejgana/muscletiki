import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { useTranslation } from '@/i18n';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { verifyPayment(); }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); return; }
    try {
      const result = await subscriptionService.verifySession(sessionId);
      if (result.status === 'paid') { setStatus('success'); setTimeout(() => navigate('/'), 2000); }
      else { setStatus('pending'); }
    } catch (error) { console.error('Verification error:', error); setStatus('error'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'verifying' && (<div><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#294B8E] mx-auto mb-4"></div><h2 className="text-2xl font-bold text-gray-800 mb-2">{t('subscriptionSuccess.verifying')}</h2><p className="text-gray-600">{t('subscriptionSuccess.pleaseWait')}</p></div>)}
        {status === 'success' && (<div><div className="text-6xl mb-4">🎉</div><h2 className="text-3xl font-bold text-green-600 mb-2">{t('subscriptionSuccess.success')}</h2><p className="text-gray-600 mb-4">{t('subscriptionSuccess.activated')}</p><div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-green-800 font-semibold">{t('subscriptionSuccess.premiumAccess')}</p></div><p className="text-sm text-gray-500 mt-4">{t('subscriptionSuccess.redirecting')}</p></div>)}
        {status === 'pending' && (<div><div className="text-6xl mb-4">⏳</div><h2 className="text-2xl font-bold text-yellow-600 mb-2">{t('subscriptionSuccess.pending')}</h2><p className="text-gray-600 mb-4">{t('subscriptionSuccess.processing')}</p><button onClick={() => verifyPayment()} className="bg-[#294B8E] text-white px-6 py-2 rounded-lg hover:bg-[#1f3a6e] transition">{t('subscriptionSuccess.checkAgain')}</button></div>)}
        {status === 'error' && (<div><div className="text-6xl mb-4">❌</div><h2 className="text-2xl font-bold text-red-600 mb-2">{t('subscriptionSuccess.failed')}</h2><p className="text-gray-600 mb-4">{t('subscriptionSuccess.cantVerify')}</p><button onClick={() => navigate('/subscription/plans')} className="bg-[#294B8E] text-white px-6 py-2 rounded-lg hover:bg-[#1f3a6e] transition">{t('subscriptionSuccess.backToPlans')}</button></div>)}
      </div>
    </div>
  );
}
