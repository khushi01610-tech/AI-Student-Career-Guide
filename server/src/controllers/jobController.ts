import { Request, Response } from "express";
import { Job } from "../models/Job";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { q, location, source, type, batch, level } = req.query;

    if (checkFallback()) {
      let jobs = fallbackDb.getCollection("jobs");

      if (q) {
        const queryLower = (q as string).toLowerCase();
        jobs = jobs.filter(j => 
          j.title?.toLowerCase().includes(queryLower) ||
          j.company?.toLowerCase().includes(queryLower) ||
          j.skills?.some((s: string) => s.toLowerCase().includes(queryLower)) ||
          j.description?.toLowerCase().includes(queryLower)
        );
      }

      if (location) {
        const locLower = (location as string).toLowerCase();
        jobs = jobs.filter(j => j.location?.toLowerCase().includes(locLower));
      }

      if (source && source !== "All") {
        jobs = jobs.filter(j => j.source?.toLowerCase() === (source as string).toLowerCase());
      }

      if (type && type !== "All") {
        jobs = jobs.filter(j => j.type?.toLowerCase() === (type as string).toLowerCase());
      }

      if (batch && batch !== "All") {
        jobs = jobs.filter(j => j.batchEligibility?.includes(batch as string));
      }

      if (level && level !== "All") {
        jobs = jobs.filter(j => j.level?.toLowerCase() === (level as string).toLowerCase());
      }

      return res.json(jobs);
    }

    // MongoDB query
    const filter: any = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q as string, $options: "i" } },
        { company: { $regex: q as string, $options: "i" } },
        { skills: { $in: [new RegExp(q as string, "i")] } },
        { description: { $regex: q as string, $options: "i" } }
      ];
    }

    if (location) {
      filter.location = { $regex: location as string, $options: "i" };
    }

    if (source && source !== "All") {
      filter.source = source as string;
    }

    if (type && type !== "All") {
      filter.type = type as string;
    }

    if (batch && batch !== "All") {
      filter.batchEligibility = batch as string;
    }

    if (level && level !== "All") {
      filter.level = level as string;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error: any) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (checkFallback()) {
      const job = fallbackDb.findById("jobs", id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.json(job);
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error: any) {
    console.error("Get job by ID error:", error);
    res.status(500).json({ message: "Failed to fetch job", error: error.message });
  }
};
