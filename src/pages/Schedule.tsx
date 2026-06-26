import React, { useState, useEffect } from 'react';
import { studyApi } from '../api';
import type { Subject, StudySchedule } from '../api';
import { Calendar as CalendarIcon, Trash2, Filter, Plus, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Schedule() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // For the Add Option Modal
  const [addingToDayIdx, setAddingToDayIdx] = useState<number | null>(null);

  // We need to shift so Monday is 0
  const jsDay = new Date().getDay();
  const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1; 

  const FUNDAMENTAL_1_SUBJECTS = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física'];
  const FUNDAMENTAL_2_MEDIO_SUBJECTS = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês', 'Literatura', 'Redação'];

  async function loadData() {
    try {
      setLoading(true);
      const [subs, scheds] = await Promise.all([
        studyApi.getSubjects(),
        studyApi.getSchedule()
      ]);
      let filtered = subs.data;
      if (user?.role !== 'admin') {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user?.username}`) || '[]');
        if (user?.educationLevel === 'fundamental1') {
          filtered = subs.data.filter(s => FUNDAMENTAL_1_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'fundamental2_medio') {
          filtered = subs.data.filter(s => FUNDAMENTAL_2_MEDIO_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'faculdade') {
          filtered = subs.data.filter(s => mySubjects.includes(s.id));
        }
      }
      setSubjects(filtered);
      setSchedules(scheds.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSchedule = async (subjectId: number) => {
    if (addingToDayIdx === null) return;
    
    const alreadyScheduled = schedules.find(s => s.subject === subjectId && s.day_of_week === addingToDayIdx);
    if (!alreadyScheduled) {
      try {
        await studyApi.createSchedule({ subject: subjectId, day_of_week: addingToDayIdx });
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
    setAddingToDayIdx(null); // Close modal
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      await studyApi.deleteSchedule(scheduleId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dateObj = new Date();
  const currentMonth = monthNames[dateObj.getMonth()];
  const currentYear = dateObj.getFullYear();
  const currentDateNum = dateObj.getDate();

  // Fake numbers for calendar UI (simulating the current week's dates)
  const getDatesForCurrentWeek = () => {
    const dates = [];
    const curr = new Date();
    const first = curr.getDate() - curr.getDay() + 1; // Monday
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.getTime());
      next.setDate(first + i);
      dates.push(next.getDate().toString().padStart(2, '0'));
    }
    return dates;
  };
  const weekDates = getDatesForCurrentWeek();

  // Function to map subjects to pastel colors
  const getPastelColor = (name: string) => {
    const colors = [
      'bg-pink-50 text-pink-700',
      'bg-blue-50 text-blue-700',
      'bg-green-50 text-green-700',
      'bg-orange-50 text-orange-700',
      'bg-purple-50 text-purple-700'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 opacity-50">
          <CalendarIcon size={48} className="text-[#4c3575]" />
          <span className="font-bold text-slate-500">Loading Calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f8f9fc] rounded-[2.5rem] flex flex-col overflow-hidden relative">
      
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between py-6 px-8 bg-white border-b border-slate-100 gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Schedule
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl">
          <button className="text-slate-400 hover:text-slate-700">{"<"}</button>
          <span className="font-bold text-slate-700 mx-2">{currentMonth}, {currentYear}</span>
          <button className="text-slate-400 hover:text-slate-700">{">"}</button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2.5 border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 bg-white">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Main Content: Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DAYS.map((day, idx) => {
            const daySchedules = schedules.filter(s => s.day_of_week === idx);
            const isToday = idx === currentDayIdx;

            return (
              <div 
                key={idx}
                className={`flex flex-col bg-white rounded-3xl p-5 shadow-sm border ${isToday ? 'border-[#5d6bf8] shadow-blue-500/10' : 'border-slate-100'}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${isToday ? 'text-[#5d6bf8]' : 'text-slate-900'}`}>{weekDates[idx]}</span>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isToday ? 'text-[#5d6bf8]' : 'text-slate-700'}`}>{day}</span>
                      {isToday && <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d6bf8] opacity-80">Today</span>}
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-md">{daySchedules.length} Items</span>
                </div>
                
                {/* Scheduled Items */}
                <div className="flex-1 flex flex-col gap-3 min-h-[120px]">
                  {daySchedules.map(schedule => {
                    const subject = subjects.find(s => s.id === schedule.subject);
                    if (!subject) return null;
                    
                    const cardStyle = getPastelColor(subject.name);

                    return (
                      <div 
                        key={schedule.id}
                        className={`p-4 rounded-2xl flex flex-col gap-2 group relative transition-transform hover:-translate-y-1 hover:shadow-md ${cardStyle}`}
                      >
                        <span className="font-bold text-sm leading-tight pr-5">{subject.name}</span>
                        <div className="flex items-center gap-1.5 opacity-70">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold">10:30 - 12:00</span>
                        </div>
                        <button 
                          onClick={() => handleDelete(schedule.id)}
                          className="absolute top-3 right-3 opacity-0 md:group-hover:opacity-100 md:opacity-0 opacity-100 hover:text-black transition-opacity bg-white/50 p-1.5 rounded-full"
                          title="Remover do calendário"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                  {daySchedules.length === 0 && (
                    <div className="flex-1 flex items-center justify-center flex-col gap-2 opacity-50 py-6">
                      <CalendarIcon size={32} className="text-slate-300" />
                      <span className="text-xs font-bold text-slate-400">Sem atividades</span>
                    </div>
                  )}
                </div>

                {/* Add Option Button */}
                <button 
                  onClick={() => setAddingToDayIdx(idx)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-[#5d6bf8] hover:text-[#5d6bf8] hover:bg-blue-50 transition-colors"
                >
                  <Plus size={16} />
                  Adicionar Matéria
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Adicionar Matéria */}
      {addingToDayIdx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative flex flex-col max-h-[80vh]">
            <button 
              onClick={() => setAddingToDayIdx(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Adicionar Matéria</h2>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Selecione a matéria para adicionar na {DAYS[addingToDayIdx]}.
            </p>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
              {subjects.length === 0 ? (
                <p className="text-center text-slate-400 font-bold py-10">Você não possui matérias cadastradas.</p>
              ) : (
                subjects.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleAddSchedule(subject.id)}
                    className="flex items-center gap-4 w-full p-4 text-left border border-slate-100 rounded-2xl hover:border-[#5d6bf8] hover:shadow-md transition-all group"
                  >
                    <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: subject.color }}></div>
                    <span className="font-bold text-slate-700 group-hover:text-[#5d6bf8]">{subject.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
