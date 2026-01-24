
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// Получаем URL бэкенда из переменных окружения
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error(
    "❌ VITE_API_BASE_URL не задан!\n" +
    "Для локальной разработки: создайте .env файл с VITE_API_BASE_URL=http://localhost:8000\n" +
    "Для Netlify: добавьте переменную в Site settings → Environment variables"
  );
}

export const generateAIResponseStream = async (
  messageText: string, 
  fileParts: FilePart[] = [],
  onChunk: (text: string) => void
): Promise<void> => {
  
  // TODO: Реализовать вызов через бэкенд или Netlify Functions
  // DeepSeek API ключ НЕ должен быть во фронтенде!
  // 
  // Пример реализации через бэкенд:
  // const response = await fetch(`${API_BASE_URL}/api/chat`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ message: messageText, files: fileParts, config: MODEL_CONFIG })
  // });
  //
  // Или использовать Netlify Functions:
  // const response = await fetch("/.netlify/functions/chat", { ... });

  if (!API_BASE_URL) {
    onChunk("⚠️ **Ошибка конфигурации:** VITE_API_BASE_URL не задан. Проверьте переменные окружения.");
    return;
  }

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

    // Вызов бэкенд API
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
        max_tokens: MODEL_CONFIG.maxOutputTokens,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No reader available");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error("API Streaming Error:", error);
    onChunk("\n\n❌ **Ошибка соединения.** Проверьте подключение к бэкенду или переменную VITE_API_BASE_URL.");
  }
};
