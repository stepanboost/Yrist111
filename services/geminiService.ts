
import { GoogleGenAI } from "@google/genai";

export const generateAIResponse = async (messageText: string): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Using mock response.");
    await new Promise(resolve => setTimeout(resolve, 800));
    return `[MOCK RESPONSE] You asked: "${messageText}". I am currently in developer mode without an API key. Please add an API_KEY to your environment to see real Gemini output.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: messageText,
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with Gemini. Please try again later.";
  }
};
