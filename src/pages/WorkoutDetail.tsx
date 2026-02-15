import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, ChevronDown, ChevronUp, Clock, Dumbbell, Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

// ─── Workout Data ────────────────────────────────────────────────────────────

const workoutPrograms = {
  en: [
    {
      id: "full-body-day-1",
      title: "Full Body Beginner Program - Day 1",
      level: "Beginner",
      type: "Mass Gain",
      duration: "45 min",
      equipment: ["mat", "dumbbells", "resistance-band", "bench"],
      targetMuscles: ["Chest", "Abs", "Quads", "Back"],
      description:
        "A complete beginner program targeting all major muscle groups. Ideal for building base strength and endurance.",
      exercises: [
        {
          id: 1,
          name: "Push Ups",
          sets: 3,
          reps: "10-12",
          rest: "60s",
          muscles: ["Chest", "Triceps", "Shoulders"],
          tips: "Keep your core tight and body in a straight line throughout the movement.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-side.mp4",
          steps: [
            "Start in a high plank with hands slightly wider than shoulder-width.",
            "Lower your chest toward the floor, keeping elbows at 45°.",
            "Push back up to the starting position and repeat.",
          ],
        },
        {
          id: 2,
          name: "Dumbbell Row",
          sets: 3,
          reps: "10 each",
          rest: "60s",
          muscles: ["Back", "Biceps"],
          tips: "Keep your back flat and pull your elbow toward the ceiling.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-side.mp4",
          steps: [
            "Place one knee and hand on a bench for support.",
            "Hold a dumbbell in the other hand, arm extended.",
            "Pull the dumbbell to your hip, squeezing your back at the top.",
            "Lower slowly and repeat.",
          ],
        },
        {
          id: 3,
          name: "Bodyweight Squats",
          sets: 3,
          reps: "15",
          rest: "60s",
          muscles: ["Quads", "Glutes", "Hamstrings"],
          tips: "Keep your chest up and knees tracking over your toes.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-squat-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-squat-side.mp4",
          steps: [
            "Stand with feet shoulder-width apart, toes slightly out.",
            "Lower your hips until thighs are parallel to the floor.",
            "Drive through your heels to return to standing.",
          ],
        },
        {
          id: 4,
          name: "Plank",
          sets: 3,
          reps: "30s hold",
          rest: "45s",
          muscles: ["Abs", "Core", "Shoulders"],
          tips: "Squeeze your glutes and abs — don't let your hips sag.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-forearm-plank-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-forarm-plank-side.mp4",
          steps: [
            "Place forearms on the ground, elbows under shoulders.",
            "Lift your body forming a straight line from head to heels.",
            "Hold the position, breathing steadily.",
          ],
        },
        {
          id: 5,
          name: "Resistance Band Pull Apart",
          sets: 3,
          reps: "15",
          rest: "45s",
          muscles: ["Rear Delts", "Upper Back"],
          tips: "Keep arms straight and pull to chest height, not above.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-pull-apart-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-pull-apart-side.mp4",
          steps: [
            "Hold the band in front of you with both hands at shoulder width.",
            "Keep arms straight and pull the band apart to chest level.",
            "Slowly return to starting position and repeat.",
          ],
        },
      ],
    },
    {
      id: "full-body-day-2",
      title: "Full Body Weight Training - Day 2",
      level: "Beginner",
      type: "Mass Gain",
      duration: "40 min",
      equipment: ["dumbbells", "bench"],
      targetMuscles: ["Chest", "Back"],
      description:
        "Session focused on muscle development with upper body emphasis. Perfect for building a solid foundation.",
      exercises: [
        {
          id: 1,
          name: "Dumbbell Bench Press",
          sets: 4,
          reps: "10-12",
          rest: "90s",
          muscles: ["Chest", "Triceps", "Shoulders"],
          tips: "Lower the dumbbells to chest level, don't bounce off your chest.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bench-press-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bench-press-side.mp4",
          steps: [
            "Lie on a bench holding dumbbells at chest height.",
            "Press the dumbbells up until your arms are fully extended.",
            "Lower slowly back to starting position.",
          ],
        },
        {
          id: 2,
          name: "Dumbbell Bent Over Row",
          sets: 4,
          reps: "10-12",
          rest: "90s",
          muscles: ["Back", "Biceps", "Rear Delts"],
          tips: "Hinge at the hips, keep your spine neutral throughout.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-side.mp4",
          steps: [
            "Hinge forward at the hips, holding dumbbells with arms extended.",
            "Row both dumbbells to your hips simultaneously.",
            "Squeeze your shoulder blades at the top, then lower.",
          ],
        },
        {
          id: 3,
          name: "Dumbbell Shoulder Press",
          sets: 3,
          reps: "10-12",
          rest: "75s",
          muscles: ["Shoulders", "Triceps"],
          tips: "Don't arch your back — engage your core throughout.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-side.mp4",
          steps: [
            "Sit on a bench, dumbbells at shoulder height, palms forward.",
            "Press overhead until arms are fully extended.",
            "Lower back to shoulder height and repeat.",
          ],
        },
        {
          id: 4,
          name: "Dumbbells Curl",
          sets: 3,
          reps: "12",
          rest: "60s",
          muscles: ["Biceps"],
          tips: "Keep elbows pinned to your sides — no swinging.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-curl-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-curl-side.mp4",
          steps: [
            "Stand straight with a dumbbell in each hand at arm's length.",
            "Curl one dumbbell while twisting your forearm upward.",
            "Lower and alternate arms.",
          ],
        },
      ],
    },
    {
      id: "full-body-day-3",
      title: "Full-Body Beginner Weight Training Program",
      level: "Beginner",
      type: "Mass Gain",
      duration: "50 min",
      equipment: ["mat", "dumbbells", "resistance-band", "kettlebell"],
      targetMuscles: ["Abs", "Quads", "Glutes", "Hamstrings"],
      description:
        "Balanced program combining bodyweight and equipment exercises. Develops functional strength and muscle mass.",
      exercises: [
        {
          id: 1,
          name: "Kettlebell Swing",
          sets: 4,
          reps: "15",
          rest: "75s",
          muscles: ["Glutes", "Hamstrings", "Core"],
          tips: "Drive with your hips — it's a hip hinge, not a squat.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-kettlebell-swing-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-kettlebell-swing-side.mp4",
          steps: [
            "Stand with feet hip-width apart, kettlebell between your feet.",
            "Hinge at hips, grip the bell and swing it back between your legs.",
            "Drive hips forward explosively to swing the bell to chest height.",
            "Let it swing back and repeat in a fluid motion.",
          ],
        },
        {
          id: 2,
          name: "Leg Raises",
          sets: 3,
          reps: "12",
          rest: "60s",
          muscles: ["Abs", "Hip Flexors"],
          tips: "Lower your legs slowly — don't let them drop.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-leg-raises-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-leg-raises-side.mp4",
          steps: [
            "Lay on your back with arms at your sides.",
            "Keep legs together and straight.",
            "Raise them to 90° then lower slowly without touching the floor.",
          ],
        },
        {
          id: 3,
          name: "Dumbbell Lunges",
          sets: 3,
          reps: "10 each leg",
          rest: "75s",
          muscles: ["Quads", "Glutes", "Hamstrings"],
          tips: "Keep your front knee above your ankle, not past your toes.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lunge-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lunge-side.mp4",
          steps: [
            "Stand holding dumbbells at your sides.",
            "Step forward with one leg and lower your back knee toward the floor.",
            "Push back to standing and alternate legs.",
          ],
        },
        {
          id: 4,
          name: "Russian Twist",
          sets: 3,
          reps: "20 total",
          rest: "60s",
          muscles: ["Abs", "Obliques"],
          tips: "Slow and controlled — feel the rotation in your core, not your arms.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-russian-twist-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-russian-twist-side.mp4",
          steps: [
            "Sit on the floor, knees bent, feet hovering or on the floor.",
            "Hold a dumbbell or clasp hands together.",
            "Rotate your torso left and right to engage the obliques.",
          ],
        },
        {
          id: 5,
          name: "Resistance Band Squat",
          sets: 3,
          reps: "15",
          rest: "60s",
          muscles: ["Quads", "Glutes"],
          tips: "Keep the band just above your knees to activate glutes.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-squat-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-squat-side.mp4",
          steps: [
            "Place a resistance band just above your knees.",
            "Stand with feet shoulder-width apart.",
            "Squat down, pushing your knees out against the band.",
            "Return to standing and repeat.",
          ],
        },
      ],
    },
  ],
  fr: [
    {
      id: "full-body-day-1",
      title: "Programme full body pour débutants - Jour 1",
      level: "Débutant",
      type: "Prise de masse",
      duration: "45 min",
      equipment: ["tapis", "haltères", "élastique", "banc"],
      targetMuscles: ["Pectoraux", "Abdominaux", "Quadriceps", "Dos"],
      description:
        "Un programme complet pour débutants ciblant tous les groupes musculaires principaux. Idéal pour développer force et endurance de base.",
      exercises: [
        {
          id: 1,
          name: "Pompes",
          sets: 3,
          reps: "10-12",
          rest: "60s",
          muscles: ["Pectoraux", "Triceps", "Épaules"],
          tips: "Gardez le corps gainé et en ligne droite tout au long du mouvement.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-pushup-side.mp4",
          steps: [
            "Positionnez-vous en planche haute, mains légèrement plus larges que les épaules.",
            "Descendez la poitrine vers le sol, coudes à 45°.",
            "Poussez vers le haut pour revenir à la position de départ.",
          ],
        },
        {
          id: 2,
          name: "Rowing haltère",
          sets: 3,
          reps: "10 de chaque",
          rest: "60s",
          muscles: ["Dos", "Biceps"],
          tips: "Gardez le dos plat et tirez le coude vers le plafond.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-side.mp4",
          steps: [
            "Placez un genou et une main sur un banc pour le soutien.",
            "Tenez un haltère dans l'autre main, bras tendu.",
            "Ramenez l'haltère vers la hanche en serrant le dos.",
            "Redescendez lentement et répétez.",
          ],
        },
        {
          id: 3,
          name: "Squats au poids du corps",
          sets: 3,
          reps: "15",
          rest: "60s",
          muscles: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
          tips: "Gardez la poitrine haute et les genoux dans l'axe des pieds.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-squat-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-squat-side.mp4",
          steps: [
            "Tenez-vous debout, pieds à largeur d'épaules, orteils légèrement tournés.",
            "Descendez les hanches jusqu'à ce que les cuisses soient parallèles au sol.",
            "Poussez sur vos talons pour revenir debout.",
          ],
        },
        {
          id: 4,
          name: "Gainage",
          sets: 3,
          reps: "30s maintenu",
          rest: "45s",
          muscles: ["Abdominaux", "Core", "Épaules"],
          tips: "Serrez les fessiers et les abdos — ne laissez pas les hanches s'affaisser.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-forearm-plank-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-forarm-plank-side.mp4",
          steps: [
            "Appuyez les avant-bras au sol, coudes sous les épaules.",
            "Soulevez le corps en formant une ligne droite de la tête aux talons.",
            "Maintenez la position en respirant régulièrement.",
          ],
        },
        {
          id: 5,
          name: "Écartement de bande élastique",
          sets: 3,
          reps: "15",
          rest: "45s",
          muscles: ["Deltoïdes postérieurs", "Haut du dos"],
          tips: "Gardez les bras tendus et écartez à hauteur de poitrine, pas au-dessus.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-pull-apart-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-pull-apart-side.mp4",
          steps: [
            "Tenez l'élastique devant vous, mains à largeur d'épaules.",
            "Bras tendus, écartez l'élastique jusqu'à hauteur de poitrine.",
            "Revenez lentement à la position de départ.",
          ],
        },
      ],
    },
    {
      id: "full-body-day-2",
      title: "Musculation Full Body Débutant - Jour 2",
      level: "Débutant",
      type: "Prise de masse",
      duration: "40 min",
      equipment: ["haltères", "banc"],
      targetMuscles: ["Pectoraux", "Dos"],
      description:
        "Séance axée sur le développement musculaire avec focus sur le haut du corps. Parfait pour construire une base solide.",
      exercises: [
        {
          id: 1,
          name: "Développé couché haltères",
          sets: 4,
          reps: "10-12",
          rest: "90s",
          muscles: ["Pectoraux", "Triceps", "Épaules"],
          tips: "Descendez les haltères jusqu'à la hauteur des pectoraux, sans rebondir.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bench-press-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bench-press-side.mp4",
          steps: [
            "Allongez-vous sur un banc, haltères à hauteur de poitrine.",
            "Poussez les haltères vers le haut jusqu'à extension complète.",
            "Redescendez lentement à la position de départ.",
          ],
        },
        {
          id: 2,
          name: "Rowing haltères penché",
          sets: 4,
          reps: "10-12",
          rest: "90s",
          muscles: ["Dos", "Biceps", "Deltoïdes postérieurs"],
          tips: "Penchez-vous à la hanche, gardez la colonne neutre.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-bent-over-row-side.mp4",
          steps: [
            "Penchez-vous en avant à la hanche, haltères en mains, bras tendus.",
            "Ramenez les deux haltères vers les hanches simultanément.",
            "Serrez les omoplates en haut, puis redescendez.",
          ],
        },
        {
          id: 3,
          name: "Développé épaules assis",
          sets: 3,
          reps: "10-12",
          rest: "75s",
          muscles: ["Épaules", "Triceps"],
          tips: "Ne cambrez pas le dos — gainez les abdominaux.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-side.mp4",
          steps: [
            "Assis sur un banc, haltères à hauteur d'épaules, paumes vers l'avant.",
            "Poussez au-dessus de la tête jusqu'à extension complète.",
            "Redescendez à hauteur d'épaules et répétez.",
          ],
        },
        {
          id: 4,
          name: "Curl haltères",
          sets: 3,
          reps: "12",
          rest: "60s",
          muscles: ["Biceps"],
          tips: "Gardez les coudes collés au corps — pas d'élan.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-curl-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-curl-side.mp4",
          steps: [
            "Debout, haltères dans chaque main, bras le long du corps.",
            "Montez un haltère en tournant l'avant-bras vers le haut.",
            "Redescendez et alternez les bras.",
          ],
        },
      ],
    },
    {
      id: "full-body-day-3",
      title: "Programme de musculation full-body pour débutant",
      level: "Débutant",
      type: "Prise de masse",
      duration: "50 min",
      equipment: ["tapis", "haltères", "élastique", "kettlebell"],
      targetMuscles: ["Abdominaux", "Quadriceps", "Fessiers", "Ischio-jambiers"],
      description:
        "Programme équilibré combinant exercices au poids du corps et avec équipement. Développe force fonctionnelle et masse musculaire.",
      exercises: [
        {
          id: 1,
          name: "Balancé kettlebell",
          sets: 4,
          reps: "15",
          rest: "75s",
          muscles: ["Fessiers", "Ischio-jambiers", "Core"],
          tips: "Poussez avec les hanches — c'est un mouvement de charnière, pas un squat.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-kettlebell-swing-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-kettlebell-swing-side.mp4",
          steps: [
            "Pieds à largeur de hanches, kettlebell entre les pieds.",
            "Charnière à la hanche, saisissez le kettlebell et balancez-le entre les jambes.",
            "Propulsez les hanches vers l'avant pour balancer jusqu'à la hauteur des épaules.",
            "Laissez revenir et répétez.",
          ],
        },
        {
          id: 2,
          name: "Relevés de jambes",
          sets: 3,
          reps: "12",
          rest: "60s",
          muscles: ["Abdominaux", "Fléchisseurs de hanche"],
          tips: "Descendez les jambes lentement — ne les laissez pas tomber.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-leg-raises-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-leg-raises-side.mp4",
          steps: [
            "Allongez-vous sur le dos, bras le long du corps.",
            "Gardez les jambes ensemble et tendues.",
            "Montez-les à 90° puis redescendez lentement sans toucher le sol.",
          ],
        },
        {
          id: 3,
          name: "Fentes haltères",
          sets: 3,
          reps: "10 par jambe",
          rest: "75s",
          muscles: ["Quadriceps", "Fessiers", "Ischio-jambiers"],
          tips: "Gardez le genou avant au-dessus de la cheville, pas au-delà des orteils.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lunge-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-lunge-side.mp4",
          steps: [
            "Debout, haltères dans chaque main.",
            "Faites un grand pas en avant et descendez le genou arrière vers le sol.",
            "Poussez pour revenir debout et alternez les jambes.",
          ],
        },
        {
          id: 4,
          name: "Russian Twist",
          sets: 3,
          reps: "20 au total",
          rest: "60s",
          muscles: ["Abdominaux", "Obliques"],
          tips: "Mouvement lent et contrôlé — sentez la rotation dans le core.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-russian-twist-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-russian-twist-side.mp4",
          steps: [
            "Assis au sol, genoux fléchis, pieds en l'air ou au sol.",
            "Tenez un haltère ou joignez les mains.",
            "Faites pivoter le torse de gauche à droite.",
          ],
        },
        {
          id: 5,
          name: "Squat avec élastique",
          sets: 3,
          reps: "15",
          rest: "60s",
          muscles: ["Quadriceps", "Fessiers"],
          tips: "Gardez l'élastique juste au-dessus des genoux pour activer les fessiers.",
          videoFront: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-squat-front.mp4",
          videoSide: "https://media.musclewiki.com/media/uploads/videos/branded/male-Resistance-Band-band-squat-side.mp4",
          steps: [
            "Placez un élastique juste au-dessus des genoux.",
            "Pieds à largeur d'épaules.",
            "Descendez en poussant les genoux vers l'extérieur contre l'élastique.",
            "Revenez debout et répétez.",
          ],
        },
      ],
    },
  ],
};

