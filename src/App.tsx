import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import AICareerAssistant from "@/pages/AICareerAssistant";
import InterviewPrep from "@/pages/InterviewPrep";
import MockInterviewSystem from "@/pages/MockInterviewSystem";
import CommunicationSkills from "@/pages/CommunicationSkills";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import CareerRoadmap from "@/pages/CareerRoadmap";
import CareerHub from "@/pages/CareerHub";
import Community from "@/pages/Community";
import Videos from "@/pages/Videos";
import Collaboration from "@/pages/Collaboration";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// A helper layout switcher to render layout only when authenticated
const MainRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <AppLayout>
      <Routes>
        {/* Public Landing route at / */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Dashboard pages */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AICareerAssistant /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
        <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewSystem /></ProtectedRoute>} />
        <Route path="/communication" element={<ProtectedRoute><CommunicationSkills /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
        <Route path="/career-hub" element={<ProtectedRoute><CareerHub /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
        <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MainRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
