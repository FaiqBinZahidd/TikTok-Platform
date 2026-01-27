import React from 'react';
import { HelpCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, subText, info }) => {
    const getCardClass = (colorClass) => {
        if (colorClass.includes('violet') || colorClass.includes('purple')) return 'card-blue';
        if (colorClass.includes('emerald') || colorClass.includes('green')) return 'card-green';
        if (colorClass.includes('amber') || colorClass.includes('orange')) return 'card-yellow';
        if (colorClass.includes('rose') || colorClass.includes('pink')) return 'card-pink';
        return 'bg-white rounded-card shadow-soft';
    };

    const getIconBg = (colorClass) => {
        if (colorClass.includes('violet') || colorClass.includes('purple')) return 'bg-blue-500';
        if (colorClass.includes('emerald') || colorClass.includes('green')) return 'bg-green-500';
        if (colorClass.includes('amber') || colorClass.includes('orange')) return 'bg-amber-500';
        if (colorClass.includes('rose') || colorClass.includes('pink')) return 'bg-pink-500';
        return 'bg-slate-500';
    };

    return (
        <div className={`${getCardClass(colorClass)} p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-1 mb-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">{title}</p>
                        {info && (
                            <div className="group/tooltip relative">
                                <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-slate-700 transition-colors" />
                                <div className="absolute left-0 top-6 w-56 p-3 bg-slate-800 text-slate-100 text-xs rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 pointer-events-none shadow-2xl border border-slate-700 leading-relaxed">
                                    {info}
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transform rotate-3 group-hover:rotate-6 transition-transform duration-300 ${getIconBg(colorClass)}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {subText && (
                <div className="mt-4 pt-4 border-t border-slate-200/50 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                    {subText}
                </div>
            )}
        </div>
    );
};

export default StatCard;
