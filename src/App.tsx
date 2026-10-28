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
import CareerRecommendations from "@/pages/CareerRecommendations";
import Profile from "@/pages/Profile";
import ApplicationTracker from "@/pages/ApplicationTracker";
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
      
      {/* Core Workspace & Career Pages */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><AppLayout><CareerRecommendations /></AppLayout></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><AppLayout><ResumeAnalyzer /></AppLayout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><AppLayout><CareerRoadmap /></AppLayout></ProtectedRoute>} />
      <Route path="/interview" element={<ProtectedRoute><AppLayout><InterviewPrep /></AppLayout></ProtectedRoute>} />
      <Route path="/mock-interview" element={<ProtectedRoute><AppLayout><MockInterviewSystem /></AppLayout></ProtectedRoute>} />
      <Route path="/communication" element={<ProtectedRoute><AppLayout><CommunicationSkills /></AppLayout></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><AppLayout><JobSearch /></AppLayout></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute><AppLayout><ApplicationTracker /></AppLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AppLayout><AICareerAssistant /></AppLayout></ProtectedRoute>} />
      
      {/* Deprecated legacy sections redirect to dashboard */}
      <Route path="/companies" element={<Navigate to="/dashboard" replace />} />
      <Route path="/mentors" element={<Navigate to="/dashboard" replace />} />
      <Route path="/vault" element={<Navigate to="/dashboard" replace />} />
      <Route path="/career-hub" element={<Navigate to="/dashboard" replace />} />
      <Route path="/community" element={<Navigate to="/dashboard" replace />} />
      <Route path="/videos" element={<Navigate to="/dashboard" replace />} />
      <Route path="/collaboration" element={<Navigate to="/dashboard" replace />} />
      
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
