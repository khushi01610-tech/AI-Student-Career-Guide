import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { Notification } from "../models/Notification";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getSessions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let sessions: any[] = [];

    if (checkFallback()) {
      sessions = fallbackDb.find("sessions", s => s.status === "upcoming");
      sessions.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    } else {
      sessions = await Session.find({ status: "upcoming" }).sort({ dateTime: 1 });
    }

    res.json(sessions);
  } catch (error: any) {
    console.error("Fetch sessions error:", error);
    res.status(500).json({ message: "Failed to load collaboration sessions", error: error.message });
  }
};

export const createSession = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { role, dateTime, maxParticipants, meetingLink } = req.body;

  if (!role || !dateTime || !meetingLink) {
    return res.status(400).json({ message: "Role, date/time, and meeting link are required" });
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

    let savedSession: any = null;

    if (checkFallback()) {
      savedSession = fallbackDb.insert("sessions", {
        role,
        dateTime: new Date(dateTime).toISOString(),
        creator: userId,
        creatorName: user.name,
        creatorCollege: user.college,
        creatorAvatar,
        participants: [],
        maxParticipants: Number(maxParticipants) || 2,
        meetingLink,
        status: "upcoming"
      });
    } else {
      const session = new Session({
        role,
        dateTime: new Date(dateTime),
        creator: userId,
        creatorName: user.name,
        creatorCollege: user.college,
        creatorAvatar,
        participants: [],
        maxParticipants: Number(maxParticipants) || 2,
        meetingLink,
        status: "upcoming"
      });
      savedSession = await session.save();
    }

    res.status(201).json(savedSession);
  } catch (error: any) {
    console.error("Create session error:", error);
    res.status(500).json({ message: "Failed to create session", error: error.message });
  }
};

export const joinSession = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    let session: any = null;
    let user: any = null;

    if (checkFallback()) {
      session = fallbackDb.findById("sessions", id);
      user = fallbackDb.findById("users", userId!);
      
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (session.creator === userId) {
        return res.status(400).json({ message: "You are the creator of this session" });
      }

      const participants = session.participants || [];
      if (participants.includes(userId)) {
        return res.status(400).json({ message: "You already joined this session" });
      }

      if (participants.length >= session.maxParticipants) {
        return res.status(400).json({ message: "Session is already full" });
      }

      participants.push(userId);
      session = fallbackDb.findByIdAndUpdate("sessions", id, { participants });

      // Create notification for host in fallback
      fallbackDb.insert("notifications", {
        recipient: session.creator,
        senderName: user.name,
        type: "session",
        content: `${user.name} from ${user.college} joined your mock interview session for ${session.role}!`,
        referenceId: session._id,
        isRead: false
      });
    } else {
      session = await Session.findById(id);
      user = await User.findById(userId);

      if (!session) return res.status(404).json({ message: "Session not found" });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (session.creator.toString() === userId) {
        return res.status(400).json({ message: "You are the creator of this session" });
      }

      if (session.participants.includes(userId!)) {
        return res.status(400).json({ message: "You already joined this session" });
      }

      if (session.participants.length >= session.maxParticipants) {
        return res.status(400).json({ message: "Session is already full" });
      }

      session.participants.push(userId!);
      await session.save();

      // Create notification
      const notification = new Notification({
        recipient: session.creator,
        senderName: user.name,
        type: "session",
        content: `${user.name} from ${user.college} joined your mock interview session for ${session.role}!`,
        referenceId: session._id,
        isRead: false
      });
      await notification.save();
    }

    res.json(session);
  } catch (error: any) {
    console.error("Join session error:", error);
    res.status(500).json({ message: "Server error joining session", error: error.message });
  }
};

export const leaveSession = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    let session: any = null;

    if (checkFallback()) {
      session = fallbackDb.findById("sessions", id);
      if (!session) return res.status(404).json({ message: "Session not found" });

      const participants = session.participants || [];
      const idx = participants.indexOf(userId);
      if (idx === -1) {
        return res.status(400).json({ message: "You haven't joined this session" });
      }

      participants.splice(idx, 1);
      session = fallbackDb.findByIdAndUpdate("sessions", id, { participants });
    } else {
      session = await Session.findById(id);
      if (!session) return res.status(404).json({ message: "Session not found" });

      const idx = session.participants.indexOf(userId!);
      if (idx === -1) {
        return res.status(400).json({ message: "You haven't joined this session" });
      }

      session.participants.splice(idx, 1);
      await session.save();
    }

    res.json(session);
  } catch (error: any) {
    console.error("Leave session error:", error);
    res.status(500).json({ message: "Server error leaving session", error: error.message });
  }
};
