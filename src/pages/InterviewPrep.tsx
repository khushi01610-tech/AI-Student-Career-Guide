import { useState } from "react";
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
  Filter,
  Laptop,
  Radio,
  Scale,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CuratedQuestion {
  id: string;
  stream: "CSE" | "BJMC";
  tier: "google" | "medium" | "college";
  tierLabel: string;
  category: string;
  companyTag: string;
  question: string;
  optimalApproach: string;
  sampleAnswer: string;
  tips: string[];
}

const STATIC_QUESTION_BANK: CuratedQuestion[] = [
  // ==========================================
  // 💻 B.TECH (COMPUTER SCIENCE & ENGINEERING)
  // ==========================================
  // 🔴 CSE GOOGLE / FAANG TIER
  {
    id: "cse-g1",
    stream: "CSE",
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
    id: "cse-g2",
    stream: "CSE",
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
    id: "cse-g3",
    stream: "CSE",
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
    id: "cse-g4",
    stream: "CSE",
    tier: "google",
    tierLabel: "Google / FAANG",
    category: "HR & Behavioral",
    companyTag: "Google (Googleyness)",
    question: "Tell me about a time you identified an architectural flaw that others overlooked, or when you had to advocate for code refactoring under aggressive shipping deadlines.",
    optimalApproach: "STAR framework with concrete metrics: benchmark data, latency profiles, consensus-building without ego, and measurable post-release improvements.",
    sampleAnswer: "During our final semester distributed lab, our microservices experienced 3-second latency spikes under concurrent load. The team attributed it to cloud bandwidth. Using OpenTelemetry profiling, I identified N+1 database queries and unindexed foreign keys. I presented comparative benchmarks (3s vs 120ms with batching) and convinced the team to allocate 2 days for DataLoader and indexing refactoring, ensuring a flawless demo.",
    tips: ["Use data and benchmarks to justify decisions", "Emphasize collaboration rather than placing blame", "Show long-term technical stewardship"]
  },

  // 🟡 CSE PRODUCT MEDIUM TIER (Unicorns)
  {
    id: "cse-m1",
    stream: "CSE",
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
    id: "cse-m2",
    stream: "CSE",
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
    id: "cse-m3",
    stream: "CSE",
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
    id: "cse-m4",
    stream: "CSE",
    tier: "medium",
    tierLabel: "Product Medium",
    category: "HR & Behavioral",
    companyTag: "Atlassian / Flipkart",
    question: "Describe a project where you had to balance feature delivery speed against code quality or technical debt. How did you decide what trade-offs to make?",
    optimalApproach: "Conscious technical debt vs accidental debt. Documenting migration paths, establishing MVP boundaries, and scheduling follow-up refactoring sprints.",
    sampleAnswer: "In a hackathon team project, we had 36 hours to ship a real-time notification service. Instead of provisioning Kafka clusters and worker fleets, we implemented an in-memory queue with SQLite persistence for MVP stability, while writing the exact Redis Pub/Sub migration specification. Once the primary features were verified, we refactored the pipeline cleanly.",
    tips: ["Highlight deliberate trade-offs rather than accidental tech debt", "Show business awareness of shipping deadlines", "Explain follow-up remediation steps"]
  },

  // 🟢 CSE COLLEGE / CAMPUS PLACEMENT TIER
  {
    id: "cse-c1",
    stream: "CSE",
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
    id: "cse-c2",
    stream: "CSE",
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
    id: "cse-c3",
    stream: "CSE",
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
    id: "cse-c4",
    stream: "CSE",
    tier: "college",
    tierLabel: "College Placement",
    category: "HR & Behavioral",
    companyTag: "Campus HR Round",
    question: "Walk me through your resume and final-year capstone project. What was your personal contribution, and what was the biggest technical challenge you resolved?",
    optimalApproach: "Under 90 seconds: Education, Technical stack, Specific project contribution (backend/frontend), Concrete challenge resolved, and impact.",
    sampleAnswer: "I am a final-year student specializing in Computer Science. For our capstone project, our team built an AI-assisted Student Career Guide. My primary role was architecting the backend Express API and database models, as well as integrating responsive UI dashboards in React. Our biggest challenge was handling asynchronous resume parsing latency; I resolved this by introducing optimistic UI updates and background task queues, reducing perceived user waiting time by 40%.",
    tips: ["Keep introduction under 90 seconds", "Highlight what YOU coded individually", "Mention technologies used and end with measurable impact"]
  },

  // ==========================================
  // 🎙️ BJMC (JOURNALISM & MASS COMMUNICATION)
  // ==========================================
  // 🔴 BJMC NATIONAL MEDIA TIER
  {
    id: "bjmc-g1",
    stream: "BJMC",
    tier: "google",
    tierLabel: "National Media",
    category: "Media Law & Ethics",
    companyTag: "BBC News / NDTV",
    question: "A high-ranking cabinet official issues a legal cease-and-desist threatening criminal defamation under Section 499 IPC over your upcoming investigative report. Under what legal defenses (Truth for Public Good, Fair Comment) can you proceed, and what documentation is required?",
    optimalApproach: "Substantiate through documented proof (official tenders, audited accounts), establish formal 48-hour Right of Reply with timestamps, conduct pre-publication legal audit, and protect confidential whistleblower coordinates.",
    sampleAnswer: "Under Indian jurisprudence (Section 499 IPC Exceptions 1 and 2), truth substantiated by documentary evidence and published for the public good is an absolute defense. Prior to broadcast: 1) Verify primary documentation (RTI replies, audited reports); 2) Deliver a formal time-stamped questionnaire granting 48 hours for Right of Reply; 3) Review phrasing with newsroom legal counsel; and 4) Store whistleblower communications on encrypted, air-gapped storage.",
    tips: ["Explain the 'Right of Reply' protocol and timestamping", "Cite IPC Section 499 Exceptions (Truth for Public Good)", "Address confidential source metadata encryption"]
  },
  {
    id: "bjmc-g2",
    stream: "BJMC",
    tier: "google",
    tierLabel: "National Media",
    category: "Investigative Reporting",
    companyTag: "The Hindu / Reuters",
    question: "Your whistleblower source provided confidential procurement records exposing public corruption. A court subpoenas you to hand over source notes and call logs under threat of contempt. How do you ethically and legally navigate source protection?",
    optimalApproach: "Ethical obligation to protect confidential sources (SPJ Code & PCI guidelines), invoke Article 19(1)(a) freedom of the press, provide published factual data while protecting identifying metadata, and appeal through editorial legal counsel.",
    sampleAnswer: "Preserving source confidentiality is an inviolable journalistic tenet. Under Press Council of India standards, journalists have an ethical obligation to protect sources who risk safety to expose wrongdoing. In court, I would present the authenticated documents while stating that disclosing identifying metadata violates journalistic privilege and Article 19(1)(a) freedom of press, filing a legal intervention with senior editorial representation.",
    tips: ["Cite Article 19(1)(a) Freedom of Speech and Press Council guidelines", "Distinguish between handing over public documents vs private identifying metadata", "Demonstrate institutional backbone and editorial solidarity"]
  },
  {
    id: "bjmc-g3",
    stream: "BJMC",
    tier: "google",
    tierLabel: "National Media",
    category: "Broadcast & Anchoring",
    companyTag: "NDTV 24x7 / India Today",
    question: "You are anchoring a live primetime breaking news broadcast when the teleprompter abruptly crashes, and unverified contradictory casualty figures flood social media. How do you maintain broadcast composure without inciting public panic?",
    optimalApproach: "Composure and eye contact with tally light; transparently acknowledge developing situation; instruct PCR for bureau feed; rely on hardcopy rundowns; refuse to air uncertified social media numbers.",
    sampleAnswer: "First, stay calm and maintain steady eye contact with the camera tally light without shuffling papers frantically. Second, communicate transparently with viewers: 'We are monitoring developing reports of a derailment. Correspondents are connecting with emergency officials.' Third, signal the Production Control Room (PCR) to bring in on-ground reporters while referencing hardcopy notes. Never report unverified Twitter casualties until confirmed by the designated relief commissioner.",
    tips: ["Prioritize accuracy over speed in live breaking situations", "Demonstrate unscripted composure and control-room communication", "Quote official emergency helplines and certified nodal officers"]
  },
  {
    id: "bjmc-g4",
    stream: "BJMC",
    tier: "google",
    tierLabel: "National Media",
    category: "Editorial Leadership",
    companyTag: "The Wire / Indian Express",
    question: "Tell me about a time you faced intense editorial pushback or a commercial conflict of interest when pursuing an investigative story that threatened an influential institutional advertiser.",
    optimalApproach: "STAR framework: public trust vs commercial interest, documented audit trail, offering fair right of rebuttal, and presenting undeniable factual evidence to editorial leadership.",
    sampleAnswer: "In our campus media syndicate, we investigated hostel catering irregularities where the food contractor was also the primary sponsor of our annual festival. The student council attempted to suppress publication. I met with the editorial board, showed laboratory water test results and vendor invoices, and explained that student welfare outweighed sponsorship optics. We published the story with a balanced statement from the vendor, leading to an open competitive re-tendering.",
    tips: ["Frame the dilemma around public trust vs commercial convenience", "Show you sought the subject's rebuttal fairly", "Emphasize facts and documented records rather than emotional rhetoric"]
  },

  // 🟡 BJMC DIGITAL MEDIA & PR AGENCY TIER
  {
    id: "bjmc-m1",
    stream: "BJMC",
    tier: "medium",
    tierLabel: "Digital & PR",
    category: "Fact Checking & OSINT",
    companyTag: "The Quint / BoomLive",
    question: "A manipulated 20-second video of an industrialist with cloned AI audio is trending on X (Twitter) with over 3 million views. Detail your newsroom OSINT verification protocol before publishing a fact-check.",
    optimalApproach: "Four-stage verification: lossless extraction, InVID keyframe reverse image search, audio waveform spectral discontinuity analysis for AI synthesis, and direct human corroboration.",
    sampleAnswer: "Our fact-checking protocol involves 4 stages: 1) Extract original video file without compression; 2) Run InVID keyframe extraction through Google and Yandex reverse image engines to find the original footage date; 3) Analyze the audio track using spectral frequency analyzers to spot synthetic voice artifacts and absence of ambient room noise; 4) Contact the subject's communications team. We then publish a side-by-side debunk breakdown highlighting archival evidence.",
    tips: ["Mention InVID, WeVerify, or TinEye reverse image search", "Explain audio spectral analysis for AI cloned voices", "Detail how claim reviews and debunk articles are structured"]
  },
  {
    id: "bjmc-m2",
    stream: "BJMC",
    tier: "medium",
    tierLabel: "Digital & PR",
    category: "PR & Crisis Comms",
    companyTag: "Ogilvy / Edelman",
    question: "You are the Corporate Communications Lead for a quick-commerce unicorn. A delivery partner's scooter brake failure causes an injury that sparks trending boycotts online. What is your 60-minute crisis communication and holding statement strategy?",
    optimalApproach: "15-minute cross-functional war room; 30-minute compassionate holding statement leading with medical support and fleet audit; 60-minute frontline customer care talking points.",
    sampleAnswer: "Within 15 minutes, convene the rapid-response crisis unit (Operations, Legal, Comms) to verify ground facts. By Minute 30, issue a concise Holding Statement across verified social channels: 'We are deeply concerned about the incident in Mumbai. Our emergency response team has visited our partner in hospital, covering all medical care. A comprehensive fleet brake audit is underway, and updates will be shared by 5 PM.' By Minute 60, equip support agents with approved talking points.",
    tips: ["Never say 'No comment' or stay silent in a digital crisis", "Structure response: Empathy -> Concrete Remediation -> Timed Updates", "Prepare FAQ internal holding lines for frontline support agents"]
  },
  {
    id: "bjmc-m3",
    stream: "BJMC",
    tier: "medium",
    tierLabel: "Digital & PR",
    category: "Digital Content Strategy",
    companyTag: "Vox Media / Scroll.in",
    question: "You have a 3,000-word investigative report on groundwater depletion caused by beverage bottling plants. How do you repurpose this across an Instagram Reel, a Substack newsletter lead, and an SEO web headline without sensationalizing the journalism?",
    optimalApproach: "Tailor formats to platform user psychology: SEO headline for search intent, 45s Reel using visual contrast and motion data graphics, and a conversational first-person methodology hook for Substack.",
    sampleAnswer: "For Web/SEO: Focus on geographical search volume: 'Groundwater Crisis: How Bottling Plants Are Depleting Water Tables in Western UP'. For Instagram Reel (45s): Visual contrast hook — a farmer with an empty pump cut to moving water tankers, displaying animated pie charts of groundwater levels, concluding with 'Read our 6-month investigation via bio'. For Substack: Personal behind-the-scenes narrative on field testing 40 soil samples.",
    tips: ["Distinguish between curiosity hooks and dishonest clickbait", "Emphasize visual data storytelling for mobile audiences", "Mention keyword search volume (SEO) vs narrative hook (Newsletter)"]
  },
  {
    id: "bjmc-m4",
    stream: "BJMC",
    tier: "medium",
    tierLabel: "Digital & PR",
    category: "Interviewing Technique",
    companyTag: "Newslaundry / Frontline",
    question: "Describe a high-pressure interview where the subject evaded answering questions with scripted PR talking points. How did you politely redirect the interview back to critical facts?",
    optimalApproach: "Polite acknowledgement, followed by immediate re-anchoring to undeniable empirical data, audit figures, or regulatory notices without showing emotional frustration.",
    sampleAnswer: "When an interviewee repeats scripted talking points, I acknowledge their perspective politely and immediately re-anchor the question to documented records: 'I appreciate the company's community tree plantation drive, but the state pollution board's inspection specifically documented industrial effluent 4 times above permissible limits in April. What capital upgrade was made to fix that filtration failure?' Grounding in documented metrics removes subjective debate.",
    tips: ["Demonstrate polite assertiveness without hostility", "Anchor follow-ups to specific metrics or third-party documents", "Show respect for audience time and clarity"]
  },

  // 🟢 BJMC CAMPUS PLACEMENT TIER
  {
    id: "bjmc-c1",
    stream: "BJMC",
    tier: "college",
    tierLabel: "Campus Placement",
    category: "News Writing",
    companyTag: "Times Group / Indian Express Campus Drive",
    question: "Explain the Inverted Pyramid structure in news writing. What are the 5 Ws and 1 H, and how do you compose an effective 25-word Lead (Intro) for a breaking campus or civic story?",
    optimalApproach: "Inverted pyramid places most newsworthy facts at top; 5 Ws and 1 H (Who, What, When, Where, Why, How); active verb lead under 25 words.",
    sampleAnswer: "The Inverted Pyramid structure organizes news with the most critical facts at the apex (the lead), followed by essential context, and concluding with general background. The 5 Ws and 1 H are Who, What, When, Where, Why, and How. A crisp 25-word lead: 'Delhi University approved a 15% hostel fee rollback on Tuesday following a three-day sit-in protest by over 500 student union representatives.' It answers Who, What, When, and Why in one active sentence.",
    tips: ["Keep the lead sentence under 25-30 words", "Ensure the primary action verb is active, not passive", "Explain why inverted pyramid allows editors to trim from the bottom"]
  },
  {
    id: "bjmc-c2",
    stream: "BJMC",
    tier: "college",
    tierLabel: "Campus Placement",
    category: "Public Relations",
    companyTag: "Adfactors PR / Weber Shandwick",
    question: "What are the structural components of a professional Press Release? How does a media desk distinguish legitimate news value from commercial corporate promotion?",
    optimalApproach: "8 standard PR elements: release timestamp, headline, dateline, lead, supporting body data, executive quote, boilerplate, media contact info. News desk filters for public relevance and timeliness.",
    sampleAnswer: "A standard press release includes: 1) Release timing (Immediate Release), 2) Clear headline, 3) Dateline (City, Date), 4) The Lead summary, 5) Supporting data, 6) Leadership quote with human insight, 7) Company Boilerplate ('About Us'), and 8) Media Spokesperson contact details. Newsrooms filter out commercial puffery by checking for public relevance, verifiable industry milestones, and timeliness rather than promotional adjectives.",
    tips: ["Name all 8 structural elements of a standard PR kit", "Emphasize high news value over self-promotional fluff", "Mention high-res media kit download links"]
  },
  {
    id: "bjmc-c3",
    stream: "BJMC",
    tier: "college",
    tierLabel: "Campus Placement",
    category: "Media Ethics",
    companyTag: "Press Council / Newsroom Onboarding",
    question: "What ethical and legal precautions must a media professional observe when reporting on children, crime victims, or sub-judice court matters under Press Council of India guidelines?",
    optimalApproach: "POCSO Section 74 (complete protection of minor identities), IPC Section 228A (protecting sexual offense survivors), and avoiding prejudicial media trials in sub-judice court proceedings.",
    sampleAnswer: "Under POCSO Act (Section 74) and Press Council guidelines: 1) The identity, photograph, school, or address of juvenile offenders or child victims must never be revealed; 2) For sexual assault survivors (IPC Section 228A), identity must be strictly protected regardless of consent; 3) In ongoing court trials (sub-judice), reporting must be strictly factual based on court proceedings without running parallel 'media trials' that prejudice judges or witnesses.",
    tips: ["Reference IPC Section 228A and POCSO protection provisions", "Highlight avoiding sensationalism or intrusive grief reporting", "Emphasize respect for privacy and human dignity"]
  },
  {
    id: "bjmc-c4",
    stream: "BJMC",
    tier: "college",
    tierLabel: "Campus Placement",
    category: "Campus HR & Beat Portfolio",
    companyTag: "Media Placement Interview Board",
    question: "Walk me through your journalism portfolio, college documentary, or beat reporting project. What story did you break, how did you gather sources, and what editorial challenge did you overcome?",
    optimalApproach: "Under 90 seconds: Journalism beat, investigative field methodology, primary human sourcing, video/audio production tools mastered, and public impact.",
    sampleAnswer: "I am a graduating BJMC student specializing in digital investigative reporting and multimedia production. For our final capstone project, I produced a 12-minute documentary on e-waste recycling hazards in Seelampur, Delhi. I conducted 8 on-ground interviews with informal recyclers and environmental chemists, validating heavy metal contamination data. The primary challenge was earning the trust of local workers fearful of municipal raids; I addressed this by spending 3 days observing without cameras, clearly explaining our reporting purpose, and guaranteeing facial anonymization where requested.",
    tips: ["Structure introduction around your specific reporting beat (e.g., civic, business, culture, tech)", "Highlight primary on-ground sourcing over internet aggregation", "State video editing or podcast tools you mastered (Premiere, Audacity, Descript)"]
  }
];

