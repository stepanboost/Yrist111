
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Conversation, Message, MessageRole, UserStatus } from '../types';
import { db } from '../lib/store';
import { generateAIResponseStream, FilePart } from '../services/geminiService';
import { Send, FileDown, Bot, User as UserIcon, Loader2, Sparkles, AlertCircle, Paperclip, X, FileText, Info } from 'lucide-react';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import mammoth from 'mammoth';
import { marked } from 'marked';
import hljs from 'highlight.js';

// Markdown Renderer Component
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const htmlContent = useMemo(() => {
    return marked.parse(content, {
      gfm: true,
      breaks: true,
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      }
    });
  }, [content]);

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

interface AttachedFile {
  name: string;
  type: string;
  base64?: string;
  extractedText?: string;
}

interface ChatProps {
  user: User;
  conversation: Conversation | null;
  messages: Message[];
  onMessageSent: (messages: Message[], user: User) => void;
}

const Chat: React.FC<ChatProps> = ({ user, conversation, messages, onMessageSent }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [currentStreamingText, setCurrentStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, currentStreamingText, isTyping]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttached: AttachedFile[] = [];

    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf') {
        const base64 = await fileToBase64(file);
        newAttached.push({ name: file.name, type: file.type, base64 });
      } else if (
        file.name.endsWith('.docx') || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        newAttached.push({ name: file.name, type: file.type, extractedText: result.value });
      }
    }

    setAttachedFiles(prev => [...prev, ...newAttached]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || !conversation || isTyping) return;
    
    let displayContent = input;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => `📄 ${f.name}`).join(', ');
      displayContent = `[Прикреплено: ${fileNames}]\n\n${input}`.trim();
    }

    const userMsg = db.addMessage({
      conversationId: conversation.id,
      role: MessageRole.USER,
      content: displayContent
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
    
    const fileParts: FilePart[] = [];
    let promptWithContext = input;

    attachedFiles.forEach(f => {
      if (f.type === 'application/pdf' && f.base64) {
        fileParts.push({ inlineData: { data: f.base64, mimeType: 'application/pdf' } });
      } else if (f.extractedText) {
        promptWithContext = `ДАННЫЕ ИЗ ФАЙЛА "${f.name}":\n${f.extractedText}\n\nВОПРОС ПОЛЬЗОВАТЕЛЯ: ${promptWithContext}`;
      }
    });

    setInput('');
    setAttachedFiles([]);
    setIsTyping(true);
    setCurrentStreamingText('');

    let fullText = '';
    try {
      await generateAIResponseStream(promptWithContext, fileParts, (chunk) => {
        fullText += chunk;
        setCurrentStreamingText(fullText);
      });

      const aiMsg = db.addMessage({
        conversationId: conversation.id,
        role: MessageRole.ASSISTANT,
        content: fullText
      });
      onMessageSent([...currentMessages, aiMsg], updatedUser);
      setCurrentStreamingText('');
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
        children: [
          new Paragraph({ text: `Отчет: ${conversation?.title}`, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          ...messages.flatMap(m => [
            new Paragraph({ children: [new TextRun({ text: `${m.role === 'USER' ? 'Клиент' : 'Ассистент'}: `, bold: true }), new TextRun(m.content)] })
          ])
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `report-${new Date().getTime()}.docx`);
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-6 animate-in fade-in zoom-in duration-500 px-6">
        <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex items-center justify-center text-slate-700 shadow-2xl">
          <Bot size={48} strokeWidth={1.5} />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-slate-200">Система Юрист-ИИ</h3>
          <p className="text-sm leading-relaxed text-slate-500 text-center">Выберите диалог для начала анализа или загрузите документы PDF/Word.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-6 ${m.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[90%] ${m.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${
                  m.role === MessageRole.USER ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] border border-slate-700 text-indigo-400'
                }`}>
                  {m.role === MessageRole.USER ? <UserIcon size={20} /> : <Bot size={20} />}
                </div>
                <div className="flex flex-col space-y-1">
                   <div className={`px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 ${m.role === MessageRole.USER ? 'text-right' : 'text-left'}`}>
                     {m.role === MessageRole.USER ? 'Вы' : 'Юрист-ИИ'}
                   </div>
                   <div className={`p-6 rounded-3xl shadow-sm text-sm ${
                    m.role === MessageRole.USER 
                      ? 'bg-indigo-600/10 border border-indigo-500/20 text-slate-100 rounded-tr-none' 
                      : 'bg-[#0f172a] border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    {m.role === MessageRole.USER ? (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <MarkdownContent content={m.content} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {currentStreamingText && (
            <div className="flex gap-6 justify-start animate-in fade-in duration-300">
               <div className="flex gap-4 max-w-[90%]">
                 <div className="w-10 h-10 rounded-xl bg-[#1e293b] border border-slate-700 flex items-center justify-center text-indigo-400 shadow-lg">
                    <Bot size={20} />
                 </div>
                 <div className="flex flex-col space-y-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Печатает...</div>
                    <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-slate-200 rounded-tl-none shadow-sm">
                      <MarkdownContent content={currentStreamingText} />
                      <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse align-middle"></span>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#0a0f1d] border-t border-slate-900/50 p-6">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          
          {/* File Chips */}
          {attachedFiles.length > 0 && (
            <div className="w-full flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2 duration-300">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#1e293b] border border-slate-700/50 px-3 py-1.5 rounded-full text-[11px] text-slate-300">
                  <FileText size={12} className="text-indigo-400" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-slate-500 hover:text-white transition">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main Input Container - Matching Screenshot */}
          <div className="w-full relative group">
            <div className="flex items-center gap-2 bg-[#0f172a]/80 border border-slate-800/80 rounded-[1.25rem] px-4 py-2 shadow-2xl focus-within:border-indigo-500/30 transition-all">
              
              {/* Attachment Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-indigo-400 transition-colors"
                title="Добавить документы"
              >
                <Paperclip size={24} strokeWidth={1.5} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.docx" />

              {/* Text Input */}
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Задайте вопрос по документам..."
                className="flex-1 bg-transparent border-none text-slate-200 text-[15px] py-3 px-2 focus:ring-0 resize-none max-h-48 custom-scrollbar placeholder:text-slate-500 font-medium"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExport} 
                  className="p-3 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Экспорт диалога"
                >
                  <FileDown size={22} strokeWidth={1.5} />
                </button>
                
                <button 
                  onClick={handleSend}
                  disabled={(!input.trim() && attachedFiles.length === 0) || isTyping}
                  className="w-12 h-12 flex items-center justify-center bg-[#1e293b] text-slate-400 hover:bg-indigo-600 hover:text-white disabled:bg-[#1e293b]/50 disabled:text-slate-700 rounded-xl transition-all shadow-lg active:scale-95 group/send"
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin text-indigo-400" /> : <Send size={20} strokeWidth={1.5} className="group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Badge - Matching Screenshot */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-black tracking-[0.15em] uppercase pointer-events-none opacity-80">
            <Info size={14} strokeWidth={3} className="mb-0.5" />
            <span>Модель проанализирует загруженные документы</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
