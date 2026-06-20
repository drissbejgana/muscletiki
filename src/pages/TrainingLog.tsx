import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/i18n";
import { workoutService } from "@/services/workoutService";
import { authService } from "@/services/authService";
import { cn } from "@/lib/utils";
import { Play, X, Check, Plus, Search, Clock, Dumbbell, History } from "lucide-react";

interface WorkoutSet { reps: number; weight: number; completed: boolean }
interface Exercise { id: string; name: string; sets: WorkoutSet[]; muscleGroup?: string }
interface ActiveSession { name: string; exercises: Exercise[] }
interface HistoryEntry {
  workoutId: string | { _id: string; title?: string; name?: string };
  completedAt: string;
  exercises: any[];
}

const EXERCISE_DB = [
  { name: "Bench Press", muscle: "chest" }, { name: "Incline Bench Press", muscle: "chest" },
  { name: "Dumbbell Fly", muscle: "chest" }, { name: "Push-Up", muscle: "chest" },
  { name: "Deadlift", muscle: "back" }, { name: "Pull-Up", muscle: "back" },
  { name: "Barbell Row", muscle: "back" }, { name: "Lat Pulldown", muscle: "back" },
  { name: "Overhead Press", muscle: "shoulders" }, { name: "Lateral Raise", muscle: "shoulders" },
  { name: "Arnold Press", muscle: "shoulders" }, { name: "Upright Row", muscle: "shoulders" },
  { name: "Barbell Curl", muscle: "arms" }, { name: "Dumbbell Curl", muscle: "arms" },
  { name: "Hammer Curl", muscle: "arms" }, { name: "Tricep Pushdown", muscle: "arms" },
  { name: "Skull Crusher", muscle: "arms" }, { name: "Close Grip Bench Press", muscle: "arms" },
  { name: "Squat", muscle: "legs" }, { name: "Front Squat", muscle: "legs" },
  { name: "Leg Press", muscle: "legs" }, { name: "Lunges", muscle: "legs" },
  { name: "Romanian Deadlift", muscle: "legs" }, { name: "Hip Thrust", muscle: "legs" },
  { name: "Plank", muscle: "core" }, { name: "Crunch", muscle: "core" },
  { name: "Russian Twist", muscle: "core" }, { name: "Hanging Leg Raise", muscle: "core" },
];

const EXERCISE_DB_FR: Record<string, string> = {
  "Bench Press": "Développé couché", "Incline Bench Press": "Développé incliné",
  "Dumbbell Fly": "Écarté haltères", "Push-Up": "Pompe",
  "Deadlift": "Soulevé de terre", "Pull-Up": "Traction",
  "Barbell Row": "Rowing barre", "Lat Pulldown": "Tirage vertical",
  "Overhead Press": "Développé militaire", "Lateral Raise": "Élévation latérale",
  "Arnold Press": "Développé Arnold", "Upright Row": "Rowing menton",
  "Barbell Curl": "Curl barre", "Dumbbell Curl": "Curl haltères",
  "Hammer Curl": "Curl marteau", "Tricep Pushdown": "Extension triceps",
  "Skull Crusher": "Barre au front", "Close Grip Bench Press": "Développé serré",
  "Squat": "Squat", "Front Squat": "Squat avant", "Leg Press": "Presse à cuisses",
  "Lunges": "Fentes", "Romanian Deadlift": "Soulevé roumain", "Hip Thrust": "Hip thrust",
  "Plank": "Planche", "Crunch": "Crunch", "Russian Twist": "Rotation russe",
  "Hanging Leg Raise": "Relevé de jambes suspendu",
};

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
  </svg>
);

