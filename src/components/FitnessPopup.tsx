import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Dumbbell, Map, TrendingUp, ShieldOff, Lock, Clock, Sparkles } from "lucide-react";
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
  onClose,
}: FitnessPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (timeExpired) setIsOpen(true);
  }, [timeExpired, remainingTime]);

  const handleClick = () => { setIsOpen(false); navigate('/subscription'); };

  const handleOpenChange = (open: boolean) => {
    if (timeExpired) return;
    setIsOpen(open);
    if (!open && onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[520px] p-0 bg-card border border-border overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
        onPointerDownOutside={(e) => timeExpired && e.preventDefault()}
        onEscapeKeyDown={(e) => timeExpired && e.preventDefault()}
      >
        {/* Header gradient stripe */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary/70 to-accent" />

        <div className="p-7">
          {/* Close / Lock icon */}
          <div className="absolute top-5 right-5">
            {timeExpired ? (
              <div className="w-8 h-8 rounded-lg bg-destructive/15 flex items-center justify-center">
                <Lock className="h-4 w-4 text-destructive" />
              </div>
            ) : (
              <button
                onClick={() => handleOpenChange(false)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status pill */}
          <div className="flex justify-center mb-5">
            {timeExpired ? (
              <div className="inline-flex items-center gap-2 bg-destructive/15 border border-destructive/30 rounded-full px-4 py-1.5">
                <span className="w-2 h-2 bg-destructive rounded-full pulse-dot" />
                <span className="text-xs font-bold text-destructive uppercase tracking-widest">
                  {t('popup.trialEnded')}
                </span>
              </div>
            ) : remainingTime !== null ? (
              <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-widest">
                  {t('popup.remaining', { time: formatTime(remainingTime) })}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 rounded-full px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  {t('popup.mostPopular')}
                </span>
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black mb-1 leading-tight">
              <span className="text-primary">{t('popup.heading1')}</span>{" "}
              <span className="text-foreground">{t('popup.heading2')}</span>
            </h2>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {timeExpired ? t('popup.headingExpired') : t('popup.headingActive')}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {timeExpired ? t('popup.subtitleExpired') : t('popup.subtitleActive')}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { value: "800K+", label: t('popup.workoutsGenerated') },
              { value: "2.4M+", label: t('popup.exercisesTracked') },
              { value: "1,700+", label: t('popup.videoGuides') },
            ].map(({ value, label }) => (
              <div key={value} className="bg-secondary border border-border rounded-xl p-3 text-center hover:border-primary/30 transition-colors">
                <div className="text-2xl font-black text-primary mb-0.5">{value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide leading-tight">{label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 mb-5">
            <p className="text-foreground text-xs italic mb-1.5">"{t('popup.testimonial')}"</p>
            <p className="text-muted-foreground text-[10px]">
              <span className="font-semibold text-foreground">{t('popup.testimonialAuthor')}</span> · {t('popup.testimonialRole')}
            </p>
          </div>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { icon: Dumbbell, label: t('popup.featureAI'),        color: "text-violet-400 bg-violet-500/15" },
              { icon: Map,      label: t('popup.featureMap'),        color: "text-blue-400 bg-blue-500/15" },
              { icon: TrendingUp, label: t('popup.featureAnalytics'), color: "text-accent bg-accent/15" },
              { icon: ShieldOff,  label: t('popup.featureAdFree'),   color: "text-destructive bg-destructive/15" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2.5 bg-secondary rounded-lg p-2.5">
                <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-foreground text-xs font-medium leading-snug">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 mb-3"
            onClick={handleClick}
          >
            {timeExpired ? t('popup.ctaExpired') : t('popup.ctaActive')}
          </Button>

          <div className="text-center">
            <p className="text-foreground text-xs mb-0.5">
              {t('popup.pricing')} <span className="text-primary font-bold">{t('popup.pricePerMonth')}</span>
            </p>
            <p className="text-muted-foreground text-[10px]">{t('popup.billingNote')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessPopup;
