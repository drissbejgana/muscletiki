import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Dumbbell, Map, TrendingUp, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cp } from "fs";
import { useNavigate } from "react-router-dom";

interface FitnessPopupProps {
  intervalMinutes?: number;
}

const FitnessPopup = ({ intervalMinutes = 3 }: FitnessPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate= useNavigate()

const handleClick=()=>{
  setIsOpen(false)
  navigate('/subscription')
}
  
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsOpen(true);
    }, 150000); 

    // Set up recurring popup
    const interval = setInterval(() => {
      setIsOpen(true);
    }, intervalMinutes * 60 * 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [intervalMinutes]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[580px] p-0 !bg-[#1a1f2e] border-2 !border-[#2d3548] overflow-hidden rounded-2xl shadow-2xl">
        {/* Solid dark background overlay to ensure visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f2e] via-[#1e2433] to-[#1a1f2e] -z-10" />
        <div className="relative p-8 pb-6">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-fitness-muted hover:text-white transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Most Popular Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-fitness-red/10 border border-fitness-red/30 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 bg-fitness-red rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">
                Most Popular
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-3">
            <h2 className="text-5xl font-bold mb-1">
              <span className="text-green-300">1.8 Million</span>{" "}
              <span className="text-white">People</span>
            </h2>
            <h3 className="text-3xl font-bold text-white mb-4">
              Are Already Training Smarter
            </h3>
            <p className="text-green-100 text-base">
              Join the fitness revolution. Get your first week free.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">800K+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                Workouts<br />Generated
              </div>
            </div>
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">2.4M+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                Exercises<br />Tracked
              </div>
            </div>
            <div className="bg-[#252d3f] border border-[#2d3548] rounded-xl p-4 text-center hover:border-[#10b981]/50 transition-all">
              <div className="text-3xl font-bold text-[#10b981] mb-1">1,700+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide leading-tight">
                Video<br />Guides
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-[#0f1419] border-l-4 border-[#10b981] rounded-lg p-4 mb-8">
            <p className="text-white text-sm italic mb-2">
              "I'm really really glad I found this app, easily a life saver, saves you tons of
              money which otherwise you would have to pay to instructors."
            </p>
            <p className="text-gray-400 text-xs">
              <span className="font-semibold">nikanarimandze</span> - Fitness Enthusiast
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">AI Workout Generator</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Map className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Interactive Body Map</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">Progress Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <ShieldOff className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">100% Ad-Free</span>
            </div>
          </div>

          {/* Join Banner */}
          <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 border border-red-700/30 rounded-lg p-3 text-center mb-6">
            <p className="text-red-200 text-sm font-medium">
              2377 people joined in the last 24 hours
            </p>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full h-14 text-lg font-bold !bg-[#10b981] hover:!bg-[#059669] !text-white rounded-xl shadow-lg hover:shadow-xl transition-all mb-3"
            onClick={handleClick}
          >
            Redeem 1 Week FREE
          </Button>

          {/* Pricing Info */}
          <div className="text-center">
            <p className="text-white text-sm mb-1">
              Full premium access. <span className="text-[#10b981] font-semibold">$1.67/month</span>
            </p>
            <p className="text-gray-400 text-xs">
              Billed annually at $19.99 • Cancel anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FitnessPopup;
