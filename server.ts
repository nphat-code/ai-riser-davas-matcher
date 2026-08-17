import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

// Google Sheets Data Endpoint
app.get("/api/data", async (_req, res) => {
  try {
    const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL;
    if (!sheetsApiUrl) {
      return res.status(500).json({
        error: "GOOGLE_SHEETS_API_URL environment variable is not configured",
      });
    }

    const response = await fetch(sheetsApiUrl);
    if (!response.ok) {
      throw new Error(`Google Sheets API responded with status ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.error("Google Sheets API fetch error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch data from Google Sheets",
    });
  }
});

// Google Calendar & Schedule Trigger Endpoint
app.post("/api/schedule", async (req, res) => {
  try {
    const sheetsApiUrl = process.env.GOOGLE_SHEETS_API_URL;
    if (!sheetsApiUrl) {
      return res.status(500).json({
        error: "GOOGLE_SHEETS_API_URL environment variable is not configured",
      });
    }

    const payload = {
      action: "trigger_schedule",
      ...req.body,
    };

    const response = await fetch(sheetsApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({ status: "ok" }));
    return res.json(data);
  } catch (error: any) {
    console.error("Google Sheets trigger_schedule error:", error);
    return res.status(500).json({
      error: error.message || "Failed to trigger schedule on Google Apps Script",
    });
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DavaSync Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
