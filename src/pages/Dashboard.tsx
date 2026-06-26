/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { studyApi } from '../api'
import type { Subject, Flashcard, TodayProgress } from '../api'
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  BrainCircuit,
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

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {/* Filtro de Matérias Rapido */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedSubject(undefined)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${!selectedSubject ? 'bg-[#4c3575] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Todos
        </button>
        {subjects.map(sub => (
          <button
            key={sub.id}
            onClick={() => setSelectedSubject(sub.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedSubject === sub.id ? 'bg-[#4c3575] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight truncate text-slate-900">
            {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Meus Flashcards'}
          </h2>
          <p className="opacity-60 mt-1 text-sm sm:text-base truncate">Você tem {cards.length} cards para estudar hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedSubject && (
            <button 
              onClick={() => navigate(`/study/${selectedSubject}`)}
              className="flex items-center justify-center gap-2 bg-[#f6c464] hover:bg-yellow-400 text-[#4c3575] px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              <BrainCircuit size={20} />
              Estudar Agora
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#4c3575] hover:bg-[#3a285c] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95"
          >
            <Plus size={20} />
            Novo Card
          </button>
        </div>
      </header>

      {todayProgress && todayProgress.total_scheduled > 0 && !selectedSubject && (
        <div className="bg-[#f2eff8] p-6 rounded-3xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#4c3575]">
                <Calendar size={20} />
                Progresso de Hoje
              </h3>
              <span className="font-bold text-[#4c3575] text-xl">{todayProgress.progress_percentage}%</span>
            </div>
            <p className="opacity-70 text-sm mb-5 text-[#4c3575]">Você concluiu {todayProgress.completed} de {todayProgress.total_scheduled} matérias agendadas.</p>
            <div className="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-[#f6c464] h-full transition-all duration-1000 ease-out" 
                style={{ width: `${todayProgress.progress_percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <BrainCircuit size={64} strokeWidth={1} className="mb-4 opacity-20" />
          <p className="text-lg font-medium text-slate-500">Nenhum card encontrado.</p>
          <button onClick={() => setIsModalOpen(true)} className="text-[#4c3575] font-bold hover:underline mt-2">Crie seu primeiro card</button>
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
                  <div className="card-front bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col justify-center text-center">
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                      {card.subject_name}
                    </span>
                    <p className="text-xl font-bold text-slate-800">{card.question}</p>
                    <p className="text-xs opacity-50 mt-8 text-slate-400">Clique para ver a resposta</p>
                  </div>

                  {/* Back */}
                  <div className="card-back bg-[#4c3575] p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center text-center">
                    <p className="text-lg leading-relaxed font-medium">{card.answer}</p>
                    <p className="text-xs opacity-60 mt-8 text-purple-200">Clique para voltar</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLearned(card); }}
                  className={`flex items-center gap-2 text-sm font-bold transition-colors ${card.is_learned ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {card.is_learned ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {card.is_learned ? 'Aprendido' : 'Marcar como aprendido'}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Novo Flashcard</h3>
            <form onSubmit={handleAddCard} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Matéria</label>
                <div className="relative">
                  <select 
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#4c3575] transition-all appearance-none font-medium"
                    required
                  >
                    <option value="" disabled>Selecione uma matéria</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Pergunta</label>
                <textarea 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#4c3575] transition-all resize-none h-24 font-medium"
                  placeholder="O que você quer aprender?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Resposta</label>
                <textarea 
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#4c3575] transition-all resize-none h-24 font-medium"
                  placeholder="Qual a resposta correta?"
                  required
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#4c3575] text-white rounded-xl font-bold hover:bg-[#3a285c] transition-all shadow-lg shadow-purple-900/20"
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
