export interface ResumeAnalysis {
  resumeText: string;
  skills: string[];
  certifications: string[];
  experience: { role: string; company: string; duration: string; highlights: string[] }[];
  education: { degree: string; institution: string; year: string }[];
  resumeScore: number;
  atsScore: number;
  formatScore: number;
  impactScore: number;
  brevityScore: number;
  keywordScore: number;
  readabilityScore: number;
  quantificationScore: number;
  missingSkills: string[];
  roleRecommendations: string[];
  bulletImprovements: { original: string; improved: string }[];
  strengthBreakdown: { category: string; score: number }[];
  sectionAnalysis: { section: string; present: boolean; quality: number }[];
  summary: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  url: string;
  matchScore: number;
  source: "remoteok" | "adzuna";
  description?: string;
  tags?: string[];
  date?: string;
}

export interface CareerPlan {
  actionPlan: string[];
  weeklyTimetable: { week: string; tasks: string[]; goal: string }[];
  marketTrends: { trend: string; demand: string; growth: string }[];
  skillGaps: { skill: string; importance: number; timeToLearn: string }[];
  learningResources: { title: string; url: string; type: string; difficulty: string }[];
  projectIdeas: { title: string; description: string; skills: string[] }[];
  industryInsights: string[];
  salaryExpectations: { role: string; min: number; max: number; avg: number }[];
}

export interface DashboardData {
  resumeScore: number;
  atsScore: number;
  formatScore: number;
  impactScore: number;
  brevityScore: number;
  keywordScore: number;
  readabilityScore: number;
  quantificationScore: number;
  matchScore: number;
  jobsFound: number;
  skills: string[];
  certifications: string[];
  skillFrequency: { skill: string; count: number }[];
  matchDistribution: { range: string; count: number }[];
  jobDemandTrends: { role: string; demand: number }[];
  strengthBreakdown: { category: string; score: number }[];
  sectionAnalysis: { section: string; present: boolean; quality: number }[];
  experienceTimeline: { role: string; company: string; duration: string }[];
  scoreBreakdown: { metric: string; score: number }[];
}
