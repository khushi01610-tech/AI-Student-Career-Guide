import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { Application } from "../models/Application";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  try {
    if (checkFallback()) {
      const apps = fallbackDb.find("applications", (a: any) => a.user === userId);
      return res.json(apps);
    }

    const apps = await Application.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(apps);
  } catch (error: any) {
    console.error("Error loading student applications:", error);
    return res.status(500).json({ message: "Server error fetching application pipeline" });
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { companyName, role, jobType, location, ctc, applicationDate, deadline, stage, referralName, jobUrl, notes } = req.body;

  if (!companyName || !role) {
    return res.status(400).json({ message: "Company name and role are required." });
  }

  try {
    if (checkFallback()) {
      const newApp = fallbackDb.insert("applications", {
        user: userId,
        companyName,
        role,
        jobType: jobType || "Full-Time",
        location: location || "On-site / Hybrid",
        ctc: ctc || "",
        applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
        deadline: deadline ? new Date(deadline) : undefined,
        stage: stage || "Applied",
        referralName: referralName || "",
        jobUrl: jobUrl || "",
        notes: notes || "",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return res.status(201).json(newApp);
    }

    const app = await Application.create({
      user: userId,
      companyName,
      role,
      jobType: jobType || "Full-Time",
      location: location || "On-site / Hybrid",
      ctc: ctc || "",
      applicationDate: applicationDate || Date.now(),
      deadline,
      stage: stage || "Applied",
      referralName,
      jobUrl,
      notes
    });

    return res.status(201).json(app);
  } catch (error: any) {
    console.error("Error creating application:", error);
    return res.status(500).json({ message: "Failed to record job application" });
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  const updates = req.body;

  try {
    if (checkFallback()) {
      const app = fallbackDb.findById("applications", id);
      if (!app || app.user !== userId) {
        return res.status(404).json({ message: "Application not found" });
      }
      const updated = fallbackDb.update("applications", id, { ...updates, updatedAt: new Date() });
      return res.json(updated);
    }

    const app = await Application.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json(app);
  } catch (error: any) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Failed to update application" });
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    if (checkFallback()) {
      const app = fallbackDb.findById("applications", id);
      if (!app || app.user !== userId) {
        return res.status(404).json({ message: "Application not found" });
      }
      fallbackDb.delete("applications", id);
      return res.json({ message: "Application deleted from pipeline" });
    }

    const app = await Application.findOneAndDelete({ _id: id, user: userId });
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.json({ message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return res.status(500).json({ message: "Failed to delete application" });
  }
};
