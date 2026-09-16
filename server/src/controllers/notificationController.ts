import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Notification } from "../models/Notification";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    let notifications: any[] = [];

    if (checkFallback()) {
      notifications = fallbackDb.find("notifications", n => n.recipient === userId);
      notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    }

    res.json(notifications);
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to load notifications", error: error.message });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (checkFallback()) {
      fallbackDb.findByIdAndUpdate("notifications", id, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(id, { $set: { isRead: true } });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error: any) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
};

export const markAllAsRead = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    if (checkFallback()) {
      const list = fallbackDb.find("notifications", n => n.recipient === userId);
      list.forEach(n => {
        fallbackDb.findByIdAndUpdate("notifications", n._id, { isRead: true });
      });
    } else {
      await Notification.updateMany({ recipient: userId, isRead: false }, { $set: { isRead: true } });
    }

    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Failed to update notifications", error: error.message });
  }
};
