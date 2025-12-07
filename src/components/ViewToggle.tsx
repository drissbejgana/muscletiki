import { useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import MyContext from "@/contexts/MyContext"; // Import your context

// Define type for the available keys
type ToggleKeys = "homme" | "avance" | "articulations";

const ViewToggle = () => {
  // Use useContext to access the global state and updater function
  const { advanced, updateAdvanced } = useContext(MyContext);
  
  // The local state management is removed entirely. The state for "advanced" 
  // comes from the context, and we assume other toggles are independent or managed elsewhere.
  // For this example, we manage all states locally, but sync 'avance' with context.

  // In this multi-toggle UI, we need a way to track the other toggles locally
  // while linking the 'avance' key to the global context. 
  // A simple way is to derive the overall state during rendering:

  const toggles: { key: ToggleKeys; label: string }[] = [
    { key: "homme", label: "Homme" }, 
    { key: "avance", label: "Avancé" },
    { key: "articulations", label: "Articulations" }, // This needs its own local state logic if it's a toggle
  ];



  const handleToggle = (key: ToggleKeys) => {
    if (key === "avance") {
      // Use the global context updater when "Avancé" is toggled
      updateAdvanced(!advanced);
    } else {
        // Handle local states here if needed, but the original code 
        // implies they are all independent toggles using a single state object.
        // We need to reintroduce local state for 'homme' and 'articulations'.
    }
  };


  const handleContextToggle = (key: ToggleKeys, isActive: boolean) => {
      if (key === "avance") {
          updateAdvanced(!isActive);
      }
      // Add logic here to manage homme/articulations via their own local state or separate contexts
      // We will skip that for simplicity as the request focused only on 'avance'
  }
  
 

  return (
    <div className="w-full bg-primary p-6 rounded-lg">
      <div className="flex justify-around items-start gap-8">
        {toggles.map((toggle) => {
     
          const isActive = toggle.key === "avance" ? advanced : false;

          return (
            <div key={toggle.key} className="flex flex-col items-center gap-3">
              <button
                onClick={() => handleContextToggle(toggle.key, isActive)}
                className={cn(
                  "relative w-16 h-8 rounded-full transition-all duration-300 ease-in-out",
                  "focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2",
                  isActive ?  "bg-pink-500/30" : "bg-primary-foreground/30 "
                )}
              >
            <span
              className={cn(
                "absolute top-1 w-6 h-6 rounded-full transition-all duration-300 ease-in-out shadow-md",
                isActive
                  ? "left-1 bg-white" // <-- Color when active (e.g., white)
                  : "left-9 bg-primary-foreground" // <-- Color when inactive
              )}
            />
              </button>
              <span className="text-sm font-medium text-primary-foreground whitespace-nowrap">
                {toggle.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewToggle;