import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Progresso</span>
                <span className="text-xs font-black text-blue-600 leading-none">{percentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-0.5 shadow-inner">
                <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                    style={{ width: `${(current / total) * 100}%` }}
                />
            </div>
        </div>
    );
};
