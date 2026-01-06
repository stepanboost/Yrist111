
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './lib/store';
import { User, UserStatus, Conversation, Message } from './types';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import FeedbackWall from './components/FeedbackWall';
import Profile from './components/Profile';
import Admin from './components/Admin';
import { MessageSquare, LayoutDashboard, User as UserIcon, LogOut, ChevronLeft, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'profile' | 'admin'>('chat');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize User
  useEffect(() => {
    const currentUser = db.getOrCreateUser();
    setUser(currentUser);
    const convs = db.getConversations(currentUser.id);
    setConversations(convs);
    if (convs.length > 0) {
      setActiveConversation(convs[0]);
    }
  }, []);

  // Fetch Messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      const msgs = db.getMessages(activeConversation.id);
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  const handleCreateNewChat = () => {
    if (!user) return;
    const newConv = db.createConversation(user.id, 'Новый диалог');
    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    setCurrentView('chat');
  };

  const handleDeleteChat = (id: string) => {
    db.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation?.id === id) {
      setActiveConversation(null);
    }
  };

  const handleUpdateUserStatus = (status: UserStatus) => {
    if (!user) return;
    const updatedUser = { ...user, status };
    if (status === UserStatus.FULL) {
      updatedUser.demoTurnsLeft = 9999;
    }
    db.updateUser(updatedUser);
    setUser(updatedUser);
  };

  const handleBlockUser = () => {
    handleUpdateUserStatus(UserStatus.BLOCKED);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 border-r border-slate-800 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Gemini Pro</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-white">
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar 
              conversations={conversations}
              activeId={activeConversation?.id || null}
              onSelect={setActiveConversation}
              onDelete={handleDeleteChat}
              onNewChat={handleCreateNewChat}
            />
          </div>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => { setCurrentView('profile'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentView === 'profile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <UserIcon size={18} />
              <span>Профиль</span>
            </button>
            <button 
              onClick={() => { setCurrentView('admin'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${currentView === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard size={18} />
              <span>Админка</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-400">
             <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
             {user.status === UserStatus.DEMO && (
               <div className="hidden sm:flex items-center gap-2 bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-800 text-sm">
                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                 Лимит: {user.demoTurnsLeft} ходов
               </div>
             )}
             {user.status === UserStatus.FULL && (
               <div className="hidden sm:flex items-center gap-2 bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 text-sm">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                 Полный доступ
               </div>
             )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">ID: {user.id.slice(0, 8)}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {user.status === UserStatus.BLOCKED ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="p-4 bg-red-900/20 text-red-400 border border-red-900 rounded-xl max-w-md">
                <h2 className="text-2xl font-bold mb-2">Аккаунт заблокирован</h2>
                <p>Вы отказались оставить отзыв. Доступ к чату ограничен навсегда.</p>
              </div>
            </div>
          ) : currentView === 'chat' ? (
            <Chat 
              user={user} 
              conversation={activeConversation}
              messages={messages}
              onMessageSent={(newMessages, newUserState) => {
                setMessages(newMessages);
                setUser(newUserState);
              }}
            />
          ) : currentView === 'profile' ? (
            <Profile user={user} conversations={conversations} messages={messages} />
          ) : (
            <Admin />
          )}
        </div>

        {/* Feedback Wall Overlay */}
        {user.status === UserStatus.FEEDBACK_REQUIRED && (
          <FeedbackWall 
            user={user} 
            onSuccess={() => handleUpdateUserStatus(UserStatus.FULL)}
            onRefuse={handleBlockUser}
          />
        )}
      </main>
    </div>
  );
};

export default App;