const TrainingLog = () => {
  const { t, lang } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [view, setView] = useState<"current" | "history">("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [customExercise, setCustomExercise] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => { if (isAuthenticated) loadHistory(); }, []);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await workoutService.getWorkoutHistory();
      setHistory(Array.isArray(data) ? data.sort((a: HistoryEntry, b: HistoryEntry) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ) : []);
    } catch { setHistory([]); }
    finally { setLoadingHistory(false); }
  };

  const exName = (name: string) => lang === "fr" ? (EXERCISE_DB_FR[name] || name) : name;
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const startNewSession = () => {
    setActiveSession({ name: lang === "fr" ? "Séance d'entraînement" : "Workout Session", exercises: [] });
    setTimer(0); setTimerActive(true); setView("current"); setError("");
  };

  const addExercise = (name: string, muscle?: string) => {
    if (!activeSession) return;
    const exercise: Exercise = { id: generateId(), name, muscleGroup: muscle, sets: [{ reps: 10, weight: 0, completed: false }] };
    setActiveSession({ ...activeSession, exercises: [...activeSession.exercises, exercise] });
    setShowExercisePicker(false); setSearchTerm("");
  };

  const addSet = (exerciseId: string) => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { reps: last?.reps || 10, weight: last?.weight || 0, completed: false }] };
      }),
    });
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: number | boolean) => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((ex) =>
        ex.id !== exerciseId ? ex : { ...ex, sets: ex.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s) }
      ),
    });
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      exercises: activeSession.exercises.map((ex) =>
        ex.id !== exerciseId ? ex : { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
      ),
    });
  };

  const removeExercise = (exerciseId: string) => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, exercises: activeSession.exercises.filter((ex) => ex.id !== exerciseId) });
  };

  const finishWorkout = async () => {
    if (!activeSession || activeSession.exercises.length === 0) return;
    setSaving(true); setError("");
    try {
      const exerciseData = activeSession.exercises.map((ex) => ({
        name: ex.name, muscleGroup: ex.muscleGroup || "other",
        sets: ex.sets.filter((s) => s.completed).map((s) => ({ reps: s.reps, weight: s.weight })),
      }));
      const workoutData = {
        title: activeSession.name,
        description: `${lang === "fr" ? "Séance enregistrée" : "Logged session"} - ${new Date().toLocaleDateString()}`,
        level: "Débutant", type: "Full Body", duration: Math.floor(timer / 60), isPublic: false,
        exercises: activeSession.exercises.map((ex) => ({
          name: ex.name, muscleGroup: ex.muscleGroup || "other",
          sets: ex.sets.filter((s) => s.completed).length || ex.sets.length,
          reps: ex.sets.filter((s) => s.completed).map((s) => s.reps).join(", ") || "10",
          rest: 60, notes: "",
        })),
      };
      const created = await workoutService.createWorkout(workoutData);
      await workoutService.completeWorkout(created._id, exerciseData);
      setActiveSession(null); setTimerActive(false); setTimer(0); setView("history");
      await loadHistory();
    } catch (err: any) {
      setError(typeof err === "string" ? err : err.message || t("training.saveError"));
    } finally { setSaving(false); }
  };

  const cancelWorkout = () => { setActiveSession(null); setTimerActive(false); setTimer(0); setError(""); };

  const getWorkoutName = (entry: HistoryEntry) =>
    typeof entry.workoutId === "object" && entry.workoutId !== null
      ? entry.workoutId.title || entry.workoutId.name || t("training.workout")
      : t("training.workout");

  const getTotalSets = (exercises: any[]) => {
    if (!exercises?.length) return 0;
    return exercises.reduce((t: number, ex: any) => {
      if (ex.sets && Array.isArray(ex.sets)) return t + ex.sets.length;
      if (typeof ex.sets === "number") return t + ex.sets;
      if (Array.isArray(ex.reps)) return t + ex.reps.length;
      return t;
    }, 0);
  };

  const filteredExercises = EXERCISE_DB.filter((e) => {
    const name = lang === "fr" ? (EXERCISE_DB_FR[e.name] || e.name) : e.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-1">{t("training.title")}</h1>
          <p className="text-muted-foreground">{t("training.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-5 bg-destructive/10 border border-destructive/25 text-destructive rounded-xl p-3 text-sm">{error}</div>
        )}

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6 bg-secondary rounded-xl p-1">
          {(["current", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                view === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "current" ? <Play className="h-3.5 w-3.5" /> : <History className="h-3.5 w-3.5" />}
              {tab === "current" ? t("training.currentWorkout") : `${t("training.history")} (${history.length})`}
            </button>
          ))}
        </div>

        {/* CURRENT WORKOUT */}
        {view === "current" && (
          <>
            {!activeSession ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Dumbbell className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-foreground">{t("training.readyToTrain")}</h2>
                <p className="text-muted-foreground mb-8 text-sm">{t("training.startDescription")}</p>
                <button
                  onClick={startNewSession}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  <Play className="h-5 w-5" />
                  {t("training.startWorkout")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Session header */}
                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      value={activeSession.name}
                      onChange={(e) => setActiveSession({ ...activeSession, name: e.target.value })}
                      className="text-base font-bold bg-transparent border-0 p-0 h-auto focus-visible:ring-0 text-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      <span className="font-mono font-bold text-primary text-sm">{formatTime(timer)}</span>
                    </div>
                    <button onClick={cancelWorkout} disabled={saving} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors border border-destructive/20">
                      {t("training.cancel")}
                    </button>
                    <button
                      onClick={finishWorkout}
                      disabled={activeSession.exercises.length === 0 || saving}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {saving ? <><Spinner />{t("training.saving")}</> : t("training.finish")}
                    </button>
                  </div>
                </div>

                {/* Exercises */}
                {activeSession.exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-foreground">{exName(exercise.name)}</h3>
                        {exercise.muscleGroup && <span className="text-xs text-muted-foreground capitalize">{exercise.muscleGroup}</span>}
                      </div>
                      <button onClick={() => removeExercise(exercise.id)} className="w-7 h-7 rounded-lg bg-secondary text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors flex items-center justify-center">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-[36px_1fr_1fr_36px_28px] gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <div className="text-center">#</div>
                      <div>{t("training.weight")} kg</div>
                      <div>{t("training.reps")}</div>
                      <div className="text-center">✓</div>
                      <div />
                    </div>

                    {exercise.sets.map((set, si) => (
                      <div key={si} className={cn("grid grid-cols-[36px_1fr_1fr_36px_28px] gap-2 mb-1.5 items-center rounded-lg transition-colors", set.completed && "bg-primary/8")}>
                        <span className="text-xs font-bold text-center text-muted-foreground">{si + 1}</span>
                        <input
                          type="number" value={set.weight || ""} min={0}
                          onChange={(e) => updateSet(exercise.id, si, "weight", Number(e.target.value))}
                          className="bg-secondary border border-border rounded-lg h-9 text-center text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="0"
                        />
                        <input
                          type="number" value={set.reps || ""} min={0}
                          onChange={(e) => updateSet(exercise.id, si, "reps", Number(e.target.value))}
                          className="bg-secondary border border-border rounded-lg h-9 text-center text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="0"
                        />
                        <button
                          onClick={() => updateSet(exercise.id, si, "completed", !set.completed)}
                          className={cn("h-9 w-9 rounded-lg border transition-all flex items-center justify-center",
                            set.completed ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => removeSet(exercise.id, si)} className="h-7 w-7 text-muted-foreground/50 hover:text-destructive transition-colors flex items-center justify-center rounded">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    <button onClick={() => addSet(exercise.id)} className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                      <Plus className="h-3.5 w-3.5" /> {t("training.addSet")}
                    </button>
                  </div>
                ))}

                {!showExercisePicker ? (
                  <button onClick={() => setShowExercisePicker(true)} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                    <Plus className="h-4 w-4" /> {t("training.addExercise")}
                  </button>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("training.searchExercise")} className="pl-9 bg-secondary border-border" autoFocus />
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-0.5 mb-3">
                      {filteredExercises.map((e) => (
                        <button key={e.name} onClick={() => addExercise(e.name, e.muscle)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary text-sm transition-colors text-left">
                          <span className="text-foreground">{exName(e.name)}</span>
                          <span className="text-xs text-muted-foreground capitalize">{e.muscle}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} placeholder={t("training.customExercise")} className="flex-1 bg-secondary border-border" />
                      <button onClick={() => { if (customExercise.trim()) { addExercise(customExercise.trim()); setCustomExercise(""); } }} disabled={!customExercise.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors">
                        {t("common.add")}
                      </button>
                    </div>
                    <button onClick={() => { setShowExercisePicker(false); setSearchTerm(""); }} className="w-full mt-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {t("common.cancel")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
                <Spinner /> {t("training.loadingHistory")}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h2 className="text-xl font-black mb-2 text-foreground">{t("training.noHistory")}</h2>
                <p className="text-muted-foreground text-sm">{t("training.noHistoryDesc")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-foreground">{getWorkoutName(entry)}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.completedAt)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{getTotalSets(entry.exercises)} {t("training.sets")}</span>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <span className="flex items-center gap-1 bg-primary/10 text-primary rounded-lg px-2.5 py-1 text-xs font-semibold">
                        <Dumbbell className="h-3 w-3" /> {entry.exercises?.length || 0} {t("training.exercises")}
                      </span>
                    </div>

                    {entry.exercises?.length > 0 && (
                      <div className="space-y-1">
                        {entry.exercises.map((ex: any, exIdx: number) => (
                          <div key={exIdx} className="flex items-center gap-1.5 text-xs">
                            <span className="font-semibold text-foreground">{exName(ex.name || "Exercise")}</span>
                            <span className="text-muted-foreground">—</span>
                            <span className="text-muted-foreground">
                              {ex.sets && Array.isArray(ex.sets)
                                ? ex.sets.map((s: any, si: number) => <span key={si}>{si > 0 && ", "}{s.weight || 0}kg × {s.reps || 0}</span>)
                                : Array.isArray(ex.reps)
                                  ? ex.reps.map((r: number, ri: number) => <span key={ri}>{ri > 0 && ", "}{ex.weight?.[ri] || 0}kg × {r}</span>)
                                  : <span>{ex.sets || 0} {t("training.sets")}</span>
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainingLog;
