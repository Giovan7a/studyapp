/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { studyApi } from '../api'
import type { Subject, Flashcard, TodayProgress } from '../api'
import { 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Trash2, 
  BrainCircuit,
  GraduationCap,
  Layers,
  User,
  Home as HomeIcon,
  Calendar
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  
  const FUNDAMENTAL_1_SUBJECTS = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física'];
  const FUNDAMENTAL_2_MEDIO_SUBJECTS = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Filosofia', 'Sociologia', 'Inglês', 'Literatura', 'Redação'];
  const [cards, setCards] = useState<Flashcard[]>([])
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>()
  const [todayProgress, setTodayProgress] = useState<TodayProgress | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  // Form states
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [subjectInput, setSubjectInput] = useState('')

  async function fetchSubjects() {
    try {
      const res = await studyApi.getSubjects()
      let filteredSubjects = res.data;
      if (user?.role !== 'admin') {
        const mySubjects = JSON.parse(localStorage.getItem(`my_subjects_${user?.username}`) || '[]');
        if (user?.educationLevel === 'fundamental1') {
          filteredSubjects = res.data.filter(s => FUNDAMENTAL_1_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'fundamental2_medio') {
          filteredSubjects = res.data.filter(s => FUNDAMENTAL_2_MEDIO_SUBJECTS.includes(s.name) || mySubjects.includes(s.id));
        } else if (user?.educationLevel === 'faculdade') {
          filteredSubjects = res.data.filter(s => mySubjects.includes(s.id));
        }
      }
      setSubjects(filteredSubjects)
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchCards() {
    try {
      const res = await studyApi.getFlashcards(selectedSubject)
      if (user?.role === 'admin') {
        setCards(res.data)
      } else {
        const myCardsStr = localStorage.getItem(`my_cards_${user?.username}`);
        if (!myCardsStr) {
          setCards([]);
        } else {
          const myCards = JSON.parse(myCardsStr);
          setCards(res.data.filter(c => myCards.includes(c.id)));
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchTodayProgress() {
    try {
      const res = await studyApi.getTodayProgress()
      setTodayProgress(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSubjects()
    fetchCards()
    fetchTodayProgress()
  }, [selectedSubject])

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion || !newAnswer || !subjectInput) return
    
    try {
      const response = await studyApi.createFlashcard({
        question: newQuestion,
        answer: newAnswer,
        subject: parseInt(subjectInput)
      })
      const newCard = response.data;
      
      // Salva o ID do card criado pelo usuário no localStorage
      if (user) {
        const myCards = JSON.parse(localStorage.getItem(`my_cards_${user.username}`) || '[]');
        myCards.push(newCard.id);
        localStorage.setItem(`my_cards_${user.username}`, JSON.stringify(myCards));
      }

      setNewQuestion('')
      setNewAnswer('')
      setSubjectInput('')
      setIsModalOpen(false)
      fetchCards()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleFlip = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleLearned = async (card: Flashcard) => {
    try {
      await studyApi.updateFlashcard(card.id, { is_learned: !card.is_learned })
      fetchCards()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCard = async (id: number) => {
    try {
      await studyApi.deleteFlashcard(id)
      fetchCards()
    } catch (err) {
      console.error(err)
    }
  }

  const learnedCount = cards.filter(c => c.is_learned).length
  const progress = cards.length > 0 ? (learnedCount / cards.length) * 100 : 0

  return (
    <div className="min-h-screen  flex flex-col md:flex-row relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass-panel border-white/20 dark:border-slate-700/50 border-r border-slate-200 p-6 flex flex-col gap-8
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold  tracking-tight">StudyApp</h1>
        </button>

        <nav className="flex flex-col gap-2 overflow-y-auto pr-2">
          <p className="text-xs font-semibold opacity-50 uppercase tracking-wider mb-2">Menu</p>
          
          <button 
            onClick={() => navigate('/home')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800 mb-2`}
          >
            <div className="flex items-center gap-3">
              <HomeIcon size={18} />
              <span>Início</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/schedule')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800 mb-2`}
          >
            <div className="flex items-center gap-3">
              <Calendar size={18} />
              <span>Cronograma</span>
            </div>
          </button>

          <button 
            onClick={() => { setSelectedSubject(undefined); setIsSidebarOpen(false); }}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${!selectedSubject ? 'bg-brand/10 text-brand font-medium' : 'opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <span>Todos os Cards</span>
            </div>
            {!selectedSubject && <ChevronRight size={16} />}
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800 mt-2`}
          >
            <div className="flex items-center gap-3">
              <Layers size={18} />
              <span>Matérias</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className={`flex items-center justify-between p-3 rounded-lg transition-all opacity-80 hover:bg-slate-100 dark:hover:bg-slate-800 mt-auto`}
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              <span>Perfil</span>
            </div>
          </button>
        </nav>

        <div className="mt-auto  p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-60">Progresso Geral</span>
            <span className="text-xs font-bold text-brand">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-brand/100 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {/* Mobile Toggle Logo */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden bg-brand p-2 rounded-xl text-white shadow-lg shadow-brand/20"
            >
              <GraduationCap size={24} />
            </button>
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Meus Flashcards'}
              </h2>
              <p className="opacity-60 mt-1">Você tem {cards.length} cards para estudar hoje.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedSubject && (
              <button 
                onClick={() => navigate(`/study/${selectedSubject}`)}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-green-100 active:scale-95"
              >
                <BrainCircuit size={20} />
                Estudar Agora
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-brand hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand/20 active:scale-95"
            >
              <Plus size={20} />
              Novo Card
            </button>
          </div>
        </header>

        {todayProgress && todayProgress.total_scheduled > 0 && !selectedSubject && (
          <div className="glass-panel p-6 rounded-2xl border border-brand/30 shadow-lg shadow-brand/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Calendar size={20} className="text-brand" />
                  Progresso de Hoje
                </h3>
                <span className="font-bold text-brand text-xl">{todayProgress.progress_percentage}%</span>
              </div>
              <p className="opacity-70 text-sm mb-5">Você concluiu {todayProgress.completed} de {todayProgress.total_scheduled} matérias agendadas.</p>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="bg-brand h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${todayProgress.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <BrainCircuit size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-lg">Nenhum card encontrado.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-brand hover:underline mt-2">Crie seu primeiro card</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map(card => (
              <div key={card.id} className="relative group">
                <div 
                  className={`card-flip h-64 w-full`}
                  onClick={() => toggleFlip(card.id)}
                >
                  <div className={`card-inner h-full w-full relative ${flippedCards[card.id] ? 'flipped' : ''}`}>
                    {/* Front */}
                    <div className="card-front glass-panel border-white/20 dark:border-slate-700/50 p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-50  px-2 py-1 rounded">
                        {card.subject_name}
                      </span>
                      <p className="text-xl font-semibold ">{card.question}</p>
                      <p className="text-xs opacity-50 mt-8">Clique para ver a resposta</p>
                    </div>

                    {/* Back */}
                    <div className="card-back bg-brand p-8 rounded-2xl shadow-xl text-white flex flex-col justify-center text-center">
                      <p className="text-lg leading-relaxed">{card.answer}</p>
                      <p className="text-xs opacity-60 mt-8">Clique para voltar</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLearned(card); }}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${card.is_learned ? 'text-emerald-600' : 'opacity-50 hover:opacity-80'}`}
                  >
                    {card.is_learned ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    {card.is_learned ? 'Aprendido' : 'Marcar como aprendido'}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel border-white/20 dark:border-slate-700/50 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Novo Flashcard</h3>
            <form onSubmit={handleAddCard} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Matéria</label>
                <div className="relative">
                  <select 
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full  border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Selecione uma matéria</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pergunta</label>
                <textarea 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full  border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none h-24"
                  placeholder="O que você quer aprender?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Resposta</label>
                <textarea 
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full  border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand transition-all resize-none h-24"
                  placeholder="Qual a resposta correta?"
                  required
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 opacity-80 rounded-xl font-medium hover: transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-brand text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-brand/20"
                >
                  Criar Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
