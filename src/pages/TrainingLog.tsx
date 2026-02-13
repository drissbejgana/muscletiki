import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { workoutService } from "@/services/workoutService";
import { authService } from "@/services/authService";

interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  muscleGroup?: string;
}

interface ActiveSession {
  name: string;
  exercises: Exercise[];
}

interface HistoryEntry {
  workoutId: string | { _id: string; title?: string; name?: string };
  completedAt: string;
  exercises: any[];
}

const EXERCISE_DB = [
  { name: "Bench Press", muscle: "chest" }, { name: "Incline Bench Press", muscle: "chest" },
  { name: "Decline Bench Press", muscle: "chest" }, { name: "Dumbbell Fly", muscle: "chest" },
  { name: "Push-Up", muscle: "chest" }, { name: "Cable Crossover", muscle: "chest" },
  { name: "Chest Dip", muscle: "chest" },
  { name: "Deadlift", muscle: "back" }, { name: "Pull-Up", muscle: "back" },
  { name: "Barbell Row", muscle: "back" }, { name: "Lat Pulldown", muscle: "back" },
  { name: "Seated Cable Row", muscle: "back" }, { name: "T-Bar Row", muscle: "back" },
  { name: "Face Pull", muscle: "back" },
  { name: "Overhead Press", muscle: "shoulders" }, { name: "Lateral Raise", muscle: "shoulders" },
  { name: "Front Raise", muscle: "shoulders" }, { name: "Rear Delt Fly", muscle: "shoulders" },
  { name: "Arnold Press", muscle: "shoulders" }, { name: "Upright Row", muscle: "shoulders" },
  { name: "Shrugs", muscle: "shoulders" },
  { name: "Barbell Curl", muscle: "arms" }, { name: "Dumbbell Curl", muscle: "arms" },
  { name: "Hammer Curl", muscle: "arms" }, { name: "Tricep Pushdown", muscle: "arms" },
  { name: "Skull Crusher", muscle: "arms" }, { name: "Close Grip Bench Press", muscle: "arms" },
  { name: "Concentration Curl", muscle: "arms" },
  { name: "Squat", muscle: "legs" }, { name: "Front Squat", muscle: "legs" },
  { name: "Leg Press", muscle: "legs" }, { name: "Lunges", muscle: "legs" },
  { name: "Leg Extension", muscle: "legs" }, { name: "Leg Curl", muscle: "legs" },
  { name: "Calf Raise", muscle: "legs" }, { name: "Romanian Deadlift", muscle: "legs" },
  { name: "Hip Thrust", muscle: "legs" }, { name: "Bulgarian Split Squat", muscle: "legs" },
  { name: "Plank", muscle: "core" }, { name: "Crunch", muscle: "core" },
  { name: "Russian Twist", muscle: "core" }, { name: "Hanging Leg Raise", muscle: "core" },
  { name: "Ab Wheel Rollout", muscle: "core" }, { name: "Cable Woodchop", muscle: "core" },
];

