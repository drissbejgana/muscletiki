import { useTranslation } from "@/i18n";
import { Flame } from "lucide-react";

const MobileFeatured = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-card border-t border-border px-4 py-4 relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
          {t('mobileView.featured')}
        </h3>
      </div>
    </div>
  );
};

export default MobileFeatured;
