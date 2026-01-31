
import React, { useState } from 'react';
import { 
  Scale, FileText, MessageSquare, Search, BookOpen, Calculator, 
  FolderClock, FileCheck, ListChecks, CreditCard, Bot, 
  CheckCircle, Menu, X, Star, Users
} from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Bot,
      title: 'AI-консультант',
      description: 'Консультации по правовым вопросам через AI-чат: трудовое право, договоры, споры с ЖКХ, защита прав потребителей.'
    },
    {
      icon: FileText,
      title: 'Генерация документов',
      description: 'Автоматическое создание типовых юридических документов: претензии, заявления, жалобы, доверенности, исковые заявления.'
    },
    {
      icon: FileCheck,
      title: 'Проверка договоров',
      description: 'Анализ загруженных договоров с выделением рисков, невыгодных условий и юридических ошибок.'
    },
    {
      icon: BookOpen,
      title: 'База знаний',
      description: 'Актуальная база законов РФ, судебной практики и разъяснений. Автоматическое обновление.'
    },
    {
      icon: ListChecks,
      title: 'Пошаговые инструкции',
      description: 'Готовые алгоритмы действий для типовых ситуаций: увольнение, возврат товара, оспаривание штрафов.'
    },
    {
      icon: Calculator,
      title: 'Калькуляторы',
      description: 'Расчет компенсаций, сроков исковой давности, размера госпошлин, неустоек и штрафов.'
    },
    {
      icon: FolderClock,
      title: 'История обращений',
      description: 'Сохранение всех консультаций и документов. Возможность продолжить диалог с контекстом предыдущих обращений.'
    },
    {
      icon: CreditCard,
      title: 'Платежи и подписка',
      description: 'Freemium-модель: 35 бесплатных запросов, далее подписка. Интеграция ЮKassa, Tinkoff, Stripe.'
    }
  ];

  const services = [
    {
      title: 'Первичная консультация',
      description: 'Быстрый разбор ситуации ассистентом и план действий.',
      price: '0₽'
    },
    {
      title: 'Трудовые споры',
      description: 'Защита прав работников и работодателей в суде и ГИТ.',
      price: 'от 3 500₽'
    },
    {
      title: 'Семейное право',
      description: 'Разводы, алименты, раздел имущества и опека.',
      price: 'от 5 000₽'
    }
  ];

  const testimonials = [
    {
      name: 'Анна Петрова',
      role: 'Предприниматель',
      text: 'Помогли составить претензию к поставщику за 5 минут. Раньше я платила юристам по 5000₽ за каждый документ!',
      avatar: '/avatars/avatar1.jpeg'
    },
    {
      name: 'Дмитрий Соколов',
      role: 'Менеджер',
      text: 'Проверил трудовой договор перед подписанием. AI нашел 3 скрытых пункта, которые могли бы стать проблемой.',
      avatar: '/avatars/avatar2.jpg'
    },
    {
      name: 'Елена Волкова',
      role: 'Домохозяйка',
      text: 'Решила спор с УК по начислению ЖКХ. Платформа дала четкий план действий и все нужные документы.',
      avatar: '/avatars/avatar3.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --color-primary: #634aff;
          --color-primary-hover: #5239d9;
          --color-border: #e8e8e8;
          --color-secondary-bg: #fbfaf9;
          --color-secondary-light: #e0dbff;
          --color-text: #000000;
          --color-text-muted: #949494;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="text-gray-900" size={24} />
              <span className="text-lg font-semibold text-gray-900">Электронный юрист</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm text-gray-900 hover:text-[#634aff] transition">Главная</a>
              <a href="#services" className="text-sm text-gray-900 hover:text-[#634aff] transition">Услуги</a>
              <a href="#lawyers" className="text-sm text-gray-900 hover:text-[#634aff] transition">Юристы</a>
              <a href="#kb" className="text-sm text-gray-900 hover:text-[#634aff] transition">База знаний</a>
              <a href="#faq" className="text-sm text-gray-900 hover:text-[#634aff] transition">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <button className="hidden md:block px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                Войти
              </button>
              <button 
                onClick={onStart}
                className="px-4 py-2 text-sm font-medium text-white bg-[#634aff] rounded-lg hover:bg-[#5239d9] transition"
              >
                Регистрация
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-2 flex flex-col gap-2">
              <a href="#home" className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>Главная</a>
              <a href="#services" className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>Услуги</a>
              <a href="#lawyers" className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>Юристы</a>
              <a href="#kb" className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>База знаний</a>
              <a href="#faq" className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-[1.2fr,1fr] gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Онлайн-юридическая помощь. Быстро, понятно, надёжно.
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Автоматизированная платформа для решения правовых задач любой сложности. 
                Получите консультацию ИИ или найдите профильного юриста за считанные минуты.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onStart}
                  className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-[#634aff] rounded-lg hover:bg-[#5239d9] transition font-medium"
                >
                  <MessageSquare size={18} />
                  Получить консультацию
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium">
                  <Search size={18} />
                  Найти юриста
                </button>
              </div>
            </div>

            <div className="bg-[#fbfaf9] border border-gray-200 rounded-xl p-6">
              <div className="mb-4">
                <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-400">
                  Кратко опишите проблему (например: наследство, ДТП, трудовой спор)
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-400">
                  Выберите область права
                </div>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-400">
                  Формат: чат или звонок
                </div>
              </div>
              <button 
                onClick={onStart}
                className="w-full px-6 py-3 text-white bg-[#634aff] rounded-lg hover:bg-[#5239d9] transition font-medium"
              >
                Отправить запрос
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-t border-gray-200 bg-[#fbfaf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Консультаций проведено', value: '127,450+' },
              { label: 'Документов создано', value: '89,320+' },
              { label: 'Довольных клиентов', value: '45,600+' },
              { label: 'Успешных дел', value: '98.7%' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 md:py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Почему выбирают нас</h2>
            <p className="text-gray-600">Прозрачные условия, понятные ответы, контролируемое качество.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Проверенные юристы</h3>
              <p className="text-gray-600 text-sm">
                Стаж от 3 лет, верификация документов и рейтинг по отзывам клиентов.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Быстрый старт</h3>
              <p className="text-gray-600 text-sm">
                Среднее время ответа — до 10 минут. Чат или консультация по звонку.
              </p>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Фиксированные цены</h3>
              <p className="text-gray-600 text-sm">
                Пакеты без скрытых платежей. Чёткая смета перед началом.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-16 md:py-24 border-t border-gray-200 bg-[#fbfaf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Все что нужно для решения юридических вопросов</h2>
            <p className="text-gray-600">Мощная платформа с полным набором инструментов для работы с документами и консультациями</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-sm transition">
                  <div className="w-12 h-12 bg-[#e0dbff] rounded-lg flex items-center justify-center text-[#634aff] mb-4">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 md:py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Популярные услуги</h2>
            <p className="text-gray-600">Выберите готовое решение или создайте индивидуальный запрос</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-[#634aff]">{service.price}</span>
                  <button className="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyers */}
      <section id="lawyers" className="py-16 md:py-24 border-t border-gray-200 bg-[#fbfaf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Юристы</h2>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-full hover:bg-white transition">
                Все специализации
              </button>
              <button className="px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-full hover:bg-white transition">
                Семейное право
              </button>
              <button className="px-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-full hover:bg-white transition">
                Трудовые споры
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Анна Петрова', specialty: 'Семейное право', experience: '7 лет', avatar: '/avatars/avatar1.jpeg' },
              { name: 'Михаил Орлов', specialty: 'Трудовые споры', experience: '5 лет', avatar: '/avatars/avatar2.jpg' },
              { name: 'Ольга Соколова', specialty: 'Наследство', experience: '9 лет', avatar: '/avatars/avatar3.jpeg' }
            ].map((lawyer, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={lawyer.avatar} 
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs bg-[#e0dbff] text-[#634aff] rounded-md">{lawyer.specialty}</span>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">Опыт {lawyer.experience}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  Профиль
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Отзывы клиентов</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-24 border-t border-gray-200 bg-[#fbfaf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Выберите свой тариф</h2>
            <p className="text-gray-600">Начните с бесплатного плана или получите полный доступ ко всем функциям</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="border-2 border-gray-200 rounded-xl p-8 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Бесплатный</h3>
              <p className="text-gray-600 mb-6">Попробуйте основные функции</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">0₽</span>
                <span className="text-gray-600 ml-2">/ навсегда</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '35 бесплатных запросов',
                  'AI-консультант 24/7',
                  'Генерация простых документов',
                  'Доступ к базе знаний',
                  'История обращений'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="text-[#634aff] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full px-6 py-3 text-gray-900 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Начать бесплатно
              </button>
            </div>

            <div className="border-2 border-[#634aff] rounded-xl p-8 bg-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#634aff] text-white text-xs font-bold rounded-full">
                ПОПУЛЯРНЫЙ
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Премиум</h3>
              <p className="text-gray-600 mb-6">Полный доступ ко всем функциям</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">990₽</span>
                <span className="text-gray-600 ml-2">/ в месяц</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Безлимитные консультации',
                  'Проверка договоров',
                  'Все типы документов',
                  'Приоритетная поддержка',
                  'Экспорт в Word/PDF',
                  'Юридические калькуляторы',
                  'Пошаговые инструкции',
                  'Отчеты и аналитика'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="text-[#634aff] flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={onStart}
                className="w-full px-6 py-3 text-white bg-[#634aff] rounded-lg hover:bg-[#5239d9] transition font-medium"
              >
                Оформить подписку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Часто задаваемые вопросы</h2>
          <div className="grid gap-4">
            {[
              {
                q: 'Как выбрать юриста?',
                a: 'Фильтруйте по специализации и изучайте рейтинг и опыт. Вопрос можно задать до записи.'
              },
              {
                q: 'Сколько стоит консультация?',
                a: 'Есть бесплатный вводный разбор на 35 запросов. Платные пакеты — фиксированная стоимость от 990₽.'
              },
              {
                q: 'Как проходит общение?',
                a: 'Встроенный чат, звонок или видеосвязь по договорённости. Все консультации сохраняются в истории.'
              },
              {
                q: 'Безопасны ли платежи?',
                a: 'Да, используются сертифицированные платёжные провайдеры: ЮKassa, Tinkoff, Stripe.'
              }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t border-gray-200 bg-[#fbfaf9]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Получите 35 бесплатных запросов и решите свой первый юридический вопрос уже сегодня
          </p>
          <button 
            onClick={onStart}
            className="px-8 py-4 text-lg font-medium text-white bg-[#634aff] rounded-lg hover:bg-[#5239d9] transition"
          >
            Попробовать бесплатно
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Не требуется кредитная карта • Доступ сразу после регистрации
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="text-gray-900" size={24} />
                <span className="text-lg font-semibold text-gray-900">Электронный юрист</span>
              </div>
              <p className="text-sm text-gray-600">
                Первая в России платформа, объединяющая искусственный интеллект и экспертизу для вашей юридической защиты.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Разделы</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-sm text-gray-600 hover:text-gray-900">Услуги</a></li>
                <li><a href="#lawyers" className="text-sm text-gray-600 hover:text-gray-900">Юристы</a></li>
                <li><a href="#kb" className="text-sm text-gray-600 hover:text-gray-900">База знаний</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Тарифы</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Поддержка</h3>
              <ul className="space-y-2">
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Контакты</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Политика конфиденциальности</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Оферта</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Связаться</h3>
              <p className="text-sm text-gray-600 mb-2">Бесплатная линия по РФ:</p>
              <p className="text-xl font-bold text-gray-900 mb-4">8 (800) 555-35-35</p>
              <div className="flex gap-3">
                <button className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-700">
                  VK
                </button>
                <button className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-700">
                  TG
                </button>
                <button className="w-10 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-700">
                  YT
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2026 ООО «Электронные юридические системы». Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900">Оферта</a>
              <a href="#" className="hover:text-gray-900">Конфиденциальность</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
