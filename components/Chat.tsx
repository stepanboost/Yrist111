
import React, { useState, useRef, useEffect } from 'react';
import { User, Conversation, Message, MessageRole, UserStatus } from '../types';
import { db } from '../lib/store';
import { generateAIResponse } from '../services/geminiService';
import { Send, FileDown, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

interface ChatProps {
  user: User;
  conversation: Conversation | null;
  messages: Message[];
  onMessageSent: (messages: Message[], user: User) => void;
}

const Chat: React.FC<ChatProps> = ({ user, conversation, messages, onMessageSent }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !conversation || isTyping) return;
    
    // 1. Add User Message
    const userMsg = db.addMessage({
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: input
    });

    // 2. Update User State (decrement turns)
    const updatedUser = { ...user };
    if (updatedUser.status === UserStatus.DEMO) {
      updatedUser.demoTurnsLeft -= 1;
      if (updatedUser.demoTurnsLeft <= 0) {
        updatedUser.status = UserStatus.FEEDBACK_REQUIRED;
      }
    }
    db.updateUser(updatedUser);

    const currentMessages = [...messages, userMsg];
    onMessageSent(currentMessages, updatedUser);
    setInput('');
    setIsTyping(true);

    // 3. Get AI Response
    const aiText = await generateAIResponse(input);
    const aiMsg = db.addMessage({
      conversationId: conversation.id,
      role: MessageRole.ASSISTANT,
      content: aiText
    });

    setIsTyping(false);
    onMessageSent([...currentMessages, aiMsg], updatedUser);
  };

  const handleExport = async () => {
    if (messages.length === 0) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `Диалог: ${conversation?.title || 'Без названия'}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Дата: ${new Date().toLocaleDateString()}`,
            spacing: { after: 400 },
          }),
          ...messages.flatMap(m => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${m.role === 'USER' ? 'Пользователь' : 'Ассистент'}: `,
                  bold: true,
                  color: m.role === 'USER' ? "2563EB" : "10B981"
                }),
                new TextRun(m.content),
              ],
              spacing: { after: 200 },
            })
          ])
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `chat-export-${new Date().getTime()}.docx`);
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
        <Bot size={64} className="opacity-20" />
        <p className="text-lg">Выберите диалог или создайте новый для начала общения</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-2">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-200">Привет! Я ваш ИИ-помощник</h3>
            <p className="text-slate-400">Напишите что-нибудь, чтобы начать диалог. У вас {user.demoTurnsLeft} бесплатных ходов.</p>
          </div>
        )}

        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex gap-4 max-w-4xl mx-auto ${m.role === MessageRole.USER ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${m.role === MessageRole.USER ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-emerald-400 border border-slate-700'}`}>
              {m.role === MessageRole.USER ? <UserIcon size={18} /> : <Bot size={18} />}
            </div>
            <div className={`flex-1 min-w-0 ${m.role === MessageRole.USER ? 'text-right' : ''}`}>
              <div className={`inline-block text-left p-4 rounded-2xl ${m.role === MessageRole.USER ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>
                <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                <span className="text-[10px] opacity-40 mt-2 block">
                   {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
               <Bot size={18} />
            </div>
            <div className="flex gap-1.5 items-center p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
           <div className="flex items-center gap-3">
             <div className="relative flex-1">
               <textarea
                 rows={1}
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                   }
                 }}
                 placeholder="Напишите сообщение..."
                 className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition resize-none max-h-48 overflow-y-auto"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim() || isTyping}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-700 transition active:scale-95"
               >
                 {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
               </button>
             </div>
             <button 
               onClick={handleExport}
               title="Экспорт в Word"
               className="p-3 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 rounded-xl transition"
             >
               <FileDown size={20} />
             </button>
           </div>
           <p className="text-[10px] text-slate-500 text-center">Gemini 3 Flash Preview может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
