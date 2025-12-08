import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AuthPages from "./pages/auth";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import Profile from "./pages/Profile";
import Articles from "./pages/Articles";

const queryClient = new QueryClient();

const App = () => (

  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />

          <Route
            path="/muscle/:muscle"
            element={
              <Layout>
                <MuscleTutorials />
              </Layout>
            }
          />
          <Route
            path="/articles"
            element={
              <Layout>
                <Articles />
              </Layout>
            }
          />
            <Route
            path="/calorie_calculator"
            element={
              <Layout>
                <CalorieCalculator />
              </Layout>
            }
          />

          <Route
            path="/one_rep_max_tool"
            element={
              <ProtectedRoute requiredPlan="pro">
              <Layout>
                <OneRMCalculator />
              </Layout>
               </ProtectedRoute>
            }
          />

                              <Route
            path="/macro_calculator"
            element={
              <ProtectedRoute requiredPlan="pro">
              <Layout>
                <MacroCalculator />
              </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <Layout>
                <AuthPages />
              </Layout>
            }
          />

          <Route
            path="/subscription"
            element={
              <Layout>
                <SubscriptionPlans />
              </Layout>
            }
          />

         <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

          <Route
            path="/admin"
            element={
              <Layout>
                <AdminDashboard />
              </Layout>
            }
          />

            <Route
              path="/subscription/success"
              element={
                <Layout>
                  <SubscriptionSuccess/>
                </Layout>
              }
            />

            <Route path="/workout" element={
              <ProtectedRoute requiredPlan="pro">
                <Layout>
                    <WorkoutPrograms />
                </Layout>
              </ProtectedRoute>
            } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;
