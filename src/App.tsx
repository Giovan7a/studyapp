import { useState, useEffect } from 'react'
import { studyApi } from './api'
import type { Subject, Flashcard } from './api'
import { 
  Plus, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Trash2, 
  BrainCircuit,
  GraduationCap
} from 'lucide-react'

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [cards, setCards] = useState<Flashcard[]>([])
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({})

  // Form states
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [subjectInput, setSubjectInput] = useState('')

  useEffect(() => {
    fetchSubjects()
    fetchCards()
  }, [selectedSubject])

  const fetchSubjects = async () => {
    try {
      const res = await studyApi.getSubjects()
      setSubjects(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchCards = async () => {
    try {
      const res = await studyApi.getFlashcards(selectedSubject)
      setCards(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion || !newAnswer || !subjectInput) return
    
    try {
      // Check if subject exists
      let subjectId: number
      const existingSubject = subjects.find(s => s.name.toLowerCase() === subjectInput.toLowerCase())
      
      if (existingSubject) {
        subjectId = existingSubject.id
      } else {
        // Create new subject
        const newSub = await studyApi.createSubject({ 
          name: subjectInput,
          color: '#' + Math.floor(Math.random()*16777215).toString(16) // Random color
        })
        subjectId = newSub.data.id
        await fetchSubjects() // Refresh sidebar
      }

      await studyApi.createFlashcard({
        question: newQuestion,
        answer: newAnswer,
        subject: subjectId
      })
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-8
        transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyApp</h1>
        </button>

        <nav className="flex flex-col gap-2 overflow-y-auto pr-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Materias</p>
          <button 
            onClick={() => { setSelectedSubject(undefined); setIsSidebarOpen(false); }}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${!selectedSubject ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} />
              <span>Todas</span>
            </div>
            {!selectedSubject && <ChevronRight size={16} />}
          </button>
          
          {subjects.map(subject => (
            <button 
              key={subject.id}
              onClick={() => { setSelectedSubject(subject.id); setIsSidebarOpen(false); }}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${selectedSubject === subject.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }}></div>
                <span>{subject.name}</span>
              </div>
              {selectedSubject === subject.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="mt-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Progresso Geral</span>
            <span className="text-xs font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500 ease-out" 
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
              className="md:hidden bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200"
            >
              <GraduationCap size={24} />
            </button>
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Meus Flashcards'}
              </h2>
              <p className="text-slate-500 mt-1">Você tem {cards.length} cards para estudar hoje.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus size={20} />
            Novo Card
          </button>
        </header>

        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <BrainCircuit size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-lg">Nenhum card encontrado.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline mt-2">Crie seu primeiro card</button>
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
                    <div className="card-front bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center text-center">
                      <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                        {card.subject_name}
                      </span>
                      <p className="text-xl font-semibold text-slate-800">{card.question}</p>
                      <p className="text-xs text-slate-400 mt-8">Clique para ver a resposta</p>
                    </div>

                    {/* Back */}
                    <div className="card-back bg-blue-600 p-8 rounded-2xl shadow-xl text-white flex flex-col justify-center text-center">
                      <p className="text-lg leading-relaxed">{card.answer}</p>
                      <p className="text-xs opacity-60 mt-8">Clique para voltar</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between px-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLearned(card); }}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${card.is_learned ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
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
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Novo Flashcard</h3>
            <form onSubmit={handleAddCard} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Materia</label>
                <div className="relative">
                  <input 
                    list="subjects-list"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Digite ou selecione uma materia (ex: Matematica)"
                    required
                  />
                  <datalist id="subjects-list">
                    {subjects.map(s => <option key={s.id} value={s.name} />)}
                  </datalist>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Pergunta</label>
                <textarea 
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
                  placeholder="O que você quer aprender?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Resposta</label>
                <textarea 
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
                  placeholder="Qual a resposta correta?"
                  required
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
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

export default App
