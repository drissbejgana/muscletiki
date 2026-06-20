import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Flame, Activity, Target } from "lucide-react";

type CalorieResult = { bmr: number; maintenance: number; target: number; goal: string; protein: number; carbs: number; fat: number };

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{children}</p>
);

const PillToggle = ({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) => (
  <div className="flex rounded-xl overflow-hidden border border-border bg-secondary p-1 gap-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
          value === opt.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const NumberInput = ({ label, value, onChange, min, max, suffix }: any) => {
  const range = max - min;
  const percent = Math.min(100, Math.max(0, ((value - min) / range) * 100));
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>{label}</SectionLabel>
        <span className="text-xs font-semibold text-muted-foreground">{suffix}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 text-2xl font-black text-foreground bg-transparent border-0 focus:outline-none text-center"
        />
        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>
      <Slider value={[value]} onValueChange={(v) => onChange(v[0])} min={min} max={max} step={1} className="mt-1" />
    </div>
  );
};

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(75);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [goal, setGoal] = useState("maintain");
  const [results, setResults] = useState<CalorieResult | null>(null);
  const { t } = useTranslation();

  const calculateCalories = () => {
    const w = units === "imperial" ? weight * 0.453592 : weight;
    const h = units === "imperial" ? height * 2.54 : height;
    const bmr = gender === "male"
      ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age
      : 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
    const maintenance = bmr * multipliers[activityLevel];
    let target = maintenance;
    if (goal === "lose") target -= 500;
    if (goal === "gain") target += 500;
    const protein = Math.round((target * 0.3) / 4);
    const carbs   = Math.round((target * 0.4) / 4);
    const fat     = Math.round((target * 0.3) / 9);
    setResults({ bmr: Math.round(bmr), maintenance: Math.round(maintenance), target: Math.round(target), goal, protein, carbs, fat });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Calorie Calculator</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-2">{t('calorieCalc.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('calorieCalc.description')}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        {/* Gender */}
        <div>
          <SectionLabel>{t('calorieCalc.gender')}</SectionLabel>
          <PillToggle
            options={[{ value: "male", label: t('calorieCalc.male') }, { value: "female", label: t('calorieCalc.female') }]}
            value={gender} onChange={(v) => setGender(v as "male" | "female")}
          />
        </div>

        {/* Units */}
        <div>
          <SectionLabel>{t('calorieCalc.units')}</SectionLabel>
          <PillToggle
            options={[{ value: "metric", label: t('calorieCalc.metric') }, { value: "imperial", label: t('calorieCalc.imperial') }]}
            value={units} onChange={(v) => setUnits(v as "metric" | "imperial")}
          />
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NumberInput label={t('calorieCalc.age')} value={age} onChange={setAge} min={13} max={99} suffix="yrs" />
          <NumberInput label={t('calorieCalc.height')} value={height} onChange={setHeight}
            min={units === "metric" ? 100 : 40} max={units === "metric" ? 250 : 100}
            suffix={units === "metric" ? "cm" : "in"} />
          <NumberInput label={t('calorieCalc.weight')} value={weight} onChange={setWeight}
            min={units === "metric" ? 30 : 65} max={units === "metric" ? 200 : 440}
            suffix={units === "metric" ? "kg" : "lb"} />
        </div>

        {/* Activity + Goal selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SectionLabel>{t('calorieCalc.activityLevel')}</SectionLabel>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger className="h-12 bg-card border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="sedentary">{t('calorieCalc.activities.sedentary')}</SelectItem>
                <SelectItem value="light">{t('calorieCalc.activities.light')}</SelectItem>
                <SelectItem value="moderate">{t('calorieCalc.activities.moderate')}</SelectItem>
                <SelectItem value="active">{t('calorieCalc.activities.active')}</SelectItem>
                <SelectItem value="veryActive">{t('calorieCalc.activities.veryActive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <SectionLabel>{t('calorieCalc.goal')}</SectionLabel>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="h-12 bg-card border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="lose">{t('calorieCalc.goals.lose')}</SelectItem>
                <SelectItem value="maintain">{t('calorieCalc.goals.maintain')}</SelectItem>
                <SelectItem value="gain">{t('calorieCalc.goals.gain')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={calculateCalories}
          className="w-full h-13 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          {t('calorieCalc.calculate')}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-4 pt-2">
            {/* Main metrics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('calorieCalc.bmrLabel'), value: results.bmr, icon: Activity, muted: true },
                { label: t('calorieCalc.maintenanceLabel'), value: results.maintenance, icon: Flame, muted: true },
                { label: t('calorieCalc.targetLabel'), value: results.target, icon: Target, muted: false },
              ].map(({ label, value, icon: Icon, muted }) => (
                <div key={label} className={cn("bg-card border rounded-xl p-4 text-center", muted ? "border-border" : "border-primary/40 shadow-lg shadow-primary/10")}>
                  <Icon className={cn("h-4 w-4 mx-auto mb-2", muted ? "text-muted-foreground" : "text-primary")} />
                  <div className={cn("text-2xl font-black mb-0.5", muted ? "text-foreground" : "text-primary")}>{value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
                  <div className="text-[10px] text-muted-foreground">kcal/{t('common.day')}</div>
                </div>
              ))}
            </div>

            {/* Macros */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">{t('calorieCalc.suggestedMacros')}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: t('macroCalc.protein'), value: results.protein, pct: "30%" },
                  { label: t('macroCalc.carbs'),   value: results.carbs,   pct: "40%" },
                  { label: t('macroCalc.fat'),      value: results.fat,     pct: "30%" },
                ].map(({ label, value, pct }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-primary mb-0.5">{value}g</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-[10px] text-muted-foreground/60">({pct})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieCalculator;
