import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractTextFromBinary(base64Content: string): { text: string; quality: "good" | "poor" } {
  try {
    const binaryStr = atob(base64Content);
    const textParts: string[] = [];
    let buffer = "";
    for (let i = 0; i < binaryStr.length; i++) {
      const c = binaryStr.charCodeAt(i);
      if (c >= 32 && c <= 126) {
        buffer += String.fromCharCode(c);
      } else {
        if (buffer.length > 3) textParts.push(buffer);
        buffer = "";
      }
    }
    if (buffer.length > 3) textParts.push(buffer);

    const extractedText = textParts
      .filter(t => t.length > 5 && /[a-zA-Z]{2,}/.test(t))
      .join(" ")
      .slice(0, 15000);

    const letterCount = (extractedText.match(/[a-zA-Z]/g) || []).length;
    const quality = extractedText.length > 500 && letterCount > 100 ? "good" : "poor";
    return { text: extractedText, quality };
  } catch {
    return { text: "", quality: "poor" };
  }
}

async function extractWithVisionOCR(base64Content: string, apiKey: string): Promise<string> {
  try {
    const ocrResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Extract ALL text from this PDF document completely. Return ONLY the raw extracted text preserving structure, headings, bullet points, dates, emails, phone numbers. Miss nothing." },
            { type: "image_url", image_url: { url: `data:application/pdf;base64,${base64Content}` } },
          ],
        }],
      }),
    });
    if (ocrResponse.ok) {
      const ocrData = await ocrResponse.json();
      return ocrData.choices?.[0]?.message?.content || "";
    }
    console.error("OCR response not ok:", ocrResponse.status);
    return "";
  } catch (err) {
    console.error("OCR error:", err);
    return "";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileContent, fileName } = await req.json();
    if (!fileContent) {
      return new Response(JSON.stringify({ error: "No file content provided" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Step 1: Native text extraction
    const native = extractTextFromBinary(fileContent);
    console.log(`Native extraction: ${native.text.length} chars, quality: ${native.quality}`);

    // Step 2: Always try OCR for better results
    let ocrText = "";
    console.log("Using Vision API for comprehensive extraction...");
    ocrText = await extractWithVisionOCR(fileContent, LOVABLE_API_KEY);
    console.log(`OCR extraction: ${ocrText.length} chars`);

    // Use whichever extracted more text
    const finalText = ocrText.length > native.text.length ? ocrText : native.text;

    if (finalText.length < 20) {
      return new Response(JSON.stringify({ error: "Could not extract text from the PDF. Please ensure it's a valid resume PDF (not password-protected or image-only without text)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    console.log(`Final text: ${finalText.length} chars, using ${ocrText.length > native.text.length ? "OCR" : "native"}`);

    // Step 3: AI Analysis with retry
    let aiData;
    for (let attempt = 0; attempt < 2; attempt++) {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a world-class resume analyzer. Analyze the resume text with extreme precision and extract EVERY detail. 
              
CRITICAL RULES:
- Extract the candidate's EXACT full name, email, phone, and location
- List ALL skills mentioned (technical, soft, tools) - aim for 15-25 skills
- Extract ALL work experience with specific highlights and achievements
- Extract ALL education entries
- Extract ALL certifications
- Provide honest, calibrated scores (not all 90+). A typical good resume scores 60-80.
- Be specific in the summary - mention actual technologies and roles
- You MUST call the analyze_resume function with complete data`,
            },
            {
              role: "user",
              content: `Analyze this resume completely and extract every detail:\n\n${finalText.slice(0, 12000)}`,
            },
          ],
          tools: [{
            type: "function",
            function: {
              name: "analyze_resume",
              description: "Return comprehensive resume analysis with all extracted data",
              parameters: {
                type: "object",
                properties: {
                  candidateName: { type: "string", description: "Full name of the candidate" },
                  candidateEmail: { type: "string", description: "Email address if found" },
                  candidatePhone: { type: "string", description: "Phone number if found" },
                  candidateLocation: { type: "string", description: "Location/city if found" },
                  resumeText: { type: "string", description: "Brief 2-3 sentence summary of the candidate" },
                  skills: { type: "array", items: { type: "string" }, description: "ALL skills found (15-25 items)" },
                  certifications: { type: "array", items: { type: "string" } },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string" },
                        company: { type: "string" },
                        duration: { type: "string" },
                        highlights: { type: "array", items: { type: "string" } },
                      },
                      required: ["role", "company", "duration", "highlights"],
                    },
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        degree: { type: "string" },
                        institution: { type: "string" },
                        year: { type: "string" },
                      },
                      required: ["degree", "institution", "year"],
                    },
                  },
                  resumeScore: { type: "number", description: "Overall resume quality 0-100" },
                  atsScore: { type: "number", description: "ATS compatibility 0-100" },
                  formatScore: { type: "number", description: "Format and structure quality 0-100" },
                  impactScore: { type: "number", description: "Impact of achievements 0-100" },
                  brevityScore: { type: "number", description: "Conciseness 0-100" },
                  keywordScore: { type: "number", description: "Industry keyword usage 0-100" },
                  readabilityScore: { type: "number", description: "Readability 0-100" },
                  quantificationScore: { type: "number", description: "Use of metrics and numbers 0-100" },
                  missingSkills: { type: "array", items: { type: "string" }, description: "Skills that would strengthen the resume" },
                  roleRecommendations: { type: "array", items: { type: "string" }, description: "5-7 suitable job roles" },
                  bulletImprovements: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { original: { type: "string" }, improved: { type: "string" } },
                      required: ["original", "improved"],
                    },
                    description: "3-5 bullet point improvements",
                  },
                  strengthBreakdown: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { category: { type: "string" }, score: { type: "number" } },
                      required: ["category", "score"],
                    },
                    description: "5-7 strength categories with scores",
                  },
                  sectionAnalysis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        section: { type: "string" },
                        present: { type: "boolean" },
                        quality: { type: "number" },
                      },
                      required: ["section", "present", "quality"],
                    },
                    description: "Analysis of each resume section presence and quality",
                  },
                  summary: { type: "string", description: "Detailed 4-5 sentence professional summary" },
                },
                required: ["candidateName", "resumeText", "skills", "certifications", "experience", "education", "resumeScore", "atsScore", "formatScore", "impactScore", "brevityScore", "keywordScore", "readabilityScore", "quantificationScore", "missingSkills", "roleRecommendations", "bulletImprovements", "strengthBreakdown", "sectionAnalysis", "summary"],
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "analyze_resume" } },
        }),
      });

      if (aiResponse.status === 429) {
        if (attempt === 0) {
          console.log("Rate limited, retrying in 3s...");
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("AI error:", aiResponse.status, errText);
        if (attempt === 0) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        throw new Error("AI analysis failed after retry");
      }

      aiData = await aiResponse.json();
      break;
    }

    if (!aiData) throw new Error("Failed to get AI response");

    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis returned from AI");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Ensure all required fields have defaults
    analysis.skills = analysis.skills || [];
    analysis.certifications = analysis.certifications || [];
    analysis.experience = analysis.experience || [];
    analysis.education = analysis.education || [];
    analysis.missingSkills = analysis.missingSkills || [];
    analysis.roleRecommendations = analysis.roleRecommendations || [];
    analysis.bulletImprovements = analysis.bulletImprovements || [];
    analysis.strengthBreakdown = analysis.strengthBreakdown || [];
    analysis.sectionAnalysis = analysis.sectionAnalysis || [];
    analysis.resumeScore = analysis.resumeScore || 50;
    analysis.atsScore = analysis.atsScore || 50;
    analysis.formatScore = analysis.formatScore || 50;
    analysis.impactScore = analysis.impactScore || 50;
    analysis.brevityScore = analysis.brevityScore || 50;
    analysis.keywordScore = analysis.keywordScore || 50;
    analysis.readabilityScore = analysis.readabilityScore || 50;
    analysis.quantificationScore = analysis.quantificationScore || 50;

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "An unexpected error occurred. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
