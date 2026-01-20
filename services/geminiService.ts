
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export const generateAIResponseStream = async (
  messageText: string, 
  fileParts: FilePart[] = [],
  onChunk: (text: string) => void
): Promise<void> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("No API Key found. Using mock simulation.");
    const mockText = "⚖️ **Анализ ситуации:**\n\n1. Настройки модели успешно подгружены из `nastroiks.ts`.\n2. Вы находитесь в режиме разработки.\n\n--- \n\n*Это симуляция ответа ИИ.*";
    const chunks = mockText.split(" ");
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onChunk(chunk + " ");
    }
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const contents = fileParts.length > 0 
      ? { parts: [...fileParts, { text: messageText }] }
      : { parts: [{ text: messageText }] };

    const stream = await ai.models.generateContentStream({
      model: MODEL_CONFIG.model,
      contents: contents,
      config: {
        systemInstruction: MODEL_CONFIG.systemInstruction,
        temperature: MODEL_CONFIG.temperature,
        topP: MODEL_CONFIG.topP,
        topK: MODEL_CONFIG.topK,
        maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
      }
    });

    for await (const chunk of stream) {
      const response = chunk as GenerateContentResponse;
      if (response.text) {
        onChunk(response.text);
      }
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    onChunk("\n\n❌ **Ошибка соединения.** Пожалуйста, проверьте API ключ или подключение.");
  }
};
