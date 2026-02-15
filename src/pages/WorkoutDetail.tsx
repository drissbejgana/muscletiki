import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Play, ChevronDown, ChevronUp,
  Clock, Dumbbell, Target, CheckCircle2, Loader2, Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";
import { workoutService } from "@/services/workoutService";
import MyContext from "@/contexts/MyContext";
import api from "@/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkoutExercise {
  name:              string;
  sets:              number;
  reps:              string;
  muscleExerciseId?: number; // links to MuscleExercise in DB
}

interface Workout {
  _id:           string;
  title:         string;
  description:   string;
  level:         string;
  type:          string;
  duration:      number;
  equipment:     string[];
  targetMuscles: { front: string[]; back: string[] };
  exercises:     WorkoutExercise[];
  isPremium:     boolean;
  image?:        string;
}

interface MuscleExData {
  name:  { en: string; fr: string };
  steps: { en: string[]; fr: string[] };
  videos: {
    male:   { front: string; side: string };
    female: { front: string; side: string };
  };
  difficulty: string;
}

// Map: exercise index → MuscleExData (index-based so works with or without muscleExerciseId)
type VideoMap = Record<number, MuscleExData>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isVideo = (url: string) => {
  if (!url) return false;
  return ["mp4", "webm", "ogg"].includes(url.split(".").pop()?.toLowerCase() ?? "");
};

