import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { EducationLevel } from '../context/AuthContext';
import { GraduationCap, Lock, User as UserIcon, BookOpen } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('fundamental1');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(username, password, educationLevel);
    if (success) {
      navigate('/home');
    } else {
      setError('Nome de usuário já existe ou é inválido.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand/20 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link to="/" className="flex justify-center mb-6 hover:scale-105 transition-transform">
          <div className="bg-brand p-3 rounded-2xl text-white shadow-lg shadow-brand/30">
            <GraduationCap size={32} />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold tracking-tight">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm opacity-70">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-brand hover:opacity-80">
            Faça login aqui
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="glass-panel py-8 px-4 sm:rounded-3xl sm:px-10 border border-white/20 dark:border-slate-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/50 text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium opacity-80">Usuário</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand transition-all sm:text-sm"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium opacity-80">Senha</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand transition-all sm:text-sm"
                  placeholder="Sua senha secreta"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium opacity-80">Grau de Escolaridade</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-50">
                  <BookOpen size={18} />
                </div>
                <select
                  required
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand transition-all sm:text-sm"
                >
                  <option value="fundamental1">Ensino Fundamental I (1º ao 6º ano)</option>
                  <option value="fundamental2_medio">Ensino Fundamental II e Médio</option>
                  <option value="faculdade">Faculdade</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-brand/20 text-sm font-semibold text-white bg-brand hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all hover:-translate-y-0.5"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-brand/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
