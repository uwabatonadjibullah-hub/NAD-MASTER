import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Define the secret to be used in the function
const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const chatWithGemini = onCall(
  {
    secrets: [geminiApiKey],
    region: "us-central1", // Adjust to your preferred region
    cors: true,
  },
  async (request: CallableRequest) => {
    // 1. Basic Authentication Check
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    const { prompt, systemInstruction, history, tools } = request.data;

    if (!prompt) {
      throw new HttpsError("invalid-argument", "The function must be called with a 'prompt'.");
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey.value());
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: systemInstruction,
        tools: tools,
        safetySettings: [
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
        ],
      });

      const chat = model.startChat({
        history: history || [],
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      return {
        text: response.text(),
        functionCalls: response.functionCalls ? response.functionCalls() : null,
      };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new HttpsError("internal", "Failed to get response from Gemini AI.");
    }
  }
);
