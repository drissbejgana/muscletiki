import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Dumbbell, Target, ChevronRight } from "lucide-react";

const routines = [
  {
    id: 1,
    title: "Full Body Strength",
    description: "A comprehensive full-body workout targeting all major muscle groups for balanced strength development.",
    level: "Beginner",
    duration: "45 min",
    daysPerWeek: 3,
    focus: ["Strength", "Full Body"],
    exercises: 8,
  },
  {
    id: 2,
    title: "Push Pull Legs Split",
    description: "Classic PPL split for intermediate lifters looking to maximize muscle growth with optimal recovery.",
    level: "Intermediate",
    duration: "60 min",
    daysPerWeek: 6,
    focus: ["Hypertrophy", "Split"],
    exercises: 6,
  },
  {
    id: 3,
    title: "Upper Lower Split",
    description: "Efficient 4-day program alternating between upper and lower body workouts for balanced development.",
    level: "Intermediate",
    duration: "50 min",
    daysPerWeek: 4,
    focus: ["Strength", "Hypertrophy"],
    exercises: 7,
  },
  {
    id: 4,
    title: "Bodyweight Basics",
    description: "No equipment needed! Build strength and endurance using only your body weight.",
    level: "Beginner",
    duration: "30 min",
    daysPerWeek: 3,
    focus: ["Calisthenics", "Endurance"],
    exercises: 10,
  },
  {
    id: 5,
    title: "Powerlifting Program",
    description: "Focus on the big three lifts: squat, bench press, and deadlift to maximize strength gains.",
    level: "Advanced",
    duration: "90 min",
    daysPerWeek: 4,
    focus: ["Powerlifting", "Strength"],
    exercises: 5,
  },
  {
    id: 6,
    title: "HIIT Fat Burner",
    description: "High-intensity interval training designed to torch calories and improve cardiovascular fitness.",
    level: "Intermediate",
    duration: "25 min",
    daysPerWeek: 4,
    focus: ["Cardio", "Fat Loss"],
    exercises: 12,
  },
];

const levels = ["All", "Beginner", "Intermediate", "Advanced"];

const Routines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredRoutines = routines.filter((routine) => {
    const matchesSearch = routine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || routine.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Intermediate":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Workout Routines
          </h1>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-8">
            Structured workout programs designed by experts to help you achieve your fitness goals.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search routines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>
      </section>

      {/* Level Filters */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
              className="transition-all duration-300"
            >
              {level}
            </Button>
          ))}
        </div>
      </section>

      {/* Routines Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine, index) => (
            <Card
              key={routine.id}
              className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {routine.title}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${getLevelColor(routine.level)} border shrink-0`}
                  >
                    {routine.level}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {routine.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Focus Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.focus.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">{routine.duration}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Target className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Days/Week</p>
                    <p className="text-sm font-semibold">{routine.daysPerWeek}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <Dumbbell className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-xs text-muted-foreground">Exercises</p>
                    <p className="text-sm font-semibold">{routine.exercises}</p>
                  </div>
                </div>
                
                <Button className="w-full group/btn">
                  View Routine
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRoutines.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No routines found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Routines;