
export const MODEL_CONFIG = {
  // DeepSeek R1 — модель с "размышлением", даёт более качественные ответы
  // Альтернативы: 'deepseek/deepseek-chat' (быстрее, дешевле)
  //              'anthropic/claude-3.5-sonnet' (очень умная)
  //              'openai/gpt-4o' (GPT-4)
  // DeepSeek R1 (deepseek/deepseek-r1) - медленная, с Deep Thinking, таймаутит на Netlify Free
  // DeepSeek Chat - быстрая, качественная, работает на Netlify Free
  model: 'deepseek/deepseek-chat',
  
  systemInstruction: `Вы — юридический ИИ-ассистент. Отвечайте кратко, структурированно, на русском языке. Используйте эмодзи и Markdown.`,

  // Параметры генерации
  temperature: 0.3,      // Низкая для точности юридических ответов
  topP: 0.85,            // Немного снижено для консистентности
  topK: 40,
  maxOutputTokens: 2048, // Оптимально для скорости на Netlify
  
  // Дополнительные настройки
  ragContextPrompt: 'При ответе приоритетно используйте данные из Базы Знаний. Ссылайтесь на конкретные статьи законов.',
  fallbackResponse: '⚠️ Информации недостаточно для точного ответа. Рекомендую проконсультироваться с профильным юристом.'
};
