
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Conversation, Message, MessageRole, UserStatus } from '../types';
import { db } from '../lib/store';
import { generateAIResponseStream, FilePart } from '../services/geminiService';
import { Send, FileDown, Bot, User as UserIcon, Loader2, Sparkles, Paperclip, X, FileText, Info } from 'lucide-react';
import saveAs from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import mammoth from 'mammoth';
import { marked } from 'marked';
import hljs from 'highlight.js';

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

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
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
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, currentStreamingText, isTyping]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttached: AttachedFile[] = [];
    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        newAttached.push({ name: file.name, type: file.type, base64 });
      } else if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        newAttached.push({ name: file.name, type: file.type, extractedText: result.value });
      }
    }
    setAttachedFiles(prev => [...prev, ...newAttached]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || !conversation || isTyping) return;
    
    let displayContent = input;
    if (attachedFiles.length > 0) {
      displayContent = `${attachedFiles.map(f => `📄 ${f.name}`).join(', ')}\n\n${input}`;
    }

    const userMsg = db.addMessage({ conversationId: conversation.id, role: MessageRole.USER, content: displayContent });
    const updatedUser = { ...user };
    if (updatedUser.status === UserStatus.DEMO) {
      updatedUser.demoTurnsLeft -= 1;
      if (updatedUser.demoTurnsLeft <= 0) updatedUser.status = UserStatus.FEEDBACK_REQUIRED;
    }
    db.updateUser(updatedUser);

    onMessageSent([...messages, userMsg], updatedUser);
    
    const fileParts: FilePart[] = [];
    let promptWithContext = input;
    attachedFiles.forEach(f => {
      if (f.base64) fileParts.push({ inlineData: { data: f.base64, mimeType: 'application/pdf' } });
      if (f.extractedText) promptWithContext = `ТЕКСТ ИЗ ${f.name}:\n${f.extractedText}\n\nВОПРОС: ${promptWithContext}`;
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
      const aiMsg = db.addMessage({ conversationId: conversation.id, role: MessageRole.ASSISTANT, content: fullText });
      onMessageSent([...messages, userMsg, aiMsg], updatedUser);
      setCurrentStreamingText('');
    } finally {
      setIsTyping(false);
    }
  };

  const handleExport = async () => {
    const doc = new Document({ sections: [{ children: messages.map(m => new Paragraph({ children: [new TextRun({ text: `${m.role}: ${m.content}`, bold: m.role === 'ASSISTANT' })] })) }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `export-${Date.now()}.docx`);
  };

  if (!conversation) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
      <Bot size={64} className="opacity-20" />
      <p className="text-sm font-bold uppercase tracking-widest">Выберите чат для начала анализа документов</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${m.role === MessageRole.USER ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                {m.role === MessageRole.USER ? <UserIcon size={20} /> : <Bot size={20} className="text-indigo-400" />}
              </div>
              <div className={`p-5 rounded-2xl max-w-[85%] text-sm ${m.role === MessageRole.USER ? 'bg-indigo-600/10 border border-indigo-500/20' : 'bg-[#0f172a] border border-slate-800'}`}>
                {m.role === MessageRole.USER ? <div className="whitespace-pre-wrap">{m.content}</div> : <MarkdownContent content={m.content} />}
              </div>
            </div>
          ))}
          {currentStreamingText && (
            <div className="flex gap-4 animate-in fade-in">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0"><Bot size={20} className="text-indigo-400" /></div>
              <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-sm"><MarkdownContent content={currentStreamingText} /></div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-8 bg-[#0a0f1d] border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {attachedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 px-3 py-1.5 rounded-full text-[11px] text-slate-300">
                  <FileText size={12} className="text-indigo-400" />
                  <span className="max-w-[100px] truncate">{f.name}</span>
                  <button onClick={() => setAttachedFiles(p => p.filter((_, idx) => idx !== i))}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-[#0f172a] border border-slate-800 rounded-2xl px-4 py-2 focus-within:border-indigo-500/50 transition-all shadow-2xl">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-500 hover:text-indigo-400 transition-colors"
                title="Загрузить PDF или Word"
              >
                <Paperclip size={24} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".pdf,.docx" />
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Задайте вопрос по документам..."
                className="flex-1 bg-transparent border-none text-slate-200 py-3 px-2 focus:ring-0 resize-none max-h-48 placeholder:text-slate-600"
              />
              <div className="flex items-center gap-2">
                <button onClick={handleExport} className="p-3 text-slate-500 hover:text-white"><FileDown size={22} /></button>
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:bg-slate-800 transition-all shadow-lg active:scale-95"
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-600 font-black tracking-widest uppercase">
            <Info size={12} />
            Модель проанализирует загруженные документы
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
