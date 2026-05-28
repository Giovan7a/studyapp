import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyApp</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1 mt-4">
          <Link 
            to="/home"
            className="flex items-center gap-3 p-3 rounded-lg transition-all text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            <span>Voltar ao Início</span>
          </Link>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700 font-medium mt-2">
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
          <h2 className="text-3xl font-bold text-slate-900">Meu Perfil</h2>
          <p className="text-slate-500 mt-1">Gerencie suas informações e preferências do aplicativo.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <User size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{user?.username}</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 capitalize">
                Nível: {user?.role}
              </p>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-colors"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          </div>

          {/* Settings Options */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Settings size={20} className="text-slate-400" />
                  Preferências de Estudo
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-700">Lembretes Diários</h4>
                    <p className="text-sm text-slate-500">Receba notificações para não esquecer de estudar.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-700">Modo Escuro (Dark Mode)</h4>
                    <p className="text-sm text-slate-500">Altere o tema visual do aplicativo.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Shield size={20} className="text-slate-400" />
                  Segurança
                </h3>
              </div>
              <div className="p-6">
                <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
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
