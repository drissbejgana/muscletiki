import { Button } from "@/components/ui/button";
import { User, Dumbbell, Heart, Zap } from "lucide-react";

const MobileViewToggle = () => {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-border mt-[60px]">
      <Button 
        variant="outline" 
        size="sm"
        className="rounded-full border-2 border-[#2B4C8F] text-[#2B4C8F] hover:bg-[#2B4C8F] hover:text-white whitespace-nowrap"
      >
        Homme
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="rounded-full border-2 border-border hover:border-[#2B4C8F] whitespace-nowrap p-2"
      >
        <User className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="rounded-full border-2 border-border hover:border-[#2B4C8F] whitespace-nowrap"
      >
        Cardio
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="rounded-full border-2 border-border hover:border-[#2B4C8F] whitespace-nowrap flex-shrink-0"
      >
        Générateur d'entraînements
      </Button>
    </div>
  );
};

export default MobileViewToggle;
