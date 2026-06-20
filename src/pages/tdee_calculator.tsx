import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/i18n";

type Formula = "mifflin" | "harris" | "katch";

type TDEEResult = {
  bmr: number;
  tdee: number;
  extremeCut: number;
  cut: number;
  maintenance: number;
  bulk: number;
  aggressiveBulk: number;
  bmi: number;
  bmiCategory: string;
  weeklyCalories: number;
  monthlyCalories: number;
};

const TDEECalculator = () => {
  const { t } = useTranslation();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [bodyFat, setBodyFat] = useState(20);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [formula, setFormula] = useState<Formula>("mifflin");
  const [results, setResults] = useState<TDEEResult | null>(null);

  const getSurroundingNumbers = (value: number, min: number, max: number) =>
    Array.from({ length: 5 }, (_, i) => value - 2 + i).filter(n => n >= min && n <= max);

  const getBmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return t('tdeeCalc.bmiCategories.underweight');
    if (bmi < 25) return t('tdeeCalc.bmiCategories.normal');
    if (bmi < 30) return t('tdeeCalc.bmiCategories.overweight');
    return t('tdeeCalc.bmiCategories.obese');
  };

  const getBmiColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-blue-500";
    if (bmi < 25) return "text-green-500";
    if (bmi < 30) return "text-yellow-500";
    return "text-red-500";
  };

  const calculateTDEE = () => {
    const w = units === "imperial" ? weight * 0.453592 : weight;
    const h = units === "imperial" ? height * 2.54 : height;

    let bmr: number;
    if (formula === "mifflin") {
      if (gender === "male") bmr = 10 * w + 6.25 * h - 5 * age + 5;
      else bmr = 10 * w + 6.25 * h - 5 * age - 161;
    } else if (formula === "harris") {
      if (gender === "male") bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * age;
      else bmr = 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
    } else {
      const lbm = w * (1 - bodyFat / 100);
      bmr = 370 + 21.6 * lbm;
    }

    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * multipliers[activityLevel];
    const bmi = w / ((h / 100) ** 2);

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      extremeCut: Math.round(tdee - 1000),
      cut: Math.round(tdee - 500),
      maintenance: Math.round(tdee),
      bulk: Math.round(tdee + 250),
      aggressiveBulk: Math.round(tdee + 500),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: getBmiCategory(bmi),
      weeklyCalories: Math.round(tdee * 7),
      monthlyCalories: Math.round(tdee * 30),
    });
  };

  const goalCards = results
    ? [
        { label: t('tdeeCalc.extremeCut'), value: results.extremeCut, delta: "-1000", color: "text-red-500" },
        { label: t('tdeeCalc.cut'), value: results.cut, delta: "-500", color: "text-orange-500" },
        { label: t('tdeeCalc.maintenance'), value: results.maintenance, delta: "0", color: "text-primary" },
        { label: t('tdeeCalc.bulk'), value: results.bulk, delta: "+250", color: "text-green-500" },
        { label: t('tdeeCalc.aggressiveBulk'), value: results.aggressiveBulk, delta: "+500", color: "text-emerald-600" },
      ]
    : [];

  const heightMin = units === "metric" ? 100 : 40;
  const heightMax = units === "metric" ? 250 : 100;
  const weightMin = units === "metric" ? 30 : 65;
  const weightMax = units === "metric" ? 250 : 550;
  const heightSuffix = units === "metric" ? "CM" : "IN";
  const weightSuffix = units === "metric" ? "KG" : "LB";

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">{t('tdeeCalc.title')}</h1>
        <p className="text-center text-muted-foreground mb-2">{t('tdeeCalc.description')}</p>
        <p className="text-center text-muted-foreground mb-8">{t('tdeeCalc.formulaNote')}</p>

        <div className="space-y-6">
          {/* Formula */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('tdeeCalc.formulaLabel')}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["mifflin", "harris", "katch"] as Formula[]).map((f) => (
                <Button
                  key={f}
                  type="button"
                  variant={formula === f ? "default" : "outline"}
                  onClick={() => setFormula(f)}
                  className="h-12 font-semibold text-sm"
                >
                  {t(`tdeeCalc.formulas.${f}`)}
                </Button>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('tdeeCalc.gender')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" onClick={() => setGender("male")} variant={gender === "male" ? "default" : "outline"} className="h-12 font-semibold" disabled={formula === "katch"}>
                {t('tdeeCalc.male')}
              </Button>
              <Button type="button" onClick={() => setGender("female")} variant={gender === "female" ? "default" : "outline"} className="h-12 font-semibold" disabled={formula === "katch"}>
                {t('tdeeCalc.female')}
              </Button>
            </div>
            {formula === "katch" && (
              <p className="text-xs text-muted-foreground mt-2">{t('tdeeCalc.katchNote')}</p>
            )}
          </div>

          {/* Units */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('tdeeCalc.units')}</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" onClick={() => setUnits("metric")} variant={units === "metric" ? "default" : "outline"} className="h-12 font-semibold">
                {t('tdeeCalc.metric')}
              </Button>
              <Button type="button" onClick={() => setUnits("imperial")} variant={units === "imperial" ? "default" : "outline"} className="h-12 font-semibold">
                {t('tdeeCalc.imperial')}
              </Button>
            </div>
          </div>

          {/* Age / Height / Weight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: t('tdeeCalc.age'), value: age, set: setAge, min: 13, max: 99, suffix: "13-99" },
              { label: t('tdeeCalc.height'), value: height, set: setHeight, min: heightMin, max: heightMax, suffix: heightSuffix },
              { label: t('tdeeCalc.weight'), value: weight, set: setWeight, min: weightMin, max: weightMax, suffix: weightSuffix },
            ].map(({ label, value, set, min, max, suffix }) => (
              <div key={label}>
                <Label className="text-sm font-bold text-primary mb-2 block">{label}</Label>
                <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="text-2xl font-bold border-0 p-0 h-auto text-center"
                    min={min}
                    max={max}
                  />
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

          {/* Body Fat (Katch-McArdle only) */}
          {formula === "katch" && (
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">{t('tdeeCalc.bodyFat')}</Label>
              <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                <Input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto text-center"
                  min={3}
                  max={60}
                />
                <div className="border-l h-8 mx-2" />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                {getSurroundingNumbers(bodyFat, 3, 60).map((n) => (
                  <span key={n} className={n === bodyFat ? "text-primary font-bold" : ""}>{n}</span>
                ))}
              </div>
              <Slider value={[bodyFat]} onValueChange={(v) => setBodyFat(v[0])} min={3} max={60} step={1} className="mt-2" />
            </div>
          )}

          {/* Activity Level */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">{t('tdeeCalc.activityLevel')}</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger className="h-12 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="sedentary">{t('tdeeCalc.activities.sedentary')}</SelectItem>
                <SelectItem value="light">{t('tdeeCalc.activities.light')}</SelectItem>
                <SelectItem value="moderate">{t('tdeeCalc.activities.moderate')}</SelectItem>
                <SelectItem value="active">{t('tdeeCalc.activities.active')}</SelectItem>
                <SelectItem value="veryActive">{t('tdeeCalc.activities.veryActive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calculate */}
          <div className="flex justify-center pt-4">
            <Button onClick={calculateTDEE} size="lg" className="h-12 px-16 text-base font-bold">
              {t('tdeeCalc.calculate')}
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="mt-8 space-y-4">
              {/* BMR + TDEE */}
              <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">{t('tdeeCalc.bmrLabel')}</div>
                    <div className="text-3xl font-bold text-foreground">{results.bmr}</div>
                    <div className="text-xs text-muted-foreground">{t('tdeeCalc.calPerDay')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase mb-1">{t('tdeeCalc.tdeeLabel')}</div>
                    <div className="text-4xl font-bold text-primary">{results.tdee}</div>
                    <div className="text-xs text-muted-foreground">{t('tdeeCalc.calPerDay')}</div>
                  </div>
                </div>
              </div>

              {/* Goal Cards */}
              <div className="bg-background border rounded-lg p-6">
                <h3 className="text-sm font-bold text-foreground mb-4 text-center uppercase">{t('tdeeCalc.goalCalories')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {goalCards.map((g) => (
                    <div key={g.label} className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className={`text-xl font-bold ${g.color}`}>{g.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{g.label}</div>
                      <div className="text-xs font-semibold text-muted-foreground">{g.delta} kcal</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BMI + Projections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border rounded-lg p-6 text-center">
                  <h3 className="text-xs text-muted-foreground uppercase mb-3">{t('tdeeCalc.bmi')}</h3>
                  <div className={`text-4xl font-bold mb-1 ${getBmiColor(results.bmi)}`}>{results.bmi}</div>
                  <div className={`text-sm font-semibold ${getBmiColor(results.bmi)}`}>{results.bmiCategory}</div>
                </div>
                <div className="bg-background border rounded-lg p-6">
                  <h3 className="text-xs text-muted-foreground uppercase mb-4 text-center">{t('tdeeCalc.projections')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('tdeeCalc.weeklyCalories')}</span>
                      <span className="font-bold text-primary">{results.weeklyCalories.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('tdeeCalc.monthlyCalories')}</span>
                      <span className="font-bold text-primary">{results.monthlyCalories.toLocaleString()}</span>
                    </div>
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

export default TDEECalculator;
