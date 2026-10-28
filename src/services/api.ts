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

export const api = {
  // Authentication
  auth: {
    register: (userData: any) => 
      fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData)
      }).then(handleResponse),
      
    login: (credentials: any) => 
      fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      }).then(handleResponse),
      
    me: () => 
      fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Student Profiles & Dashboard
  profile: {
    get: (userId?: string) => 
      fetch(`${API_BASE_URL}/profile/${userId || ""}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    update: (profileData: any) => 
      fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      }).then(handleResponse),
      
    getDashboard: () => 
      fetch(`${API_BASE_URL}/profile/dashboard`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Resume Scanner & ATS Analyzer
  resume: {
    analyze: (formData: FormData) => 
      fetch(`${API_BASE_URL}/resume/analyze`, {
        method: "POST",
        headers: getHeaders(true), // Multi-part boundary header is injected automatically by browser
        body: formData
      }).then(handleResponse)
  },

  // Chat Career Assistant ("CareerGuide AI")
  chat: {
    sendMessage: (message: string, history: any[], profile: any) => 
      fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ message, history, profile })
      })
        .then(handleResponse)
        .then(data => data.reply)
  },

  // Interview Prep & Mock Interviews
  interview: {
    generateQuestions: (role: string, difficulty: string, type: string) => 
      fetch(`${API_BASE_URL}/interview/generate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ role, difficulty, type })
      }).then(handleResponse),
      
    evaluateAnswer: (question: string, answer: string) => 
      fetch(`${API_BASE_URL}/interview/evaluate`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ question, answer })
      }).then(handleResponse),
      
    saveAttempt: (attemptData: any) => 
      fetch(`${API_BASE_URL}/interview/attempt`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(attemptData)
      }).then(handleResponse),
      
    getHistory: () => 
      fetch(`${API_BASE_URL}/interview/history`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Communication Practice
  communication: {
    getTopics: () => 
      fetch(`${API_BASE_URL}/communication/topics`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    getVocabulary: () => 
      fetch(`${API_BASE_URL}/communication/vocabulary`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    evaluateIntro: (introductionText: string) => 
      fetch(`${API_BASE_URL}/communication/evaluate-intro`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ introductionText })
      }).then(handleResponse),
      
    evaluateSpeaking: (topic: string, answerText: string) => 
      fetch(`${API_BASE_URL}/communication/evaluate-speaking`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ topic, answerText })
      }).then(handleResponse),
      
    evaluateVocab: (word: string, meaning: string, studentSentence: string) => 
      fetch(`${API_BASE_URL}/communication/evaluate-vocab`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ word, meaning, studentSentence })
      }).then(handleResponse),
      
    getHistory: () => 
      fetch(`${API_BASE_URL}/communication/history`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Career Roadmaps
  roadmap: {
    get: (goal?: string) => 
      fetch(`${API_BASE_URL}/roadmap?goal=${goal || ""}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    toggleSkill: (skillName: string) => 
      fetch(`${API_BASE_URL}/roadmap/toggle`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ skillName })
      }).then(handleResponse)
  },

  // Community posts & Comments
  posts: {
    get: (params: { tag?: string; category?: string; isHubResource?: boolean }) => {
      const query = new URLSearchParams();
      if (params.tag) query.append("tag", params.tag);
      if (params.category) query.append("category", params.category);
      if (params.isHubResource !== undefined) query.append("isHubResource", String(params.isHubResource));
      
      return fetch(`${API_BASE_URL}/posts?${query.toString()}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse);
    },
    
    create: (postData: { content: string; tags?: string[]; isHubResource?: boolean; category?: string }) => 
      fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(postData)
      }).then(handleResponse),
      
    like: (postId: string) => 
      fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse),
      
    comment: (postId: string, content: string) => 
      fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ content })
      }).then(handleResponse),
      
    save: (postId: string) => 
      fetch(`${API_BASE_URL}/posts/${postId}/save`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Video guides
  videos: {
    get: (category?: string) => {
      const url = category ? `${API_BASE_URL}/videos?category=${category}` : `${API_BASE_URL}/videos`;
      return fetch(url, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse);
    },
    
    create: (videoData: { title: string; videoUrl: string; thumbnailUrl?: string; category: string }) => 
      fetch(`${API_BASE_URL}/videos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(videoData)
      }).then(handleResponse),
      
    like: (videoId: string) => 
      fetch(`${API_BASE_URL}/videos/${videoId}/like`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse),
      
    view: (videoId: string) => 
      fetch(`${API_BASE_URL}/videos/${videoId}/view`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Peer mock panels
  collaboration: {
    getSessions: () => 
      fetch(`${API_BASE_URL}/collaboration/sessions`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    createSession: (sessionData: { role: string; dateTime: string; maxParticipants?: number; meetingLink: string }) => 
      fetch(`${API_BASE_URL}/collaboration/sessions`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(sessionData)
      }).then(handleResponse),
      
    joinSession: (sessionId: string) => 
      fetch(`${API_BASE_URL}/collaboration/sessions/${sessionId}/join`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse),
      
    leaveSession: (sessionId: string) => 
      fetch(`${API_BASE_URL}/collaboration/sessions/${sessionId}/leave`, {
        method: "POST",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Notifications
  notifications: {
    get: () => 
      fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),
      
    markRead: (id: string) => 
      fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "PUT",
        headers: getHeaders()
      }).then(handleResponse),
      
    markAllRead: () => 
      fetch(`${API_BASE_URL}/notifications`, {
        method: "PUT",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Company Placement Archives
  companies: {
    get: (params?: { search?: string; industry?: string }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append("search", params.search);
      if (params?.industry && params.industry !== "All") query.append("industry", params.industry);
      return fetch(`${API_BASE_URL}/companies?${query.toString()}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse);
    },
    getBySlug: (slug: string) =>
      fetch(`${API_BASE_URL}/companies/${slug}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Placement Applications Tracker
  applications: {
    get: () =>
      fetch(`${API_BASE_URL}/applications`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse),

    create: (data: any) =>
      fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    update: (id: string, data: any) =>
      fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data)
      }).then(handleResponse),

    delete: (id: string) =>
      fetch(`${API_BASE_URL}/applications/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      }).then(handleResponse)
  },

  // Alumni Mentorship
  mentors: {
    get: (params?: { domain?: string }) => {
      const query = new URLSearchParams();
      if (params?.domain && params.domain !== "All") query.append("domain", params.domain);
      return fetch(`${API_BASE_URL}/mentors?${query.toString()}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse);
    },

    book: (id: string, bookingData: { slotDate: string; topic?: string }) =>
      fetch(`${API_BASE_URL}/mentors/${id}/book`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(bookingData)
      }).then(handleResponse)
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
      return fetch(`${API_BASE_URL}/jobs?${query.toString()}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse);
    },

    getById: (id: string) =>
      fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "GET",
        headers: getHeaders()
      }).then(handleResponse)
  }
};

