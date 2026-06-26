import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studyApi } from '../api';
import type { Flashcard } from '../api';
import { ChevronLeft, Check, X, Frown, Smile, Brain, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudySession = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const loadDueFlashcards = async () => {
      try {
        setLoading(true);
        if (subjectId) {
          const response = await studyApi.getDueFlashcards(parseInt(subjectId));
          if (user?.role === 'admin') {
            setFlashcards(response.data);
          } else {
            const myCardsStr = localStorage.getItem(`my_cards_${user?.username}`);
            if (!myCardsStr) {
              setFlashcards([]);
            } else {
              const myCards = JSON.parse(myCardsStr);
              setFlashcards(response.data.filter(c => myCards.includes(c.id)));
            }
          }
        }
      } catch (error) {
        console.error("Failed to load flashcards", error);
      } finally {
        setLoading(false);
      }
    };
    loadDueFlashcards();
  }, [subjectId]);

  const handleReview = async (score: number) => {
    const currentCard = flashcards[currentIndex];
    try {
      await studyApi.reviewFlashcard(currentCard.id, score);
      
      // Move to next card after a short delay
      setTimeout(() => {
        setIsFlipped(false);
        if (currentIndex < flashcards.length - 1) {
          setTimeout(() => setCurrentIndex(prev => prev + 1), 300); // Wait for flip back
        } else {
          setSessionComplete(true);
        }
      }, 500);
      
    } catch (error) {
      console.error("Failed to review card", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-brand" />
      </div>
    );
  }

  if (sessionComplete || flashcards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="glass-panel rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sessão Concluída!</h2>
          <p className="opacity-80 mb-8">
            Você revisou todos os cartões pendentes para esta matéria. Volte amanhã para mais!
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-brand hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-3xl mx-auto h-full">
      <div className="w-full flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Sair
        </button>
        <div className="font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          Cartão {currentIndex + 1} de {flashcards.length}
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Flashcard 3D */}
      <div 
        className="card-flip w-full max-w-lg aspect-[4/3] mb-8"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={`card-inner w-full h-full relative rounded-3xl shadow-xl ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Front */}
          <div className="card-front bg-white absolute w-full h-full flex flex-col rounded-3xl border border-slate-200 p-10 shadow-sm cursor-pointer">
            <div className="text-xs font-bold text-[#4c3575] mb-4 flex items-center uppercase tracking-wider bg-[#f2eff8] w-max px-3 py-1.5 rounded-lg">
              <Brain className="w-4 h-4 mr-2" />
              Pergunta
            </div>
            <div className="flex-1 flex items-center justify-center text-center">
              <h3 className="text-2xl md:text-3xl font-bold leading-snug text-slate-800">
                {currentCard.question}
              </h3>
            </div>
            {!isFlipped && (
              <div className="text-center text-slate-400 font-medium text-sm mt-4 animate-pulse">
                Clique no cartão para revelar a resposta
              </div>
            )}
          </div>

          {/* Back */}
          <div className="card-back bg-[#4c3575] absolute w-full h-full flex flex-col rounded-3xl border-2 border-[#f6c464] p-10 shadow-lg">
            <div className="text-xs font-bold text-[#4c3575] mb-4 flex items-center uppercase tracking-wider bg-[#f6c464] w-max px-3 py-1.5 rounded-lg">
              <Check className="w-4 h-4 mr-2" />
              Resposta
            </div>
            <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
              <p className="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-wrap text-white">
                {currentCard.answer}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons (Only show when flipped) */}
      <div className={`w-full max-w-lg grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); handleReview(0); }}
          className="flex flex-col items-center justify-center py-4 bg-white text-red-500 rounded-2xl hover:bg-red-50 transition-colors border border-slate-100 hover:border-red-200 shadow-sm font-bold"
        >
          <X className="w-6 h-6 mb-2" />
          Errei (0)
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleReview(2); }}
          className="flex flex-col items-center justify-center py-4 bg-white text-orange-500 rounded-2xl hover:bg-orange-50 transition-colors border border-slate-100 hover:border-orange-200 shadow-sm font-bold"
        >
          <Frown className="w-6 h-6 mb-2" />
          Difícil (2)
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleReview(4); }}
          className="flex flex-col items-center justify-center py-4 bg-white text-[#4c3575] rounded-2xl hover:bg-[#f2eff8] transition-colors border border-slate-100 hover:border-[#4c3575]/30 shadow-sm font-bold"
        >
          <Smile className="w-6 h-6 mb-2" />
          Bom (4)
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleReview(5); }}
          className="flex flex-col items-center justify-center py-4 bg-white text-emerald-500 rounded-2xl hover:bg-emerald-50 transition-colors border border-slate-100 hover:border-emerald-200 shadow-sm font-bold"
        >
          <Check className="w-6 h-6 mb-2" />
          Fácil (5)
        </button>
      </div>
    </div>
  );
};

export default StudySession;
