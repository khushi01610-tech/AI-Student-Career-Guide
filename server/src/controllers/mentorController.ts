import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Mentor } from "../models/Mentor";
import { User } from "../models/User";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getMentors = async (req: Request, res: Response) => {
  try {
    const { domain } = req.query;

    if (checkFallback()) {
      let list = fallbackDb.find("mentors");
      if (domain && domain !== "All") {
        list = list.filter((m: any) => m.domains.some((d: string) => d.toLowerCase() === (domain as string).toLowerCase()));
      }
      return res.json(list);
    }

    const query: any = {};
    if (domain && domain !== "All") {
      query.domains = { $in: [new RegExp(domain as string, "i")] };
    }

    const mentors = await Mentor.find(query).sort({ rating: -1, reviewsCount: -1 });
    return res.json(mentors);
  } catch (error: any) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({ message: "Server error fetching mentors directory" });
  }
};

export const bookMentorSession = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  const { slotDate, topic } = req.body;

  if (!slotDate) {
    return res.status(400).json({ message: "Please select an available session time slot." });
  }

  try {
    let studentName = "Student";
    if (checkFallback()) {
      const u = fallbackDb.findById("users", userId!);
      if (u) studentName = u.name;

      const mentor = fallbackDb.findById("mentors", id);
      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      const newBooking = {
        _id: "bk_" + Date.now(),
        studentId: userId,
        studentName,
        slotDate,
        topic: topic || "1:1 Placement Strategy & Coffee Chat",
        meetingLink: `https://meet.google.com/alm-${Math.floor(100 + Math.random() * 900)}-std`,
        status: "Scheduled",
        createdAt: new Date()
      };

      const updatedSlots = (mentor.availableSlots || []).filter((s: string) => s !== slotDate);
      const updatedBookings = [...(mentor.bookings || []), newBooking];

      fallbackDb.update("mentors", id, {
        availableSlots: updatedSlots,
        bookings: updatedBookings
      });

      return res.status(201).json({ 
        message: "Session confirmed with mentor!", 
        booking: newBooking 
      });
    }

    const user = await User.findById(userId);
    if (user) studentName = user.name;

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const newBooking: any = {
      studentId: userId,
      studentName,
      slotDate,
      topic: topic || "1:1 Placement Strategy & Coffee Chat",
      meetingLink: `https://meet.google.com/alm-${Math.floor(100 + Math.random() * 900)}-std`,
      status: "Scheduled",
      createdAt: new Date()
    };

    mentor.availableSlots = mentor.availableSlots.filter(s => s !== slotDate);
    mentor.bookings.push(newBooking);
    await mentor.save();

    return res.status(201).json({ 
      message: "Session confirmed with mentor!", 
      booking: newBooking 
    });
  } catch (error: any) {
    console.error("Error booking mentor session:", error);
    return res.status(500).json({ message: "Failed to schedule mentor booking" });
  }
};
