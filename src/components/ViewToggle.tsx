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
    { key: "homme",        labelKey: !homme ? "bodyMap.male" : "bodyMap.female",   icon: User2,    activeColor: "bg-primary/20 text-primary border-primary/40" },
    { key: "avance",       labelKey: "bodyMap.advanced",                            icon: Dumbbell, activeColor: "bg-accent/20 text-accent border-accent/40" },
    { key: "articulations",labelKey: "bodyMap.joints",                              icon: Bone,     activeColor: "bg-violet-500/20 text-violet-400 border-violet-500/40" },
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
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
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
                "flex items-center justify-between w-full px-3 py-2.5 rounded-lg border text-sm font-medium transition-all",
                isActive
                  ? toggle.activeColor
                  : "bg-secondary/40 text-muted-foreground border-transparent hover:border-border hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                <span>{t(toggle.labelKey)}</span>
              </div>
              {/* Toggle pill */}
              <div className={cn(
                "relative w-9 h-5 rounded-full transition-colors shrink-0",
                isActive ? "bg-primary" : "bg-border"
              )}>
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
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
