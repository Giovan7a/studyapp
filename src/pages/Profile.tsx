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
    <div className="max-w-4xl mx-auto w-full flex flex-col pt-8">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">Meu Perfil</h2>
        <p className="opacity-70 mt-1 text-slate-500 font-medium">Gerencie suas informações e preferências do aplicativo.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-[#fcfcff] border border-slate-100 p-8 rounded-[2rem] text-center shadow-sm">
            <div className="w-24 h-24 bg-[#f2eff8] rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-white shadow-md">
              <User size={40} className="text-[#4c3575]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user?.username}</h3>
            <p className="text-sm font-bold text-slate-400 mb-8 capitalize uppercase tracking-wider mt-1">
              Nível: {user?.role}
            </p>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
          </div>
        </div>

        {/* Settings Options */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#fcfcff] border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Settings size={20} className="text-slate-400" />
                Preferências de Estudo
              </h3>
            </div>
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Modo Escuro (Dark Mode)</h4>
                  <p className="text-sm text-slate-500 font-medium mt-1">Altere o tema visual do aplicativo.</p>
                </div>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#4c3575]' : 'bg-slate-200'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
              
              <hr className="border-slate-100" />
              
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Cor de Destaque</h4>
                <p className="text-sm text-slate-500 font-medium mb-5">Escolha a cor principal do sistema.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setColor('blue')}
                    className={`w-12 h-12 rounded-full bg-blue-500 transition-all ${color === 'blue' ? 'scale-110 ring-4 ring-blue-500/30' : 'hover:scale-105'}`}
                  />
                  <button 
                    onClick={() => setColor('purple')}
                    className={`w-12 h-12 rounded-full bg-[#4c3575] transition-all ${color === 'purple' ? 'scale-110 ring-4 ring-purple-900/30' : 'hover:scale-105'}`}
                  />
                  <button 
                    onClick={() => setColor('green')}
                    className={`w-12 h-12 rounded-full bg-emerald-500 transition-all ${color === 'green' ? 'scale-110 ring-4 ring-emerald-500/30' : 'hover:scale-105'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fcfcff] border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Shield size={20} className="text-slate-400" />
                Segurança
              </h3>
            </div>
            <div className="p-6 md:p-8">
              <button className="text-[#4c3575] font-bold hover:underline transition-all">
                Alterar senha da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
