import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { 
  Dumbbell, 
  Weight, 
  User, 
  Activity,
  Plus,
  Cable,
  Circle,
  Disc,
  Heart,
  Zap,
  Waves
} from "lucide-react";

const equipmentItems = [
  { id: "bodyweight", label: "En vedette", icon: User },
  { id: "barbell", label: "Barre", icon: Weight },
  { id: "dumbbell", label: "Haltères", icon: Dumbbell },
  { id: "bodyweight2", label: "Poids corporel", icon: Activity },
  { id: "machine", label: "Machine", icon: Activity },
  { id: "medicine", label: "Ballon de Médecine", icon: Circle },
  { id: "kettlebell", label: "Haltères Kettlebell", icon: Weight },
  { id: "stretch", label: "Étirements", icon: User },
  { id: "cables", label: "Câbles", icon: Cable },
  { id: "group", label: "Groupe", icon: Plus },
  { id: "plate", label: "Assiette", icon: Disc },
  { id: "trx", label: "TRX", icon: Cable },
  { id: "yoga", label: "Yoga", icon: User },
  { id: "bosu", label: "Ballon Bosu", icon: Circle },
  { id: "vitruvian", label: "Vitruvian", icon: User },
  { id: "cardio", label: "Cardio", icon: Heart },
  { id: "smith", label: "Smith Machine", icon: Activity },
  { id: "recovery", label: "Récupération", icon: Zap },
];

const EquipmentPanel = () => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Équipement</h3>
        <button className="text-muted-foreground hover:text-foreground">—</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {equipmentItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} />
              <Label
                htmlFor={item.id}
                className="text-sm font-normal cursor-pointer flex items-center gap-2"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {item.label}
              </Label>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default EquipmentPanel;
