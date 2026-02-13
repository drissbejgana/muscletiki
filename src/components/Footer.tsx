import { Youtube, Instagram, Twitter, Facebook } from "lucide-react";
import { useTranslation } from "@/i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2B4C8F] text-white py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:underline">{t('footer.terms')}</a>
          <span>|</span>
          <a href="#" className="hover:underline">{t('footer.copyright')}</a>
          <span>|</span>
          <a href="#" className="hover:underline">{t('footer.privacy')}</a>
          <span>|</span>
          <a href="#" className="hover:underline">{t('footer.newsletter')}</a>
          <span>|</span>
          <a href="#" className="hover:underline">{t('footer.about')}</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-3 pl-4 border-l border-white/20">
            <a href="#" className="hover:text-accent transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
