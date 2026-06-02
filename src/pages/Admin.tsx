/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyApi } from '../api';
import type { Subject } from '../api';
import { GraduationCap, ArrowLeft, Plus, Trash2, Layers, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const { user } = useAuth();

  const FUNDAMENTAL_1_SUBJECTS = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física'];
  const FUNDAMENTAL_2_MEDIO_SUBJECTS = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês', 'Literatura', 'Redação'];
  const DEFAULT_SUBJECTS = Array.from(new Set([...FUNDAMENTAL_1_SUBJECTS, ...FUNDAMENTAL_2_MEDIO_SUBJECTS]));

  async function fetchSubjects() {
    try {
      const res = await studyApi.getSubjects();
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
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      const response = await studyApi.createSubject({ 
        name: newSubjectName,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
      if (user) {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user.username}`) || '[]');
        mySubjects.push(response.data.id);
        localStorage.setItem(`my_subjects_${user.username}`, JSON.stringify(mySubjects));
      }
      setNewSubjectName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    const subjectToDelete = subjects.find(s => s.id === id);
    if (user?.role !== 'admin' && subjectToDelete && DEFAULT_SUBJECTS.includes(subjectToDelete.name)) {
      return; // Previne exclusão de matérias padrão
    }
    try {
      await studyApi.deleteSubject(id);
      if (user) {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user.username}`) || '[]');
        const newMySubjects = mySubjects.filter((sId: number) => sId !== id);
        localStorage.setItem(`my_subjects_${user.username}`, JSON.stringify(newMySubjects));
      }
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 glass-panel border-r border-white/20 dark:border-slate-700/50 p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{user?.role === 'admin' ? 'Admin Panel' : 'Minhas Matérias'}</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-lg bg-brand/10 text-brand font-medium mt-4">
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Matérias</span>
            </div>
          </div>

          <Link 
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800 mt-auto"
          >
            <User size={18} />
            <span>Perfil e Configurações</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full z-10">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Matérias</h2>
          <p className="opacity-70 mt-1">
            {user?.role === 'admin' ? 'Crie ou remova as matérias disponíveis para os alunos.' : 'Crie ou remova suas próprias matérias.'}
          </p>
        </header>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={handleAddSubject} className="flex gap-4 mb-8">
            <input 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1 bg-transparent border border-slate-300 dark:border-slate-600 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
              placeholder="Nome da nova matéria (Ex: História Geral)..."
              required
            />
            <button 
              type="submit"
              className="bg-brand text-white rounded-xl px-6 py-4 font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </form>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {user?.role === 'admin' ? 'Matérias Existentes' : 'Suas Matérias'}
            </h3>
            {subjects.length === 0 ? (
              <div className="text-center py-10 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                <Layers className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="font-medium opacity-60">Nenhuma matéria cadastrada.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {subjects.map(subject => (
                  <li key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-brand/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: subject.color }}></div>
                      <span className="font-semibold text-lg">{subject.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="opacity-50 hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all"
                      title="Excluir matéria"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
