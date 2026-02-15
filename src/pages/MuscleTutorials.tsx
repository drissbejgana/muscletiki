import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MyContext from "@/contexts/MyContext";
import { useTranslation } from "@/i18n";
import api from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExerciseVideos {
  front: string;
  side:  string;
}
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

const MuscleTutorials = () => {
  const { muscle } = useParams<{ muscle: string }>();
  const { homme }  = useContext(MyContext);
  const navigate   = useNavigate();
  const { t, lang } = useTranslation();

  // homme = true  → user selected "male"   body toggle (confusingly named)
  // homme = false → user selected "female"
  const gender: "male" | "female" = !homme ? "male" : "female";

  const [muscleData, setMuscleData] = useState<MuscleGroup | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // ─── Fetch all muscles, find the one matching the URL param ───────────────
  useEffect(() => {
    const fetchMuscle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await api.get("/admin/muscle-exercises/public");
        const all: MuscleGroup[] = res.data.data || [];

        // URL param always uses the English name (e.g. /muscle/Abdominals)
        const decoded = decodeURIComponent(muscle ?? "").toLowerCase();
        const found   = all.find(
          (m) =>
            m.name.en.toLowerCase() === decoded ||
            m.name.fr.toLowerCase() === decoded
        );

        setMuscleData(found ?? null);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    fetchMuscle();
  }, [muscle]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const isVideo = (url: string) => {
    if (!url) return false;
    const ext = url.split(".").pop()?.toLowerCase();
    return ["mp4", "webm", "ogg"].includes(ext ?? "");
  };

  const difficultyColors: Record<string, string> = {
    Beginner:      "bg-green-500/20 text-green-400 border-green-500/50",
    Intermediate:  "bg-orange-500/20 text-orange-400 border-orange-500/50",
    Advanced:      "bg-red-500/20 text-red-400 border-red-500/50",
    Novice:        "bg-green-500/20 text-green-400 border-green-500/50",
    // French labels
    Débutant:      "bg-green-500/20 text-green-400 border-green-500/50",
    Intermédiaire: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    Avancé:        "bg-red-500/20 text-red-400 border-red-500/50",
  };

  const difficultyLabel: Record<string, Record<string, string>> = {
    Beginner:     { en: "Beginner",     fr: "Débutant"      },
    Intermediate: { en: "Intermediate", fr: "Intermédiaire"  },
    Advanced:     { en: "Advanced",     fr: "Avancé"         },
    Novice:       { en: "Novice",       fr: "Novice"         },
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ─── Error / not found ────────────────────────────────────────────────────
  if (error || !muscleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full animate-scale-in">
          <CardHeader>
            <CardTitle>{t("muscle.notFound")}</CardTitle>
            <CardDescription>{error || t("muscle.notFoundDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="gradient" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />{t("common.returnHome")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Resolved data ────────────────────────────────────────────────────────
  const muscleName  = lang === "fr" ? muscleData.name.fr : muscleData.name.en;
  const exercises   = muscleData.exercises.filter((ex) => ex.isActive);
  const count       = exercises.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />{t("common.back")}
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute z-0 inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-4 mb-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {muscleName}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {count}{" "}
            {count > 1
              ? t("muscle.exerciseCount_other", { count: String(count) }).replace(`${count} `, "")
              : t("muscle.exerciseCount_one",   { count: String(count) }).replace(`${count} `, "")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 gap-8">
          {exercises.map((ex, index) => {
            const name       = lang === "fr" ? ex.name.fr : ex.name.en;
            const steps      = lang === "fr" ? ex.steps.fr : ex.steps.en;
            const videos     = ex.videos[gender];
            const difficulty = difficultyLabel[ex.difficulty]?.[lang] ?? ex.difficulty;

            return (
              <Card
                key={ex.exerciseId}
                className="group bg-gradient-card border-border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                        {name}
                      </CardTitle>
                      <CardDescription className="text-base">{t("muscle.masterExercise")}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${difficultyColors[difficulty] ?? "bg-muted"} text-sm px-4 py-1 font-semibold border`}
                    >
                      {difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  {/* Videos / Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    {[
                      { url: videos?.front, label: t("muscle.frontView") },
                      { url: videos?.side,  label: t("muscle.sideView")  },
                    ].map(({ url, label }, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 group/img"
                      >
                        {url ? (
                          isVideo(url) ? (
                            <video
                              src={url}
                              className="w-full h-auto"
                              autoPlay
                              loop
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={url}
                              className="w-full h-auto transition-transform duration-500 group-hover/img:scale-110"
                              alt={label}
                            />
                          )
                        ) : (
                          <div className="w-full h-40 flex items-center justify-center text-muted-foreground text-sm">
                            {label} — {lang === "fr" ? "Vidéo non disponible" : "Video not available"}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
                          <p className="text-sm font-semibold text-foreground">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Steps */}
                  {steps?.length > 0 && (
                    <div className="space-y-4 mt-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                        <h3 className="text-2xl font-bold text-primary">{t("muscle.instructions")}</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                      </div>
                      <ol className="space-y-4">
                        {steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:bg-muted/50"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                              {idx + 1}
                            </span>
                            <span className="text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <footer className="bg-card border-t border-border mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <p className="text-muted-foreground text-sm">{t("footer.rights")}</p>
            <div className="pt-6 border-t border-border/50">
              <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t("footer.simplify")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MuscleTutorials;
