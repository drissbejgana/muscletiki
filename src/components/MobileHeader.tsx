import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "./AppSidebar";

const MobileHeader = () => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Dumbbell className="w-6 h-6 text-[#2B4C8F]" />
        <span className="font-bold text-lg text-[#2B4C8F]">MUSCLEWIKI</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2 h-8 px-2">
          <span className="text-lg">🇫🇷</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-64 bg-[#2B4C8F] z-[60]">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileHeader;
