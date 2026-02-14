import { useState } from "react";
import { Check, Clock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { subscriptionService } from '@/services/subscriptionService';
import { authService } from '@/services/authService';
import { useTranslation } from "@/i18n";

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
      periodKey: "forever",
      description: t('subscription.freeDesc'),
      popular: false,
      icon: <Zap className="w-8 h-8 text-muted-foreground" />,
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
      periodKey: "5days",
      stripePriceId: "price_premium_5day",
      description: t('subscription.premium5dayDesc'),
      popular: true,
      icon: <Crown className="w-8 h-8 text-yellow-500" />,
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
      periodKey: "year",
      stripePriceId: "price_premium_annual",
      description: t('subscription.premiumAnnualDesc'),
      popular: false,
      icon: <Crown className="w-8 h-8 text-primary" />,
      savings: t('subscription.bestValue'),
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
    try {
      await subscriptionService.createCheckout(plan.stripePriceId, plan.id);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(null);
    }
  };

  const getButtonText = (plan: typeof plans[0]) => {
    if (plan.id === 'free') {
      return currentPlan === 'free' || isExpired ? t('subscription.currentPlan') : t('subscription.getStarted');
    }
    if (loading === plan.id) return t('subscription.processing');
    // If user has active matching plan
    if (!isExpired && currentPlan === 'pro' && plan.id.startsWith('premium')) return t('subscription.currentPlan');
    if (!isExpired && currentPlan === 'premium' && plan.id.startsWith('premium')) return t('subscription.currentPlan');
    return t('subscription.subscribe');
  };

  const isCurrentPlan = (plan: typeof plans[0]) => {
    if (isExpired) return plan.id === 'free';
    if (plan.id === 'free') return currentPlan === 'free';
    return (currentPlan === 'pro' || currentPlan === 'premium') && plan.id.startsWith('premium');
  };

  const getDaysRemaining = () => {
    if (!user?.subscription?.endDate) return null;
    const end = new Date(user.subscription.endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('subscription.title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subscription.subtitle')}</p>

        {/* Subscription status banner */}
        {user && !isExpired && currentPlan !== 'free' && daysRemaining !== null && (
          <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {t('subscription.daysRemaining', { days: String(daysRemaining) })}
            </span>
          </div>
        )}

        {isExpired && (
          <div className="mt-6 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2">
            <Clock className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              {t('subscription.expired')}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('subscription.mostPopular')}</Badge>
            )}
            {plan.savings && (
              <Badge variant="secondary" className="absolute -top-3 right-4 bg-green-100 text-green-800 border-green-300">
                {plan.savings}
              </Badge>
            )}
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">{plan.icon}</div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}{plan.currency}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              {plan.id === 'premium_annual' && (
                <p className="text-xs text-muted-foreground mt-1">
                  ≈ 8.33€/{t('subscription.month')}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                disabled={isCurrentPlan(plan) || loading === plan.id || plan.id === 'free'}
              >
                {getButtonText(plan)}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
