import { Link } from 'react-router-dom';
import { GraduationCap, BrainCircuit, BookOpen, Star, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">StudyApp</h1>
        </div>
        <div>
          <Link 
            to="/login"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors"
          >
            Entrar na Plataforma
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-2">
            <Star size={16} className="fill-blue-500" />
            Do Fundamental ao Ensino Médio
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Estude de forma <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              inteligente e divertida
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto md:mx-0 leading-relaxed">
            Organize suas matérias, crie flashcards e prepare-se para o ENEM e provas escolares de um jeito que funciona para você.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <Link 
              to="/login"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200"
            >
              Começar Agora
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg md:max-w-none mt-10 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl rotate-3 scale-105 -z-10"></div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Flashcards Ativos</h3>
                <p className="text-sm text-slate-500">Memorização espaçada</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 animate-pulse-slow">
                <p className="text-sm text-slate-400 mb-1">Ciências da Natureza</p>
                <p className="font-semibold text-slate-700">Qual a fórmula da velocidade média?</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-xl shadow-lg text-white transform -rotate-1 relative left-4">
                <p className="font-semibold">Vm = ΔS / Δt</p>
                <p className="text-xs text-blue-200 mt-2">Clique para virar o card</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tudo o que você precisa para tirar 10</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Matérias Organizadas</h3>
              <p className="text-slate-500">Separe seus estudos por áreas do conhecimento, do Fundamental ao Ensino Médio.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Estudo Ativo</h3>
              <p className="text-slate-500">Crie perguntas e respostas para testar sua memória e garantir o aprendizado real.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Progresso Visível</h3>
              <p className="text-slate-500">Marque os cards como aprendidos e veja sua barra de progresso encher a cada dia.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
