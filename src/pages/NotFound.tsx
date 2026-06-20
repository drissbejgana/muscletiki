import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "@/i18n";
import { ArrowLeft, Dumbbell } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="h-10 w-10 text-primary/60" />
        </div>
        <p className="text-[80px] font-black text-primary/15 leading-none mb-2">404</p>
        <h1 className="text-2xl font-black text-foreground mb-3">{t("notFound.title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto">{t("notFound.message")}</p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("notFound.link")}
        </button>
      </div>
    </div>
  );
};

export default NotFound;
