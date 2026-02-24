'use client';

import Link from 'next/link';
import { getAllThemes } from '@/lib/quiz-data';
import { BookOpen, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TemasContent() {
    const themes = getAllThemes();
    const router = useRouter();
    const searchParams = useSearchParams();
    const feedbackMode = searchParams.get('feedback') || 'standard';

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => router.push('/')}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-none">Testes Temáticos</h1>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Escolha uma categoria para estudar</span>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
                {/* Categories Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-4">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Categorias</h2>
                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Temas do Exame</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 sm:pb-8">
                        {themes.map((theme, idx) => (
                            <Link key={theme.slug} href={`/quiz?theme=${theme.slug}&feedback=${feedbackMode}`} className="group">
                                <div className="app-card p-5 h-full flex flex-col justify-between hover:border-blue-500 transition-all active:scale-[0.98]">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 font-bold text-lg shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <BookOpen size={16} className="text-slate-200 group-hover:text-blue-200 transition-colors" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                            {theme.label}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium">Questões oficiais sobre este tema</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Iniciar Teste</span>
                                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default function TemasPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <TemasContent />
        </Suspense>
    );
}
