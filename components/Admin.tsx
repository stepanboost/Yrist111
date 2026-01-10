
import React, { useState } from 'react';
import { db } from '../lib/store';
import { PromptConfig, KnowledgeFile } from '../types';
import { LayoutDashboard, FileText, Settings, Database, Upload, Trash2, Save, LogIn, Lock, Users, MessageCircle, Heart, ShieldX, CheckCircle, Info } from 'lucide-react';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'knowledge' | 'prompts'>('stats');
  
  const [prompts, setPrompts] = useState<PromptConfig>(db.getPrompts());
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [files, setFiles] = useState<KnowledgeFile[]>(db.getFiles());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const handleSavePrompts = () => {
    const updated = { ...prompts, updatedAt: Date.now(), version: prompts.version + 1 };
    db.updatePrompts(updated);
    setPrompts(updated);
    setSaveStatus('Сохранено');
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
      <div className="flex items-center justify-center h-full bg-slate-950 px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto border border-indigo-500/20 shadow-inner">
            <Lock size={32} />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Панель управления</h2>
            <p className="text-slate-500 text-sm">Доступ только для администраторов</p>
          </div>
          <div className="space-y-4">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700"
            />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 group">
              Войти в систему
              <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-[10px] text-center text-slate-700 uppercase tracking-widest font-black">Admin Access Required</p>
        </form>
      </div>
    );
  }

  const statsData = db.getStats();

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Tab Navigation */}
      <div className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex overflow-x-auto no-scrollbar">
          {[
            { id: 'stats', label: 'Аналитика', icon: LayoutDashboard },
            { id: 'knowledge', label: 'База знаний', icon: Database },
            { id: 'prompts', label: 'Промпты', icon: Settings }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-6 border-b-2 transition-all font-bold text-xs uppercase tracking-widest whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-400 bg-indigo-600/5' 
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
          <Info size={12} />
          Система работает штатно
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {activeTab === 'stats' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Пользователи', val: statsData.users, icon: Users, theme: 'indigo' },
                  { label: 'Диалоги', val: statsData.convs, icon: MessageCircle, theme: 'blue' },
                  { label: 'Отзывы', val: statsData.feedback, icon: Heart, theme: 'rose' },
                  { label: 'Блокировки', val: 0, icon: ShieldX, theme: 'red' }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl group hover:border-slate-700 transition-all shadow-sm">
                     <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-2xl bg-slate-800 text-slate-400 group-hover:bg-${s.theme}-600/10 group-hover:text-${s.theme}-500 transition-colors`}>
                          <s.icon size={22} />
                        </div>
                        <div className="text-[10px] font-black text-slate-700 uppercase">Live</div>
                     </div>
                     <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                     <p className="text-4xl font-extrabold text-white mt-1 tracking-tight">{s.val}</p>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h3 className="font-bold text-sm text-white uppercase tracking-widest">Последние отзывы</h3>
                    <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Смотреть все</button>
                  </div>
                  <div className="p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-700">
                      <Heart size={32} />
                    </div>
                    <p className="text-slate-500 text-sm italic">Список отзывов пуст</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                    <h3 className="font-bold text-sm text-white uppercase tracking-widest">Активность системы</h3>
                    <div className="flex gap-1">
                      <div className="w-1 h-3 bg-indigo-500 animate-pulse"></div>
                      <div className="w-1 h-3 bg-indigo-500 animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-1 h-3 bg-indigo-500 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4 text-xs">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-500 font-medium">12:4{i}</span>
                        <span className="text-slate-300">Пользователь #{i}45 получил ответ ИИ</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center space-y-6 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                <div className="w-20 h-20 bg-slate-800/50 text-slate-500 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-700 group-hover:border-indigo-500/50 group-hover:text-indigo-500 transition-all duration-500">
                  <Upload size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Обновите базу знаний</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">Загрузите актуальные законы и нормативные акты для улучшения качества ответов ассистента.</p>
                </div>
                <input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
                <label 
                  htmlFor="file-upload" 
                  className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl cursor-pointer font-bold text-sm transition-all hover:bg-indigo-50 active:scale-95 shadow-xl shadow-white/5"
                >
                  Выбрать документы
                </label>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                 <table className="w-full text-left text-xs uppercase tracking-widest font-bold">
                   <thead className="bg-slate-800/50 text-slate-500 border-b border-slate-800">
                     <tr>
                       <th className="px-8 py-5">Документ</th>
                       <th className="px-8 py-5">Размер</th>
                       <th className="px-8 py-5">Дата загрузки</th>
                       <th className="px-8 py-5">Действия</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                     {files.map((f) => (
                       <tr key={f.id} className="text-slate-300 hover:bg-slate-800/20 transition-colors">
                         <td className="px-8 py-5 font-bold flex items-center gap-3">
                           <FileText size={16} className="text-indigo-400" />
                           {f.originalName}
                         </td>
                         <td className="px-8 py-5">{(f.size / 1024).toFixed(1)} KB</td>
                         <td className="px-8 py-5 font-medium text-slate-500">{new Date(f.createdAt).toLocaleDateString()}</td>
                         <td className="px-8 py-5">
                           <button className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {files.length === 0 && (
                   <div className="p-20 text-center text-slate-600 italic text-sm">В базе знаний пока нет файлов</div>
                 )}
              </div>
            </div>
          )}

          {activeTab === 'prompts' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                   <h2 className="text-3xl font-extrabold text-white tracking-tight">Конфигуратор логики</h2>
                   <p className="text-slate-500 text-sm font-medium">Версия промптов: {prompts.version}</p>
                 </div>
                 <button 
                  onClick={handleSavePrompts}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl ${
                    saveStatus 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                      : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-500'
                  }`}
                 >
                   {saveStatus ? <CheckCircle size={20} /> : <Save size={20} />}
                   {saveStatus || 'Применить изменения'}
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-10 pb-10">
                {[
                  { key: 'systemPrompt', label: 'Глобальная роль', desc: 'Задает тон, стиль и профессиональные ограничения ИИ' },
                  { key: 'ragPrompt', label: 'Интеграция знаний', desc: 'Определяет, как ИИ должен цитировать внешние документы' },
                  { key: 'fallbackPrompt', label: 'Обработка ошибок', desc: 'Текст при отсутствии ответа или нарушении политики' }
                ].map((f) => (
                  <div key={f.key} className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                      {f.label}
                    </label>
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 focus-within:border-indigo-500/50 transition-all">
                      <p className="text-[10px] text-slate-600 mb-4 font-bold uppercase">{f.desc}</p>
                      <textarea 
                        value={(prompts as any)[f.key]}
                        onChange={(e) => setPrompts({ ...prompts, [f.key]: e.target.value })}
                        className="w-full h-48 bg-slate-950 border border-slate-800 text-indigo-400 p-6 rounded-2xl focus:ring-0 outline-none font-mono text-xs leading-relaxed custom-scrollbar"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
