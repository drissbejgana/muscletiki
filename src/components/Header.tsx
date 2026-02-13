import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/i18n";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="bg-card z-50 border-b border-border px-4 py-3 flex items-center justify-between gap-4">
      <SidebarTrigger />

      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        <div className="relative flex-1 max-w-md hidden md:flex">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('common.search')}
            className="pl-10 w-full"
          />
        </div>

        <Button onClick={() => navigate('/profile')} variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
