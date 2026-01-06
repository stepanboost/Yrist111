
import React, { useState, useEffect } from 'react';
import { db } from '../lib/store';
import { PromptConfig, KnowledgeFile } from '../types';
import { LayoutDashboard, FileText, Settings, Database, Upload, Trash2, Save, LogIn, Lock, Users, MessageCircle, Heart, ShieldX } from 'lucide-react';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'knowledge' | 'prompts'>('stats');
  
  // States for Prompt Manager
  const [prompts, setPrompts] = useState<PromptConfig>(db.getPrompts());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // States for Knowledge Base
  const [files, setFiles] = useState<KnowledgeFile[]>(db.getFiles());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') { // Simulated password from env
      setIsLoggedIn(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const handleSavePrompts = () => {
    const updated = { ...prompts, updatedAt: Date.now(), version: prompts.version + 1 };
    db.updatePrompts(updated);
    setPrompts(updated);
    setSaveStatus('Сохранено!');
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    db.addFile({
      originalName: file.name,
      size: file.size,
      mimeType: file.type
    });
    setFiles(db.getFiles());
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
            <Lock size={32} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Вход в админку</h2>
            <p className="text-slate-500 text-sm">Введите пароль администратора</p>
          </div>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-600 outline-none"
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
            <LogIn size={20} />
            Войти
          </button>
          <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">Подсказка: admin</p>
        </form>
      </div>
    );
  }

  const stats = db.getStats();

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-slate-800 bg-slate-900/50 flex overflow-x-auto no-scrollbar">
        {[
          { id: 'stats', label: 'Статистика', icon: LayoutDashboard },
          { id: 'knowledge', label: 'База знаний', icon: Database },
          { id: 'prompts', label: 'Промпты', icon: Settings }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition font-medium whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-400 bg-indigo-600/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'stats' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Пользователи', val: stats.users, icon: Users, col: 'bg-blue-600' },
                { label: 'Диалоги', val: stats.convs, icon: MessageCircle, col: 'bg-purple-600' },
                { label: 'Отзывы', val: stats.feedback, icon: Heart, col: 'bg-rose-600' },
                { label: 'Блокировки', val: 0, icon: ShieldX, col: 'bg-red-600' }
              ].map((s, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                   <div>
                     <p className="text-slate-500 text-sm font-medium">{s.label}</p>
                     <p className="text-3xl font-bold text-white mt-1">{s.val}</p>
                   </div>
                   <div className={`${s.col} p-3 rounded-xl text-white shadow-lg`}>
                     <s.icon size={24} />
                   </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-800/50">
                 <h3 className="font-bold">Последние отзывы</h3>
              </div>
              <div className="p-4 text-center text-slate-500 italic text-sm">
                 Здесь будет список последних отзывов с пагинацией...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-700">
                <Upload size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Загрузите файлы базы знаний</h3>
                <p className="text-slate-500 text-sm">Поддерживаются PDF и DOCX (имитация)</p>
              </div>
              <input 
                type="file" 
                onChange={handleFileUpload}
                className="hidden" 
                id="file-upload" 
              />
              <label 
                htmlFor="file-upload" 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg cursor-pointer font-medium transition active:scale-95"
              >
                Выбрать файл
              </label>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-800 text-slate-400 font-bold border-b border-slate-700">
                   <tr>
                     <th className="px-6 py-4">Имя файла</th>
                     <th className="px-6 py-4">Тип</th>
                     <th className="px-6 py-4">Размер</th>
                     <th className="px-6 py-4">Дата</th>
                     <th className="px-6 py-4"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                   {files.map((f) => (
                     <tr key={f.id} className="text-slate-300 hover:bg-slate-800/30">
                       <td className="px-6 py-4 font-medium">{f.originalName}</td>
                       <td className="px-6 py-4 uppercase text-[10px]"><span className="bg-slate-700 px-2 py-0.5 rounded">{f.mimeType.split('/')[1] || 'FILE'}</span></td>
                       <td className="px-6 py-4">{(f.size / 1024).toFixed(1)} KB</td>
                       <td className="px-6 py-4">{new Date(f.createdAt).toLocaleDateString()}</td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {files.length === 0 && (
                 <div className="p-8 text-center text-slate-600 italic">Файлы не загружены</div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold text-white">Настройка промптов</h2>
                 <p className="text-slate-500 text-sm">Текущая версия: {prompts.version}</p>
               </div>
               <button 
                onClick={handleSavePrompts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-900/20"
               >
                 <Save size={20} />
                 {saveStatus || 'Сохранить изменения'}
               </button>
            </div>

            <div className="space-y-6">
              {[
                { key: 'systemPrompt', label: 'Системный промпт', desc: 'Определяет роль и поведение ассистента' },
                { key: 'ragPrompt', label: 'RAG Промпт', desc: 'Как использовать найденные документы' },
                { key: 'fallbackPrompt', label: 'Фолбэк промпт', desc: 'Что отвечать, если нет информации' }
              ].map((f) => (
                <div key={f.key} className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-400" />
                    {f.label}
                  </label>
                  <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wide">{f.desc}</p>
                  <textarea 
                    value={(prompts as any)[f.key]}
                    onChange={(e) => setPrompts({ ...prompts, [f.key]: e.target.value })}
                    className="w-full h-40 bg-slate-900 border border-slate-800 text-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none font-mono text-sm leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
