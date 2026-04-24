"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithGemini = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const generative_ai_1 = require("@google/generative-ai");
// Define the secret to be used in the function
const geminiApiKey = (0, params_1.defineSecret)("GEMINI_API_KEY");
exports.chatWithGemini = (0, https_1.onCall)({
    secrets: [geminiApiKey],
    region: "us-central1", // Adjust to your preferred region
    cors: true,
}, async (request) => {
    // 1. Basic Authentication Check
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const { prompt, systemInstruction, history, tools } = request.data;
    if (!prompt) {
        throw new https_1.HttpsError("invalid-argument", "The function must be called with a 'prompt'.");
    }
    try {
        const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey.value());
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            systemInstruction: systemInstruction,
            tools: tools,
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
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
    }
    catch (error) {
        console.error("Gemini API Error:", error);
        throw new https_1.HttpsError("internal", "Failed to get response from Gemini AI.");
    }
});
//# sourceMappingURL=index.js.map