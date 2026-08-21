import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json() as any);

// Initialize Gemini Client with proper header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  })
  : null;

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "DavaSync Command Center",
    hasGeminiKey: !!apiKey,
    timestamp: new Date().toISOString(),
  });
});

// AI Matchmaking Endpoint
app.post("/api/matchmaking", async (req, res) => {
  try {
    const { startup, investor } = req.body;

    if (!startup || !investor) {
      return res.status(400).json({ error: "Startup and Investor profiles are required" });
    }

    if (!ai) {
      // Fallback structured analysis if key is not configured
      const sectorMatch = investor.targetSectors?.some((s: string) =>
        s.toLowerCase().includes(startup.sector?.toLowerCase() || "")
      );
      const score = sectorMatch ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 20) + 70;

      return res.json({
        matching_score: score,
        reason: `${startup.name}'s ${startup.sector} platform aligns well with ${investor.firm}'s investment scope. The ${startup.stage} stage matches their ticket size of ${investor.ticketSizeRange}.`,
        ice_breakers: [
          `What are ${startup.name}'s key moats against regional competitors in SEA?`,
          `How does the ask of ${startup.targetAsk} support your growth trajectory over the next 18 months?`,
          `What synergies do you see with ${investor.firm}'s current portfolio network?`,
        ],
      });
    }

    const prompt = `
Startup Profile:
- Name: ${startup.name}
- Sector: ${startup.sector}
- Stage: ${startup.stage}
- Target Ask: ${startup.targetAsk}
- Valuation: ${startup.valuation}
- Tagline: ${startup.tagline}
- Description: ${startup.description}
- Key Tags: ${startup.keyTags?.join(", ")}

Investor Profile:
- Name: ${investor.name} (${investor.firm})
- Target Sectors: ${investor.targetSectors?.join(", ")}
- Preferred Stages: ${investor.preferredStages?.join(", ")}
- Ticket Size Range: ${investor.ticketSizeRange}
- Investment Philosophy: ${investor.investmentPhilosophy}

Task:
Analyze the match quality between this Startup and Investor for DAVAS 2026.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a Senior Venture Capital Analyst at the Da Nang Venture and Angel Summit (DAVAS). Your task is to evaluate the match suitability between a Startup and an Investor/VC. You MUST evaluate Sector, Stage, Ticket Size, and Investment Philosophy. Respond with strict JSON matching the schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matching_score: {
              type: Type.NUMBER,
              description: "Compatibility score from 0 to 100",
            },
            reason: {
              type: Type.STRING,
              description: "Concise analytical paragraph (under 50 words) explaining why they are compatible or not",
            },
            ice_breakers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 sharp, engaging ice breaker questions for their 1:1 meeting",
            },
          },
          required: ["matching_score", "reason", "ice_breakers"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    return res.json(result);
  } catch (error: any) {
    console.error("Matchmaking API error:", error);
    return res.status(500).json({
      matching_score: 88,
      reason: "High strategic synergy based on sector alignment and early-stage capital requirements.",
      ice_breakers: [
        "What is your primary go-to-market driver for 2026?",
        "How do you plan to leverage our regional VC network?",
        "What are your unit economics targets post-round?",
      ],
      error: error.message,
    });
  }
});

// AI Follow-up Draft Endpoint
app.post("/api/ai-followup", async (req, res) => {
  try {
    const { startup, investor, userNotes } = req.body;

    if (!startup || !userNotes) {
      return res.status(400).json({ error: "Startup and user notes are required" });
    }

    if (!ai) {
      return res.json({
        emailSubject: `DAVAS 2026 1:1 Follow-up: ${investor?.firm || "VC Partner"} x ${startup.name}`,
        emailBody: `Dear ${startup.founderName},\n\nThank you for meeting with us at DAVAS 2026! We were impressed by ${startup.name}'s traction in ${startup.sector}.\n\nNotes from our discussion:\n"${userNotes}"\n\nLet's keep in touch as we review materials internally.\n\nBest regards,\n${investor?.name || "DAVAS VC Delegate"}`,
        keyTakeaways: [
          `Demonstrated strong market demand in ${startup.sector}`,
          `User note highlight: ${userNotes.slice(0, 80)}...`,
        ],
        actionItems: [
          "Share pitch deck and financial model with investment team",
          "Schedule 30-minute follow-up call next week",
        ],
      });
    }

    const prompt = `
Startup: ${startup.name} (${startup.sector}, ${startup.stage}, Ask: ${startup.targetAsk})
Founder: ${startup.founderName} (${startup.founderTitle})
Investor Firm: ${investor?.firm || "DAVAS Capital Partner"}
Investor Representative: ${investor?.name || "VC Principal"}

Meeting Notes Taken by VC:
"${userNotes}"

Generate a polished follow-up package for the VC to send to the startup after their 1:1 meeting at DAVAS.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are an executive VC AI Assistant at DAVAS. Generate a highly tailored follow-up email and key takeaways based on the startup profile and notes taken during the 1:1 summit meeting.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emailSubject: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            actionItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["emailSubject", "emailBody", "keyTakeaways", "actionItems"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const result = JSON.parse(jsonText);
    return res.json(result);
  } catch (error: any) {
    console.error("AI Follow-up API error:", error);
    return res.status(500).json({
      emailSubject: `DAVAS 1:1 Follow-up`,
      emailBody: `Thank you for taking the time to meet with us at DAVAS 2026. We look forward to reviewing your materials.`,
      keyTakeaways: ["Key meeting notes logged successfully."],
      actionItems: ["Follow up via email with pitch deck."],
    });
  }
});

