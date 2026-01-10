
import React from 'react';
import { ShieldCheck, Scale, FileText, Zap, ChevronRight, Gavel, Users, Info, ArrowRight, MessageSquare, Search } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[210] bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Gavel className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Электронный Юрист</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition">Главная</a>
            <a href="#" className="hover:text-white transition">Услуги</a>
            <a href="#" className="hover:text-white transition">Юристы</a>
            <a href="#" className="hover:text-white transition">База знаний</a>
            <a href="#" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-400 hover:text-white transition px-4 py-2">Войти</button>
            <button 
              onClick={onStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Регистрация
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
            <ShieldCheck size={14} />
            Интеллектуальная правовая экосистема
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Онлайн-юридическая помощь. <br />
            <span className="text-indigo-500">Быстро, понятно, надёжно.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Автоматизированная платформа для решения правовых задач любой сложности. 
            Получите консультацию ИИ или найдите профильного юриста за считанные минуты.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto group px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-2"
            >
              Начать пользоваться
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Найти юриста или услугу..." 
                className="w-full sm:w-80 px-12 py-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-3xl overflow-hidden">
          {[
            { label: 'Консультаций в месяц', val: '12 450' },
            { label: 'Средняя оценка', val: '4.9/5' },
            { label: 'Юристов в штате', val: '318' },
            { label: 'Успешных дел', val: '98%' }
          ].map((s, i) => (
            <div key={i} className="bg-slate-950 p-8 text-center space-y-1">
              <div className="text-3xl font-bold text-white">{s.val}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Мгновенный ответ</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Система анализирует ваш запрос и предоставляет первичную консультацию в течение 30 секунд с помощью ИИ последнего поколения.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Юридическая чистота</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Все документы проверяются на соответствие текущему законодательству РФ. Мы гарантируем актуальность каждой формы.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Scale size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Прозрачная цена</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Никаких скрытых комиссий. Вы заранее знаете стоимость подготовки документа или сопровождения дела юристом.</p>
          </div>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Популярные услуги</h2>
            <p className="text-slate-500">Выберите необходимую категорию для начала работы</p>
          </div>
          <button className="text-indigo-400 text-sm font-bold flex items-center gap-1 hover:text-indigo-300 transition">
            Все услуги <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              title: "Первичная консультация", 
              desc: "Быстрый разбор ситуации ассистентом и план действий.", 
              price: "0₽",
              icon: MessageSquare
            },
            { 
              title: "Трудовые споры", 
              desc: "Защита прав работников и работодателей в суде и ГИТ.", 
              price: "от 3 500₽",
              icon: Users
            },
            { 
              title: "Семейное право", 
              desc: "Разводы, алименты, раздел имущества и опека.", 
              price: "от 5 000₽",
              icon: Scale
            }
          ].map((s, i) => (
            <div key={i} className="group p-8 bg-slate-900/40 border border-slate-800 rounded-3xl hover:bg-slate-900 hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-6">
                <s.icon size={20} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{s.title}</h4>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">{s.desc}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <span className="text-indigo-400 font-bold">{s.price}</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest group-hover:translate-x-1 transition-transform">Выбрать →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Gavel className="text-white" size={18} />
                </div>
                <span className="text-lg font-bold text-white">Электронный Юрист</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Первая в России платформа, объединяющая искусственный интеллект и экспертизу лучших адвокатов для вашей защиты.
              </p>
            </div>
            
            <div>
              <h5 className="text-white font-bold mb-6">Разделы</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition">Услуги</a></li>
                <li><a href="#" className="hover:text-white transition">Юристы</a></li>
                <li><a href="#" className="hover:text-white transition">База знаний</a></li>
                <li><a href="#" className="hover:text-white transition">Тарифы</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Поддержка</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-white transition">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition">Политика конфиденциальности</a></li>
                <li><a href="#" className="hover:text-white transition">Оферта</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6">Связаться</h5>
              <p className="text-slate-500 text-sm mb-4">Бесплатная линия по РФ:</p>
              <p className="text-xl font-bold text-white">8 (800) 555-35-35</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
            <p>© 2024 ООО «Электронные юридические системы». Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">VK</a>
              <a href="#" className="hover:text-white transition">Telegram</a>
              <a href="#" className="hover:text-white transition">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
