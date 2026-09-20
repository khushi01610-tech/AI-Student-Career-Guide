import mongoose, { Schema, Document } from "mongoose";

export type ApplicationStage = 
  | "Wishlist"
  | "Applied"
  | "Online Assessment"
  | "Technical Interview"
  | "Final Round"
  | "Offer Received"
  | "Rejected";

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  role: string;
  jobType: "Full-Time" | "Internship" | "Contract";
  location: string;
  ctc: string;
  applicationDate: Date;
  deadline?: Date;
  interviewDate?: Date;
  stage: ApplicationStage;
  referralName?: string;
  jobUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    jobType: { type: String, enum: ["Full-Time", "Internship", "Contract"], default: "Full-Time" },
    location: { type: String, default: "Hybrid / On-site" },
    ctc: { type: String, default: "" },
    applicationDate: { type: Date, default: Date.now },
    deadline: { type: Date },
    interviewDate: { type: Date },
    stage: { 
      type: String, 
      enum: ["Wishlist", "Applied", "Online Assessment", "Technical Interview", "Final Round", "Offer Received", "Rejected"],
      default: "Applied"
    },
    referralName: { type: String, default: "" },
    jobUrl: { type: String, default: "" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