// DAVAS 2026 Fallback Seed Data
const FALLBACK_STARTUPS = [
  {
    "Startup Name": "MedixAI Vietnam",
    "Primary Industry": "AI & HealthTech",
    "Current Funding Stage": "Seed",
    "Target Funding Amount in USD": "$800,000",
    "Representative Name": "Dr. Nguyen Huu Phuc",
    "Email Address": "phuc.nguyen@medixai.vn",
    "Description": "AI-driven ultrasound diagnostic assistant for Tier-2/3 regional hospitals.",
    "metrics": { "mrr": "$28K", "arr": "$336K", "growthRate": "+18% MoM", "usersCount": "45+ Clinics" }
  },
  {
    "Startup Name": "EcoPack SEA",
    "Primary Industry": "GreenTech & Sustainability",
    "Current Funding Stage": "Seed",
    "Target Funding Amount in USD": "$500,000",
    "Representative Name": "Tran Thi Mai Anh",
    "Email Address": "maianh@ecopack.asia",
    "Description": "Biodegradable seaweed-based packaging solutions replacing single-use plastics.",
    "metrics": { "mrr": "$35K", "arr": "$420K", "growthRate": "+24% MoM", "usersCount": "28 F&B Brands" }
  },
  {
    "Startup Name": "AgriDrone Da Nang",
    "Primary Industry": "AgriTech & Robotics",
    "Current Funding Stage": "Pre-Seed",
    "Target Funding Amount in USD": "$350,000",
    "Representative Name": "Le Quang Huy",
    "Email Address": "huy.le@agridrone.vn",
    "Description": "Precision agriculture drones with multispectral crop health analytics for Central Vietnam.",
    "metrics": { "mrr": "$14K", "arr": "$168K", "growthRate": "+30% MoM", "usersCount": "1,200 Hectares" }
  },
  {
    "Startup Name": "FinFlow Asia",
    "Primary Industry": "FinTech & B2B SaaS",
    "Current Funding Stage": "Series A",
    "Target Funding Amount in USD": "$2,500,000",
    "Representative Name": "Pham Minh Tuan",
    "Email Address": "tuan.pham@finflow.asia",
    "Description": "Automated cross-border treasury management and FX risk hedging for ASEAN exporters.",
    "metrics": { "mrr": "$110K", "arr": "$1.32M", "growthRate": "+15% MoM", "usersCount": "180 Exporters" }
  },
  {
    "Startup Name": "LogiSense Logistics",
    "Primary Industry": "Smart Logistics & IoT",
    "Current Funding Stage": "Seed",
    "Target Funding Amount in USD": "$600,000",
    "Representative Name": "Vo Hoang Nam",
    "Email Address": "nam.vo@logisense.io",
    "Description": "Real-time cold-chain IoT tracking and predictive dispatching for seaports.",
    "metrics": { "mrr": "$22K", "arr": "$264K", "growthRate": "+21% MoM", "usersCount": "45 Fleets" }
  },
  {
    "Startup Name": "EduVibe Interactive",
    "Primary Industry": "EdTech & AI",
    "Current Funding Stage": "Pre-Seed",
    "Target Funding Amount in USD": "$300,000",
    "Representative Name": "Dang Thu Trang",
    "Email Address": "trang.dang@eduvibe.edu.vn",
    "Description": "Hyper-personalized adaptive STEM learning platform with gamified simulation labs for K-12.",
    "metrics": { "mrr": "$12K", "arr": "$144K", "growthRate": "+28% MoM", "usersCount": "15,000 Students" }
  },
  {
    "Startup Name": "CyberShield ASEAN",
    "Primary Industry": "Cybersecurity & Cloud",
    "Current Funding Stage": "Series A",
    "Target Funding Amount in USD": "$3,200,000",
    "Representative Name": "Nguyen Van Dat",
    "Email Address": "dat.nguyen@cybershield.sg",
    "Description": "Zero-trust cloud compliance and autonomous threat mitigation for regional banks.",
    "metrics": { "mrr": "$145K", "arr": "$1.74M", "growthRate": "+19% MoM", "usersCount": "14 Enterprise Clients" }
  },
  {
    "Startup Name": "Solaris Smart Grid",
    "Primary Industry": "CleanTech & Renewable Energy",
    "Current Funding Stage": "Seed",
    "Target Funding Amount in USD": "$1,200,000",
    "Representative Name": "Hoang Duc Minh",
    "Email Address": "minh.hoang@solaristech.vn",
    "Description": "Decentralized microgrid management and virtual power plants for industrial factories.",
    "metrics": { "mrr": "$48K", "arr": "$576K", "growthRate": "+25% MoM", "usersCount": "8 Industrial Parks" }
  }
];

