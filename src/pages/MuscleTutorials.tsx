import { muscles } from "@/lib/data";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MuscleTutorials = () => {
  const { muscle } = useParams();
  const navigate = useNavigate();

  const isVideo = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop()?.toLowerCase();
  return ["mp4", "webm", "ogg"].includes(ext);
};

const isGif = (url) => {
  if (!url) return false;
  const ext = url.split('.').pop()?.toLowerCase();
  return ext === "gif";
};


  const muscleDetails = muscles.find((m) => m.name === muscle);

  if (!muscleDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full animate-scale-in">
          <CardHeader>
            <CardTitle>Muscle non trouvé</CardTitle>
            <CardDescription>
              Ce groupe musculaire n'existe pas dans notre base de données.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="gradient" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/50",
    Intermediate: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    Expert: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  return (
    <div className="min-h-screen bg-background">
      
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute z-0 inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-4 mb-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {muscleDetails.name}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {muscleDetails.exercises.length} exercice{muscleDetails.exercises.length > 1 ? 's' : ''} disponible{muscleDetails.exercises.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 gap-8">
          {muscleDetails.exercises.map((ex, index) => (
            <Card
              key={ex.id}
              className="group bg-gradient-card border-border shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                      {ex.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Maîtrisez cet exercice avec notre guide détaillé
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${difficultyColors[ex.difficulty] || 'bg-muted'} text-sm px-4 py-1 font-semibold border`}
                  >
                    {ex.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative">
                {/* Images with hover effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {/* FRONT VIEW */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 group/img">
        {isVideo(ex.images.front) ? (
          <video
            src={ex.images.front}
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={ex.images.front}
            className="w-full h-auto transition-transform duration-500 group-hover/img:scale-110"
            alt="Vue de face"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <p className="text-sm font-semibold text-foreground">Vue de face</p>
        </div>
      </div>

      {/* SIDE VIEW */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/30 group/img">
        {isVideo(ex.images.side) ? (
          <video
            src={ex.images.side}
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={ex.images.side}
            className="w-full h-auto transition-transform duration-500 group-hover/img:scale-110"
            alt="Vue de côté"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <p className="text-sm font-semibold text-foreground">Vue de côté</p>
        </div>
      </div>
    </div>


                {/* Steps with better styling */}
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <h3 className="text-2xl font-bold text-primary">Instructions</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  </div>
                  <ol className="space-y-4">
                    {ex.steps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:bg-muted/50"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-foreground/90 leading-relaxed pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="bg-card border-t border-border mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <p className="text-muted-foreground text-sm">
              © 2023 MuscleTiki — Some Rights Reserved.
            </p>

            <div className="flex justify-center gap-6">
              {[
                { src: "/Images/Instagram.png", alt: "Instagram" },
                { src: "/Images/Twitter.png", alt: "Twitter" },
                { src: "/Images/Facebook.png", alt: "Facebook" },
                { src: "/Images/Reddit.png", alt: "Reddit" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="transition-all duration-300 hover:scale-125 hover:rotate-6"
                >
                  <img 
                    src={social.src} 
                    className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" 
                    alt={social.alt}
                  />
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-border/50">
              <p className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Simplify Your Workout
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MuscleTutorials;
