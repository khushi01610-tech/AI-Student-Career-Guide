import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  college: string;
  course: string;
  branch: string;
  graduationYear: number;
  skills: string[];
  careerGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    skills: { type: [String], default: [] },
    careerGoal: { type: String, default: "" }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
