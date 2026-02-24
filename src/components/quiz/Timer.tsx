import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
    seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
            <Clock size={16} className="text-slate-400" />
            <span className="tabular-nums">
                {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
            </span>
        </div>
    );
};

