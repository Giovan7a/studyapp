/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studyApi } from '../api';
import type { Flashcard } from '../api';
import { 
  GraduationCap, 
  Layers, 
  BrainCircuit, 
  BookOpen, 
  ArrowRight,
  TrendingUp,
  Award,
  User,
  Calendar,
  Sparkles,
  Timer
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>([]);

  async function fetchCards() {
    try {
      const res = await studyApi.getFlashcards();
      setCards(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCards();
  }, []);

  const learnedCount = cards.filter(c => c.is_learned).length;
  const totalCards = cards.length;
  const progress = totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 glass-panel border-r border-white/20 dark:border-slate-700/50 p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">StudyApp</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4">
          <p className="text-xs font-semibold opacity-50 uppercase tracking-wider mb-2">Menu Principal</p>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-brand/10 text-brand font-bold shadow-inner border border-brand/20">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} />
              <span>Início</span>
            </div>
          </div>

          <Link 
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80 hover:opacity-100"
          >
            <BrainCircuit size={18} />
            <span>Estudar Flashcards</span>
          </Link>
          
          <Link 
            to="/schedule"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80 hover:opacity-100 mt-2"
          >
            <Calendar size={18} />
            <span>Cronograma Semanal</span>
          </Link>

          <Link 
            to="/pomodoro"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80 hover:opacity-100 mt-2"
          >
            <Timer size={18} />
            <span>Timer Pomodoro</span>
          </Link>

          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80 hover:opacity-100 mt-2"
            >
              <Layers size={18} />
              <span>Painel Admin</span>
            </Link>
          )}

          <Link 
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 font-medium opacity-80 hover:opacity-100 mt-auto"
          >
            <User size={18} />
            <span>Perfil e Configurações</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full z-10">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold mb-3 animate-pulse-slow">
              <Sparkles size={14} className="fill-brand" />
              Sua central de estudos
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Olá, {user?.username}! 👋
            </h2>
            <p className="opacity-70 mt-2 text-base font-medium">O que vamos aprender hoje?</p>
          </div>
        </header>

        {/* Progress Overview */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-brand via-brand/80 to-purple-600 rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-2xl shadow-brand/20 text-white border border-white/20 hover:scale-[1.01] transition-transform duration-500">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/30">
                    <Award size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Progresso Global</h3>
                </div>
                
                <p className="opacity-90 mb-6 max-w-md text-base leading-relaxed font-medium">
                  Você já dominou <strong className="text-yellow-300 text-lg">{learnedCount}</strong> de {totalCards} flashcards no total. Continue assim!
                </p>

                <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden mb-2 border border-white/10 shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full rounded-full transition-all duration-1000 ease-out relative" 
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold opacity-90">
                  <span className="text-yellow-300">{progress}% Concluído</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="w-full md:w-auto flex-shrink-0">
                <Link 
                  to="/dashboard"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand px-6 py-3.5 rounded-xl font-extrabold text-base hover:bg-slate-50 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95"
                >
                  Continuar Estudando
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Acesso Rápido</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link 
              to="/pomodoro"
              className="group glass-panel p-6 rounded-2xl transition-all flex flex-col gap-3 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/20 border border-white/20 dark:border-slate-700/50"
            >
              <div className="bg-brand/10 text-brand p-3 rounded-xl group-hover:bg-brand group-hover:text-white transition-all w-12 h-12 flex items-center justify-center shadow-inner">
                <Timer size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Timer Pomodoro</h4>
                <p className="text-sm opacity-70 font-medium leading-relaxed">Bloqueie distrações e foque em blocos de 25 minutos.</p>
              </div>
            </Link>

            <Link 
              to="/schedule"
              className="group glass-panel p-6 rounded-2xl transition-all flex flex-col gap-3 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/20 border border-white/20 dark:border-slate-700/50"
            >
              <div className="bg-brand/10 text-brand p-3 rounded-xl group-hover:bg-brand group-hover:text-white transition-all w-12 h-12 flex items-center justify-center shadow-inner">
                <Calendar size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Meu Cronograma</h4>
                <p className="text-sm opacity-70 font-medium leading-relaxed">Planeje sua semana arrastando as matérias.</p>
              </div>
            </Link>

            <Link 
              to="/dashboard"
              className="group glass-panel p-6 rounded-2xl transition-all flex flex-col gap-3 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/20 border border-white/20 dark:border-slate-700/50"
            >
              <div className="bg-brand/10 text-brand p-3 rounded-xl group-hover:bg-brand group-hover:text-white transition-all w-12 h-12 flex items-center justify-center shadow-inner">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold mb-1">Flashcards</h4>
                <p className="text-sm opacity-70 font-medium leading-relaxed">Revise ativamente para memorizar mais.</p>
              </div>
            </Link>

            {user?.role === 'admin' ? (
              <Link 
                to="/admin"
                className="group glass-panel p-6 rounded-2xl transition-all flex flex-col gap-3 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand/20 border border-white/20 dark:border-slate-700/50"
              >
                <div className="bg-brand/10 text-brand p-3 rounded-xl group-hover:bg-brand group-hover:text-white transition-all w-12 h-12 flex items-center justify-center shadow-inner">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Painel Admin</h4>
                  <p className="text-sm opacity-70 font-medium leading-relaxed">Gerencie as matérias de todos os alunos.</p>
                </div>
              </Link>
            ) : (
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 opacity-60 border border-white/20 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-full blur-xl"></div>
                <div className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 p-3 rounded-xl w-12 h-12 flex items-center justify-center shadow-inner relative z-10">
                  <BookOpen size={24} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold mb-1">Novidades</h4>
                  <p className="text-sm font-medium leading-relaxed">Mais ferramentas chegarão em breve.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
