import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  Square, 
  Volume2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  Award, 
  RotateCcw,
  Speech
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunicationSkills() {
  const { user, refreshProfile } = useAuth();
  const [dailyTopics, setDailyTopics] = useState<any[]>([]);
  const [vocabWords, setVocabWords] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("intro");
  const { toast } = useToast();

  // Self Introduction Practice
  const [introText, setIntroText] = useState("");
  const [isIntroLoading, setIsIntroLoading] = useState(false);
  const [introFeedback, setIntroFeedback] = useState<any>(null);

  // Daily Speaking Prompts
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [speakingText, setSpeakingText] = useState("");
  const [isSpeakingLoading, setIsSpeakingLoading] = useState(false);
  const [speakingFeedback, setSpeakingFeedback] = useState<any>(null);

  // Vocabulary sentence challenge
  const [selectedWord, setSelectedWord] = useState<any>(null);
  const [vocabSentence, setVocabSentence] = useState("");
  const [isVocabLoading, setIsVocabLoading] = useState(false);
  const [vocabFeedback, setVocabFeedback] = useState<any>(null);

  // Microphone Audio Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Load options from backend
    const loadData = async () => {
      try {
        const topics = await api.communication.getTopics();
        const vocab = await api.communication.getVocabulary();
        setDailyTopics(topics);
        setVocabWords(vocab);
        setSelectedTopic(topics[0]);
        setSelectedWord(vocab[0]);
      } catch (e) {
        console.error("Error loading communications assets:", e);
      }
    };
    loadData();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Voice recording triggers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Populate standard transcription depending on active tab
        if (activeTab === "intro") {
          setIntroText(`Hello team, my name is ${user?.name || "Student"} and I'm currently studying ${user?.course || "CSE"} at ${user?.college || "University"}. I am highly interested in backend developments like building REST APIs and handling database pipelines. I've designed several projects and would love to join your software team.`);
        } else {
          setSpeakingText(`Regarding the prompt ${selectedTopic?.title}, in my experience building applications with React, I always try to identify components dependency parameters. For instance, when compiling schemas, dividing files into structured controllers and routes helps debugging speed. I resolved index constraints on my databases recently which speeded up loading by 15%.`);
        }
        
        toast({ title: "Recording complete! 🎙️", description: "Audio captured and mock voice transcript populated." });
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      setAudioUrl(null);
      
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);

    } catch (err) {
      toast({ title: "Microphone Access Denied", description: "Could not open recording channel.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks in stream
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleEvaluateIntro = async () => {
    if (!introText.trim()) return;
    setIsIntroLoading(true);
    setIntroFeedback(null);
    try {
      const res = await api.communication.evaluateIntro(introText);
      setIntroFeedback(res.evaluation);
      await refreshProfile();
      toast({ title: "Evaluation Complete!", description: `Score: ${res.evaluation.score}%` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Evaluation error.", variant: "destructive" });
    } finally {
      setIsIntroLoading(false);
    }
  };

  const handleEvaluateSpeaking = async () => {
    if (!speakingText.trim()) return;
    setIsSpeakingLoading(true);
    setSpeakingFeedback(null);
    try {
      const res = await api.communication.evaluateSpeaking(selectedTopic.title, speakingText);
      setSpeakingFeedback(res.evaluation);
      await refreshProfile();
      toast({ title: "Evaluation Complete!", description: `Score: ${res.evaluation.score}%` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Evaluation error.", variant: "destructive" });
    } finally {
      setIsSpeakingLoading(false);
    }
  };

  const handleEvaluateVocab = async () => {
    if (!vocabSentence.trim()) return;
    setIsVocabLoading(true);
    setVocabFeedback(null);
    try {
      const res = await api.communication.evaluateVocab(selectedWord.word, selectedWord.meaning, vocabSentence);
      setVocabFeedback(res);
      toast({ title: "Sentence Reviewed!", description: `Sentence Score: ${res.score || 0}%` });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message || "Evaluation error.", variant: "destructive" });
    } finally {
      setIsVocabLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Communication Practice</h1>
        <p className="text-sm text-muted-foreground">Practice introductions, voice articulation, and expand technical vocabulary keywords.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 max-w-lg mb-6 bg-card border border-border/30">
          <TabsTrigger value="intro">Self Introduction</TabsTrigger>
          <TabsTrigger value="daily">Daily Speaking</TabsTrigger>
          <TabsTrigger value="vocab">Vocabulary Builder</TabsTrigger>
        </TabsList>

        {/* Tab 1: Self Introduction */}
        <TabsContent value="intro" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5"><Speech className="h-4 w-4 text-primary" /> Present Your Pitch</CardTitle>
                <CardDescription className="text-xs">Type in your 1-minute pitch or click record to speak through your microphone.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Visual Audio Recording bar */}
                <div className="flex items-center gap-4 p-3 rounded-lg border border-border/40 bg-muted/20">
                  <Button 
                    variant={isRecording ? "destructive" : "default"} 
                    size="sm" 
                    onClick={isRecording ? stopRecording : startRecording}
                    className="gap-1.5 h-9"
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-4 w-4 fill-white" /> Stop Recording ({recordingSeconds}s)
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Start Recording
                      </>
                    )}
                  </Button>
                  
                  {isRecording && (
                    <div className="flex-1 flex gap-1 h-6 items-center shrink-0">
                      {[1, 2, 3, 4, 3, 2, 4, 5, 2, 1, 3, 4, 2, 1].map((h, i) => (
                        <span key={i} className="w-0.5 bg-primary animate-pulse" style={{ height: `${h * 15}%` }} />
                      ))}
                    </div>
                  )}

                  {audioUrl && !isRecording && (
                    <audio src={audioUrl} controls className="flex-1 h-8 text-xs shrink-0" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="intro-text-input">Speech Text</Label>
                  <Textarea 
                    id="intro-text-input" 
                    rows={6} 
                    placeholder="Describe your name, university studies, projects, and career aspirations..." 
                    value={introText} 
                    onChange={e => setIntroText(e.target.value)}
                  />
                </div>

                <Button onClick={handleEvaluateIntro} disabled={isIntroLoading || !introText.trim()} className="w-full gap-2 glow-primary">
                  {isIntroLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Evaluate Introduction
                </Button>
              </CardContent>
            </Card>

            {/* Introduction Feedback Panel */}
            <div className="space-y-6">
              {introFeedback ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <Card className="glass-card bg-primary/5 border-primary/20 text-center py-6">
                    <CardContent className="space-y-2 p-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto font-black text-xl">
                        {introFeedback.score}%
                      </div>
                      <h3 className="font-bold text-sm">Introduction Score</h3>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1"><Award className="h-4 w-4" /> AI Diagnostics</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <p><strong className="uppercase text-[9px] text-muted-foreground block mb-0.5">Clarity & Pace:</strong> {introFeedback.clarityFeedback}</p>
                      <p><strong className="uppercase text-[9px] text-muted-foreground block mb-0.5">Confidence Tips:</strong> {introFeedback.confidenceTips}</p>
                      <div className="border-t border-border/20 pt-3">
                        <strong className="uppercase text-[9px] text-muted-foreground block mb-1">Grammar Corrections:</strong>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-muted-foreground">
                          {introFeedback.grammarSuggestions?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-accent/20 bg-accent/5">
                    <CardHeader><CardTitle className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1"><Lightbulb className="h-4 w-4" /> Improved Pitch Rewrite</CardTitle></CardHeader>
                    <CardContent className="text-xs text-foreground leading-relaxed italic bg-card p-3 rounded border border-border/30">
                      "{introFeedback.betterVersion}"
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="glass-card text-center py-16 text-muted-foreground">
                  <CardContent className="space-y-2">
                    <Mic className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                    <p className="text-xs">Complete a practice intro speaking or writing test to receive AI analysis.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Daily Speaking Prompts */}
        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily topics checklist */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><BookOpen className="h-4 w-4" /> Daily Topic Prompts</h2>
              <div className="space-y-2">
                {dailyTopics.map((topic) => (
                  <div 
                    key={topic.id} 
                    onClick={() => { setSelectedTopic(topic); setSpeakingFeedback(null); }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTopic?.id === topic.id ? "bg-primary/10 border-primary text-foreground" : "bg-card border-border/40 text-muted-foreground hover:bg-muted/30"}`}
                  >
                    <p className="text-xs font-bold">{topic.title}</p>
                    <p className="text-[10px] truncate mt-1">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Response recording */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Practice Prompt: {selectedTopic?.title}</CardTitle>
                <CardDescription className="text-xs">{selectedTopic?.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg border border-border/40 bg-muted/20">
                  <Button 
                    variant={isRecording ? "destructive" : "default"} 
                    size="sm" 
                    onClick={isRecording ? stopRecording : startRecording}
                    className="gap-1.5 h-9"
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-4 w-4 fill-white" /> Stop ({recordingSeconds}s)
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" /> Record Answer
                      </>
                    )}
                  </Button>
                  
                  {audioUrl && !isRecording && (
                    <audio src={audioUrl} controls className="flex-1 h-8" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="speaking-text-input">Transcript / Written Response</Label>
                  <Textarea 
                    id="speaking-text-input" 
                    rows={5} 
                    placeholder="Draft your answer using STAR metrics to describe technology decisions..." 
                    value={speakingText} 
                    onChange={e => setSpeakingText(e.target.value)}
                  />
                </div>

                <Button onClick={handleEvaluateSpeaking} disabled={isSpeakingLoading || !speakingText.trim()} className="w-full gap-2 glow-primary">
                  {isSpeakingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Submit Speaking Response
                </Button>

                {speakingFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border border-accent/20 bg-accent/5 space-y-3 text-xs mt-4">
                    <div className="flex justify-between items-center border-b border-border/20 pb-2">
                      <span className="font-bold text-accent uppercase text-[10px]">Evaluation scorecard: {speakingFeedback.quality}</span>
                      <Badge className="bg-accent">{speakingFeedback.score}% Score</Badge>
                    </div>
                    <p className="text-muted-foreground"><strong className="text-[9px] uppercase block mb-0.5">Clarity & Accuracy:</strong> {speakingFeedback.clarity}</p>
                    <p className="text-muted-foreground"><strong className="text-[9px] uppercase block mb-0.5">Tone & confidence:</strong> {speakingFeedback.confidence}</p>
                    <p className="text-muted-foreground"><strong className="text-[9px] uppercase block mb-0.5">Grammar Corrections:</strong> {speakingFeedback.suggestions}</p>
                    <div className="bg-card p-3 rounded border border-border/30">
                      <strong className="text-[9px] text-primary uppercase block mb-1">Better Version:</strong>
                      <p className="italic leading-relaxed">"{speakingFeedback.improvedAnswer}"</p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Vocabulary Builder */}
        <TabsContent value="vocab" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Word cards */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><BookOpen className="h-4 w-4" /> Word Challenges</h2>
              <div className="grid grid-cols-1 gap-2">
                {vocabWords.map((v) => (
                  <div 
                    key={v.word} 
                    onClick={() => { setSelectedWord(v); setVocabFeedback(null); setVocabSentence(""); }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedWord?.word === v.word ? "bg-primary/10 border-primary text-foreground" : "bg-card border-border/40 text-muted-foreground hover:bg-muted/30"}`}
                  >
                    <p className="text-xs font-bold">{v.word}</p>
                    <p className="text-[10px] italic mt-1 font-medium text-primary">"{v.meaning}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Word details and practice sentence */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Word of the Day</Badge>
                  <span className="text-xs font-semibold text-primary">{selectedWord?.word}</span>
                </div>
                <CardTitle className="text-base mt-2">Definition: {selectedWord?.meaning}</CardTitle>
                <CardDescription className="text-xs italic bg-muted/20 p-2.5 rounded border border-border/30 mt-2">
                  Example: "{selectedWord?.example}"
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="vocab-sentence-input">Write a sentence using "{selectedWord?.word}"</Label>
                  <Input 
                    id="vocab-sentence-input" 
                    placeholder="Draft a descriptive sentence showing you understand the context..." 
                    value={vocabSentence} 
                    onChange={e => setVocabSentence(e.target.value)}
                  />
                </div>

                <Button onClick={handleEvaluateVocab} disabled={isVocabLoading || !vocabSentence.trim()} className="w-full gap-2 glow-primary">
                  {isVocabLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Submit Sentence
                </Button>

                {vocabFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3 text-xs mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground uppercase text-[10px]">Vocab Assessment</span>
                      <Badge className="bg-primary">{vocabFeedback.score || 0}% Score</Badge>
                    </div>
                    <p className="text-muted-foreground">{vocabFeedback.feedback}</p>
                    {vocabFeedback.betterVersion && (
                      <div className="bg-card p-2.5 rounded border border-border/30">
                        <strong className="text-[9px] text-primary uppercase block mb-1">Better Version:</strong>
                        <p className="italic">"{vocabFeedback.betterVersion}"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
