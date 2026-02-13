import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Dumbbell, Map, TrendingUp, ShieldOff, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";

interface FitnessPopupProps {
  timeExpired?: boolean;
  remainingTime?: number | null;
  formatTime?: (seconds: number | null) => string;
  onClose?: () => void;
}

const FitnessPopup = ({
  timeExpired = false,
  remainingTime = null,
  formatTime = () => '',
  onClose
}: FitnessPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (timeExpired) setIsOpen(true);
  }, [timeExpired, remainingTime]);

  const handleClick = () => {
    setIsOpen(false);
    navigate('/subscription');
  };

  const handleOpenChange = (open: boolean) => {
    if (timeExpired) return;
    setIsOpen(open);
    if (!open && onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[580px] p-0 !bg-[#1a1f2e] border-2 !border-[#2d3548] overflow-hidden rounded-2xl shadow-2xl"
        onPointerDownOutside={(e) => timeExpired && e.preventDefault()}
        onEscapeKeyDown={(e) => timeExpired && e.preventDefault()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] via-[#1e2433] to-[#1a1f2e] -z-10" />
        <div className="relative p-8 pb-6">
          {!timeExpired && (
            <button onClick={() => handleOpenChange(false)} className="absolute top-4 right-4 text-fitness-muted hover:text-white transition-colors z-10">
              <X className="h-5 w-5" />
            </button>
          )}
          {timeExpired && (
            <div className="absolute top-4 right-4 text-red-400 z-10">
              <Lock className="h-6 w-6" />
            </div>
          )}

          <div className="flex justify-center mb-6">
            {timeExpired ? (
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('popup.trialEnded')}
                </span>
              </div>
            ) : remainingTime !== null ? (
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 rounded-full px-4 py-1.5">
                <Clock className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('popup.remaining', { time: formatTime(remainingTime) })}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-fitness-red/10 border border-fitness-red/30 rounded-full px-4 py-1.5">
                <div className="w-2 h-2 bg-fitness-red rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('popup.mostPopular')}
                </span>
              </div>
            )}
          </div>

          <div className="text-center mb-3">
            <h2 className="text-5xl font-bold mb-1">
              <span className="text-green-300">{t('popup.heading1')}</span>{" "}
              <span className="text-white">{t('popup.heading2')}</span>
            </h2>
            <h3 className="text-3xl font-bold text-white mb-4">
              {timeExpired ? t('popup.headingExpired') : t('popup.headingActive')}
            </h3>
            <p className="text-green-100 text-base">
              {timeExpired ? t('popup.subtitleExpired') : t('popup.subtitleActive')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">800K+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight whitespace-pre-line">
                {t('popup.workoutsGenerated')}
              </div>
            </div>
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">2.4M+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight whitespace-pre-line">
                {t('popup.exercisesTracked')}
              </div>
            </div>
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">1,700+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight whitespace-pre-line">
                {t('popup.videoGuides')}
              </div>
            </div>
          </div>

          <div className="bg-[#0f1419] border-l-4 border-[#10b981] rounded-lg p-4 mb-8">
            <p className="text-white text-sm italic mb-2">{t('popup.testimonial')}</p>
            <p className="text-gray-400 text-xs">
              <span className="font-semibold">{t('popup.testimonialAuthor')}</span> - {t('popup.testimonialRole')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { icon: Dumbbell, label: t('popup.featureAI'), gradient: "from-purple-500 to-pink-500" },
              { icon: Map, label: t('popup.featureMap'), gradient: "from-blue-500 to-cyan-500" },
              { icon: TrendingUp, label: t('popup.featureAnalytics'), gradient: "from-orange-500 to-yellow-500" },
              { icon: ShieldOff, label: t('popup.featureAdFree'), gradient: "from-red-500 to-pink-500" },
            ].map(({ icon: Icon, label, gradient }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700/30 rounded-lg p-3 text-center mb-6">
            <p className="text-red-200 text-sm font-medium">{t('popup.joinBanner')}</p>
          </div>

          <Button
            className="w-full h-14 text-lg font-bold !bg-[#10b981] hover:!bg-[#059669] !text-white rounded-xl shadow-lg hover:shadow-xl transition-all mb-3"
            onClick={handleClick}
          >
            {timeExpired ? t('popup.ctaExpired') : t('popup.ctaActive')}
          </Button>

          <div className="text-center">
            <p className="text-white text-sm mb-1">
              {t('popup.pricing')} <span className="text-[#10b981] font-semibold">{t('popup.pricePerMonth')}</span>
            </p>
            <p className="text-gray-400 text-xs">{t('popup.billingNote')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessPopup;
