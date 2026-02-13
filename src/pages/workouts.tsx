import { WorkoutCard } from "@/components/WorkoutCard";
import workout1 from "/assets/workout-1.jpg";
import workout2 from "/assets/workout-2.jpg";
import workout3 from "/assets/workout-3.jpg";
import { useTranslation } from "@/i18n";

const WorkoutPrograms = () => {
  const { t, lang } = useTranslation();

  const workoutPrograms = [
    {
      title: lang === 'fr' ? "Programme full body pour débutants - Jour 1" : "Full Body Beginner Program - Day 1",
      image: workout1, level: lang === 'fr' ? "Débutant" : "Beginner", type: lang === 'fr' ? "Prise de masse" : "Mass Gain",
      equipment: ["mat", "dumbbells", "resistance-band", "bench"],
      targetMuscles: { front: ["chest", "abs", "quads"], back: ["back"] },
      description: lang === 'fr' ? "Un programme complet pour débutants ciblant tous les groupes musculaires principaux. Idéal pour développer force et endurance de base." : "A complete beginner program targeting all major muscle groups. Ideal for building base strength and endurance.",
    },
    {
      title: lang === 'fr' ? "Musculation Full Body Débutant - Jour 2" : "Full Body Weight Training - Day 2",
      image: workout2, level: lang === 'fr' ? "Débutant" : "Beginner", type: lang === 'fr' ? "Prise de masse" : "Mass Gain",
      equipment: ["dumbbells", "bench"],
      targetMuscles: { front: ["chest"], back: ["back"] },
      description: lang === 'fr' ? "Séance axée sur le développement musculaire avec focus sur le haut du corps. Parfait pour construire une base solide." : "Session focused on muscle development with upper body emphasis. Perfect for building a solid foundation.",
    },
    {
      title: lang === 'fr' ? "Programme de musculation full-body pour débutant" : "Full-Body Beginner Weight Training Program",
      image: workout3, level: lang === 'fr' ? "Débutant" : "Beginner", type: lang === 'fr' ? "Prise de masse" : "Mass Gain",
      equipment: ["mat", "dumbbells", "resistance-band", "kettlebell"],
      targetMuscles: { front: ["abs", "quads"], back: ["glutes", "hamstrings"] },
      description: lang === 'fr' ? "Programme équilibré combinant exercices au poids du corps et avec équipement. Développe force fonctionnelle et masse musculaire." : "Balanced program combining bodyweight and equipment exercises. Develops functional strength and muscle mass.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('workouts.title')}</h1>
          <p className="text-muted-foreground">{t('workouts.subtitle')}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPrograms.map((program, index) => (<WorkoutCard key={index} {...program} />))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPrograms;
