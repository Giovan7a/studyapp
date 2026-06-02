import { Link } from 'react-router-dom';
import { GraduationCap, BrainCircuit, BookOpen, Star, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand/20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 glass-panel sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StudyApp</h1>
        </div>
        <div>
          <Link 
            to="/login"
            className="text-sm font-semibold text-brand hover:opacity-80 bg-brand/10 hover:bg-brand/20 px-5 py-2.5 rounded-xl transition-colors"
          >
            Entrar na Plataforma
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative">
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex-1 text-center md:text-left space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-bold mb-2 animate-bounce hover:scale-105 transition-transform cursor-default">
            <Star size={16} className="fill-brand" />
            Nova versão 2.0 disponível!
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Estude de forma <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand via-purple-500 to-brand bg-[length:200%_auto] animate-gradient">
              inteligente e imersiva
            </span>
          </h2>
          <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
            Organize suas matérias, monte seu cronograma semanal e crie flashcards com repetição espaçada. O método comprovado para tirar 10.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
            <Link 
              to="/login"
              className="flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 hover:-translate-y-1 transition-all shadow-xl shadow-brand/30"
            >
              Começar Gratuitamente
              <ChevronRight size={20} />
            </Link>
            <a 
              href="#recursos"
              className="flex items-center gap-2 glass-panel px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all border border-slate-200 dark:border-slate-700"
            >
              Conhecer Recursos
            </a>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg md:max-w-none mt-16 md:mt-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/30 to-purple-500/20 rounded-[3rem] rotate-6 scale-105 -z-10 blur-xl"></div>
          
          {/* Main Mockup Card */}
          <div className="glass-panel p-8 rounded-3xl relative z-10 border border-white/40 dark:border-slate-700/60 shadow-2xl backdrop-blur-xl hover:scale-[1.02] transition-transform duration-500">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
              <div className="w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shadow-inner">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="font-extrabold text-xl">Sessão de Estudos</h3>
                <p className="text-sm opacity-60 font-medium">Revisão diária ativa</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="bg-white/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm animate-pulse-slow">
                <p className="text-xs font-bold uppercase tracking-wider text-brand mb-2">Biologia</p>
                <p className="font-semibold text-lg text-slate-800 dark:text-slate-100">O que é a mitocôndria?</p>
              </div>
              <div className="bg-gradient-to-br from-brand to-brand/80 p-5 rounded-2xl shadow-xl shadow-brand/20 text-white transform rotate-2 relative left-4 hover:rotate-0 transition-transform cursor-pointer">
                <p className="font-bold text-lg">É a organela responsável pela respiração celular.</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                  <Star size={14} className="fill-white" />
                  <p className="text-xs font-medium">Você acertou este card 3 vezes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badge 1 */}
          <div className="absolute -left-12 top-10 glass-panel p-4 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-xl z-20 animate-float">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 text-green-500 p-2 rounded-lg">
                <Star size={20} className="fill-green-500" />
              </div>
              <div>
                <p className="text-xs opacity-60 font-medium">Progresso</p>
                <p className="font-bold text-sm">100% Concluído</p>
              </div>
            </div>
          </div>

          {/* Floating Badge 2 */}
          <div className="absolute -right-8 bottom-20 glass-panel p-4 rounded-2xl border border-white/30 dark:border-slate-700/50 shadow-xl z-20 animate-float" style={{ animationDelay: '1.5s' }}>
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 text-purple-500 p-2 rounded-lg">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">+5 Matérias</p>
                <p className="text-xs opacity-60 font-medium">Hoje</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-brand uppercase">Plataforma Completa</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold">Tudo o que você precisa <br/> para tirar 10</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 border border-white/20 dark:border-slate-700/50 group">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-brand group-hover:text-white">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cronograma Semanal</h3>
              <p className="opacity-70 leading-relaxed font-medium">Monte sua agenda arrastando e soltando matérias nos dias da semana. Uma organização perfeita para a sua rotina.</p>
            </div>
            <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 border border-white/20 dark:border-slate-700/50 group">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-brand group-hover:text-white">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Flashcards e SR</h3>
              <p className="opacity-70 leading-relaxed font-medium">Crie cartões de pergunta e resposta. Nosso algoritmo inteligente de Repetição Espaçada decide quando você deve revisar.</p>
            </div>
            <div className="glass-panel p-10 rounded-[2rem] hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 border border-white/20 dark:border-slate-700/50 group">
              <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-brand group-hover:text-white">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Metas e Progresso</h3>
              <p className="opacity-70 leading-relaxed font-medium">Bata sua meta diária limpando as revisões atrasadas do dia. Ganhe confiança visualizando sua barra de progresso encher.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
