import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { CommunicationPractice } from "../models/CommunicationPractice";
import { Profile } from "../models/Profile";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";
import { aiService } from "../services/aiService";

// Daily topics list
const DAILY_TOPICS = [
  { id: 1, title: "Describe your graduation project", description: "Explain what you built, the technologies you used, and what challenges you solved." },
  { id: 2, title: "What is your favorite technology, and why?", description: "Explain why you enjoy it, how you learned it, and what problem it solves." },
  { id: 3, title: "Describe a difficult technical problem you solved", description: "Detail the context, what was failing, and the debugging steps you executed." },
  { id: 4, title: "Talk about your strengths and how they apply to team projects", description: "State 2 key strengths and share an instance where they contributed to a project's completion." },
  { id: 5, title: "Why should we hire you over other candidates?", description: "Explain your unique alignment, core technical skills, and cultural adaptability." }
];

// Vocabulary words list
const VOCABULARY_CHALLENGES = [
  { word: "Resilient", meaning: "Able to withstand or recover quickly from difficult conditions.", example: "Despite the query latency issues, the backend architecture remained resilient." },
  { word: "Mitigate", meaning: "Make something bad less severe, serious, or painful.", example: "We implemented caching layers to mitigate the load on our databases." },
  { word: "Pragmatic", meaning: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.", example: "Choosing a familiar SQL database was a pragmatic decision for our fast development deadline." },
  { word: "Consolidate", meaning: "Combine a number of things into a single more effective or coherent whole.", example: "We decided to consolidate our redundant microservices into a single Express server." },
  { word: "Exemplary", meaning: "Representing the best of its kind; fit to be imitated.", example: "His attention to documenting APIs was exemplary for the whole dev team." }
];

export const getDailyTopics = (req: Request, res: Response) => {
  res.json(DAILY_TOPICS);
};

export const getVocabChallenges = (req: Request, res: Response) => {
  res.json(VOCABULARY_CHALLENGES);
};

export const evaluateSelfIntro = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { introductionText } = req.body;

  if (!introductionText) {
    return res.status(400).json({ message: "Introduction text is required" });
  }

  try {
    const feedback = await aiService.evaluateSelfIntroduction(introductionText);
    
    // Save record
    let savedRecord: any = null;
    if (checkFallback()) {
      savedRecord = fallbackDb.insert("communicationPractice", {
        user: userId,
        type: "introduction",
        topic: "Self Introduction Practice",
        inputContent: introductionText,
        score: feedback.score,
        grammarSuggestions: feedback.grammarSuggestions,
        clarityFeedback: feedback.clarityFeedback,
        confidenceTips: feedback.confidenceTips,
        betterVersion: feedback.betterVersion
      });

      // Update communication score in profile
      let profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (profile) {
        const currentScore = profile.communicationScore || 0;
        const newScore = Math.max(currentScore, feedback.score); // Keep highest score
        fallbackDb.findByIdAndUpdate("profiles", profile._id, { communicationScore: newScore });
      }
    } else {
      const practice = new CommunicationPractice({
        user: userId,
        type: "introduction",
        topic: "Self Introduction Practice",
        inputContent: introductionText,
        score: feedback.score,
        grammarSuggestions: feedback.grammarSuggestions,
        clarityFeedback: feedback.clarityFeedback,
        confidenceTips: feedback.confidenceTips,
        betterVersion: feedback.betterVersion
      });
      savedRecord = await practice.save();

      // Update profile
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        const currentScore = profile.communicationScore || 0;
        const newScore = Math.max(currentScore, feedback.score);
        profile.communicationScore = newScore;
        await profile.save();
      }
    }

    res.json({
      message: "Self introduction evaluated successfully",
      evaluation: feedback,
      record: savedRecord
    });
  } catch (error: any) {
    console.error("Evaluate intro error:", error);
    res.status(500).json({ message: "Failed to evaluate introduction", error: error.message });
  }
};

