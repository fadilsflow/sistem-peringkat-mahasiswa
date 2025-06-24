import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function getGeminiResponse(messages: Message[]) {
  try {
    // Convert chat history to context string
    const context = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Add system prompt for academic analysis
    const systemPrompt = `You are an AI academic advisor analyzing student performance data using the SAW (Simple Additive Weighting) method. 
    You have access to student data including academic scores, attendance, academic achievements, non-academic achievements, behavior, and organizational activity.
    Please provide detailed analysis and insights based on the data.
    
    Current chat context:
    ${context}
    
    Assistant: `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw new Error("Failed to get AI response");
  }
}
