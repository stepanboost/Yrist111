
import { MODEL_CONFIG } from "../nastroiks";

export interface FilePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

const OPENROUTER_API_KEY = "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";

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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Electronic Lawyer"
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
    console.error("DeepSeek Streaming Error:", error);
    onChunk("\n\n❌ **Ошибка соединения.** Пожалуйста, проверьте подключение к интернету.");
  }
};
