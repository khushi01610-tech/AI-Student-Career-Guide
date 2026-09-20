import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  BookOpen, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Award,
  Layers,
  Code2,
  Database,
  Cpu,
  RefreshCw,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CuratedQuestion {
  id: string;
  tier: "google" | "medium" | "college";
  tierLabel: string;
  category: "DSA" | "System Design" | "Core CS" | "HR & Behavioral";
  companyTag: string;
  question: string;
  optimalApproach: string;
  sampleAnswer: string;
  tips: string[];
}

const STATIC_QUESTION_BANK: CuratedQuestion[] = [
  // 🔴 GOOGLE / FAANG TIER
  {
    id: "g1",
    tier: "google",
    tierLabel: "Google / FAANG",
    category: "DSA",
    companyTag: "Google",
    question: "Given a streaming input of billions of integers, find the running Median in O(1) time and O(N) space. How would you design this for a distributed cluster?",
    optimalApproach: "Maintain Two Heaps: Max-Heap for the smaller half and Min-Heap for the larger half. Balancing invariant: heap sizes differ by at most 1. Distributed: Count-Min Sketch or t-digest quantile bucketing across map-reduce worker shards.",
    sampleAnswer: "For a single machine, we balance a Max-Heap and Min-Heap. On each integer arrival, we push to the respective heap and re-balance in O(log N). Median lookup is O(1) from the heap roots. In a distributed setting with millions of QPS, exact medians are memory prohibitive, so we distribute streams across nodes using t-digest or Q-Digest algorithms for sub-1% error bounded quantile estimation.",
    tips: ["State the heap size invariant clearly", "Discuss single node O(log N) insert vs O(1) lookup", "Explain distributed quantile approximations"]
  },
  {
    id: "g2",
    tier: "google",
    tierLabel: "Google / FAANG",
    category: "System Design",
    companyTag: "Google / Meta",
    question: "Design a Globally Distributed Rate Limiter handling 500,000 QPS with under 5ms latency overhead across multi-region datacenters.",
    optimalApproach: "Sliding Window Counter algorithm stored in Redis Cluster. Atomic Lua scripts prevent race conditions. Local Edge caches handle 90% of token decrements with batch synchronization to mitigate inter-region latency.",
    sampleAnswer: "We deploy Sliding Window Counter logic executed via Redis Lua scripts for atomic increments. To prevent cross-region WAN round trips (100ms+), each region maintains local token allowances, synchronizing asynchronously back to central storage using eventual consistency. Headers returned include X-RateLimit-Remaining and Retry-After.",
    tips: ["Compare Token Bucket vs Sliding Window Log vs Counter", "Mention Redis Lua scripts for atomic operations", "Address clock drift across distributed regions"]
  },
  {
    id: "g3",
    tier: "google",
    tierLabel: "Google / FAANG",
    category: "Core CS",
    companyTag: "Google / Netflix",
    question: "How does the Linux Kernel prevent Priority Inversion in preemptive real-time scheduling? How are lock-free data structures implemented at the hardware level?",
    optimalApproach: "Priority Inheritance Protocol (PIP) temporarily elevates the lower priority thread's priority. Lock-free data structures rely on CPU atomic primitives like CAS (Compare-And-Swap) and Memory Barriers.",
    sampleAnswer: "Priority inversion occurs when a low-priority thread holding a lock is preempted by a medium-priority thread, starving a high-priority thread. Linux rt_mutex implements Priority Inheritance: the lock holder inherits the waiting thread's high priority until releasing the resource. Lock-free queues use CPU Compare-And-Swap (CAS) instructions and memory fences to ensure thread-safe updates without OS mutex overhead.",
    tips: ["Define Priority Inversion clearly with the 3-thread scenario", "Explain Priority Inheritance vs Priority Ceiling", "Mention atomic CAS (Compare-And-Swap)"]
  },
  {
    id: "g4",
    tier: "google",
    tierLabel: "Google / FAANG",
    category: "HR & Behavioral",
    companyTag: "Google (Googleyness)",
    question: "Tell me about a time you identified an architectural flaw that others overlooked, or when you had to advocate for code refactoring under aggressive shipping deadlines.",
    optimalApproach: "STAR framework with concrete metrics: benchmark data, latency profiles, consensus-building without ego, and measurable post-release improvements.",
    sampleAnswer: "During our final semester distributed lab, our microservices experienced 3-second latency spikes under concurrent load. The team attributed it to cloud bandwidth. Using OpenTelemetry profiling, I identified N+1 database queries and unindexed foreign keys. I presented comparative benchmarks (3s vs 120ms with batching) and convinced the team to allocate 2 days for DataLoader and indexing refactoring, ensuring a flawless demo.",
    tips: ["Use data and benchmarks to justify decisions", "Emphasize collaboration rather than placing blame", "Show long-term technical stewardship"]
  },

  // 🟡 PRODUCT MEDIUM TIER (Unicorns)
  {
    id: "m1",
    tier: "medium",
    tierLabel: "Product Medium",
    category: "DSA",
    companyTag: "Swiggy / Flipkart",
    question: "Given a Binary Tree, find the Lowest Common Ancestor (LCA) of two given nodes without storing parent pointers. What is the optimal time and space complexity?",
    optimalApproach: "Post-order DFS traversal. If root is null or equals p or q, return root. If both left and right return non-null, root is LCA. Time O(N), Space O(H).",
    sampleAnswer: "We traverse the tree recursively in post-order. If the current root is null or matches either target node, we return it. If both left and right subtrees return non-null, the current node is the LCA. If only one branch returns a match, we pass that non-null node upward. Time complexity is O(N) as each node is visited once, and space complexity is O(H) for the call stack.",
    tips: ["Highlight post-order DFS logic", "Distinguish BST (O(H)) vs normal Binary Tree (O(N))", "Handle cases where one or both nodes are absent"]
  },
  {
    id: "m2",
    tier: "medium",
    tierLabel: "Product Medium",
    category: "System Design",
    companyTag: "Razorpay / Uber",
    question: "Explain how Database Indexing works (B+ Tree vs Hash Index). Why are B+ Trees standard in relational databases, and what is the trade-off with heavy write operations?",
    optimalApproach: "B+ Trees keep keys in internal nodes and all actual records in leaf nodes linked sequentially. Hash index is O(1) for equality but cannot do range scans. Write overhead stems from page splitting and index rebalancing.",
    sampleAnswer: "B+ Trees store all actual data pointers in sequential leaf nodes connected via pointers, making range queries (BETWEEN, >, <) extremely fast in O(log N). Hash indexes offer O(1) point lookups but fail at range scans and sorting. The trade-off is write amplification: every INSERT, UPDATE, or DELETE requires the database engine to locate, update, and potentially re-balance the tree index pages.",
    tips: ["Explain leaf node linked list pointers for range scans", "Discuss write amplification and maintenance overhead", "Mention composite indexes and leftmost prefix rule"]
  },
  {
    id: "m3",
    tier: "medium",
    tierLabel: "Product Medium",
    category: "Core CS",
    companyTag: "Razorpay / Swiggy",
    question: "How do you prevent Race Conditions when updating student wallet balances or inventory stock in high-concurrency microservices?",
    optimalApproach: "Database level: Optimistic locking with version column or SELECT FOR UPDATE. Distributed: Redis Distributed Lock (Redlock) and idempotency keys.",
    sampleAnswer: "For database transactions, we use Optimistic Locking with a version column (`WHERE id = 1 AND version = current_version`). If an update fails due to version mismatch, the client retries. In high-scale distributed setups, we use Redis Distributed Locks or publish transactions to an event queue (Kafka) partitioned by user ID to guarantee strict sequential execution.",
    tips: ["Contrast Optimistic vs Pessimistic locking trade-offs", "Explain idempotency keys for payment APIs", "Discuss distributed lock expiration safety"]
  },
  {
    id: "m4",
    tier: "medium",
    tierLabel: "Product Medium",
    category: "HR & Behavioral",
    companyTag: "Atlassian / Flipkart",
    question: "Describe a project where you had to balance feature delivery speed against code quality or technical debt. How did you decide what trade-offs to make?",
    optimalApproach: "Conscious technical debt vs accidental debt. Documenting migration paths, establishing MVP boundaries, and scheduling follow-up refactoring sprints.",
    sampleAnswer: "In a hackathon team project, we had 36 hours to ship a real-time notification service. Instead of provisioning Kafka clusters and worker fleets, we implemented an in-memory queue with SQLite persistence for MVP stability, while writing the exact Redis Pub/Sub migration specification. Once the primary features were verified, we refactored the pipeline cleanly.",
    tips: ["Highlight deliberate trade-offs rather than accidental tech debt", "Show business awareness of shipping deadlines", "Explain follow-up remediation steps"]
  },

  // 🟢 COLLEGE / CAMPUS PLACEMENT TIER
  {
    id: "c1",
    tier: "college",
    tierLabel: "College Placement",
    category: "Core CS",
    companyTag: "TCS Digital / Infosys / Wipro",
    question: "Explain the Four Pillars of Object-Oriented Programming (OOP) with real-world examples in Java or C++. How does runtime polymorphism differ from compile-time polymorphism?",
    optimalApproach: "Encapsulation (data hiding), Abstraction (hiding implementation details), Inheritance (code reuse), Polymorphism (multiple forms). Compile-time = overloading; Runtime = overriding via virtual methods.",
    sampleAnswer: "The four pillars are: 1. Encapsulation: bundling data and methods within a class using private variables and public getters. 2. Abstraction: exposing only necessary interfaces (e.g. abstract classes). 3. Inheritance: acquiring properties of a parent class (class Car extends Vehicle). 4. Polymorphism: method overloading (compile-time, same name with different parameters) vs method overriding (runtime, child class provides custom implementation of parent method resolved via vtable).",
    tips: ["Provide a clean real-world analogy (e.g., Vehicle class)", "Explain access modifiers (private, protected, public)", "State overloading vs overriding clearly"]
  },
  {
    id: "c2",
    tier: "college",
    tierLabel: "College Placement",
    category: "Core CS",
    companyTag: "Cognizant / Accenture / Deloitte",
    question: "What are ACID properties in DBMS? Explain 1NF, 2NF, and 3NF Normalization with a student table example.",
    optimalApproach: "Atomicity (all or nothing), Consistency (preserves constraints), Isolation (independent transactions), Durability (persisted on disk). Normalization reduces redundancy.",
    sampleAnswer: "ACID ensures reliable transactions: Atomicity (entire transaction succeeds or rolls back), Consistency (valid states), Isolation (concurrency control), Durability (survives crashes). Normalization: 1NF removes multi-valued attributes (each cell has an atomic value); 2NF removes partial dependencies (non-key attributes depend on the entire primary key); 3NF removes transitive dependencies (non-key attributes do not depend on other non-key attributes).",
    tips: ["Break down each letter of ACID with 1 line explanation", "Show how a Student table with multiple phone numbers violates 1NF", "Explain why normalization is preferred over denormalization in OLTP"]
  },
  {
    id: "c3",
    tier: "college",
    tierLabel: "College Placement",
    category: "Core CS",
    companyTag: "TCS / Infosys",
    question: "What is the difference between a Process and a Thread? What are the 4 necessary conditions for a Deadlock to occur?",
    optimalApproach: "Process has separate memory space; Thread shares process heap and data. 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
    sampleAnswer: "A Process is an executing program with its own dedicated memory space (Heap, Stack, Code). A Thread is a lightweight execution unit within a process that shares memory and open files, resulting in faster context switching. The 4 conditions for Deadlock are: 1. Mutual Exclusion (resource held by one process), 2. Hold and Wait (holding a resource while waiting for another), 3. No Preemption (cannot be confiscated), and 4. Circular Wait (a circular chain of waiting processes).",
    tips: ["Context switching between threads is faster than processes", "Name all 4 Coffman conditions accurately", "Mention Dining Philosophers analogy"]
  },
  {
    id: "c4",
    tier: "college",
    tierLabel: "College Placement",
    category: "HR & Behavioral",
    companyTag: "Campus HR Round",
    question: "Walk me through your resume and final-year capstone project. What was your personal contribution, and what was the biggest technical challenge you resolved?",
    optimalApproach: "Under 90 seconds: Education, Technical stack, Specific project contribution (backend/frontend), Concrete challenge resolved, and impact.",
    sampleAnswer: "I am a final-year student specializing in Computer Science. For our capstone project, our team built an AI-assisted Student Career Guide. My primary role was architecting the backend Express API and database models, as well as integrating responsive UI dashboards in React. Our biggest challenge was handling asynchronous resume parsing latency; I resolved this by introducing optimistic UI updates and background task queues, reducing perceived user waiting time by 40%.",
    tips: ["Keep introduction under 90 seconds", "Highlight what YOU coded individually", "Mention technologies used and end with measurable impact"]
  }
];

