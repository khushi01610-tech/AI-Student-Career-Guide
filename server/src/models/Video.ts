import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  creator: mongoose.Types.ObjectId | string;
  creatorName: string;
  creatorCollege: string;
  creatorAvatar?: string;
  videoUrl: string; // File URL or mock video source
  thumbnailUrl: string;
  category: string; // 'Interview Tips', 'Resume tips', 'Coding preparation', 'Communication tips', 'Placement experience', 'Career guidance'
  views: number;
  likes: string[]; // User IDs who liked the video
  createdAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creatorName: { type: String, required: true },
    creatorCollege: { type: String, required: true },
    creatorAvatar: { type: String, default: "" },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Video = mongoose.model<IVideo>("Video", VideoSchema);
