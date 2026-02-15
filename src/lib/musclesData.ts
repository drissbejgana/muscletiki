// ─── Types ───────────────────────────────────────────────────────────────────

export type Language = 'en' | 'fr';
export type Gender   = 'male' | 'female';

export interface MuscleExercise {
  id: number;
  name: string;
  difficulty: string;
  images: { front: string; side: string };
  steps: string[];
}

export interface MuscleGroup {
  id: number;
  name: string;
  exercises: MuscleExercise[];
}

// ─── Difficulty labels ────────────────────────────────────────────────────────

const difficultyLabel: Record<string, Record<Language, string>> = {
  Beginner:     { en: 'Beginner',     fr: 'Débutant'     },
  Intermediate: { en: 'Intermediate', fr: 'Intermédiaire' },
  Advanced:     { en: 'Advanced',     fr: 'Avancé'        },
  Novice:       { en: 'Novice',       fr: 'Novice'        },
};

// ─── Raw data ─────────────────────────────────────────────────────────────────

const rawMuscles = [

  // ── 1. Abdominals ──────────────────────────────────────────────────────────
  {
    id: 1,
    name: { en: 'Abdominals', fr: 'Abdominaux' },
    exercises: [
      {
        id: 101,
        name: { en: 'Crunches', fr: 'Crunchs' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-crunch-front.gif', side: '/Images/male-bodyweight-crunch-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-crunch-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-crunch-side.mp4' },
        },
        steps: {
          en: ['Lay flat on your back, knees bent, feet flat on ground.', 'Place fingertips on temples, palms facing out.', 'Draw belly to spine, raise head and shoulders. Return and repeat.'],
          fr: ['Allongez-vous sur le dos, genoux fléchis, pieds à plat.', 'Bout des doigts sur les tempes, paumes vers l\'extérieur.', 'Rentrez le ventre, soulevez tête et épaules. Revenez et répétez.'],
        },
      },
      {
        id: 102,
        name: { en: 'Leg Raises', fr: 'Relevés de jambes' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-leg-raises-front.gif', side: '/Images/male-bodyweight-leg-raises-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-leg-raises-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-leg-raises-side.mp4' },
        },
        steps: {
          en: ['Lay on back, arms palms down at sides.', 'Legs together and as straight as possible.', 'Slowly raise legs to 90°, then lower slowly.', 'No momentum — control the movement.'],
          fr: ['Allongé sur le dos, bras le long du corps.', 'Jambes jointes, aussi droites que possible.', 'Montez lentement à 90°, redescendez lentement.', 'Pas d\'élan — contrôlez le mouvement.'],
        },
      },
      {
        id: 103,
        name: { en: 'Plank', fr: 'Gainage' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-forearm-plank-front.gif', side: '/Images/male-bodyweight-forarm-plank-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-hand-plank-front_SFgElyI.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-hand-plank-side_PurCsSV.mp4' },
        },
        steps: {
          en: ['Forearms on ground, elbows at 90° under shoulders.', 'Feet together, toes on floor.', 'Lift body in a straight line from heels to head.'],
          fr: ['Avant-bras au sol, coudes à 90° sous les épaules.', 'Pieds joints, orteils au sol.', 'Soulevez le corps en ligne droite des talons à la tête.'],
        },
      },
      {
        id: 104,
        name: { en: 'Russian Twist', fr: 'Rotation russe' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-dumbbell-russian-twist-front.gif', side: '/Images/male-dumbbell-russian-twist-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-russian-twist-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-russian-twist-side.mp4' },
        },
        steps: {
          en: ['Sit on floor, knees and hips at 90°.', 'Feet hovering (or heels down for easier version).', 'Rotate torso side to side to engage obliques.'],
          fr: ['Assis au sol, genoux et hanches à 90°.', 'Pieds levés ou talons au sol pour la version facile.', 'Faites pivoter le torse pour solliciter les obliques.'],
        },
      },
    ],
  },

  // ── 2. Biceps ──────────────────────────────────────────────────────────────
  {
    id: 2,
    name: { en: 'Biceps', fr: 'Biceps' },
    exercises: [
      {
        id: 105,
        name: { en: 'Chin Ups', fr: 'Tractions supination' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-bodyweight-chinup-front.gif', side: '/Images/male-bodyweight-chinup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-side.mp4' },
        },
        steps: {
          en: ['Grip bar shoulder-width, supinated (palms facing you).', 'Pull up until chin is past the bar.', 'Slowly return. Repeat.'],
          fr: ['Barre à largeur d\'épaules, prise supination (paumes vers vous).', 'Montez jusqu\'à ce que le menton dépasse la barre.', 'Redescendez lentement. Répétez.'],
        },
      },
      {
        id: 106,
        name: { en: 'Dumbbells Curl', fr: 'Curl haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-curl-front.gif', side: '/Images/male-dumbbell-curl-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-curl-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-curl-side.mp4' },
        },
        steps: {
          en: ['Stand with a dumbbell in each hand at arm\'s length.', 'Raise one dumbbell, twist forearm until palm faces shoulder.', 'Lower and repeat with opposite arm.'],
          fr: ['Debout, haltère dans chaque main bras le long du corps.', 'Montez un haltère en tournant l\'avant-bras, paume vers l\'épaule.', 'Redescendez et répétez de l\'autre côté.'],
        },
      },
      {
        id: 107,
        name: { en: 'Dumbbells Hammer Curls', fr: 'Curl marteau haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-hammer-curl-front_JbvhNLU.gif', side: '/Images/male-dumbbell-hammer-curl-side_io6oHN7.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-hammer-curl-front_JbvhNLU.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-hammer-curl-side_io6oHN7.mp4' },
        },
        steps: {
          en: ['Neutral grip — thumbs facing ceiling.', 'Slowly lift to chest height.', 'Return to start and repeat.'],
          fr: ['Prise neutre, pouces vers le plafond.', 'Montez lentement jusqu\'à hauteur de poitrine.', 'Revenez et répétez.'],
        },
      },
      {
        id: 108,
        name: { en: 'Dumbbells Reverse Curls', fr: 'Curl inversé haltères' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-dumbbell-reverse-curl-front.gif', side: '/Images/male-dumbbell-reverse-curl-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-reverse-curl-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-reverse-curl-side.mp4' },
        },
        steps: {
          en: ['Pronated (overhand) grip on dumbbells.', 'Flex elbows until biceps touch forearms. Keep elbows tucked.'],
          fr: ['Prise pronation sur les haltères.', 'Fléchissez jusqu\'au contact biceps-avant-bras. Coudes près du corps.'],
        },
      },
      {
        id: 109,
        name: { en: 'Barbell Curl', fr: 'Curl barre' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-barbell-curl-front_uKPCb8P.gif', side: '/Images/male-barbell-curl-side_NN1ZFmi.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-curl-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-curl-side.mp4' },
        },
        steps: {
          en: ['Upper arms stationary, curl bar forward contracting biceps as you exhale.', 'Continue until fully contracted at shoulder level.', 'Hold and squeeze for a second.', 'Slowly lower to start.'],
          fr: ['Bras hauts immobiles, montez la barre en contractant les biceps en expirant.', 'Continuez jusqu\'à contraction complète, barre à hauteur des épaules.', 'Tenez une seconde et serrez fort.', 'Redescendez lentement.'],
        },
      },
      {
        id: 110,
        name: { en: 'Reverse Barbell Curl', fr: 'Curl barre inversé' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-reverse-curl-front_ysdi82M.gif', side: '/Images/male-barbell-reverse-curl-side_EGHsY3f.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-curl-front_ysdi82M.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-curl-side_EGHsY3f.mp4' },
        },
        steps: {
          en: ['Double overhand grip, shoulder width. Elbows tucked.', 'Curl until forearm meets bicep. Fully extend at the bottom.'],
          fr: ['Double prise pronation à largeur d\'épaules, coudes rentrés.', 'Montez jusqu\'au contact avant-bras/bicep. Étendez complètement en bas.'],
        },
      },
    ],
  },

  // ── 3. Triceps ─────────────────────────────────────────────────────────────
  {
    id: 3,
    name: { en: 'Triceps', fr: 'Triceps' },
    exercises: [
      {
        id: 1201,
        name: { en: 'Dips', fr: 'Dips' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-bodyweight-dips-front.gif', side: '/Images/male-bodyweight-dips-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-dips-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-dips-side.mp4' },
        },
        steps: {
          en: ['Hold body with arms locked above bars.', 'Lower slowly, lean forward, flare elbows.', 'Raise back up until arms locked.'],
          fr: ['Corps suspendu, bras tendus au-dessus des barres.', 'Descendez lentement en penchant en avant, coudes écartés.', 'Remontez jusqu\'à extension complète.'],
        },
      },
      {
        id: 1202,
        name: { en: 'Diamond Push Ups', fr: 'Pompes diamant' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/-bodyweight-diamond-pushup-front.gif', side: '/Images/male-bodyweight-diamond-pushup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/-bodyweight-diamond-pushup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-diamond-pushup-side.mp4' },
        },
        steps: {
          en: ['Index fingers and thumbs touching, forming a diamond.', 'Standard push-up position.', 'Lower chest toward hands, elbows close to body.', 'Stop before floor, push back up.'],
          fr: ['Index et pouces se touchent, formant un diamant.', 'Position de pompe standard.', 'Descendez la poitrine vers les mains, coudes près du corps.', 'Stoppez avant le sol, remontez.'],
        },
      },
      {
        id: 1203,
        name: { en: 'Bench Dips', fr: 'Dips banc' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-tricep-dips-front.gif', side: '/Images/male-bodyweight-tricep-dips-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-tricep-dips-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-tricep-dips-side.mp4' },
        },
        steps: {
          en: ['Grip bench edge, feet together, legs straight.', 'Lower straight down.', 'Press back up to start.'],
          fr: ['Saisissez le bord du banc, pieds joints, jambes tendues.', 'Descendez verticalement.', 'Remontez à la position de départ.'],
        },
      },
      {
        id: 1204,
        name: { en: 'Seated Overhead Triceps Extension', fr: 'Extension triceps assis' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-dumbbell-overhead-tricep-extension-front.gif', side: '/Images/male-dumbbell-overhead-tricep-extension-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-overhead-tricep-extension-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-overhead-tricep-extension-side.mp4' },
        },
        steps: {
          en: ['Sit on bench, hold dumbbell overhead with both hands.', 'Elbows in, lower weight behind head, upper arms stationary.', 'Raise back to start.'],
          fr: ['Assis, haltère à deux mains bras tendus au-dessus.', 'Coudes près de la tête, descendez derrière la nuque.', 'Remontez.'],
        },
      },
      {
        id: 1205,
        name: { en: 'Laying Triceps Extension', fr: 'Extension triceps allongé' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-laying-tricep-extensions-front.gif', side: '/Images/male-barbell-laying-tricep-extensions-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-laying-tricep-extensions-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-laying-tricep-extensions-side.mp4' },
        },
        steps: {
          en: ['Flat bench, barbell shoulder-width grip.', 'Extend elbows until bar over chest.', 'Flex elbows, bar nearly touches forehead.', 'Extend back to start.'],
          fr: ['Banc plat, barre à largeur d\'épaules.', 'Étendez les coudes jusqu\'à la barre au-dessus de la poitrine.', 'Fléchissez jusqu\'à frôler le front.', 'Revenez.'],
        },
      },
      {
        id: 1206,
        name: { en: 'Barbell SkullCrusher', fr: 'Barre au front' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-skullcrusher-front_qpHWUa8.gif', side: '/Images/male-barbell-skullcrusher-side_B7Z6225.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-skullcrusher-front_qpHWUa8.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-skullcrusher-side_B7Z6225.mp4' },
        },
        steps: {
          en: ['Shoulder-width grip. Break at elbows, keep them tucked.', 'Stop bar inches from forehead, extend back up.'],
          fr: ['Prise à largeur d\'épaules, coudes rentrés.', 'Stoppez à quelques centimètres du front, puis redressez.'],
        },
      },
    ],
  },

  // ── 4. Chest ───────────────────────────────────────────────────────────────
  {
    id: 4,
    name: { en: 'Chest', fr: 'Pectoraux' },
    exercises: [
      {
        id: 401,
        name: { en: 'Push Up', fr: 'Pompe' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-pushup-front.gif', side: '/Images/male-bodyweight-pushup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Bodyweight-push-up-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Bodyweight-push-up-side.mp4' },
        },
        steps: {
          en: ['Hands under shoulders, back flat, lower slowly.', 'Shoulder blades back and down, elbows tucked.', 'Exhale pushing back to start.'],
          fr: ['Mains sous les épaules, dos plat, descendez lentement.', 'Omoplates en arrière-bas, coudes près du corps.', 'Expirez en remontant.'],
        },
      },
      {
        id: 402,
        name: { en: 'Incline Push Ups', fr: 'Pompes inclinées' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-incline-pushup-front.gif', side: '/Images/male-bodyweight-incline-pushup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-incline-pushup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-incline-pushup-side.mp4' },
        },
        steps: {
          en: ['Hands on bench edge, slightly wider than shoulder-width.', 'Lower until chest nearly touches bench.', 'Push up until arms extended.'],
          fr: ['Mains sur le bord du banc légèrement plus larges que les épaules.', 'Descendez jusqu\'à effleurer le banc.', 'Remontez bras tendus.'],
        },
      },
      {
        id: 403,
        name: { en: 'Dumbbells Incline Chest Flys', fr: 'Écarté incliné haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-incline-chest-flys-front.gif', side: '/Images/male-dumbbell-incline-chest-flys-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-fly-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-fly-side.mp4' },
        },
        steps: {
          en: ['Lay on bench, dumbbells above chest, elbows slightly bent.', 'Lower weights to each side simultaneously.', 'Pause when parallel to bench, raise back to start.'],
          fr: ['Allongé sur banc incliné, haltères au-dessus de la poitrine, coudes légèrement fléchis.', 'Descendez les haltères de chaque côté.', 'Pause quand parallèles au banc, remontez.'],
        },
      },
      {
        id: 404,
        name: { en: 'Incline Dumbbells Bench Press', fr: 'Développé incliné haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-incline-bench-press-front.gif', side: '/Images/male-dumbbell-incline-bench-press-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-bench-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-bench-press-side.mp4' },
        },
        steps: {
          en: ['Bench at 30–45°. Lay down, feet on ground.', 'Raise dumbbells with straight arms, lower to shoulder-width.', 'Raise back to start.'],
          fr: ['Banc à 30–45°. Allongez-vous, pieds au sol.', 'Bras tendus, descendez à hauteur des épaules.', 'Remontez.'],
        },
      },
      {
        id: 405,
        name: { en: 'Barbell Bench Press', fr: 'Développé couché barre' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-bench-press-front_C2G7O8r.gif', side: '/Images/male-barbell-bench-press-side_giVNk12.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-bench-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-bench-press-side.mp4' },
        },
        steps: {
          en: ['Lay flat, feet on ground. Unrack bar with straight arms.', 'Lower to mid chest.', 'Raise until elbows locked.'],
          fr: ['Allongé, pieds au sol. Dérackez bras tendus.', 'Descendez jusqu\'au milieu de la poitrine.', 'Remontez jusqu\'à extension des coudes.'],
        },
      },
      {
        id: 406,
        name: { en: 'Incline Barbell Bench Press', fr: 'Développé incliné barre' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-incline-bench-press-front.gif', side: '/Images/male-barbell-incline-bench-press-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-incline-bench-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-incline-bench-press-side.mp4' },
        },
        steps: {
          en: ['Bench 30–45°. Lay flat, unrack bar.', 'Lower to mid chest.', 'Raise until elbows locked.'],
          fr: ['Banc entre 30 et 45°. Allongez-vous, dérackez.', 'Descendez jusqu\'au milieu de la poitrine.', 'Remontez jusqu\'à extension complète.'],
        },
      },
    ],
  },

  // ── 5. Back (empty) ────────────────────────────────────────────────────────
  { id: 5, name: { en: 'Back', fr: 'Dos' }, exercises: [] },

  // ── 6. Shoulders ───────────────────────────────────────────────────────────
  {
    id: 6,
    name: { en: 'Shoulders', fr: 'Épaules' },
    exercises: [
      {
        id: 901,
        name: { en: 'Elevated Pike Press', fr: 'Pompe pike surélevée' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/Elevated Pike Press.gif', side: '/Images/Elevated Pike Press Side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-side.mp4' },
        },
        steps: {
          en: ['Elevate feet on bench or object.', 'Lower head toward floor bending elbows.', 'Push through hands back to pike position.'],
          fr: ['Surélevez les pieds sur un banc.', 'Baissez la tête vers le sol en fléchissant les coudes.', 'Poussez sur les mains pour revenir en position pike.'],
        },
      },
      {
        id: 902,
        name: { en: 'Dumbbell Seated Overhead Press', fr: 'Développé épaules assis haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-seated-overhead-press-front.gif', side: '/Images/male-dumbbell-seated-overhead-press-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-seated-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-seated-overhead-press-side.mp4' },
        },
        steps: {
          en: ['Sit on bench, dumbbells at shoulder height, palms forward.', 'Press upward, pause at top.', 'Lower back to start.'],
          fr: ['Assis sur banc, haltères à hauteur d\'épaules, paumes vers l\'avant.', 'Poussez vers le haut, pause en haut.', 'Redescendez.'],
        },
      },
      {
        id: 903,
        name: { en: 'Barbell Overhead Press', fr: 'Développé militaire barre' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-overhead-press-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-side.mp4' },
        },
        steps: {
          en: ['Shoulder-width grip, vertical forearms.', 'Pull chin back, press toward ceiling extending elbows.', 'Push head forward slightly at the top.', 'Return controlled, chin back for bar clearance.'],
          fr: ['Prise à largeur d\'épaules, avant-bras verticaux.', 'Rentrez le menton, poussez vers le plafond en étendant les coudes.', 'Avancez légèrement la tête en haut.', 'Redescendez de façon contrôlée.'],
        },
      },
    ],
  },

  // ── 8. Glutes ──────────────────────────────────────────────────────────────
  {
    id: 8,
    name: { en: 'Glutes', fr: 'Fessiers' },
    exercises: [
      {
        id: 801,
        name: { en: 'Forward Lunges', fr: 'Fentes avant' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-forward-lunge-front.gif', side: '/Images/male-bodyweight-forward-lunge-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-forward-lunge-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-forward-lunge-side.mp4' },
        },
        steps: {
          en: ['Step forward with one leg.', 'Lower until rear knee nearly touches ground, stay upright.', 'Push off front foot and switch legs.'],
          fr: ['Grand pas en avant.', 'Descendez jusqu\'à frôler le sol, restez droit.', 'Poussez et alternez les jambes.'],
        },
      },
      {
        id: 802,
        name: { en: 'Glute Bridge', fr: 'Pont fessier' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-glute-bridge-front.gif', side: '/Images/male-bodyweight-glute-bridge-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-glute-bridge-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-glute-bridge-side.mp4' },
        },
        steps: {
          en: ['Lie down, knees bent, feet flat.', 'Push hips up, back straight.', 'Squeeze glutes, hold briefly, return slowly.'],
          fr: ['Allongé, genoux fléchis, pieds à plat.', 'Montez les hanches, dos droit.', 'Contractez les fessiers, tenez un instant, redescendez lentement.'],
        },
      },
      {
        id: 803,
        name: { en: 'Dumbells Goblet Squats', fr: 'Squat gobelet haltère' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-goblet-squat-front.gif', side: '/Images/male-dumbbell-goblet-squat-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-goblet-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-goblet-squat-side.mp4' },
        },
        steps: {
          en: ['Weight to upper chest, elbows in, feet slightly wider than shoulder-width.', 'Sink into squat, elbows inside knees.', 'Push through heels, chest up, return.'],
          fr: ['Haltère contre la poitrine, coudes rentrés, pieds légèrement plus larges que les épaules.', 'Descendez en squat, coudes à l\'intérieur des genoux.', 'Poussez sur les talons, poitrine haute, remontez.'],
        },
      },
      {
        id: 804,
        name: { en: 'Barbell Squats', fr: 'Squat barre' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-highbar-squat-front.gif', side: '/Images/male-barbell-highbar-squat-side_bU7Qudy.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-highbar-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-highbar-squat-side_bU7Qudy.mp4' },
        },
        steps: {
          en: ['Feet shoulder-width, arch back, chest raised. Bar on shoulders, unrack and step back.', 'Lower until hips are below knees.', 'Drive up, exhale at top.'],
          fr: ['Pieds à largeur d\'épaules, dos cambré, poitrine haute. Barre sur le haut du dos, dérackez.', 'Descendez jusqu\'à ce que les hanches passent sous les genoux.', 'Remontez en expirant.'],
        },
      },
    ],
  },

  // ── 9. Forearms ────────────────────────────────────────────────────────────
  {
    id: 9,
    name: { en: 'Forearms', fr: 'Avant-bras' },
    exercises: [
      {
        id: 301,
        name: { en: 'Chin Ups', fr: 'Tractions supination' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-bodyweight-chinup-front.gif', side: '/Images/male-bodyweight-chinup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-side.mp4' },
        },
        steps: {
          en: ['Supinated grip, shoulder-width.', 'Pull until chin past bar.', 'Lower slowly. Repeat.'],
          fr: ['Prise supination, largeur d\'épaules.', 'Montez jusqu\'à dépasser la barre.', 'Redescendez lentement. Répétez.'],
        },
      },
      {
        id: 302,
        name: { en: 'Dumbbells Wrist Curl', fr: 'Curl de poignet haltère' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-wrist-curl-front.gif', side: '/Images/male-dumbbell-wrist-curl-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-wrist-curl-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-wrist-curl-side.mp4' },
        },
        steps: {
          en: ['Palm facing up, forearm on bench.', 'Curl wrist upward in semicircle.', 'Return and repeat.'],
          fr: ['Paume vers le haut, avant-bras sur banc.', 'Fléchissez le poignet en demi-cercle.', 'Revenez et répétez.'],
        },
      },
      {
        id: 303,
        name: { en: 'Dumbbells Wrist Extension', fr: 'Extension de poignet haltère' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-wrist-extension-front.gif', side: '/Images/male-dumbbell-wrist-extension-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-wrist-extension-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-wrist-extension-side.mp4' },
        },
        steps: {
          en: ['Overhand grip, forearms across knees.', 'Let wrists flex fully, then extend.'],
          fr: ['Prise pronation, avant-bras sur les genoux.', 'Laissez fléchir complètement puis étendez.'],
        },
      },
      {
        id: 304,
        name: { en: 'Dumbbells Reverse Curls', fr: 'Curl inversé haltères' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-dumbbell-reverse-curl-front.gif', side: '/Images/male-dumbbell-reverse-curl-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-reverse-curl-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-reverse-curl-side.mp4' },
        },
        steps: {
          en: ['Pronated grip.', 'Flex until biceps touch forearms. Keep elbows tucked.'],
          fr: ['Prise pronation.', 'Fléchissez jusqu\'au contact biceps-avant-bras, coudes près du corps.'],
        },
      },
      {
        id: 305,
        name: { en: 'Barbell Wrist Curl', fr: 'Curl de poignet barre' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/barbell-wristcurl-male-front.gif', side: '/Images/barbell-wristcurl-male-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/barbell-wristcurl-female-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/barbell-wristcurl-female-side.mp4' },
        },
        steps: {
          en: ['Supinated grip. Kneel by bench, forearms on bench, wrists off edge.', 'Let bar extend wrists down.', 'Curl until fully flexed. Lower and repeat.'],
          fr: ['Barre en prise supination, à genoux, avant-bras sur banc, poignets dans le vide.', 'Laissez la barre descendre.', 'Remontez complètement. Redescendez et répétez.'],
        },
      },
      {
        id: 306,
        name: { en: 'Reverse Barbell Curl', fr: 'Curl barre inversé' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-reverse-curl-front_ysdi82M.gif', side: '/Images/male-barbell-reverse-curl-side_EGHsY3f.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-curl-front_ysdi82M.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-curl-side_EGHsY3f.mp4' },
        },
        steps: {
          en: ['Double overhand grip, shoulder-width. Elbows tucked.', 'Curl until forearm meets bicep. Fully extend at bottom.'],
          fr: ['Double prise pronation à largeur d\'épaules, coudes rentrés.', 'Montez jusqu\'au contact avant-bras/bicep. Étendez complètement.'],
        },
      },
    ],
  },

  // ── 10. Calves ─────────────────────────────────────────────────────────────
  {
    id: 10,
    name: { en: 'Calves', fr: 'Mollets' },
    exercises: [
      {
        id: 201,
        name: { en: 'Calf Raises', fr: 'Mollets debout' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-calve-raise-front.gif', side: '/Images/male-bodyweight-calve-raise-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-calve-raise-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-calve-raise-side.mp4' },
        },
        steps: {
          en: ['Balance on balls of feet on platform.', 'Lower heels toward ground, push up to tip-toe.', 'Repeat.'],
          fr: ['Avant des pieds sur une marche.', 'Descendez les talons, montez sur la pointe des pieds.', 'Répétez.'],
        },
      },
      {
        id: 202,
        name: { en: 'Dumbells Calf Raises', fr: 'Mollets haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-calf-raise-front.gif', side: '/Images/male-dumbbell-calf-raise-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-calf-raise-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-calf-raise-side.mp4' },
        },
        steps: {
          en: ['Stand tall, balls of feet on plate for extra range.', 'Raise heels toward ceiling.'],
          fr: ['Avant des pieds sur une plaque pour plus d\'amplitude.', 'Montez les talons vers le plafond.'],
        },
      },
      {
        id: 203,
        name: { en: 'Barbell Calf Raises', fr: 'Mollets barre' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-calve-raise-front.gif', side: '/Images/male-barbell-calve-raise-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-calve-raise-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-calve-raise-side.mp4' },
        },
        steps: {
          en: ['Bar on back, feet flat.', 'Raise heels, knees stationary, pause at top.', 'Lower slowly. Repeat.'],
          fr: ['Barre sur le dos, pieds à plat.', 'Montez les talons, genoux fixes, pause en haut.', 'Redescendez lentement. Répétez.'],
        },
      },
    ],
  },

  // ── 11. Lats ───────────────────────────────────────────────────────────────
  {
    id: 11,
    name: { en: 'Lats', fr: 'Grand dorsal' },
    exercises: [
      {
        id: 501,
        name: { en: 'Pull Ups', fr: 'Tractions' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-bodyweight-pullup-front.gif', side: '/Images/male-bodyweight-pullup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-pullup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-pullup-side.mp4' },
        },
        steps: {
          en: ['Overhand grip, arms fully extended.', 'Pull until chin above bar.', 'Lower to start.'],
          fr: ['Prise pronation, bras complètement étendus.', 'Montez jusqu\'à ce que le menton dépasse la barre.', 'Redescendez.'],
        },
      },
      {
        id: 502,
        name: { en: 'Dumbbell Row Unilateral', fr: 'Rowing haltère unilatéral' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-row-unilateral-front.gif', side: '/Images/male-dumbbell-unilateral-row-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-row-unilateral-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-unilateral-row-side.mp4' },
        },
        steps: {
          en: ['Off arm braced on bench, staggered stance.', 'Torso parallel to ground.', 'Arm hangs free, pull elbow back, squeeze shoulder blade.'],
          fr: ['Bras libre appuyé sur un banc, écart de jambes.', 'Torse parallèle au sol.', 'Bras libre, ramenez le coude vers l\'arrière, serrez l\'omoplate.'],
        },
      },
      {
        id: 503,
        name: { en: 'Deadlift', fr: 'Soulevé de terre' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-deadlift-front.gif', side: '/Images/male-barbell-deadlift-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-side.mp4' },
        },
        steps: {
          en: ['Mid-foot under bar, shoulder-width grip.', 'Bend knees, lift keeping back straight.', 'Stand to full height.', 'Lower with knees bent, back straight.'],
          fr: ['Milieu du pied sous la barre, prise à largeur d\'épaules.', 'Genoux fléchis, soulevez dos droit.', 'Debout à pleine hauteur.', 'Redescendez dos droit.'],
        },
      },
    ],
  },

  // ── 12. Lower Back ─────────────────────────────────────────────────────────
  {
    id: 12,
    name: { en: 'Lower Back', fr: 'Bas du dos' },
    exercises: [
      {
        id: 601,
        name: { en: 'Deadlift', fr: 'Soulevé de terre' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-deadlift-front.gif', side: '/Images/male-barbell-deadlift-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-side.mp4' },
        },
        steps: {
          en: ['Mid-foot under bar, shoulder-width grip.', 'Bend knees, lift keeping back straight.', 'Stand tall.', 'Lower knees bent, back straight.'],
          fr: ['Milieu du pied sous la barre.', 'Genoux fléchis, soulevez dos droit.', 'Debout à pleine hauteur.', 'Redescendez dos droit.'],
        },
      },
      {
        id: 602,
        name: { en: 'Sumo Deadlift', fr: 'Soulevé de terre sumo' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-sumo-deadlift-front_aeM2BqT.gif', side: '/Images/male-barbell-sumo-deadlift-side_av3A2PM.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-sumo-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-sumo-deadlift-side.mp4' },
        },
        steps: {
          en: ['Wide stance, toes out. Arms inside legs, bar over mid-foot, flat back.', 'Push heels into floor.', 'Extend knees and hips simultaneously.'],
          fr: ['Écart large, pointes vers l\'extérieur. Bras à l\'intérieur, dos plat.', 'Poussez les talons.', 'Étendez genoux et hanches simultanément.'],
        },
      },
    ],
  },

  // ── 13. Obliques ───────────────────────────────────────────────────────────
  {
    id: 13,
    name: { en: 'Obliques', fr: 'Obliques' },
    exercises: [
      {
        id: 701,
        name: { en: 'Russian Twist', fr: 'Rotation russe' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-dumbbell-russian-twist-front.gif', side: '/Images/male-dumbbell-russian-twist-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-russian-twist-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-russian-twist-side.mp4' },
        },
        steps: {
          en: ['Sit on floor, knees and hips at 90°.', 'Feet hovering (or heels on floor for easier version).', 'Rotate upper spine to engage obliques.'],
          fr: ['Assis au sol, genoux et hanches à 90°.', 'Pieds levés ou talons au sol pour la version facile.', 'Faites pivoter le haut du dos pour les obliques.'],
        },
      },
    ],
  },

  // ── 14. Quads ──────────────────────────────────────────────────────────────
  {
    id: 14,
    name: { en: 'Quads', fr: 'Quadriceps' },
    exercises: [
      {
        id: 801,
        name: { en: 'Squats', fr: 'Squats' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-squat-front.gif', side: '/Images/male-bodyweight-squat-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-squat-side.mp4' },
        },
        steps: {
          en: ['Feet shoulder-width apart.', 'Flex knees and hips, sit into squat.', 'Continue to full depth.', 'Return to start.'],
          fr: ['Pieds à largeur d\'épaules.', 'Fléchissez genoux et hanches.', 'Descendez jusqu\'en bas.', 'Remontez.'],
        },
      },
      {
        id: 802,
        name: { en: 'Forward Lunges', fr: 'Fentes avant' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-forward-lunge-front.gif', side: '/Images/male-bodyweight-forward-lunge-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-forward-lunge-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-forward-lunge-side.mp4' },
        },
        steps: {
          en: ['Step forward.', 'Lower until rear knee nearly touches ground.', 'Stay upright, front knee above foot.', 'Push off and switch.'],
          fr: ['Grand pas en avant.', 'Descendez jusqu\'à frôler le sol.', 'Restez droit, genou avant au-dessus du pied.', 'Poussez et alternez.'],
        },
      },
      {
        id: 803,
        name: { en: 'Bulgarian Split Squats', fr: 'Squat bulgare' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-bulgarian-split-squat-front.gif', side: '/Images/male-bodyweight-bulgarian-split-squat-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-bulgarian-split-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-bulgarian-split-squat-side.mp4' },
        },
        steps: {
          en: ['Back to bench, one foot on bench.', 'Squat until front leg is parallel.', 'Return to start. Switch legs.'],
          fr: ['Dos au banc, un pied dessus.', 'Descendez jambe avant parallèle au sol.', 'Remontez. Alternez.'],
        },
      },
      {
        id: 804,
        name: { en: 'Dumbells Goblet Squats', fr: 'Squat gobelet haltère' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-dumbbell-goblet-squat-front.gif', side: '/Images/male-dumbbell-goblet-squat-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-goblet-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-goblet-squat-side.mp4' },
        },
        steps: {
          en: ['Weight to upper chest, elbows in, feet slightly wider than shoulder-width.', 'Sink into squat, elbows inside knees.', 'Push through heels, chest up, return.'],
          fr: ['Haltère contre la poitrine, coudes rentrés, pieds légèrement plus larges.', 'Descendez en squat, coudes à l\'intérieur des genoux.', 'Poussez sur les talons, remontez.'],
        },
      },
      {
        id: 805,
        name: { en: 'Barbell Squats', fr: 'Squat barre' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-highbar-squat-front.gif', side: '/Images/male-barbell-highbar-squat-side_bU7Qudy.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-highbar-squat-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-highbar-squat-side_bU7Qudy.mp4' },
        },
        steps: {
          en: ['Feet shoulder-width, arch back, chest raised. Bar on shoulders, unrack.', 'Lower until hips below knees.', 'Drive up, exhale at top.'],
          fr: ['Pieds à largeur d\'épaules, dos cambré, poitrine haute. Barre sur le haut du dos, dérackez.', 'Descendez hanches sous les genoux.', 'Remontez en expirant.'],
        },
      },
    ],
  },

  // ── 16. Traps Mid-Back ─────────────────────────────────────────────────────
  {
    id: 16,
    name: { en: 'Traps (Mid-Back)', fr: 'Trapèzes (milieu du dos)' },
    exercises: [
      {
        id: 1101,
        name: { en: 'Pull Ups', fr: 'Tractions' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-bodyweight-pullup-front.gif', side: '/Images/male-bodyweight-pullup-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-pullup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-pullup-side.mp4' },
        },
        steps: {
          en: ['Overhand grip, fully extended.', 'Pull until chin above bar.', 'Lower to start.'],
          fr: ['Prise pronation, bras tendus.', 'Montez jusqu\'au-dessus de la barre.', 'Redescendez.'],
        },
      },
      {
        id: 1104,
        name: { en: 'Bent Over Barbell Row', fr: 'Rowing barre penché' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-bent-over-row-front.gif', side: '/Images/male-barbell-bent-over-row-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-bent-over-row-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-bent-over-row-side.mp4' },
        },
        steps: {
          en: ['Shoulder-width grip. Hinge at hips, flat back.', 'Pull bar toward upper abdomen.', 'Lower controlled and repeat.'],
          fr: ['Prise à largeur d\'épaules. Penchez à la hanche, dos plat.', 'Tirez vers le haut de l\'abdomen.', 'Redescendez de façon contrôlée.'],
        },
      },
    ],
  },

  // ── 17. Hamstrings ─────────────────────────────────────────────────────────
  {
    id: 17,
    name: { en: 'Hamstrings', fr: 'Ischio-jambiers' },
    exercises: [
      {
        id: 1301,
        name: { en: 'Glute Bridge', fr: 'Pont fessier' },
        difficulty: 'Beginner',
        images: {
          male:   { front: '/Images/male-bodyweight-glute-bridge-front.gif', side: '/Images/male-bodyweight-glute-bridge-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-glute-bridge-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-glute-bridge-side.mp4' },
        },
        steps: {
          en: ['Lie down, knees bent, feet flat.', 'Push hips up, back straight.', 'Squeeze glutes, hold briefly, return slowly.'],
          fr: ['Allongé, genoux fléchis, pieds à plat.', 'Montez les hanches, dos droit.', 'Contractez, tenez, redescendez lentement.'],
        },
      },
      {
        id: 1303,
        name: { en: 'Deadlift', fr: 'Soulevé de terre' },
        difficulty: 'Advanced',
        images: {
          male:   { front: '/Images/male-barbell-deadlift-front.gif', side: '/Images/male-barbell-deadlift-side.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-deadlift-side.mp4' },
        },
        steps: {
          en: ['Mid-foot under bar, shoulder-width grip.', 'Bend knees, lift keeping back straight.', 'Stand tall.', 'Lower knees bent, back straight.'],
          fr: ['Milieu du pied sous la barre.', 'Genoux fléchis, soulevez dos droit.', 'Debout.', 'Redescendez dos droit.'],
        },
      },
      {
        id: 1304,
        name: { en: 'Sumo Deadlift', fr: 'Soulevé de terre sumo' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: '/Images/male-barbell-sumo-deadlift-front_aeM2BqT.gif', side: '/Images/male-barbell-sumo-deadlift-side_av3A2PM.gif' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-sumo-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-sumo-deadlift-side.mp4' },
        },
        steps: {
          en: ['Wide stance, toes out. Arms inside legs, flat back.', 'Extend knees and hips simultaneously.'],
          fr: ['Écart large, pointes vers l\'extérieur. Bras à l\'intérieur, dos plat.', 'Étendez genoux et hanches simultanément.'],
        },
      },
    ],
  },

  // ── 18. Upper-Trapezius ────────────────────────────────────────────────────
  {
    id: 18,
    name: { en: 'Upper-Trapezius', fr: 'Trapèzes supérieurs' },
    exercises: [
      {
        id: 1401,
        name: { en: 'Barbell Shrug', fr: 'Haussement d\'épaules barre' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-squat-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-squat-front.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-squat-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-squat-front.mp4' },
        },
        steps: {
          en: ['Hold barbell in front.', 'Lift shoulders toward ears.', 'Hold at top.', 'Lower back down.'],
          fr: ['Barre devant vous.', 'Montez les épaules vers les oreilles.', 'Tenez.', 'Redescendez.'],
        },
      },
      {
        id: 1402,
        name: { en: 'Dumbbell Shrug', fr: 'Haussement d\'épaules haltères' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-bench-press-side_KciuhbB.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-shrug-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-shrug-side.mp4' },
        },
        steps: {
          en: ['Dumbbells at sides, arms straight.', 'Lift shoulders toward ears.', 'Hold briefly, lower controlled.'],
          fr: ['Haltères le long du corps.', 'Montez les épaules vers les oreilles.', 'Brève pause, redescendez.'],
        },
      },
      {
        id: 1403,
        name: { en: 'Overhead Barbell Shrug', fr: 'Haussement barre au-dessus' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-stiff-leg-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-barbell-stiff-leg-deadlift-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-stiff-leg-deadlift-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-stiff-leg-deadlift-side.mp4' },
        },
        steps: {
          en: ['Barbell overhead, arms fully extended and locked.', 'Shrug shoulders toward ears.', 'Lower back to start.'],
          fr: ['Barre au-dessus, bras tendus et verrouillés.', 'Haussez les épaules vers les oreilles.', 'Redescendez.'],
        },
      },
      {
        id: 1404,
        name: { en: "Farmer's Walk", fr: 'Marche du fermier' },
        difficulty: 'Intermediate',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-bodyweight-chinup-side.mp4' },
        },
        steps: {
          en: ['Heavy weights at sides, neutral grip.', 'Shoulders back, core tight.', 'Walk forward with controlled steps.', 'Maintain posture throughout.'],
          fr: ['Poids lourds en prise neutre le long du corps.', 'Épaules en arrière, gainage fort.', 'Avancez à pas contrôlés.', 'Maintenez une bonne posture.'],
        },
      },
    ],
  },

  // ── 19. Neck ───────────────────────────────────────────────────────────────
  {
    id: 19,
    name: { en: 'Neck', fr: 'Cou' },
    exercises: [
      {
        id: 1501,
        name: { en: 'Neck Flexion', fr: 'Flexion du cou' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-overhead-press-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-overhead-press-side.mp4' },
        },
        steps: {
          en: ['Stand tall, straight spine.', 'Slowly bend head downward.', 'Bring chin to chest, mouth closed.', 'Return to start.'],
          fr: ['Debout, colonne droite.', 'Baissez lentement la tête.', 'Amenez le menton contre la poitrine, bouche fermée.', 'Revenez.'],
        },
      },
      {
        id: 1502,
        name: { en: 'Neck Extension', fr: 'Extension du cou' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-dumbbell-seated-overhead-press-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-seated-overhead-press-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-seated-overhead-press-side.mp4' },
        },
        steps: {
          en: ['Correct posture, look straight ahead.', 'Press back of head backward.', 'Move chin away from chest.', 'Return to start.'],
          fr: ['Bonne posture, regard droit.', 'Poussez l\'arrière de la tête vers l\'arrière.', 'Éloignez le menton de la poitrine.', 'Revenez.'],
        },
      },
      {
        id: 1503,
        name: { en: 'Neck Lateral Flexion', fr: 'Flexion latérale du cou' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-lateral-raise-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Cables-cable-lateral-raise-side.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-lateral-raise-front.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-lateral-raise-side.mp4' },
        },
        steps: {
          en: ['Correct posture, look ahead.', 'Tilt head to side, ear toward shoulder.', 'Shoulders flat.', 'Return and repeat other side.'],
          fr: ['Bonne posture, regard droit.', 'Inclinez la tête, oreille vers l\'épaule.', 'Épaules à plat.', 'Revenez et répétez de l\'autre côté.'],
        },
      },
      {
        id: 1504,
        name: { en: 'Neck Rotation', fr: 'Rotation du cou' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-upright-row-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-upright-row-front.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-upright-row-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-upright-row-front.mp4' },
        },
        steps: {
          en: ['Head facing forward.', 'Slowly turn head, look over shoulder.', 'Body stable.', 'Return to start. Repeat other side.'],
          fr: ['Tête droite.', 'Tournez lentement et regardez par-dessus l\'épaule.', 'Corps stable.', 'Revenez. Répétez de l\'autre côté.'],
        },
      },
      {
        id: 1505,
        name: { en: 'Chin Tuck', fr: 'Rentrée du menton' },
        difficulty: 'Beginner',
        images: {
          male:   { front: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-upright-row-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/male-Barbell-barbell-upright-row-front.mp4' },
          female: { front: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-upright-row-side.mp4', side: 'https://media.musclewiki.com/media/uploads/videos/branded/female-Barbell-barbell-upright-row-front.mp4' },
        },
        steps: {
          en: ['Back straight.', 'Tuck chin to chest.', 'Pull head back slightly.', 'Hold a few seconds. Return.'],
          fr: ['Dos droit.', 'Rentrez le menton contre la poitrine.', 'Tirez légèrement la tête vers l\'arrière.', 'Tenez quelques secondes. Revenez.'],
        },
      },
    ],
  },
];

// ─── Builder ──────────────────────────────────────────────────────────────────

export function getMuscles(lang: Language = 'en', gender: Gender = 'male'): MuscleGroup[] {
  return rawMuscles.map((muscle) => ({
    id: muscle.id,
    name: muscle.name[lang],
    exercises: muscle.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name[lang],
      difficulty: difficultyLabel[ex.difficulty]?.[lang] ?? ex.difficulty,
      images: ex.images[gender],   // ← male or female URLs
      steps: ex.steps[lang],
    })),
  }));
}