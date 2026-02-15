import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import FitnessPopup from "./components/FitnessPopup";
import { useAuth } from '@/hooks/useAuth';
import { useTimeRestriction } from '@/hooks/useTimeRestriction';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import { useTranslation } from '@/i18n';

const Layout = ({ children }) => {
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const shouldRestrict = !user || user?.subscription.plan === "free";
  const { isRestricted, timeExpired, remainingTime, formatTime } = useTimeRestriction(shouldRestrict, 2);

  const allowedPaths = ['/subscription', '/auth'];
  const isOnAllowedPage = allowedPaths.some(path =>
    location.pathname.startsWith(path)
  );

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
    <SidebarProvider>
      {shouldRestrict && !isOnAllowedPage && (
        <FitnessPopup
          timeExpired={timeExpired}
          remainingTime={remainingTime}
          formatTime={formatTime}
        />
      )}

      {shouldRestrict && !isRestricted && remainingTime !== null && !isOnAllowedPage && (
        <div className="fixed top-4 right-4 z-40">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Clock className="w-4 h-4" />
            <span className="font-semibold text-sm">
              {t('trial.timer', { time: formatTime(remainingTime) })}
            </span>
          </div>
        </div>
      )}

      {isRestricted && shouldRestrict && !isOnAllowedPage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              {t('trial.ended')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('trial.expiredMessage')}
            </p>
            <Button
              onClick={() => navigate('/subscription')}
              className="w-full h-12 text-lg font-semibold"
            >
              {t('trial.viewPlans')}
            </Button>
            <button
              onClick={() => navigate('/auth')}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              {t('trial.hasAccount')}
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />

          <main className="flex-1 p-4 overflow-auto">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
