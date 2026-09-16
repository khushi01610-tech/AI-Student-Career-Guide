import mongoose, { Schema, Document } from "mongoose";

export interface ILearningResource extends Document {
  title: string;
  category: string; // 'Career Awareness', 'Coding Tips', 'Placement Preparation', 'Soft Skills', etc.
  description: string;
  url?: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
}

const LearningResourceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    url: { type: String },
    tags: { type: [String], default: [] },
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    estimatedMinutes: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export const LearningResource = mongoose.model<ILearningResource>("LearningResource", LearningResourceSchema);
