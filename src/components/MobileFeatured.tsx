import { useTranslation } from "@/i18n";

const MobileFeatured = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white border-t border-border px-4 py-6 relative z-10">
      <h3 className="text-[#2B4C8F] font-bold text-lg mb-4">{t('mobileView.featured')}</h3>
    </div>
  );
};

export default MobileFeatured;
