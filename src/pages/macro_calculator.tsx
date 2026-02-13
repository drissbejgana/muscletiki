import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/i18n";

type MacroDistribution = { carbs: number; protein: number; fat: number };

const MacroCalculator = () => {
  const [distribution, setDistribution] = useState("balanced");
  const [calories, setCalories] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [results, setResults] = useState<MacroDistribution | null>(null);
  const { t } = useTranslation();

  const distributions: Record<string, MacroDistribution> = {
    balanced: { carbs: 40, protein: 30, fat: 30 },
    lowCarb: { carbs: 20, protein: 40, fat: 40 },
    highProtein: { carbs: 30, protein: 40, fat: 30 },
    keto: { carbs: 5, protein: 25, fat: 70 }
  };

  const calculateMacros = () => {
    const dist = distributions[distribution];
    setResults({
      carbs: Math.round((calories * (dist.carbs / 100)) / 4),
      protein: Math.round((calories * (dist.protein / 100)) / 4),
      fat: Math.round((calories * (dist.fat / 100)) / 9),
    });
  };

  const currentDist = distributions[distribution];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center mb-4">{t('macroCalc.title')}</h1>
          <p className="text-center text-muted-foreground mb-2">{t('macroCalc.description')}</p>
          <p className="text-center text-muted-foreground mb-8">{t('macroCalc.descriptionCont')} <a href="#" className="text-primary hover:underline">{t('macroCalc.readGuide')}</a></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background border rounded-lg p-6">
              <Label className="text-sm font-bold text-foreground mb-4 block">{t('macroCalc.distribution')}</Label>
              <RadioGroup value={distribution} onValueChange={setDistribution}>
                <div className="space-y-3">
                  {[
                    { value: "balanced", label: t('macroCalc.balanced'), ratio: "(40/30/30)" },
                    { value: "lowCarb", label: t('macroCalc.lowCarb'), ratio: "(20/40/40)" },
                    { value: "highProtein", label: t('macroCalc.highProtein'), ratio: "(30/40/30)" },
                    { value: "keto", label: t('macroCalc.keto'), ratio: "(5/25/70)" },
                  ].map(({ value, label, ratio }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value} id={value} />
                      <label htmlFor={value} className="text-sm cursor-pointer">
                        <span className={value === distribution ? "text-primary font-semibold" : "text-muted-foreground"}>{label}</span>{" "}
                        <span className="text-muted-foreground">{ratio}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="bg-background border rounded-lg p-6 flex flex-col justify-between">
              <div>
                <Label className="text-sm font-bold text-foreground mb-4 block">{t('macroCalc.dailyCalories')}</Label>
                <div className="flex items-center gap-2 border rounded-md p-2 mb-4">
                  <Input type="number" value={calories} onChange={(e) => setCalories(Number(e.target.value))} className="text-2xl font-bold border-0 p-0 h-auto" min={1000} max={5000} />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">kcal</span>
                </div>
                <Button onClick={calculateMacros} className="w-full mb-4 font-semibold">{t('macroCalc.calculateDaily')}</Button>
              </div>
              <div>
                <Label className="text-sm font-bold text-foreground mb-2 block">{t('macroCalc.mealsPerDay')}</Label>
                <div className="flex items-center gap-2 border rounded-md p-2">
                  <Input type="number" value={mealsPerDay} onChange={(e) => setMealsPerDay(Number(e.target.value))} className="text-2xl font-bold border-0 p-0 h-auto" min={1} max={8} />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{t('macroCalc.perDay')}</span>
                </div>
              </div>
            </div>

            <div className="bg-background border rounded-lg p-6">
              <Label className="text-sm font-bold text-foreground mb-4 block">{t('macroCalc.macroDistribution')}</Label>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">{t('macroCalc.carbs')}:</span><span className="text-lg font-bold text-primary">{currentDist.carbs}%</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">{t('macroCalc.protein')}:</span><span className="text-lg font-bold text-primary">{currentDist.protein}%</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">{t('macroCalc.fat')}:</span><span className="text-lg font-bold text-primary">{currentDist.fat}%</span></div>
              </div>
            </div>
          </div>

          {results && (
            <div className="space-y-4">
              <div className="bg-background border-2 border-primary/20 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: t('macroCalc.carbs'), value: results.carbs },
                    { label: t('macroCalc.protein'), value: results.protein },
                    { label: t('macroCalc.fat'), value: results.fat },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-muted-foreground uppercase mb-1">{label}</div>
                      <div className="text-3xl font-bold text-primary">{Math.round(value / mealsPerDay)}g</div>
                      <div className="text-xs text-muted-foreground">{t('common.perMeal')}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-background border rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: t('macroCalc.carbs'), value: results.carbs },
                    { label: t('macroCalc.protein'), value: results.protein },
                    { label: t('macroCalc.fat'), value: results.fat },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-xs text-muted-foreground uppercase mb-1">{t('common.daily')}</div>
                      <div className="text-2xl font-bold text-foreground">{value}g {label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
