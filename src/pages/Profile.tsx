import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { User, Mail, Calendar, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { t, lang } = useTranslation();

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>);
  if (!user) return null;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: "numeric", month: "long", day: "numeric" });

  const getPlanBadgeVariant = (planName: string) => {
    switch (planName) { case "premium": return "default"; case "pro": return "secondary"; default: return "outline"; }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"><User className="w-10 h-10 text-primary" /></div>
          <h1 className="text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />{t('profile.accountInfo')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('profile.emailLabel')}</span><span className="font-medium">{user.email}</span></div>
            <Separator />
            <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('profile.accountCreated')}</span><span className="font-medium">{user.created_at ? formatDate(user.created_at) : "N/A"}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5" />{t('profile.subscription')}</CardTitle></CardHeader>
          <CardContent>
            {user.subscription ? (() => {
              const isExpired = user.subscription.endDate && new Date(user.subscription.endDate) < new Date();
              const daysLeft = user.subscription.endDate
                ? Math.max(0, Math.ceil((new Date(user.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : null;

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('profile.currentPlan')}</span>
                    <Badge variant={isExpired ? "outline" : getPlanBadgeVariant(user.subscription.plan)}>
                      {isExpired ? t('profile.expired') : user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t('profile.status')}</span>
                    <Badge variant="outline" className={isExpired ? "bg-red-100 text-red-800 border-red-200" : "bg-green-100 text-green-800 border-green-200"}>
                      {isExpired ? t('profile.expiredStatus') : t('profile.active')}
                    </Badge>
                  </div>
                  {user.subscription.startDate && (
                    <><Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t('profile.started')}</span>
                      <span className="font-medium">{formatDate(user.subscription.startDate)}</span>
                    </div></>
                  )}
                  {user.subscription.endDate && (
                    <><Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{isExpired ? t('profile.expiredOn') : t('profile.expiresOn')}</span>
                      <span className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>{formatDate(user.subscription.endDate)}</span>
                    </div></>
                  )}
                  {!isExpired && daysLeft !== null && daysLeft <= 7 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                      <span className="text-sm text-yellow-800 font-medium">
                        ⚠️ {t('profile.expiringAlert', { days: String(daysLeft) })}
                      </span>
                    </div>
                  )}
                  {isExpired && (
                    <Button onClick={() => navigate("/subscription")} className="w-full mt-2">
                      {t('profile.renewSubscription')}
                    </Button>
                  )}
                </div>
              );
            })() : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">{t('profile.noSubscription')}</p>
                <Button onClick={() => navigate("/subscription")}>{t('profile.viewPlans')}</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {user.role === "admin" && (<Card><CardContent className="pt-6"><NavLink to="/admin"><Button className="w-full">{t('profile.adminDashboard')}</Button></NavLink></CardContent></Card>)}

        <Card>
          <CardContent className="pt-6">
            <Button variant="destructive" className="w-full" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />{t('profile.signOut')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
