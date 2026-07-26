import BodyFrontSVG from "./BodyFrontSVG";
import BodyBackSVG from "./BodyBackSVG";
import { FemalBodyBack } from "./FemalBodyBack";
import { InteractiveBodyMap } from "./FemalBodyFront";

const BodyDiagram = ({ advanced, gendre }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-card border border-primary/15 rounded-2xl p-6 min-h-[480px] card-elevated surface-tint">
      <div className="relative max-w-2xl w-full flex items-center justify-center gap-6 py-4">
        <div className="relative flex-1 flex items-center justify-center">
          {gendre ? <InteractiveBodyMap /> : <BodyFrontSVG advanced={advanced} />}
        </div>
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-primary/40 to-transparent shrink-0" />
        <div className="relative flex-1 flex items-center justify-center">
          {gendre ? <FemalBodyBack /> : <BodyBackSVG advanced={advanced} />}
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-4 text-center">
        <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
        Click a muscle to explore exercises
      </p>
    </div>
  );
};

export default BodyDiagram;
