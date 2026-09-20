import { Request, Response } from "express";
import { Company } from "../models/Company";
import { fallbackDb } from "../config/fallbackDb";
import { checkFallback } from "../config/db";

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { search, industry } = req.query;

    if (checkFallback()) {
      let list = fallbackDb.find("companies");
      if (search) {
        const s = (search as string).toLowerCase();
        list = list.filter((c: any) => c.name.toLowerCase().includes(s) || c.industry.toLowerCase().includes(s));
      }
      if (industry && industry !== "All") {
        list = list.filter((c: any) => c.industry.toLowerCase() === (industry as string).toLowerCase());
      }
      return res.json(list);
    }

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { industry: { $regex: search as string, $options: "i" } },
        { rolesHiring: { $in: [new RegExp(search as string, "i")] } }
      ];
    }
    if (industry && industry !== "All") {
      query.industry = new RegExp(industry as string, "i");
    }

    const companies = await Company.find(query).sort({ alumniHiredCount: -1 });
    return res.json(companies);
  } catch (error: any) {
    console.error("Error fetching companies:", error);
    return res.status(500).json({ message: "Server error fetching company directory" });
  }
};

export const getCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (checkFallback()) {
      const company = fallbackDb.findOne("companies", (c: any) => c.slug === slug || c._id === slug);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      return res.json(company);
    }

    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.json(company);
  } catch (error: any) {
    console.error("Error fetching company details:", error);
    return res.status(500).json({ message: "Server error fetching company details" });
  }
};
