
import React, { useState, useRef, useEffect } from 'react';
import { User, Conversation, Message, MessageRole, UserStatus } from '../types';
import { db } from '../lib/store';
import { generateAIResponse } from '../services/geminiService';
import { Send, FileDown, Bot, User as UserIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';
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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !conversation || isTyping) return;
    
    const userMsg = db.addMessage({
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: input
    });

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

    try {
      const aiText = await generateAIResponse(input);
      const aiMsg = db.addMessage({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: aiText
      });
      onMessageSent([...currentMessages, aiMsg], updatedUser);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExport = async () => {
    if (messages.length === 0) return;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: `Юридическая консультация: ${conversation?.title || 'Без названия'}`,
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
                  text: `${m.role === 'USER' ? 'Клиент' : 'Юрист (ИИ)'}: `,
                  bold: true,
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
    saveAs(blob, `legal-consultation-${new Date().getTime()}.docx`);
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-6 animate-in fade-in zoom-in duration-500 px-6">
        <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-700 shadow-2xl">
          <Bot size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-slate-200">Ваш кабинет готов</h3>
          <p className="text-sm leading-relaxed text-slate-500">Создайте новый диалог или выберите существующий из боковой панели, чтобы начать работу.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Новая консультация</h3>
                <p className="text-slate-400 max-w-sm">Задайте любой юридический вопрос. ИИ проанализирует ситуацию и предложит варианты решения.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md pt-4">
                {["Как составить иск?", "Проверка договора", "Защита прав", "Трудовой кодекс"].map((t, i) => (
                  <button key={i} onClick={() => setInput(t)} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 transition">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-4 group ${m.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                m.role === MessageRole.USER 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800 border border-slate-700 text-indigo-400'
              }`}>
                {m.role === MessageRole.USER ? <UserIcon size={18} /> : <Bot size={18} />}
              </div>
              <div className={`flex flex-col max-w-[85%] ${m.role === MessageRole.USER ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === MessageRole.USER 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
                <span className="mt-1.5 text-[10px] text-slate-600 font-medium uppercase tracking-widest px-1">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <div className="flex gap-1.5 items-center px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl rounded-tl-none">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-slate-950 border-t border-slate-900 p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <div className="relative flex items-end gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
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
                placeholder="Опишите вашу ситуацию или задайте вопрос..."
                className="flex-1 bg-transparent border-none text-white text-sm py-3 px-4 focus:ring-0 resize-none max-h-48 custom-scrollbar"
              />
              <div className="flex items-center gap-2 pr-2 pb-2">
                <button 
                  onClick={handleExport}
                  title="Экспорт в Word"
                  className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <FileDown size={20} />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-600 uppercase font-bold tracking-widest">
            <AlertCircle size={12} />
            Консультация ИИ не заменяет очного обращения к адвокату
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
