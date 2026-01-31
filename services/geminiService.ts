
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// Для локальной разработки используем прямой API
const OPENROUTER_API_KEY = "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";
const USE_DIRECT_API = true; // Переключатель для локальной разработки

const CHAT_API_URL = "/.netlify/functions/chat";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateAIResponseStream = async (
  messageText: string, 
  fileParts: FilePart[] = [],
  onChunk: (text: string) => void
): Promise<void> => {
  
  try {
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

    let response;

    if (USE_DIRECT_API) {
      // Прямой запрос к OpenRouter для локальной разработки
      response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Electronic Lawyer",
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
          max_tokens: MODEL_CONFIG.maxOutputTokens,
          stream: false
        })
      });
    } else {
      // Через Netlify функцию для продакшена
      response = await fetch(CHAT_API_URL, {
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
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const finalContent = data.final_content || data.choices?.[0]?.message?.content;
    
    if (finalContent) {
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
