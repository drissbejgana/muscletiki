import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {loadStripe} from '@stripe/stripe-js';
import {subscriptionService} from '@/services/subscriptionService'

const plans = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for beginners",
    features: [
      "Access to basic exercises",
      "Body diagram navigation",
      "Calorie calculator",
      "Limited workout programs",
    ],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "9.99",
    stripePriceId:"price_1SbJrO2OsficquMmJYABHu14",
    period: "month",
    description: "For serious fitness enthusiasts",
    features: [
      "All Free features",
      "Advanced exercise library",
      "Custom workout plans",
      "Progress tracking",
      "Macro calculator",
      "1RM calculator",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "19.99",
    stripePriceId:"price_1Sbfcc2OsficquMmqQXiRycJ",
    period: "month",
    description: "Ultimate fitness experience",
    features: [
      "All Pro features",
      "Personal trainer support",
      "Video tutorials",
      "Nutrition plans",
      "Priority support",
      "Exclusive content",
    ],
    popular: false,
  },
];

const SubscriptionPlans = () => {
  const handleSubscribe = async (planId: string, planType : string) => {
    console.log(`Subscribe to plan: ${planId}`);
    const stripe = await loadStripe('pk_test_51S9Xw22OsficquMm91xtWNGhmZCWjVMBXIst2DvJfw9YhAQPGh4maBLChXcmQzxKwaxzVjjRIRkdrRY1okCo6IJ200Jni9uAVH');  
    await subscriptionService.createCheckout(planId, planType)
  
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Unlock your full fitness potential with our subscription plans
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.popular ? "border-primary shadow-lg scale-105" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.stripePriceId,plan.name)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.id === "free" ? "Get Started" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
