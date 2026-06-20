import { Youtube, Instagram, Twitter, Facebook, Dumbbell } from "lucide-react";
import { useTranslation } from "@/i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-sm">
              <span className="text-primary">Muscle</span>
              <span className="text-foreground">Tiki</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { key: 'footer.terms' },
              { key: 'footer.privacy' },
              { key: 'footer.newsletter' },
              { key: 'footer.about' },
            ].map(({ key }) => (
              <a
                key={key}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(key)}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[Youtube, Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/15 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
