import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/i18n";

type CalorieResult = { bmr: number; maintenance: number; target: number; goal: string; protein: number; carbs: number; fat: number };

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState(18);
  const [height, setHeight] = useState(150);
  const [weight, setWeight] = useState(100);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [goal, setGoal] = useState("maintain");
  const [results, setResults] = useState<CalorieResult | null>(null);
  const { t } = useTranslation();

  const calculateCalories = () => {
    let bmr: number;
    const w = units === "imperial" ? weight * 0.453592 : weight;
    const h = units === "imperial" ? height * 2.54 : height;
    if (gender === "male") bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * age);
    else bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * age);
    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    const maintenance = bmr * multipliers[activityLevel];
    let target = maintenance;
    if (goal === "lose") target -= 500;
    if (goal === "gain") target += 500;
    const protein = Math.round((target * 0.3) / 4);
    const carbs = Math.round((target * 0.4) / 4);
    const fat = Math.round((target * 0.3) / 9);
    setResults({ bmr: Math.round(bmr), maintenance: Math.round(maintenance), target: Math.round(target), goal, protein, carbs, fat });
  };

  const getSurroundingNumbers = (value: number, min: number, max: number) =>
    Array.from({ length: 5 }, (_, i) => value - 2 + i).filter(n => n >= min && n <= max);

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">{t('calorieCalc.title')}</h1>
        <p className="text-center text-muted-foreground mb-2">{t('calorieCalc.description')}</p>
        <p className="text-center text-muted-foreground mb-8">{t('calorieCalc.formula')}</p>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('calorieCalc.gender')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" onClick={() => setGender("male")} variant={gender === "male" ? "default" : "outline"} className="h-12 font-semibold">{t('calorieCalc.male')}</Button>
              <Button type="button" onClick={() => setGender("female")} variant={gender === "female" ? "default" : "outline"} className="h-12 font-semibold">{t('calorieCalc.female')}</Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('calorieCalc.units')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" onClick={() => setUnits("metric")} variant={units === "metric" ? "default" : "outline"} className="h-12 font-semibold">{t('calorieCalc.metric')}</Button>
              <Button type="button" onClick={() => setUnits("imperial")} variant={units === "imperial" ? "default" : "outline"} className="h-12 font-semibold">{t('calorieCalc.imperial')}</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: t('calorieCalc.age'), value: age, set: setAge, min: 13, max: 99, suffix: "13-99" },
              { label: t('calorieCalc.height'), value: height, set: setHeight, min: units === "metric" ? 100 : 40, max: units === "metric" ? 250 : 100, suffix: units === "metric" ? "CM" : "IN" },
              { label: t('calorieCalc.weight'), value: weight, set: setWeight, min: units === "metric" ? 30 : 65, max: units === "metric" ? 200 : 440, suffix: units === "metric" ? "KG" : "LB" },
            ].map(({ label, value, set, min, max, suffix }) => (
              <div key={label}>
                <Label className="text-sm font-bold text-primary mb-2 block">{label}</Label>
                <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                  <Input type="number" value={value} onChange={(e) => set(Number(e.target.value))} className="text-2xl font-bold border-0 p-0 h-auto text-center" min={min} max={max} />
                  <div className="border-l h-8 mx-2" />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{suffix}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                  {getSurroundingNumbers(value, min, max).map((n) => (
                    <span key={n} className={n === value ? "text-primary font-bold" : ""}>{n}</span>
                  ))}
                </div>
                <Slider value={[value]} onValueChange={(v) => set(v[0])} min={min} max={max} step={1} className="mt-2" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">{t('calorieCalc.activityLevel')}</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="sedentary">{t('calorieCalc.activities.sedentary')}</SelectItem>
                  <SelectItem value="light">{t('calorieCalc.activities.light')}</SelectItem>
                  <SelectItem value="moderate">{t('calorieCalc.activities.moderate')}</SelectItem>
                  <SelectItem value="active">{t('calorieCalc.activities.active')}</SelectItem>
                  <SelectItem value="veryActive">{t('calorieCalc.activities.veryActive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">{t('calorieCalc.goal')}</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="lose">{t('calorieCalc.goals.lose')}</SelectItem>
                  <SelectItem value="maintain">{t('calorieCalc.goals.maintain')}</SelectItem>
                  <SelectItem value="gain">{t('calorieCalc.goals.gain')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={calculateCalories} size="lg" className="h-12 px-16 text-base font-bold">{t('calorieCalc.calculate')}</Button>
          </div>

          {results && (
            <div className="mt-8 space-y-4">
              <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">{t('calorieCalc.bmrLabel')}</div>
                    <div className="text-3xl font-bold text-foreground">{results.bmr}</div>
                    <div className="text-xs text-muted-foreground">kcal/{t('common.day')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">{t('calorieCalc.maintenanceLabel')}</div>
                    <div className="text-3xl font-bold text-foreground">{results.maintenance}</div>
                    <div className="text-xs text-muted-foreground">kcal/{t('common.day')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">{t('calorieCalc.targetLabel')}</div>
                    <div className="text-4xl font-bold text-primary">{results.target}</div>
                    <div className="text-xs text-muted-foreground">kcal/{t('common.day')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-background border rounded-lg p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 text-center">{t('calorieCalc.suggestedMacros')}</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{results.protein}g</div>
                    <div className="text-xs text-muted-foreground">{t('macroCalc.protein')} (30%)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{results.carbs}g</div>
                    <div className="text-xs text-muted-foreground">{t('macroCalc.carbs')} (40%)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{results.fat}g</div>
                    <div className="text-xs text-muted-foreground">{t('macroCalc.fat')} (30%)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
