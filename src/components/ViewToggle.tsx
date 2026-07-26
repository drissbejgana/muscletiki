import { useContext } from "react";
import { cn } from "@/lib/utils";
import MyContext from "@/contexts/MyContext";
import { useTranslation } from "@/i18n";
import { User2, Dumbbell, Bone } from "lucide-react";

type ToggleKeys = "homme" | "avance" | "articulations";

const ViewToggle = () => {
  const { advanced, homme, articulations, updateAdvanced, updateHomme, updateArticulations } = useContext(MyContext);
  const { t } = useTranslation();

  const toggles: { key: ToggleKeys; labelKey: string; icon: React.ElementType; activeColor: string }[] = [
    { key: "homme",        labelKey: !homme ? "bodyMap.male" : "bodyMap.female",   icon: User2,    activeColor: "bg-primary/15 text-primary border-primary/40 shadow-sm shadow-primary/20" },
    { key: "avance",       labelKey: "bodyMap.advanced",                            icon: Dumbbell, activeColor: "bg-accent/15 text-accent border-accent/40 shadow-sm shadow-accent/20" },
    { key: "articulations",labelKey: "bodyMap.joints",                              icon: Bone,     activeColor: "bg-violet-500/15 text-violet-600 border-violet-500/40 shadow-sm shadow-violet-500/20" },
  ];

  const handleToggle = (key: ToggleKeys) => {
    if (key === "avance") updateAdvanced(!advanced);
    else if (key === "homme") updateHomme(!homme);
    else updateArticulations(!articulations);
  };

  const getIsActive = (key: ToggleKeys): boolean => {
    if (key === "avance") return advanced;
    if (key === "homme") return homme;
    if (key === "articulations") return articulations;
    return false;
  };

  return (
    <div className="bg-card border border-primary/15 rounded-2xl p-4 card-elevated surface-tint">
      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-3">
        {t('bodyMap.view') || 'View Options'}
      </p>
      <div className="flex flex-col gap-2">
        {toggles.map((toggle) => {
          const isActive = getIsActive(toggle.key);
          const Icon = toggle.icon;
          return (
            <button
              key={toggle.key}
              onClick={() => handleToggle(toggle.key)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200",
                isActive
                  ? toggle.activeColor
                  : "bg-secondary/50 text-muted-foreground border-transparent hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                <span>{t(toggle.labelKey)}</span>
              </div>
              {/* Toggle pill */}
              <div className={cn(
                "relative w-9 h-5 rounded-full transition-all duration-300 shrink-0",
                isActive ? "gradient-brand shadow-sm shadow-primary/40" : "bg-border"
              )}>
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300",
                  isActive ? "left-4" : "left-0.5"
                )} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewToggle;
