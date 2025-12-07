import BodyDiagram from "@/components/BodyDiagram";
import ViewToggle from "@/components/ViewToggle";
import EquipmentPanel from "@/components/EquipmentPanel";
import { useContext } from "react";
import MyContext from "@/contexts/MyContext";
import MobileViewToggle from "@/components/MobileViewToggle";
import MobileBodyView from "@/components/MobileBodyView";
import MobileHeader from "@/components/MobileHeader";
import MobileFeatured from "@/components/MobileFeatured";

const Index = () => {
    const { advanced} = useContext(MyContext);
  return (
   <div>
      <div className="lg:hidden flex flex-col h-screen overflow-hidden">
        {/* <MobileHeader /> */}
        {/* <MobileViewToggle /> */}
        <MobileBodyView />
        <MobileFeatured />
      </div>
      
    <div className="hidden lg:flex gap-4">
      <BodyDiagram advanced={advanced} />
      <div className="w-80">
        <ViewToggle />
        <EquipmentPanel />
      </div>
    </div>

   </div>
  );
};

export default Index;
