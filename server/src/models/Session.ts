import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  role: string;
  dateTime: Date;
  creator: mongoose.Types.ObjectId | string;
  creatorName: string;
  creatorCollege: string;
  creatorAvatar?: string;
  participants: string[]; // User IDs who joined
  maxParticipants: number;
  meetingLink: string;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    dateTime: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creatorName: { type: String, required: true },
    creatorCollege: { type: String, required: true },
    creatorAvatar: { type: String, default: "" },
    participants: { type: [String], default: [] },
    maxParticipants: { type: Number, default: 2 },
    meetingLink: { type: String, required: true },
    status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" }
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>("Session", SessionSchema);
