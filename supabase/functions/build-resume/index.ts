import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, template, targetRole } = await req.json();
    if (!resumeData) {
      return new Response(JSON.stringify({ error: "Resume data required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a world-class professional resume writer and ATS optimization expert. You create flawless, 100% ATS-compatible resumes with zero errors in grammar, spelling, or formatting. Every bullet point must start with a strong action verb and include quantified achievements where possible. The resume must pass ANY ATS system perfectly. You MUST call the build_resume function.`,
          },
          {
            role: "user",
            content: `Create a perfect, ATS-optimized professional resume using this data. Template style: "${template || 'Professional'}". Target role: "${targetRole || 'General'}".

Candidate Data:
- Name: ${resumeData.candidateName || resumeData.name || 'Professional'}
- Email: ${resumeData.candidateEmail || resumeData.email || ''}
- Phone: ${resumeData.candidatePhone || resumeData.phone || ''}
- Location: ${resumeData.candidateLocation || resumeData.location || ''}
- Skills: ${(resumeData.skills || []).join(', ')}
- Certifications: ${(resumeData.certifications || []).join(', ')}
- Experience: ${JSON.stringify(resumeData.experience || [])}
- Education: ${JSON.stringify(resumeData.education || [])}
- Summary: ${resumeData.summary || resumeData.resumeText || ''}

Rules:
1. Every bullet MUST start with a power action verb (Led, Developed, Increased, Optimized, etc.)
2. Include quantified metrics wherever possible (%, $, numbers)
3. Use ATS-friendly formatting - no tables, columns, or graphics
4. Ensure keywords from the target role are naturally integrated
5. Keep it concise - max 2 pages worth of content
6. Zero grammatical or spelling errors
7. Professional tone throughout
8. Optimize for the "${template}" template style`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "build_resume",
            description: "Return a perfectly structured, ATS-optimized resume",
            parameters: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedIn: { type: "string", description: "LinkedIn URL if available" },
                portfolio: { type: "string", description: "Portfolio URL if available" },
                professionalSummary: { type: "string", description: "3-4 sentence powerful professional summary optimized for ATS" },
                skills: {
                  type: "object",
                  properties: {
                    technical: { type: "array", items: { type: "string" } },
                    soft: { type: "array", items: { type: "string" } },
                    tools: { type: "array", items: { type: "string" } },
                  },
                  required: ["technical", "soft", "tools"],
                },
                experience: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      company: { type: "string" },
                      location: { type: "string" },
                      startDate: { type: "string" },
                      endDate: { type: "string" },
                      bullets: { type: "array", items: { type: "string" }, description: "3-5 quantified achievement bullets starting with action verbs" },
                    },
                    required: ["title", "company", "startDate", "endDate", "bullets"],
                  },
                },
                education: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      degree: { type: "string" },
                      institution: { type: "string" },
                      graduationDate: { type: "string" },
                      gpa: { type: "string" },
                      honors: { type: "string" },
                    },
                    required: ["degree", "institution", "graduationDate"],
                  },
                },
                certifications: { type: "array", items: { type: "string" } },
                projects: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      technologies: { type: "array", items: { type: "string" } },
                    },
                    required: ["name", "description", "technologies"],
                  },
                },
                atsScore: { type: "number", description: "Estimated ATS compatibility score 0-100" },
                atsKeywords: { type: "array", items: { type: "string" }, description: "Top ATS keywords included" },
              },
              required: ["fullName", "professionalSummary", "skills", "experience", "education", "certifications", "atsScore", "atsKeywords"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "build_resume" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI resume generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No resume data returned from AI");

    const resume = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(resume), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("build-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
