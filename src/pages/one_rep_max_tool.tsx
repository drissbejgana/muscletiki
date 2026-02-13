import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";

type Unit = "kg" | "lbs";

const OneRMCalculator = () => {
  const [unit, setUnit] = useState<Unit>("kg");
  const [reps, setReps] = useState<string>("5");
  const [weight, setWeight] = useState<string>("45.36");
  const [oneRM, setOneRM] = useState<number>(0);
  const { t } = useTranslation();

  const calculateOneRM = (w: number, r: number): number => {
    if (r <= 0 || r > 10 || w <= 0) return 0;
    return w / (1.0278 - 0.0278 * r);
  };

  useEffect(() => {
    const w = parseFloat(weight), r = parseInt(reps);
    if (!isNaN(w) && !isNaN(r)) setOneRM(Math.round(calculateOneRM(w, r)));
  }, [weight, reps]);

  const percentages = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t('oneRM.title')}</h1>
          <p className="text-foreground text-lg mb-6 max-w-3xl mx-auto">{t('oneRM.description')}</p>
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-warning mt-0.5 flex-shrink-0" size={20} />
              <p className="text-warning text-sm text-left">{t('oneRM.warning')}</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm italic">{t('oneRM.formula')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-md border-2">
            <Label className="text-lg font-semibold mb-4 block">{t('oneRM.units')}</Label>
            <RadioGroup value={unit} onValueChange={(value) => setUnit(value as Unit)}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="kg" id="kg" className="border-primary data-[state=checked]:bg-primary" />
                <Label htmlFor="kg" className="cursor-pointer font-medium">KG</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lbs" id="lbs" className="border-primary data-[state=checked]:bg-primary" />
                <Label htmlFor="lbs" className="cursor-pointer font-medium">LBS</Label>
              </div>
            </RadioGroup>
          </Card>
          <Card className="p-6 shadow-md border-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reps" className="text-base font-semibold mb-2 block">{t('oneRM.reps')}</Label>
                <div className="relative">
                  <Input id="reps" type="number" value={reps} onChange={(e) => setReps(e.target.value)} className="pr-20 text-base" min="1" max="10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{t('oneRM.repsUnit')}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="weight" className="text-base font-semibold mb-2 block">{t('oneRM.weightLifted')}</Label>
                <div className="relative">
                  <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="pr-12 text-base" step="0.01" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">{unit.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 mb-12 shadow-lg border-2 border-primary/50 bg-card">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t('oneRM.estimated1RM')}</h2>
            <p className="text-6xl font-bold text-primary">{oneRM} <span className="text-4xl">{unit.toUpperCase()}</span></p>
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">{t('oneRM.trainingPercentages')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
            {percentages.map((pct) => (
              <Card key={pct} className="p-6 text-center shadow-md hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                <p className="text-3xl font-bold text-primary mb-2">{pct}%</p>
                <p className="text-2xl font-semibold text-foreground mb-1">{Math.round((oneRM * pct) / 100)} {unit.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{t('common.of')} <span className="text-warning">1RM</span></p>
              </Card>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm">{t('oneRM.percentageNote')}</p>
        </div>
      </div>
    </div>
  );
};

export default OneRMCalculator;
