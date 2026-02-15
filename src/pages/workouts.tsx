import { useState, useEffect } from "react";
import { WorkoutCard } from "@/components/WorkoutCard";
import { useTranslation } from "@/i18n";
import { workoutService } from "@/services/workoutService";
import { Loader2, Dumbbell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
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

// Default image if workout has no image
const DEFAULT_IMG = "/assets/workout-2.jpg";

const WorkoutPrograms = () => {
  const { t, lang } = useTranslation();

  const [workouts, setWorkouts]           = useState<Workout[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedType, setSelectedType]   = useState("All");

  // ─── Fetch from backend ───────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await workoutService.getWorkouts({ isPublic: true, limit: 100 });
        setWorkouts(res.data || []);
      } catch (e: any) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ─── Filter options derived from actual data ───────────────────────────────
  const levels = ["All", ...Array.from(new Set(workouts.map((w) => w.level))).filter(Boolean)];
  const types  = ["All", ...Array.from(new Set(workouts.map((w) => w.type))).filter(Boolean)];

  const filtered = workouts.filter((w) => {
    const matchesSearch =
      !searchTerm ||
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || w.level === selectedLevel;
    const matchesType  = selectedType  === "All" || w.type  === selectedType;
    return matchesSearch && matchesLevel && matchesType;
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t("workouts.title")}</h1>
          <p className="text-muted-foreground">{t("workouts.subtitle")}</p>
        </header>

        {/* Search + filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={lang === "fr" ? "Rechercher un programme…" : "Search programs…"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Level filter */}
        {!loading && levels.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {levels.map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level === "All" ? (lang === "fr" ? "Tous" : "All") : level}
              </Button>
            ))}
          </div>
        )}

        {/* Type filter */}
        {!loading && types.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {types.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className="cursor-pointer text-xs px-3 py-1"
                onClick={() => setSelectedType(type)}
              >
                {type === "All" ? (lang === "fr" ? "Tous les types" : "All Types") : type}
              </Badge>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && workouts.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <Dumbbell className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground text-lg">
              {lang === "fr"
                ? "Aucun programme disponible pour l'instant."
                : "No workout programs available yet."}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {lang === "fr"
                ? "L'administrateur peut en ajouter depuis le tableau de bord."
                : "An admin can add programs from the dashboard."}
            </p>
          </div>
        )}

        {/* Workout grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Filtered empty */}
        {!loading && !error && workouts.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {lang === "fr" ? "Aucun programme trouvé." : "No programs found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPrograms;
