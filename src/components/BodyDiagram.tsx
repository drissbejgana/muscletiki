import BodyFrontSVG from "./BodyFrontSVG";
import BodyBackSVG from "./BodyBackSVG";
import { FemalBodyBack } from "./FemalBodyBack";
import { InteractiveBodyMap } from "./FemalBodyFront";

const BodyDiagram = ({ advanced, gendre }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-card border border-border rounded-xl p-6 min-h-[480px]">
      <div className="relative max-w-2xl w-full flex items-center justify-center gap-6 py-4">
        <div className="relative flex-1 flex items-center justify-center">
          {gendre ? <InteractiveBodyMap /> : <BodyFrontSVG advanced={advanced} />}
        </div>
        <div className="w-px h-64 bg-border/60 shrink-0" />
        <div className="relative flex-1 flex items-center justify-center">
          {gendre ? <FemalBodyBack /> : <BodyBackSVG advanced={advanced} />}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Click a muscle to explore exercises
      </p>
    </div>
  );
};

export default BodyDiagram;
