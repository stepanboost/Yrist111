
export const MODEL_CONFIG = {
  model: 'deepseek/deepseek-chat',
  
  systemInstruction: `Вы — юридический ИИ-ассистент «Электронный Юрист». Отвечайте развёрнуто, структурированно, на русском языке. Используйте эмодзи и Markdown для форматирования.`,

  temperature: 0.3,
  topP: 0.85,
  topK: 40,
  maxOutputTokens: 4096,
  
  ragContextPrompt: 'При ответе приоритетно используйте данные из Базы Знаний.',
  fallbackResponse: '⚠️ Информации недостаточно для точного ответа. Рекомендую проконсультироваться с юристом.'
};
