import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  _id?: string;
  user: string; // User ID
  name: string; // User display name
  avatarUrl?: string;
  college: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  author: mongoose.Types.ObjectId | string;
  authorName: string;
  authorCollege: string;
  authorAvatar?: string;
  content: string;
  tags: string[]; // ['Interview', 'Resume', 'Communication', 'Coding', 'Career', 'Projects', 'Placement', 'General']
  likes: string[]; // Array of User IDs who liked the post
  comments: IComment[];
  savedBy: string[]; // Array of User IDs who saved the post
  isHubResource: boolean; // True if this post belongs to the curated "Career Hub" rather than General Community
  category?: string; // 'Interview Tips', 'Resume Guidance', 'Placement Preparation', etc. (for Career Hub)
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  user: { type: String, required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  college: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema: Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorCollege: { type: String, required: true },
    authorAvatar: { type: String, default: "" },
    content: { type: String, required: true },
    tags: { type: [String], default: ["General"] },
    likes: { type: [String], default: [] },
    comments: { type: [CommentSchema], default: [] },
    savedBy: { type: [String], default: [] },
    isHubResource: { type: Boolean, default: false },
    category: { type: String }
  },
  { timestamps: true }
);

export const Post = mongoose.model<IPost>("Post", PostSchema);
