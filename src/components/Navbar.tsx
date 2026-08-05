import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Dumbbell, Home, Calendar, FileText, User, LogOut,
  ChevronDown, Wrench, Activity, Calculator, BarChart2,
  Weight, Menu, X, Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface DropdownItem { label: string; to: string; icon: React.ElementType }

const NavDropdown = ({
  label, icon: Icon, items,
}: { label: string; icon: React.ElementType; items: DropdownItem[] }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = items.some((i) => location.pathname.startsWith(i.to));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-white text-primary shadow-md shadow-black/10"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        // pt-2 gives the visual gap while keeping the hover area continuous,
        // so moving the cursor from the button into the menu never closes it.
        <div className="absolute top-full left-0 pt-2 z-50 animate-fade-in-up">
          <div className="w-52 bg-card border border-primary/15 rounded-xl shadow-2xl shadow-primary/15 py-1.5">
            {items.map((item) => {
              const ItemIcon = item.icon;
              const active = location.pathname === item.to;
              return (
                <button
                  key={item.to}
                  onClick={() => { navigate(item.to); setOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/8 hover:pl-5"
                  )}
                >
                  <ItemIcon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-white text-primary shadow-md shadow-black/10"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const workoutItems: DropdownItem[] = [
    { label: t("nav.workouts"), to: "/workout", icon: Dumbbell },
    { label: t("nav.trainingLog"), to: "/training", icon: Activity },
    { label: t("nav.programs"), to: "/programs", icon: Calendar },
  ];

  const toolItems: DropdownItem[] = [
    { label: t("nav.calorieCalculator"), to: "/calorie_calculator", icon: Calculator },
    { label: t("nav.tdeeCalculator"), to: "/tdee_calculator", icon: BarChart2 },
    { label: t("nav.macroCalculator"), to: "/macro_calculator", icon: Weight },
    { label: t("nav.oneRMCalculator"), to: "/one_rep_max_tool", icon: Wrench },
  ];

  const planLabel = user?.subscription?.plan;
  const isPremium = planLabel === "premium" || planLabel === "pro";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 gradient-brand border-b border-white/10 shadow-md shadow-primary/20">
        <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md shadow-black/20 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3">
              <Dumbbell className="text-primary" style={{ width: 18, height: 18 }} />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Muscle</span>
              <span className="text-white/70">Tiki</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavItem to="/" label={t("nav.home")} icon={Home} />
            <NavDropdown label={t("nav.workouts")} icon={Dumbbell} items={workoutItems} />
            <NavDropdown label={t("nav.tools")} icon={Wrench} items={toolItems} />
            <NavItem to="/articles" label={t("nav.articles")} icon={FileText} />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />

            {user ? (
              <div className="flex items-center gap-2">
                {isPremium && (
                  <div className="hidden md:flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 shadow-sm shadow-black/10">
                    <Crown className="h-3.5 w-3.5 text-white" />
                    <span className="text-xs font-semibold text-white capitalize">{planLabel}</span>
                  </div>
                )}
                <button
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center ring-1 ring-white/20 hover:bg-white/25 hover:ring-white/40 transition-all duration-200"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </button>
                <button
                  onClick={logout}
                  className="hidden lg:flex w-9 h-9 rounded-full bg-white/15 items-center justify-center hover:bg-destructive/30 transition-colors"
                  title={t("nav.logout")}
                >
                  <LogOut className="h-4 w-4 text-white" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden lg:flex items-center gap-1.5 bg-white text-primary px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-black/10 hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("nav.login")}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-lg bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-2xl shadow-black/10 py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {[
              { to: "/", label: t("nav.home"), icon: Home },
              { to: "/workout", label: t("nav.workouts"), icon: Dumbbell },
              { to: "/training", label: t("nav.trainingLog"), icon: Activity },
              { to: "/programs", label: t("nav.programs"), icon: Calendar },
              { to: "/calorie_calculator", label: t("nav.calorieCalculator"), icon: Calculator },
              { to: "/tdee_calculator", label: t("nav.tdeeCalculator"), icon: BarChart2 },
              { to: "/macro_calculator", label: t("nav.macroCalculator"), icon: Weight },
              { to: "/one_rep_max_tool", label: t("nav.oneRMCalculator"), icon: Wrench },
              { to: "/articles", label: t("nav.articles"), icon: FileText },
              { to: "/subscription", label: t("nav.subscription") || "Plans", icon: Crown },
            ].map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    active
                      ? "gradient-brand text-primary-foreground shadow-md shadow-primary/30"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border mt-3">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