export default function InterviewPrep() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState<"all" | "google" | "medium" | "college">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("g1");
  
  // Practice Answer State
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // Dynamic Generator State
  const [roleInput, setRoleInput] = useState(user?.careerGoal || "Software Developer");
  const [genTier, setGenTier] = useState("Google / FAANG Level");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const { toast } = useToast();

  const filteredQuestions = STATIC_QUESTION_BANK.filter((q) => {
    const matchesTier = selectedTier === "all" || q.tier === selectedTier;
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    return matchesTier && matchesCategory;
  });

  const handleGenerateFresh = async () => {
    setIsGenerating(true);
    setGeneratedData(null);
    try {
      const data = await api.interview.generateQuestions(roleInput, genTier, "Technical & Behavioral");
      setGeneratedData(data);
      toast({
        title: "Interview Questions Generated! 🎯",
        description: `Loaded ${data.questions?.length || 0} questions tailored to ${genTier}.`
      });
    } catch (e: any) {
      toast({
        title: "Generation failed",
        description: e.message || "Could not retrieve questions.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswerForEvaluation = async (questionText: string) => {
    if (!studentAnswer.trim()) {
      toast({ title: "Answer is empty", description: "Please type an answer before evaluating.", variant: "destructive" });
      return;
    }
    setIsEvaluating(true);
    setEvalResult(null);
    try {
      const result = await api.interview.evaluateAnswer(questionText, studentAnswer);
      setEvalResult(result);
      toast({
        title: "Answer Evaluated! 📊",
        description: `Your Readiness Score: ${result.score || 82}%`
      });
    } catch (e: any) {
      toast({
        title: "Evaluation error",
        description: e.message || "Failed to evaluate answer.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            Interview Question Bank & Simulator
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Calibrated Tiers
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Placement Interview Question Archives
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Practice questions calibrated specifically for Google/FAANG, Product Unicorns (Swiggy/Razorpay), and College Campus Drives (TCS/Infosys).
        </p>
      </div>

      {/* Tier Selector Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card 
          onClick={() => setSelectedTier("all")}
          className={`cursor-pointer transition-all border p-3.5 text-left ${
            selectedTier === "all" 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-border/60 hover:border-primary/40"
          }`}
        >
          <p className="text-xs font-semibold text-muted-foreground">Comprehensive</p>
          <h3 className="text-sm font-bold text-foreground mt-0.5">All Question Tiers</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Complete bank of 12 questions</p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("google")}
          className={`cursor-pointer transition-all border p-3.5 text-left ${
            selectedTier === "google" 
              ? "border-rose-500 bg-rose-500/5 shadow-sm" 
              : "border-border/60 hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">🔴 Tier 1: Advanced</p>
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] px-1.5 py-0 border-rose-500/20">Hard</Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5">Google / FAANG</h3>
          <p className="text-[11px] text-muted-foreground mt-1">High Scale Systems, Hard DSA, Googleyness</p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("medium")}
          className={`cursor-pointer transition-all border p-3.5 text-left ${
            selectedTier === "medium" 
              ? "border-amber-500 bg-amber-500/5 shadow-sm" 
              : "border-border/60 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">🟡 Tier 2: Product</p>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0 border-amber-500/20">Medium</Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5">Unicorns & Tech</h3>
          <p className="text-[11px] text-muted-foreground mt-1">Swiggy, Razorpay, Trees/Hash, Concurrency</p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("college")}
          className={`cursor-pointer transition-all border p-3.5 text-left ${
            selectedTier === "college" 
              ? "border-emerald-500 bg-emerald-500/5 shadow-sm" 
              : "border-border/60 hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">🟢 Tier 3: Campus</p>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0 border-emerald-500/20">Core CS</Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5">College Placement</h3>
          <p className="text-[11px] text-muted-foreground mt-1">TCS Digital, Infosys, OOPs, DBMS, OS, HR</p>
        </Card>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Filter className="h-3 w-3" /> Category:
        </span>
        {["All", "DSA", "System Design", "Core CS", "HR & Behavioral"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Question Bank Display */}
      <div className="space-y-4">
        {filteredQuestions.map((item, idx) => {
          const isExpanded = expandedId === item.id;
          const isPracticing = activePracticeId === item.id;

          const tierColor = item.tier === "google" 
            ? "border-l-rose-500" 
            : item.tier === "medium" 
            ? "border-l-amber-500" 
            : "border-l-emerald-500";

          return (
            <Card 
              key={item.id} 
              className={`glass-card border-l-4 ${tierColor} transition-all duration-200 overflow-hidden`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] font-bold ${
                        item.tier === "google" 
                          ? "text-rose-600 bg-rose-500/10 border-rose-500/20" 
                          : item.tier === "medium" 
                          ? "text-amber-600 bg-amber-500/10 border-amber-500/20" 
                          : "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
                      }`}
                    >
                      {item.tierLabel}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                      <Building2 className="h-3 w-3" /> {item.companyTag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isPracticing ? "default" : "outline"}
                      onClick={() => {
                        setActivePracticeId(isPracticing ? null : item.id);
                        setStudentAnswer("");
                        setEvalResult(null);
                      }}
                      className="h-7 text-xs gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isPracticing ? "Close Practice" : "Practice My Answer"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="h-7 w-7 p-0"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <CardTitle 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="text-base font-bold text-foreground mt-2 cursor-pointer hover:text-primary transition-colors"
                >
                  {item.question}
                </CardTitle>
              </CardHeader>

              {/* Collapsible Model Answer & Approach */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="p-5 pt-0 space-y-4 border-t border-border/40 mt-3">
                      {/* Optimal Approach */}
                      <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 space-y-1">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-accent" /> Recommended Engineering Approach:
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.optimalApproach}
                        </p>
                      </div>

                      {/* Model Answer */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Model Answer Walkthrough:
                        </p>
                        <div className="p-3.5 rounded-lg bg-muted/40 border border-border/50 text-xs text-foreground leading-relaxed whitespace-pre-line font-mono text-[11.5px]">
                          {item.sampleAnswer}
                        </div>
                      </div>

                      {/* Tips checklist */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Interviewer Criteria & Key Callouts:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {item.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground bg-card p-2 rounded border border-border/40 flex items-start gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Practice Mode Sandbox */}
              <AnimatePresence>
                {isPracticing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 border-t border-primary/20 bg-primary/[0.02]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-primary" /> Test Your Readiness: Write Your Answer Below
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          Evaluated against real placement rubrics
                        </span>
                      </div>

                      <Textarea
                        placeholder="Structure your answer using What, How, and Why. Explain trade-offs, algorithms, or project contributions..."
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                        rows={4}
                        className="text-xs font-sans"
                      />

                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          onClick={() => submitAnswerForEvaluation(item.question)}
                          disabled={isEvaluating}
                          className="gap-1.5 text-xs bg-primary hover:bg-primary/90"
                        >
                          {isEvaluating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Evaluate My Answer
                        </Button>
                      </div>

                      {/* Evaluation Feedback Display */}
                      {evalResult && (
                        <div className="mt-3 p-4 rounded-lg bg-card border border-border/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="h-5 w-5 text-accent" />
                              <span className="text-sm font-bold">Answer Evaluation</span>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                              Score: {evalResult.score}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20">
                              <p className="font-semibold text-emerald-600 mb-1">Key Strengths:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                {evalResult.strengths?.map((s: string, idx: number) => (
                                  <li key={idx}>{s}</li>
                                )) || <li>Clear technical foundation demonstrated.</li>}
                              </ul>
                            </div>

                            <div className="p-2.5 rounded bg-amber-500/5 border border-amber-500/20">
                              <p className="font-semibold text-amber-600 mb-1">Missing Keywords / Improvements:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                                {evalResult.improvements?.map((imp: string, idx: number) => (
                                  <li key={idx}>{imp}</li>
                                )) || <li>Consider adding edge cases and Big-O runtime explicitly.</li>}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Dynamic Question Generator Drawer */}
      <Card className="glass-card border-border/70 mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" /> On-Demand Question Generator
              </CardTitle>
              <CardDescription className="text-xs">
                Roll fresh dynamic interview questions calibrated to your specific role and target tier.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Role</label>
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder="e.g. Software Engineer, Backend Dev..."
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Tier</label>
              <select
                value={genTier}
                onChange={(e) => setGenTier(e.target.value)}
                className="w-full text-xs bg-card border border-border rounded-md px-3 py-2 text-foreground"
              >
                <option value="Google / FAANG Level">Google / FAANG Level</option>
                <option value="Product Company (Medium)">Product Company (Medium)</option>
                <option value="College Placement (Foundational)">College Placement (Foundational)</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateFresh}
                disabled={isGenerating}
                className="w-full text-xs gap-1.5 bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Generate Fresh Set
              </Button>
            </div>
          </div>

          {/* Render Generated Questions if available */}
          {generatedData?.questions && (
            <div className="space-y-3 pt-3 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Generated {genTier} Questions:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedData.questions.map((q: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">{q.category}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
                    </div>
                    <p className="text-xs font-bold text-foreground">{q.question}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-3">{q.sampleAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
