import mongoose, { Schema, Document } from "mongoose";

export interface ISelectionRound {
  roundNumber: number;
  name: string;
  type: "Online Assessment" | "Technical Interview" | "System Design" | "Managerial / HR" | "Group Discussion";
  duration: string;
  description: string;
  focusTopics: string[];
}

export interface IPastQuestion {
  question: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  round: string;
  frequency: "High" | "Medium" | "Occasional";
}

export interface ICompany extends Document {
  name: string;
  slug: string;
  logo: string;
  industry: string;
  headquarters: string;
  rolesHiring: string[];
  packageRange: string;
  cgpaCutoff: number;
  eligibleBranches: string[];
  hiringSeason: string;
  selectionRounds: ISelectionRound[];
  pastQuestions: IPastQuestion[];
  alumniHiredCount: number;
  prepTips: string[];
  createdAt: Date;
}

const SelectionRoundSchema = new Schema<ISelectionRound>({
  roundNumber: { type: Number, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  focusTopics: [{ type: String }]
});

const PastQuestionSchema = new Schema<IPastQuestion>({
  question: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  round: { type: String, required: true },
  frequency: { type: String, enum: ["High", "Medium", "Occasional"], default: "High" }
});

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    industry: { type: String, required: true },
    headquarters: { type: String, default: "" },
    rolesHiring: [{ type: String }],
    packageRange: { type: String, required: true },
    cgpaCutoff: { type: Number, default: 7.0 },
    eligibleBranches: [{ type: String }],
    hiringSeason: { type: String, default: "Autumn / Spring" },
    selectionRounds: [SelectionRoundSchema],
    pastQuestions: [PastQuestionSchema],
    alumniHiredCount: { type: Number, default: 0 },
    prepTips: [{ type: String }]
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
