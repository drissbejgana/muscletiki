import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "@/Layout";
import Index from "./pages/Index";
import MuscleTutorials from "./pages/MuscleTutorials";
import NotFound from "./pages/NotFound";
import WorkoutPrograms from "./pages/workouts";
import CalorieCalculator from "./pages/calorie_calculator";
import MacroCalculator from "./pages/macro_calculator";
import OneRMCalculator from "./pages/one_rep_max_tool";
import TDEECalculator from "./pages/tdee_calculator";
import AuthPages from "./pages/auth";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Profile from "./pages/Profile";
import TrainingLog from "./pages/TrainingLog";
import Articles from "./pages/Articles";
import Programs from "./pages/programs";
import ProgramDetail from "./pages/ProgramDetail";
import { InteractiveBodyMap } from "./components/FemalBodyFront";
import { FemalBodyBack } from "./components/FemalBodyBack";
import WorkoutDetail from "./pages/WorkoutDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />

          <Route path="/muscle/:muscle" element={<Layout><MuscleTutorials /></Layout>} />

          <Route path="/articles" element={<Layout><Articles /></Layout>} />

          <Route path="/test" element={<Layout><FemalBodyBack /></Layout>} />

          <Route path="/programs" element={<Layout><Programs /></Layout>} />
          <Route path="/programs/:slug" element={<Layout><ProgramDetail /></Layout>} />

          {/* Routines were superseded by Programs — keep old links working */}
          <Route path="/routines" element={<Navigate to="/programs" replace />} />

          <Route path="/calorie_calculator" element={<Layout><CalorieCalculator /></Layout>} />

          <Route path="/tdee_calculator" element={<Layout><TDEECalculator /></Layout>} />

          <Route
            path="/one_rep_max_tool"
            element={
              <ProtectedRoute requiredPlan="pro">
                <Layout><OneRMCalculator /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/macro_calculator"
            element={
              <ProtectedRoute requiredPlan="pro">
                <Layout><MacroCalculator /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/auth" element={<Layout><AuthPages /></Layout>} />

          <Route path="/subscription" element={<Layout><SubscriptionPlans /></Layout>} />

          <Route path="/profile" element={<Layout><Profile /></Layout>} />

          {/* Admin route — only accessible to users with role === 'admin' */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/subscription/success" element={<Layout><SubscriptionSuccess /></Layout>} />

          <Route
            path="/workout"
            element={
              <ProtectedRoute requiredPlan="pro">
                <Layout><WorkoutPrograms /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/workouts/:id"
            element={
              <ProtectedRoute requiredPlan="pro">
                <Layout><WorkoutDetail /></Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/training"
            element={
              <ProtectedRoute requiredPlan="pro">
                <Layout><TrainingLog /></Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
