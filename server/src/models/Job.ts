import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  source: "LinkedIn" | "Indeed";
  type: "Full-time" | "Internship" | "Contract";
  salary: string;
  level: "Entry Level" | "Fresher" | "Internship" | "Mid Level";
  batchEligibility: string[];
  workplaceType: "On-site" | "Hybrid" | "Remote";
  description: string;
  skills: string[];
  applyUrl: string;
  postedDate: string;
  deadline?: string;
  companyLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    source: { type: String, enum: ["LinkedIn", "Indeed"], required: true },
    type: { type: String, enum: ["Full-time", "Internship", "Contract"], default: "Full-time" },
    salary: { type: String, required: true },
    level: { type: String, enum: ["Entry Level", "Fresher", "Internship", "Mid Level"], default: "Fresher" },
    batchEligibility: [{ type: String }],
    workplaceType: { type: String, enum: ["On-site", "Hybrid", "Remote"], default: "Hybrid" },
    description: { type: String, required: true },
    skills: [{ type: String }],
    applyUrl: { type: String, required: true },
    postedDate: { type: String, default: "Recently" },
    deadline: { type: String },
    companyLogo: { type: String }
  },
  { timestamps: true }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
