import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId | string;
  senderName: string;
  type: "invitation" | "comment" | "like" | "system" | "session";
  content: string;
  referenceId?: string; // ID of post, session, etc.
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    type: { type: String, enum: ["invitation", "comment", "like", "system", "session"], required: true },
    content: { type: String, required: true },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
