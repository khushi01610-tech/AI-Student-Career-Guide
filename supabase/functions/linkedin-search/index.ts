import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, searchType } = await req.json();
    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Search query required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const typeDesc = searchType === "hr" ? "HR professionals, recruiters, talent acquisition specialists, and hiring managers"
      : searchType === "company" ? "companies, their HR departments, key hiring contacts, and recruitment teams"
      : "professionals, recruiters, HR managers, and relevant industry contacts";

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
            content: `You are an expert LinkedIn networking assistant. Generate realistic, helpful LinkedIn profile suggestions based on search queries. Create detailed, believable professional profiles that would actually exist on LinkedIn. You MUST call the search_profiles function with realistic data.`,
          },
          {
            role: "user",
            content: `Search LinkedIn for: "${query}". Focus on ${typeDesc}. Generate 12-15 realistic professional profiles with real-sounding names, titles, companies, locations, and LinkedIn-style headlines. Include connection tips for each. Make profiles diverse in seniority, location, and specialization.`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "search_profiles",
            description: "Return LinkedIn profile search results",
            parameters: {
              type: "object",
              properties: {
                profiles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      title: { type: "string", description: "Current job title" },
                      company: { type: "string" },
                      location: { type: "string" },
                      headline: { type: "string", description: "LinkedIn headline (1-2 lines)" },
                      industry: { type: "string" },
                      connectionDegree: { type: "string", enum: ["1st", "2nd", "3rd"] },
                      mutualConnections: { type: "number" },
                      skills: { type: "array", items: { type: "string" } },
                      about: { type: "string", description: "Brief professional summary (2-3 sentences)" },
                      experience_years: { type: "number" },
                      isHiring: { type: "boolean" },
                      connectionTip: { type: "string", description: "Personalized tip on how to connect with this person" },
                      profileStrength: { type: "string", enum: ["High", "Medium", "Low"], description: "How relevant this profile is to the search" },
                    },
                    required: ["name", "title", "company", "location", "headline", "industry", "connectionDegree", "skills", "about", "connectionTip", "profileStrength"],
                  },
                },
                searchSummary: { type: "string", description: "Brief summary of search results and networking advice" },
                networkingTips: { type: "array", items: { type: "string" }, description: "3-5 general networking tips for this search" },
              },
              required: ["profiles", "searchSummary", "networkingTips"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "search_profiles" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI search failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No profile data returned");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("linkedin-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
