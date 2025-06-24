import { GoogleGenAI } from "@google/genai";
import {
  getNormalizedSAWData,
  formatSAWDataForAI,
} from "@/lib/utils/saw-helper";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getGeminiResponse(
  messages: Message[],
  periodeId?: string,
  userId?: string
) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get SAW data
    const sawData = await getNormalizedSAWData(periodeId, userId);
    const sawContext = formatSAWDataForAI(sawData);

    // Add SAW data as system context
    const systemContext: Message = {
      role: "system",
      content: sawContext,
    };

    // Combine system context with user messages
    const fullContext = [systemContext, ...messages]
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n\n");

    // Add system prompt for precise analysis in Bahasa Indonesia
    const systemPrompt = `Anda adalah asisten analisis akademik yang memberikan jawaban singkat, padat, dan akurat.

ATURAN PENTING:
1. Berikan jawaban langsung dan to the point
2. Gunakan poin-poin untuk informasi terstruktur
3. Sertakan angka/statistik spesifik
4. Maksimal 3-4 paragraf untuk analisis
5. Fokus pada data yang relevan dengan pertanyaan
6. Selalu dalam Bahasa Indonesia formal

Format jawaban:
1. Jawaban langsung (1 kalimat)
2. Detail penting (poin-poin)
3. Kesimpulan singkat (opsional)

Konteks data:
${fullContext}

A: `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text;
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw error;
  }
}
