import { Link, useLocation } from "react-router-dom";
import { Home, Dumbbell, Calendar, Wrench, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";

const tabs = [
  { to: "/",         icon: Home,     labelKey: "nav.home" },
  { to: "/workout",  icon: Dumbbell, labelKey: "nav.workouts" },
  { to: "/programs", icon: Calendar, labelKey: "nav.programs" },
  { to: "/calorie_calculator", icon: Wrench, labelKey: "nav.tools" },
  { to: "/profile",  icon: User,     labelKey: "nav.profile" },
];

const MobileNavBar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-primary/15 shadow-[0_-4px_20px_-8px_hsl(var(--shadow-color)/0.25)] safe-area-pb">
      <div className="flex items-stretch h-16">
        {tabs.map(({ to, icon: Icon, labelKey }) => {
          const active =
            to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <div className={cn(
                "w-11 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                active && "gradient-brand text-primary-foreground shadow-sm shadow-primary/40"
              )}>
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <span className="text-[10px] font-medium leading-none">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavBar;
