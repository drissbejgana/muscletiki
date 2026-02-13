import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, MoreVertical, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface WorkoutCardProps {
  title: string;
  image: string;
  level: string;
  type: string;
  equipment: string[];
  targetMuscles: { front: string[]; back: string[] };
  description: string;
}

export const WorkoutCard = ({ title, image, level, type, equipment, targetMuscles, description }: WorkoutCardProps) => {
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="bg-primary p-4 flex items-center justify-between">
        <h3 className="text-primary-foreground font-semibold text-sm line-clamp-1 flex-1">{title}</h3>
        <div className="flex gap-2 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="relative aspect-video">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{level}</Badge>
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{type}</Badge>
        </div>
      </div>

      <div className="p-4 border-b">
        <button onClick={() => setIsEquipmentOpen(!isEquipmentOpen)} className="flex items-center justify-between w-full text-sm font-medium text-foreground">
          <span>{t('workouts.equipment')}</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {equipment.slice(0, 4).map((_, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-equipment-icon" />
                </div>
              ))}
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isEquipmentOpen && "transform rotate-180")} />
          </div>
        </button>
      </div>

      <div className="p-4 flex-1">
        <button onClick={() => setIsDescriptionOpen(!isDescriptionOpen)} className="w-full">
          <div className="flex justify-center gap-8 py-4">
            <div className="relative w-20 h-32">
              <svg viewBox="0 0 100 160" className="w-full h-full">
                <ellipse cx="50" cy="20" rx="15" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="50" y1="38" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="50" x2="25" y2="70" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="50" x2="75" y2="70" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="80" x2="35" y2="130" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="80" x2="65" y2="130" stroke="currentColor" strokeWidth="2" />
                {targetMuscles.front.includes("chest") && <ellipse cx="50" cy="55" rx="18" ry="12" fill="hsl(var(--muscle-highlight))" opacity="0.6" />}
                {targetMuscles.front.includes("abs") && <rect x="42" y="65" width="16" height="15" fill="hsl(var(--muscle-highlight))" opacity="0.6" rx="2" />}
                {targetMuscles.front.includes("quads") && (<><rect x="38" y="85" width="8" height="40" fill="hsl(var(--muscle-highlight))" opacity="0.6" rx="4" /><rect x="54" y="85" width="8" height="40" fill="hsl(var(--muscle-highlight))" opacity="0.6" rx="4" /></>)}
              </svg>
            </div>
            <div className="relative w-20 h-32">
              <svg viewBox="0 0 100 160" className="w-full h-full">
                <ellipse cx="50" cy="20" rx="15" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="50" y1="38" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="50" x2="25" y2="70" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="50" x2="75" y2="70" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="80" x2="35" y2="130" stroke="currentColor" strokeWidth="2" />
                <line x1="50" y1="80" x2="65" y2="130" stroke="currentColor" strokeWidth="2" />
                {targetMuscles.back.includes("back") && <ellipse cx="50" cy="55" rx="18" ry="15" fill="hsl(var(--muscle-highlight))" opacity="0.6" />}
                {targetMuscles.back.includes("glutes") && <ellipse cx="50" cy="82" rx="16" ry="8" fill="hsl(var(--muscle-highlight))" opacity="0.6" />}
                {targetMuscles.back.includes("hamstrings") && (<><rect x="38" y="90" width="8" height="35" fill="hsl(var(--muscle-highlight))" opacity="0.6" rx="4" /><rect x="54" y="90" width="8" height="35" fill="hsl(var(--muscle-highlight))" opacity="0.6" rx="4" /></>)}
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div className="border-t">
        <button onClick={() => setIsDescriptionOpen(!isDescriptionOpen)} className="flex items-center justify-between w-full p-4 text-sm font-medium text-primary hover:bg-muted/50 transition-colors">
          <span>{t('workouts.description')}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isDescriptionOpen && "transform rotate-180")} />
        </button>
        {isDescriptionOpen && <div className="px-4 pb-4 text-sm text-muted-foreground">{description}</div>}
      </div>
    </Card>
  );
};
