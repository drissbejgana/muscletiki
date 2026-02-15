import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Dumbbell, Target, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import api from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Routine {
  _id:         string;
  title:       { en: string; fr: string };
  description: { en: string; fr: string };
  level:       string;
  duration:    string;
  daysPerWeek: number;
  focus:       string[];
  exercises:   number;
  isPremium:   boolean;
  isPublic:    boolean;
  order:       number;
}

const Routines = () => {
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const { t, lang } = useTranslation();

  const [routines, setRoutines]     = useState<Routine[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // ─── Fetch from backend ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/admin/routines/public");
        setRoutines(res.data.data || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load routines");
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const levelKeys: Record<string, string> = {
    Beginner:     "routines.beginner",
    Intermediate: "routines.intermediate",
    Advanced:     "routines.advanced",
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":     return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Intermediate": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Advanced":     return "bg-red-500/20 text-red-400 border-red-500/50";
      default:             return "bg-muted text-muted-foreground";
    }
  };

  // ─── Filter ───────────────────────────────────────────────────────────────
  const filteredRoutines = routines.filter((r) => {
    const title       = lang === "fr" ? r.title.fr       : r.title.en;
    const description = lang === "fr" ? r.description.fr : r.description.en;
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || r.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t("routines.title")}
          </h1>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-8">
            {t("routines.subtitle")}
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("routines.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Level filter */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              {level === "All" ? t("routines.all") : t(levelKeys[level])}
            </Button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">

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

        {/* Empty */}
        {!loading && !error && routines.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("routines.noRoutines")}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredRoutines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine, index) => {
              const title       = lang === "fr" ? routine.title.fr       : routine.title.en;
              const description = lang === "fr" ? routine.description.fr : routine.description.en;
              return (
                <Card
                  key={routine._id}
                  className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        {title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`${getLevelColor(routine.level)} border shrink-0`}
                      >
                        {levelKeys[routine.level] ? t(levelKeys[routine.level]) : routine.level}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Focus tags */}
                    {routine.focus?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {routine.focus.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">{t("routines.duration")}</p>
                        <p className="text-sm font-semibold">{routine.duration}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">{t("routines.daysWeek")}</p>
                        <p className="text-sm font-semibold">{routine.daysPerWeek}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <Dumbbell className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">{t("routines.exercises")}</p>
                        <p className="text-sm font-semibold">{routine.exercises}</p>
                      </div>
                    </div>

                    <Button className="w-full group/btn">
                      {t("routines.viewRoutine")}
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Filtered empty (has routines but search/filter matches nothing) */}
        {!loading && !error && routines.length > 0 && filteredRoutines.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("routines.noRoutines")}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Routines;
