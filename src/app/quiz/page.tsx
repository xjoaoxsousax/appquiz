'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    getQuizDataBySlug,
    getRandomQuestions,
    getFavorites,
    saveToFavorites,
    removeFromFavorites,
    Questao
} from '@/lib/quiz-data';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Timer } from '@/components/quiz/Timer';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

function QuizContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [questions, setQuestions] = useState<Questao[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const paginationRef = useRef<HTMLDivElement>(null);
    const activeNumRef = useRef<HTMLButtonElement>(null);

    const mode = searchParams.get('mode');
    const themeSlug = searchParams.get('theme');
    const feedbackMode = searchParams.get('feedback') || 'standard';
    const hasTimer = searchParams.get('timer') !== 'off';

    useEffect(() => {
        async function load() {
            try {
                let loadedQuestions: Questao[] = [];
                if (mode === 'random') {
                    loadedQuestions = await getRandomQuestions(30);
                } else if (mode === 'favorites') {
                    loadedQuestions = getFavorites();
                } else if (themeSlug) {
                    const data = await getQuizDataBySlug(themeSlug);
                    loadedQuestions = data.questoes.sort(() => 0.5 - Math.random()).slice(0, 30);
                } else {
                    loadedQuestions = await getRandomQuestions(30);
                }
                setQuestions(loadedQuestions);
            } catch (err) {
                console.error(err);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, [mode, themeSlug, router]);

    // Timer logic
    useEffect(() => {
        if (isLoading || questions.length === 0 || !hasTimer) return;
        if (timeLeft <= 0) {
            finishQuiz();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isLoading, questions, hasTimer]);

    // Auto-scroll pagination logic
    useEffect(() => {
        if (activeNumRef.current) {
            activeNumRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentIndex]);

    const handleSelectOption = (letra: string) => {
        const currentQuestion = questions[currentIndex];

        // If already answered in immediate mode, don't allow changing
        if (feedbackMode === 'immediate' && answers[currentQuestion.numero]) return;

        const newAnswers = { ...answers, [currentQuestion.numero]: letra };
        setAnswers(newAnswers);

        // Auto-next System: Jump to next after slightly longer delay in immediate mode
        const delay = feedbackMode === 'immediate' ? 1200 : 400;
        const totalAnswered = Object.keys(newAnswers).length;

        if (totalAnswered === questions.length) {
            // All questions answered, show popup
            setTimeout(() => {
                setShowConfirmModal(true);
            }, delay);
        } else if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(prev => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, delay);
        }
    };

    const handleFinishClick = () => {
        const answeredCount = Object.keys(answers).length;
        if (answeredCount < questions.length) {
            setShowConfirmModal(true);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        let correctCount = 0;
        questions.forEach(q => {
            const userAnswer = answers[q?.numero];
            if (userAnswer === q?.letraCorreta) {
                correctCount++;
                // If in favorites mode and got it right, remove from favorites
                if (mode === 'favorites') {
                    removeFromFavorites(q.numero);
                }
            } else if (userAnswer !== undefined) {
                saveToFavorites(q);
            }
        });

        const resultData = {
            questions,
            answers,
            score: correctCount,
            total: questions.length,
            timeSpent: (30 * 60) - timeLeft,
            date: new Date().toISOString()
        };

        localStorage.setItem('lastQuizResult', JSON.stringify(resultData));
        router.push('/resultado');
    };

    if (isLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-blue-600 animate-pulse">A preparar simulado...</div>;
    }

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion?.numero] || null;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
                        <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                            <AlertTriangle size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 leading-tight">
                                {Object.keys(answers).length === questions.length ? 'Exame Concluído!' : 'Questões em Falta'}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium">
                                {Object.keys(answers).length === questions.length ? 'Você respondeu a todas as questões. Deseja terminar e ver a sua nota?' : `Ainda tens ${questions.length - Object.keys(answers).length} questões por responder. Desejas terminar mesmo assim?`}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                variant="outline"
                                onClick={finishQuiz}
                                className="w-full h-14 bg-blue-50 hover:bg-blue-100 text-blue-900 border-transparent rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100/50"
                            >
                                Sim, Terminar Simulado
                            </Button>
                            <Button
                                onClick={() => setShowConfirmModal(false)}
                                variant="ghost"
                                className="w-full h-14 text-slate-500 hover:text-slate-700 font-bold uppercase tracking-widest text-[10px]"
                            >
                                Continuar a Responder
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header - Minimalist */}
            <header className="bg-white text-slate-900 h-16 flex items-center justify-between px-6 border-b border-slate-100 relative z-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/')} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={20} />
                    </button>
                    <span className="font-semibold text-sm hidden sm:block tracking-tight text-slate-500">Exame em Curso</span>
                </div>

                <div className="flex items-center gap-4">
                    {hasTimer && (
                        <div className="bg-slate-50 px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-medium">
                            <Timer seconds={timeLeft} />
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleFinishClick}
                        className="bg-slate-900 border-transparent text-white hover:bg-black font-semibold text-[11px] uppercase tracking-widest h-9 px-5 rounded-full transition-colors shadow-sm"
                    >
                        Terminar
                    </Button>
                </div>
            </header>

            {/* Pagination Bar - Immersive/Non-Sticky (Requirement 2A) */}
            <div className="bg-white border-b border-slate-100 relative z-40 flex items-center px-2 py-1">
                <button
                    onClick={() => {
                        const newIdx = Math.max(0, currentIndex - 1);
                        setCurrentIndex(newIdx);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-10 h-11 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={paginationRef}
                    className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1 bg-white px-2 scroll-smooth py-2"
                >
                    {questions.map((_, idx) => (
                        <button
                            key={idx}
                            ref={currentIndex === idx ? activeNumRef : null}
                            onClick={() => {
                                setCurrentIndex(idx);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`flex-shrink-0 w-9 h-9 flex flex-col items-center justify-center text-xs font-medium transition-all rounded-full relative
                                ${currentIndex === idx ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}
                            `}
                        >
                            <span className="mt-0.5">{idx + 1}</span>
                            {questions[idx]?.numero && answers[questions[idx].numero] && currentIndex !== idx && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-slate-400" />
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        const newIdx = Math.min(questions.length - 1, currentIndex + 1);
                        setCurrentIndex(newIdx);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-10 h-11 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    disabled={currentIndex === questions.length - 1}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-8">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {currentQuestion ? (
                        <QuestionCard
                            questao={currentQuestion}
                            selectedOption={currentAnswer}
                            onSelectOption={handleSelectOption}
                            feedbackMode={feedbackMode as 'standard' | 'immediate'}
                        />
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium">
                            A carregar pergunta...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <QuizContent />
        </Suspense>
    );
}
