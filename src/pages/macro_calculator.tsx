import { useState } from "react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

type MacroDistribution = { carbs: number; protein: number; fat: number };

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

const MacroCalculator = () => {
  const [distribution, setDistribution] = useState("balanced");
  const [calories, setCalories] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [results, setResults] = useState<MacroDistribution | null>(null);
  const { t } = useTranslation();

  const distributions: Record<string, MacroDistribution> = {
    balanced:    { carbs: 40, protein: 30, fat: 30 },
    lowCarb:     { carbs: 20, protein: 40, fat: 40 },
    highProtein: { carbs: 30, protein: 40, fat: 30 },
    keto:        { carbs: 5,  protein: 25, fat: 70 },
  };

  const calculateMacros = () => {
    const dist = distributions[distribution];
    setResults({
      carbs:   Math.round((calories * (dist.carbs   / 100)) / 4),
      protein: Math.round((calories * (dist.protein / 100)) / 4),
      fat:     Math.round((calories * (dist.fat     / 100)) / 9),
    });
  };

  const currentDist = distributions[distribution];

  const distOptions = [
    { value: "balanced",    label: t("macroCalc.balanced"),    ratio: "40/30/30" },
    { value: "lowCarb",     label: t("macroCalc.lowCarb"),     ratio: "20/40/40" },
    { value: "highProtein", label: t("macroCalc.highProtein"), ratio: "30/40/30" },
    { value: "keto",        label: t("macroCalc.keto"),        ratio: "5/25/70"  },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Macro Calculator</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-2">{t("macroCalc.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("macroCalc.description")}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        {/* Distribution */}
        <div>
          <SectionLabel>{t("macroCalc.distribution")}</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {distOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDistribution(opt.value)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border transition-all text-left",
                  distribution === opt.value
                    ? "bg-primary/10 border-primary/40 shadow-sm"
                    : "bg-card border-border hover:border-primary/20"
                )}
              >
                <span className={cn("text-sm font-bold mb-0.5", distribution === opt.value ? "text-primary" : "text-foreground")}>
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{opt.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current distribution preview */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>{t("macroCalc.macroDistribution")}</SectionLabel>
          <div className="flex gap-4">
            {[
              { label: t("macroCalc.carbs"),   pct: currentDist.carbs },
              { label: t("macroCalc.protein"), pct: currentDist.protein },
              { label: t("macroCalc.fat"),     pct: currentDist.fat },
            ].map(({ label, pct }) => (
              <div key={label} className="flex-1 text-center">
                <div className="text-2xl font-black text-primary mb-0.5">{pct}%</div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily calories */}
        <div>
          <SectionLabel>{t("macroCalc.dailyCalories")}</SectionLabel>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <input
              type="number"
              value={calories}
              min={1000}
              max={5000}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-28 text-3xl font-black text-foreground bg-transparent border-0 focus:outline-none text-center"
            />
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-2 font-semibold">kcal / day</div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((calories - 1000) / 4000) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Meals per day */}
        <div>
          <SectionLabel>{t("macroCalc.mealsPerDay")}</SectionLabel>
          <PillToggle
            options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: String(n) }))}
            value={String(mealsPerDay)}
            onChange={(v) => setMealsPerDay(Number(v))}
          />
        </div>

        {/* CTA */}
        <button
          onClick={calculateMacros}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          {t("macroCalc.calculateDaily")}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-4 pt-2">
            <div className="bg-card border border-primary/30 rounded-xl p-5 shadow-lg shadow-primary/5">
              <SectionLabel>{`Per Meal (${mealsPerDay} ${t("macroCalc.perDay")})`}</SectionLabel>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: t("macroCalc.carbs"),   value: Math.round(results.carbs   / mealsPerDay) },
                  { label: t("macroCalc.protein"), value: Math.round(results.protein / mealsPerDay) },
                  { label: t("macroCalc.fat"),     value: Math.round(results.fat     / mealsPerDay) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-3xl font-black text-primary mb-0.5">{value}g</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <SectionLabel>{t("common.daily")}</SectionLabel>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: t("macroCalc.carbs"),   value: results.carbs },
                  { label: t("macroCalc.protein"), value: results.protein },
                  { label: t("macroCalc.fat"),     value: results.fat },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-foreground mb-0.5">{value}g</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
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

export default MacroCalculator;
