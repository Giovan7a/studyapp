import React, { useState, useEffect } from 'react';
import { studyApi } from '../api';
import type { Subject, StudySchedule } from '../api';
import { Calendar, Trash2, ChevronLeft, GraduationCap, GripVertical } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];

export default function Schedule() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDragStart = (e: React.DragEvent, subjectId: number) => {
    e.dataTransfer.setData('subjectId', subjectId.toString());
  };

  const handleDrop = async (e: React.DragEvent, dayIdx: number) => {
    e.preventDefault();
    const subjectIdStr = e.dataTransfer.getData('subjectId');
    if (!subjectIdStr) return;
    const subjectId = parseInt(subjectIdStr);

    // Check if it's already scheduled for this day
    const alreadyScheduled = schedules.find(s => s.subject === subjectId && s.day_of_week === dayIdx);
    if (alreadyScheduled) return;

    try {
      await studyApi.createSchedule({ subject: subjectId, day_of_week: dayIdx });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      await studyApi.deleteSchedule(scheduleId);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <div className="animate-pulse flex flex-col items-center gap-4 opacity-50">
          <Calendar size={48} className="text-brand" />
          <span>Carregando Cronograma...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Voltar ao Dashboard
        </button>
        <div className="font-semibold flex items-center gap-2">
          <Calendar size={20} className="text-brand" />
          Cronograma Semanal
        </div>
        <div className="w-20"></div> {/* Spacer */}
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Subjects Pool */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="glass-panel p-6 rounded-2xl sticky top-24 border border-white/20 dark:border-slate-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand/10 p-2 rounded-xl text-brand">
                <GraduationCap size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Matérias</h2>
                <p className="text-xs opacity-60">Arraste-as para o calendário</p>
              </div>
            </div>

            {subjects.length === 0 ? (
              <div className="text-center opacity-50 text-sm py-4">
                Nenhuma matéria cadastrada.<br/>
                <Link to="/admin" className="text-brand hover:underline mt-2 inline-block">Criar no Painel</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
                {subjects.map(subject => (
                  <div
                    key={subject.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, subject.id)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 shadow-sm cursor-grab active:cursor-grabbing hover:border-brand/50 transition-colors group"
                  >
                    <GripVertical size={16} className="opacity-30 group-hover:opacity-100" />
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: subject.color }}></div>
                    <span className="font-semibold select-none text-slate-800 dark:text-slate-100">{subject.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Calendar Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS.map((dayName, idx) => {
            const daySchedules = schedules.filter(s => s.day_of_week === idx);
            const isToday = new Date().getDay() - 1 === idx || (new Date().getDay() === 0 && idx === 6);

            return (
              <div 
                key={idx}
                onDrop={(e) => handleDrop(e, idx)}
                onDragOver={handleDragOver}
                className={`glass-panel p-5 rounded-2xl border transition-colors flex flex-col min-h-[250px] ${
                  isToday 
                    ? 'border-brand shadow-lg shadow-brand/10' 
                    : 'border-white/20 dark:border-slate-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700/50">
                  <h3 className={`font-bold ${isToday ? 'text-brand' : ''}`}>{dayName}</h3>
                  {isToday && <span className="text-[10px] font-bold uppercase tracking-wider bg-brand text-white px-2 py-1 rounded-md">Hoje</span>}
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  {daySchedules.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl opacity-40 text-sm">
                      Solte aqui
                    </div>
                  ) : (
                    daySchedules.map(schedule => {
                      const subject = subjects.find(s => s.id === schedule.subject);
                      if (!subject) return null;

                      return (
                        <div 
                          key={schedule.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: subject.color }}></div>
                            <span className="font-medium text-sm truncate">{subject.name}</span>
                          </div>
                          <button 
                            onClick={() => handleDelete(schedule.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-all flex-shrink-0"
                            title="Remover do dia"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
