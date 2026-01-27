import React, { useState } from 'react';
import { ShieldCheck, Anchor, CircleDollarSign, ArrowRight, Lock, Sparkles, AlertTriangle } from 'lucide-react';

const SmartInsightCard = ({
    summary,
    explanation,
    nextSteps = [],
    riskLevel = 'safe', // safe, warning, critical
    consequences,
    proGuidance,
    isPro = true // Default to true for now, can be toggled by parent
}) => {

    // Risk Visuals
    const riskConfig = {
        safe: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: ShieldCheck, label: 'Stable Zone' },
        warning: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertTriangle, label: 'Review Needed' },
        critical: { color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100', icon: Anchor, label: 'High Risk' }
    };

    const theme = riskConfig[riskLevel] || riskConfig.safe;
    const RiskIcon = theme.icon;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* 1. Plain Summary & 2. Explanation */}
            <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} relative overflow-hidden`}>
                <div className="flex items-start gap-4 z-10 relative">
                    <div className={`p-3 rounded-xl bg-white/80 shadow-sm ${theme.color}`}>
                        <RiskIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${theme.color} mb-1 leading-snug`}>{summary}</h3>
                        <p className={`text-sm ${theme.color} opacity-90 leading-relaxed font-medium`}>{explanation}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 3. Next Steps (Locked for Starter) */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm relative group overflow-hidden">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CircleDollarSign className="w-5 h-5 text-violet-600" />
                        What You Can Do Next
                    </h4>

                    {isPro ? (
                        <ul className="space-y-3">
                            {nextSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                    <ArrowRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="space-y-4 filter blur-[2px] select-none opacity-50">
                            <li className="flex items-start gap-3 text-sm text-slate-600">
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <span>Adjust your ad spend by small increments...</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-600">
                                <ArrowRight className="w-4 h-4 text-slate-300" />
                                <span>Review product pricing strategy...</span>
                            </li>
                        </div>
                    )}

                    {/* Lock Overlay */}
                    {!isPro && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] text-center p-4">
                            <div className="p-3 bg-slate-900 text-white rounded-full mb-3 shadow-xl">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm">Want guidance on what to change?</h5>
                            <p className="text-xs text-slate-500 mt-1">Pro shows clear next steps before money is lost.</p>
                            <button className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                Unlock Pro Insights
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. Risk Signal & 5. Consequences */}
                <div className="space-y-6">
                    <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
                        <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider opacity-70">Risk Signal</h4>
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${theme.color === 'text-emerald-700' ? 'bg-emerald-500' : theme.color === 'text-amber-700' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                            <span className={`font-bold ${theme.color} text-lg`}>{theme.label}</span>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-100 bg-white">
                        <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider opacity-70">If You Ignore This</h4>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            {consequences}
                        </p>
                    </div>
                </div>

            </div>

            {/* 6. Pro Guidance */}
            {isPro && (
                <div className="p-1 rounded-2xl bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200">
                    <div className="bg-white rounded-xl p-5 flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-violet-900 text-sm mb-1">Pro Insight</h4>
                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                "{proGuidance}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartInsightCard;
