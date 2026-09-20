import mongoose, { Schema, Document } from "mongoose";

export interface IMentorSessionBooking {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  slotDate: string;
  topic: string;
  meetingLink: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: Date;
}

export interface IMentor extends Document {
  name: string;
  college: string;
  graduationYear: number;
  currentCompany: string;
  currentRole: string;
  avatarUrl: string;
  domains: string[];
  bio: string;
  rating: number;
  reviewsCount: number;
  linkedinUrl: string;
  availableSlots: string[];
  bookings: IMentorSessionBooking[];
  createdAt: Date;
}

const MentorSessionBookingSchema = new Schema<IMentorSessionBooking>({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  slotDate: { type: String, required: true },
  topic: { type: String, default: "1:1 Coffee Chat & Placement Advice" },
  meetingLink: { type: String, default: "https://meet.google.com/mock-alumni-session" },
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  createdAt: { type: Date, default: Date.now }
});

const MentorSchema = new Schema<IMentor>(
  {
    name: { type: String, required: true },
    college: { type: String, required: true },
    graduationYear: { type: Number, required: true },
    currentCompany: { type: String, required: true },
    currentRole: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    domains: [{ type: String }],
    bio: { type: String, default: "" },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
    linkedinUrl: { type: String, default: "" },
    availableSlots: [{ type: String }],
    bookings: [MentorSessionBookingSchema]
  },
  { timestamps: true }
);

export const Mentor = mongoose.model<IMentor>("Mentor", MentorSchema);
