import { useContext, useState } from "react";
import BodyFrontSVG from "./BodyFrontSVG";
import BodyBackSVG from "./BodyBackSVG";
import { FemalBodyBack } from "./FemalBodyBack";
import { InteractiveBodyMap } from "./FemalBodyFront";
import { Button } from "@/components/ui/button";
import MyContext from "@/contexts/MyContext";
import { useNavigate } from "react-router-dom";

const MobileBodyView = () => {
  const [view, setView] = useState<"front" | "back">("front");
  const { advanced, updateAdvanced, homme, updateHomme } = useContext(MyContext);
  const navigate = useNavigate();

  return (
    <div className="relative flex-1 flex items-center justify-center bg-white p-4 overflow-hidden">
      {/* Main body diagram */}
      <div className="w-full max-w-sm h-full flex items-center justify-center relative">
        {view === "front" ? (
          homme ? <InteractiveBodyMap /> : <BodyFrontSVG advanced={advanced} />
        ) : (
          homme ? <FemalBodyBack /> : <BodyBackSVG advanced={advanced} />
        )}
        
        {/* Four buttons around the body map */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* Top button - Gender toggle */}
          <div className="flex justify-center gap-2 pointer-events-auto">
            <Button 
              onClick={() => updateHomme(false)}
              variant="outline" 
              className={`font-medium px-4 py-2 rounded-lg shadow-sm transition-colors ${
                !homme 
                  ? "bg-[#2B4C8F] text-white border-[#2B4C8F]" 
                  : "bg-white text-[#2B4C8F] border-[#2B4C8F]"
              }`}
            >
              Male
            </Button>
            <Button 
              onClick={() => updateHomme(true)}
              variant="outline" 
              className={`font-medium px-4 py-2 rounded-lg shadow-sm transition-colors ${
                homme 
                  ? "bg-[#2B4C8F] text-white border-[#2B4C8F]" 
                  : "bg-white text-[#2B4C8F] border-[#2B4C8F]"
              }`}
            >
              Female
            </Button>
          </div>
          
          {/* Middle row with left and right buttons */}
          <div className="flex justify-between items-center px-4 pointer-events-auto">
            {/* Left button - Standard */}
            <Button 
              onClick={() => updateAdvanced(false)}
              variant="outline" 
              className={`font-medium px-4 py-2 rounded-lg shadow-sm transition-colors ${
                !advanced 
                  ? "bg-[#2B4C8F] text-white border-[#2B4C8F]" 
                  : "bg-white text-[#2B4C8F] border-[#2B4C8F]"
              }`}
            >
              Standard
            </Button>
            
            {/* Right button - Featured (Advanced) */}
            <Button 
              onClick={() => updateAdvanced(true)}
              variant="outline" 
              className={`font-medium px-4 py-2 rounded-lg shadow-sm transition-colors ${
                advanced 
                  ? "bg-[#2B4C8F] text-white border-[#2B4C8F]" 
                  : "bg-white text-[#2B4C8F] border-[#2B4C8F]"
              }`}
            >
              Advanced
            </Button>
          </div>
          
          {/* Bottom button */}
          <div className="flex justify-center pointer-events-auto">
            <Button 
              onClick={() => navigate(`/workout`)}
              variant="outline" 
              className="bg-white border-[#2B4C8F] text-[#2B4C8F] font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              entraînements
            </Button>
          </div>
        </div>
      </div>

      {/* Body map toggle with SVG images in bottom-right corner */}
      <div className="absolute bottom-14 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => setView("front")}
          className="p-1 rounded-md transition-all"
        >
          <div className={`w-11 h-11 pointer-events-none ${view === "front" ? "text-white" : "text-gray-400"}`}>
            {homme ? <InteractiveBodyMap /> : <BodyFrontSVG advanced={advanced} />}
          </div>
        </button>
        
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        
        <button
          onClick={() => setView("back")}
          className="p-1 rounded-md transition-all"
        >
          <div className={`w-11 h-11 pointer-events-none ${view === "back" ? "text-white" : "text-gray-400"}`}>
            {homme ? <FemalBodyBack /> : <BodyBackSVG advanced={advanced} />}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MobileBodyView;