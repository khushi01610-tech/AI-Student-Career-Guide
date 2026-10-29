import { mockFallback } from "./mockApiFallback";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
    } catch (_) {
      try {
        const text = await response.text();
        if (text) errorMsg = text;
      } catch (_) {}
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

// Resilient fetch wrapper: handles live backend requests, but automatically falls back
// to client-side session handlers when running on static hosting (e.g. Netlify 404s or network failure)
const safeFetch = async (url: string, options?: RequestInit, fallbackFn?: () => Promise<any>): Promise<any> => {
  try {
    const response = await fetch(url, options);
    // If the server returns 404 (e.g., Netlify static host with no backend), activate fallback
    if (response.status === 404 && fallbackFn) {
      console.warn(`[CareerEngine] Live backend not detected at ${url} (404). Seamlessly operating via static client mode.`);
      return await fallbackFn();
    }
    return await handleResponse(response);
  } catch (err) {
    // If network fails (e.g., offline or backend not running), activate fallback
    if (fallbackFn) {
      console.warn(`[CareerEngine] Network request failed for ${url}. Seamlessly operating via static client mode:`, err);
      return await fallbackFn();
    }
    throw err;
  }
};

export const api = {
  // Authentication
  auth: {
    register: (userData: any) => 
      safeFetch(
        `${API_BASE_URL}/auth/register`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(userData)
        },
        () => mockFallback.auth.register(userData)
      ),
      
    login: (credentials: any) => 
      safeFetch(
        `${API_BASE_URL}/auth/login`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(credentials)
        },
        () => mockFallback.auth.login(credentials)
      ),
      
    me: () => 
      safeFetch(
        `${API_BASE_URL}/auth/me`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.auth.me()
      )
  },

  // Student Profiles & Dashboard
  profile: {
    get: (userId?: string) => 
      safeFetch(
        `${API_BASE_URL}/profile/${userId || ""}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.profile.get()
      ),
      
    update: (profileData: any) => 
      safeFetch(
        `${API_BASE_URL}/profile`, 
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(profileData)
        },
        () => mockFallback.profile.update(profileData)
      ),
      
    getDashboard: () => 
      safeFetch(
        `${API_BASE_URL}/profile/dashboard`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.profile.getDashboard()
      )
  },

  // Resume Scanner & ATS Analyzer
  resume: {
    analyze: (formData: FormData) => 
      safeFetch(
        `${API_BASE_URL}/resume/analyze`, 
        {
          method: "POST",
          headers: getHeaders(true),
          body: formData
        },
        () => mockFallback.resume.analyze()
      )
  },

  // Chat Career Assistant ("CareerGuide AI")
  chat: {
    sendMessage: (message: string, history: any[], profile: any) => 
      safeFetch(
        `${API_BASE_URL}/chat`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ message, history, profile })
        },
        async () => ({ reply: await mockFallback.chat.sendMessage(message) })
      ).then(data => data.reply || data)
  },

  // Interview Prep & Mock Interviews
  interview: {
    generateQuestions: (role: string, difficulty: string, type: string) => 
      safeFetch(
        `${API_BASE_URL}/interview/generate`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ role, difficulty, type })
        },
        () => mockFallback.interview.generateQuestions(role, difficulty, type)
      ),
      
    evaluateAnswer: (question: string, answer: string) => 
      safeFetch(
        `${API_BASE_URL}/interview/evaluate`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ question, answer })
        },
        () => mockFallback.interview.evaluateAnswer()
      ),
      
    saveAttempt: (attemptData: any) => 
      safeFetch(
        `${API_BASE_URL}/interview/attempt`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(attemptData)
        },
        async () => ({ success: true })
      ),
      
    getHistory: () => 
      safeFetch(
        `${API_BASE_URL}/interview/history`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      )
  },

  // Communication Practice
  communication: {
    getTopics: () => 
      safeFetch(
        `${API_BASE_URL}/communication/topics`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => [
          { _id: "t1", title: "Technical Project Architecture Overview", difficulty: "Intermediate", category: "Technical" },
          { _id: "t2", title: "Handling Editorial Pressures and Deadlines", difficulty: "Intermediate", category: "Journalism" }
        ]
      ),
      
    getVocabulary: () => 
      safeFetch(
        `${API_BASE_URL}/communication/vocabulary`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => [
          { _id: "v1", word: "Scalability", meaning: "The capability of a system to handle a growing amount of work." },
          { _id: "v2", word: "Attribution", meaning: "Stating who said something or where information came from in media." }
        ]
      ),
      
    evaluateIntro: (introductionText: string) => 
      safeFetch(
        `${API_BASE_URL}/communication/evaluate-intro`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ introductionText })
        },
        async () => ({ score: 85, feedback: "Confident self-introduction highlighting academic background and key aspirations." })
      ),
      
    evaluateSpeaking: (topic: string, answerText: string) => 
      safeFetch(
        `${API_BASE_URL}/communication/evaluate-speaking`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ topic, answerText })
        },
        async () => ({ score: 80, feedback: "Good structure and technical vocabulary." })
      ),
      
    evaluateVocab: (word: string, meaning: string, studentSentence: string) => 
      safeFetch(
        `${API_BASE_URL}/communication/evaluate-vocab`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ word, meaning, studentSentence })
        },
        async () => ({ score: 90, feedback: "Accurate contextual usage." })
      ),
      
    getHistory: () => 
      safeFetch(
        `${API_BASE_URL}/communication/history`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      )
  },

  // Career Roadmaps
  roadmap: {
    get: (goal?: string) => 
      safeFetch(
        `${API_BASE_URL}/roadmap?goal=${goal || ""}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => null
      ),
      
    toggleSkill: (skillName: string) => 
      safeFetch(
        `${API_BASE_URL}/roadmap/toggle`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ skillName })
        },
        async () => ({ success: true, skillName })
      )
  },

  // Community posts & Comments
  posts: {
    get: (params: { tag?: string; category?: string; isHubResource?: boolean }) => {
      const query = new URLSearchParams();
      if (params.tag) query.append("tag", params.tag);
      if (params.category) query.append("category", params.category);
      if (params.isHubResource !== undefined) query.append("isHubResource", String(params.isHubResource));
      
      return safeFetch(
        `${API_BASE_URL}/posts?${query.toString()}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      );
    },
    
    create: (postData: { content: string; tags?: string[]; isHubResource?: boolean; category?: string }) => 
      safeFetch(
        `${API_BASE_URL}/posts`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(postData)
        },
        async () => ({ _id: "post_" + Date.now(), ...postData, createdAt: new Date().toISOString() })
      ),
      
    like: (postId: string) => 
      safeFetch(
        `${API_BASE_URL}/posts/${postId}/like`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      ),
      
    comment: (postId: string, content: string) => 
      safeFetch(
        `${API_BASE_URL}/posts/${postId}/comment`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ content })
        },
        async () => ({ _id: "c_" + Date.now(), content, createdAt: new Date().toISOString() })
      ),
      
    save: (postId: string) => 
      safeFetch(
        `${API_BASE_URL}/posts/${postId}/save`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      )
  },

  // Video guides
  videos: {
    get: (category?: string) => {
      const url = category ? `${API_BASE_URL}/videos?category=${category}` : `${API_BASE_URL}/videos`;
      return safeFetch(
        url, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      );
    },
    
    create: (videoData: { title: string; videoUrl: string; thumbnailUrl?: string; category: string }) => 
      safeFetch(
        `${API_BASE_URL}/videos`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(videoData)
        },
        async () => ({ _id: "v_" + Date.now(), ...videoData })
      ),
      
    like: (videoId: string) => 
      safeFetch(
        `${API_BASE_URL}/videos/${videoId}/like`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      ),
      
    view: (videoId: string) => 
      safeFetch(
        `${API_BASE_URL}/videos/${videoId}/view`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      )
  },

  // Peer mock panels
  collaboration: {
    getSessions: () => 
      safeFetch(
        `${API_BASE_URL}/collaboration/sessions`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      ),
      
    createSession: (sessionData: { role: string; dateTime: string; maxParticipants?: number; meetingLink: string }) => 
      safeFetch(
        `${API_BASE_URL}/collaboration/sessions`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(sessionData)
        },
        async () => ({ _id: "s_" + Date.now(), ...sessionData })
      ),
      
    joinSession: (sessionId: string) => 
      safeFetch(
        `${API_BASE_URL}/collaboration/sessions/${sessionId}/join`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      ),
      
    leaveSession: (sessionId: string) => 
      safeFetch(
        `${API_BASE_URL}/collaboration/sessions/${sessionId}/leave`, 
        {
          method: "POST",
          headers: getHeaders()
        },
        async () => ({ success: true })
      )
  },

  // Notifications
  notifications: {
    get: () => 
      safeFetch(
        `${API_BASE_URL}/notifications`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.notifications.get()
      ),
      
    markRead: (id: string) => 
      safeFetch(
        `${API_BASE_URL}/notifications/${id}`, 
        {
          method: "PUT",
          headers: getHeaders()
        },
        () => mockFallback.notifications.markRead()
      ),
      
    markAllRead: () => 
      safeFetch(
        `${API_BASE_URL}/notifications`, 
        {
          method: "PUT",
          headers: getHeaders()
        },
        () => mockFallback.notifications.markAllRead()
      )
  },

  // Company Placement Archives
  companies: {
    get: (params?: { search?: string; industry?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.industry && params.industry !== "All") query.append("industry", params.industry);
      return safeFetch(
        `${API_BASE_URL}/companies?${query.toString()}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      );
    },
    getBySlug: (slug: string) =>
      safeFetch(
        `${API_BASE_URL}/companies/${slug}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => null
      )
  },

  // Placement Applications Tracker
  applications: {
    get: () =>
      safeFetch(
        `${API_BASE_URL}/applications`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.applications.get()
      ),

    create: (data: any) =>
      safeFetch(
        `${API_BASE_URL}/applications`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data)
        },
        () => mockFallback.applications.create(data)
      ),

    update: (id: string, data: any) =>
      safeFetch(
        `${API_BASE_URL}/applications/${id}`, 
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(data)
        },
        () => mockFallback.applications.update(id, data)
      ),

    delete: (id: string) =>
      safeFetch(
        `${API_BASE_URL}/applications/${id}`, 
        {
          method: "DELETE",
          headers: getHeaders()
        },
        () => mockFallback.applications.delete(id)
      )
  },

  // Alumni Mentorship
  mentors: {
    get: (params?: { domain?: string }) => {
      const query = new URLSearchParams();
      if (params?.domain && params.domain !== "All") query.append("domain", params.domain);
      return safeFetch(
        `${API_BASE_URL}/mentors?${query.toString()}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => []
      );
    },

    book: (id: string, bookingData: { slotDate: string; topic?: string }) =>
      safeFetch(
        `${API_BASE_URL}/mentors/${id}/book`, 
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(bookingData)
        },
        async () => ({ success: true })
      )
  },

  // Live Job Board (LinkedIn & Indeed)
  jobs: {
    getAll: (params?: { q?: string; location?: string; source?: string; type?: string; batch?: string; level?: string; stream?: string }) => {
      const query = new URLSearchParams();
      if (params?.q) query.append("q", params.q);
      if (params?.location) query.append("location", params.location);
      if (params?.source && params.source !== "All") query.append("source", params.source);
      if (params?.type && params.type !== "All") query.append("type", params.type);
      if (params?.batch && params.batch !== "All") query.append("batch", params.batch);
      if (params?.level && params.level !== "All") query.append("level", params.level);
      if (params?.stream && params.stream !== "All") query.append("stream", params.stream);
      return safeFetch(
        `${API_BASE_URL}/jobs?${query.toString()}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        () => mockFallback.jobs.getAll()
      );
    },

    getById: (id: string) =>
      safeFetch(
        `${API_BASE_URL}/jobs/${id}`, 
        {
          method: "GET",
          headers: getHeaders()
        },
        async () => null
      )
  }
};
