import { Navbar } from "@/components/Navbar";
import MobileNavBar from "@/components/MobileNavBar";
import FitnessPopup from "./components/FitnessPopup";
import CookieConsent from "./components/CookieConsent";
import TrainerChat from "./components/TrainerChat";
import { authService } from '@/services/authService';
import { useTimeRestriction } from '@/hooks/useTimeRestriction';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const shouldRestrict = !user || user?.subscription.plan === "free";
  const { isRestricted, timeExpired, remainingTime, formatTime } = useTimeRestriction(shouldRestrict, 2);

  const allowedPaths = ['/subscription', '/auth'];
  const isOnAllowedPage = allowedPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    if (isRestricted && !isOnAllowedPage) {
      navigate('/subscription');
    }
  }, [isRestricted, isOnAllowedPage, navigate]);

  useEffect(() => {
    if (isRestricted && shouldRestrict) {
      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest('a, button[data-navigate]');
        if (link) {
          const href = link.getAttribute('href') || '';
          const isAllowed = allowedPaths.some(path => href.includes(path));
          if (!isAllowed && !href.startsWith('#')) {
            e.preventDefault();
            e.stopPropagation();
            navigate('/subscription');
          }
        }
      };
      document.addEventListener('click', handleClick, true);
      return () => document.removeEventListener('click', handleClick, true);
    }
  }, [isRestricted, shouldRestrict, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Trial overlays */}
      {shouldRestrict && !isOnAllowedPage && (
        <FitnessPopup
          timeExpired={timeExpired}
          remainingTime={remainingTime}
          formatTime={formatTime}
        />
      )}

      {/* Countdown timer badge */}
      {shouldRestrict && !isRestricted && remainingTime !== null && !isOnAllowedPage && (
        <div className="fixed top-20 right-4 z-40">
          <div className="flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent px-4 py-2 rounded-full shadow-lg shadow-accent/10">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs tracking-wide">
              {t('trial.timer', { time: formatTime(remainingTime) })}
            </span>
          </div>
        </div>
      )}

      {/* Trial expired overlay */}
      {isRestricted && shouldRestrict && !isOnAllowedPage && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-black/10">
            <div className="w-14 h-14 bg-destructive/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Lock className="h-7 w-7 text-destructive" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">{t('trial.ended')}</h3>
            <p className="text-muted-foreground text-sm mb-6">{t('trial.expiredMessage')}</p>
            <Button onClick={() => navigate('/subscription')} className="w-full h-11 font-semibold">
              {t('trial.viewPlans')}
            </Button>
            <button
              onClick={() => navigate('/auth')}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('trial.hasAccount')}
            </button>
          </div>
        </div>
      )}

      {/* Main content — padded for fixed navbar + mobile bottom nav */}
      <main className="flex-1 pt-16 pb-16 lg:pb-0 overflow-x-hidden">
        {children}
      </main>

      <TrainerChat />
      <MobileNavBar />
      <CookieConsent />
    </div>
  );
};

export default Layout;
