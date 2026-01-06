
import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { db } from '../lib/store';
import { AlertCircle, CheckCircle2, Heart, ShieldAlert } from 'lucide-react';

interface FeedbackWallProps {
  user: User;
  onSuccess: () => void;
  onRefuse: () => void;
}

const FeedbackWall: React.FC<FeedbackWallProps> = ({ user, onSuccess, onRefuse }) => {
  const [feedback, setFeedback] = useState('');
  const MIN_CHARS = 400;

  const handleSubmit = () => {
    if (feedback.length < MIN_CHARS) return;
    db.addFeedback(user.id, feedback);
    onSuccess();
  };

  const prompts = [
    "Что вам больше всего понравилось в работе ассистента?",
    "Какие функции были бы вам полезны в будущем?",
    "Опишите свой опыт использования интерфейса...",
    "Насколько точными были ответы модели?",
    "Расскажите подробнее о вашем кейсе использования."
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center">
           <Heart className="mx-auto text-white mb-4 animate-pulse" size={48} />
           <h2 className="text-3xl font-bold text-white mb-2">Бесплатные ходы закончились</h2>
           <p className="text-indigo-100 opacity-90">Мы рады, что вы пользуетесь Gemini Pro. Чтобы мы могли развиваться дальше, пожалуйста, оставьте развернутый отзыв о вашем опыте.</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-300">Ваш отзыв (как на Яндекс Картах)</label>
              <span className={`text-xs font-medium px-2 py-1 rounded ${feedback.length >= MIN_CHARS ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                {feedback.length} / {MIN_CHARS} символов
              </span>
            </div>
            <textarea 
              autoFocus
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Расскажите о своих впечатлениях подробно..."
              className="w-full h-48 bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none leading-relaxed"
            />
            <div className="mt-4 flex flex-wrap gap-2">
               {prompts.map((p, i) => (
                 <button 
                  key={i}
                  onClick={() => setFeedback(prev => prev + (prev ? " " : "") + p)}
                  className="text-[10px] bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition"
                 >
                   + {p}
                 </button>
               ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              disabled={feedback.length < MIN_CHARS}
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
            >
              {feedback.length >= MIN_CHARS ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              Получить полный доступ навсегда
            </button>
            <button 
              onClick={onRefuse}
              className="px-6 py-4 text-slate-500 hover:text-red-400 font-medium transition flex items-center justify-center gap-2"
            >
              <ShieldAlert size={18} />
              Не хочу оставлять отзыв
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackWall;
