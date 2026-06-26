import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { EducationLevel } from '../context/AuthContext';
import { Box, ArrowUpRight, Hexagon, Play, Mail, User } from 'lucide-react';

export default function Login() {
  // Navigation & Context
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Animation State
  const [isSignUp, setIsSignUp] = useState(false);

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEducation, setRegEducation] = useState<EducationLevel>('fundamental2_medio');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginUsername, loginPassword);
    if (success) {
      navigate('/home');
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming backend takes email as username, and we don't strictly have a 'name' field in our simplified mock backend yet,
    // but we pass it as username for now to satisfy the AuthContext interface.
    const success = await register(regEmail, regPassword, regEducation);
    if (success) {
      navigate('/home');
    } else {
      setRegError('Falha ao criar conta. Verifique seus dados.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 lg:p-6 font-sans">
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-300 w-full max-w-[1250px] overflow-hidden min-h-[750px] relative flex">
        
        {/* =========================================================
            LEFT SIDE: LOGIN FORM (Visible when !isSignUp)
        ========================================================= */}
        <div className={`w-full lg:w-1/2 lg:absolute lg:top-0 lg:left-0 h-full flex flex-col p-8 lg:p-12 transition-all duration-700 ease-in-out z-10 ${isSignUp ? 'hidden lg:flex lg:opacity-0 lg:pointer-events-none' : 'flex opacity-100'}`}>
          
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 border-2 border-[#4c3575] bg-[#4c3575] rounded-xl flex items-center justify-center rotate-45 shrink-0 shadow-lg shadow-[#4c3575]/20">
              <Box size={20} className="text-white -rotate-45" />
            </div>
            <span className="font-bold tracking-tight text-xl text-[#4c3575]">StudyApp</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Acesse sua conta</h2>
              <p className="text-sm font-medium text-slate-500">
                Não tem uma conta? <button type="button" onClick={() => setIsSignUp(true)} className="font-bold text-[#4c3575] underline hover:text-[#3a285c] transition-colors">Cadastre-se</button>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              {loginError && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 text-center">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-[#4c3575] mb-2">E-mail ou Usuário</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors"
                    placeholder="aluno@studyapp.com"
                  />
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4c3575] mb-2">Senha</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#4c3575] text-white rounded-xl py-4 font-bold text-sm hover:bg-[#3a285c] transition-colors mt-4 shadow-lg shadow-[#4c3575]/20"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================
            RIGHT SIDE: REGISTER FORM (Visible when isSignUp)
        ========================================================= */}
        <div className={`w-full lg:w-1/2 lg:absolute lg:top-0 lg:right-0 h-full flex flex-col p-8 lg:p-12 transition-all duration-700 ease-in-out z-10 ${!isSignUp ? 'hidden lg:flex lg:opacity-0 lg:pointer-events-none' : 'flex opacity-100'}`}>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 border-2 border-[#4c3575] bg-[#4c3575] rounded-xl flex items-center justify-center rotate-45 shrink-0 shadow-lg shadow-[#4c3575]/20">
              <Box size={20} className="text-white -rotate-45" />
            </div>
            <span className="font-bold tracking-tight text-xl text-[#4c3575]">StudyApp</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Criar nova conta</h2>
              <p className="text-sm font-medium text-slate-500">
                Já tem uma conta? <button type="button" onClick={() => setIsSignUp(false)} className="font-bold text-[#4c3575] underline hover:text-[#3a285c] transition-colors">Entrar</button>
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              {regError && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 text-center">
                  {regError}
                </div>
              )}
              
              <div>
                <label className="block text-[11px] font-bold text-[#4c3575] mb-1.5 uppercase tracking-wider">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors"
                    placeholder="João Silva"
                  />
                  <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4c3575] mb-1.5 uppercase tracking-wider">E-mail</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors"
                    placeholder="aluno@studyapp.com"
                  />
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4c3575] mb-1.5 uppercase tracking-wider">Senha</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4c3575] mb-1.5 uppercase tracking-wider">Ano de Escolaridade</label>
                <select
                  value={regEducation}
                  onChange={(e) => setRegEducation(e.target.value as EducationLevel)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#5d6bf8] transition-colors appearance-none bg-white cursor-pointer"
                >
                  <option value="fundamental1">Ensino Fundamental I</option>
                  <option value="fundamental2_medio">Ens. Fundamental II / Médio</option>
                  <option value="faculdade">Faculdade / Ensino Superior</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4c3575] text-white rounded-xl py-4 font-bold text-sm hover:bg-[#3a285c] transition-colors mt-2 shadow-lg shadow-[#4c3575]/20"
              >
                Cadastrar
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================
            SLIDING BENTO BOX OVERLAY (Desktop Only)
        ========================================================= */}
        <div className={`hidden lg:flex absolute top-0 right-0 w-1/2 h-full z-50 bg-[#2f2149] p-6 flex-col gap-4 overflow-hidden transition-transform duration-1000 ease-in-out ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}>
          
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5d6bf8]/20 rounded-full blur-[80px] pointer-events-none"></div>

          {/* TOP ROW */}
          <div className="flex gap-4 h-[30%] relative z-10">
            
            <div className="flex-1 bg-white/[0.05] border border-white/[0.05] rounded-[1.5rem] p-6 flex flex-col justify-between group hover:bg-white/[0.08] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 text-[#f6c464]">
                  <span className="text-4xl font-light tracking-tighter">58%</span>
                  <ArrowUpRight size={20} className="mt-1" />
                </div>
                <div className="flex flex-col gap-1.5 opacity-40">
                  <div className="w-1.5 h-5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1.5">Desempenho Geral</h3>
                <p className="text-white/60 text-[10px] font-medium leading-relaxed max-w-[90%]">
                  Acompanhe sua eficiência de aprendizado e progresso em tempo real.
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white/[0.05] border border-white/[0.05] rounded-[1.5rem] p-6 flex flex-col items-center justify-center relative group hover:bg-white/[0.08] transition-colors">
              <div className="relative w-40 h-20 overflow-hidden mb-4">
                <div className="absolute w-40 h-40 border-[1.5px] border-dashed border-[#5d6bf8]/40 rounded-full top-0 left-0 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <div className="w-24 h-12 relative">
                     {[...Array(11)].map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-[#f6c464] rounded-full shadow-[0_0_8px_#f6c464] origin-[0_24px]"
                          style={{ transform: `translateX(-50%) rotate(${(i * 18) - 90}deg) translateY(-24px)`, opacity: i > 7 ? 0.3 : 1 }}
                        ></div>
                     ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                   <div className="w-3 h-3 rounded-sm bg-[#5d6bf8]/30 rotate-45 flex items-center justify-center">
                     <div className="w-1 h-1 bg-[#f6c464] rounded-full"></div>
                   </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[#f6c464]/80 text-[10px] font-bold tracking-wider mb-1 uppercase">Alunos Ativos</div>
                <div className="text-white text-2xl font-bold tracking-tight">28.520</div>
              </div>
            </div>

          </div>

          {/* MIDDLE ROW */}
          <div className="h-[40%] bg-gradient-to-br from-[#4c3575] to-[#3a285c] border border-white/[0.08] rounded-[2rem] p-6 relative overflow-hidden flex items-center group shadow-inner">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-60">
               <div className="relative w-40 h-40">
                 <div className="absolute inset-0 bg-[#f6c464] rounded-full mix-blend-screen filter blur-[50px] opacity-20 animate-pulse"></div>
                 <div className="absolute top-6 left-6 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-[1rem] rotate-12 flex items-center justify-center shadow-xl transition-transform duration-1000 group-hover:rotate-[24deg] group-hover:scale-110">
                   <Box size={24} className="text-[#f6c464]/80" />
                 </div>
                 <div className="absolute bottom-6 right-6 w-16 h-16 bg-[#5d6bf8]/40 backdrop-blur-lg border border-[#5d6bf8]/30 rounded-full -rotate-12 flex items-center justify-center shadow-[0_0_20px_rgba(93,107,248,0.4)] transition-transform duration-1000 group-hover:-rotate-[24deg] group-hover:scale-110">
                   <Play size={16} className="text-white ml-1" />
                 </div>
               </div>
            </div>

            <div className="relative z-10 w-full md:w-2/3 flex flex-col justify-center pr-4">
              <div className="inline-block border border-[#f6c464]/30 rounded-full px-2.5 py-1 text-[9px] font-bold text-[#f6c464] mb-3 uppercase tracking-widest w-max bg-[#f6c464]/10 backdrop-blur-md">
                Modo Foco 2.0
              </div>
              <h3 className="text-white text-xl md:text-2xl font-light leading-tight mb-2 tracking-tight">
                Descubra a solução mais <span className="font-bold text-[#f6c464]">segura</span>, <span className="font-bold text-[#f6c464]">fácil</span> e confiável
              </h3>
              <p className="text-white/70 text-[11px] font-medium leading-relaxed">
                A estrutura gamificada do StudyApp permite organizar sua rotina e aumentar a produtividade em até 300%.
              </p>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="flex gap-4 h-[30%] relative z-10">
            <div className="flex-1 bg-white/[0.05] border border-white/[0.05] rounded-[1.5rem] p-6 flex flex-col justify-between relative overflow-hidden group hover:bg-white/[0.08] transition-colors">
               <div className="text-white/70 text-[11px] font-bold leading-relaxed max-w-[70%]">
                 Usado pelos melhores alunos em todo o mundo
               </div>
               
               <div className="absolute bottom-4 right-4 flex items-center justify-center w-32 h-32">
                  <div className="relative w-full h-full">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-20">
                       <Hexagon size={40} className="text-[#f6c464] fill-[#f6c464]/20 stroke-1" />
                       <span className="absolute text-white font-bold text-[10px]">S</span>
                     </div>
                     <div className="absolute top-2 left-4 w-8 h-8 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity delay-75">
                       <Hexagon size={32} className="text-white/40 fill-white/10 stroke-1" />
                       <Box size={10} className="absolute text-[#5d6bf8]" />
                     </div>
                     <div className="absolute bottom-6 left-0 w-6 h-6 flex items-center justify-center opacity-30 group-hover:opacity-80 transition-opacity delay-150">
                       <Hexagon size={24} className="text-white/20 fill-white/5 stroke-1" />
                     </div>
                     <div className="absolute top-8 right-2 w-8 h-8 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity delay-200">
                       <Hexagon size={32} className="text-[#5d6bf8]/60 fill-[#5d6bf8]/20 stroke-1" />
                       <Play size={10} className="absolute text-[#f6c464]" />
                     </div>
                     <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                       <path d="M 50 50 L 30 25 M 50 50 L 25 70 M 50 50 L 75 35" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
                     </svg>
                  </div>
               </div>
            </div>

            <div className="flex-1 bg-white/[0.05] border border-white/[0.05] rounded-[1.5rem] p-5 pb-0 flex flex-col justify-between relative overflow-hidden group hover:bg-white/[0.08] transition-colors">
               <div className="flex justify-between items-start z-10">
                 <div>
                   <div className="flex items-center gap-1.5 text-[#f6c464] text-[9px] font-bold uppercase tracking-wider mb-1">
                     <div className="w-1.5 h-1.5 rounded-sm border border-[#f6c464] flex items-center justify-center"><div className="w-0.5 h-0.5 bg-[#f6c464]"></div></div>
                     Estudo
                   </div>
                   <div className="text-white text-lg font-bold tracking-tight">4.28 H</div>
                   <div className="text-[#e26477] text-[9px] font-bold">↓ 1.2% <span className="text-white/40 font-medium">na semana</span></div>
                 </div>
                 <div>
                   <div className="flex items-center gap-1.5 text-[#5d6bf8] text-[9px] font-bold uppercase tracking-wider mb-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#5d6bf8]"></div>
                     Meta
                   </div>
                   <div className="text-white text-lg font-bold tracking-tight">6.50 H</div>
                   <div className="text-[#10b981] text-[9px] font-bold">↑ 4.8% <span className="text-white/40 font-medium">projetado</span></div>
                 </div>
               </div>

               <div className="absolute bottom-0 left-0 w-full h-20 z-0 flex items-end">
                  <div className="w-full h-full relative">
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="glow" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#f6c464" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#f6c464" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M 0 100 L 0 60 L 10 50 L 20 65 L 30 40 L 40 45 L 50 30 L 60 50 L 70 35 L 80 60 L 90 40 L 100 45 L 100 100 Z" fill="url(#glow)" />
                      <path d="M 0 60 L 10 50 L 20 65 L 30 40 L 40 45 L 50 30 L 60 50 L 70 35 L 80 60 L 90 40 L 100 45" fill="none" stroke="#f6c464" strokeWidth="1.5" className="drop-shadow-[0_0_8px_rgba(246,196,100,0.8)]" />
                    </svg>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
