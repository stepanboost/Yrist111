
import React from 'react';
import { Conversation } from '../types';
import { Plus, MessageSquare, Trash2, Hash } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect, onDelete, onNewChat }) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <div>
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Новый диалог
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">История запросов</h3>
        {conversations.length === 0 ? (
          <div className="px-3 py-8 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-600 text-xs italic">История пуста</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div 
              key={conv.id}
              className={`group flex items-center justify-between gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeId === conv.id 
                  ? 'bg-indigo-600/10 text-indigo-400 ring-1 ring-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
              onClick={() => onSelect(conv)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activeId === conv.id ? 'bg-indigo-600/20' : 'bg-slate-800'}`}>
                  {activeId === conv.id ? <Hash size={14} /> : <MessageSquare size={14} />}
                </div>
                <span className="text-sm truncate font-medium">
                  {conv.title}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
