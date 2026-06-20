import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MyContext from "@/contexts/MyContext";
import { useTranslation } from "@/i18n";
import api from "@/services/api";
import { cn } from "@/lib/utils";

interface ExerciseVideos { front: string; side: string }
interface Exercise {
  exerciseId: number;
  name:       { en: string; fr: string };
  difficulty: string;
  videos:     { male: ExerciseVideos; female: ExerciseVideos };
  steps:      { en: string[]; fr: string[] };
  isActive:   boolean;
}
interface MuscleGroup {
  muscleId:  number;
  name:      { en: string; fr: string };
  exercises: Exercise[];
}

const difficultyColors: Record<string, string> = {
  Beginner:      "bg-primary/20 text-primary border-primary/30",
  Intermediate:  "bg-accent/20 text-accent border-accent/30",
  Advanced:      "bg-destructive/20 text-destructive border-destructive/30",
  Novice:        "bg-primary/20 text-primary border-primary/30",
  Débutant:      "bg-primary/20 text-primary border-primary/30",
  Intermédiaire: "bg-accent/20 text-accent border-accent/30",
  Avancé:        "bg-destructive/20 text-destructive border-destructive/30",
};

const difficultyLabel: Record<string, Record<string, string>> = {
  Beginner:     { en: "Beginner",     fr: "Débutant"      },
  Intermediate: { en: "Intermediate", fr: "Intermédiaire"  },
  Advanced:     { en: "Advanced",     fr: "Avancé"         },
  Novice:       { en: "Novice",       fr: "Novice"         },
};

const isVideo = (url: string) => {
  if (!url) return false;
  return ["mp4", "webm", "ogg"].includes(url.split(".").pop()?.toLowerCase() ?? "");
};

const MuscleTutorials = () => {
  const { muscle } = useParams<{ muscle: string }>();
  const { homme }  = useContext(MyContext);
  const navigate   = useNavigate();
  const { t, lang } = useTranslation();
  const gender: "male" | "female" = !homme ? "male" : "female";

  const [muscleData, setMuscleData] = useState<MuscleGroup | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const fetchMuscle = async () => {
      setLoading(true); setError(null);
      try {
        const res  = await api.get("/admin/muscle-exercises/public");
        const all: MuscleGroup[] = res.data.data || [];
        const decoded = decodeURIComponent(muscle ?? "").toLowerCase();
        const found   = all.find((m) => m.name.en.toLowerCase() === decoded || m.name.fr.toLowerCase() === decoded);
        setMuscleData(found ?? null);
      } catch (e: any) { setError(e?.response?.data?.message || "Failed to load exercises"); }
      finally { setLoading(false); }
    };
    fetchMuscle();
  }, [muscle]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (error || !muscleData) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">{t("muscle.notFound")}</h2>
        <p className="text-sm text-muted-foreground mb-5">{error || t("muscle.notFoundDesc")}</p>
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("common.returnHome")}
        </button>
      </div>
    </div>
  );

  const muscleName = lang === "fr" ? muscleData.name.fr : muscleData.name.en;
  const exercises  = muscleData.exercises.filter((ex) => ex.isActive);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("common.back")}
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-foreground">{muscleName}</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {exercises.length} {exercises.length === 1 ? t("muscle.exerciseCount_one", { count: "1" }).replace("1 ", "") : t("muscle.exerciseCount_other", { count: String(exercises.length) }).replace(`${exercises.length} `, "")}
          </p>
        </div>
      </div>

      {/* Exercise cards */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
        <div className="space-y-8">
          {exercises.map((ex, index) => {
            const name       = lang === "fr" ? ex.name.fr : ex.name.en;
            const steps      = lang === "fr" ? ex.steps.fr : ex.steps.en;
            const videos     = ex.videos[gender];
            const difficulty = difficultyLabel[ex.difficulty]?.[lang] ?? ex.difficulty;

            return (
              <div
                key={ex.exerciseId}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors mb-1">
                        {name}
                      </h2>
                      <p className="text-muted-foreground text-sm">{t("muscle.masterExercise")}</p>
                    </div>
                    <span className={cn("px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border", difficultyColors[difficulty] ?? "bg-secondary text-muted-foreground border-border")}>
                      {difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Videos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { url: videos?.front, label: t("muscle.frontView") },
                      { url: videos?.side,  label: t("muscle.sideView") },
                    ].map(({ url, label }, i) => (
                      <div key={i} className="relative overflow-hidden rounded-xl border border-border bg-secondary group/media">
                        {url ? (
                          isVideo(url) ? (
                            <video src={url} className="w-full h-auto" autoPlay loop muted playsInline />
                          ) : (
                            <img src={url} className="w-full h-auto transition-transform duration-500 group-hover/media:scale-105" alt={label} />
                          )
                        ) : (
                          <div className="w-full h-44 flex items-center justify-center text-muted-foreground text-sm">
                            {label} — {lang === "fr" ? "Vidéo non disponible" : "Not available"}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-xs font-semibold text-white">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Steps */}
                  {steps?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-border" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{t("muscle.instructions")}</h3>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <ol className="space-y-3">
                        {steps.map((step, idx) => (
                          <li key={idx} className="flex gap-4 p-3.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors">
                            <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-black shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-foreground/85 leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MuscleTutorials;