const FALLBACK_INVESTORS = [
  {
    "Representative Name": "Marcus Tran",
    "Investor or Fund Name": "Dragon Capital Ventures",
    "Email Address": "marcus.tran@dragoncapital.com",
    "Investment Sectors of Interest": "FinTech & B2B SaaS, Tech & AI, Cybersecurity & Cloud, CleanTech",
    "Current Funding Stage": "Seed, Series A, Series B",
    "preferredStages": ["Seed", "Series A", "Series B"],
    "Maximum Ticket Size (USD)": "$3,000,000",
    "ticketSizeRange": "$500K - $3M",
    "Investment Philosophy / Thesis": "Backing category-defining tech companies with strong unit economics and proven regional scalability across Southeast Asia.",
    "totalDeals": 34,
    "country": "Vietnam / UK"
  },
  {
    "Representative Name": "Le Thi Bich Ngoc",
    "Investor or Fund Name": "Da Nang Angel Network (DAN)",
    "Email Address": "ngoc.le@danangangels.vn",
    "Investment Sectors of Interest": "AI & HealthTech, AgriTech & Robotics, GreenTech & Sustainability, EdTech & AI",
    "Current Funding Stage": "Pre-Seed, Seed",
    "preferredStages": ["Pre-Seed", "Seed"],
    "Maximum Ticket Size (USD)": "$400,000",
    "ticketSizeRange": "$50K - $400K",
    "Investment Philosophy / Thesis": "Empowering visionary local founders in Central Vietnam with early catalytic capital, mentorship, and municipal government tie-ups.",
    "totalDeals": 19,
    "country": "Vietnam"
  },
  {
    "Representative Name": "Hoang Tuan Anh",
    "Investor or Fund Name": "VinaCapital Ventures",
    "Email Address": "tuananh.hoang@vinacapital.com",
    "Investment Sectors of Interest": "FinTech & B2B SaaS, AI & HealthTech, Cybersecurity & Cloud, Smart Logistics & IoT",
    "Current Funding Stage": "Seed, Series A, Series B",
    "preferredStages": ["Seed", "Series A", "Series B"],
    "Maximum Ticket Size (USD)": "$5,000,000",
    "ticketSizeRange": "$1M - $5M",
    "Investment Philosophy / Thesis": "Investing in market leaders modernizing traditional industry verticals through artificial intelligence, automation, and enterprise SaaS.",
    "totalDeals": 42,
    "country": "Vietnam / Singapore"
  },
  {
    "Representative Name": "Emily Nguyen",
    "Investor or Fund Name": "Ascend Vietnam Ventures (AVV)",
    "Email Address": "emily@avv.st",
    "Investment Sectors of Interest": "Tech & AI, AI & HealthTech, EdTech & AI, FinTech & B2B SaaS",
    "Current Funding Stage": "Pre-Seed, Seed",
    "preferredStages": ["Pre-Seed", "Seed"],
    "Maximum Ticket Size (USD)": "$1,000,000",
    "ticketSizeRange": "$200K - $1M",
    "Investment Philosophy / Thesis": "High-conviction seed investing in globally ambitious founders building from Vietnam for the world.",
    "totalDeals": 28,
    "country": "Vietnam / USA"
  },
  {
    "Representative Name": "David Chen",
    "Investor or Fund Name": "Mekong Green Impact Fund",
    "Email Address": "david.chen@mekonggreen.sg",
    "Investment Sectors of Interest": "GreenTech & Sustainability, AgriTech & Robotics, CleanTech & Renewable Energy",
    "Current Funding Stage": "Seed, Series A",
    "preferredStages": ["Seed", "Series A"],
    "Maximum Ticket Size (USD)": "$1,500,000",
    "ticketSizeRange": "$300K - $1.5M",
    "Investment Philosophy / Thesis": "Focused exclusively on high-impact climate tech, decarbonization, circular economy, and regenerative agriculture across the Mekong subregion.",
    "totalDeals": 22,
    "country": "Singapore"
  },
  {
    "Representative Name": "Kenji Takahashi",
    "Investor or Fund Name": "CyberAgent Capital",
    "Email Address": "takahashi@cyberagent.co.jp",
    "Investment Sectors of Interest": "Tech & AI, Smart Logistics & IoT, FinTech & B2B SaaS, Cybersecurity & Cloud",
    "Current Funding Stage": "Seed, Series A",
    "preferredStages": ["Seed", "Series A"],
    "Maximum Ticket Size (USD)": "$2,000,000",
    "ticketSizeRange": "$500K - $2M",
    "Investment Philosophy / Thesis": "Early growth venture partner providing bridge networks between Vietnam, Japan, and broader Asian digital ecosystems.",
    "totalDeals": 50,
    "country": "Japan / Vietnam"
  }
];

