import { WorkoutCard } from "@/components/WorkoutCard";
import workout1 from "/assets/workout-1.jpg";
import workout2 from "/assets/workout-2.jpg";
import workout3 from "/assets/workout-3.jpg";

const workoutPrograms = [
  {
    title: "Programme full body pour débutants - Jour 1",
    image: workout1,
    level: "Débutant",
    type: "Prise de masse",
    equipment: ["mat", "dumbbells", "resistance-band", "bench"],
    targetMuscles: {
      front: ["chest", "abs", "quads"],
      back: ["back"],
    },
    description:
      "Un programme complet pour débutants ciblant tous les groupes musculaires principaux. Idéal pour développer force et endurance de base.",
  },
  {
    title: "Musculation Full Body Débutant - Jour 2",
    image: workout2,
    level: "Débutant",
    type: "Prise de masse",
    equipment: ["dumbbells", "bench"],
    targetMuscles: {
      front: ["chest"],
      back: ["back"],
    },
    description:
      "Séance axée sur le développement musculaire avec focus sur le haut du corps. Parfait pour construire une base solide.",
  },
  {
    title: "Programme de musculation full-body pour débutant",
    image: workout3,
    level: "Débutant",
    type: "Prise de masse",
    equipment: ["mat", "dumbbells", "resistance-band", "kettlebell"],
    targetMuscles: {
      front: ["abs", "quads"],
      back: ["glutes", "hamstrings"],
    },
    description:
      "Programme équilibré combinant exercices au poids du corps et avec équipement. Développe force fonctionnelle et masse musculaire.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Programmes d'Entraînement
          </h1>
          <p className="text-muted-foreground">
            Découvrez nos programmes de musculation pour tous niveaux
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPrograms.map((program, index) => (
            <WorkoutCard key={index} {...program} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
