import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { subscriptionService } from '../services/subscriptionService';
import { useTranslation } from '@/i18n';
import { CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'pending' | 'error'>('verifying');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { verifyPayment(); }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); return; }
    try {
      const result = await subscriptionService.verifySession(sessionId);
      if (result.status === 'paid') { setStatus('success'); setTimeout(() => navigate('/'), 2500); }
      else { setStatus('pending'); }
    } catch (error) { console.error('Verification error:', error); setStatus('error'); }
  };

  const states = {
    verifying: {
      icon: <Loader2 className="h-10 w-10 text-primary animate-spin" />,
      iconBg: "bg-primary/15",
      title: t('subscriptionSuccess.verifying'),
      desc: t('subscriptionSuccess.pleaseWait'),
      cta: null,
    },
    success: {
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      iconBg: "bg-primary/15",
      title: t('subscriptionSuccess.success'),
      desc: t('subscriptionSuccess.activated'),
      cta: null,
    },
    pending: {
      icon: <Clock className="h-10 w-10 text-accent" />,
      iconBg: "bg-accent/15",
      title: t('subscriptionSuccess.pending'),
      desc: t('subscriptionSuccess.processing'),
      cta: (
        <button
          onClick={verifyPayment}
          className="mt-5 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          {t('subscriptionSuccess.checkAgain')}
        </button>
      ),
    },
    error: {
      icon: <XCircle className="h-10 w-10 text-destructive" />,
      iconBg: "bg-destructive/15",
      title: t('subscriptionSuccess.failed'),
      desc: t('subscriptionSuccess.cantVerify'),
      cta: (
        <button
          onClick={() => navigate('/subscription')}
          className="mt-5 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          {t('subscriptionSuccess.backToPlans')}
        </button>
      ),
    },
  };

  const s = states[status];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center shadow-2xl shadow-black/40">
        <div className={`w-20 h-20 ${s.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
          {s.icon}
        </div>
        <h2 className="text-xl font-black text-foreground mb-2">{s.title}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>

        {status === 'success' && (
          <div className="mt-5 bg-primary/10 border border-primary/20 rounded-xl p-3">
            <p className="text-primary font-semibold text-sm">{t('subscriptionSuccess.premiumAccess')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('subscriptionSuccess.redirecting')}</p>
          </div>
        )}

        {s.cta}
      </div>
    </div>
  );
}
