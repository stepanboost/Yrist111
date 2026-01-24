import type { Handler, HandlerEvent } from "@netlify/functions";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface ChatRequest {
  model: string;
  messages: Array<{
    role: string;
    content: any;
  }>;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not set");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server configuration error: API key not set" }),
    };
  }

  try {
    const body: ChatRequest = JSON.parse(event.body || "{}");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": event.headers.origin || "https://yrist111.netlify.app",
        "X-Title": "Electronic Lawyer",
      },
      body: JSON.stringify({
        model: body.model || "deepseek/deepseek-chat",
        messages: body.messages,
        temperature: body.temperature ?? 0.4,
        top_p: body.top_p ?? 0.9,
        max_tokens: body.max_tokens ?? 4096,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `API Error: ${response.status}`, details: errorText }),
      };
    }

    // Stream the response
    const reader = response.body?.getReader();
    if (!reader) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "No response body" }),
      };
    }

    const chunks: Uint8Array[] = [];
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const fullResponse = chunks.map(chunk => decoder.decode(chunk)).join("");

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: fullResponse,
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error", details: String(error) }),
    };
  }
};

export { handler };
