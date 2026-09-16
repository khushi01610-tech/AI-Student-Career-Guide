import mongoose, { Schema, Document } from "mongoose";

export interface ICommunicationPractice extends Document {
  user: mongoose.Types.ObjectId | string;
  type: "introduction" | "daily" | "vocabulary";
  topic: string;
  inputContent: string;
  score: number; // 0-100
  grammarSuggestions: string[];
  clarityFeedback: string;
  confidenceTips: string;
  betterVersion: string;
  createdAt: Date;
}

const CommunicationPracticeSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["introduction", "daily", "vocabulary"], required: true },
    topic: { type: String, required: true },
    inputContent: { type: String, required: true },
    score: { type: Number, default: 0 },
    grammarSuggestions: { type: [String], default: [] },
    clarityFeedback: { type: String, default: "" },
    confidenceTips: { type: String, default: "" },
    betterVersion: { type: String, default: "" }
  },
  { timestamps: true }
);

export const CommunicationPractice = mongoose.model<ICommunicationPractice>("CommunicationPractice", CommunicationPracticeSchema);
