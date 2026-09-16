import express from "express";
import { 
  getDailyTopics, 
  getVocabChallenges, 
  evaluateSelfIntro, 
  evaluateSpeakingChallenge, 
  evaluateVocabSentence,
  getPracticeHistory
} from "../controllers/communicationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// @route   GET api/communication/topics
// @desc    Get daily communication topic prompts
// @access  Private
router.get("/topics", authMiddleware, getDailyTopics);

// @route   GET api/communication/vocabulary
// @desc    Get vocabulary builder words list
// @access  Private
router.get("/vocabulary", authMiddleware, getVocabChallenges);

// @route   POST api/communication/evaluate-intro
// @desc    Evaluate self introduction text
// @access  Private
router.post("/evaluate-intro", authMiddleware, evaluateSelfIntro);

// @route   POST api/communication/evaluate-speaking
// @desc    Evaluate speaking practice challenge
// @access  Private
router.post("/evaluate-speaking", authMiddleware, evaluateSpeakingChallenge);

// @route   POST api/communication/evaluate-vocab
// @desc    Evaluate vocabulary builder sentence
// @access  Private
router.post("/evaluate-vocab", authMiddleware, evaluateVocabSentence);

// @route   GET api/communication/history
// @desc    Get practice feedback history
// @access  Private
router.get("/history", authMiddleware, getPracticeHistory);

export default router;
