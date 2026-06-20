import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface WorkoutCardProps {
  id:            string;
  title:         string;
  image:         string;
  level:         string;
  type:          string;
  equipment:     string[];
  targetMuscles: { front: string[]; back: string[] };
  description:   string;
}

const levelColors: Record<string, string> = {
  Beginner:      "bg-primary/20 text-primary border-primary/30",
  Intermediate:  "bg-accent/20 text-accent border-accent/30",
  Advanced:      "bg-destructive/20 text-destructive border-destructive/30",
  Débutant:      "bg-primary/20 text-primary border-primary/30",
  Intermédiaire: "bg-accent/20 text-accent border-accent/30",
  Avancé:        "bg-destructive/20 text-destructive border-destructive/30",
};

export const WorkoutCard = ({
  id, title, image, level, type, equipment, targetMuscles, description,
}: WorkoutCardProps) => {
  const [descOpen, setDescOpen] = useState(false);
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const viewLabel = lang === "fr" ? "Voir le programme" : "View Program";
  const levelColor = levelColors[level] ?? "bg-secondary text-muted-foreground border-border";

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={() => navigate(`/workouts/${id}`)}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={cn("px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full border", levelColor)}>
            {level}
          </span>
          {type && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-black/50 text-white/80 border border-white/10">
              {type}
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full shadow-lg">
            {viewLabel} <ChevronRight className="h-4 w-4" />
          </span>
        </div>

        {/* Title at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">{title}</h3>
        </div>
      </div>

      {/* Description accordion */}
      <div className="border-t border-border">
        <button
          onClick={() => setDescOpen(!descOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="uppercase tracking-wide">{t("workouts.description")}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", descOpen && "rotate-180")} />
        </button>
        {descOpen && (
          <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">{description}</div>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={() => navigate(`/workouts/${id}`)}
          className="w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
        >
          {viewLabel} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
