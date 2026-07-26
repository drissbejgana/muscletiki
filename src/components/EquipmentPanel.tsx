import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import { SlidersHorizontal } from "lucide-react";

const equipmentItems = [
  { id: "featured",     labelKey: "equipment.featured" },
  { id: "barbell",      labelKey: "equipment.barbell" },
  { id: "dumbbell",     labelKey: "equipment.dumbbell" },
  { id: "bodyweight",   labelKey: "equipment.bodyweight" },
  { id: "machine",      labelKey: "equipment.machine" },
  { id: "medicine",     labelKey: "equipment.medicineBall" },
  { id: "kettlebell",   labelKey: "equipment.kettlebell" },
  { id: "stretch",      labelKey: "equipment.stretch" },
  { id: "cables",       labelKey: "equipment.cables" },
  { id: "group",        labelKey: "equipment.group" },
  { id: "plate",        labelKey: "equipment.plate" },
  { id: "trx",          labelKey: "equipment.trx" },
  { id: "yoga",         labelKey: "equipment.yoga" },
  { id: "bosu",         labelKey: "equipment.bosuBall" },
  { id: "vitruvian",    labelKey: "equipment.vitruvian" },
  { id: "cardio",       labelKey: "equipment.cardio" },
  { id: "smith",        labelKey: "equipment.smithMachine" },
  { id: "recovery",     labelKey: "equipment.recovery" },
];

const EquipmentPanel = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearAll = () => setSelected(new Set());

  return (
    <div className="bg-card border border-primary/15 rounded-2xl p-4 mt-3 card-elevated surface-tint">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            {t('equipment.title')}
          </p>
        </div>
        {selected.size > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            {t('common.clearAll') || 'Clear'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {equipmentItems.map((item) => {
          const active = selected.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5",
                active
                  ? "gradient-brand text-primary-foreground border-transparent shadow-sm shadow-primary/30"
                  : "bg-secondary/50 text-muted-foreground border-transparent hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              )}
            >
              {t(item.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentPanel;
