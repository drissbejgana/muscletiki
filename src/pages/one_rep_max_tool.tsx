import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Zap } from "lucide-react";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

type Unit = "kg" | "lbs";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{children}</p>
);

const OneRMCalculator = () => {
  const [unit, setUnit]     = useState<Unit>("kg");
  const [reps, setReps]     = useState<string>("5");
  const [weight, setWeight] = useState<string>("45.36");
  const [oneRM, setOneRM]   = useState<number>(0);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">1 Rep Max</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-2">{t("oneRM.title")}</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-4">{t("oneRM.description")}</p>
          <div className="inline-flex items-start gap-3 bg-accent/10 border border-accent/20 rounded-xl px-4 py-3 text-left max-w-xl mx-auto">
            <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <p className="text-xs text-accent/90">{t("oneRM.warning")}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Unit + Inputs */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Units */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionLabel>{t("oneRM.units")}</SectionLabel>
            <div className="flex rounded-xl overflow-hidden border border-border bg-secondary p-1 gap-1">
              {(["kg", "lbs"] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-bold uppercase transition-all",
                    unit === u ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Reps + Weight */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  {t("oneRM.reps")}
                </Label>
                <div className="relative">
                  <Input
                    id="reps"
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="pr-16 text-xl font-black bg-secondary border-border"
                    min="1"
                    max="10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    {t("oneRM.repsUnit")}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                  {t("oneRM.weightLifted")}
                </Label>
                <div className="relative">
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="pr-12 text-xl font-black bg-secondary border-border"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                    {unit.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result card */}
        <div className="bg-card border border-primary/40 rounded-2xl p-8 text-center shadow-xl shadow-primary/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{t("oneRM.estimated1RM")}</p>
          <p className="text-7xl font-black text-primary leading-none">
            {oneRM} <span className="text-4xl">{unit.toUpperCase()}</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3 italic">{t("oneRM.formula")}</p>
        </div>

        {/* Training percentages */}
        <div>
          <h2 className="text-xl font-black text-foreground text-center mb-6">{t("oneRM.trainingPercentages")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {percentages.map((pct) => (
              <div
                key={pct}
                className={cn(
                  "bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors",
                  pct === 100 && "border-primary/40 shadow-lg shadow-primary/10"
                )}
              >
                <p className={cn("text-xl font-black mb-1", pct === 100 ? "text-primary" : "text-foreground/80")}>{pct}%</p>
                <p className="text-lg font-bold text-foreground">{Math.round((oneRM * pct) / 100)}</p>
                <p className="text-[10px] text-muted-foreground">{unit.toUpperCase()}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground/60 text-xs mt-4">{t("oneRM.percentageNote")}</p>
        </div>
      </div>
    </div>
  );
};

export default OneRMCalculator;
