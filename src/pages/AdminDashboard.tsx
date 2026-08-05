import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Users, CreditCard, TrendingUp, Search, MoreHorizontal, Loader2, AlertCircle,
  Dumbbell, Video, Plus, Pencil, Trash2, ListChecks, Activity,
  ChevronDown, ChevronRight, Eye, EyeOff, Check, X, CalendarDays, Lock,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { adminService } from "@/services/AdminService";
import { subscriptionService } from "@/services/subscriptionService";
import { useTranslation } from "@/i18n";

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (d: any) => (d ? new Date(d).toLocaleDateString() : "–");

const diffColor: Record<string, string> = {
  Beginner:     "bg-primary/20 text-primary",
  Intermediate: "bg-accent/20 text-accent",
  Advanced:     "bg-destructive/20 text-destructive",
};

// Empty forms
const emptyWorkout = {
  title: "", description: "", level: "Débutant", type: "Full Body",
  duration: 45, isPremium: false, isPublic: true, exercises: [],
};
const emptyRoutine = {
  title: { en: "", fr: "" }, description: { en: "", fr: "" },
  level: "Beginner", duration: "45 min", daysPerWeek: 3,
  focus: [], exercises: 8, isPremium: false, isPublic: true, order: 0,
};
const emptyProgram = {
  slug: "", title: { en: "", fr: "" }, description: { en: "", fr: "" },
  level: "Beginner", goal: "General Fitness", weeks: 4, daysPerWeek: 3,
  sessionDuration: "45 min", focus: [], equipment: [],
  isPremium: false, isPublic: true, order: 0, schedule: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// MUSCLE VIDEO EDITOR (inline sub-component)
// ─────────────────────────────────────────────────────────────────────────────
const VideoEditor = ({ muscleId, exercise, onSaved }: { muscleId: number; exercise: any; onSaved: () => void }) => {
  const [open, setOpen]       = useState(false);
  const [gender, setGender]   = useState<"male" | "female" | "both">("male");
  const [front, setFront]     = useState("");
  const [side, setSide]       = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const openForGender = (g: "male" | "female") => {
    setGender(g);
    setFront(exercise.videos?.[g]?.front || "");
    setSide(exercise.videos?.[g]?.side   || "");
    setError(null); setSuccess(false);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true); setError(null); setSuccess(false);
    try {
      await adminService.updateExerciseVideos(muscleId, exercise.exerciseId, { gender, front, side });
      setSuccess(true);
      setTimeout(() => { setOpen(false); onSaved(); }, 800);
    } catch (e: any) { setError(String(e)); }
    finally { setSaving(false); }
  };

  return (
    <>
      {/* Per-gender edit buttons */}
      <div className="flex gap-1.5 mt-2">
        {(["male", "female"] as const).map((g) => {
          const hasFront = !!exercise.videos?.[g]?.front;
          const hasSide  = !!exercise.videos?.[g]?.side;
          const hasAny   = hasFront || hasSide;
          return (
            <button
              key={g}
              onClick={() => openForGender(g)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors ${
                hasAny
                  ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                  : "border-border text-muted-foreground/50 hover:border-muted-foreground/50"
              }`}
            >
              <Video className="h-3 w-3" />
              <span className="capitalize">{g}</span>
              {hasAny
                ? <Check className="h-3 w-3 text-primary" />
                : <X className="h-3 w-3 text-muted-foreground/40" />}
            </button>
          );
        })}
      </div>

      {/* Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Videos — {exercise.name?.en}</DialogTitle>
            <DialogDescription>Set the front and side video/GIF URLs for this exercise.</DialogDescription>
          </DialogHeader>

          {error   && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert className="border-primary/30 bg-primary/10 text-primary"><Check className="h-4 w-4" /><AlertDescription>Saved!</AlertDescription></Alert>}

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v: any) => {
                setGender(v);
                if (v !== "both") {
                  setFront(exercise.videos?.[v]?.front || "");
                  setSide(exercise.videos?.[v]?.side   || "");
                }
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male only</SelectItem>
                  <SelectItem value="female">Female only</SelectItem>
                  <SelectItem value="both">Both (same URLs)</SelectItem>
                </SelectContent>
              </Select>
              {gender !== "both" && (
                <p className="text-xs text-muted-foreground">
                  Current {gender} front: <span className="font-mono">{exercise.videos?.[gender]?.front || "—"}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Front URL <span className="text-xs text-muted-foreground">(.gif, .mp4, or image)</span></Label>
              <Input value={front} onChange={(e) => setFront(e.target.value)} placeholder="https://… or /Images/…" />
              {front && (
                <div className="mt-1 rounded-md overflow-hidden border border-border/50 bg-muted/30 max-h-32">
                  {front.endsWith(".mp4") || front.endsWith(".webm")
                    ? <video src={front} className="w-full max-h-32 object-contain" autoPlay loop muted playsInline />
                    : <img src={front} alt="front preview" className="w-full max-h-32 object-contain" />
                  }
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label>Side URL <span className="text-xs text-muted-foreground">(.gif, .mp4, or image)</span></Label>
              <Input value={side} onChange={(e) => setSide(e.target.value)} placeholder="https://… or /Images/…" />
              {side && (
                <div className="mt-1 rounded-md overflow-hidden border border-border/50 bg-muted/30 max-h-32">
                  {side.endsWith(".mp4") || side.endsWith(".webm")
                    ? <video src={side} className="w-full max-h-32 object-contain" autoPlay loop muted playsInline />
                    : <img src={side} alt="side preview" className="w-full max-h-32 object-contain" />
                  }
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Videos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

// ─── ExercisePicker ───────────────────────────────────────────────────────────
interface FlatExercise {
  exerciseId: number;
  muscleName: string;
  name:       string; // en
}

const ExercisePicker = ({
  value,
  onChange,
  allExercises,
}: {
  value: number | null;
  onChange: (ex: FlatExercise) => void;
  allExercises: FlatExercise[];
}) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const containerRef      = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allExercises.slice(0, 60);
    return allExercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(q) ||
        ex.muscleName.toLowerCase().includes(q) ||
        String(ex.exerciseId).includes(q)
    ).slice(0, 60);
  }, [query, allExercises]);

  const selected = value ? allExercises.find((ex) => ex.exerciseId === value) : null;

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-left"
      >
        {selected ? (
          <span className="truncate">
            <span className="font-medium">{selected.name}</span>
            <span className="text-muted-foreground ml-1 text-xs">#{selected.exerciseId} · {selected.muscleName}</span>
          </span>
        ) : allExercises.length === 0 ? (
          <span className="text-muted-foreground flex items-center gap-1.5">
            <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Loading exercises…
          </span>
        ) : (
          <span className="text-muted-foreground">Search exercise…</span>
        )}
        <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[280px] rounded-md border bg-popover shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
            <svg className="h-4 w-4 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, muscle or ID…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No exercises found.</p>
            ) : (
              filtered.map((ex) => (
                <button
                  key={ex.exerciseId}
                  type="button"
                  onClick={() => { onChange(ex); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left ${value === ex.exerciseId ? "bg-primary/10 text-primary font-medium" : ""}`}
                >
                  <span className="truncate">{ex.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">#{ex.exerciseId} · {ex.muscleName}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  // Stats
  const [stats, setStats]               = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Subscriptions
  const [subscriptions, setSubs]           = useState<any[]>([]);
  const [subsLoading, setSubsLoading]       = useState(false);
  const [subsError, setSubsError]           = useState<any>(null);
  const [subSearch, setSubSearch]           = useState("");
  const [statusFilter, setStatusFilter]     = useState("all");
  const [planFilter, setPlanFilter]         = useState("all");
  const [editSubModal, setEditSubModal]     = useState(false);
  const [editingSub, setEditingSub]         = useState<any>(null);
  const [editSubForm, setEditSubForm]       = useState({ plan: "", status: "" });
  const [editSubLoading, setEditSubLoading] = useState(false);
  const [editSubError, setEditSubError]     = useState<any>(null);

  // Workouts
  const [workouts, setWorkouts]                 = useState<any[]>([]);
  const [workoutsLoading, setWorkoutsLoading]   = useState(false);
  const [workoutsError, setWorkoutsError]       = useState<any>(null);
  const [workoutSearch, setWorkoutSearch]       = useState("");
  const [workoutModal, setWorkoutModal]         = useState(false);
  const [editingWorkout, setEditingWorkout]     = useState<any>(null);
  const [workoutForm, setWorkoutForm]           = useState<any>(emptyWorkout);
  const [workoutSaving, setWorkoutSaving]       = useState(false);
  const [workoutError, setWorkoutError]         = useState<any>(null);

  // Routines
  const [routines, setRoutines]                 = useState<any[]>([]);
  const [routinesLoading, setRoutinesLoading]   = useState(false);
  const [routinesError, setRoutinesError]       = useState<any>(null);
  const [routineSearch, setRoutineSearch]       = useState("");
  const [routineModal, setRoutineModal]         = useState(false);
  const [editingRoutine, setEditingRoutine]     = useState<any>(null);
  const [routineForm, setRoutineForm]           = useState<any>(emptyRoutine);
  const [routineSaving, setRoutineSaving]       = useState(false);
  const [routineError, setRoutineError]         = useState<any>(null);

  // Programs
  const [programs, setPrograms]                 = useState<any[]>([]);
  const [programsLoading, setProgramsLoading]   = useState(false);
  const [programsError, setProgramsError]       = useState<any>(null);
  const [programSearch, setProgramSearch]       = useState("");
  const [programModal, setProgramModal]         = useState(false);
  const [editingProgram, setEditingProgram]     = useState<any>(null);
  const [programForm, setProgramForm]           = useState<any>(emptyProgram);
  const [programSaving, setProgramSaving]       = useState(false);
  const [programError, setProgramError]         = useState<any>(null);
  // Raw JSON text for the schedule editor, kept separate so invalid JSON
  // doesn't destroy what the admin is mid-way through typing.
  const [scheduleText, setScheduleText]         = useState("[]");
  const [scheduleJsonError, setScheduleJsonError] = useState<string | null>(null);

  // Muscle exercises
  const [muscles, setMuscles]                   = useState<any[]>([]);
  const [musclesLoading, setMusclesLoading]     = useState(false);
  const [musclesError, setMusclesError]         = useState<any>(null);
  const [muscleSearch, setMuscleSearch]         = useState("");
  const [expandedMuscles, setExpandedMuscles]   = useState<Set<number>>(new Set());
  const [togglingEx, setTogglingEx]             = useState<string | null>(null);
  const [allExercises, setAllExercises]         = useState<FlatExercise[]>([]);

  // Exercise modal
  const emptyExForm = {
    exerciseId: "", name: { en: "", fr: "" }, difficulty: "Beginner",
    videos: { male: { front: "", side: "" }, female: { front: "", side: "" } },
    steps: { en: "", fr: "" },
  };
  const [exModal, setExModal]                   = useState(false);
  const [exModalMuscle, setExModalMuscle]       = useState<any>(null);
  const [editingExercise, setEditingExercise]   = useState<any>(null);
  const [exForm, setExForm]                     = useState<any>(emptyExForm);
  const [exSaving, setExSaving]                 = useState(false);
  const [exError, setExError]                   = useState<string | null>(null);

  // ─── Fetchers ───────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try { setStats(await adminService.getDashboardStats()); }
    catch { /* silent */ }
    finally { setStatsLoading(false); }
  }, []);

  const fetchSubs = useCallback(async () => {
    setSubsLoading(true); setSubsError(null);
    try { setSubs(await adminService.getAllSubscriptions({ status: statusFilter, plan: planFilter })); }
    catch (e) { setSubsError(e); }
    finally { setSubsLoading(false); }
  }, [statusFilter, planFilter]);

  const fetchWorkouts = useCallback(async () => {
    setWorkoutsLoading(true); setWorkoutsError(null);
    try { const r = await adminService.getWorkouts({ search: workoutSearch, limit: 50 }); setWorkouts(r.data || []); }
    catch (e) { setWorkoutsError(e); }
    finally { setWorkoutsLoading(false); }
  }, [workoutSearch]);

  const fetchRoutines = useCallback(async () => {
    setRoutinesLoading(true); setRoutinesError(null);
    try { const r = await adminService.getRoutines({ search: routineSearch, limit: 50 }); setRoutines(r.data || []); }
    catch (e) { setRoutinesError(e); }
    finally { setRoutinesLoading(false); }
  }, [routineSearch]);

  const fetchPrograms = useCallback(async () => {
    setProgramsLoading(true); setProgramsError(null);
    try { const r = await adminService.getPrograms({ search: programSearch, limit: 50 }); setPrograms(r.data || []); }
    catch (e) { setProgramsError(e); }
    finally { setProgramsLoading(false); }
  }, [programSearch]);

  const fetchMuscles = useCallback(async () => {
    setMusclesLoading(true); setMusclesError(null);
    try {
      const data = await adminService.getMuscleExercises();
      setMuscles(data);
      const flat: FlatExercise[] = [];
      (data || []).forEach((m: any) => {
        (m.exercises || []).forEach((ex: any) => {
          flat.push({ exerciseId: ex.exerciseId, muscleName: m.name?.en || "", name: ex.name?.en || "" });
        });
      });
      flat.sort((a, b) => a.name.localeCompare(b.name));
      setAllExercises(flat);
    }
    catch (e) { setMusclesError(e); }
    finally { setMusclesLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchMuscles(); }, [fetchMuscles]);
  useEffect(() => { if (activeTab === "subscriptions") fetchSubs(); }, [activeTab, fetchSubs]);
  useEffect(() => { if (activeTab === "workouts")      fetchWorkouts(); }, [activeTab, fetchWorkouts]);
  useEffect(() => { if (activeTab === "routines")      fetchRoutines(); }, [activeTab, fetchRoutines]);
  useEffect(() => { if (activeTab === "programs")      fetchPrograms(); }, [activeTab, fetchPrograms]);

  // ─── Subscription handlers ──────────────────────────────────────────────────
  const openEditSub = (sub: any) => {
    setEditingSub(sub); setEditSubForm({ plan: sub.plan, status: sub.status });
    setEditSubError(null); setEditSubModal(true);
  };
  const saveSubEdit = async () => {
    if (!editingSub) return;
    setEditSubLoading(true); setEditSubError(null);
    try {
      await adminService.updateUserSubscription(editingSub.user._id, editSubForm);
      await fetchSubs(); await fetchStats(); setEditSubModal(false);
    } catch (e) { setEditSubError(e); }
    finally { setEditSubLoading(false); }
  };
  const handleCancelSub = async (userId: string) => {
    if (!window.confirm(t("admin.confirmCancel"))) return;
    try { await subscriptionService.cancelSubscription(userId); fetchSubs(); fetchStats(); }
    catch (e) { alert(e); }
  };
  const filteredSubs = subscriptions.filter((sub) => {
    const s = subSearch.toLowerCase();
    return (sub.user?.email || "").toLowerCase().includes(s) || (sub.user?.name || "").toLowerCase().includes(s);
  });

  // ─── Workout handlers ───────────────────────────────────────────────────────
  const openWorkoutModal = (w: any = null) => {
    setEditingWorkout(w);
    setWorkoutForm(w ? { ...w } : { ...emptyWorkout });
    setWorkoutError(null); setWorkoutModal(true);
  };
  const saveWorkout = async () => {
    setWorkoutSaving(true); setWorkoutError(null);
    try {
      if (editingWorkout) await adminService.updateWorkout(editingWorkout._id, workoutForm);
      else await adminService.createWorkout(workoutForm);
      setWorkoutModal(false); fetchWorkouts(); fetchStats();
    } catch (e) { setWorkoutError(e); }
    finally { setWorkoutSaving(false); }
  };
  const handleDeleteWorkout = async (id: string) => {
    if (!window.confirm("Delete this workout?")) return;
    try { await adminService.deleteWorkout(id); fetchWorkouts(); fetchStats(); }
    catch (e) { alert(e); }
  };
  const filteredWorkouts = workouts.filter((w) => w.title?.toLowerCase().includes(workoutSearch.toLowerCase()));

  // ─── Routine handlers ───────────────────────────────────────────────────────
  const openRoutineModal = (r: any = null) => {
    setEditingRoutine(r);
    setRoutineForm(r ? { ...r } : { ...emptyRoutine });
    setRoutineError(null); setRoutineModal(true);
  };
  const saveRoutine = async () => {
    setRoutineSaving(true); setRoutineError(null);
    try {
      if (editingRoutine) await adminService.updateRoutine(editingRoutine._id, routineForm);
      else await adminService.createRoutine(routineForm);
      setRoutineModal(false); fetchRoutines(); fetchStats();
    } catch (e) { setRoutineError(e); }
    finally { setRoutineSaving(false); }
  };
  const handleDeleteRoutine = async (id: string) => {
    if (!window.confirm("Delete this routine?")) return;
    try { await adminService.deleteRoutine(id); fetchRoutines(); fetchStats(); }
    catch (e) { alert(e); }
  };

  // ─── Program handlers ───────────────────────────────────────────────────────
  const openProgramModal = (p: any = null) => {
    setEditingProgram(p);
    setProgramForm(p ? { ...p } : { ...emptyProgram });
    setScheduleText(JSON.stringify(p?.schedule ?? [], null, 2));
    setScheduleJsonError(null);
    setProgramError(null); setProgramModal(true);
  };

  const onScheduleTextChange = (text: string) => {
    setScheduleText(text);
    if (!text.trim()) { setScheduleJsonError(null); return; }
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) { setScheduleJsonError("Schedule must be an array of weeks."); return; }
      setScheduleJsonError(null);
    } catch (err: any) {
      setScheduleJsonError(err.message);
    }
  };

  const saveProgram = async () => {
    // Parse the schedule fresh at save time — the textarea is the source of truth.
    let schedule: any[] = [];
    if (scheduleText.trim()) {
      try {
        schedule = JSON.parse(scheduleText);
        if (!Array.isArray(schedule)) throw new Error("Schedule must be an array of weeks.");
      } catch (err: any) {
        setScheduleJsonError(err.message);
        setProgramError("Fix the schedule JSON before saving.");
        return;
      }
    }

    setProgramSaving(true); setProgramError(null);
    const payload = { ...programForm, schedule };
    try {
      if (editingProgram) await adminService.updateProgram(editingProgram._id, payload);
      else await adminService.createProgram(payload);
      setProgramModal(false); fetchPrograms(); fetchStats();
    } catch (e) { setProgramError(e); }
    finally { setProgramSaving(false); }
  };

  const handleDeleteProgram = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? Every user's progress on this program will be deleted too.`)) return;
    try { await adminService.deleteProgram(id); fetchPrograms(); fetchStats(); }
    catch (e) { alert(e); }
  };

  const filteredPrograms = programs.filter((p) =>
    [p.title?.en, p.title?.fr, p.slug].filter(Boolean).join(" ").toLowerCase().includes(programSearch.toLowerCase())
  );
  const filteredRoutines = routines.filter((r) =>
    (r.title?.en || "").toLowerCase().includes(routineSearch.toLowerCase()) ||
    (r.title?.fr || "").toLowerCase().includes(routineSearch.toLowerCase())
  );

  // ─── Muscle exercise handlers ───────────────────────────────────────────────
  const toggleMuscleOpen = (muscleId: number) => {
    setExpandedMuscles((prev) => {
      const next = new Set(prev);
      next.has(muscleId) ? next.delete(muscleId) : next.add(muscleId);
      return next;
    });
  };

  const handleToggleExercise = async (muscleId: number, exerciseId: number, isActive: boolean) => {
    const key = `${muscleId}-${exerciseId}`;
    setTogglingEx(key);
    try {
      await adminService.toggleExerciseActive(muscleId, exerciseId, isActive);
      setMuscles((prev) => prev.map((m) => {
        if (m.muscleId !== muscleId) return m;
        return {
          ...m,
          exercises: m.exercises.map((ex: any) =>
            ex.exerciseId === exerciseId ? { ...ex, isActive } : ex
          ),
        };
      }));
    } catch (e) { alert(e); }
    finally { setTogglingEx(null); }
  };

  // ─── Exercise modal handlers ────────────────────────────────────────────────
  const openAddExercise = (muscle: any) => {
    setExModalMuscle(muscle); setEditingExercise(null);
    setExForm({ ...emptyExForm, exerciseId: "" }); setExError(null); setExModal(true);
  };

  const openEditExercise = (muscle: any, ex: any) => {
    setExModalMuscle(muscle); setEditingExercise(ex);
    setExForm({
      exerciseId: ex.exerciseId,
      name:       { en: ex.name?.en || "", fr: ex.name?.fr || "" },
      difficulty: ex.difficulty || "Beginner",
      videos: {
        male:   { front: ex.videos?.male?.front   || "", side: ex.videos?.male?.side   || "" },
        female: { front: ex.videos?.female?.front || "", side: ex.videos?.female?.side || "" },
      },
      steps: { en: (ex.steps?.en || []).join("\n"), fr: (ex.steps?.fr || []).join("\n") },
    });
    setExError(null); setExModal(true);
  };

  const saveExercise = async () => {
    if (!exModalMuscle) return;
    setExSaving(true); setExError(null);
    try {
      const payload = {
        exerciseId: Number(exForm.exerciseId),
        name:       exForm.name,
        difficulty: exForm.difficulty,
        videos:     exForm.videos,
        steps: {
          en: exForm.steps.en.split("\n").map((s: string) => s.trim()).filter(Boolean),
          fr: exForm.steps.fr.split("\n").map((s: string) => s.trim()).filter(Boolean),
        },
      };
      if (editingExercise) await adminService.updateExercise(exModalMuscle.muscleId, editingExercise.exerciseId, payload);
      else                 await adminService.addExercise(exModalMuscle.muscleId, payload);
      setExModal(false); await fetchMuscles();
    } catch (e: any) { setExError(String(e)); }
    finally { setExSaving(false); }
  };

  const handleDeleteExercise = async (muscleId: number, exerciseId: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await adminService.deleteExercise(muscleId, exerciseId); await fetchMuscles(); }
    catch (e: any) { alert(e); }
  };

  const filteredMuscles = muscles.filter((m) =>
    m.name?.en?.toLowerCase().includes(muscleSearch.toLowerCase()) ||
    m.name?.fr?.toLowerCase().includes(muscleSearch.toLowerCase())
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t("admin.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("admin.subtitle")}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t("admin.totalUsers"),          icon: Users,      value: stats?.totalUsers },
            { label: t("admin.activeSubscriptions"), icon: CreditCard, value: stats?.activeSubscriptions },
            { label: t("admin.monthlyRevenue"),      icon: TrendingUp, value: stats ? `$${stats.monthlyRevenue}` : null },
            { label: "Exercises in DB",              icon: Dumbbell,   value: stats?.totalExercises },
          ].map(({ label, icon: Icon, value }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground/60" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" /> : (value ?? "–")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">     <Activity   className="mr-1 h-4 w-4" />Overview</TabsTrigger>
            <TabsTrigger value="subscriptions"><CreditCard className="mr-1 h-4 w-4" />Subscriptions</TabsTrigger>
            <TabsTrigger value="workouts">     <Dumbbell   className="mr-1 h-4 w-4" />Workouts</TabsTrigger>
            <TabsTrigger value="programs">     <CalendarDays className="mr-1 h-4 w-4" />Programs</TabsTrigger>
            <TabsTrigger value="routines">     <ListChecks className="mr-1 h-4 w-4" />Routines</TabsTrigger>
            <TabsTrigger value="videos">       <Video      className="mr-1 h-4 w-4" />Muscle Videos</TabsTrigger>
          </TabsList>

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Platform Summary</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    ["Total Users",           stats?.totalUsers],
                    ["Active Subscriptions",  stats?.activeSubscriptions],
                    ["Monthly Revenue",       stats ? `$${stats.monthlyRevenue}` : null],
                    ["New Users (30d)",       stats?.recentSignups],
                    ["Total Workouts",        stats?.totalWorkouts],
                    ["Total Routines",        stats?.totalRoutines],
                    ["Total Programs",        stats?.totalPrograms],
                    ["Active Enrollments",    stats?.activeEnrollments],
                    ["Muscle Groups",         stats?.totalMuscleGroups],
                    ["Total Exercises",       stats?.totalExercises],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between border-b border-border pb-2 last:border-0">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{statsLoading ? "…" : (val ?? "–")}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Subscriptions by Plan</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {stats?.subscriptionsByPlan?.map((item: any) => (
                    <div key={item._id} className="flex justify-between border-b border-border pb-2">
                      <Badge variant="outline" className="capitalize">{item._id || "free"}</Badge>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  )) ?? <span className="text-muted-foreground/60">Loading…</span>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── SUBSCRIPTIONS ────────────────────────────────────────────── */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>{t("admin.subscriptionRecords")}</CardTitle>
                <CardDescription>{t("admin.manageSubscriptions")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder={t("admin.searchPlaceholder")} value={subSearch} onChange={(e) => setSubSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["all","active","cancelled","expired"].map((v) => <SelectItem key={v} value={v}>{v === "all" ? "All Status" : v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["all","free","pro","premium"].map((v) => <SelectItem key={v} value={v}>{v === "all" ? "All Plans" : v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {subsError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{subsError}</AlertDescription></Alert>}
                <div className="rounded-md border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b border-border">
                      <tr>{["User","Plan","Status","Start","End","Amount",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {subsLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" /></td></tr>
                      ) : filteredSubs.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-muted-foreground/60">No subscriptions found</td></tr>
                      ) : filteredSubs.map((sub) => (
                        <tr key={sub._id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="font-medium">{sub.user?.name}</div>
                            <div className="text-xs text-muted-foreground/60">{sub.user?.email}</div>
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{sub.plan}</Badge></td>
                          <td className="px-4 py-3">
                            <Badge className={
                              sub.status === "active"  ? "bg-primary/20 text-primary" :
                              sub.status === "expired" ? "bg-destructive/20 text-destructive" :
                                                         "bg-secondary text-muted-foreground"
                            }>{sub.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(sub.createdAt)}</td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(sub.endDate)}</td>
                          <td className="px-4 py-3 font-medium">{sub.amount}</td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditSub(sub)}>Edit Subscription</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleCancelSub(sub.user?._id)}>Cancel Subscription</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── WORKOUTS ─────────────────────────────────────────────────── */}
          <TabsContent value="workouts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Workout Programs</CardTitle><CardDescription>Create and manage all platform workouts</CardDescription></div>
                <Button onClick={() => openWorkoutModal()}><Plus className="mr-1 h-4 w-4" />Add Workout</Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input placeholder="Search workouts…" value={workoutSearch} onChange={(e) => setWorkoutSearch(e.target.value)} className="pl-9" />
                </div>
                {workoutsError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{workoutsError}</AlertDescription></Alert>}
                <div className="rounded-md border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b border-border">
                      <tr>{["Title","Level","Type","Duration","Premium","Public",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {workoutsLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" /></td></tr>
                      ) : filteredWorkouts.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-muted-foreground/60">No workouts. Click "Add Workout" to create one.</td></tr>
                      ) : filteredWorkouts.map((w) => (
                        <tr key={w._id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="font-medium">{w.title}</div>
                            {w.exercises?.length > 0 && <div className="text-xs text-muted-foreground/60">{w.exercises.length} exercises linked</div>}
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline">{w.level}</Badge></td>
                          <td className="px-4 py-3 text-muted-foreground">{w.type}</td>
                          <td className="px-4 py-3 text-muted-foreground">{w.duration} min</td>
                          <td className="px-4 py-3">{w.isPremium ? <Badge className="bg-accent/20 text-accent">Yes</Badge> : <span className="text-muted-foreground/50">—</span>}</td>
                          <td className="px-4 py-3">{w.isPublic ? <Badge className="bg-primary/20 text-primary">Public</Badge> : <Badge variant="secondary">Private</Badge>}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openWorkoutModal(w)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteWorkout(w._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── ROUTINES ─────────────────────────────────────────────────── */}
          {/* ── PROGRAMS ──────────────────────────────────────────────────── */}
          <TabsContent value="programs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Workout Programs</CardTitle>
                  <CardDescription>Multi-week plans users enroll in and track. Premium programs show week 1 as a preview to free users.</CardDescription>
                </div>
                <Button onClick={() => openProgramModal()}><Plus className="mr-1 h-4 w-4" />Add Program</Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input placeholder="Search programs…" value={programSearch} onChange={(e) => setProgramSearch(e.target.value)} className="pl-9" />
                </div>
                {programsError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{String(programsError)}</AlertDescription></Alert>}
                <div className="rounded-md border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b border-border">
                      <tr>{["Title (EN / FR)","Slug","Level","Weeks","Days/wk","Sessions","Access","Enrolled",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {programsLoading ? (
                        <tr><td colSpan={9} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" /></td></tr>
                      ) : filteredPrograms.length === 0 ? (
                        <tr><td colSpan={9} className="text-center py-8 text-muted-foreground/60">No programs. Click "Add Program".</td></tr>
                      ) : filteredPrograms.map((p) => {
                        const incomplete = p.scheduledWeeks < p.weeks;
                        return (
                          <tr key={p._id} className="hover:bg-muted/30">
                            <td className="px-4 py-3">
                              <div className="font-medium">{p.title?.en}</div>
                              <div className="text-xs text-muted-foreground/50">{p.title?.fr}</div>
                            </td>
                            <td className="px-4 py-3"><code className="text-xs text-muted-foreground">{p.slug}</code></td>
                            <td className="px-4 py-3"><Badge variant="outline">{p.level}</Badge></td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {p.scheduledWeeks}/{p.weeks}
                              {incomplete && <span className="ml-1 text-xs text-destructive" title="Schedule covers fewer weeks than advertised">!</span>}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{p.daysPerWeek}</td>
                            <td className="px-4 py-3 text-muted-foreground">{p.totalTrainingDays}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {p.isPremium
                                  ? <Badge className="bg-accent/20 text-accent"><Lock className="mr-1 h-3 w-3" />Pro</Badge>
                                  : <Badge variant="secondary">Free</Badge>}
                                {!p.isPublic && <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{p.enrollments ?? 0}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openProgramModal(p)}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProgram(p._id, p.title?.en || p.slug)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routines">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Workout Routines</CardTitle><CardDescription>Legacy cards, superseded by Programs. Kept so existing data stays reachable.</CardDescription></div>
                <Button onClick={() => openRoutineModal()}><Plus className="mr-1 h-4 w-4" />Add Routine</Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input placeholder="Search routines…" value={routineSearch} onChange={(e) => setRoutineSearch(e.target.value)} className="pl-9" />
                </div>
                {routinesError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{routinesError}</AlertDescription></Alert>}
                <div className="rounded-md border border-border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b border-border">
                      <tr>{["Title (EN / FR)","Level","Duration","Days/wk","Exercises","Public",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {routinesLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground/60" /></td></tr>
                      ) : filteredRoutines.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-muted-foreground/60">No routines. Click "Add Routine".</td></tr>
                      ) : filteredRoutines.map((r) => (
                        <tr key={r._id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="font-medium">{r.title?.en}</div>
                            <div className="text-xs text-muted-foreground/50">{r.title?.fr}</div>
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline">{r.level}</Badge></td>
                          <td className="px-4 py-3 text-muted-foreground">{r.duration}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.daysPerWeek}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.exercises}</td>
                          <td className="px-4 py-3">{r.isPublic ? <Badge className="bg-primary/20 text-primary">Public</Badge> : <Badge variant="secondary">Private</Badge>}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openRoutineModal(r)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteRoutine(r._id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── MUSCLE VIDEOS ─────────────────────────────────────────────── */}
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Muscle Tutorial Videos</CardTitle>
                <CardDescription>
                  Browse every muscle group. Expand to see exercises, add new ones, and edit their male/female video URLs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder="Search muscle groups…" value={muscleSearch} onChange={(e) => setMuscleSearch(e.target.value)} className="pl-9" />
                  </div>
                  {musclesLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60 self-center" />}
                </div>

                {musclesError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{String(musclesError)}</AlertDescription></Alert>}

                {!musclesLoading && muscles.length === 0 && (
                  <div className="text-center py-16 space-y-3">
                    <Video className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                    <p className="text-muted-foreground">No muscle data in database.</p>
                    <p className="text-sm text-muted-foreground/60">The database will be seeded automatically on next server start.</p>
                  </div>
                )}

                <div className="space-y-2">
                  {filteredMuscles.map((muscle) => {
                    const isOpen   = expandedMuscles.has(muscle.muscleId);
                    const totalEx  = muscle.exercises?.length || 0;
                    const activeEx = muscle.exercises?.filter((e: any) => e.isActive).length || 0;
                    return (
                      <Collapsible key={muscle.muscleId} open={isOpen} onOpenChange={() => toggleMuscleOpen(muscle.muscleId)}>
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-card border border-border hover:bg-muted/30 transition-colors text-left">
                            <div className="flex items-center gap-3">
                              {isOpen
                                ? <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
                                : <ChevronRight className="h-4 w-4 text-muted-foreground/60" />}
                              <span className="font-semibold">{muscle.name?.en}</span>
                              <span className="text-xs text-muted-foreground/50">/ {muscle.name?.fr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{activeEx}/{totalEx} active</Badge>
                              <Badge variant="secondary" className="text-xs">ID {muscle.muscleId}</Badge>
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="ml-4 mt-1 space-y-2 pb-3">

                            {totalEx === 0 && (
                              <p className="text-xs text-muted-foreground/60 px-4 py-2 italic">No exercises yet.</p>
                            )}

                            {muscle.exercises?.map((ex: any) => {
                              const key        = `${muscle.muscleId}-${ex.exerciseId}`;
                              const isToggling = togglingEx === key;
                              const mF = ex.videos?.male?.front;
                              const mS = ex.videos?.male?.side;
                              const fF = ex.videos?.female?.front;
                              const fS = ex.videos?.female?.side;
                              return (
                                <div
                                  key={ex.exerciseId}
                                  className={`rounded-lg border p-3 transition-opacity ${
                                    ex.isActive
                                      ? "bg-card border-border"
                                      : "bg-secondary/30 border-dashed border-border opacity-60"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    {/* Left: exercise info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">{ex.name?.en}</span>
                                        <span className="text-xs text-muted-foreground/50">/ {ex.name?.fr}</span>
                                        <Badge className={`text-xs ${diffColor[ex.difficulty] || "bg-secondary text-muted-foreground"}`}>{ex.difficulty}</Badge>
                                        <span className="text-xs text-muted-foreground/50">ID: {ex.exerciseId}</span>
                                      </div>

                                      {/* Video status pills */}
                                      <div className="flex gap-2 mt-1.5 flex-wrap">
                                        {([["male", mF, mS], ["female", fF, fS]] as [string,string,string][]).map(([g, front, side]) => (
                                          <span key={g} className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                                            front||side
                                              ? "border-primary/30 bg-primary/10 text-primary"
                                              : "border-border text-muted-foreground/50"
                                          }`}>
                                            {g}: {front ? "front✓" : "front✗"} {side ? "side✓" : "side✗"}
                                          </span>
                                        ))}
                                      </div>

                                      {/* Video edit buttons */}
                                      <VideoEditor muscleId={muscle.muscleId} exercise={ex} onSaved={fetchMuscles} />
                                    </div>

                                    {/* Right: actions */}
                                    <div className="flex flex-col gap-1 shrink-0">
                                      <button
                                        onClick={() => openEditExercise(muscle, ex)}
                                        className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-border text-muted-foreground hover:bg-muted/30 transition-colors"
                                        title="Edit this exercise"
                                      >
                                        <Pencil className="h-3 w-3" /> Edit
                                      </button>

                                      <button
                                        disabled={isToggling}
                                        onClick={() => handleToggleExercise(muscle.muscleId, ex.exerciseId, !ex.isActive)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                                          ex.isActive
                                            ? "border-primary/30 text-primary bg-primary/10 hover:bg-primary/20"
                                            : "border-border text-muted-foreground bg-card hover:bg-muted/30"
                                        }`}
                                      >
                                        {isToggling
                                          ? <Loader2 className="h-3 w-3 animate-spin" />
                                          : ex.isActive
                                            ? <><Eye className="h-3 w-3" /> Visible</>
                                            : <><EyeOff className="h-3 w-3" /> Hidden</>
                                        }
                                      </button>

                                      <button
                                        onClick={() => handleDeleteExercise(muscle.muscleId, ex.exerciseId, ex.name?.en)}
                                        className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                                        title="Delete exercise"
                                      >
                                        <Trash2 className="h-3 w-3" /> Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <button
                              onClick={() => openAddExercise(muscle)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-primary/30 text-primary/70 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                            >
                              <Plus className="h-4 w-4" />
                              Add Exercise to {muscle.name?.en}
                            </button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── EDIT SUBSCRIPTION MODAL ──────────────────────────────────────── */}
      <Dialog open={editSubModal} onOpenChange={setEditSubModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.editTitle")}</DialogTitle>
            <DialogDescription>Update plan and status for {editingSub?.user?.name}</DialogDescription>
          </DialogHeader>
          {editSubError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{editSubError}</AlertDescription></Alert>}
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Plan</Label>
              <Select value={editSubForm.plan} onValueChange={(v) => setEditSubForm((p) => ({ ...p, plan: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["free","pro","premium"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={editSubForm.status} onValueChange={(v) => setEditSubForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["active","cancelled","expired"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSubModal(false)} disabled={editSubLoading}>Cancel</Button>
            <Button onClick={saveSubEdit} disabled={editSubLoading}>
              {editSubLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── WORKOUT MODAL ────────────────────────────────────────────────── */}
      <Dialog open={workoutModal} onOpenChange={setWorkoutModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingWorkout ? "Edit Workout" : "Create Workout"}</DialogTitle>
            <DialogDescription>Each exercise in a workout can reference a muscle exercise ID to link to the video tutorials.</DialogDescription>
          </DialogHeader>
          {workoutError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{workoutError}</AlertDescription></Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="md:col-span-2 space-y-1"><Label>Title</Label><Input value={workoutForm.title} onChange={(e) => setWorkoutForm((p: any) => ({ ...p, title: e.target.value }))} placeholder="e.g. Full Body Strength" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description</Label><Textarea rows={2} value={workoutForm.description} onChange={(e) => setWorkoutForm((p: any) => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>Level</Label>
              <Select value={workoutForm.level} onValueChange={(v) => setWorkoutForm((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Débutant","Intermédiaire","Expert"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={workoutForm.type} onValueChange={(v) => setWorkoutForm((p: any) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Prise de masse","Perte de poids","Endurance","Force","Full Body"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Duration (min)</Label><Input type="number" value={workoutForm.duration} onChange={(e) => setWorkoutForm((p: any) => ({ ...p, duration: Number(e.target.value) }))} /></div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={workoutForm.isPremium} onChange={(e) => setWorkoutForm((p: any) => ({ ...p, isPremium: e.target.checked }))} className="rounded" />Premium</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={workoutForm.isPublic} onChange={(e) => setWorkoutForm((p: any) => ({ ...p, isPublic: e.target.checked }))} className="rounded" />Public</label>
            </div>

            <div className="md:col-span-2 space-y-3">
              <Label>Exercises</Label>
              {(workoutForm.exercises || []).map((ex: any, i: number) => {
                const updateEx = (patch: any) => {
                  const arr = [...workoutForm.exercises];
                  arr[i] = { ...arr[i], ...patch };
                  setWorkoutForm((p: any) => ({ ...p, exercises: arr }));
                };
                return (
                  <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="Sets" value={ex.sets || ""} onChange={(e) => updateEx({ sets: Number(e.target.value) })} className="w-20 text-center" />
                      <span className="text-muted-foreground text-xs">×</span>
                      <Input placeholder="Reps" value={ex.reps || ""} onChange={(e) => updateEx({ reps: e.target.value })} className="w-24 text-center" />
                      <span className="text-xs text-muted-foreground flex-1 pl-1">sets × reps</span>
                      <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => {
                        const arr = workoutForm.exercises.filter((_: any, j: number) => j !== i);
                        setWorkoutForm((p: any) => ({ ...p, exercises: arr }));
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Link to muscle exercise video (optional):</p>
                      <ExercisePicker
                        value={ex.muscleExerciseId || null}
                        allExercises={allExercises}
                        onChange={(picked) => updateEx({ muscleExerciseId: picked.exerciseId, name: ex.name || picked.name })}
                      />
                    </div>
                    <Input placeholder="Exercise name (auto-filled from picker, or type manually)" value={ex.name || ""} onChange={(e) => updateEx({ name: e.target.value })} />
                  </div>
                );
              })}
              <Button variant="outline" size="sm" onClick={() => setWorkoutForm((p: any) => ({ ...p, exercises: [...(p.exercises || []), { name: "", sets: 3, reps: "10", muscleExerciseId: null }] }))}>
                <Plus className="mr-1 h-3 w-3" />Add Exercise
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkoutModal(false)} disabled={workoutSaving}>Cancel</Button>
            <Button onClick={saveWorkout} disabled={workoutSaving}>
              {workoutSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : editingWorkout ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── ROUTINE MODAL ────────────────────────────────────────────────── */}
      <Dialog open={routineModal} onOpenChange={setRoutineModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRoutine ? "Edit Routine" : "Create Routine"}</DialogTitle>
            <DialogDescription>Bilingual routine cards displayed on the public routines page.</DialogDescription>
          </DialogHeader>
          {routineError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{routineError}</AlertDescription></Alert>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1"><Label>Title (English)</Label><Input value={routineForm.title?.en || ""} onChange={(e) => setRoutineForm((p: any) => ({ ...p, title: { ...p.title, en: e.target.value } }))} placeholder="e.g. Full Body Workout" /></div>
            <div className="space-y-1"><Label>Title (French)</Label><Input value={routineForm.title?.fr || ""} onChange={(e) => setRoutineForm((p: any) => ({ ...p, title: { ...p.title, fr: e.target.value } }))} placeholder="e.g. Entraînement corps entier" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (English)</Label><Textarea rows={2} value={routineForm.description?.en || ""} onChange={(e) => setRoutineForm((p: any) => ({ ...p, description: { ...p.description, en: e.target.value } }))} /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (French)</Label><Textarea rows={2} value={routineForm.description?.fr || ""} onChange={(e) => setRoutineForm((p: any) => ({ ...p, description: { ...p.description, fr: e.target.value } }))} /></div>
            <div className="space-y-1">
              <Label>Level</Label>
              <Select value={routineForm.level} onValueChange={(v) => setRoutineForm((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Beginner","Intermediate","Advanced"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Duration</Label><Input value={routineForm.duration} onChange={(e) => setRoutineForm((p: any) => ({ ...p, duration: e.target.value }))} placeholder="45 min" /></div>
            <div className="space-y-1"><Label>Days Per Week</Label><Input type="number" min={1} max={7} value={routineForm.daysPerWeek} onChange={(e) => setRoutineForm((p: any) => ({ ...p, daysPerWeek: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>No. of Exercises</Label><Input type="number" min={1} value={routineForm.exercises} onChange={(e) => setRoutineForm((p: any) => ({ ...p, exercises: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>Focus Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label><Input value={(routineForm.focus || []).join(", ")} onChange={(e) => setRoutineForm((p: any) => ({ ...p, focus: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} placeholder="Strength, Full Body" /></div>
            <div className="space-y-1"><Label>Display Order</Label><Input type="number" value={routineForm.order || 0} onChange={(e) => setRoutineForm((p: any) => ({ ...p, order: Number(e.target.value) }))} /></div>
            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={routineForm.isPremium} onChange={(e) => setRoutineForm((p: any) => ({ ...p, isPremium: e.target.checked }))} className="rounded" />Premium</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={routineForm.isPublic} onChange={(e) => setRoutineForm((p: any) => ({ ...p, isPublic: e.target.checked }))} className="rounded" />Public</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoutineModal(false)} disabled={routineSaving}>Cancel</Button>
            <Button onClick={saveRoutine} disabled={routineSaving}>
              {routineSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : editingRoutine ? "Update Routine" : "Create Routine"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── ADD / EDIT PROGRAM MODAL ──────────────────────────────────────── */}
      <Dialog open={programModal} onOpenChange={setProgramModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProgram ? "Edit Program" : "Create Program"}</DialogTitle>
            <DialogDescription>
              Multi-week plans users enroll in. The schedule drives progress tracking — sessions are counted from non-rest days.
            </DialogDescription>
          </DialogHeader>

          {programError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{String(programError)}</AlertDescription></Alert>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Slug <span className="text-xs text-muted-foreground">(URL, lowercase + hyphens)</span></Label>
              <Input
                value={programForm.slug || ""}
                onChange={(e) => setProgramForm((p: any) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                placeholder="push-pull-legs"
              />
            </div>
            <div className="space-y-1">
              <Label>Goal</Label>
              <Select value={programForm.goal} onValueChange={(v) => setProgramForm((p: any) => ({ ...p, goal: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Build Muscle","Lose Fat","Strength","Endurance","General Fitness"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="space-y-1"><Label>Title (English)</Label><Input value={programForm.title?.en || ""} onChange={(e) => setProgramForm((p: any) => ({ ...p, title: { ...p.title, en: e.target.value } }))} placeholder="Push Pull Legs" /></div>
            <div className="space-y-1"><Label>Title (French)</Label><Input value={programForm.title?.fr || ""} onChange={(e) => setProgramForm((p: any) => ({ ...p, title: { ...p.title, fr: e.target.value } }))} placeholder="Push Pull Legs" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (English)</Label><Textarea rows={2} value={programForm.description?.en || ""} onChange={(e) => setProgramForm((p: any) => ({ ...p, description: { ...p.description, en: e.target.value } }))} /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (French)</Label><Textarea rows={2} value={programForm.description?.fr || ""} onChange={(e) => setProgramForm((p: any) => ({ ...p, description: { ...p.description, fr: e.target.value } }))} /></div>

            <div className="space-y-1">
              <Label>Level</Label>
              <Select value={programForm.level} onValueChange={(v) => setProgramForm((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Beginner","Intermediate","Advanced"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Session Duration</Label><Input value={programForm.sessionDuration || ""} onChange={(e) => setProgramForm((p: any) => ({ ...p, sessionDuration: e.target.value }))} placeholder="45 min" /></div>
            <div className="space-y-1"><Label>Weeks</Label><Input type="number" min={1} max={52} value={programForm.weeks} onChange={(e) => setProgramForm((p: any) => ({ ...p, weeks: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>Days Per Week</Label><Input type="number" min={1} max={7} value={programForm.daysPerWeek} onChange={(e) => setProgramForm((p: any) => ({ ...p, daysPerWeek: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>Focus Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label><Input value={(programForm.focus || []).join(", ")} onChange={(e) => setProgramForm((p: any) => ({ ...p, focus: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} placeholder="Hypertrophy, Split" /></div>
            <div className="space-y-1"><Label>Equipment <span className="text-xs text-muted-foreground">(comma-separated)</span></Label><Input value={(programForm.equipment || []).join(", ")} onChange={(e) => setProgramForm((p: any) => ({ ...p, equipment: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} placeholder="barbell, dumbbells" /></div>
            <div className="space-y-1"><Label>Display Order</Label><Input type="number" value={programForm.order || 0} onChange={(e) => setProgramForm((p: any) => ({ ...p, order: Number(e.target.value) }))} /></div>

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={programForm.isPremium} onChange={(e) => setProgramForm((p: any) => ({ ...p, isPremium: e.target.checked }))} className="rounded" />Premium (Pro only)</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={programForm.isPublic} onChange={(e) => setProgramForm((p: any) => ({ ...p, isPublic: e.target.checked }))} className="rounded" />Public</label>
            </div>

            {/* Schedule editor */}
            <div className="md:col-span-2 space-y-1 pt-2">
              <Label>Schedule <span className="text-xs text-muted-foreground">(JSON — array of weeks)</span></Label>
              <Textarea
                rows={14}
                spellCheck={false}
                value={scheduleText}
                onChange={(e) => onScheduleTextChange(e.target.value)}
                className="font-mono text-xs"
                placeholder={`[\n  {\n    "week": 1,\n    "label": { "en": "Week 1", "fr": "Semaine 1" },\n    "days": [\n      {\n        "day": 1,\n        "isRest": false,\n        "title": { "en": "Push", "fr": "Poussée" },\n        "exercises": [\n          { "name": "Barbell Bench Press", "sets": 4, "reps": "6-8", "rest": 120, "muscleExerciseId": 405 }\n        ]\n      },\n      { "day": 2, "isRest": true, "title": { "en": "Rest", "fr": "Repos" }, "exercises": [] }\n    ]\n  }\n]`}
              />
              {scheduleJsonError
                ? <p className="text-xs text-destructive">Invalid JSON: {scheduleJsonError}</p>
                : <p className="text-xs text-muted-foreground">
                    {(() => {
                      try {
                        const s = JSON.parse(scheduleText || "[]");
                        if (!Array.isArray(s)) return "Schedule must be an array.";
                        const days = s.reduce((sum: number, w: any) => sum + (w.days || []).filter((d: any) => !d.isRest).length, 0);
                        return `${s.length} week(s), ${days} training session(s).`;
                      } catch { return ""; }
                    })()}
                  </p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setProgramModal(false)} disabled={programSaving}>Cancel</Button>
            <Button onClick={saveProgram} disabled={programSaving || Boolean(scheduleJsonError)}>
              {programSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : editingProgram ? "Update Program" : "Create Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── ADD / EDIT EXERCISE MODAL ─────────────────────────────────────── */}
      <Dialog open={exModal} onOpenChange={setExModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? `Edit Exercise — ${editingExercise.name?.en}` : `Add Exercise to ${exModalMuscle?.name?.en}`}
            </DialogTitle>
            <DialogDescription>
              {editingExercise
                ? "Update the exercise details, steps, and video URLs for both genders."
                : "Fill in the exercise details and video URLs. Both male and female videos can be added now or edited later."}
            </DialogDescription>
          </DialogHeader>

          {exError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{exError}</AlertDescription></Alert>}

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Exercise ID <span className="text-xs text-muted-foreground">(unique number)</span></Label>
                <Input type="number" value={exForm.exerciseId} disabled={!!editingExercise} onChange={(e) => setExForm((p: any) => ({ ...p, exerciseId: e.target.value }))} placeholder="e.g. 9999" />
                {!editingExercise && <p className="text-xs text-muted-foreground">Pick any number not already used in this muscle group.</p>}
              </div>
              <div className="space-y-1">
                <Label>Difficulty</Label>
                <Select value={exForm.difficulty} onValueChange={(v) => setExForm((p: any) => ({ ...p, difficulty: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Beginner","Intermediate","Advanced","Novice"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Name (English)</Label>
                <Input value={exForm.name.en} onChange={(e) => setExForm((p: any) => ({ ...p, name: { ...p.name, en: e.target.value } }))} placeholder="e.g. Dumbbell Curl" />
              </div>
              <div className="space-y-1">
                <Label>Name (French)</Label>
                <Input value={exForm.name.fr} onChange={(e) => setExForm((p: any) => ({ ...p, name: { ...p.name, fr: e.target.value } }))} placeholder="e.g. Curl haltères" />
              </div>
            </div>

            {/* Male Videos */}
            <div className="rounded-lg border border-primary/20 p-4 space-y-3 bg-primary/5">
              <p className="text-sm font-semibold text-primary flex items-center gap-2"><Video className="h-4 w-4" /> Male Videos</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Front URL (.gif / .mp4)</Label>
                  <Input value={exForm.videos.male.front} onChange={(e) => setExForm((p: any) => ({ ...p, videos: { ...p.videos, male: { ...p.videos.male, front: e.target.value } } }))} placeholder="/Images/male-exercise-front.gif" />
                  {exForm.videos.male.front && (
                    <div className="mt-1 rounded border border-border overflow-hidden max-h-24 bg-muted/30">
                      {exForm.videos.male.front.endsWith(".mp4")
                        ? <video src={exForm.videos.male.front} className="w-full max-h-24 object-contain" autoPlay loop muted playsInline />
                        : <img src={exForm.videos.male.front} alt="" className="w-full max-h-24 object-contain" />}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Side URL (.gif / .mp4)</Label>
                  <Input value={exForm.videos.male.side} onChange={(e) => setExForm((p: any) => ({ ...p, videos: { ...p.videos, male: { ...p.videos.male, side: e.target.value } } }))} placeholder="/Images/male-exercise-side.gif" />
                  {exForm.videos.male.side && (
                    <div className="mt-1 rounded border border-border overflow-hidden max-h-24 bg-muted/30">
                      {exForm.videos.male.side.endsWith(".mp4")
                        ? <video src={exForm.videos.male.side} className="w-full max-h-24 object-contain" autoPlay loop muted playsInline />
                        : <img src={exForm.videos.male.side} alt="" className="w-full max-h-24 object-contain" />}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Female Videos */}
            <div className="rounded-lg border border-accent/20 p-4 space-y-3 bg-accent/5">
              <p className="text-sm font-semibold text-accent flex items-center gap-2"><Video className="h-4 w-4" /> Female Videos</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Front URL (.gif / .mp4)</Label>
                  <Input value={exForm.videos.female.front} onChange={(e) => setExForm((p: any) => ({ ...p, videos: { ...p.videos, female: { ...p.videos.female, front: e.target.value } } }))} placeholder="https://media.musclewiki.com/…front.mp4" />
                  {exForm.videos.female.front && (
                    <div className="mt-1 rounded border border-border overflow-hidden max-h-24 bg-muted/30">
                      {exForm.videos.female.front.endsWith(".mp4")
                        ? <video src={exForm.videos.female.front} className="w-full max-h-24 object-contain" autoPlay loop muted playsInline />
                        : <img src={exForm.videos.female.front} alt="" className="w-full max-h-24 object-contain" />}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Side URL (.gif / .mp4)</Label>
                  <Input value={exForm.videos.female.side} onChange={(e) => setExForm((p: any) => ({ ...p, videos: { ...p.videos, female: { ...p.videos.female, side: e.target.value } } }))} placeholder="https://media.musclewiki.com/…side.mp4" />
                  {exForm.videos.female.side && (
                    <div className="mt-1 rounded border border-border overflow-hidden max-h-24 bg-muted/30">
                      {exForm.videos.female.side.endsWith(".mp4")
                        ? <video src={exForm.videos.female.side} className="w-full max-h-24 object-contain" autoPlay loop muted playsInline />
                        : <img src={exForm.videos.female.side} alt="" className="w-full max-h-24 object-contain" />}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Steps (English) <span className="text-xs text-muted-foreground">— one step per line</span></Label>
                <Textarea rows={5} value={exForm.steps.en} onChange={(e) => setExForm((p: any) => ({ ...p, steps: { ...p.steps, en: e.target.value } }))} placeholder={"Lay flat on your back.\nLift legs to 90°.\nLower slowly."} />
              </div>
              <div className="space-y-1">
                <Label>Steps (French) <span className="text-xs text-muted-foreground">— une étape par ligne</span></Label>
                <Textarea rows={5} value={exForm.steps.fr} onChange={(e) => setExForm((p: any) => ({ ...p, steps: { ...p.steps, fr: e.target.value } }))} placeholder={"Allongez-vous sur le dos.\nMontez les jambes à 90°.\nRedescendez lentement."} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExModal(false)} disabled={exSaving}>Cancel</Button>
            <Button onClick={saveExercise} disabled={exSaving}>
              {exSaving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</>
                : editingExercise ? "Update Exercise" : "Add Exercise"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
