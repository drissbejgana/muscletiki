import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, Layers, ChevronRight, Loader2, Search, Lock, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import programService from "@/services/programService";
import { cn } from "@/lib/utils";

interface Progress {
  status: string;
  currentWeek: number;
  currentDay: number;
  completedCount: number;
  totalTrainingDays: number;
  percent: number;
}

interface Program {
  _id:             string;
  slug:            string;
  title:           { en: string; fr: string };
  description:     { en: string; fr: string };
  level:           string;
  goal:            string;
  weeks:           number;
  daysPerWeek:     number;
  sessionDuration: string;
  focus:           string[];
  isPremium:       boolean;
  locked:          boolean;
  enrolled:        boolean;
  progress:        Progress | null;
  totalTrainingDays: number;
}

const levelColors: Record<string, string> = {
  Beginner:     "bg-primary/20 text-primary border-primary/30",
  Intermediate: "bg-accent/20 text-accent border-accent/30",
  Advanced:     "bg-destructive/20 text-destructive border-destructive/30",
};

const levelKeys: Record<string, string> = {
  Beginner: "programs.beginner", Intermediate: "programs.intermediate", Advanced: "programs.advanced",
};

const Programs = () => {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();

  const [programs, setPrograms]           = useState<Program[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const fetchPrograms = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await programService.getPrograms();
      setPrograms(res.data || []);
    } catch (e: any) {
      setError(typeof e === "string" ? e : "Failed to load programs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrograms(); }, [fetchPrograms]);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filtered = programs.filter((p) => {
    const title       = lang === "fr" ? p.title.fr : p.title.en;
    const description = lang === "fr" ? p.description.fr : p.description.en;
    const q = searchTerm.toLowerCase();
    return (
      (title.toLowerCase().includes(q) || description.toLowerCase().includes(q)) &&
      (selectedLevel === "All" || p.level === selectedLevel)
    );
  });

  const inProgress = filtered.filter((p) => p.enrolled && p.progress?.status === "active");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
          <h1 className="text-3xl lg:text-5xl font-black text-center text-foreground mb-3">{t("programs.title")}</h1>
          <p className="text-muted-foreground text-center text-base max-w-xl mx-auto mb-8">{t("programs.subtitle")}</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={t("programs.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Continue where you left off */}
      {inProgress.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">
            {t("programs.continueTraining")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {inProgress.map((p) => {
              const title = lang === "fr" ? p.title.fr : p.title.en;
              return (
                <button
                  key={`ip-${p._id}`}
                  onClick={() => navigate(`/programs/${p.slug}`)}
                  className="text-left bg-card border border-primary/30 rounded-2xl p-4 hover:border-primary transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-foreground">{title}</h3>
                    <span className="text-xs font-bold text-primary shrink-0">{p.progress?.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress?.percent ?? 0}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("programs.weekDayOf", { week: p.progress?.currentWeek ?? 1, day: p.progress?.currentDay ?? 1 })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
              {level === "All" ? t("programs.all") : t(levelKeys[level])}
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

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-muted-foreground text-lg">{t("programs.noPrograms")}</p></div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, index) => {
              const title       = lang === "fr" ? p.title.fr : p.title.en;
              const description = lang === "fr" ? p.description.fr : p.description.en;
              const lc = levelColors[p.level] ?? "bg-secondary text-muted-foreground border-border";
              const done = p.progress?.status === "completed";

              return (
                <div
                  key={p._id}
                  onClick={() => navigate(`/programs/${p.slug}`)}
                  className="group cursor-pointer bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.locked && (
                        <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-accent/20 text-accent border border-accent/30">
                          <Lock className="h-2.5 w-2.5" /> {t("programs.pro")}
                        </span>
                      )}
                      <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border", lc)}>
                        {levelKeys[p.level] ? t(levelKeys[p.level]) : p.level}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

                  {p.focus?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.focus.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { icon: Calendar, label: t("programs.weeks"),    value: String(p.weeks) },
                      { icon: Clock,    label: t("programs.daysWeek"), value: String(p.daysPerWeek) },
                      { icon: Layers,   label: t("programs.sessions"), value: String(p.totalTrainingDays) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-secondary rounded-xl p-2.5 text-center">
                        <Icon className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
                        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
                        <p className="text-xs font-bold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar for enrolled programs */}
                  {p.enrolled && p.progress && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          {done ? t("programs.completed") : t("programs.inProgress")}
                        </span>
                        <span className="text-[10px] font-bold text-primary">
                          {p.progress.completedCount}/{p.progress.totalTrainingDays}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${p.progress.percent}%` }} />
                      </div>
                    </div>
                  )}

                  <button className="w-full flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200">
                    {done
                      ? <><CheckCircle2 className="h-4 w-4" /> {t("programs.viewProgram")}</>
                      : p.enrolled
                        ? t("programs.continue")
                        : t("programs.viewProgram")}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