export default function InterviewPrep() {
  const { user } = useAuth();
  
  // Stream state
  const initialStream = user?.degree === "BJMC" ? "BJMC" : "CSE";
  const [stream, setStream] = useState<"CSE" | "BJMC">(initialStream);

  const [selectedTier, setSelectedTier] = useState<"all" | "google" | "medium" | "college">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(initialStream === "BJMC" ? "bjmc-g1" : "cse-g1");
  
  // Practice Answer State
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // Dynamic Generator State
  const [roleInput, setRoleInput] = useState(
    user?.careerGoal || (initialStream === "BJMC" ? "Digital Journalist / Reporter" : "Software Developer")
  );
  const [genTier, setGenTier] = useState(
    initialStream === "BJMC" ? "National Broadcaster Level" : "Google / FAANG Level"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const { toast } = useToast();

  const handleStreamToggle = (newStream: "CSE" | "BJMC") => {
    setStream(newStream);
    setSelectedCategory("All");
    setSelectedTier("all");
    setExpandedId(newStream === "BJMC" ? "bjmc-g1" : "cse-g1");
    if (newStream === "BJMC") {
      setRoleInput("Digital Journalist / Reporter");
      setGenTier("National Broadcaster Level");
    } else {
      setRoleInput("Software Developer");
      setGenTier("Google / FAANG Level");
    }
  };

  // Categories based on stream
  const categories = stream === "BJMC"
    ? ["All", "Media Law & Ethics", "Investigative Reporting", "Broadcast & Anchoring", "Fact Checking & OSINT", "PR & Crisis Comms", "News Writing"]
    : ["All", "DSA", "System Design", "Core CS", "HR & Behavioral"];

  const filteredQuestions = STATIC_QUESTION_BANK.filter((q) => {
    const matchesStream = q.stream === stream;
    const matchesTier = selectedTier === "all" || q.tier === selectedTier;
    const matchesCategory = selectedCategory === "All" || q.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesStream && matchesTier && matchesCategory;
  });

  const handleGenerateFresh = async () => {
    setIsGenerating(true);
    setGeneratedData(null);
    try {
      const contextualRole = `${roleInput} (${stream})`;
      const data = await api.interview.generateQuestions(contextualRole, genTier, "Technical & Behavioral");
      setGeneratedData(data);
      toast({
        title: "Interview Questions Generated! 🎯",
        description: `Loaded ${data.questions?.length || 0} questions tailored to ${stream} - ${genTier}.`
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
      {/* Header with Dual Stream Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 border-primary/30 text-primary">
              Interview Question Archives
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {stream === "CSE" ? "B.Tech Computer Science" : "BJMC Journalism & Media"}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
            Placement Interview Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Curated blueprints with sample model answers, interviewer criteria, and real-time grading.
          </p>
        </div>

        {/* Primary Stream Toggle */}
        <div className="flex items-center p-1 bg-muted rounded-lg border border-border shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleStreamToggle("CSE")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              stream === "CSE"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Laptop className="h-3.5 w-3.5" /> B.Tech CSE Board
          </button>
          <button
            type="button"
            onClick={() => handleStreamToggle("BJMC")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              stream === "BJMC"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Radio className="h-3.5 w-3.5" /> BJMC Journalism Board
          </button>
        </div>
      </div>

      {/* Tier Selector Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card 
          onClick={() => setSelectedTier("all")}
          className={`cursor-pointer transition-all border p-3.5 text-left bg-card ${
            selectedTier === "all" 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-border hover:border-primary/40"
          }`}
        >
          <p className="text-xs font-semibold text-muted-foreground">Comprehensive</p>
          <h3 className="text-sm font-bold text-foreground mt-0.5 font-heading">All Question Tiers</h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stream === "BJMC" ? "12 curated journalism & PR rounds" : "12 curated tech & architecture rounds"}
          </p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("google")}
          className={`cursor-pointer transition-all border p-3.5 text-left bg-card ${
            selectedTier === "google" 
              ? "border-rose-500 bg-rose-500/5 shadow-sm" 
              : "border-border hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              {stream === "BJMC" ? "🔴 Tier 1: National Media" : "🔴 Tier 1: Advanced"}
            </p>
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] px-1.5 py-0 border-rose-500/20">
              High Bar
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5 font-heading">
            {stream === "BJMC" ? "BBC / NDTV / The Hindu" : "Google / FAANG"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stream === "BJMC" ? "Media Law, Source Protection, Live Anchoring" : "High Scale Systems, Hard DSA, Googleyness"}
          </p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("medium")}
          className={`cursor-pointer transition-all border p-3.5 text-left bg-card ${
            selectedTier === "medium" 
              ? "border-amber-500 bg-amber-500/5 shadow-sm" 
              : "border-border hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {stream === "BJMC" ? "🟡 Tier 2: Digital Media & PR" : "🟡 Tier 2: Product"}
            </p>
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0 border-amber-500/20">
              Mid Level
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5 font-heading">
            {stream === "BJMC" ? "The Quint / Vox / Ogilvy" : "Unicorns & Tech"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stream === "BJMC" ? "OSINT Fact-Checking, Crisis PR, Multi-Platform" : "Swiggy, Razorpay, Trees/Hash, Concurrency"}
          </p>
        </Card>

        <Card 
          onClick={() => setSelectedTier("college")}
          className={`cursor-pointer transition-all border p-3.5 text-left bg-card ${
            selectedTier === "college" 
              ? "border-emerald-500 bg-emerald-500/5 shadow-sm" 
              : "border-border hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stream === "BJMC" ? "🟢 Tier 3: Trainee Drives" : "🟢 Tier 3: Campus"}
            </p>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0 border-emerald-500/20">
              Foundational
            </Badge>
          </div>
          <h3 className="text-sm font-bold text-foreground mt-0.5 font-heading">
            {stream === "BJMC" ? "Times Group / Adfactors" : "College Placement"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">
            {stream === "BJMC" ? "Inverted Pyramid, Press Releases, Beat Portfolio" : "TCS Digital, Infosys, OOPs, DBMS, OS, HR"}
          </p>
        </Card>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
          <Filter className="h-3 w-3" /> Specialization:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Question Bank Display */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => {
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
              className={`border border-border bg-card border-l-4 ${tierColor} transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md`}
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
                      className="h-7 text-xs gap-1 font-semibold"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isPracticing ? "Close Practice" : "Practice My Pitch"}
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="h-7 w-7 p-0"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <CardTitle 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="text-base font-bold text-foreground mt-2 cursor-pointer hover:text-primary transition-colors leading-relaxed font-heading"
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
                    <CardContent className="p-5 pt-0 space-y-4 border-t border-border/60 mt-3">
                      {/* Optimal Approach */}
                      <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5 font-heading">
                          <Lightbulb className="h-3.5 w-3.5 text-primary" /> 
                          {item.stream === "BJMC" ? "Recommended Journalistic & Legal Approach:" : "Recommended Engineering & Architectural Approach:"}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.optimalApproach}
                        </p>
                      </div>

                      {/* Model Answer */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5 font-heading">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Model Answer Walkthrough:
                        </p>
                        <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-line font-mono text-[11.5px]">
                          {item.sampleAnswer}
                        </div>
                      </div>

                      {/* Tips checklist */}
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.stream === "BJMC" ? "Editorial Board Evaluation Callouts:" : "Interviewer Criteria & Key Callouts:"}
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {item.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-muted-foreground bg-card p-2 rounded-lg border border-border/60 flex items-start gap-1.5">
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
                        <p className="text-xs font-bold text-foreground flex items-center gap-1.5 font-heading">
                          <Sparkles className="h-3.5 w-3.5 text-primary" /> Test Your Readiness: Record Your Answer
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {item.stream === "BJMC" ? "Graded for Journalistic Accuracy & Ethics" : "Graded for Technical Depth & Complexity"}
                        </span>
                      </div>

                      <Textarea
                        placeholder={
                          item.stream === "BJMC"
                            ? "Draft your newsroom or PR answer (cite legal protections, primary sources, right of reply, broadcast protocols)..."
                            : "Structure your answer using What, How, and Why. Explain trade-offs, algorithms, or project contributions..."
                        }
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
                          className="gap-1.5 text-xs font-semibold"
                        >
                          {isEvaluating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Evaluate Answer With Rubric
                        </Button>
                      </div>

                      {/* Evaluation Feedback Display */}
                      {evalResult && (
                        <div className="mt-3 p-4 rounded-lg bg-card border border-border shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Award className="h-4.5 w-4.5 text-primary" />
                              <span className="text-xs font-bold text-foreground font-heading">
                                Panel Grading Assessment
                              </span>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs">
                              Score: {evalResult.score}%
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                              <p className="font-semibold text-foreground text-[11px]">Assessment Feedback:</p>
                              <p className="text-muted-foreground">{evalResult.clarity || evalResult.relevance}</p>
                              <p className="text-muted-foreground pt-1"><strong className="text-foreground">Improvement Tip:</strong> {evalResult.suggestions}</p>
                            </div>

                            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                              <p className="font-semibold text-primary text-[11px]">Recommended Polished Pitch:</p>
                              <p className="text-foreground leading-relaxed text-[11.5px]">{evalResult.improvedAnswer}</p>
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
      <Card className="border border-border bg-card shadow-sm mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 font-heading">
                <RefreshCw className="h-4 w-4 text-primary" /> On-Demand Question Generator
              </CardTitle>
              <CardDescription className="text-xs">
                Roll fresh dynamic interview questions calibrated to your specific discipline and target level.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {stream} Stream
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Role</label>
              <Input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                placeholder={stream === "BJMC" ? "e.g. Digital Journalist, News Anchor, PR Specialist..." : "e.g. Software Engineer, Backend Dev..."}
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Tier</label>
              <select
                value={genTier}
                onChange={(e) => setGenTier(e.target.value)}
                className="w-full text-xs bg-card border border-border rounded-md px-3 py-2 text-foreground h-9"
              >
                {stream === "BJMC" ? (
                  <>
                    <option value="National Broadcaster Level">National Broadcaster Level (BBC / NDTV)</option>
                    <option value="Digital Media & PR Agency Level">Digital Media & PR Agency Level</option>
                    <option value="Campus Placement Trainee Level">Campus Placement Trainee Level</option>
                  </>
                ) : (
                  <>
                    <option value="Google / FAANG Level">Google / FAANG Level</option>
                    <option value="Product Company (Medium)">Product Company (Medium)</option>
                    <option value="College Placement (Foundational)">College Placement (Foundational)</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateFresh}
                disabled={isGenerating}
                className="w-full text-xs gap-1.5 h-9 font-semibold"
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
                Generated {stream} ({genTier}) Questions:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedData.questions.map((q: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">{q.category}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{q.difficulty}</Badge>
                    </div>
                    <p className="text-xs font-bold text-foreground font-heading">{q.question}</p>
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
