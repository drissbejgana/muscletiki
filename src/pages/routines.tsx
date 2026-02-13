import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Dumbbell, Target, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n";

const Routines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const { t } = useTranslation();

  const routineKeys = ["fullBody", "ppl", "upperLower", "bodyweight", "powerlifting", "hiit"] as const;

  const routines = [
    { id: 1, key: "fullBody", level: "Beginner", duration: "45 min", daysPerWeek: 3, focus: ["Strength", "Full Body"], exercises: 8 },
    { id: 2, key: "ppl", level: "Intermediate", duration: "60 min", daysPerWeek: 6, focus: ["Hypertrophy", "Split"], exercises: 6 },
    { id: 3, key: "upperLower", level: "Intermediate", duration: "50 min", daysPerWeek: 4, focus: ["Strength", "Hypertrophy"], exercises: 7 },
    { id: 4, key: "bodyweight", level: "Beginner", duration: "30 min", daysPerWeek: 3, focus: ["Calisthenics", "Endurance"], exercises: 10 },
    { id: 5, key: "powerlifting", level: "Advanced", duration: "90 min", daysPerWeek: 4, focus: ["Powerlifting", "Strength"], exercises: 5 },
    { id: 6, key: "hiit", level: "Intermediate", duration: "25 min", daysPerWeek: 4, focus: ["Cardio", "Fat Loss"], exercises: 12 },
  ];

  const levelKeys = { "Beginner": "routines.beginner", "Intermediate": "routines.intermediate", "Advanced": "routines.advanced" };
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredRoutines = routines.filter((r) => {
    const title = t(`routines.items.${r.key}.title`);
    const desc = t(`routines.items.${r.key}.description`);
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "All" || r.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "Intermediate": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('routines.title')}</h1>
          <p className="text-muted-foreground text-center text-lg max-w-2xl mx-auto mb-8">{t('routines.subtitle')}</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('routines.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-card border-border" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {levels.map((level) => (
            <Button key={level} variant={selectedLevel === level ? "default" : "outline"} size="sm" onClick={() => setSelectedLevel(level)}>
              {level === "All" ? t('routines.all') : t(levelKeys[level])}
            </Button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutines.map((routine, index) => (
            <Card key={routine.id} className="group bg-card border-border shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02]" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{t(`routines.items.${routine.key}.title`)}</CardTitle>
                  <Badge variant="outline" className={`${getLevelColor(routine.level)} border shrink-0`}>{t(levelKeys[routine.level])}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{t(`routines.items.${routine.key}.description`)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.focus.map((tag) => (<Badge key={tag} variant="secondary" className="text-xs">{t(`routines.focus.${tag}`)}</Badge>))}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div className="p-2 rounded-lg bg-muted/50"><Clock className="h-4 w-4 mx-auto mb-1 text-primary" /><p className="text-xs text-muted-foreground">{t('routines.duration')}</p><p className="text-sm font-semibold">{routine.duration}</p></div>
                  <div className="p-2 rounded-lg bg-muted/50"><Target className="h-4 w-4 mx-auto mb-1 text-primary" /><p className="text-xs text-muted-foreground">{t('routines.daysWeek')}</p><p className="text-sm font-semibold">{routine.daysPerWeek}</p></div>
                  <div className="p-2 rounded-lg bg-muted/50"><Dumbbell className="h-4 w-4 mx-auto mb-1 text-primary" /><p className="text-xs text-muted-foreground">{t('routines.exercises')}</p><p className="text-sm font-semibold">{routine.exercises}</p></div>
                </div>
                <Button className="w-full group/btn">{t('routines.viewRoutine')}<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredRoutines.length === 0 && (<div className="text-center py-16"><p className="text-muted-foreground text-lg">{t('routines.noRoutines')}</p></div>)}
      </section>
    </div>
  );
};

export default Routines;
