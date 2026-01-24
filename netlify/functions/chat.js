const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

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
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": event.headers.origin || event.headers.referer || "https://yrist111.netlify.app",
        "X-Title": "Electronic Lawyer",
      },
      body: JSON.stringify({
        model: body.model || "deepseek/deepseek-chat",
        messages: body.messages,
        temperature: body.temperature ?? 0.3,
        top_p: body.top_p ?? 0.85,
        max_tokens: body.max_tokens ?? 4096,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `API Error: ${response.status}`, details: errorText }),
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...data,
        final_content: content,
      }),
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
