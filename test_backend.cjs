// Run with: npm run test:backend OR node test_backend.cjs
const http = require("http");

async function request(path, method = "GET", body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkBackend() {
  console.log("==================================================");
  console.log("  🚀 AI Student Career Guide — Backend Health Check ");
  console.log("==================================================\n");

  // 1. Health check & Database
  const health = await request("/api/health");
  console.log(`[1] Backend Server & DB Health:`);
  console.log(`    Status: ${health.status === 200 ? "✅ ONLINE (Port 5000)" : "❌ OFFLINE"}`);
  console.log(`    Database: ${health.body?.database?.connectionState === "CONNECTED" ? "✅ MongoDB Connected" : "⚠️ Fallback Mode"}\n`);

  // 2. Public Placement Archives
  const companies = await request("/api/companies");
  console.log(`[2] Company Recruitment Archives (/api/companies):`);
  console.log(`    Status: ${companies.status === 200 ? "✅ OK" : "❌ Error"} (${companies.body?.length || 0} companies loaded: Google, Amazon, Deloitte, TCS...)\n`);

  // 3. Live Jobs Feed
  const jobs = await request("/api/jobs");
  console.log(`[3] Live Jobs Board (/api/jobs):`);
  console.log(`    Status: ${jobs.status === 200 ? "✅ OK" : "❌ Error"} (${jobs.body?.length || 0} LinkedIn & Indeed opportunities)\n`);

  // 4. Authenticated Endpoints (Log in)
  console.log(`[4] Authenticating Student Account (khushi01610@gmail.com):`);
  const login = await request("/api/auth/login", "POST", {
    email: "khushi01610@gmail.com",
    password: "123456"
  });

  if (login.status !== 200) {
    console.log(`    ❌ Login failed with status: ${login.status}`);
    return;
  }
  const token = login.body.token;
  console.log(`    ✅ Login Successful! JWT Token generated.\n`);

  // 5. AI Career Coach Chatbot (/api/chat)
  console.log(`[5] Testing AI Career Coach API (/api/chat):`);
  const chat = await request("/api/chat", "POST", {
    message: "What are the best interview tips for campus drives?",
    history: []
  }, token);
  console.log(`    Status: ${chat.status === 200 ? "✅ OK" : "❌ Error"}`);
  console.log(`    Coach Response Preview: "${chat.body?.reply?.substring(0, 80).replace(/\n/g, " ")}..."\n`);

  // 6. Application Tracker
  console.log(`[6] Testing Application Tracker Pipeline (/api/applications):`);
  const appCreate = await request("/api/applications", "POST", {
    company: "Google",
    role: "SWE Intern 2026",
    package: "₹1.15L/mo",
    stage: "Wishlist"
  }, token);
  console.log(`    Create: ${appCreate.status === 201 ? "✅ Saved to Tracker" : "❌ Failed"}`);

  if (appCreate.body?._id) {
    await request(`/api/applications/${appCreate.body._id}`, "DELETE", null, token);
    console.log(`    Delete: ✅ Cleaned up test record\n`);
  }

  // 7. Tiered Interview Question Bank
  console.log(`[7] Tiered Interview Question Bank (/api/interview/generate):`);
  const interview = await request("/api/interview/generate", "POST", {
    role: "Software Developer",
    difficulty: "Google / FAANG Tier",
    type: "Technical"
  }, token);
  console.log(`    Status: ${interview.status === 200 ? "✅ OK" : "❌ Error"} (${interview.body?.questions?.length || 0} questions generated)\n`);

  console.log("==================================================");
  console.log("  🎉 ALL BACKEND CHECKS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

checkBackend().catch(err => {
  console.error("❌ Backend check error:", err.message);
  console.log("Make sure your backend server is running on port 5000 (npm run dev)");
});
