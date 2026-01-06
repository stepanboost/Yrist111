
import React from 'react';
import { User, Conversation, Message, UserStatus } from '../types';
import { Calendar, MessageSquare, List, Shield, User as UserIcon, Award } from 'lucide-react';

interface ProfileProps {
  user: User;
  conversations: Conversation[];
  messages: Message[];
}

const Profile: React.FC<ProfileProps> = ({ user, conversations, messages }) => {
  const stats = [
    { label: 'Сообщений', value: messages.length, icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Диалогов', value: conversations.length, icon: List, color: 'text-purple-400' },
    { label: 'Ходов осталось', value: user.status === UserStatus.FULL ? '∞' : user.demoTurnsLeft, icon: Award, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl -z-10 rounded-full"></div>
        
        <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/40 shrink-0">
          <UserIcon size={48} />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-3xl font-bold text-white">Пользователь</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-sm bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">ID: {user.id}</span>
            <span className={`text-sm px-3 py-1 rounded-full font-semibold border ${user.status === UserStatus.FULL ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>
              {user.status === UserStatus.FULL ? 'Премиум доступ' : 'Демо доступ'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition group">
            <div className={`p-2 rounded-lg bg-slate-800 inline-block mb-4 transition-transform group-hover:scale-110 ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Calendar className="text-indigo-400" size={20} />
          <h3 className="font-semibold text-white">История активности</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/50">
            <span className="text-slate-400">Дата регистрации</span>
            <span className="text-slate-200">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2 border-b border-slate-800/50">
            <span className="text-slate-400">Последний визит</span>
            <span className="text-slate-200">{new Date(user.lastSeenAt).toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm py-2">
            <span className="text-slate-400">Статус аккаунта</span>
            <span className="text-emerald-400 font-medium">Активен</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
