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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center opacity-70 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Sair da Sessão
        </button>
        <div className="font-semibold">
          Cartão {currentIndex + 1} de {flashcards.length}
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
        
        {/* Flashcard 3D */}
        <div 
          className="card-flip w-full max-w-lg aspect-[4/3] mb-8"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          <div className={`card-inner w-full h-full relative rounded-2xl shadow-xl ${isFlipped ? 'flipped' : ''}`}>
            
            {/* Front */}
            <div className="card-front glass-panel absolute w-full h-full flex flex-col rounded-2xl border-2 border-white/30 dark:border-slate-700 p-8">
              <div className="text-sm font-medium text-brand mb-4 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Pergunta
              </div>
              <div className="flex-1 flex items-center justify-center text-center">
                <h3 className="text-2xl md:text-3xl font-bold leading-snug text-slate-800 dark:text-slate-100">
                  {currentCard.question}
                </h3>
              </div>
              {!isFlipped && (
                <div className="text-center opacity-50 text-sm mt-4 animate-pulse">
                  Clique no cartão para revelar a resposta
                </div>
              )}
            </div>

            {/* Back */}
            <div className="card-back glass-panel absolute w-full h-full flex flex-col rounded-2xl border-2 border-brand/50 p-8">
              <div className="text-sm font-medium text-green-500 mb-4 flex items-center">
                <Check className="w-4 h-4 mr-2" />
                Resposta
              </div>
              <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-100">
                  {currentCard.answer}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Buttons (Only show when flipped) */}
        <div className={`w-full max-w-lg grid grid-cols-4 gap-3 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleReview(0); }}
            className="flex flex-col items-center justify-center py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
          >
            <X className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Errei (0)</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleReview(2); }}
            className="flex flex-col items-center justify-center py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 cursor-pointer"
          >
            <Frown className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Difícil (2)</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleReview(4); }}
            className="flex flex-col items-center justify-center py-3 bg-brand/10 text-brand rounded-xl hover:bg-brand/20 transition-colors border border-brand/30 cursor-pointer"
          >
            <Smile className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Bom (4)</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleReview(5); }}
            className="flex flex-col items-center justify-center py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors border border-green-200 cursor-pointer"
          >
            <Check className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Fácil (5)</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudySession;
