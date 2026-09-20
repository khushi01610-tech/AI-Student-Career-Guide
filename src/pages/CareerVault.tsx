import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Copy, 
  Check, 
  Code, 
  Sparkles, 
  Download, 
  BookOpen, 
  Mail, 
  Layers, 
  CheckCircle2,
  FileCode,
  Share2
} from "lucide-react";

export default function CareerVault() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast({ title: "Copied to Clipboard!", description: "Template copied. Customize with your details before sending." });
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const templates = [
    {
      id: "alumni-referral",
      title: "LinkedIn Message to College Alumni for Referral",
      category: "Referral Outreach",
      description: "Polite, high-conversion message requesting an internal referral from an alumni at your target company.",
      content: `Hi [Name],

I hope you're having a great week! I came across your profile through the [University Name] alumni network and was really inspired by your journey to [Company] as a [Their Role].

I'm a final-year [Major] student at [University Name] preparing for campus and off-campus placements. I recently saw the [Job Title] role (Job ID: [Job ID]) and felt my background in [Key Skill 1, Key Skill 2] and recent project building [Short Project Name] aligns closely with the team's work.

Would you be open to a quick 5-minute chat, or if comfortable, referring my profile for this position? I have attached my 1-page ATS resume here for your review.

Thank you so much for your time and guidance!

Best regards,
[Your Name]
[Your Phone Number] | [Your LinkedIn URL]`
    },
    {
      id: "recruiter-followup",
      title: "Email Follow-Up After Submitting Application",
      category: "Application Follow-Up",
      description: "Send 7-10 days after applying directly on a company career portal to increase resume visibility.",
      content: `Subject: Application Follow-up: [Job Title] (Ref #[Job ID]) - [Your Name]

Dear [Recruiter Name or "Hiring Team"],

I hope this email finds you well.

I am writing to briefly follow up on my application submitted on [Date] for the [Job Title] position at [Company Name]. As a [Major] senior at [University Name], I have been following [Company Name]'s recent work on [Specific Product or Technology] with great admiration.

Over the past year, I have built [Key Project/Experience], improving [Metric, e.g. latency by 30% / handling 5,000+ records], and I am confident I could ramp up quickly to contribute to your engineering team.

I understand you receive numerous applications and appreciate your time. Please let me know if there are any additional work samples or details I can provide.

Thank you for your consideration!

Warm regards,
[Your Name]
[LinkedIn Profile] | [GitHub Profile]`
    },
    {
      id: "post-interview-thankyou",
      title: "Post-Interview Thank You & Reflection Email",
      category: "Interview Etiquette",
      description: "Send within 24 hours of completing a technical or HR interview round.",
      content: `Subject: Thank you - [Job Title] Interview - [Your Name]

Dear [Interviewer Name],

Thank you very much for taking the time to speak with me today regarding the [Job Title] opportunity at [Company Name].

I really enjoyed our discussion about [Specific topic discussed, e.g. how the team optimizes database read replicas during flash sales]. Our conversation reinforced my enthusiasm for joining [Company Name] and tackling these architectural challenges.

Please let me know if you need any further information from my side. I look forward to hearing about the next steps in the process.

Best regards,
[Your Name]`
    }
  ];

  const cheatsheets = [
    {
      title: "SQL Placement Cheatsheet",
      badge: "Database",
      points: [
        { topic: "Second Highest Salary", code: "SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);" },
        { topic: "Window Function (DENSE_RANK)", code: "SELECT emp_id, salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee;" },
        { topic: "Common Table Expression (CTE)", code: "WITH RankedSales AS (\n  SELECT rep_id, amount, ROW_NUMBER() OVER (PARTITION BY rep_id ORDER BY amount DESC) as r\n  FROM Sales\n)\nSELECT * FROM RankedSales WHERE r = 1;" },
        { topic: "Left Join with NULL check (Find unmatched)", code: "SELECT u.id FROM Users u LEFT JOIN Orders o ON u.id = o.user_id WHERE o.id IS NULL;" }
      ]
    },
    {
      title: "DSA High-Frequency Interview Patterns",
      badge: "Algorithms",
      points: [
        { topic: "Two Pointers (O(N) Time)", code: "// Use when array is sorted or finding pairs\nlet left = 0, right = arr.length - 1;\nwhile (left < right) {\n  const sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  sum < target ? left++ : right--;\n}" },
        { topic: "Sliding Window (Substrings/Subarrays)", code: "// Finding max/min window meeting condition\nlet left = 0, current = 0, best = 0;\nfor (let right = 0; right < n; right++) {\n  add(arr[right]);\n  while (invalidCondition()) remove(arr[left++]);\n  best = Math.max(best, right - left + 1);\n}" },
        { topic: "BFS for Shortest Path in Unweighted Graph", code: "const queue = [[start, 0]];\nconst visited = new Set([start]);\nwhile (queue.length) {\n  const [curr, dist] = queue.shift();\n  if (curr === target) return dist;\n  for (const next of graph[curr]) {\n    if (!visited.has(next)) { visited.add(next); queue.push([next, dist + 1]); }\n  }\n}" }
      ]
    }
  ];

  const actionVerbs = [
    { category: "Leadership & Initiative", words: ["Spearheaded", "Orchestrated", "Pioneered", "Architected", "Instituted", "Formulated"] },
    { category: "Technical & Development", words: ["Engineered", "Refactored", "Automated", "Deployed", "Implemented", "Configured"] },
    { category: "Performance & Impact", words: ["Optimized", "Accelerated", "Streamlined", "Maximized", "Downscaled", "Consolidated"] },
    { category: "Collaboration & Mentorship", words: ["Coordinated", "Facilitated", "Mentored", "Cross-pollinated", "Navigated"] }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Placement Resources & Templates Vault</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Proven cold email scripts, SQL cheatsheets, DSA patterns, and ATS resume frameworks used by top placed students.
          </p>
        </div>
      </div>

      <Tabs defaultValue="outreach" className="space-y-6">
        <TabsList className="bg-muted p-1 border border-border">
          <TabsTrigger value="outreach" className="text-xs font-semibold">
            <Mail className="h-3.5 w-3.5 mr-1.5" /> Networking Scripts ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="cheatsheets" className="text-xs font-semibold">
            <Code className="h-3.5 w-3.5 mr-1.5" /> Technical Cheatsheets
          </TabsTrigger>
          <TabsTrigger value="resume" className="text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 mr-1.5" /> ATS Resume Toolkit
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Outreach & Follow-up Templates */}
        <TabsContent value="outreach" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="bg-card border-border shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1">{tpl.category}</Badge>
                      <CardTitle className="text-base font-bold text-foreground">{tpl.title}</CardTitle>
                      <CardDescription className="text-xs">{tpl.description}</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopy(tpl.id, tpl.content)}
                      className="text-xs h-8 gap-1.5"
                    >
                      {copiedKey === tpl.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === tpl.id ? "Copied" : "Copy Template"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-1">
                  <div className="p-4 rounded-lg bg-muted/40 border border-border font-mono text-xs whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {tpl.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Technical Interview Cheatsheets */}
        <TabsContent value="cheatsheets" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cheatsheets.map((sheet, i) => (
              <Card key={i} className="bg-card border-border shadow-sm flex flex-col justify-between">
                <div>
                  <CardHeader className="p-5 pb-3 border-b border-border/80">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-foreground">{sheet.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs font-medium">{sheet.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    {sheet.points.map((pt, idx) => (
                      <div key={idx} className="space-y-1.5 text-xs">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          {pt.topic}
                        </span>
                        <div className="p-2.5 rounded bg-muted/50 border border-border font-mono text-[11px] text-muted-foreground overflow-x-auto whitespace-pre">
                          {pt.code}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: ATS Resume Framework */}
        <TabsContent value="resume" className="space-y-5">
          {/* Google XYZ Formula Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                The Google "X-Y-Z" Resume Bullet Formula
              </CardTitle>
              <CardDescription className="text-xs">
                Standard recruiter benchmark used by Google, Amazon, and top tier product firms.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3 space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 text-foreground font-semibold">
                "Accomplished [X], as measured by [Y], by doing [Z]"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 space-y-1">
                  <span className="text-[10px] font-bold text-destructive uppercase block">❌ Weak / Student Project Bullet</span>
                  <p className="text-muted-foreground">"Built a full stack e-commerce web app using React and Node.js with payment checkout."</p>
                </div>
                <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">✅ Strong Impact-Driven Bullet</span>
                  <p className="text-foreground">"Engineered a full-stack checkout portal in React & Node.js, reducing transaction latency by 35% across 2,000+ concurrent requests via Redis caching."</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Verbs Word Bank */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base font-bold text-foreground">High-Impact Action Verbs Bank</CardTitle>
              <CardDescription className="text-xs">Replace passive words like "worked on" or "helped with" with strong verbs.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {actionVerbs.map((grp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/40 border border-border space-y-2">
                    <span className="font-bold text-xs text-foreground block">{grp.category}</span>
                    <div className="flex flex-wrap gap-1">
                      {grp.words.map((w) => (
                        <Badge key={w} variant="secondary" className="text-[10px] font-normal">
                          {w}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