// Cache & Server Pre-warming for instant data retrieval
let cachedSheetsData: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // Cache 60s

// Hàm tự động tải sẵn dữ liệu ngay khi Server khởi động
async function prewarmSheetsData() {
  const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL?.trim();
  if (!sheetsApiUrl) return;
  try {
    const response = await fetch(sheetsApiUrl, {
      headers: { "Accept": "application/json" },
      redirect: "follow",
    });
    if (response.ok) {
      cachedSheetsData = await response.json();
      lastCacheTime = Date.now();
      console.log("⚡ [DAVAS] Pre-warmed Google Sheets cache successfully!");
    }
  } catch (err: any) {
    console.warn("Prewarm notice:", err.message);
  }
}

// Google Sheets Data Endpoint
app.get("/api/data", async (_req, res) => {
  const now = Date.now();
  if (cachedSheetsData && (now - lastCacheTime < CACHE_TTL_MS)) {
    return res.json(cachedSheetsData);
  }

  // Nếu chưa có hoặc hết hạn thì fetch mới và cập nhật cache
  const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL?.trim();
  if (!sheetsApiUrl) {
    return res.json({ startups: FALLBACK_STARTUPS, investors: FALLBACK_INVESTORS, matches: [] });
  }

  try {
    const response = await fetch(sheetsApiUrl, {
      headers: { "Accept": "application/json" },
      redirect: "follow",
    });
    if (response.ok) {
      cachedSheetsData = await response.json();
      lastCacheTime = Date.now();
      return res.json(cachedSheetsData);
    }
  } catch (e) { }

  return res.json(cachedSheetsData || { startups: FALLBACK_STARTUPS, investors: FALLBACK_INVESTORS, matches: [] });
});

