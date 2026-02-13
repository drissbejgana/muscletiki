import { useContext } from "react";
import { cn } from "@/lib/utils";
import MyContext from "@/contexts/MyContext";
import { useTranslation } from "@/i18n";

type ToggleKeys = "homme" | "avance" | "articulations";

const ViewToggle = () => {
  const { advanced, homme, articulations, updateAdvanced, updateHomme, updateArticulations } = useContext(MyContext);
  const { t } = useTranslation();

  const toggles: { key: ToggleKeys; labelKey: string }[] = [
    { key: "homme", labelKey: "bodyMap.male" },
    { key: "avance", labelKey: "bodyMap.advanced" },
    { key: "articulations", labelKey: "bodyMap.joints" },
  ];

  const handleToggle = (key: ToggleKeys) => {
    switch (key) {
      case "avance": updateAdvanced(!advanced); break;
      case "homme": updateHomme(!homme); break;
      case "articulations": updateArticulations(!articulations); break;
    }
  };

  const getIsActive = (key: ToggleKeys): boolean => {
    switch (key) {
      case "avance": return advanced;
      case "homme": return homme;
      case "articulations": return articulations;
      default: return false;
    }
  };

  return (
    <div className="w-full bg-primary p-6 rounded-lg">
      <div className="flex justify-around items-start gap-8">
        {toggles.map((toggle) => {
          const isActive = getIsActive(toggle.key);
          return (
            <div key={toggle.key} className="flex flex-col items-center gap-3">
              <button
                onClick={() => handleToggle(toggle.key)}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out",
                  "focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2",
                  isActive ? "bg-pink-500/30" : "bg-slate-600/50"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ease-in-out shadow-md",
                    isActive ? "left-9 bg-white" : "left-1 bg-slate-400"
                  )}
                />
              </button>
              <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
                {t(toggle.labelKey)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewToggle;
