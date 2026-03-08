import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import CalculatorPage from "@/pages/CalculatorPage";
import PricingPage from "@/pages/PricingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import AboutPage from "@/pages/AboutPage";
import ResourcesPage from "@/pages/ResourcesPage";
import ContactPage from "@/pages/ContactPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import DataEntry from "@/pages/DataEntry";
import SupplyChain from "@/pages/SupplyChain";
import Pollution from "@/pages/Pollution";
import Footprint from "@/pages/Footprint";
import StressMap from "@/pages/StressMap";
import Reports from "@/pages/Reports";
import ActionPlan from "@/pages/ActionPlan";
import Recommendations from "@/pages/Recommendations";
import Organization from "@/pages/Organization";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/calculateur" element={<CalculatorPage />} />
      <Route path="/tarifs" element={<PricingPage />} />
      <Route path="/fonctionnalites" element={<FeaturesPage />} />
      <Route path="/a-propos" element={<AboutPage />} />
      <Route path="/ressources" element={<ResourcesPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/data-entry" element={<ProtectedRoute><AppLayout><DataEntry /></AppLayout></ProtectedRoute>} />
      <Route path="/supply-chain" element={<ProtectedRoute><AppLayout><SupplyChain /></AppLayout></ProtectedRoute>} />
      <Route path="/pollution" element={<ProtectedRoute><AppLayout><Pollution /></AppLayout></ProtectedRoute>} />
      <Route path="/footprint" element={<ProtectedRoute><AppLayout><Footprint /></AppLayout></ProtectedRoute>} />
      <Route path="/stress-map" element={<ProtectedRoute><AppLayout><StressMap /></AppLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
      <Route path="/action-plan" element={<ProtectedRoute><AppLayout><ActionPlan /></AppLayout></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><AppLayout><Recommendations /></AppLayout></ProtectedRoute>} />
      <Route path="/organization" element={<ProtectedRoute><AppLayout><Organization /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
