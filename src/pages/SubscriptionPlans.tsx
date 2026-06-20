import { useState } from "react";
import { Check, Clock, Crown, Zap, Sparkles } from "lucide-react";
import { subscriptionService } from '@/services/subscriptionService';
import { authService } from '@/services/authService';
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

const SubscriptionPlans = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const user = authService.getCurrentUser();
  const currentPlan = user?.subscription?.plan || 'free';
  const isExpired = user?.subscription?.endDate && new Date(user.subscription.endDate) < new Date();

  const plans = [
    {
      id: "free",
      name: t('subscription.free'),
      price: "0",
      currency: "€",
      period: t('subscription.forever'),
      description: t('subscription.freeDesc'),
      popular: false,
      icon: Zap,
      iconColor: "text-muted-foreground",
      borderClass: "border-border",
      ctaClass: "bg-secondary text-foreground hover:bg-secondary/80",
      features: [
        t('subscription.features.basicExercises'),
        t('subscription.features.bodyDiagram'),
        t('subscription.features.calorieCalc'),
        t('subscription.features.limitedWorkouts'),
      ],
    },
    {
      id: "premium_5day",
      name: t('subscription.premium5day'),
      price: "5",
      currency: "€",
      period: t('subscription.fiveDays'),
      stripePriceId: "price_premium_5day",
      description: t('subscription.premium5dayDesc'),
      popular: true,
      icon: Crown,
      iconColor: "text-accent",
      borderClass: "border-primary/50",
      ctaClass: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      features: [
        t('subscription.features.allFree'),
        t('subscription.features.advancedLibrary'),
        t('subscription.features.customPlans'),
        t('subscription.features.progressTracking'),
        t('subscription.features.macroCalc'),
        t('subscription.features.oneRMCalc'),
        t('subscription.features.fiveDayAccess'),
      ],
    },
    {
      id: "premium_annual",
      name: t('subscription.premiumAnnual'),
      price: "100",
      currency: "€",
      period: t('subscription.year'),
      stripePriceId: "price_premium_annual",
      description: t('subscription.premiumAnnualDesc'),
      popular: false,
      savings: t('subscription.bestValue'),
      icon: Sparkles,
      iconColor: "text-primary",
      borderClass: "border-border",
      ctaClass: "bg-secondary text-foreground hover:bg-secondary/80 border border-border",
      features: [
        t('subscription.features.allFree'),
        t('subscription.features.advancedLibrary'),
        t('subscription.features.customPlans'),
        t('subscription.features.progressTracking'),
        t('subscription.features.macroCalc'),
        t('subscription.features.oneRMCalc'),
        t('subscription.features.trainerSupport'),
        t('subscription.features.videoTutorials'),
        t('subscription.features.nutritionPlans'),
        t('subscription.features.prioritySupport'),
        t('subscription.features.fullYearAccess'),
      ],
    },
  ];

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (plan.id === 'free' || !plan.stripePriceId) return;
    setLoading(plan.id);
    try { await subscriptionService.createCheckout(plan.id); }
    catch (err) { console.error('Checkout error:', err); }
    finally { setLoading(null); }
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (plan.id === 'free') return currentPlan === 'free' || isExpired ? t('subscription.currentPlan') : t('subscription.getStarted');
    if (loading === plan.id) return t('subscription.processing');
    if (!isExpired && (currentPlan === 'pro' || currentPlan === 'premium') && plan.id.startsWith('premium')) return t('subscription.currentPlan');
    return t('subscription.subscribe');
  };

  const isCurrentPlan = (plan: typeof plans[0]) => {
    if (isExpired) return plan.id === 'free';
    if (plan.id === 'free') return currentPlan === 'free';
    if (currentPlan !== 'premium') return false;
    const cycle = user?.subscription?.billingCycle;
    if (plan.id === 'premium_5day') return cycle === '5day';
    if (plan.id === 'premium_annual') return cycle === 'yearly';
    return false;
  };

  const getDaysRemaining = () => {
    if (!user?.subscription?.endDate) return null;
    const diff = Math.ceil((new Date(user.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };
  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Unlock full access</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
            {t('subscription.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('subscription.subtitle')}</p>

          {/* Status banners */}
          {user && !isExpired && currentPlan !== 'free' && daysRemaining !== null && (
            <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('subscription.daysRemaining', { days: String(daysRemaining) })}
              </span>
            </div>
          )}
          {isExpired && (
            <div className="mt-6 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">{t('subscription.expired')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const current = isCurrentPlan(plan);
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative bg-card rounded-2xl border p-6 flex flex-col transition-all duration-300",
                  plan.popular
                    ? "border-primary/50 shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-border hover:border-border/80",
                  current && "ring-1 ring-primary/40"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                      {t('subscription.mostPopular')}
                    </span>
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute -top-3.5 right-4">
                    <span className="bg-accent/20 text-accent border border-accent/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className={cn("w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4", plan.popular && "bg-primary/20")}>
                    <Icon className={cn("h-5 w-5", plan.iconColor)} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-foreground">{plan.price}{plan.currency}</span>
                    <span className="text-muted-foreground text-sm mb-1">/{plan.period}</span>
                  </div>
                  {plan.id === 'premium_annual' && (
                    <p className="text-xs text-muted-foreground mt-1">≈ 8.33€/{t('subscription.month')}</p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <div className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        plan.popular ? "bg-primary/20" : "bg-secondary"
                      )}>
                        <Check className={cn("h-2.5 w-2.5", plan.popular ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={current || loading === plan.id || plan.id === 'free'}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold text-sm transition-all",
                    plan.ctaClass,
                    (current || loading === plan.id || plan.id === 'free') && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      {t('subscription.processing')}
                    </span>
                  ) : getButtonText(plan)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
