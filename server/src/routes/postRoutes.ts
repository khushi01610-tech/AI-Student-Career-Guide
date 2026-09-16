import express from "express";
import { getPosts, createPost, likePost, commentPost, savePost } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/posts
// @desc    Get community or Career Hub posts
// @access  Private
router.get("/", authMiddleware, getPosts);

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post("/", authMiddleware, createPost);

// @route   POST api/posts/:id/like
// @desc    Toggle like for post
// @access  Private
router.post("/:id/like", authMiddleware, likePost);

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post("/:id/comment", authMiddleware, commentPost);

// @route   POST api/posts/:id/save
// @desc    Toggle bookmark save post
// @access  Private
router.post("/:id/save", authMiddleware, savePost);

export default router;
