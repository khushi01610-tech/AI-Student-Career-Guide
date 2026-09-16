import mongoose, { Schema, Document } from "mongoose";

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId | string;
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
  projects: IProject[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], default: [] },
  link: { type: String }
});

const ProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    avatarUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    resumeScore: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    formatScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    skillsScore: { type: Number, default: 0 },
    projectScore: { type: Number, default: 0 },
    interviewScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    skillsCompleted: { type: Number, default: 0 },
    mockInterviewsCompleted: { type: Number, default: 0 },
    communityContributions: { type: Number, default: 0 },
    projects: { type: [ProjectSchema], default: [] },
    achievements: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
