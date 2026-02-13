import { useTranslation, Language } from '@/i18n';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang, t } = useTranslation();

  const toggle = () => {
    setLang(lang === 'fr' ? 'en' : 'fr');
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={toggle}>
      <span className="text-lg">{t('common.languageFlag')}</span>
      {!compact && t('common.language')}
    </Button>
  );
};

export default LanguageSwitcher;
