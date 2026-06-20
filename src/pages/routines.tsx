import { useState, useEffect } from "react";
import { Clock, Dumbbell, Target, ChevronRight, Loader2, Search } from "lucide-react";
import { useTranslation } from "@/i18n";
import api from "@/services/api";
import { cn } from "@/lib/utils";

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

const levelColors: Record<string, string> = {
  Beginner:     "bg-primary/20 text-primary border-primary/30",
  Intermediate: "bg-accent/20 text-accent border-accent/30",
  Advanced:     "bg-destructive/20 text-destructive border-destructive/30",
};

const Routines = () => {
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const { t, lang } = useTranslation();
  const [routines, setRoutines]     = useState<Routine[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutines = async () => {
      setLoading(true); setError(null);
      try {
        const res = await api.get("/admin/routines/public");
        setRoutines(res.data.data || []);
      } catch (e: any) { setError(e?.response?.data?.message || "Failed to load routines"); }
      finally { setLoading(false); }
    };
    fetchRoutines();
  }, []);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const levelKeys: Record<string, string> = {
    Beginner: "routines.beginner", Intermediate: "routines.intermediate", Advanced: "routines.advanced",
  };

  const filteredRoutines = routines.filter((r) => {
    const title       = lang === "fr" ? r.title.fr : r.title.en;
    const description = lang === "fr" ? r.description.fr : r.description.en;
    return (
      (title.toLowerCase().includes(searchTerm.toLowerCase()) || description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLevel === "All" || r.level === selectedLevel)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
          <h1 className="text-3xl lg:text-5xl font-black text-center text-foreground mb-3">{t("routines.title")}</h1>
          <p className="text-muted-foreground text-center text-base max-w-xl mx-auto mb-8">{t("routines.subtitle")}</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t("routines.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Level filter */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-5">
        <div className="flex flex-wrap gap-2 justify-center">
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
              {level === "All" ? t("routines.all") : t(levelKeys[level])}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-16">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && error && <div className="text-center py-16"><p className="text-muted-foreground">{error}</p></div>}
        {!loading && !error && routines.length === 0 && (
          <div className="text-center py-16"><p className="text-muted-foreground text-lg">{t("routines.noRoutines")}</p></div>
        )}

        {!loading && !error && filteredRoutines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoutines.map((routine, index) => {
              const title       = lang === "fr" ? routine.title.fr : routine.title.en;
              const description = lang === "fr" ? routine.description.fr : routine.description.en;
              const lc = levelColors[routine.level] ?? "bg-secondary text-muted-foreground border-border";
              return (
                <div
                  key={routine._id}
                  className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {title}
                    </h3>
                    <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border shrink-0", lc)}>
                      {levelKeys[routine.level] ? t(levelKeys[routine.level]) : routine.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

                  {routine.focus?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {routine.focus.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: Clock,    label: t("routines.duration"),  value: routine.duration },
                      { icon: Target,   label: t("routines.daysWeek"),  value: String(routine.daysPerWeek) },
                      { icon: Dumbbell, label: t("routines.exercises"), value: String(routine.exercises) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-secondary rounded-xl p-2.5 text-center">
                        <Icon className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
                        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
                        <p className="text-xs font-bold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200">
                    {t("routines.viewRoutine")}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && routines.length > 0 && filteredRoutines.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("routines.noRoutines")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;
