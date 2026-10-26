import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
import CompanyArchives from "@/pages/CompanyArchives";
import ApplicationTracker from "@/pages/ApplicationTracker";
import Mentorship from "@/pages/Mentorship";
import CareerVault from "@/pages/CareerVault";
import JobSearch from "@/pages/JobSearch";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MainRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Dashboard and Internal Workspace pages */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><AppLayout><CompanyArchives /></AppLayout></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><AppLayout><ApplicationTracker /></AppLayout></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><AppLayout><JobSearch /></AppLayout></ProtectedRoute>} />
      <Route path="/mentors" element={<ProtectedRoute><AppLayout><Mentorship /></AppLayout></ProtectedRoute>} />
      <Route path="/vault" element={<ProtectedRoute><AppLayout><CareerVault /></AppLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AppLayout><AICareerAssistant /></AppLayout></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><AppLayout><InterviewPrep /></AppLayout></ProtectedRoute>} />
      <Route path="/mock-interview" element={<ProtectedRoute><AppLayout><MockInterviewSystem /></AppLayout></ProtectedRoute>} />
      <Route path="/communication" element={<ProtectedRoute><AppLayout><CommunicationSkills /></AppLayout></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><AppLayout><ResumeAnalyzer /></AppLayout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><AppLayout><CareerRoadmap /></AppLayout></ProtectedRoute>} />
      <Route path="/career-hub" element={<ProtectedRoute><AppLayout><CareerHub /></AppLayout></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><AppLayout><Community /></AppLayout></ProtectedRoute>} />
      <Route path="/videos" element={<ProtectedRoute><AppLayout><Videos /></AppLayout></ProtectedRoute>} />
      <Route path="/collaboration" element={<ProtectedRoute><AppLayout><Collaboration /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
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
  </ErrorBoundary>
);

export default App;
