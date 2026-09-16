import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Video } from "../models/Video";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getVideos = async (req: AuthenticatedRequest, res: Response) => {
  const { category } = req.query;

  try {
    let videos: any[] = [];

    if (checkFallback()) {
      videos = fallbackDb.find("videos", v => {
        if (category) return v.category === (category as string);
        return true;
      });
      videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const query: any = {};
      if (category) query.category = category;
      videos = await Video.find(query).sort({ createdAt: -1 });
    }

    res.json(videos);
  } catch (error: any) {
    console.error("Fetch videos error:", error);
    res.status(500).json({ message: "Failed to load videos", error: error.message });
  }
};

export const createVideo = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { title, videoUrl, thumbnailUrl, category } = req.body;

  if (!title || !videoUrl || !category) {
    return res.status(400).json({ message: "Title, videoUrl, and category are required" });
  }

  try {
    let user: any = null;
    let profile: any = null;

    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
    } else {
      user = await User.findById(userId);
      profile = await Profile.findOne({ user: userId });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const creatorAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;
    const finalThumbnail = thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60"; // fallback image

    let savedVideo: any = null;

    if (checkFallback()) {
      savedVideo = fallbackDb.insert("videos", {
        title,
        creator: userId,
        creatorName: user.name,
        creatorCollege: user.college,
        creatorAvatar,
        videoUrl,
        thumbnailUrl: finalThumbnail,
        category,
        views: 0,
        likes: []
      });
    } else {
      const video = new Video({
        title,
        creator: userId,
        creatorName: user.name,
        creatorCollege: user.college,
        creatorAvatar,
        videoUrl,
        thumbnailUrl: finalThumbnail,
        category,
        views: 0,
        likes: []
      });
      savedVideo = await video.save();
    }

    res.status(201).json(savedVideo);
  } catch (error: any) {
    console.error("Create video error:", error);
    res.status(500).json({ message: "Failed to upload video description", error: error.message });
  }
};

export const likeVideo = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    let video: any = null;

    if (checkFallback()) {
      video = fallbackDb.findById("videos", id);
      if (!video) return res.status(404).json({ message: "Video not found" });

      const likes = video.likes || [];
      const index = likes.indexOf(userId);

      if (index > -1) {
        likes.splice(index, 1);
      } else {
        likes.push(userId);
      }
      video = fallbackDb.findByIdAndUpdate("videos", id, { likes });
    } else {
      video = await Video.findById(id);
      if (!video) return res.status(404).json({ message: "Video not found" });

      const index = video.likes.indexOf(userId!);
      if (index > -1) {
        video.likes.splice(index, 1);
      } else {
        video.likes.push(userId!);
      }
      await video.save();
    }

    res.json({ likes: video.likes, liked: video.likes.includes(userId) });
  } catch (error: any) {
    console.error("Like video error:", error);
    res.status(500).json({ message: "Server error liking video", error: error.message });
  }
};

export const viewVideo = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    let video: any = null;

    if (checkFallback()) {
      video = fallbackDb.findById("videos", id);
      if (!video) return res.status(404).json({ message: "Video not found" });
      
      const views = (video.views || 0) + 1;
      video = fallbackDb.findByIdAndUpdate("videos", id, { views });
    } else {
      video = await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
    }

    res.json({ views: video.views });
  } catch (error: any) {
    console.error("View video error:", error);
    res.status(500).json({ message: "Server error incrementing view", error: error.message });
  }
};
