/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyApi } from '../api';
import type { Subject, Flashcard } from '../api';
import { 
  CircleCheck,
  Circle,
  Menu,
  ChevronLeft,
  ChevronRight,
  Play,
  Layers,
  BookOpen
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  async function fetchData() {
    try {
      const [subjectsRes, cardsRes] = await Promise.all([
        studyApi.getSubjects(),
        studyApi.getFlashcards()
      ]);
      
      let filteredSubjects = subjectsRes.data;
      if (user?.role !== 'admin') {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user?.username}`) || '[]');
        filteredSubjects = filteredSubjects.filter(s => mySubjects.includes(s.id));
        if (filteredSubjects.length === 0) {
           filteredSubjects = subjectsRes.data.slice(0, 5);
        }
      }
      setSubjects(filteredSubjects);
      setCards(cardsRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear();

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Mocks para simular os novos componentes
  const mockTasks = subjects.slice(0, 3).map((sub, i) => ({
    id: i,
    title: `Estudar ${sub.name}`,
    time: i === 0 ? "08:00 - 10:00 AM" : i === 1 ? "11:00 - 12:00 AM" : "13:00 - 15:00 PM",
    done: i === 2
  }));

  return (
    <div className="flex flex-col xl:flex-row gap-12 w-full">
      
      {/* Left Column: Meus Cursos & Today Task */}
      <div className="flex-1 flex flex-col max-w-4xl xl:ml-8">
        
        {/* Mobile Notification Card */}
        <section className="xl:hidden mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Notification</h3>
            <span className="text-sm font-bold text-[#f6c464] cursor-pointer hover:underline">View all</span>
          </div>
          
          <div className="bg-[#5c418c] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-purple-900/10">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 border-[20px] border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute right-5 bottom-5 w-20 h-20 border-[2px] border-white/10 rounded-full pointer-events-none"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl h-max border border-white/20">
                <Play size={20} className="fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-base leading-snug mb-1">Atenção! Você tem tarefas pendentes hoje.</h4>
                <p className="text-xs text-purple-200 mb-4 opacity-80">18 Aug 2026 - 10:00 AM</p>
                <button className="bg-[#f6c464] text-[#4c3575] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                  Estudar Agora
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Meus Cursos */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Meus Cursos
            </h2>
            <button className="text-sm font-bold text-[#f6c464] hover:underline">Ver todos</button>
          </div>

          <div className="flex flex-col gap-3">
            {subjects.slice(0, 4).map((sub, i) => {
              const progress = [75, 40, 100, 15][i] || 0;
              return (
                <div key={sub.id} className="bg-[#fcfcff] p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 group hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-[#f2eff8] flex items-center justify-center text-[#4c3575] shrink-0">
                    <BookOpen size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4c3575] transition-colors">{sub.name}</h3>
                    <p className="text-xs font-medium text-slate-500">Intermediário</p>
                  </div>
                  
                  <div className="w-full sm:w-40">
                    <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                      <span className="text-slate-500">Progresso</span>
                      <span className="text-[#4c3575]">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#f6c464] h-full rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {subjects.length === 0 && (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <p className="font-bold text-slate-400 text-sm">Nenhum curso encontrado.</p>
              </div>
            )}
          </div>
        </section>

        {/* Today Task */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Today Task <span className="text-slate-400 text-base font-medium">({mockTasks.length})</span>
            </h2>
            <button className="p-1 rounded-full text-[#4c3575] hover:bg-[#f2eff8] transition-colors">
              <Menu size={20} />
            </button>
          </div>

          <div className="bg-[#fcfcff] border border-slate-100 rounded-2xl p-5 flex flex-col gap-4">
            {mockTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 group cursor-pointer">
                <div className="text-[#4c3575]">
                  {task.done ? <CircleCheck size={22} className="fill-[#e9e4f5]" /> : <Circle size={22} className="text-[#a491c9]" />}
                </div>
                <span className={`flex-1 text-base font-medium transition-colors ${task.done ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-[#4c3575]'}`}>
                  {task.title}
                </span>
                <span className="text-[10px] font-bold text-[#8a72be] uppercase tracking-wider hidden sm:block">
                  {task.time}
                </span>
              </div>
            ))}
            {mockTasks.length === 0 && (
              <p className="text-slate-500 text-center py-2 text-sm">Sem tarefas para hoje!</p>
            )}
          </div>
        </section>
        
      </div>

      {/* Right Column: Calendar & Notification */}
      <div className="w-full xl:w-[22rem] flex flex-col gap-10 xl:ml-auto">
        
        {/* Small Calendar */}
        <section className="bg-[#fcfcff] border border-slate-100 p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">
              {currentMonthName}, {currentYear}
            </h3>
            <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors bg-white rounded-lg shadow-sm border border-slate-100"><ChevronLeft size={18}/></button>
                <button onClick={nextMonth} className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors bg-white rounded-lg shadow-sm border border-slate-100"><ChevronRight size={18}/></button>
            </div>
          </div>
          
          <div className="w-full">
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day, idx) => (
                <div key={idx} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
              {blanks.map((_, i) => (
                <div key={`blank-${i}`} className="h-8"></div>
              ))}
              {days.map(day => {
                const isToday = isCurrentMonth && day === today.getDate();
                return (
                  <div key={day} className="h-8 flex items-center justify-center">
                    <div 
                      className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-all cursor-pointer
                        ${isToday 
                          ? 'bg-[#f6c464] text-white font-bold shadow-md shadow-yellow-500/20' 
                          : 'text-slate-600 hover:bg-[#f2eff8] font-medium'}`}
                    >
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Notification Card */}
        <section className="hidden xl:block">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">Notification</h3>
            <span className="text-sm font-bold text-[#f6c464] cursor-pointer hover:underline">View all</span>
          </div>
          
          <div className="bg-[#5c418c] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-purple-900/10">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 border-[20px] border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute right-5 bottom-5 w-20 h-20 border-[2px] border-white/10 rounded-full pointer-events-none"></div>
            
            <div className="flex gap-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl h-max border border-white/20">
                <Play size={20} className="fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-base leading-snug mb-1">Atenção! Você tem tarefas pendentes hoje.</h4>
                <p className="text-xs text-purple-200 mb-4 opacity-80">18 Aug 2026 - 10:00 AM</p>
                <button className="bg-[#f6c464] text-[#4c3575] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                  Estudar Agora
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
