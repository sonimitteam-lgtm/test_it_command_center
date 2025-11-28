import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateAIInsight = async (prompt: string, contextData: string): Promise<string> => {
  if (!apiKey) {
    return "API Key not configured. Please set process.env.API_KEY.";
  }

  try {
    const fullPrompt = `
      You are an advanced IT Command Center Assistant. 
      Analyze the following context data and answer the user's prompt.
      Be concise, professional, and actionable.
      
      Context Data:
      ${contextData}

      User Prompt:
      ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate insight. Please try again later.";
  }
};
