import React from 'react';
import Image from 'next/image';
import { Questao, Opcao } from '@/lib/quiz-data';

interface QuestionCardProps {
    questao: Questao;
    selectedOption: string | null;
    onSelectOption: (letra: string) => void;
    isReview?: boolean;
    feedbackMode?: 'standard' | 'immediate';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    questao,
    selectedOption,
    onSelectOption,
    isReview = false,
    feedbackMode = 'standard'
}) => {
    if (!questao) return null;
    const imageSource = questao.imagemUrl || (questao.imagem ? `/assets/images/questions/${questao.imagem}` : null);

    return (
        <div className="w-full mx-auto space-y-8">

            {/* Question Card - Focus on density and modern feel */}
            <div className="pt-4 pb-2">
                <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 leading-tight">
                    {questao.pergunta.replace(/ \((\d+)\) \| Bom Condutor$/, '')}
                </h2>
            </div>

            {/* Layout - Grid for Large, Stack for Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

                {/* Image Section */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 overflow-hidden">
                    {imageSource ? (
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-50">
                            <Image
                                src={imageSource}
                                alt="Situação de trânsito"
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="aspect-[4/3] flex items-center justify-center text-slate-300">
                            A carregar imagem...
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    {questao.opcoes.map((opcao: Opcao) => {
                        const isSelected = selectedOption === opcao.letra;
                        const isCorrect = opcao.letra === questao.letraCorreta;
                        const showResult = isReview || (feedbackMode === 'immediate' && selectedOption !== null);

                        // Requirement 1A: Minimalist Feedback
                        let baseClasses = "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98]";
                        let stateClasses = "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:shadow-sm";
                        let iconClasses = "bg-slate-50 text-slate-400 font-medium";

                        if (showResult) {
                            if (isCorrect) {
                                stateClasses = "bg-emerald-50/50 border-emerald-500/50 text-emerald-900";
                                iconClasses = "bg-emerald-100/50 text-emerald-600 font-bold";
                            } else if (isSelected) {
                                stateClasses = "bg-rose-50/50 border-rose-500/50 text-rose-900";
                                iconClasses = "bg-rose-100/50 text-rose-600 font-bold";
                            } else {
                                stateClasses = "bg-white border-slate-100 opacity-60";
                                iconClasses = "bg-slate-50 text-slate-300";
                            }
                        } else if (isSelected) {
                            stateClasses = "bg-slate-50 border-slate-400 text-slate-900 shadow-sm";
                            iconClasses = "bg-white border border-slate-200 text-slate-900 font-bold";
                        }

                        return (
                            <button
                                key={opcao.letra}
                                onClick={() => !isReview && onSelectOption(opcao.letra)}
                                disabled={isReview}
                                className={`${baseClasses} ${stateClasses}`}
                            >
                                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm sm:text-base transition-colors ${iconClasses}`}>
                                    {opcao.letra}
                                </div>
                                <span className={`text-sm sm:text-base font-medium leading-relaxed flex-1 ${isSelected && !showResult ? 'text-slate-900' : ''}`}>
                                    {opcao.texto}
                                </span>

                                {showResult && isCorrect && (
                                    <div className="text-emerald-500 flex items-center justify-center animate-in fade-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                                {showResult && !isCorrect && isSelected && (
                                    <div className="text-rose-500 flex items-center justify-center animate-in fade-in">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Added extra padding for mobile floating elements if any */}
            <div className="h-20 sm:hidden" />
        </div>
    );
};
