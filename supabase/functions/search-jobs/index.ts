import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error("Fetch failed after retries");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { skills, query, location } = await req.json();
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return new Response(JSON.stringify({ error: "Skills array required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const searchQuery = query || skills.slice(0, 3).join(" ");
    const allJobs: any[] = [];

    // Fetch from RemoteOK
    try {
      const remoteRes = await fetchWithRetry("https://remoteok.com/api", {
        headers: { "User-Agent": "CareerGrowthEngine/1.0" },
      });
      const remoteData = await remoteRes.json();
      const rawJobs = Array.isArray(remoteData) ? remoteData.slice(1) : [];
      
      // Filter by relevance to query/skills
      const queryLower = searchQuery.toLowerCase();
      const skillsLower = skills.map((s: string) => s.toLowerCase());
      
      const relevantJobs = rawJobs
        .filter((j: any) => j.position && j.company)
        .filter((j: any) => {
          const text = `${j.position} ${j.description || ""} ${(j.tags || []).join(" ")}`.toLowerCase();
          return skillsLower.some((s: string) => text.includes(s)) || text.includes(queryLower);
        })
        .slice(0, 20);
      
      // If not enough relevant jobs, also add top recent ones
      const fallbackJobs = rawJobs
        .filter((j: any) => j.position && j.company && !relevantJobs.find((r: any) => r.id === j.id))
        .slice(0, Math.max(0, 15 - relevantJobs.length));
      
      const combined = [...relevantJobs, ...fallbackJobs];
      
      const remoteJobs = combined.map((j: any) => ({
        id: `ro-${j.id || Math.random().toString(36).slice(2)}`,
        title: j.position || "Unknown",
        company: j.company || "Unknown",
        location: j.location || "Remote",
        salary: j.salary || (j.salary_min ? `$${Math.round(j.salary_min / 1000)}k-$${Math.round(j.salary_max / 1000)}k` : ""),
        url: j.url || `https://remoteok.com/remote-jobs/${j.slug || ""}`,
        source: "remoteok",
        description: (j.description || "").replace(/<[^>]*>/g, "").slice(0, 300),
        tags: j.tags || [],
        date: j.date || "",
      }));
      allJobs.push(...remoteJobs);
    } catch (e) {
      console.error("RemoteOK error:", e);
    }

    // Fetch from Adzuna
    const ADZUNA_APP_ID = Deno.env.get("ADZUNA_APP_ID");
    const ADZUNA_APP_KEY = Deno.env.get("ADZUNA_APP_KEY");
    if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
      try {
        const country = "us";
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=20&what=${encodeURIComponent(searchQuery)}${location ? `&where=${encodeURIComponent(location)}` : ""}`;
        const adzRes = await fetchWithRetry(adzunaUrl, {});
        const adzData = await adzRes.json();
        const adzJobs = (adzData.results || []).map((j: any) => ({
          id: `az-${j.id || Math.random().toString(36).slice(2)}`,
          title: j.title || "Unknown",
          company: j.company?.display_name || "Unknown",
          location: j.location?.display_name || "",
          salary: j.salary_min && j.salary_max ? `$${Math.round(j.salary_min / 1000)}k-$${Math.round(j.salary_max / 1000)}k` : "",
          url: j.redirect_url || "",
          source: "adzuna",
          description: (j.description || "").slice(0, 300),
          tags: j.category?.tag ? [j.category.tag] : [],
          date: j.created || "",
        }));
        allJobs.push(...adzJobs);
      } catch (e) {
        console.error("Adzuna error:", e);
      }
    }

    // Calculate match scores
    const skillsLower = skills.map((s: string) => s.toLowerCase());
    const jobsWithScores = allJobs.map((job) => {
      const text = `${job.title} ${job.description || ""} ${job.company} ${(job.tags || []).join(" ")}`.toLowerCase();
      const matchCount = skillsLower.filter((s: string) => text.includes(s)).length;
      const baseScore = (matchCount / Math.max(1, skillsLower.length)) * 100;
      const matchScore = Math.min(99, Math.max(10, Math.round(baseScore + (baseScore > 0 ? 10 + Math.random() * 10 : Math.random() * 15))));
      return { ...job, matchScore };
    });

    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return new Response(JSON.stringify({ jobs: jobsWithScores }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-jobs error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