// Save Match to Google Sheets Endpoint
app.post("/api/matches", async (req, res) => {
  try {
    const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL?.trim();

    const { startup, investor, analysis, recommendedTable, id } = req.body;

    if (!startup || !investor || !analysis) {
      return res.status(400).json({ error: "Missing required match fields" });
    }

    if (!sheetsApiUrl) {
      return res.json({ status: "ok", localOnly: true, message: "GOOGLE_SHEETS_API_URL not configured" });
    }

    const payload = {
      action: "save_match",
      id: id || `mp-${Date.now()}`,
      startupName: startup.name,
      founderName: startup.founderName || "",
      startupEmail: startup.id || "",
      startupSector: startup.sector || "",
      startupStage: startup.stage || "",
      targetAsk: startup.targetAsk || "",
      investorFirm: investor.firm || "",
      investorName: investor.name || "",
      investorEmail: investor.id || "",
      score: analysis.matching_score || 0,
      reason: analysis.reason || "",
      iceBreakers: analysis.ice_breakers || [],
      table: recommendedTable || "Table A1",
    };

    try {
      const response = await fetch(sheetsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (!response.ok) {
        console.warn(`Google Sheets save_match status: ${response.status}`);
        return res.json({ status: "ok", localOnly: true, warning: `Sheets responded with ${response.status}` });
      }

      const data = await response.json().catch(() => ({ status: "ok" }));
      return res.json(data);
    } catch (netErr: any) {
      console.warn("Google Sheets save_match network warning:", netErr.message);
      return res.json({ status: "ok", localOnly: true });
    }
  } catch (error: any) {
    console.warn("Google Sheets save_match error:", error);
    return res.json({ status: "ok", localOnly: true });
  }
});

// Google Calendar & Schedule Trigger / Update Endpoint
app.post("/api/schedule", async (req, res) => {
  try {
    const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL?.trim();

    const { schedule, ...rest } = req.body;

    if (!sheetsApiUrl) {
      return res.json({ status: "ok", localOnly: true, message: "GOOGLE_SHEETS_API_URL not configured" });
    }

    const payload = schedule
      ? {
        action: "update_schedule",
        schedule: schedule.map((slot: any) => ({
          startupName: slot.startupName || slot.startup?.name || "",
          investorFirm: slot.investorFirm || slot.investor?.firm || "",
          time: slot.time || "",
          table: slot.table || slot.assignedTable || "",
        })),
      }
      : {
        action: "trigger_schedule",
        ...rest,
      };

    try {
      const response = await fetch(sheetsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (!response.ok) {
        console.warn(`Google Sheets schedule status: ${response.status}`);
        return res.json({ status: "ok", localOnly: true, warning: `Sheets responded with ${response.status}` });
      }

      const data = await response.json().catch(() => ({ status: "ok" }));
      return res.json(data);
    } catch (netErr: any) {
      console.warn("Google Sheets schedule network warning:", netErr.message);
      return res.json({ status: "ok", localOnly: true });
    }
  } catch (error: any) {
    console.warn("Google Sheets schedule error:", error);
    return res.json({ status: "ok", localOnly: true });
  }
});

// Save Follow-up & Meeting Notes to Google Sheets
app.post("/api/followup", async (req, res) => {
  try {
    const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL?.trim();
    const { startupName, investorFirm, notes, followUpGenerated } = req.body;

    if (!sheetsApiUrl) {
      return res.json({ status: "ok", localOnly: true, message: "GOOGLE_SHEETS_API_URL not configured" });
    }

    const payload = {
      action: "save_followup",
      startupName,
      investorFirm,
      notes,
      followUpGenerated,
    };

    try {
      const response = await fetch(sheetsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      if (!response.ok) {
        console.warn(`Google Sheets save_followup status: ${response.status}`);
        return res.json({ status: "ok", localOnly: true, warning: `Sheets responded with ${response.status}` });
      }

      const data = await response.json().catch(() => ({ status: "ok" }));
      return res.json(data);
    } catch (netErr: any) {
      console.warn("Save follow-up network warning:", netErr.message);
      return res.json({ status: "ok", localOnly: true });
    }
  } catch (err: any) {
    console.warn("Save follow-up handler error:", err);
    return res.json({ status: "ok", localOnly: true });
  }
});

// Vite Development or Production Static Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares as any);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath) as any);
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`DavaSync Full-Stack Server running on http://0.0.0.0:${PORT}`);
    // Run pre-warming in background
    prewarmSheetsData();
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
    } else {
      console.error("Server error:", err);
    }
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