const EXERCISE_DB_FR: Record<string, string> = {
  "Bench Press": "Développé couché", "Incline Bench Press": "Développé incliné",
  "Decline Bench Press": "Développé décliné", "Dumbbell Fly": "Écarté haltères",
  "Push-Up": "Pompe", "Cable Crossover": "Croisé poulie", "Chest Dip": "Dip poitrine",
  "Deadlift": "Soulevé de terre", "Pull-Up": "Traction", "Barbell Row": "Rowing barre",
  "Lat Pulldown": "Tirage vertical", "Seated Cable Row": "Tirage horizontal assis",
  "T-Bar Row": "Rowing T-bar", "Face Pull": "Face pull",
  "Overhead Press": "Développé militaire", "Lateral Raise": "Élévation latérale",
  "Front Raise": "Élévation frontale", "Rear Delt Fly": "Oiseau",
  "Arnold Press": "Développé Arnold", "Upright Row": "Rowing menton",
  "Shrugs": "Haussements d'épaules",
  "Barbell Curl": "Curl barre", "Dumbbell Curl": "Curl haltères",
  "Hammer Curl": "Curl marteau", "Tricep Pushdown": "Extension triceps poulie",
  "Skull Crusher": "Barre au front", "Close Grip Bench Press": "Développé serré",
  "Concentration Curl": "Curl concentré",
  "Squat": "Squat", "Front Squat": "Squat avant", "Leg Press": "Presse à cuisses",
  "Lunges": "Fentes", "Leg Extension": "Extension de jambes", "Leg Curl": "Curl jambes",
  "Calf Raise": "Mollets debout", "Romanian Deadlift": "Soulevé de terre roumain",
  "Hip Thrust": "Hip thrust", "Bulgarian Split Squat": "Squat bulgare",
  "Plank": "Planche", "Crunch": "Crunch", "Russian Twist": "Rotation russe",
  "Hanging Leg Raise": "Relevé de jambes suspendu", "Ab Wheel Rollout": "Roue abdominale",
  "Cable Woodchop": "Bûcheron poulie",
};

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

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

  // Load workout history from backend
  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await workoutService.getWorkoutHistory();
      setHistory(Array.isArray(data) ? data.sort((a: HistoryEntry, b: HistoryEntry) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      ) : []);
    } catch (err: any) {
      console.error("Failed to load history:", err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const exName = (name: string) => lang === "fr" ? (EXERCISE_DB_FR[name] || name) : name;

  const startNewSession = () => {
    const session: ActiveSession = {
      name: lang === "fr" ? "Séance d'entraînement" : "Workout Session",
      exercises: [],
    };
    setActiveSession(session);
    setTimer(0);
    setTimerActive(true);
    setView("current");
    setError("");
  };

  const addExercise = (name: string, muscle?: string) => {
    if (!activeSession) return;
    const exercise: Exercise = {
      id: generateId(),
      name,
      muscleGroup: muscle,
      sets: [{ reps: 10, weight: 0, completed: false }],
    };
    setActiveSession({ ...activeSession, exercises: [...activeSession.exercises, exercise] });
    setShowExercisePicker(false);
    setSearchTerm("");
  };

  const addCustomExercise = () => {
    if (customExercise.trim()) {
      addExercise(customExercise.trim());
      setCustomExercise("");
    }
  };

  const addSet = (exerciseId: string) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { reps: lastSet?.reps || 10, weight: lastSet?.weight || 0, completed: false }] };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises });
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: number | boolean) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const sets = ex.sets.map((s, i) => i === setIndex ? { ...s, [field]: value } : s);
        return { ...ex, sets };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises });
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    if (!activeSession) return;
    const exercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises });
  };

  const removeExercise = (exerciseId: string) => {
    if (!activeSession) return;
    setActiveSession({ ...activeSession, exercises: activeSession.exercises.filter((ex) => ex.id !== exerciseId) });
  };

  const finishWorkout = async () => {
    if (!activeSession || activeSession.exercises.length === 0) return;
    setSaving(true);
    setError("");

    try {
      // Build exercise data for the backend
      const exerciseData = activeSession.exercises.map((ex) => ({
        name: ex.name,
        muscleGroup: ex.muscleGroup || "other",
        sets: ex.sets.filter((s) => s.completed).map((s) => ({
          reps: s.reps,
          weight: s.weight,
        })),
      }));

      // Build workout data matching backend Workout model
      const workoutData = {
        title: activeSession.name,
        description: `${lang === "fr" ? "Séance enregistrée" : "Logged session"} - ${new Date().toLocaleDateString()}`,
        level: "intermediate",
        type: "strength",
        duration: Math.floor(timer / 60),
        exercises: activeSession.exercises.map((ex) => ({
          name: ex.name,
          muscleGroup: ex.muscleGroup || "other",
          sets: ex.sets.filter((s) => s.completed).length,
          reps: ex.sets.filter((s) => s.completed).map((s) => s.reps),
          weight: ex.sets.filter((s) => s.completed).map((s) => s.weight),
          restTime: 60,
        })),
        isPublic: false,
      };

      // 1. Create the workout on backend
      const createdWorkout = await workoutService.createWorkout(workoutData);

      // 2. Mark it as completed with detailed exercise data
      await workoutService.completeWorkout(createdWorkout._id, exerciseData);

      // 3. Reset session state
      setActiveSession(null);
      setTimerActive(false);
      setTimer(0);
      setView("history");

      // 4. Reload history
      await loadHistory();
    } catch (err: any) {
      console.error("Failed to save workout:", err);
      setError(typeof err === "string" ? err : err.message || t("training.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const cancelWorkout = () => {
    setActiveSession(null);
    setTimerActive(false);
    setTimer(0);
    setError("");
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  };

  const getWorkoutName = (entry: HistoryEntry): string => {
    if (typeof entry.workoutId === "object" && entry.workoutId !== null) {
      return entry.workoutId.title || entry.workoutId.name || t("training.workout");
    }
    return t("training.workout");
  };

  const getTotalVolume = (exercises: any[]): number => {
    if (!exercises || !Array.isArray(exercises)) return 0;
    return exercises.reduce((total: number, ex: any) => {
      if (ex.sets && Array.isArray(ex.sets)) {
        return total + ex.sets.reduce((st: number, s: any) => st + ((s.reps || 0) * (s.weight || 0)), 0);
      }
      // Handle backend format with reps/weight arrays
      if (Array.isArray(ex.reps) && Array.isArray(ex.weight)) {
        return total + ex.reps.reduce((st: number, r: number, i: number) => st + (r * (ex.weight[i] || 0)), 0);
      }
      return total;
    }, 0);
  };

  const getTotalSets = (exercises: any[]): number => {
    if (!exercises || !Array.isArray(exercises)) return 0;
    return exercises.reduce((total: number, ex: any) => {
      if (ex.sets && Array.isArray(ex.sets)) return total + ex.sets.length;
      if (typeof ex.sets === "number") return total + ex.sets;
      if (Array.isArray(ex.reps)) return total + ex.reps.length;
      return total;
    }, 0);
  };

  const filteredExercises = EXERCISE_DB.filter((e) => {
    const name = lang === "fr" ? (EXERCISE_DB_FR[e.name] || e.name) : e.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t("training.title")}</h1>
          <p className="text-muted-foreground">{t("training.subtitle")}</p>
        </header>

        {error && (
          <div className="mb-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex gap-2 mb-6">
          <Button variant={view === "current" ? "default" : "outline"} onClick={() => setView("current")} className="flex-1">
            {t("training.currentWorkout")}
          </Button>
          <Button variant={view === "history" ? "default" : "outline"} onClick={() => setView("history")} className="flex-1">
            {t("training.history")} ({history.length})
          </Button>
        </div>

        {/* ========== CURRENT WORKOUT VIEW ========== */}
        {view === "current" && (
          <>
            {!activeSession ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">💪</div>
                <h2 className="text-2xl font-bold mb-2">{t("training.readyToTrain")}</h2>
                <p className="text-muted-foreground mb-6">{t("training.startDescription")}</p>
                <Button size="lg" onClick={startNewSession} className="h-14 px-10 text-lg font-bold">
                  {t("training.startWorkout")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Timer Bar */}
                <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4 border border-primary/30">
                  <div className="flex-1 mr-4">
                    <Input
                      value={activeSession.name}
                      onChange={(e) => setActiveSession({ ...activeSession, name: e.target.value })}
                      className="text-lg font-bold border-0 bg-transparent p-0 h-auto"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold text-primary">{formatTime(timer)}</span>
                    <Button variant="destructive" size="sm" onClick={cancelWorkout} disabled={saving}>{t("training.cancel")}</Button>
                    <Button size="sm" onClick={finishWorkout} disabled={activeSession.exercises.length === 0 || saving}>
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t("training.saving")}
                        </span>
                      ) : t("training.finish")}
                    </Button>
                  </div>
                </div>

                {/* Exercises */}
                {activeSession.exercises.map((exercise) => (
                  <Card key={exercise.id} className="p-4 border-2">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-primary">{exName(exercise.name)}</h3>
                        {exercise.muscleGroup && (
                          <span className="text-xs text-muted-foreground capitalize">{exercise.muscleGroup}</span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeExercise(exercise.id)}>✕</Button>
                    </div>

                    <div className="grid grid-cols-[40px_1fr_1fr_40px_40px] gap-2 mb-2 text-xs text-muted-foreground font-semibold uppercase">
                      <div>{t("training.set")}</div>
                      <div>{t("training.weight")} (kg)</div>
                      <div>{t("training.reps")}</div>
                      <div className="text-center">✓</div>
                      <div></div>
                    </div>

                    {exercise.sets.map((set, si) => (
                      <div key={si} className={`grid grid-cols-[40px_1fr_1fr_40px_40px] gap-2 mb-1 items-center ${set.completed ? "bg-green-500/10 rounded-md" : ""}`}>
                        <span className="text-sm font-bold text-center">{si + 1}</span>
                        <Input type="number" value={set.weight || ""} onChange={(e) => updateSet(exercise.id, si, "weight", Number(e.target.value))} className="h-9 text-center" placeholder="0" min={0} />
                        <Input type="number" value={set.reps || ""} onChange={(e) => updateSet(exercise.id, si, "reps", Number(e.target.value))} className="h-9 text-center" placeholder="0" min={0} />
                        <Button variant={set.completed ? "default" : "outline"} size="sm" className={`h-9 w-9 p-0 ${set.completed ? "bg-green-600 hover:bg-green-700" : ""}`} onClick={() => updateSet(exercise.id, si, "completed", !set.completed)}>✓</Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground" onClick={() => removeSet(exercise.id, si)}>✕</Button>
                      </div>
                    ))}

                    <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => addSet(exercise.id)}>
                      + {t("training.addSet")}
                    </Button>
                  </Card>
                ))}

                {/* Add Exercise */}
                {!showExercisePicker ? (
                  <Button variant="outline" className="w-full h-12 border-dashed border-2" onClick={() => setShowExercisePicker(true)}>
                    + {t("training.addExercise")}
                  </Button>
                ) : (
                  <Card className="p-4 border-2 border-primary/30">
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t("training.searchExercise")} className="mb-3" autoFocus />
                    <div className="max-h-48 overflow-y-auto space-y-1 mb-3">
                      {filteredExercises.map((e) => (
                        <button key={e.name} className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 text-sm transition-colors flex justify-between items-center" onClick={() => addExercise(e.name, e.muscle)}>
                          <span>{exName(e.name)}</span>
                          <span className="text-xs text-muted-foreground capitalize">{e.muscle}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} placeholder={t("training.customExercise")} className="flex-1" />
                      <Button size="sm" onClick={addCustomExercise} disabled={!customExercise.trim()}>{t("common.add")}</Button>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => { setShowExercisePicker(false); setSearchTerm(""); }}>
                      {t("common.cancel")}
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </>
        )}

        {/* ========== HISTORY VIEW ========== */}
        {view === "history" && (
          <>
            {loadingHistory ? (
              <div className="text-center py-16">
                <svg className="animate-spin h-8 w-8 mx-auto text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="text-muted-foreground">{t("training.loadingHistory")}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h2 className="text-2xl font-bold mb-2">{t("training.noHistory")}</h2>
                <p className="text-muted-foreground">{t("training.noHistoryDesc")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry, idx) => (
                  <Card key={idx} className="p-4 border-2">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{getWorkoutName(entry)}</h3>
                        <p className="text-sm text-muted-foreground">{formatDate(entry.completedAt)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {getTotalSets(entry.exercises)} {t("training.sets")}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mb-3 text-sm">
                      <div className="bg-primary/10 rounded-md px-3 py-1">
                        <span className="font-bold text-primary">{entry.exercises?.length || 0}</span>{" "}
                        <span className="text-muted-foreground">{t("training.exercises")}</span>
                      </div>
                      {getTotalVolume(entry.exercises) > 0 && (
                        <div className="bg-primary/10 rounded-md px-3 py-1">
                          <span className="font-bold text-primary">{getTotalVolume(entry.exercises).toLocaleString()}</span>{" "}
                          <span className="text-muted-foreground">kg {t("training.volume")}</span>
                        </div>
                      )}
                    </div>

                    {entry.exercises && entry.exercises.length > 0 && (
                      <div className="space-y-1">
                        {entry.exercises.map((ex: any, exIdx: number) => (
                          <div key={exIdx} className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-primary">{exName(ex.name || "Exercise")}</span>
                            <span className="text-muted-foreground">—</span>
                            <span className="text-muted-foreground">
                              {ex.sets && Array.isArray(ex.sets) ? (
                                ex.sets.map((s: any, si: number) => (
                                  <span key={si}>{si > 0 && ", "}{s.weight || 0}kg × {s.reps || 0}</span>
                                ))
                              ) : Array.isArray(ex.reps) ? (
                                ex.reps.map((r: number, ri: number) => (
                                  <span key={ri}>{ri > 0 && ", "}{ex.weight?.[ri] || 0}kg × {r}</span>
                                ))
                              ) : (
                                <span>{ex.sets || 0} {t("training.sets")}</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
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
