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
  User
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await studyApi.getFlashcards();
      setCards(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const learnedCount = cards.filter(c => c.is_learned).length;
  const totalCards = cards.length;
  const progress = totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyApp</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</p>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} />
              <span>Início</span>
            </div>
          </div>

          <Link 
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg transition-all text-slate-600 hover:bg-slate-100"
          >
            <BrainCircuit size={18} />
            <span>Estudar Flashcards</span>
          </Link>
          
          {user?.role === 'admin' && (
            <Link 
              to="/admin"
              className="flex items-center gap-3 p-3 rounded-lg transition-all text-slate-600 hover:bg-slate-100 mt-2"
            >
              <Layers size={18} />
              <span>Painel Admin</span>
            </Link>
          )}

          <Link 
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg transition-all text-slate-600 hover:bg-slate-100 mt-auto"
          >
            <User size={18} />
            <span>Perfil e Configurações</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Olá, {user?.username}! 👋
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Bem-vindo(a) de volta à sua central de estudos.</p>
        </header>

        {/* Progress Overview */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <Award size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Seu Progresso Global</h3>
                </div>
                
                <p className="text-slate-600 mb-6 max-w-md">
                  Você já dominou <strong>{learnedCount}</strong> de {totalCards} flashcards no total. Continue assim para alcançar a nota máxima!
                </p>

                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-blue-600">{progress}% Concluído</span>
                  <span className="text-slate-400">100%</span>
                </div>
              </div>

              <div className="w-full md:w-auto flex-shrink-0">
                <Link 
                  to="/dashboard"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
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
          <h3 className="text-xl font-bold text-slate-800 mb-6">Acesso Rápido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/dashboard"
              className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all flex items-start gap-4"
            >
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Meus Flashcards</h4>
                <p className="text-sm text-slate-500">Revise suas matérias e teste seus conhecimentos agora mesmo.</p>
              </div>
            </Link>

            {user?.role === 'admin' ? (
              <Link 
                to="/admin"
                className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 transition-all flex items-start gap-4"
              >
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Layers size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Painel Admin</h4>
                  <p className="text-sm text-slate-500">Gerencie as matérias disponíveis para os alunos do sistema.</p>
                </div>
              </Link>
            ) : (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4 opacity-70">
                <div className="bg-slate-200 text-slate-500 p-3 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 mb-1">Novidades em Breve</h4>
                  <p className="text-sm text-slate-500">Mais ferramentas de estudo chegarão nas próximas atualizações.</p>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
