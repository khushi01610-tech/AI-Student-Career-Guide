import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";
import { v4 as uuidv4 } from "uuid";

export const getPosts = async (req: AuthenticatedRequest, res: Response) => {
  const { tag, category, isHubResource } = req.query;

  try {
    let posts: any[] = [];
    const isHub = isHubResource === "true";

    if (checkFallback()) {
      posts = fallbackDb.find("posts", p => {
        let match = Boolean(p.isHubResource) === isHub;
        
        if (match && tag) {
          match = p.tags && p.tags.includes(tag as string);
        }
        
        if (match && category) {
          match = p.category === (category as string);
        }
        
        return match;
      });
      // Sort by newest
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      const query: any = { isHubResource: isHub };
      if (tag) query.tags = tag;
      if (category) query.category = category;

      posts = await Post.find(query).sort({ createdAt: -1 });
    }

    res.json(posts);
  } catch (error: any) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ message: "Failed to load posts", error: error.message });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { content, tags, isHubResource, category } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Post content is required" });
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tagsArray = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()) : ["General"];
    const authorAvatar = profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`;

    let savedPost: any = null;

    if (checkFallback()) {
      savedPost = fallbackDb.insert("posts", {
        author: userId,
        authorName: user.name,
        authorCollege: user.college,
        authorAvatar,
        content,
        tags: tagsArray,
        likes: [],
        comments: [],
        savedBy: [],
        isHubResource: isHubResource === true,
        category: category || undefined
      });

      // Update contributions count
      if (profile) {
        fallbackDb.findByIdAndUpdate("profiles", profile._id, {
          communityContributions: (profile.communityContributions || 0) + 1
        });
      }
    } else {
      const post = new Post({
        author: userId,
        authorName: user.name,
        authorCollege: user.college,
        authorAvatar,
        content,
        tags: tagsArray,
        likes: [],
        comments: [],
        savedBy: [],
        isHubResource: isHubResource === true,
        category: category || undefined
      });
      savedPost = await post.save();

      // Update contributions
      if (profile) {
        profile.communityContributions = (profile.communityContributions || 0) + 1;
        await profile.save();
      }
    }

    res.status(201).json(savedPost);
  } catch (error: any) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Failed to create post", error: error.message });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    let post: any = null;

    if (checkFallback()) {
      post = fallbackDb.findById("posts", id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const likes = post.likes || [];
      const index = likes.indexOf(userId);

      if (index > -1) {
        likes.splice(index, 1); // Unlike
      } else {
        likes.push(userId); // Like
      }

      post = fallbackDb.findByIdAndUpdate("posts", id, { likes });
    } else {
      post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const index = post.likes.indexOf(userId!);
      if (index > -1) {
        post.likes.splice(index, 1);
      } else {
        post.likes.push(userId!);
      }
      await post.save();
    }

    res.json({ likes: post.likes, liked: post.likes.includes(userId) });
  } catch (error: any) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error toggling like", error: error.message });
  }
};

export const commentPost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  try {
    let user: any = null;
    let profile: any = null;
    let post: any = null;

    if (checkFallback()) {
      user = fallbackDb.findById("users", userId!);
      profile = fallbackDb.findOne("profiles", p => p.user === userId);
      post = fallbackDb.findById("posts", id);
    } else {
      user = await User.findById(userId);
      profile = await Profile.findOne({ user: userId });
      post = await Post.findById(id);
    }

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newComment = {
      _id: uuidv4(),
      user: userId!,
      name: user.name,
      avatarUrl: profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
      college: user.college,
      content,
      createdAt: new Date()
    };

    if (checkFallback()) {
      const comments = post.comments || [];
      comments.push(newComment);
      post = fallbackDb.findByIdAndUpdate("posts", id, { comments });
    } else {
      post.comments.push(newComment);
      await post.save();
    }

    res.status(201).json(post.comments);
  } catch (error: any) {
    console.error("Comment post error:", error);
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

export const savePost = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    let post: any = null;

    if (checkFallback()) {
      post = fallbackDb.findById("posts", id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const savedBy = post.savedBy || [];
      const index = savedBy.indexOf(userId);

      if (index > -1) {
        savedBy.splice(index, 1);
      } else {
        savedBy.push(userId);
      }

      post = fallbackDb.findByIdAndUpdate("posts", id, { savedBy });
    } else {
      post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const index = post.savedBy.indexOf(userId!);
      if (index > -1) {
        post.savedBy.splice(index, 1);
      } else {
        post.savedBy.push(userId!);
      }
      await post.save();
    }

    res.json({ savedBy: post.savedBy, saved: post.savedBy.includes(userId) });
  } catch (error: any) {
    console.error("Save post error:", error);
    res.status(500).json({ message: "Server error saving post", error: error.message });
  }
};
