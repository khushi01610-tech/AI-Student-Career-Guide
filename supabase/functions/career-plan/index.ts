import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { skills, roles, missingSkills } = await req.json();
    if (!skills || !Array.isArray(skills)) {
      return new Response(JSON.stringify({ error: "Skills array required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
            content: "You are a world-class career coach and planning expert. Generate an extremely detailed, actionable career plan with a week-by-week timetable, project ideas, salary expectations, and comprehensive learning roadmap. Be specific with real URLs, real course names, and real tools. You MUST call the generate_career_plan function.",
          },
          {
            role: "user",
            content: `Create a comprehensive 12-week career plan for someone with these skills: ${skills.join(", ")}. 
Recommended roles: ${(roles || []).join(", ")}.
Missing skills to develop: ${(missingSkills || []).join(", ")}.
Include a week-by-week timetable, real project ideas they should build, salary expectations for each role, and specific learning resources with real URLs.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_career_plan",
              description: "Return a comprehensive career plan with timetable, projects, salary data",
              parameters: {
                type: "object",
                properties: {
                  actionPlan: { type: "array", items: { type: "string" }, description: "10-12 specific actionable steps" },
                  weeklyTimetable: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        week: { type: "string" },
                        tasks: { type: "array", items: { type: "string" } },
                        goal: { type: "string" },
                      },
                      required: ["week", "tasks", "goal"],
                    },
                    description: "12-week timetable with specific tasks per week",
                  },
                  marketTrends: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        trend: { type: "string" },
                        demand: { type: "string" },
                        growth: { type: "string" },
                      },
                      required: ["trend", "demand", "growth"],
                    },
                    description: "8-10 current market trends with growth percentages",
                  },
                  skillGaps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        skill: { type: "string" },
                        importance: { type: "number" },
                        timeToLearn: { type: "string" },
                      },
                      required: ["skill", "importance", "timeToLearn"],
                    },
                    description: "8-10 skill gaps with importance 0-100 and estimated time to learn",
                  },
                  learningResources: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        type: { type: "string" },
                        difficulty: { type: "string" },
                      },
                      required: ["title", "url", "type", "difficulty"],
                    },
                    description: "10-12 real learning resources with real URLs, types (Course, Book, Tutorial, Certification), and difficulty levels",
                  },
                  projectIdeas: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        skills: { type: "array", items: { type: "string" } },
                      },
                      required: ["title", "description", "skills"],
                    },
                    description: "5-6 portfolio project ideas to build",
                  },
                  industryInsights: {
                    type: "array",
                    items: { type: "string" },
                    description: "5-7 key industry insights and tips",
                  },
                  salaryExpectations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string" },
                        min: { type: "number" },
                        max: { type: "number" },
                        avg: { type: "number" },
                      },
                      required: ["role", "min", "max", "avg"],
                    },
                    description: "Salary ranges for 5 recommended roles in USD",
                  },
                },
                required: ["actionPlan", "weeklyTimetable", "marketTrends", "skillGaps", "learningResources", "projectIdeas", "industryInsights", "salaryExpectations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_career_plan" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI plan generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No plan returned");

    const plan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
