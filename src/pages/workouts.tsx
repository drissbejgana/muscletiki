import { useState, useEffect } from "react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useTranslation } from "@/i18n";
import { workoutService } from "@/services/workoutService";
import { Loader2, Dumbbell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workout {
  _id:          string;
  title:        string;
  description:  string;
  level:        string;
  type:         string;
  duration:     number;
  equipment:    string[];
  targetMuscles: { front: string[]; back: string[] };
  image:        string;
  isPremium:    boolean;
  isPublic:     boolean;
}

const DEFAULT_IMG = "/assets/workout-2.jpg";

const WorkoutPrograms = () => {
  const { t, lang } = useTranslation();
  const [workouts, setWorkouts]           = useState<Workout[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedType, setSelectedType]   = useState("All");

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await workoutService.getWorkouts({ isPublic: true, limit: 100 });
        setWorkouts(res.data || []);
      } catch (e: any) { setError(String(e)); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const levels = ["All", ...Array.from(new Set(workouts.map((w) => w.level))).filter(Boolean)];
  const types  = ["All", ...Array.from(new Set(workouts.map((w) => w.type))).filter(Boolean)];

  const filtered = workouts.filter((w) => {
    const matchesSearch = !searchTerm
      || w.title.toLowerCase().includes(searchTerm.toLowerCase())
      || w.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (selectedLevel === "All" || w.level === selectedLevel) && (selectedType === "All" || w.type === selectedType);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-1">{t("workouts.title")}</h1>
          <p className="text-muted-foreground">{t("workouts.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={lang === "fr" ? "Rechercher un programme…" : "Search programs…"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Level filter */}
        {!loading && levels.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  selectedLevel === level
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {level === "All" ? (lang === "fr" ? "Tous" : "All") : level}
              </button>
            ))}
          </div>
        )}

        {/* Type filter */}
        {!loading && types.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  selectedType === type
                    ? "bg-accent/20 text-accent border-accent/40"
                    : "bg-card text-muted-foreground border-border hover:border-accent/30 hover:text-foreground"
                )}
              >
                {type === "All" ? (lang === "fr" ? "Tous les types" : "All Types") : type}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && workouts.length === 0 && (
          <div className="text-center py-24 space-y-3">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto">
              <Dumbbell className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground text-lg font-semibold">
              {lang === "fr" ? "Aucun programme disponible." : "No workout programs available."}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {lang === "fr" ? "L'administrateur peut en ajouter depuis le tableau de bord." : "An admin can add programs from the dashboard."}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((w) => (
              <WorkoutCard
                key={w._id}
                id={w._id}
                title={w.title}
                image={DEFAULT_IMG}
                level={w.level}
                type={w.type}
                equipment={w.equipment || []}
                targetMuscles={w.targetMuscles || { front: [], back: [] }}
                description={w.description}
              />
            ))}
          </div>
        )}

        {!loading && !error && workouts.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{lang === "fr" ? "Aucun programme trouvé." : "No programs found."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPrograms;
