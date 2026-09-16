import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Loader2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { text: "How can I improve my resume?", icon: FileText },
  { text: "What should I prepare for HR interviews?", icon: HelpCircle },
  { text: "Frontend Developer learning roadmap", icon: BookOpen },
  { text: "Which technical skills are currently important?", icon: TrendingUp }
];

export default function AICareerAssistant() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `### Hello ${user?.name || "Student"}! 🧠\n\nI am **CareerGuide AI**, your personalized career advisor. I have analyzed your target goal (**${user?.careerGoal || "Software Engineer"}**) and skills.\n\nAsk me anything! For example:\n* *How do I prepare for technical coding reviews?*\n* *Give me a step-by-step roadmap to learn backend development.*\n* *What projects should I put on my resume?*`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages list updates
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      role: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Format history payload
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const reply = await api.chat.sendMessage(textToSend, historyPayload, {
        college: user?.college,
        course: user?.course,
        branch: user?.branch,
        skills: user?.skills || [],
        careerGoal: user?.careerGoal
      });

      const assistantMsg: Message = {
        role: "assistant",
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      toast({
        title: "Communication Failed",
        description: e.message || "Failed to reach CareerGuide AI. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        text: `Conversation cleared. Ready for a new topic! Ask me about roadmaps, ATS guidelines, or tech stacks.`,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] relative">
      <Card className="glass-card flex-1 flex flex-col overflow-hidden border-border/40">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold">CareerGuide AI Coach</CardTitle>
              <CardDescription className="text-[10px]">Active and customized for {user?.careerGoal}</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear} title="Clear history" className="h-8 w-8 hover:bg-muted">
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        
        {/* Messages List Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-muted/5 relative">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                
                <div 
                  className={`p-3.5 rounded-2xl max-w-[85%] text-xs shadow-sm leading-relaxed border ${
                    m.role === "user" 
                      ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none font-medium" 
                      : "bg-card text-foreground border-border/50 rounded-tl-none whitespace-pre-line prose prose-invert"
                  }`}
                >
                  {m.text}
                </div>

                {m.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 text-xs font-bold">
                    {user?.name?.substring(0,2).toUpperCase() || "ME"}
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-card border border-border/50 rounded-tl-none text-xs flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-muted-foreground animate-pulse">CareerGuide AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input box & prompt chips */}
        <div className="p-4 border-t border-border/20 shrink-0 bg-card/40 space-y-3">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 max-w-3xl mx-auto">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-all text-[10px] gap-1 py-1.5 px-3 border border-border/40"
                  onClick={() => handleSend(p.text)}
                >
                  <p.icon className="h-3 w-3" /> {p.text}
                </Badge>
              ))}
            </div>
          )}

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputMessage); }}
            className="flex items-center gap-2 max-w-3xl mx-auto"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about interview prep, ${user?.careerGoal} roadmap, or resumes...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputMessage.trim()} className="glow-primary shrink-0 h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
