import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, Layers, Loader2, Lock, CheckCircle2, Circle,
  ChevronDown, Play, Moon, Trophy, RotateCcw,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import programService from "@/services/programService";
import { cn } from "@/lib/utils";

interface ProgramExercise {
  name: string; sets: number; reps: string; rest: number;
  notes?: string; muscleGroup?: string; muscleExerciseId?: number;
}
interface ProgramDay {
  day: number; title: { en: string; fr: string }; isRest: boolean;
  exercises: ProgramExercise[]; focus?: string[];
  workout?: { _id: string; title: string } | null;
}
interface ProgramWeek {
  week: number;
  label?: { en: string; fr: string } | null;
  notes?: { en: string; fr: string } | null;
  days: ProgramDay[];
}
interface Progress {
  status: string; currentWeek: number; currentDay: number;
  completedDays: { week: number; day: number }[];
  completedCount: number; totalTrainingDays: number; percent: number;
}
interface ProgramData {
  _id: string; slug: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  level: string; goal: string; weeks: number; daysPerWeek: number;
  sessionDuration: string; focus: string[]; equipment: string[];
  isPremium: boolean; locked: boolean; previewOnly: boolean;
  enrolled: boolean; progress: Progress | null;
  totalTrainingDays: number;
  schedule: ProgramWeek[];
}

const levelColors: Record<string, string> = {
  Beginner:     "bg-primary/20 text-primary border-primary/30",
  Intermediate: "bg-accent/20 text-accent border-accent/30",
  Advanced:     "bg-destructive/20 text-destructive border-destructive/30",
};

