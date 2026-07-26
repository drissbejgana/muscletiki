import { useContext, useState } from "react";
import BodyFrontSVG from "./BodyFrontSVG";
import BodyBackSVG from "./BodyBackSVG";
import { FemalBodyBack } from "./FemalBodyBack";
import { InteractiveBodyMap } from "./FemalBodyFront";
import MyContext from "@/contexts/MyContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { Dumbbell } from "lucide-react";

const MobileBodyView = () => {
  const [view, setView] = useState<"front" | "back">("front");
  const { advanced, updateAdvanced, homme, updateHomme } = useContext(MyContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative flex-1 flex flex-col bg-card overflow-hidden">
      {/* Top controls */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-3">
        {/* Gender toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          {[
            { value: false, label: t('bodyMap.male') },
            { value: true,  label: t('bodyMap.female') },
          ].map(({ value, label }) => (
            <button
              key={String(value)}
              onClick={() => updateHomme(value)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                homme === value
                  ? "gradient-brand text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/8"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Detail toggle */}
        <div className="flex rounded-lg overflow-hidden border border-border">
          {[
            { value: false, label: t('bodyMap.standard') },
            { value: true,  label: t('bodyMap.advanced') },
          ].map(({ value, label }) => (
            <button
              key={String(value)}
              onClick={() => updateAdvanced(value)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                advanced === value
                  ? "gradient-brand text-primary-foreground shadow-sm shadow-primary/30"
                  : "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/8"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Body SVG */}
      <div className="flex-1 flex items-center justify-center px-4 py-2 relative">
        <div className="w-full max-w-xs h-full flex items-center justify-center">
          {view === "front"
            ? (homme ? <InteractiveBodyMap /> : <BodyFrontSVG advanced={advanced} />)
            : (homme ? <FemalBodyBack /> : <BodyBackSVG advanced={advanced} />)
          }
        </div>

        {/* Front/back switcher */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {(["front", "back"] as const).map((side) => (
            <button
              key={side}
              onClick={() => setView(side)}
              className={cn(
                "w-10 h-10 rounded-xl border text-xs font-bold transition-all duration-200",
                view === side
                  ? "gradient-brand border-transparent text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-secondary border-border text-muted-foreground hover:text-primary hover:border-primary/40"
              )}
            >
              {side === "front" ? "F" : "B"}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/workout')}
          className="w-full flex items-center justify-center gap-2 gradient-brand text-primary-foreground rounded-xl py-3 text-sm font-bold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Dumbbell className="h-4 w-4" />
          {t('bodyMap.workoutsBtn')}
        </button>
      </div>
    </div>
  );
};

export default MobileBodyView;
