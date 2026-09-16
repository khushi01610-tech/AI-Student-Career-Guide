import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ResumeAnalysis, Job, CareerPlan, DashboardData } from "@/types/career";

interface CareerContextType {
  resumeAnalysis: ResumeAnalysis | null;
  setResumeAnalysis: (data: ResumeAnalysis | null) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  careerPlan: CareerPlan | null;
  setCareerPlan: (plan: CareerPlan | null) => void;
  dashboardData: DashboardData | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
}

const CareerContext = createContext<CareerContextType | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [careerPlan, setCareerPlan] = useState<CareerPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const dashboardData: DashboardData | null = resumeAnalysis
    ? {
        resumeScore: resumeAnalysis.resumeScore,
        atsScore: resumeAnalysis.atsScore,
        formatScore: resumeAnalysis.formatScore,
        impactScore: resumeAnalysis.impactScore,
        brevityScore: resumeAnalysis.brevityScore,
        keywordScore: resumeAnalysis.keywordScore,
        readabilityScore: resumeAnalysis.readabilityScore,
        quantificationScore: resumeAnalysis.quantificationScore,
        matchScore: jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.matchScore, 0) / jobs.length) : 0,
        jobsFound: jobs.length,
        skills: resumeAnalysis.skills,
        certifications: resumeAnalysis.certifications || [],
        skillFrequency: resumeAnalysis.skills.map((s, i) => ({ skill: s, count: Math.max(1, 10 - i) })),
        matchDistribution: [
          { range: "0-20", count: jobs.filter((j) => j.matchScore <= 20).length },
          { range: "21-40", count: jobs.filter((j) => j.matchScore > 20 && j.matchScore <= 40).length },
          { range: "41-60", count: jobs.filter((j) => j.matchScore > 40 && j.matchScore <= 60).length },
          { range: "61-80", count: jobs.filter((j) => j.matchScore > 60 && j.matchScore <= 80).length },
          { range: "81-100", count: jobs.filter((j) => j.matchScore > 80).length },
        ],
        jobDemandTrends: resumeAnalysis.roleRecommendations.slice(0, 7).map((r, i) => ({
          role: r,
          demand: Math.round(85 - i * 10 + Math.random() * 10),
        })),
        strengthBreakdown: resumeAnalysis.strengthBreakdown,
        sectionAnalysis: resumeAnalysis.sectionAnalysis || [],
        experienceTimeline: (resumeAnalysis.experience || []).map(e => ({
          role: e.role,
          company: e.company,
          duration: e.duration,
        })),
        scoreBreakdown: [
          { metric: "Resume Score", score: resumeAnalysis.resumeScore },
          { metric: "ATS Score", score: resumeAnalysis.atsScore },
          { metric: "Format", score: resumeAnalysis.formatScore },
          { metric: "Impact", score: resumeAnalysis.impactScore },
          { metric: "Brevity", score: resumeAnalysis.brevityScore },
          { metric: "Keywords", score: resumeAnalysis.keywordScore },
          { metric: "Readability", score: resumeAnalysis.readabilityScore },
          { metric: "Quantification", score: resumeAnalysis.quantificationScore },
        ],
      }
    : null;

  return (
    <CareerContext.Provider
      value={{
        resumeAnalysis, setResumeAnalysis,
        jobs, setJobs,
        careerPlan, setCareerPlan,
        dashboardData,
        isLoading, setIsLoading,
        userName, setUserName,
        userEmail, setUserEmail,
        userPhone, setUserPhone,
        userLocation, setUserLocation,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error("useCareer must be used within CareerProvider");
  return ctx;
}