const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const { user } = useAuth();

  const [program, setProgram]   = useState<ProgramData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [busy, setBusy]         = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await programService.getProgram(slug!);
      setProgram(data);
      // Open the week the user is currently on, else week 1.
      setOpenWeek(data.progress?.currentWeek ?? 1);
    } catch (e: any) {
      setError(typeof e === "string" ? e : "Failed to load program");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { load(); }, [load]);

  const handleEnroll = async (isRestart = false) => {
    if (!user) { navigate("/auth"); return; }
    // Enrolling again resets progress, so make that explicit.
    if (isRestart && !window.confirm(t("programs.confirmRestart"))) return;
    setBusy(true); setActionError(null);
    try {
      const progress = await programService.enroll(program!._id);
      setProgram((p) => (p ? { ...p, enrolled: true, progress } : p));
      setOpenWeek(progress.currentWeek);
    } catch (e: any) {
      setActionError(typeof e === "string" ? e : "Failed to start program");
    } finally { setBusy(false); }
  };

  const handleLeave = async () => {
    if (!window.confirm(t("programs.confirmLeave"))) return;
    setBusy(true); setActionError(null);
    try {
      await programService.unenroll(program!._id);
      await load();
    } catch (e: any) {
      setActionError(typeof e === "string" ? e : "Failed to leave program");
    } finally { setBusy(false); }
  };

  const toggleDay = async (week: number, day: number, currentlyDone: boolean) => {
    if (!program?.enrolled) return;
    setBusy(true); setActionError(null);
    try {
      const progress = await programService.setDayComplete(program._id, week, day, !currentlyDone);
      setProgram((p) => (p ? { ...p, progress } : p));
    } catch (e: any) {
      setActionError(typeof e === "string" ? e : "Failed to update progress");
    } finally { setBusy(false); }
  };

  const isDone = (week: number, day: number) =>
    Boolean(program?.progress?.completedDays?.some((d) => d.week === week && d.day === day));

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  if (error || !program) return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">{t("programs.notFound")}</h2>
        <p className="text-sm text-muted-foreground mb-5">{error || t("programs.notFoundDesc")}</p>
        <button
          onClick={() => navigate("/programs")}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("programs.backToPrograms")}
        </button>
      </div>
    </div>
  );

  const title       = lang === "fr" ? program.title.fr : program.title.en;
  const description = lang === "fr" ? program.description.fr : program.description.en;
  const lc = levelColors[program.level] ?? "bg-secondary text-muted-foreground border-border";
  const completed = program.progress?.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
        <div className="relative max-w-screen-lg mx-auto px-4 lg:px-6 py-8">
          <button
            onClick={() => navigate("/programs")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4" /> {t("programs.backToPrograms")}
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={cn("px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded-full border", lc)}>
              {program.level}
            </span>
            <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-secondary text-muted-foreground">
              {program.goal}
            </span>
            {program.isPremium && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-full bg-accent/20 text-accent border border-accent/30">
                <Lock className="h-3 w-3" /> {t("programs.pro")}
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-4xl font-black text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mb-6">{description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { icon: Calendar, label: t("programs.weeks"),    value: String(program.weeks) },
              { icon: Clock,    label: t("programs.daysWeek"), value: String(program.daysPerWeek) },
              { icon: Layers,   label: t("programs.sessions"), value: String(program.totalTrainingDays) },
              { icon: Clock,    label: t("programs.perSession"), value: program.sessionDuration },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
                <Icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                <p className="text-[10px] text-muted-foreground leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 lg:px-6 py-6">
        {/* Locked banner */}
        {program.locked && (
          <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 mb-6 text-center">
            <Lock className="h-6 w-6 mx-auto mb-2 text-accent" />
            <h3 className="text-base font-bold text-foreground mb-1">{t("programs.lockedTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("programs.lockedDesc")}</p>
            <button
              onClick={() => navigate("/subscription")}
              className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              {t("programs.upgradeToPro")}
            </button>
          </div>
        )}

        {/* Progress / enrollment panel */}
        {!program.locked && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            {program.enrolled && program.progress ? (
              <>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {completed
                      ? <Trophy className="h-5 w-5 text-primary" />
                      : <Play className="h-5 w-5 text-primary" />}
                    <span className="text-sm font-bold text-foreground">
                      {completed ? t("programs.programComplete") : t("programs.yourProgress")}
                    </span>
                  </div>
                  <span className="text-sm font-black text-primary">{program.progress.percent}%</span>
                </div>

                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${program.progress.percent}%` }} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {t("programs.sessionsDone", {
                      done: program.progress.completedCount,
                      total: program.progress.totalTrainingDays,
                    })}
                    {!completed && (
                      <> · {t("programs.upNext")} {t("programs.weekDayOf", {
                        week: program.progress.currentWeek, day: program.progress.currentDay,
                      })}</>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEnroll(true)}
                      disabled={busy}
                      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="h-3 w-3" /> {t("programs.restart")}
                    </button>
                    <button
                      onClick={handleLeave}
                      disabled={busy}
                      className="text-xs font-semibold text-destructive hover:underline disabled:opacity-50"
                    >
                      {t("programs.leave")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-base font-bold text-foreground mb-1">{t("programs.readyToStart")}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t("programs.readyToStartDesc")}</p>
                <button
                  onClick={() => handleEnroll(false)}
                  disabled={busy}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {user ? t("programs.startProgram") : t("programs.signInToStart")}
                </button>
              </div>
            )}

            {actionError && <p className="text-xs text-destructive text-center mt-3">{actionError}</p>}
          </div>
        )}

        {/* Schedule */}
        <h2 className="text-lg font-bold text-foreground mb-3">{t("programs.schedule")}</h2>

        <div className="space-y-3">
          {program.schedule.map((week) => {
            const isOpen = openWeek === week.week;
            const weekLabel = week.label
              ? (lang === "fr" ? week.label.fr : week.label.en)
              : t("programs.weekN", { n: week.week });
            const weekNotes = week.notes ? (lang === "fr" ? week.notes.fr : week.notes.en) : null;

            const trainingDays = week.days.filter((d) => !d.isRest);
            const doneInWeek   = trainingDays.filter((d) => isDone(week.week, d.day)).length;

            return (
              <div key={week.week} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenWeek(isOpen ? null : week.week)}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-foreground">{weekLabel}</span>
                    {program.enrolled && (
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                        doneInWeek === trainingDays.length
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      )}>
                        {doneInWeek}/{trainingDays.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform shrink-0", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="border-t border-border p-4 space-y-3">
                    {weekNotes && (
                      <p className="text-xs text-muted-foreground italic bg-secondary/50 rounded-lg px-3 py-2">{weekNotes}</p>
                    )}

                    {week.days.map((day) => {
                      const dayTitle = lang === "fr" ? day.title.fr : day.title.en;
                      const done = isDone(week.week, day.day);

                      if (day.isRest) return (
                        <div key={day.day} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/40">
                          <Moon className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {t("programs.dayN", { n: day.day })} · {dayTitle}
                          </span>
                        </div>
                      );

                      return (
                        <div key={day.day} className={cn(
                          "rounded-xl border transition-colors",
                          done ? "border-primary/30 bg-primary/5" : "border-border bg-background"
                        )}>
                          <div className="flex items-start gap-3 p-3">
                            <button
                              onClick={() => toggleDay(week.week, day.day, done)}
                              disabled={!program.enrolled || busy}
                              title={program.enrolled ? t("programs.toggleDay") : t("programs.enrollToTrack")}
                              className="mt-0.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {done
                                ? <CheckCircle2 className="h-5 w-5 text-primary" />
                                : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-0.5">
                                {t("programs.dayN", { n: day.day })}
                              </p>
                              <h4 className={cn("text-sm font-bold mb-2", done ? "text-primary" : "text-foreground")}>
                                {dayTitle}
                              </h4>

                              <div className="space-y-1">
                                {day.exercises.map((exercise, i) => (
                                  <div key={`${exercise.name}-${i}`} className="flex items-baseline justify-between gap-3 text-xs">
                                    <span className="text-foreground truncate">{exercise.name}</span>
                                    <span className="text-muted-foreground shrink-0 tabular-nums">
                                      {exercise.sets} × {exercise.reps}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Preview cut-off notice */}
        {program.previewOnly && (
          <div className="text-center py-8">
            <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">
              {t("programs.previewNotice", { weeks: program.weeks - 1 })}
            </p>
            <button
              onClick={() => navigate("/subscription")}
              className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors"
            >
              {t("programs.upgradeToPro")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetail;
