import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionService } from '@/services/subscriptionService';
import { useTranslation } from "@/i18n";

const SubscriptionPlans = () => {
  const { t } = useTranslation();

  const plans = [
    {
      id: "free", name: t('subscription.free'), price: "0", period: t('subscription.forever'),
      description: t('subscription.freeDesc'), popular: false,
      features: [t('subscription.features.basicExercises'), t('subscription.features.bodyDiagram'), t('subscription.features.calorieCalc'), t('subscription.features.limitedWorkouts')],
    },
    {
      id: "pro", name: t('subscription.pro'), price: "9.99", stripePriceId: "price_1SbJrO2OsficquMmJYABHu14",
      period: t('subscription.month'), description: t('subscription.proDesc'), popular: true,
      features: [t('subscription.features.allFree'), t('subscription.features.advancedLibrary'), t('subscription.features.customPlans'), t('subscription.features.progressTracking'), t('subscription.features.macroCalc'), t('subscription.features.oneRMCalc')],
    },
    {
      id: "premium", name: t('subscription.premium'), price: "19.99", stripePriceId: "price_1Sbfcc2OsficquMmqQXiRycJ",
      period: t('subscription.month'), description: t('subscription.premiumDesc'), popular: false,
      features: [t('subscription.features.allPro'), t('subscription.features.trainerSupport'), t('subscription.features.videoTutorials'), t('subscription.features.nutritionPlans'), t('subscription.features.prioritySupport'), t('subscription.features.exclusiveContent')],
    },
  ];

  const handleSubscribe = async (planId: string, planType: string) => {
    const stripe = await loadStripe('pk_test_51S9Xw22OsficquMm91xtWNGhmZCWjVMBXIst2DvJfw9YhAQPGh4maBLChXcmQzxKwaxzVjjRIRkdrRY1okCo6IJ200Jni9uAVH');
    await subscriptionService.createCheckout(planId, planType);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('subscription.title')}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('subscription.subtitle')}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
            {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t('subscription.mostPopular')}</Badge>}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4"><span className="text-4xl font-bold">${plan.price}</span><span className="text-muted-foreground">/{plan.period}</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-sm">{feature}</span></li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleSubscribe(plan.stripePriceId, plan.name)} className="w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.id === "free" ? t('subscription.getStarted') : t('subscription.subscribe')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
