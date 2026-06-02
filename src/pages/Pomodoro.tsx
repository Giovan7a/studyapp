import { useState, useEffect, useRef } from 'react';
import { studyApi } from '../api';
import type { Subject } from '../api';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, ChevronLeft, Timer, BrainCircuit, Maximize } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POMODORO_MINUTES = 25;
const POMODORO_SECONDS = POMODORO_MINUTES * 60;

export default function Pomodoro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  
  const [timeLeft, setTimeLeft] = useState(POMODORO_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const timerRef = useRef<number | null>(null);

  const FUNDAMENTAL_1_SUBJECTS = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física'];
  const FUNDAMENTAL_2_MEDIO_SUBJECTS = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês', 'Literatura', 'Redação'];

  useEffect(() => {
    studyApi.getSubjects().then(res => {
      let filtered = res.data;
      if (user?.role !== 'admin') {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user?.username}`) || '[]');
        if (user?.educationLevel === 'fundamental1') {
          filtered = res.data.filter(s => FUNDAMENTAL_1_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'fundamental2_medio') {
          filtered = res.data.filter(s => FUNDAMENTAL_2_MEDIO_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'faculdade') {
          filtered = res.data.filter(s => mySubjects.includes(s.id));
        }
      }
      setSubjects(filtered);
    }).catch(console.error);
  }, [user]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!selectedSubject) {
      alert("Selecione uma matéria antes de começar!");
      return;
    }
    setIsActive(!isActive);
  };

  const handleComplete = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      await studyApi.createSession({
        subject: selectedSubject as number,
        duration_minutes: POMODORO_MINUTES
      });
      setSessionCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar sessão de estudo.");
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(POMODORO_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((POMODORO_SECONDS - timeLeft) / POMODORO_SECONDS) * 100;

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center">
        <button 
          onClick={() => setIsFullScreen(false)}
          className="absolute top-8 left-8 opacity-50 hover:opacity-100 flex items-center gap-2"
        >
          <ChevronLeft /> Sair do Modo Foco
        </button>
        
        <div className="text-[15vw] font-black tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex gap-6 mt-12">
          <button 
            onClick={toggleTimer}
            className="w-20 h-20 rounded-full bg-brand flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-brand/20"
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          <button 
            onClick={handleStop}
            className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors"
          >
            <Square size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <header className="glass-panel px-6 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-white/20 dark:border-slate-700/50">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar ao Início
        </button>
        <div className="font-semibold flex items-center gap-2">
          <Timer size={20} className="text-brand" />
          Timer Pomodoro
        </div>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {sessionCompleted ? (
          <div className="glass-panel p-12 rounded-[2rem] text-center max-w-lg w-full border border-white/20 dark:border-slate-700/50 shadow-2xl animate-in fade-in zoom-in">
            <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Sessão Concluída!</h2>
            <p className="opacity-70 text-lg mb-8">
              Você manteve o foco por {POMODORO_MINUTES} minutos. Esse tempo já foi adicionado às suas estatísticas.
            </p>
            <button 
              onClick={() => {
                setSessionCompleted(false);
                setTimeLeft(POMODORO_SECONDS);
              }}
              className="bg-brand text-white px-8 py-4 rounded-xl font-bold w-full hover:opacity-90 transition-opacity shadow-xl shadow-brand/20"
            >
              Iniciar Novo Ciclo
            </button>
          </div>
        ) : (
          <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] w-full max-w-xl border border-white/20 dark:border-slate-700/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-full mb-10">
                <label className="block text-sm font-bold opacity-70 mb-2 text-center uppercase tracking-wider">O que você vai estudar agora?</label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(Number(e.target.value))}
                  disabled={isActive}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl p-4 text-center font-bold text-lg focus:ring-2 focus:ring-brand appearance-none shadow-inner"
                >
                  <option value="" disabled>Selecione a matéria</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* Timer Display */}
              <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle 
                    cx="128" cy="128" r="120" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    className="opacity-10"
                  />
                  <circle 
                    cx="128" cy="128" r="120" 
                    fill="none" 
                    stroke="var(--color-brand)" 
                    strokeWidth="8" 
                    strokeDasharray={120 * 2 * Math.PI}
                    strokeDashoffset={(120 * 2 * Math.PI) * (1 - progress / 100)}
                    className="transition-all duration-1000 ease-linear"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-6xl font-black tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-6 w-full justify-center">
                <button 
                  onClick={handleStop}
                  disabled={!isActive && timeLeft === POMODORO_SECONDS}
                  className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-60 hover:opacity-100 hover:text-red-500 transition-all disabled:opacity-30"
                  title="Parar"
                >
                  <Square size={20} />
                </button>
                
                <button 
                  onClick={toggleTimer}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl shadow-brand/20 ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-brand hover:bg-brand-hover hover:scale-105'}`}
                >
                  {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
                </button>

                <button 
                  onClick={() => setIsFullScreen(true)}
                  className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center opacity-60 hover:opacity-100 transition-all"
                  title="Modo Foco (Tela Cheia)"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
