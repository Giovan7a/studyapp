/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyApi } from '../api';
import type { Subject } from '../api';
import { GraduationCap, ArrowLeft, Plus, Trash2, Layers, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="max-w-3xl mx-auto w-full flex flex-col pt-8">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Matérias</h2>
        <p className="opacity-70 mt-1 text-slate-500 font-medium">
          {user?.role === 'admin' ? 'Crie ou remova as matérias disponíveis para os alunos.' : 'Crie ou remova suas próprias matérias.'}
        </p>
      </header>

      <div className="bg-[#fcfcff] border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
        <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-4 mb-10">
          <input 
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#4c3575] transition-all text-slate-900 font-bold shadow-sm"
            placeholder="Nome da nova matéria..."
            required
          />
          <button 
            type="submit"
            className="bg-[#4c3575] text-white rounded-2xl px-8 py-4 font-bold hover:bg-[#3a285c] transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Adicionar
          </button>
        </form>

        <div>
          <h3 className="text-xl font-bold mb-6 text-slate-800">
            {user?.role === 'admin' ? 'Matérias Existentes' : 'Suas Matérias'}
          </h3>
          {subjects.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Layers className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="font-bold text-slate-400">Nenhuma matéria cadastrada.</p>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {subjects.map(subject => (
                <li key={subject.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: subject.color }}></div>
                    <span className="font-bold text-slate-700">{subject.name}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
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
    </div>
  );
}
