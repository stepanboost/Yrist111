
import { User, UserStatus, Conversation, Message, Feedback, PromptConfig, KnowledgeFile } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  USER: 'chat_app_user',
  CONVERSATIONS: 'chat_app_conversations',
  MESSAGES: 'chat_app_messages',
  FEEDBACK: 'chat_app_feedback',
  PROMPTS: 'chat_app_prompts',
  FILES: 'chat_app_files',
  ADMIN_SESSION: 'chat_app_admin_session'
};

export const db = {
  // USER OPERATIONS
  getOrCreateUser: (): User => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) return JSON.parse(stored);
    
    const newUser: User = {
      id: uuidv4(),
      createdAt: Date.now(),
      status: UserStatus.DEMO,
      demoTurnsLeft: 10,
      lastSeenAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  updateUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // CONVERSATION OPERATIONS
  getConversations: (userId: string): Conversation[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const all: Conversation[] = stored ? JSON.parse(stored) : [];
    return all.filter(c => c.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  createConversation: (userId: string, title: string): Conversation => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const all: Conversation[] = stored ? JSON.parse(stored) : [];
    const newConv: Conversation = {
      id: uuidv4(),
      userId,
      title,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    all.push(newConv);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(all));
    return newConv;
  },

  deleteConversation: (id: string) => {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const all: Conversation[] = stored ? JSON.parse(stored) : [];
    const filtered = all.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));

    const msgStored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMsgs: Message[] = msgStored ? JSON.parse(msgStored) : [];
    const filteredMsgs = allMsgs.filter(m => m.conversationId !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filteredMsgs));
  },

  // MESSAGE OPERATIONS
  getMessages: (conversationId: string): Message[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: Message[] = stored ? JSON.parse(stored) : [];
    return all.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt - b.createdAt);
  },

  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>): Message => {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: Message[] = stored ? JSON.parse(stored) : [];
    const newMessage: Message = {
      ...msg,
      id: uuidv4(),
      createdAt: Date.now()
    };
    all.push(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

    // Update conversation timestamp
    const convStored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    const allConvs: Conversation[] = convStored ? JSON.parse(convStored) : [];
    const convIndex = allConvs.findIndex(c => c.id === msg.conversationId);
    if (convIndex !== -1) {
      allConvs[convIndex].updatedAt = Date.now();
      // If first user message, update title
      if (all.filter(m => m.conversationId === msg.conversationId).length === 1 && msg.role === 'USER') {
        allConvs[convIndex].title = msg.content.split(' ').slice(0, 8).join(' ') + '...';
      }
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(allConvs));
    }

    return newMessage;
  },

  // FEEDBACK
  addFeedback: (userId: string, text: string): Feedback => {
    const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    const all: Feedback[] = stored ? JSON.parse(stored) : [];
    const feedback: Feedback = {
      id: uuidv4(),
      userId,
      text,
      createdAt: Date.now(),
      charCount: text.length
    };
    all.push(feedback);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(all));
    return feedback;
  },

  // ADMIN OPERATIONS
  getStats: () => {
    const users = localStorage.getItem(STORAGE_KEYS.USER) ? 1 : 0; // Simple since we only have 1 local user
    const convs = (localStorage.getItem(STORAGE_KEYS.CONVERSATIONS) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)!) : []).length;
    const msgs = (localStorage.getItem(STORAGE_KEYS.MESSAGES) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)!) : []).length;
    const feedback = (localStorage.getItem(STORAGE_KEYS.FEEDBACK) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.FEEDBACK)!) : []).length;
    return { users, convs, msgs, feedback };
  },

  getPrompts: (): PromptConfig => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    if (stored) return JSON.parse(stored);
    
    return {
      id: 'default',
      systemPrompt: 'You are a helpful assistant.',
      ragPrompt: 'Use the following context to answer...',
      fallbackPrompt: 'I am sorry, I cannot help with that.',
      version: 1,
      updatedAt: Date.now()
    };
  },

  updatePrompts: (config: PromptConfig) => {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(config));
  },

  getFiles: (): KnowledgeFile[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.FILES);
    return stored ? JSON.parse(stored) : [];
  },

  addFile: (file: Omit<KnowledgeFile, 'id' | 'createdAt'>) => {
    const stored = localStorage.getItem(STORAGE_KEYS.FILES);
    const all: KnowledgeFile[] = stored ? JSON.parse(stored) : [];
    all.push({ ...file, id: uuidv4(), createdAt: Date.now() });
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(all));
  }
};
