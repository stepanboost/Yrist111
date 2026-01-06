
import React from 'react';
import { Conversation } from '../types';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (c: Conversation) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ conversations, activeId, onSelect, onDelete, onNewChat }) => {
  return (
    <div className="p-3 space-y-4">
      <button 
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-all active:scale-95"
      >
        <Plus size={18} />
        Новый чат
      </button>

      <div className="space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm italic">
            Нет активных диалогов
          </div>
        ) : (
          conversations.map((conv) => (
            <div 
              key={conv.id}
              className={`group flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition-colors ${activeId === conv.id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
              onClick={() => onSelect(conv)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare size={16} className="shrink-0" />
                <span className="text-sm truncate font-medium">
                  {conv.title}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
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
