import BodyFrontSVG from "./BodyFrontSVG";
import BodyBackSVG from "./BodyBackSVG";
import { FemalBodyBack } from "./FemalBodyBack";
import { InteractiveBodyMap } from "./FemalBodyFront";

const BodyDiagram = ({advanced,gendre}) => {
  console.log(advanced,gendre)
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-card rounded-lg p-8">
      <div className="relative max-w-3xl w-full aspect-[2/1] flex items-center justify-center gap-8">
        <div className="relative w-1/2 h-full flex items-center justify-center">
          {gendre ? <InteractiveBodyMap/> : <BodyFrontSVG advanced={advanced} />} 
        </div>
        <div className="relative w-1/2 h-full flex items-center justify-center">
          {gendre ? <FemalBodyBack/> : <BodyBackSVG advanced={advanced} />} 
        </div>
      </div>
    </div>
  );
};

export default BodyDiagram;
