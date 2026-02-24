'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Questao } from '@/lib/quiz-data';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Home, ChevronDown, CheckCircle2, XCircle, Clock, Percent, AlertCircle } from 'lucide-react';

interface ResultData {
    questions: Questao[];
    answers: Record<string, string>;
    score: number;
    total: number;
    timeSpent: number;
}

export default function ResultPage() {
    const router = useRouter();
    const [data, setData] = useState<ResultData | null>(null);
    const [showReview, setShowReview] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('lastQuizResult');
        if (!stored) {
            router.push('/');
            return;
        }
        setData(JSON.parse(stored));
    }, [router]);

    if (!data) return null;

    const isPassed = data.score >= 27;
    const percentage = Math.round((data.score / data.total) * 100);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-32">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

                {/* Result Hero */}
                <div className="pt-16 pb-12 text-center space-y-6">
                    <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-700 animate-in zoom-in-50 ${isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPassed ? <Trophy size={40} /> : <XCircle size={40} />}
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">
                            {isPassed ? 'Bom Trabalho!' : 'Quase Lá!'}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm sm:text-base">
                            {isPassed ? 'Aprovado neste exame global.' : 'Não atingiu a pontuação mínima.'}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
                    <div className="app-card p-8 flex flex-col items-center justify-center animate-in slide-in-from-left-4 duration-500">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <XCircle size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-400 mb-1">Questões</span>
                        <div className="text-3xl font-semibold text-rose-600">
                            {data.total - data.score} <span className="text-sm text-slate-500 font-normal ml-1">erradas</span>
                        </div>
                    </div>

                    <div className="app-card p-8 flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 duration-500 border-emerald-100 bg-emerald-50/30">
                        <div className="w-10 h-10 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                            <Percent size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-500 mb-1">Resultado Final</span>
                        <div className="text-4xl font-semibold text-emerald-600">{percentage}%</div>
                    </div>

                    <div className="app-card p-8 flex flex-col items-center justify-center animate-in slide-in-from-right-4 duration-500">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <Clock size={20} />
                        </div>
                        <span className="text-xs font-medium text-slate-400 mb-1">Tempo Gasto</span>
                        <div className="text-3xl font-semibold text-slate-700">
                            {Math.floor(data.timeSpent / 60)}<span className="text-lg opacity-40 px-1 font-normal">m</span>{data.timeSpent % 60}<span className="text-lg opacity-40 px-1 font-normal">s</span>
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-20 animate-in fade-in duration-1000">
                    <Link href="/quiz?mode=random" className="flex-1">
                        <Button className="w-full h-14 rounded-full bg-slate-900 hover:bg-black text-white font-medium text-sm transition-all">
                            <RotateCcw className="mr-2 w-4 h-4" /> Novo Exame
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        onClick={() => setShowReview(!showReview)}
                        className={`flex-1 h-14 rounded-full border transition-all text-sm font-medium
                            ${showReview ? 'bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200' : 'bg-white border-slate-300 text-slate-900 hover:bg-slate-50'}
                        `}
                    >
                        {showReview ? 'Ocultar Revisão' : 'Verificar Erros'}
                        <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showReview ? 'rotate-180' : ''}`} />
                    </Button>

                    <Link href="/">
                        <Button variant="outline" className="h-14 w-full sm:w-14 rounded-full bg-slate-100 border-transparent text-slate-900 hover:bg-slate-200 transition-all p-0 flex items-center justify-center">
                            <Home size={20} />
                        </Button>
                    </Link>
                </div>

                {/* Review Section */}
                {showReview && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700 border-t border-slate-100 pt-16 mt-16">
                        <div className="text-center pb-8 border-b border-slate-100">
                            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Relatório de Desempenho</h2>
                            <p className="text-slate-500 text-sm mt-2">Reveja as questões e aprenda com os seus erros.</p>
                        </div>

                        <div className="space-y-16">
                            {data.questions.map((q, idx) => {
                                const userAnswer = data.answers[q.numero];
                                const isCorrect = userAnswer === q.letraCorreta;

                                return (
                                    <div key={q.numero} className="relative group">
                                        <div className="flex items-center gap-3 mb-4 pl-4 border-l-2 border-slate-200">
                                            <span className={`text-xs font-semibold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {isCorrect ? 'Questão Respondida Corretamente' : 'Sugere-se Revisão'}
                                            </span>
                                        </div>

                                        <QuestionCard
                                            questao={q}
                                            selectedOption={userAnswer}
                                            onSelectOption={() => { }}
                                            isReview={true}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
