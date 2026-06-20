import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { User, Mail, Crown, LogOut, ShieldCheck, Calendar, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: any) => (
  <div className="bg-secondary rounded-xl p-4 flex items-center gap-3">
    <div className={cn("w-9 h-9 rounded-lg bg-card flex items-center justify-center shrink-0", color)}>
      <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value, valueClass = "" }: any) => (
  <div className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={cn("text-sm font-semibold text-foreground", valueClass)}>{value}</span>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { t, lang } = useTranslation();

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      year: "numeric", month: "long", day: "numeric",
    });

  const isExpired = user.subscription?.endDate && new Date(user.subscription.endDate) < new Date();
  const daysLeft = user.subscription?.endDate
    ? Math.max(0, Math.ceil((new Date(user.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const planLabel = user.subscription?.plan || 'free';
  const planColors: Record<string, string> = {
    premium: "bg-primary/20 text-primary border-primary/30",
    pro:     "bg-accent/20 text-accent border-accent/30",
    free:    "bg-secondary text-muted-foreground border-border",
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* Profile card */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="relative">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-primary/20" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 ring-2 ring-border">
                <User className="w-9 h-9 text-muted-foreground" />
              </div>
            )}
            <h1 className="text-xl font-black text-foreground">{user.name || user.email}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
            {user.role === "admin" && (
              <div className="inline-flex items-center gap-1.5 bg-accent/15 border border-accent/25 rounded-full px-3 py-1 mt-3">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-wide">Admin</span>
              </div>
            )}
          </div>
        </div>

        {/* Subscription status */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{t('profile.subscription')}</h2>
          </div>

          {user.subscription ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide",
                  isExpired ? "bg-destructive/15 text-destructive border-destructive/30" : planColors[planLabel]
                )}>
                  {isExpired ? t('profile.expired') : planLabel}
                </span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  isExpired
                    ? "bg-destructive/15 text-destructive"
                    : "bg-primary/15 text-primary"
                )}>
                  {isExpired ? t('profile.expiredStatus') : t('profile.active')}
                </span>
              </div>

              <div className="space-y-0">
                {user.subscription.startDate && (
                  <InfoRow label={t('profile.started')} value={formatDate(user.subscription.startDate)} />
                )}
                {user.subscription.endDate && (
                  <InfoRow
                    label={isExpired ? t('profile.expiredOn') : t('profile.expiresOn')}
                    value={formatDate(user.subscription.endDate)}
                    valueClass={isExpired ? "text-destructive" : ""}
                  />
                )}
              </div>

              {!isExpired && daysLeft !== null && daysLeft <= 7 && (
                <div className="mt-3 bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                  <span className="text-xs text-accent font-semibold">
                    ⚠ {t('profile.expiringAlert', { days: String(daysLeft) })}
                  </span>
                </div>
              )}

              {isExpired && (
                <Button onClick={() => navigate("/subscription")} className="w-full mt-4 h-10 font-bold">
                  {t('profile.renewSubscription')}
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm mb-4">{t('profile.noSubscription')}</p>
              <Button onClick={() => navigate("/subscription")} size="sm">{t('profile.viewPlans')}</Button>
            </div>
          )}
        </div>

        {/* Account info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{t('profile.accountInfo')}</h2>
          </div>
          <InfoRow label={t('profile.emailLabel')} value={user.email} />
          {user.created_at && (
            <InfoRow label={t('profile.accountCreated')} value={formatDate(user.created_at)} />
          )}
        </div>

        {/* Admin link */}
        {user.role === "admin" && (
          <div className="bg-card border border-accent/20 rounded-2xl p-4">
            <NavLink to="/admin">
              <Button className="w-full bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 font-bold">
                <ShieldCheck className="h-4 w-4 mr-2" />
                {t('profile.adminDashboard')}
              </Button>
            </NavLink>
          </div>
        )}

        {/* Sign out */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <Button
            variant="destructive"
            className="w-full font-bold"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('profile.signOut')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
