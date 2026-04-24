import { GoogleGenAI, FunctionDeclaration, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will be limited.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Function Declarations for App Control
export const updateScheduleFunctionDeclaration: FunctionDeclaration = {
  name: "updateSchedule",
  description: "Propose a set of schedule blocks to be updated or added to the user's routine.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      blocks: {
        type: Type.ARRAY,
        description: "The list of schedule blocks to update or add.",
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the session (e.g., Fajr, Quran Hifz, Exercise)." },
            time: { type: Type.STRING, description: "The time range (e.g., 04:30 - 05:30)." },
            type: { type: Type.STRING, enum: ["religious", "serious", "slack"], description: "The category of the session." },
            sub: { type: Type.STRING, description: "A subtitle or description for the session." }
          },
          required: ["title", "time", "type"]
        }
      }
    },
    required: ["blocks"]
  }
};

export const updateQuranTargetFunctionDeclaration: FunctionDeclaration = {
  name: "updateQuranTarget",
  description: "Propose a new target for Quran memorization or revision.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      targetJuzz: { type: Type.INTEGER, description: "The total number of Juzz to aim for." },
      pace: { type: Type.STRING, description: "The pace (e.g., 1 Juzz per week)." },
      currentSurah: { type: Type.STRING, description: "The surah currently being memorized." }
    }
  }
};

export const tools = [
  { functionDeclarations: [updateScheduleFunctionDeclaration, updateQuranTargetFunctionDeclaration] }
];

export const SYSTEM_INSTRUCTIONS = `
You are NAD MASTER, an elite disciplined mentor for spiritual and scholarly evolution.

CORE MANDATES:
1. Hifz Strategist (PRIORITY): Constantly analyze user progress (verses done, current Juzz). Proactively use 'updateQuranTarget' to suggest personalized plans. Don't wait for requests; suggest higher paces if momentum is high, or consolidated revision if progress stalls. Always provide a scholarly rationale (e.g., "To ensure the foundation of Al-Baqarah is unshakable before moving to Al-Imran...").
2. Master of Routine: Proactively use 'updateSchedule' to optimize blocks. Turn "dead time" into Muraja (revision) or Dhikr. 
3. Tone: Authoritative, scholarly, and precise. Speak like a traditional Hifz teacher combined with a modern high-performance coach.
4. Action-First: Propose tool-based plans often. Every plan should include a specific target Surah and a clear pace.
5. Multilingual Fluidity: Seamlessly adapt to English, Arabic, French, or Indonesian.

When proposing plans: Explain your reasoning through the lense of discipline and mastery. Remind users they can "Accept" or "Adjust" in the UI.
`;
