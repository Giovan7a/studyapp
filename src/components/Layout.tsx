import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut,
  Bell,
  Layers,
  Menu,
  Sparkles,
  ListTodo
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen bg-[#4c3575] flex p-0 md:p-6 relative font-sans text-slate-800 overflow-hidden">
      
      {/* Mobile Sidebar Toggle & Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Purple */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 text-white flex flex-col
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 bg-[#4c3575] shadow-2xl' : '-translate-x-full'} 
        h-full
      `}>
        <div className="flex flex-col h-full py-8 px-6 overflow-y-auto">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-12 pl-2">
            <div className="bg-[#f6c464] p-1.5 rounded-lg flex items-center justify-center">
              <Layers size={22} className="text-[#4c3575] fill-current" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">studyapp</h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            <Link 
              to="/home" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/home') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <HomeIcon size={20} className={isActive('/home') ? 'fill-current' : ''} />
              <span>Início</span>
            </Link>

            <Link 
              to="/tasks" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/tasks') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <ListTodo size={20} />
              <span>Today Tasks</span>
            </Link>
            
            <Link 
              to="/dashboard" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <BookOpen size={20} />
              <span>Flashcards</span>
            </Link>
            
            <Link 
              to="/schedule" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/schedule') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <CalendarIcon size={20} />
              <span>Calendário</span>
            </Link>
            
            <Link 
              to="/pomodoro" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/pomodoro') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <MessageSquare size={20} />
              <span>Pomodoro</span>
            </Link>

            {user?.role === 'admin' ? (
              <Link 
                to="/admin" 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/admin') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
              >
                <Layers size={20} />
                <span>Admin</span>
              </Link>
            ) : user?.educationLevel === 'faculdade' ? (
              <Link 
                to="/admin" 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/admin') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
              >
                <Layers size={20} />
                <span>Matérias</span>
              </Link>
            ) : null}
            
            <Link 
              to="/profile" 
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-colors mt-2 ${isActive('/profile') ? 'text-[#f6c464] bg-white/5' : 'opacity-70 hover:opacity-100 hover:bg-white/5'}`}
            >
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
          </nav>

          {/* Go PRO Card */}
          <div className="mt-auto pt-6 shrink-0">
            <div className="bg-[#6b509f] p-5 rounded-2xl relative overflow-hidden flex flex-col gap-3 shadow-xl">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <h3 className="font-bold text-lg text-white">Go PRO</h3>
              <p className="text-xs text-purple-200 leading-relaxed max-w-[80%]">Upgrade para conectar-se com sua turma e ver todo o progresso.</p>
              <button className="bg-[#f6c464] text-[#4c3575] text-xs font-bold px-4 py-2 rounded-lg w-max mt-1 hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                Upgrade Now
              </button>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-50">
                <Sparkles size={60} className="text-[#f6c464]" />
              </div>
            </div>
            
            <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 mt-4 rounded-xl font-medium opacity-50 hover:opacity-100 transition-colors w-full text-left">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - White Frame */}
      <main className="flex-1 bg-white rounded-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 w-full h-full">
        
        {/* Header inside White Frame */}
        <header className="px-5 md:px-10 py-4 md:py-8 flex flex-row items-center justify-between gap-2 sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-slate-50">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0 -ml-2"
            >
              <Menu size={24} />
            </button>
            <div className="bg-[#f2eff8] text-[#4c3575] font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 md:gap-3 text-sm md:text-base">
              <Sparkles size={16} className="text-[#967cd2] hidden sm:block" />
              <span className="truncate max-w-[120px] sm:max-w-none">Welcome, {user?.username || 'Student'}!</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button className="hidden md:block text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link to="/profile" className="flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#f6c464] border-2 border-white shadow-sm flex items-center justify-center text-[#4c3575] font-bold shrink-0">
                 {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-600 hidden md:block">{user?.email || 'user@studyapp.com'}</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
