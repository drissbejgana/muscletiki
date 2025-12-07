import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NavLink } from "@/components/NavLink";

type MacroDistribution = {
  carbs: number;
  protein: number;
  fat: number;
};

const MacroCalculator = () => {
  const [distribution, setDistribution] = useState("balanced");
  const [calories, setCalories] = useState(2000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [results, setResults] = useState<MacroDistribution | null>(null);

  const distributions: { [key: string]: MacroDistribution } = {
    balanced: { carbs: 40, protein: 30, fat: 30 },
    lowCarb: { carbs: 20, protein: 40, fat: 40 },
    highProtein: { carbs: 30, protein: 40, fat: 30 },
    keto: { carbs: 5, protein: 25, fat: 70 }
  };

  const calculateMacros = () => {
    const dist = distributions[distribution];
    
    // Calculate grams based on calories and percentages
    // 1g carbs = 4 kcal, 1g protein = 4 kcal, 1g fat = 9 kcal
    const carbsGrams = Math.round((calories * (dist.carbs / 100)) / 4);
    const proteinGrams = Math.round((calories * (dist.protein / 100)) / 4);
    const fatGrams = Math.round((calories * (dist.fat / 100)) / 9);

    setResults({ carbs: carbsGrams, protein: proteinGrams, fat: fatGrams });
  };

  const currentDist = distributions[distribution];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* <nav className="bg-background border-b mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <NavLink to="/">Programmes d'entraînement</NavLink>
            <NavLink to="/calculateur-calories">Calculateur de calories</NavLink>
            <NavLink to="/calculateur-macros">Calculateur de macros</NavLink>
          </div>
        </div>
      </nav> */}
      <div className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">
          Calculatrice de macros
        </h1>
        <p className="text-center text-muted-foreground mb-2">
          Calculez votre répartition optimale de macronutriments en fonction de vos besoins caloriques
        </p>
        <p className="text-center text-muted-foreground mb-8">
          et de vos objectifs de fitness.{" "}
          <a href="#" className="text-primary hover:underline">
            Lisez notre guide
          </a>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left: Macro Distribution Options */}
          <div className="bg-background border rounded-lg p-6">
            <Label className="text-sm font-bold text-foreground mb-4 block">
              Répartition des macros:
            </Label>
            <RadioGroup value={distribution} onValueChange={setDistribution}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <label htmlFor="balanced" className="text-sm cursor-pointer">
                    <span className="text-primary font-semibold">Équilibré</span>{" "}
                    <span className="text-muted-foreground">(40/30/30)</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lowCarb" id="lowCarb" />
                  <label htmlFor="lowCarb" className="text-sm cursor-pointer">
                    <span className="text-muted-foreground">Faible en glucides</span>{" "}
                    <span className="text-muted-foreground">(20/40/40)</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="highProtein" id="highProtein" />
                  <label htmlFor="highProtein" className="text-sm cursor-pointer">
                    <span className="text-muted-foreground">Riche en protéines</span>{" "}
                    <span className="text-muted-foreground">(30/40/30)</span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="keto" id="keto" />
                  <label htmlFor="keto" className="text-sm cursor-pointer">
                    <span className="text-muted-foreground">Cétogène</span>{" "}
                    <span className="text-muted-foreground">(5/25/70)</span>
                  </label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Center: Calorie Input */}
          <div className="bg-background border rounded-lg p-6 flex flex-col justify-between">
            <div>
              <Label className="text-sm font-bold text-foreground mb-4 block">
                Calories quotidiennes
              </Label>
              <div className="flex items-center gap-2 border rounded-md p-2 mb-4">
                <Input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto"
                  min={1000}
                  max={5000}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">kcal</span>
              </div>
              <Button
                onClick={calculateMacros}
                className="w-full mb-4 font-semibold"
              >
                Calculer les besoins quotidiens
              </Button>
            </div>
            <div>
              <Label className="text-sm font-bold text-foreground mb-2 block">
                Repas par jour
              </Label>
              <div className="flex items-center gap-2 border rounded-md p-2">
                <Input
                  type="number"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto"
                  min={1}
                  max={8}
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">/jour</span>
              </div>
            </div>
          </div>

          {/* Right: Current Distribution Display */}
          <div className="bg-background border rounded-lg p-6">
            <Label className="text-sm font-bold text-foreground mb-4 block">
              Répartition des macros
            </Label>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Glucides:</span>
                <span className="text-lg font-bold text-primary">{currentDist.carbs}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Protéines:</span>
                <span className="text-lg font-bold text-primary">{currentDist.protein}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lipides:</span>
                <span className="text-lg font-bold text-primary">{currentDist.fat}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-4">
            {/* Per Meal */}
            <div className="bg-background border-2 border-primary/20 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Glucides</div>
                  <div className="text-3xl font-bold text-primary">{Math.round(results.carbs / mealsPerDay)}g</div>
                  <div className="text-xs text-muted-foreground">par repas</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Protéines</div>
                  <div className="text-3xl font-bold text-primary">{Math.round(results.protein / mealsPerDay)}g</div>
                  <div className="text-xs text-muted-foreground">par repas</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Lipides</div>
                  <div className="text-3xl font-bold text-primary">{Math.round(results.fat / mealsPerDay)}g</div>
                  <div className="text-xs text-muted-foreground">par repas</div>
                </div>
              </div>
            </div>

            {/* Total Daily */}
            <div className="bg-background border rounded-lg p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Total Quotidien</div>
                  <div className="text-2xl font-bold text-foreground">{results.carbs}g Glucides</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Total Quotidien</div>
                  <div className="text-2xl font-bold text-foreground">{results.protein}g Protéines</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase mb-1">Total Quotidien</div>
                  <div className="text-2xl font-bold text-foreground">{results.fat}g Lipides</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
