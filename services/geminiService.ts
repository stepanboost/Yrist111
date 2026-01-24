
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface AIResponse {
  content: string;
  reasoning?: string;
}

// URL для Netlify Function
const CHAT_API_URL = "/.netlify/functions/chat";

export const generateAIResponseStream = async (
  messageText: string, 
  fileParts: FilePart[] = [],
  onChunk: (text: string, reasoning?: string) => void
): Promise<void> => {
  
  try {
    // Подготовка контента с файлами (если есть)
    let content: any[] = [];
    
    if (fileParts.length > 0) {
      for (const part of fileParts) {
        content.push({
          type: "image_url",
          image_url: {
            url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
          }
        });
      }
    }
    
    content.push({
      type: "text",
      text: messageText
    });

    // Вызов Netlify Function
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_CONFIG.model,
        messages: [
          {
            role: "system",
            content: MODEL_CONFIG.systemInstruction
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: MODEL_CONFIG.temperature,
        top_p: MODEL_CONFIG.topP,
        max_tokens: MODEL_CONFIG.maxOutputTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    // Извлекаем reasoning (Deep Thinking) и основной ответ
    const reasoning = data.reasoning_content;
    const finalContent = data.final_content || data.choices?.[0]?.message?.content;
    
    if (finalContent) {
      // Сначала показываем reasoning если есть
      if (reasoning) {
        onChunk("", reasoning);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Затем эмулируем стриминг основного ответа
      const words = finalContent.split(' ');
      for (const word of words) {
        onChunk(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    } else {
      throw new Error("No response from AI");
    }
  } catch (error) {
    console.error("Chat API Error:", error);
    onChunk("\n\n❌ **Ошибка соединения.** " + String(error));
  }
};
