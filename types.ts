
export enum UserStatus {
  DEMO = 'DEMO',
  FEEDBACK_REQUIRED = 'FEEDBACK_REQUIRED',
  BLOCKED = 'BLOCKED',
  FULL = 'FULL'
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT'
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  createdAt: number;
  status: UserStatus;
  demoTurnsLeft: number;
  lastSeenAt: number;
}

export interface Feedback {
  id: string;
  userId: string;
  text: string;
  createdAt: number;
  charCount: number;
}

export interface PromptConfig {
  id: string;
  systemPrompt: string;
  ragPrompt: string;
  fallbackPrompt: string;
  version: number;
  updatedAt: number;
}

export interface KnowledgeFile {
  id: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: number;
}
