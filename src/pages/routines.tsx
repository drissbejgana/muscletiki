import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Dumbbell, Target, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import api from "@/services/api";

// ── Static fallback data (shown when no DB routines exist yet) ─────────────────
const STATIC_ROUTINES = [
  { _id: "s1", title: { en: "Full Body Workout", fr: "Entraînement corps entier" }, description: { en: "A complete full-body workout targeting all major muscle groups for balanced strength and conditioning.", fr: "Un entraînement complet ciblant tous les muscles pour force et condition." }, level: "Beginner", duration: "45 min", daysPerWeek: 3, focus: ["Strength", "Full Body"], exercises: 8, isPublic: true },
  { _id: "s2", title: { en: "Push Pull Legs", fr: "Pousser Tirer Jambes" }, description: { en: "A 6-day split routine separating push, pull, and leg movements for maximum hypertrophy.", fr: "Routine 6 jours séparant poussée, tirage et jambes pour une hypertrophie maximale." }, level: "Intermediate", duration: "60 min", daysPerWeek: 6, focus: ["Hypertrophy", "Split"], exercises: 6, isPublic: true },
  { _id: "s3", title: { en: "Upper Lower Split", fr: "Haut Bas du Corps" }, description: { en: "Alternating upper and lower body days for balanced strength development and recovery.", fr: "Alternance haut et bas du corps pour un développement équilibré et récupération." }, level: "Intermediate", duration: "50 min", daysPerWeek: 4, focus: ["Strength", "Hypertrophy"], exercises: 7, isPublic: true },
  { _id: "s4", title: { en: "Bodyweight Training", fr: "Musculation au poids du corps" }, description: { en: "No equipment needed. Build functional strength and endurance using only your bodyweight.", fr: "Pas d'équipement nécessaire. Développez force fonctionnelle et endurance au poids du corps." }, level: "Beginner", duration: "30 min", daysPerWeek: 3, focus: ["Calisthenics", "Endurance"], exercises: 10, isPublic: true },
  { _id: "s5", title: { en: "Powerlifting Program", fr: "Programme de force athlétique" }, description: { en: "Focus on the three main lifts: squat, bench press, and deadlift. Built for serious strength gains.", fr: "Les trois mouvements principaux : squat, développé couché et soulevé de terre." }, level: "Advanced", duration: "90 min", daysPerWeek: 4, focus: ["Powerlifting", "Strength"], exercises: 5, isPublic: true },
  { _id: "s6", title: { en: "HIIT Circuit", fr: "Circuit HIIT" }, description: { en: "High-intensity interval training to maximize calorie burn and improve cardiovascular fitness.", fr: "Entraînement par intervalles de haute intensité pour brûler des calories et améliorer le cardio." }, level: "Intermediate", duration: "25 min", daysPerWeek: 4, focus: ["Cardio", "Fat Loss"], exercises: 12, isPublic: true },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "Beginner":     return "bg-green-500/20 text-green-400 border-green-500/50";
    case "Intermediate": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    case "Advanced":     return "bg-red-500/20 text-red-400 border-red-500/50";
    default:             return "bg-muted text-muted-foreground";
  }
};

const Routines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useTranslation();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const res = await api.get("/admin/routines/public");
        const data = res.data?.data || [];
        // Use DB routines if any exist, otherwise fall back to static
        setRoutines(data.length > 0 ? data : STATIC_ROUTINES);
      } catch {
        setRoutines(STATIC_ROUTINES);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const levelLabel = (level: string) => {
    const map: Record<string, string> = {
      Beginner:     "routines.beginner",
      Intermediate: "routines.intermediate",
      Advanced:     "routines.advanced",
    };
    return map[level] ? t(map[level]) : level;
  };

  const getTitle = (r: any) => r.title?.[lang] || r.title?.en || "";
  const getDesc = (r: any)  => r.description?.[lang] || r.description?.en || "";

  const filteredRoutines = routines.filter((r) => {
    const title = getTitle(r).toLowerCase();
    const desc  = getDesc(r).toLowerCase();
    const matchSearch = title.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchLevel  = selectedLevel === "All" || r.level === selectedLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
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
              {level === "All" ? t("routines.all") : levelLabel(level)}
            </Button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine, index) => (
              <Card
                key={routine._id}
                className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {getTitle(routine)}
                    </CardTitle>
                    <Badge variant="outline" className={`${getLevelColor(routine.level)} border shrink-0`}>
                      {levelLabel(routine.level)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{getDesc(routine)}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(routine.focus || []).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {t(`routines.focus.${tag}`) !== `routines.focus.${tag}` ? t(`routines.focus.${tag}`) : tag}
                      </Badge>
                    ))}
                  </div>

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
            ))}
          </div>
        )}

        {!loading && filteredRoutines.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("routines.noRoutines")}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Routines;
