import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dumbbell, Weight, User, Activity, Plus, Cable, Circle, Disc, Heart, Zap } from "lucide-react";
import { useTranslation } from "@/i18n";

const EquipmentPanel = () => {
  const { t } = useTranslation();

  const equipmentItems = [
    { id: "bodyweight", labelKey: "equipment.featured", icon: User },
    { id: "barbell", labelKey: "equipment.barbell", icon: Weight },
    { id: "dumbbell", labelKey: "equipment.dumbbell", icon: Dumbbell },
    { id: "bodyweight2", labelKey: "equipment.bodyweight", icon: Activity },
    { id: "machine", labelKey: "equipment.machine", icon: Activity },
    { id: "medicine", labelKey: "equipment.medicineBall", icon: Circle },
    { id: "kettlebell", labelKey: "equipment.kettlebell", icon: Weight },
    { id: "stretch", labelKey: "equipment.stretch", icon: User },
    { id: "cables", labelKey: "equipment.cables", icon: Cable },
    { id: "group", labelKey: "equipment.group", icon: Plus },
    { id: "plate", labelKey: "equipment.plate", icon: Disc },
    { id: "trx", labelKey: "equipment.trx", icon: Cable },
    { id: "yoga", labelKey: "equipment.yoga", icon: User },
    { id: "bosu", labelKey: "equipment.bosuBall", icon: Circle },
    { id: "vitruvian", labelKey: "equipment.vitruvian", icon: User },
    { id: "cardio", labelKey: "equipment.cardio", icon: Heart },
    { id: "smith", labelKey: "equipment.smithMachine", icon: Activity },
    { id: "recovery", labelKey: "equipment.recovery", icon: Zap },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{t('equipment.title')}</h3>
        <button className="text-muted-foreground hover:text-foreground">—</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {equipmentItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                {t(item.labelKey)}
              </Label>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EquipmentPanel;
