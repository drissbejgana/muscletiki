import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, MoreVertical, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface WorkoutCardProps {
  id:            string;   // MongoDB _id — used for navigation
  title:         string;
  image:         string;
  level:         string;
  type:          string;
  equipment:     string[];
  targetMuscles: { front: string[]; back: string[] };
  description:   string;
}

export const WorkoutCard = ({
  id, title, image, level, type, equipment, targetMuscles, description,
}: WorkoutCardProps) => {
  const [isEquipmentOpen,  setIsEquipmentOpen]  = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const viewLabel = lang === "fr" ? "Voir le programme" : "View Program";

  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-primary p-4 flex items-center justify-between">
        <h3 className="text-primary-foreground font-semibold text-sm line-clamp-1 flex-1">{title}</h3>
        <div className="flex gap-2 ml-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/80">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-video cursor-pointer" onClick={() => navigate(`/workouts/${id}`)}>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{level}</Badge>
          <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">{type}</Badge>
        </div>
        {/* Overlay hint */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
          <span className="bg-white/90 text-foreground text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5">
            {viewLabel} <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Equipment accordion */}
      {/* <div className="p-4 border-b">
        <button
          onClick={() => setIsEquipmentOpen(!isEquipmentOpen)}
          className="flex items-center justify-between w-full text-sm font-medium text-foreground"
        >
          <span>{t("workouts.equipment")}</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {equipment.slice(0, 4).map((_, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-equipment-icon" />
                </div>
              ))}
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isEquipmentOpen && "rotate-180")} />
          </div>
        </button>
        {isEquipmentOpen && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {equipment.map((eq) => (
              <Badge key={eq} variant="secondary" className="text-xs capitalize">{eq}</Badge>
            ))}
          </div>
        )}
      </div> */}

      {/* Muscle diagram */}
      
      {/* <div className="p-4 flex-1">
        <div className="flex justify-center gap-8 py-2">
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
      </div> */}

      {/* Description accordion + View button */}
      <div className="border-t">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="flex items-center justify-between w-full p-4 text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
        >
          <span>{t("workouts.description")}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isDescriptionOpen && "rotate-180")} />
        </button>
        {isDescriptionOpen && (
          <div className="px-4 pb-4 text-sm text-muted-foreground">{description}</div>
        )}
      </div>

      {/* View Program CTA */}
      <div className="p-4 pt-0">
        <Button className="w-full" onClick={() => navigate(`/workouts/${id}`)}>
          {viewLabel} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