export const evaluateSpeakingChallenge = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { topic, answerText } = req.body;

  if (!topic || !answerText) {
    return res.status(400).json({ message: "Topic and answer text are required" });
  }

  try {
    // Utilize answer evaluation for speaking practice
    const feedback = await aiService.evaluateInterviewAnswer(topic, answerText);

    let savedRecord: any = null;
    if (checkFallback()) {
      savedRecord = fallbackDb.insert("communicationPractice", {
        user: userId,
        type: "daily",
        topic: topic,
        inputContent: answerText,
        score: feedback.score,
        grammarSuggestions: feedback.suggestions ? [feedback.suggestions] : [],
        clarityFeedback: feedback.clarity,
        confidenceTips: feedback.confidence,
        betterVersion: feedback.improvedAnswer
      });

      // Update profile comms score
      let profile = fallbackDb.findOne("profiles", p => p.user === userId);
      if (profile) {
        const currentScore = profile.communicationScore || 0;
        const newScore = Math.max(currentScore, feedback.score);
        fallbackDb.findByIdAndUpdate("profiles", profile._id, { communicationScore: newScore });
      }
    } else {
      const practice = new CommunicationPractice({
        user: userId,
        type: "daily",
        topic: topic,
        inputContent: answerText,
        score: feedback.score,
        grammarSuggestions: feedback.suggestions ? [feedback.suggestions] : [],
        clarityFeedback: feedback.clarity,
        confidenceTips: feedback.confidence,
        betterVersion: feedback.improvedAnswer
      });
      savedRecord = await practice.save();

      // Update profile
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        const currentScore = profile.communicationScore || 0;
        const newScore = Math.max(currentScore, feedback.score);
        profile.communicationScore = newScore;
        await profile.save();
      }
    }

    res.json({
      message: "Speaking practice evaluated successfully",
      evaluation: feedback,
      record: savedRecord
    });
  } catch (error: any) {
    console.error("Evaluate speaking error:", error);
    res.status(500).json({ message: "Failed to evaluate speaking challenge", error: error.message });
  }
};

export const evaluateVocabSentence = async (req: AuthenticatedRequest, res: Response) => {
  const { word, meaning, studentSentence } = req.body;
  const userId = req.userId;

  if (!word || !studentSentence) {
    return res.status(400).json({ message: "Word and sentence are required" });
  }

  try {
    // Basic verification - checking if the word is included (case-insensitive)
    const normalizedSentence = studentSentence.toLowerCase();
    const normalizedWord = word.toLowerCase();
    
    const wordPresent = normalizedSentence.includes(normalizedWord) || 
                        normalizedSentence.includes(normalizedWord + "s") || 
                        normalizedSentence.includes(normalizedWord + "ed") || 
                        normalizedSentence.includes(normalizedWord + "ly");

    let score = 30;
    let feedback = "";
    let betterVersion = "";

    if (!wordPresent) {
      feedback = `The word '${word}' is not found in your sentence. Please rewrite your sentence.`;
    } else if (studentSentence.trim().split(/\s+/).length < 6) {
      score = 60;
      feedback = "Good start, but try to write a longer, descriptive sentence to show you fully understand the word context.";
      betterVersion = `${studentSentence} to mitigate our microservices load.`;
    } else {
      score = 90;
      feedback = `Excellent! You used the word '${word}' correctly and with good vocabulary structure.`;
    }

    let savedRecord: any = null;
    if (checkFallback()) {
      savedRecord = fallbackDb.insert("communicationPractice", {
        user: userId,
        type: "vocabulary",
        topic: `Vocab Builder: ${word}`,
        inputContent: studentSentence,
        score,
        grammarSuggestions: [],
        clarityFeedback: feedback,
        confidenceTips: "",
        betterVersion: betterVersion
      });
    } else {
      const practice = new CommunicationPractice({
        user: userId,
        type: "vocabulary",
        topic: `Vocab Builder: ${word}`,
        inputContent: studentSentence,
        score,
        grammarSuggestions: [],
        clarityFeedback: feedback,
        confidenceTips: "",
        betterVersion: betterVersion
      });
      savedRecord = await practice.save();
    }

    res.json({
      score,
      feedback,
      record: savedRecord
    });
  } catch (error: any) {
    console.error("Evaluate vocab error:", error);
    res.status(500).json({ message: "Failed to evaluate sentence", error: error.message });
  }
};

export const getPracticeHistory = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    let history: any[] = [];
    if (checkFallback()) {
      history = fallbackDb.find("communicationPractice", h => h.user === userId);
    } else {
      history = await CommunicationPractice.find({ user: userId }).sort({ createdAt: -1 });
    }
    res.json(history);
  } catch (error: any) {
    console.error("Practice history error:", error);
    res.status(500).json({ message: "Failed to fetch practice history", error: error.message });
  }
};
