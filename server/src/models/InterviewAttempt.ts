import mongoose, { Schema, Document } from "mongoose";

export interface IQA {
  question: string;
  category: string; // 'Technical', 'HR', 'Behavioral', 'Situational'
  studentAnswer: string;
  sampleAnswer: string;
  feedback: {
    score: number; // 0-100
    quality: string;
    relevance: string;
    confidence: string;
    communication: string;
    clarity: string;
    suggestions: string;
    improvedAnswer: string;
  };
}

export interface IInterviewAttempt extends Document {
  user: mongoose.Types.ObjectId | string;
  role: string;
  type: string; // 'Technical' | 'HR' | 'Mixed'
  difficulty: string; // 'Entry Level' | 'Mid Level' | 'Senior'
  questions: IQA[];
  overallScore: number;
  createdAt: Date;
}

const QASchema = new Schema({
  question: { type: String, required: true },
  category: { type: String, required: true },
  studentAnswer: { type: String, default: "" },
  sampleAnswer: { type: String, default: "" },
  feedback: {
    score: { type: Number, default: 0 },
    quality: { type: String, default: "" },
    relevance: { type: String, default: "" },
    confidence: { type: String, default: "" },
    communication: { type: String, default: "" },
    clarity: { type: String, default: "" },
    suggestions: { type: String, default: "" },
    improvedAnswer: { type: String, default: "" }
  }
});

const InterviewAttemptSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: { type: [QASchema], default: [] },
    overallScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const InterviewAttempt = mongoose.model<IInterviewAttempt>("InterviewAttempt", InterviewAttemptSchema);
