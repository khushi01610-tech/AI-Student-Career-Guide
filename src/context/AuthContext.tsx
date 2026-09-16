import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";

interface UserType {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  branch: string;
  graduationYear: number;
  skills: string[];
  careerGoal: string;
}

interface ProfileType {
  _id: string;
  user: string;
  avatarUrl?: string;
  bio?: string;
  resumeUrl?: string;
  resumeScore?: number;
  atsScore?: number;
  formatScore?: number;
  keywordScore?: number;
  skillsScore?: number;
  projectScore?: number;
  interviewScore?: number;
  communicationScore?: number;
  skillsCompleted?: number;
  mockInterviewsCompleted?: number;
  communityContributions?: number;
  projects: any[];
  achievements: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  profile: ProfileType | null;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUserSkills: (skills: string[]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.auth.me();
      setUser(data.user);
      setProfile(data.profile);
    } catch (error) {
      console.error("Token authentication failed, logging out:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await api.auth.login(credentials);
      localStorage.setItem("token", data.token);
      await checkUserAuth();
      return data;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const data = await api.auth.register(userData);
      localStorage.setItem("token", data.token);
      await checkUserAuth();
      return data;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
    setLoading(false);
  };

  const refreshProfile = async () => {
    try {
      const data = await api.auth.me();
      setUser(data.user);
      setProfile(data.profile);
    } catch (e) {
      console.error("Error refreshing profile:", e);
    }
  };

  const updateUserSkills = (newSkills: string[]) => {
    if (user) {
      setUser({
        ...user,
        skills: newSkills
      });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        updateUserSkills
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
