import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

type Formula = "mifflin" | "harris" | "katch";

type TDEEResult = {
  bmr: number; tdee: number; extremeCut: number; cut: number;
  maintenance: number; bulk: number; aggressiveBulk: number;
  bmi: number; bmiCategory: string; weeklyCalories: number; monthlyCalories: number;
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{children}</p>
);

const PillToggle = ({ options, value, onChange, disabled }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; disabled?: boolean }) => (
  <div className="flex rounded-xl overflow-hidden border border-border bg-secondary p-1 gap-1">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => !disabled && onChange(opt.value)}
        disabled={disabled}
        className={cn(
          "flex-1 py-2 rounded-lg text-sm font-semibold transition-all",
          value === opt.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          disabled && "opacity-40 cursor-not-allowed"
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const TDEECalculator = () => {
  const { t } = useTranslation();
  const [gender, setGender]           = useState<"male" | "female">("male");
  const [units, setUnits]             = useState<"metric" | "imperial">("metric");
  const [age, setAge]                 = useState(25);
  const [height, setHeight]           = useState(175);
  const [weight, setWeight]           = useState(75);
  const [bodyFat, setBodyFat]         = useState(20);
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [formula, setFormula]         = useState<Formula>("mifflin");
  const [results, setResults]         = useState<TDEEResult | null>(null);

  const getSurroundingNumbers = (value: number, min: number, max: number) =>
    Array.from({ length: 5 }, (_, i) => value - 2 + i).filter((n) => n >= min && n <= max);

  const getBmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return t("tdeeCalc.bmiCategories.underweight");
    if (bmi < 25)   return t("tdeeCalc.bmiCategories.normal");
    if (bmi < 30)   return t("tdeeCalc.bmiCategories.overweight");
    return t("tdeeCalc.bmiCategories.obese");
  };

  const getBmiColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-primary/70";
    if (bmi < 25)   return "text-primary";
    if (bmi < 30)   return "text-accent";
    return "text-destructive";
  };

  const calculateTDEE = () => {
    const w = units === "imperial" ? weight * 0.453592 : weight;
    const h = units === "imperial" ? height * 2.54     : height;

    let bmr: number;
    if (formula === "mifflin") {
      bmr = gender === "male"
        ? 10 * w + 6.25 * h - 5 * age + 5
        : 10 * w + 6.25 * h - 5 * age - 161;
    } else if (formula === "harris") {
      bmr = gender === "male"
        ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * age
        : 447.593 + 9.247 * w + 3.098 * h - 4.330 * age;
    } else {
      const lbm = w * (1 - bodyFat / 100);
      bmr = 370 + 21.6 * lbm;
    }

    const multipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9,
    };
    const tdee = bmr * multipliers[activityLevel];
    const bmi  = w / ((h / 100) ** 2);

    setResults({
      bmr: Math.round(bmr), tdee: Math.round(tdee),
      extremeCut:    Math.round(tdee - 1000),
      cut:           Math.round(tdee - 500),
      maintenance:   Math.round(tdee),
      bulk:          Math.round(tdee + 250),
      aggressiveBulk: Math.round(tdee + 500),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: getBmiCategory(bmi),
      weeklyCalories:  Math.round(tdee * 7),
      monthlyCalories: Math.round(tdee * 30),
    });
  };

  const goalCards = results
    ? [
        { label: t("tdeeCalc.extremeCut"),    value: results.extremeCut,    delta: "-1000", color: "text-destructive" },
        { label: t("tdeeCalc.cut"),           value: results.cut,           delta: "-500",  color: "text-accent" },
        { label: t("tdeeCalc.maintenance"),   value: results.maintenance,   delta: "0",     color: "text-primary" },
        { label: t("tdeeCalc.bulk"),          value: results.bulk,          delta: "+250",  color: "text-primary" },
        { label: t("tdeeCalc.aggressiveBulk"), value: results.aggressiveBulk, delta: "+500", color: "text-primary" },
      ]
    : [];

  const heightMin    = units === "metric" ? 100 : 40;
  const heightMax    = units === "metric" ? 250 : 100;
  const weightMin    = units === "metric" ? 30  : 65;
  const weightMax    = units === "metric" ? 250 : 550;
  const heightSuffix = units === "metric" ? "cm" : "in";
  const weightSuffix = units === "metric" ? "kg" : "lb";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">TDEE Calculator</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-2">{t("tdeeCalc.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("tdeeCalc.description")}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Formula */}
        <div>
          <SectionLabel>{t("tdeeCalc.formulaLabel")}</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {(["mifflin", "harris", "katch"] as Formula[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormula(f)}
                className={cn(
                  "py-3 rounded-xl border text-sm font-semibold transition-all",
                  formula === f
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                )}
              >
                {t(`tdeeCalc.formulas.${f}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div>
          <SectionLabel>{t("tdeeCalc.gender")}</SectionLabel>
          <PillToggle
            options={[
              { value: "male",   label: t("tdeeCalc.male") },
              { value: "female", label: t("tdeeCalc.female") },
            ]}
            value={gender}
            onChange={(v) => setGender(v as "male" | "female")}
            disabled={formula === "katch"}
          />
          {formula === "katch" && (
            <p className="text-xs text-muted-foreground mt-2">{t("tdeeCalc.katchNote")}</p>
          )}
        </div>

        {/* Units */}
        <div>
          <SectionLabel>{t("tdeeCalc.units")}</SectionLabel>
          <PillToggle
            options={[
              { value: "metric",   label: t("tdeeCalc.metric") },
              { value: "imperial", label: t("tdeeCalc.imperial") },
            ]}
            value={units}
            onChange={(v) => setUnits(v as "metric" | "imperial")}
          />
        </div>

        {/* Age / Height / Weight sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: t("tdeeCalc.age"),    value: age,    set: setAge,    min: 13, max: 99, suffix: "yr" },
            { label: t("tdeeCalc.height"), value: height, set: setHeight, min: heightMin, max: heightMax, suffix: heightSuffix },
            { label: t("tdeeCalc.weight"), value: weight, set: setWeight, min: weightMin, max: weightMax, suffix: weightSuffix },
          ].map(({ label, value, set, min, max, suffix }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <SectionLabel>{label}</SectionLabel>
                <span className="text-xs font-semibold text-muted-foreground">{suffix}</span>
              </div>
              <Input
                type="number"
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                min={min}
                max={max}
                className="text-2xl font-black text-center border-0 bg-transparent p-0 h-auto focus-visible:ring-0 mb-3"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mb-2 px-0.5">
                {getSurroundingNumbers(value, min, max).map((n) => (
                  <span key={n} className={cn(n === value && "text-primary font-bold")}>{n}</span>
                ))}
              </div>
              <Slider value={[value]} onValueChange={(v) => set(v[0])} min={min} max={max} step={1} />
            </div>
          ))}
        </div>

        {/* Body Fat (Katch only) */}
        {formula === "katch" && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel>{t("tdeeCalc.bodyFat")}</SectionLabel>
              <span className="text-xs font-semibold text-muted-foreground">%</span>
            </div>
            <Input
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(Number(e.target.value))}
              min={3}
              max={60}
              className="text-2xl font-black text-center border-0 bg-transparent p-0 h-auto focus-visible:ring-0 mb-3"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mb-2 px-0.5">
              {getSurroundingNumbers(bodyFat, 3, 60).map((n) => (
                <span key={n} className={cn(n === bodyFat && "text-primary font-bold")}>{n}</span>
              ))}
            </div>
            <Slider value={[bodyFat]} onValueChange={(v) => setBodyFat(v[0])} min={3} max={60} step={1} />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <SectionLabel>{t("tdeeCalc.activityLevel")}</SectionLabel>
          <Select value={activityLevel} onValueChange={setActivityLevel}>
            <SelectTrigger className="h-12 bg-card border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="sedentary">{t("tdeeCalc.activities.sedentary")}</SelectItem>
              <SelectItem value="light">{t("tdeeCalc.activities.light")}</SelectItem>
              <SelectItem value="moderate">{t("tdeeCalc.activities.moderate")}</SelectItem>
              <SelectItem value="active">{t("tdeeCalc.activities.active")}</SelectItem>
              <SelectItem value="veryActive">{t("tdeeCalc.activities.veryActive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* CTA */}
        <button
          onClick={calculateTDEE}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          {t("tdeeCalc.calculate")}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-4 pt-2">
            {/* BMR + TDEE */}
            <div className="bg-card border border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/5">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t("tdeeCalc.bmrLabel")}</div>
                  <div className="text-3xl font-black text-foreground">{results.bmr}</div>
                  <div className="text-[10px] text-muted-foreground">{t("tdeeCalc.calPerDay")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t("tdeeCalc.tdeeLabel")}</div>
                  <div className="text-4xl font-black text-primary">{results.tdee}</div>
                  <div className="text-[10px] text-muted-foreground">{t("tdeeCalc.calPerDay")}</div>
                </div>
              </div>
            </div>

            {/* Goal Cards */}
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">{t("tdeeCalc.goalCalories")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {goalCards.map((g) => (
                  <div key={g.label} className="text-center p-3 bg-secondary rounded-xl">
                    <div className={cn("text-xl font-black", g.color)}>{g.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{g.label}</div>
                    <div className="text-[10px] font-semibold text-muted-foreground/60">{g.delta} kcal</div>
                  </div>
                ))}
              </div>
            </div>

            {/* BMI + Projections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{t("tdeeCalc.bmi")}</p>
                <div className={cn("text-4xl font-black mb-1", getBmiColor(results.bmi))}>{results.bmi}</div>
                <div className={cn("text-sm font-semibold", getBmiColor(results.bmi))}>{results.bmiCategory}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">{t("tdeeCalc.projections")}</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("tdeeCalc.weeklyCalories")}</span>
                    <span className="font-bold text-primary">{results.weeklyCalories.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t("tdeeCalc.monthlyCalories")}</span>
                    <span className="font-bold text-primary">{results.monthlyCalories.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TDEECalculator;
