import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studyApi } from '../api';
import type { Subject } from '../api';
import { GraduationCap, ArrowLeft, Plus, Trash2, Layers, User } from 'lucide-react';

export default function Admin() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await studyApi.getSubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      await studyApi.createSubject({ 
        name: newSubjectName,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
      setNewSubjectName('');
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await studyApi.deleteSubject(id);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-xl text-white shadow-lg shadow-slate-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin Panel</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 p-3 rounded-lg transition-all text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao Dashboard</span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700 font-medium mt-4">
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Gerenciar Matérias</span>
            </div>
          </div>

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
      <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Gerenciar Matérias</h2>
          <p className="text-slate-500 mt-1">Crie ou remova as matérias disponíveis para os alunos.</p>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleAddSubject} className="flex gap-4 mb-8">
            <input 
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
              placeholder="Nome da nova matéria (Ex: História Geral)..."
              required
            />
            <button 
              type="submit"
              className="bg-slate-800 text-white rounded-xl px-6 py-4 font-semibold hover:bg-slate-700 transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={20} />
              Adicionar
            </button>
          </form>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Matérias Existentes</h3>
            {subjects.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Layers className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma matéria cadastrada.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {subjects.map(subject => (
                  <li key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: subject.color }}></div>
                      <span className="font-semibold text-slate-800 text-lg">{subject.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
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
