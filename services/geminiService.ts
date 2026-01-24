
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// URL для Netlify Function (работает и локально через netlify dev, и на продакшене)
const CHAT_API_URL = "/.netlify/functions/chat";

export const generateAIResponseStream = async (
  messageText: string, 
  fileParts: FilePart[] = [],
  onChunk: (text: string) => void
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
        max_tokens: MODEL_CONFIG.maxOutputTokens,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    // Парсим streaming response
    const responseText = await response.text();
    const lines = responseText.split('\n').filter(line => line.trim() !== '');

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
  } catch (error) {
    console.error("Chat API Error:", error);
    onChunk("\n\n❌ **Ошибка соединения.** Проверьте подключение к серверу.");
  }
};
