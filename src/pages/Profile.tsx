import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  LogOut, 
  User, 
  Settings, 
  Shield, 
  ArrowLeft 
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, setTheme, color, setColor } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 glass-panel border-r border-white/20 dark:border-slate-700/50 p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">StudyApp</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4">
          <Link 
            to="/home"
            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao Início</span>
          </Link>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-brand/10 text-brand font-medium mt-2">
            <div className="flex items-center gap-3">
              <User size={18} />
              <span>Perfil e Configurações</span>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-3xl font-bold">Meu Perfil</h2>
          <p className="opacity-70 mt-1">Gerencie suas informações e preferências do aplicativo.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="glass-panel p-6 rounded-3xl text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-brand/20 to-brand/40 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white dark:border-slate-800 shadow-md">
                <User size={40} className="text-brand" />
              </div>
              <h3 className="text-xl font-bold">{user?.username}</h3>
              <p className="text-sm font-medium opacity-60 mb-6 capitalize">
                Nível: {user?.role}
              </p>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-semibold transition-colors"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          </div>

          {/* Settings Options */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Settings size={20} className="opacity-60" />
                  Preferências de Estudo
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Modo Escuro (Dark Mode)</h4>
                    <p className="text-sm opacity-60">Altere o tema visual do aplicativo.</p>
                  </div>
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-brand' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
                
                <hr className="border-white/20 dark:border-slate-700/50" />
                
                <div>
                  <h4 className="font-medium mb-2">Cor de Destaque</h4>
                  <p className="text-sm opacity-60 mb-4">Escolha a cor principal do sistema.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setColor('blue')}
                      className={`w-10 h-10 rounded-full bg-blue-500 transition-transform ${color === 'blue' ? 'scale-110 ring-4 ring-blue-500/30' : 'hover:scale-105'}`}
                    />
                    <button 
                      onClick={() => setColor('purple')}
                      className={`w-10 h-10 rounded-full bg-purple-500 transition-transform ${color === 'purple' ? 'scale-110 ring-4 ring-purple-500/30' : 'hover:scale-105'}`}
                    />
                    <button 
                      onClick={() => setColor('green')}
                      className={`w-10 h-10 rounded-full bg-emerald-500 transition-transform ${color === 'green' ? 'scale-110 ring-4 ring-emerald-500/30' : 'hover:scale-105'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/20 dark:border-slate-700/50">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Shield size={20} className="opacity-60" />
                  Segurança
                </h3>
              </div>
              <div className="p-6">
                <button className="text-brand font-medium hover:opacity-80 transition-colors">
                  Alterar senha da conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
