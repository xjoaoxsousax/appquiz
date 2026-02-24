'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllThemes, getFavorites } from '@/lib/quiz-data';
import { Play, Shuffle, History, CheckCircle2, ChevronRight, BookOpen, Star, LayoutGrid, Trophy, Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const themes = getAllThemes();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [feedbackMode, setFeedbackMode] = useState<'standard' | 'immediate'>('standard');
  const [timerMode, setTimerMode] = useState<'on' | 'off'>('on');

  useEffect(() => {
    setFavoritesCount(getFavorites().length);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 sm:pb-0">
      {/* App Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Passar no Código</h1>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest hidden sm:block mt-1">Simulador de Exames</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href={`/quiz?mode=favorites&feedback=${feedbackMode}&timer=${timerMode}`} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${favoritesCount > 0 ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-slate-50 text-slate-400 opacity-50 pointer-events-none'}`}>
              <Star size={16} fill={favoritesCount > 0 ? "currentColor" : "none"} />
              <span>{favoritesCount} Erros</span>
            </Link>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Trophy size={18} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">

        {/* Recommended / Highlights */}
        <section className="pt-2">
          <Link href={`/quiz?mode=random&feedback=${feedbackMode}&timer=${timerMode}`} className="group">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white hover:bg-black transition-colors duration-500 flex items-center justify-between relative overflow-hidden min-h-[240px]">
              <div className="space-y-6 relative z-10 max-w-lg">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Shuffle size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Exame Global</h2>
                  <p className="text-slate-400 font-normal mt-2 text-lg">30 questões aleatórias de todos os temas para testar seus conhecimentos reais.</p>
                </div>
                <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 rounded-full text-sm font-semibold transition-transform group-active:scale-95 group-hover:px-8">
                  Iniciar Teste <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Control Settings */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-slate-400">
                <Shuffle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Feedback</h4>
                <p className="text-xs text-slate-400">Como ver o resultado</p>
              </div>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-2xl gap-1 border border-slate-100">
              <button
                onClick={() => setFeedbackMode('standard')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${feedbackMode === 'standard' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                No Fim
              </button>
              <button
                onClick={() => setFeedbackMode('immediate')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${feedbackMode === 'immediate' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Imediato
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-slate-400">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Tempo</h4>
                <p className="text-xs text-slate-400">Limite no simulado</p>
              </div>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-2xl gap-1 border border-slate-100">
              <button
                onClick={() => setTimerMode('on')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${timerMode === 'on' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Ativo
              </button>
              <button
                onClick={() => setTimerMode('off')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${timerMode === 'off' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Livre
              </button>
            </div>
          </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          <Link href={`/temas?feedback=${feedbackMode}&timer=${timerMode}`}>
            <div className="app-card p-8 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8 text-slate-400 h-12">
                <BookOpen size={28} className="group-hover:text-slate-900 transition-colors" />
                <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-900" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Estudo Temático</h3>
                <p className="text-slate-500 text-sm mt-2 font-light leading-relaxed">Foque em categorias específicas como Sinalização ou Cedência de Passagem.</p>
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-4">
            <Link href={favoritesCount > 0 ? `/quiz?mode=favorites&feedback=${feedbackMode}&timer=${timerMode}` : "#"} className={favoritesCount === 0 ? "opacity-60 cursor-not-allowed" : ""}>
              <div className="app-card p-6 h-full flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className={`text-slate-400 group-hover:text-slate-900 transition-colors`}>
                    <History size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Revisão de Erros</h3>
                    <p className="text-slate-500 text-sm mt-0.5">{favoritesCount > 0 ? `${favoritesCount} questões para revisar` : 'Nenhum erro salvo'}</p>
                  </div>
                </div>
                {favoritesCount > 0 && <ArrowRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />}
              </div>
            </Link>


            <Link href={`/temas?feedback=${feedbackMode}&timer=${timerMode}`}>
              <div className="app-card p-6 flex items-center gap-5 group border-slate-200">
                <div className="text-slate-500 group-hover:text-slate-900 transition-colors">
                  <LayoutGrid size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Todos os Temas</h3>
                  <p className="text-slate-500 text-sm mt-0.5 group-hover:text-slate-700 transition-colors">Explorar a biblioteca completa.</p>
                </div>
              </div>
            </Link>
          </div>

        </section>

      </div>


      {/* Mobile Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-around z-50">
        <button className="flex flex-col items-center gap-1.5 text-slate-900">
          <LayoutGrid size={22} />
          <span className="text-[10px] font-medium">Início</span>
        </button>
        <Link href={`/quiz?mode=favorites&feedback=${feedbackMode}&timer=${timerMode}`} className={`flex flex-col items-center gap-1.5 ${favoritesCount > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
          <Star size={22} fill={favoritesCount > 0 ? "currentColor" : "none"} />
          <span className="text-[10px] font-medium">Erros</span>
        </Link>
        <button className="flex flex-col items-center gap-1.5 text-slate-400">
          <Trophy size={22} />
          <span className="text-[10px] font-medium">Progresso</span>
        </button>
      </nav>

      <footer className="py-12 px-6 text-center text-slate-400 text-[11px] uppercase tracking-widest hidden sm:block">
        © 2026 Passar no Código
      </footer>
    </main>
  );
}