// ─── Exercise Card Component ─────────────────────────────────────────────────

const ExerciseCard = ({ exercise, index, lang }: { exercise: any; index: number; lang: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeView, setActiveView] = useState<"front" | "side">("front");

  const labels = {
    en: { front: "Front View", side: "Side View", sets: "sets", reps: "reps", rest: "rest", muscles: "Muscles", steps: "Steps", tips: "Pro Tip" },
    fr: { front: "Vue de face", side: "Vue de côté", sets: "séries", reps: "reps", rest: "repos", muscles: "Muscles", steps: "Étapes", tips: "Conseil Pro" },
  };
  const l = labels[lang as "en" | "fr"] || labels.en;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{exercise.name}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            <span>{exercise.sets} {l.sets}</span>
            <span>·</span>
            <span>{exercise.reps} {l.reps}</span>
            <span>·</span>
            <span>{exercise.rest} {l.rest}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-[140px]">
            {exercise.muscles.slice(0, 2).map((m: string) => (
              <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
            ))}
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-border">
          {/* Video Player */}
          <div className="p-4 pb-0">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveView("front")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeView === "front"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Play className="w-3 h-3" /> {l.front}
              </button>
              <button
                onClick={() => setActiveView("side")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeView === "side"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Play className="w-3 h-3" /> {l.side}
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              <video
                key={activeView === "front" ? exercise.videoFront : exercise.videoSide}
                src={activeView === "front" ? exercise.videoFront : exercise.videoSide}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Steps & Tips */}
          <div className="p-4 grid sm:grid-cols-2 gap-4">
            {/* Steps */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{l.steps}</h4>
              <ol className="space-y-2">
                {exercise.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tip */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{l.tips}</h4>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-sm text-foreground">{exercise.tips}</p>
              </div>
              {/* All muscles */}
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">{l.muscles}</h4>
              <div className="flex flex-wrap gap-1.5">
                {exercise.muscles.map((m: string) => (
                  <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main WorkoutDetail Page ─────────────────────────────────────────────────

const WorkoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useTranslation();

  const programs = workoutPrograms[lang as "en" | "fr"] || workoutPrograms.en;
  const workout = programs.find((p) => p.id === id);

  const labels = {
    en: {
      back: "Back to Programs",
      exercises: "Exercises",
      overview: "Overview",
      duration: "Duration",
      level: "Level",
      type: "Type",
      muscles: "Target Muscles",
      equipment: "Equipment",
      noWorkout: "Workout not found.",
    },
    fr: {
      back: "Retour aux programmes",
      exercises: "Exercices",
      overview: "Aperçu",
      duration: "Durée",
      level: "Niveau",
      type: "Type",
      muscles: "Muscles ciblés",
      equipment: "Équipement",
      noWorkout: "Programme introuvable.",
    },
  };
  const l = labels[lang as "en" | "fr"] || labels.en;

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{l.noWorkout}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> {l.back}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {l.back}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="secondary">{workout.level}</Badge>
            <Badge variant="outline">{workout.type}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{workout.title}</h1>
          <p className="text-muted-foreground">{workout.description}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Clock className="w-4 h-4" />, label: l.duration, value: workout.duration },
            { icon: <Target className="w-4 h-4" />, label: l.exercises, value: `${workout.exercises.length}` },
            { icon: <Dumbbell className="w-4 h-4" />, label: l.equipment, value: workout.equipment.length.toString() },
            { icon: <CheckCircle2 className="w-4 h-4" />, label: l.level, value: workout.level },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/40 rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <span className="font-semibold text-sm text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Target Muscles */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{l.muscles}</h2>
          <div className="flex flex-wrap gap-2">
            {workout.targetMuscles.map((m) => (
              <Badge key={m} variant="secondary">{m}</Badge>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">{l.exercises}</h2>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={index} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;