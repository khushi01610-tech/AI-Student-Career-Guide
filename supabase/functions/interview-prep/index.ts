import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { skills, experience, roles, targetRole } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const expSummary = (experience || []).map((e: any) => `${e.role} at ${e.company} (${e.duration})`).join("; ");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert interview coach. Generate personalized interview questions based on the candidate's skills and target role. You MUST call the generate_interview_prep function.`,
          },
          {
            role: "user",
            content: `Generate interview prep for a candidate targeting "${targetRole}".
Skills: ${(skills || []).join(", ")}
Experience: ${expSummary || "Entry-level"}
Recommended roles: ${(roles || []).join(", ")}

Generate 12-15 diverse questions across categories (Technical, Behavioral, Situational, System Design, Culture Fit). Include sample answers, tips, and general interview guidance.`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_interview_prep",
            description: "Return interview preparation data",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      category: { type: "string", description: "Technical, Behavioral, Situational, System Design, or Culture Fit" },
                      difficulty: { type: "string", description: "Easy, Medium, or Hard" },
                      sampleAnswer: { type: "string", description: "A strong sample answer (3-5 sentences)" },
                      tips: { type: "array", items: { type: "string" }, description: "2-3 tips for answering well" },
                    },
                    required: ["question", "category", "difficulty", "sampleAnswer", "tips"],
                  },
                },
                generalTips: { type: "array", items: { type: "string" }, description: "8-10 general interview tips" },
                commonMistakes: { type: "array", items: { type: "string" }, description: "6-8 common interview mistakes to avoid" },
                bodyLanguageTips: { type: "array", items: { type: "string" }, description: "5-6 body language and communication tips" },
              },
              required: ["questions", "generalTips", "commonMistakes", "bodyLanguageTips"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "generate_interview_prep" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No data returned from AI");

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("interview-prep error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
