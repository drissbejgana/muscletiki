import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CalorieCalculator = () => {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState(18);
  const [height, setHeight] = useState(150);
  const [weight, setWeight] = useState(100);
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [goal, setGoal] = useState("maintain");

  const calculateCalories = () => {
    // BMR calculation using Harris-Benedict equation
    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal adjustments
    let calories = tdee;
    if (goal === "lose") calories -= 500;
    if (goal === "gain") calories += 500;

    alert(`Vos besoins caloriques quotidiens: ${Math.round(calories)} calories`);
  };

  const getSurroundingNumbers = (value: number, min: number, max: number) => {
    return Array.from({ length: 5 }, (_, i) => value - 2 + i).filter(n => n >= min && n <= max);
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">
          CALCULATRICE DE CALORIES
        </h1>
        <p className="text-center text-muted-foreground mb-2">
          Calculez vos besoins caloriques quotidiens en fonction de vos informations personnelles et de votre niveau d'activité.
        </p>
        <p className="text-center text-muted-foreground mb-8">
          Utilise l'équation de Harris-Benedict pour un calcul précis du BMR.
        </p>

        <div className="space-y-6">
          {/* Gender */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">GENDER:</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setGender("male")}
                variant={gender === "male" ? "default" : "outline"}
                className="h-12 font-semibold"
              >
                MALE
              </Button>
              <Button
                type="button"
                onClick={() => setGender("female")}
                variant={gender === "female" ? "default" : "outline"}
                className="h-12 font-semibold"
              >
                FEMALE
              </Button>
            </div>
          </div>

          {/* Units */}
          <div>
            <Label className="text-sm font-bold text-primary mb-2 block">UNITS:</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setUnits("metric")}
                variant={units === "metric" ? "default" : "outline"}
                className="h-12 font-semibold"
              >
                METRIC UNITS
              </Button>
              <Button
                type="button"
                onClick={() => setUnits("imperial")}
                variant={units === "imperial" ? "default" : "outline"}
                className="h-12 font-semibold"
              >
                IMPERIAL UNITS
              </Button>
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Age */}
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">AGE:</Label>
              <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto text-center"
                  min={13}
                  max={99}
                />
                <div className="border-l h-8 mx-2" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">13-99</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                {getSurroundingNumbers(age, 13, 99).map((n) => (
                  <span key={n} className={n === age ? "text-primary font-bold" : ""}>
                    {n}
                  </span>
                ))}
              </div>
              <Slider
                value={[age]}
                onValueChange={(v) => setAge(v[0])}
                min={13}
                max={99}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Height */}
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">HEIGHT:</Label>
              <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto text-center"
                  min={units === "metric" ? 100 : 40}
                  max={units === "metric" ? 250 : 100}
                />
                <div className="border-l h-8 mx-2" />
                <span className="text-sm font-semibold">{units === "metric" ? "CM" : "IN"}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                {getSurroundingNumbers(height, units === "metric" ? 100 : 40, units === "metric" ? 250 : 100).map((n) => (
                  <span key={n} className={n === height ? "text-primary font-bold" : ""}>
                    {n}
                  </span>
                ))}
              </div>
              <Slider
                value={[height]}
                onValueChange={(v) => setHeight(v[0])}
                min={units === "metric" ? 100 : 40}
                max={units === "metric" ? 250 : 100}
                step={1}
                className="mt-2"
              />
            </div>

            {/* Weight */}
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">WEIGHT:</Label>
              <div className="flex items-center gap-2 bg-background border rounded-md p-3">
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="text-2xl font-bold border-0 p-0 h-auto text-center"
                  min={units === "metric" ? 30 : 65}
                  max={units === "metric" ? 200 : 440}
                />
                <div className="border-l h-8 mx-2" />
                <span className="text-sm font-semibold">{units === "metric" ? "KG" : "LB"}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                {getSurroundingNumbers(weight, units === "metric" ? 30 : 65, units === "metric" ? 200 : 440).map((n) => (
                  <span key={n} className={n === weight ? "text-primary font-bold" : ""}>
                    {n}
                  </span>
                ))}
              </div>
              <Slider
                value={[weight]}
                onValueChange={(v) => setWeight(v[0])}
                min={units === "metric" ? 30 : 65}
                max={units === "metric" ? 200 : 440}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Activity Level and Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">ACTIVITY LEVEL</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="sedentary">Sédentaire (peu/pas d'exercise)</SelectItem>
                  <SelectItem value="light">Léger (1-3 jours/semaine)</SelectItem>
                  <SelectItem value="moderate">Modéré (3-5 jours/semaine)</SelectItem>
                  <SelectItem value="active">Actif (6-7 jours/semaine)</SelectItem>
                  <SelectItem value="veryActive">Très actif (2x par jour)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-bold text-primary mb-2 block">GOAL</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="lose">Perdre du poids</SelectItem>
                  <SelectItem value="maintain">Maintenir le poids</SelectItem>
                  <SelectItem value="gain">Prendre du poids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={calculateCalories}
              size="lg"
              className="h-12 px-16 text-base font-bold"
            >
              CALCULER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
