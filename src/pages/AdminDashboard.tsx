import { useState, useEffect, useCallback } from "react";
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
  ChevronDown, ChevronRight, Eye, EyeOff, Check, X,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { adminService } from "@/services/AdminService";
import { subscriptionService } from "@/services/subscriptionService";
import { useTranslation } from "@/i18n";

// ─── helpers ─────────────────────────────────────────────────────────────────
const formatDate = (d: any) => (d ? new Date(d).toLocaleDateString() : "–");

const diffColor: Record<string, string> = {
  Beginner:     "bg-green-100 text-green-700",
  Intermediate: "bg-orange-100 text-orange-700",
  Advanced:     "bg-red-100 text-red-700",
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

  // When opening, pre-fill from selected gender
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
                  : "border-gray-200 text-gray-400 hover:border-gray-400"
              }`}
            >
              <Video className="h-3 w-3" />
              <span className="capitalize">{g}</span>
              {hasAny ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-gray-300" />}
            </button>
          );
        })}
      </div>

      {/* Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Videos — {exercise.name?.en}</DialogTitle>
            <DialogDescription>
              Set the front and side video/GIF URLs for this exercise.
            </DialogDescription>
          </DialogHeader>

          {error   && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert className="border-green-300 bg-green-50 text-green-800"><Check className="h-4 w-4" /><AlertDescription>Saved!</AlertDescription></Alert>}

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v: any) => {
                setGender(v);
                if (v !== 'both') {
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
              {gender !== 'both' && (
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
                  {front.endsWith('.mp4') || front.endsWith('.webm')
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
                  {side.endsWith('.mp4') || side.endsWith('.webm')
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
const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  // Stats
  const [stats, setStats]             = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Subscriptions
  const [subscriptions, setSubs]     = useState<any[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subsError, setSubsError]     = useState<any>(null);
  const [subSearch, setSubSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter]   = useState("all");
  const [editSubModal, setEditSubModal] = useState(false);
  const [editingSub, setEditingSub]   = useState<any>(null);
  const [editSubForm, setEditSubForm] = useState({ plan: "", status: "" });
  const [editSubLoading, setEditSubLoading] = useState(false);
  const [editSubError, setEditSubError]     = useState<any>(null);

  // Workouts
  const [workouts, setWorkouts]             = useState<any[]>([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);
  const [workoutsError, setWorkoutsError]   = useState<any>(null);
  const [workoutSearch, setWorkoutSearch]   = useState("");
  const [workoutModal, setWorkoutModal]     = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any>(null);
  const [workoutForm, setWorkoutForm]       = useState<any>(emptyWorkout);
  const [workoutSaving, setWorkoutSaving]   = useState(false);
  const [workoutError, setWorkoutError]     = useState<any>(null);

  // Routines
  const [routines, setRoutines]             = useState<any[]>([]);
  const [routinesLoading, setRoutinesLoading] = useState(false);
  const [routinesError, setRoutinesError]   = useState<any>(null);
  const [routineSearch, setRoutineSearch]   = useState("");
  const [routineModal, setRoutineModal]     = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [routineForm, setRoutineForm]       = useState<any>(emptyRoutine);
  const [routineSaving, setRoutineSaving]   = useState(false);
  const [routineError, setRoutineError]     = useState<any>(null);
  // Workout exercise picker for routines
  const [routineExerciseSearch, setRoutineExerciseSearch] = useState("");

  // Muscle exercises
  const [muscles, setMuscles]             = useState<any[]>([]);
  const [musclesLoading, setMusclesLoading] = useState(false);
  const [musclesError, setMusclesError]   = useState<any>(null);
  const [muscleSearch, setMuscleSearch]   = useState("");
  const [expandedMuscles, setExpandedMuscles] = useState<Set<number>>(new Set());
  const [togglingEx, setTogglingEx]       = useState<string | null>(null); // "muscleId-exId"

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

  const fetchMuscles = useCallback(async () => {
    setMusclesLoading(true); setMusclesError(null);
    try { setMuscles(await adminService.getMuscleExercises()); }
    catch (e) { setMusclesError(e); }
    finally { setMusclesLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (activeTab === "subscriptions") fetchSubs(); }, [activeTab, fetchSubs]);
  useEffect(() => { if (activeTab === "workouts")      fetchWorkouts(); }, [activeTab, fetchWorkouts]);
  useEffect(() => { if (activeTab === "routines")      fetchRoutines(); }, [activeTab, fetchRoutines]);
  useEffect(() => { if (activeTab === "videos")        fetchMuscles(); }, [activeTab, fetchMuscles]);

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
  const filteredWorkouts = workouts.filter(w => w.title?.toLowerCase().includes(workoutSearch.toLowerCase()));

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
  const filteredRoutines = routines.filter(r =>
    (r.title?.en || "").toLowerCase().includes(routineSearch.toLowerCase()) ||
    (r.title?.fr || "").toLowerCase().includes(routineSearch.toLowerCase())
  );

  // ─── Muscle exercise handlers ───────────────────────────────────────────────
  const toggleMuscleOpen = (muscleId: number) => {
    setExpandedMuscles(prev => {
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
      // Optimistic update
      setMuscles(prev => prev.map(m => {
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

  const filteredMuscles = muscles.filter(m =>
    m.name?.en?.toLowerCase().includes(muscleSearch.toLowerCase()) ||
    m.name?.fr?.toLowerCase().includes(muscleSearch.toLowerCase())
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">{t("admin.title")}</h1>
          <p className="text-gray-500 text-sm">{t("admin.subtitle")}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t("admin.totalUsers"),           icon: Users,      value: stats?.totalUsers },
            { label: t("admin.activeSubscriptions"),  icon: CreditCard, value: stats?.activeSubscriptions },
            { label: t("admin.monthlyRevenue"),       icon: TrendingUp, value: stats ? `$${stats.monthlyRevenue}` : null },
            { label: "Exercises in DB",               icon: Dumbbell,   value: stats?.totalExercises },
          ].map(({ label, icon: Icon, value }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-gray-500">{label}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : (value ?? "–")}
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
                    ["Total Users", stats?.totalUsers],
                    ["Active Subscriptions", stats?.activeSubscriptions],
                    ["Monthly Revenue", stats ? `$${stats.monthlyRevenue}` : null],
                    ["New Users (30d)", stats?.recentSignups],
                    ["Total Workouts", stats?.totalWorkouts],
                    ["Total Routines", stats?.totalRoutines],
                    ["Muscle Groups", stats?.totalMuscleGroups],
                    ["Total Exercises", stats?.totalExercises],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between border-b pb-2 last:border-0">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold">{statsLoading ? "…" : (val ?? "–")}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Subscriptions by Plan</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {stats?.subscriptionsByPlan?.map((item: any) => (
                    <div key={item._id} className="flex justify-between border-b pb-2">
                      <Badge variant="outline" className="capitalize">{item._id || "free"}</Badge>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  )) ?? <span className="text-gray-400">Loading…</span>}
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder={t("admin.searchPlaceholder")} value={subSearch} onChange={e => setSubSearch(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["all","active","cancelled","expired"].map(v => <SelectItem key={v} value={v}>{v === "all" ? "All Status" : v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-full md:w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["all","free","pro","premium"].map(v => <SelectItem key={v} value={v}>{v === "all" ? "All Plans" : v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {subsError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{subsError}</AlertDescription></Alert>}
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>{["User","Plan","Status","Start","End","Amount",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {subsLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>
                      ) : filteredSubs.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-gray-400">No subscriptions found</td></tr>
                      ) : filteredSubs.map(sub => (
                        <tr key={sub._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="font-medium">{sub.user?.name}</div><div className="text-xs text-gray-400">{sub.user?.email}</div></td>
                          <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{sub.plan}</Badge></td>
                          <td className="px-4 py-3">
                            <Badge className={sub.status === "active" ? "bg-green-100 text-green-700" : sub.status === "expired" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}>{sub.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(sub.createdAt)}</td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(sub.endDate)}</td>
                          <td className="px-4 py-3 font-medium">{sub.amount}</td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditSub(sub)}>Edit Subscription</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleCancelSub(sub.user?._id)}>Cancel Subscription</DropdownMenuItem>
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search workouts…" value={workoutSearch} onChange={e => setWorkoutSearch(e.target.value)} className="pl-9" />
                </div>
                {workoutsError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{workoutsError}</AlertDescription></Alert>}
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>{["Title","Level","Type","Duration","Premium","Public",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {workoutsLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>
                      ) : filteredWorkouts.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-gray-400">No workouts. Click "Add Workout" to create one.</td></tr>
                      ) : filteredWorkouts.map(w => (
                        <tr key={w._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{w.title}</div>
                            {w.exercises?.length > 0 && <div className="text-xs text-gray-400">{w.exercises.length} exercises linked</div>}
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline">{w.level}</Badge></td>
                          <td className="px-4 py-3 text-gray-600">{w.type}</td>
                          <td className="px-4 py-3 text-gray-600">{w.duration} min</td>
                          <td className="px-4 py-3">{w.isPremium ? <Badge className="bg-yellow-100 text-yellow-800">Yes</Badge> : <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3">{w.isPublic ? <Badge className="bg-green-100 text-green-800">Public</Badge> : <Badge variant="secondary">Private</Badge>}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openWorkoutModal(w)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteWorkout(w._id)}><Trash2 className="h-4 w-4" /></Button>
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
          <TabsContent value="routines">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Workout Routines</CardTitle><CardDescription>Bilingual routine cards shown to all users</CardDescription></div>
                <Button onClick={() => openRoutineModal()}><Plus className="mr-1 h-4 w-4" />Add Routine</Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search routines…" value={routineSearch} onChange={e => setRoutineSearch(e.target.value)} className="pl-9" />
                </div>
                {routinesError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{routinesError}</AlertDescription></Alert>}
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>{["Title (EN / FR)","Level","Duration","Days/wk","Exercises","Public",""].map((h,i) => <th key={i} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {routinesLoading ? (
                        <tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>
                      ) : filteredRoutines.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-8 text-gray-400">No routines. Click "Add Routine".</td></tr>
                      ) : filteredRoutines.map(r => (
                        <tr key={r._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium">{r.title?.en}</div>
                            <div className="text-xs text-gray-400">{r.title?.fr}</div>
                          </td>
                          <td className="px-4 py-3"><Badge variant="outline">{r.level}</Badge></td>
                          <td className="px-4 py-3 text-gray-600">{r.duration}</td>
                          <td className="px-4 py-3 text-gray-600">{r.daysPerWeek}</td>
                          <td className="px-4 py-3 text-gray-600">{r.exercises}</td>
                          <td className="px-4 py-3">{r.isPublic ? <Badge className="bg-green-100 text-green-800">Public</Badge> : <Badge variant="secondary">Private</Badge>}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openRoutineModal(r)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteRoutine(r._id)}><Trash2 className="h-4 w-4" /></Button>
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
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search muscle groups…" value={muscleSearch} onChange={e => setMuscleSearch(e.target.value)} className="pl-9" />
                  </div>
                  {musclesLoading && <Loader2 className="h-5 w-5 animate-spin text-gray-400 self-center" />}
                </div>

                {musclesError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{String(musclesError)}</AlertDescription></Alert>}

                {!musclesLoading && muscles.length === 0 && (
                  <div className="text-center py-16 space-y-3">
                    <Video className="h-10 w-10 text-gray-300 mx-auto" />
                    <p className="text-gray-500">No muscle data in database.</p>
                    <p className="text-sm text-gray-400">Run <code className="bg-gray-100 px-1 rounded">node scripts/seedMuscleExercises.js</code> to populate it.</p>
                  </div>
                )}

                <div className="space-y-2">
                  {filteredMuscles.map(muscle => {
                    const isOpen = expandedMuscles.has(muscle.muscleId);
                    const totalEx   = muscle.exercises?.length || 0;
                    const activeEx  = muscle.exercises?.filter((e: any) => e.isActive).length || 0;
                    return (
                      <Collapsible key={muscle.muscleId} open={isOpen} onOpenChange={() => toggleMuscleOpen(muscle.muscleId)}>
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-border hover:bg-gray-50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                              {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                              <span className="font-semibold">{muscle.name?.en}</span>
                              <span className="text-xs text-gray-400">/ {muscle.name?.fr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{activeEx}/{totalEx} active</Badge>
                              <Badge variant="secondary" className="text-xs">ID {muscle.muscleId}</Badge>
                            </div>
                          </button>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="ml-4 mt-1 space-y-2 pb-2">
                            {totalEx === 0 ? (
                              <p className="text-xs text-gray-400 px-4 py-2">No exercises in this muscle group.</p>
                            ) : muscle.exercises.map((ex: any) => {
                              const key = `${muscle.muscleId}-${ex.exerciseId}`;
                              const isToggling = togglingEx === key;
                              return (
                                <div key={ex.exerciseId} className={`rounded-lg border p-3 ${ex.isActive ? "bg-white border-border" : "bg-gray-50 border-dashed border-gray-200 opacity-60"}`}>
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium text-sm">{ex.name?.en}</span>
                                        <span className="text-xs text-gray-400">/ {ex.name?.fr}</span>
                                        <Badge className={`text-xs ${diffColor[ex.difficulty] || "bg-gray-100 text-gray-600"}`}>
                                          {ex.difficulty}
                                        </Badge>
                                        <span className="text-xs text-gray-400">ID: {ex.exerciseId}</span>
                                      </div>

                                      {/* Video status summary */}
                                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                        {(["male","female"] as const).map(g => {
                                          const f = ex.videos?.[g]?.front;
                                          const s = ex.videos?.[g]?.side;
                                          return (
                                            <span key={g} className={`capitalize flex items-center gap-1 ${f||s ? "text-green-600" : "text-gray-400"}`}>
                                              {g}: {f ? "front✓" : "front✗"} {s ? "side✓" : "side✗"}
                                            </span>
                                          );
                                        })}
                                        {ex.updatedAt && <span className="text-gray-400">· updated {formatDate(ex.updatedAt)}</span>}
                                      </div>

                                      {/* Per-gender edit buttons */}
                                      <VideoEditor muscleId={muscle.muscleId} exercise={ex} onSaved={fetchMuscles} />
                                    </div>

                                    {/* Toggle active */}
                                    <button
                                      disabled={isToggling}
                                      onClick={() => handleToggleExercise(muscle.muscleId, ex.exerciseId, !ex.isActive)}
                                      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                                        ex.isActive
                                          ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                                          : "border-gray-200 text-gray-500 bg-white hover:bg-gray-50"
                                      }`}
                                      title={ex.isActive ? "Click to hide from users" : "Click to show to users"}
                                    >
                                      {isToggling
                                        ? <Loader2 className="h-3 w-3 animate-spin" />
                                        : ex.isActive ? <><Eye className="h-3 w-3" /> Visible</> : <><EyeOff className="h-3 w-3" /> Hidden</>
                                      }
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
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
              <Select value={editSubForm.plan} onValueChange={v => setEditSubForm(p => ({ ...p, plan: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["free","pro","premium"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={editSubForm.status} onValueChange={v => setEditSubForm(p => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["active","cancelled","expired"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
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
            <div className="md:col-span-2 space-y-1"><Label>Title</Label><Input value={workoutForm.title} onChange={e => setWorkoutForm((p: any) => ({ ...p, title: e.target.value }))} placeholder="e.g. Full Body Strength" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description</Label><Textarea rows={2} value={workoutForm.description} onChange={e => setWorkoutForm((p: any) => ({ ...p, description: e.target.value }))} /></div>
            <div className="space-y-1">
              <Label>Level</Label>
              <Select value={workoutForm.level} onValueChange={v => setWorkoutForm((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Débutant","Intermédiaire","Expert"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={workoutForm.type} onValueChange={v => setWorkoutForm((p: any) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Prise de masse","Perte de poids","Endurance","Force","Full Body"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Duration (min)</Label><Input type="number" value={workoutForm.duration} onChange={e => setWorkoutForm((p: any) => ({ ...p, duration: Number(e.target.value) }))} /></div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={workoutForm.isPremium} onChange={e => setWorkoutForm((p: any) => ({ ...p, isPremium: e.target.checked }))} className="rounded" />Premium</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={workoutForm.isPublic} onChange={e => setWorkoutForm((p: any) => ({ ...p, isPublic: e.target.checked }))} className="rounded" />Public</label>
            </div>

            {/* Exercises section */}
            <div className="md:col-span-2 space-y-2">
              <Label>Exercises <span className="text-xs text-muted-foreground">(each can reference a muscleExerciseId for video linking)</span></Label>
              {(workoutForm.exercises || []).map((ex: any, i: number) => (
                <div key={i} className="grid grid-cols-12 gap-2 p-3 rounded-lg border bg-muted/30 text-sm">
                  <div className="col-span-4"><Input placeholder="Name" value={ex.name} onChange={e => { const arr = [...workoutForm.exercises]; arr[i] = { ...arr[i], name: e.target.value }; setWorkoutForm((p: any) => ({ ...p, exercises: arr })); }} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="Sets" value={ex.sets || ""} onChange={e => { const arr = [...workoutForm.exercises]; arr[i] = { ...arr[i], sets: Number(e.target.value) }; setWorkoutForm((p: any) => ({ ...p, exercises: arr })); }} /></div>
                  <div className="col-span-2"><Input placeholder="Reps" value={ex.reps || ""} onChange={e => { const arr = [...workoutForm.exercises]; arr[i] = { ...arr[i], reps: e.target.value }; setWorkoutForm((p: any) => ({ ...p, exercises: arr })); }} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="ExID" title="Exercise ID from musclesData" value={ex.muscleExerciseId || ""} onChange={e => { const arr = [...workoutForm.exercises]; arr[i] = { ...arr[i], muscleExerciseId: Number(e.target.value) }; setWorkoutForm((p: any) => ({ ...p, exercises: arr })); }} /></div>
                  <div className="col-span-2 flex justify-end"><Button variant="ghost" size="icon" className="text-red-500" onClick={() => { const arr = workoutForm.exercises.filter((_: any, j: number) => j !== i); setWorkoutForm((p: any) => ({ ...p, exercises: arr })); }}><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setWorkoutForm((p: any) => ({ ...p, exercises: [...(p.exercises || []), { name: "", sets: 3, reps: "10", muscleExerciseId: null }] }))}>
                <Plus className="mr-1 h-3 w-3" />Add Exercise
              </Button>
              <p className="text-xs text-muted-foreground">ExID = Exercise ID from the Muscle Videos tab (e.g. 101 = Crunches). Linking it allows the frontend to pull the tutorial video.</p>
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
            <div className="space-y-1"><Label>Title (English)</Label><Input value={routineForm.title?.en || ""} onChange={e => setRoutineForm((p: any) => ({ ...p, title: { ...p.title, en: e.target.value } }))} placeholder="e.g. Full Body Workout" /></div>
            <div className="space-y-1"><Label>Title (French)</Label><Input value={routineForm.title?.fr || ""} onChange={e => setRoutineForm((p: any) => ({ ...p, title: { ...p.title, fr: e.target.value } }))} placeholder="e.g. Entraînement corps entier" /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (English)</Label><Textarea rows={2} value={routineForm.description?.en || ""} onChange={e => setRoutineForm((p: any) => ({ ...p, description: { ...p.description, en: e.target.value } }))} /></div>
            <div className="md:col-span-2 space-y-1"><Label>Description (French)</Label><Textarea rows={2} value={routineForm.description?.fr || ""} onChange={e => setRoutineForm((p: any) => ({ ...p, description: { ...p.description, fr: e.target.value } }))} /></div>
            <div className="space-y-1">
              <Label>Level</Label>
              <Select value={routineForm.level} onValueChange={v => setRoutineForm((p: any) => ({ ...p, level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Beginner","Intermediate","Advanced"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Duration</Label><Input value={routineForm.duration} onChange={e => setRoutineForm((p: any) => ({ ...p, duration: e.target.value }))} placeholder="45 min" /></div>
            <div className="space-y-1"><Label>Days Per Week</Label><Input type="number" min={1} max={7} value={routineForm.daysPerWeek} onChange={e => setRoutineForm((p: any) => ({ ...p, daysPerWeek: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>No. of Exercises</Label><Input type="number" min={1} value={routineForm.exercises} onChange={e => setRoutineForm((p: any) => ({ ...p, exercises: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label>Focus Tags <span className="text-xs text-muted-foreground">(comma-separated)</span></Label><Input value={(routineForm.focus || []).join(", ")} onChange={e => setRoutineForm((p: any) => ({ ...p, focus: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} placeholder="Strength, Full Body" /></div>
            <div className="space-y-1"><Label>Display Order</Label><Input type="number" value={routineForm.order || 0} onChange={e => setRoutineForm((p: any) => ({ ...p, order: Number(e.target.value) }))} /></div>
            <div className="flex items-center gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={routineForm.isPremium} onChange={e => setRoutineForm((p: any) => ({ ...p, isPremium: e.target.checked }))} className="rounded" />Premium</label>
              <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={routineForm.isPublic} onChange={e => setRoutineForm((p: any) => ({ ...p, isPublic: e.target.checked }))} className="rounded" />Public</label>
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
    </div>
  );
};

export default AdminDashboard;