// ─── Exercise Card ─────────────────────────────────────────────────────────────
const ExerciseCard = ({
  exercise,
  index,
  videoData,
  gender,
  lang,
}: {
  exercise:  WorkoutExercise;
  index:     number;
  videoData: MuscleExData | null;
  gender:    "male" | "female";
  lang:      string;
}) => {
  const [expanded,   setExpanded]   = useState(false);
  const [activeView, setActiveView] = useState<"front" | "side">("front");

  const L = {
    en: { front: "Front View", side: "Side View", sets: "sets", reps: "reps", steps: "Steps", noVideo: "No tutorial video linked." },
    fr: { front: "Vue de face", side: "Vue de côté", sets: "séries", reps: "reps", steps: "Étapes", noVideo: "Aucune vidéo tutoriel liée." },
  };
  const l = L[lang as "en" | "fr"] ?? L.en;

  const videos = videoData?.videos?.[gender];
  const currentUrl = activeView === "front" ? videos?.front : videos?.side;
  const steps = lang === "fr" ? videoData?.steps?.fr : videoData?.steps?.en;
  const exName = videoData
    ? (lang === "fr" ? videoData.name.fr : videoData.name.en)
    : exercise.name;

  const diffColors: Record<string, string> = {
    Beginner:     "bg-green-500/20 text-green-400",
    Intermediate: "bg-orange-500/20 text-orange-400",
    Advanced:     "bg-red-500/20 text-red-400",
    Novice:       "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300">
      {/* ── Collapsed header ── */}
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Number badge */}
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>

        {/* Name + sets/reps */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{exName}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span>{exercise.sets} {l.sets}</span>
            <span>·</span>
            <span>{exercise.reps} {l.reps}</span>
            {videoData?.difficulty && (
              <>
                <span>·</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${diffColors[videoData.difficulty] ?? ""}`}>
                  {videoData.difficulty}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Video indicator + chevron */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {videoData && (videos?.front || videos?.side) && (
            <Video className="h-4 w-4 text-primary/60" title="Tutorial video available" />
          )}
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* ── Expanded content ── */}
      {expanded && (
        <div className="border-t border-border">

          {/* Video section */}
          <div className="p-4 pb-0">
            {currentUrl ? (
              <>
                {/* Front / Side toggle */}
                <div className="flex gap-2 mb-3">
                  {(["front", "side"] as const).map((view) => {
                    const url = view === "front" ? videos?.front : videos?.side;
                    if (!url) return null;
                    return (
                      <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          activeView === view
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        {view === "front" ? l.front : l.side}
                      </button>
                    );
                  })}
                </div>

                {/* Player */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                  {isVideo(currentUrl) ? (
                    <video
                      key={currentUrl}
                      src={currentUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      key={currentUrl}
                      src={currentUrl}
                      alt={exName}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-4 mb-2">
                <Video className="h-4 w-4 shrink-0" />
                {l.noVideo}
              </div>
            )}
          </div>

          {/* Steps */}
          {steps && steps.length > 0 && (
            <div className="p-4">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {l.steps}
              </h4>
              <ol className="space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main WorkoutDetail Page ──────────────────────────────────────────────────
const WorkoutDetail = () => {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const { lang }   = useTranslation();
  const { homme }  = useContext(MyContext);

  // homme=true → male selected, homme=false → female selected (your app's convention)
  const gender: "male" | "female" = !homme ? "male" : "female";

  const [workout,  setWorkout]  = useState<Workout | null>(null);
  const [videoMap, setVideoMap] = useState<VideoMap>({});
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // ─── Labels ───────────────────────────────────────────────────────────────
  const L = {
    en: {
      back: "Back to Programs", exercises: "Exercises", duration: "Duration",
      level: "Level", type: "Type", muscles: "Target Muscles",
      equipment: "Equipment", noWorkout: "Workout not found.",
      min: "min",
    },
    fr: {
      back: "Retour aux programmes", exercises: "Exercices", duration: "Durée",
      level: "Niveau", type: "Type", muscles: "Muscles ciblés",
      equipment: "Équipement", noWorkout: "Programme introuvable.",
      min: "min",
    },
  };
  const l = L[lang as "en" | "fr"] ?? L.en;

  // ─── Fetch workout ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const w: Workout = await workoutService.getWorkout(id);
        setWorkout(w);

        // Always fetch muscle exercises — match by muscleExerciseId OR by name (fallback)
        const res = await api.get("/admin/muscle-exercises/public");
        const allMuscles: any[] = res.data.data || [];

        // Build two lookup structures:
        //   byId:   exerciseId  → MuscleExData
        //   byName: lower(name) → MuscleExData  (for name-based fallback)
        const byId:   Record<number, MuscleExData> = {};
        const byName: Record<string, MuscleExData> = {};

        allMuscles.forEach((muscle) => {
          (muscle.exercises || []).forEach((ex: any) => {
            const data: MuscleExData = {
              name:       ex.name,
              steps:      ex.steps,
              videos:     ex.videos,
              difficulty: ex.difficulty,
            };
            byId[ex.exerciseId] = data;
            // Index by both EN and FR names (lowercased, trimmed)
            if (ex.name?.en) byName[ex.name.en.toLowerCase().trim()] = data;
            if (ex.name?.fr) byName[ex.name.fr.toLowerCase().trim()] = data;
          });
        });

        // Build the final VideoMap: one entry per workout exercise index
        // Priority: muscleExerciseId → exact name → partial name match
        const map: VideoMap = {};
        (w.exercises || []).forEach((ex, idx) => {
          if (ex.muscleExerciseId && byId[ex.muscleExerciseId]) {
            map[idx] = byId[ex.muscleExerciseId];
            return;
          }
          if (ex.name) {
            const key = ex.name.toLowerCase().trim();
            // Exact match
            if (byName[key]) { map[idx] = byName[key]; return; }
            // Partial match — find first DB exercise whose name contains the workout name or vice versa
            const partial = Object.entries(byName).find(([dbKey]) =>
              dbKey.includes(key) || key.includes(dbKey)
            );
            if (partial) { map[idx] = partial[1]; }
          }
        });

        setVideoMap(map);
      } catch (e: any) {
        setError(e?.response?.data?.message || String(e) || "Failed to load workout");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // ─── Error / not found ─────────────────────────────────────────────────────
  if (error || !workout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{error || l.noWorkout}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {l.back}
          </Button>
        </div>
      </div>
    );
  }

  const exercises = workout.exercises || [];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> {l.back}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">{workout.level}</Badge>
            <Badge variant="outline">{workout.type}</Badge>
            {workout.isPremium && (
              <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 border">Premium</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{workout.title}</h1>
          {workout.description && (
            <p className="text-muted-foreground">{workout.description}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Clock className="w-4 h-4" />,        label: l.duration,  value: workout.duration ? `${workout.duration} ${l.min}` : "—" },
            { icon: <Target className="w-4 h-4" />,       label: l.exercises, value: `${exercises.length}` },
            { icon: <Dumbbell className="w-4 h-4" />,     label: l.equipment, value: `${(workout.equipment || []).length}` },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: l.level,     value: workout.level },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/40 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <span className="font-semibold text-sm text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Equipment */}
        {workout.equipment?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{l.equipment}</h2>
            <div className="flex flex-wrap gap-2">
              {workout.equipment.map((eq) => (
                <Badge key={eq} variant="secondary" className="capitalize">{eq}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Target muscles */}
        {(workout.targetMuscles?.front?.length > 0 || workout.targetMuscles?.back?.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{l.muscles}</h2>
            <div className="flex flex-wrap gap-2">
              {[...( workout.targetMuscles?.front || []), ...(workout.targetMuscles?.back || [])].map((m) => (
                <Badge key={m} variant="secondary">{m}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* ── Exercises ── */}
        {exercises.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Dumbbell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>{lang === "fr" ? "Aucun exercice dans ce programme." : "No exercises in this workout."}</p>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {l.exercises} <span className="text-muted-foreground font-normal text-base">({exercises.length})</span>
            </h2>
            <div className="space-y-3">
              {exercises.map((ex, index) => (
                <ExerciseCard
                  key={index}
                  exercise={ex}
                  index={index}
                  videoData={videoMap[index] ?? null}
                  gender={gender}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;
