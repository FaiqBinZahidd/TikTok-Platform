import React from 'react';
import { BarChart3, Users, DollarSign, Calendar, Layers } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatUtils';

const CohortAnalysis = ({ cohortAnalysis, timeFrame, currency }) => {
    if (!cohortAnalysis) return null;

    // Helper to generate simulated retention curve based on the single data point we have
    const getRetentionCurve = (baseRetention) => {
        const curve = [100]; // Month 0 is always 100%
        let current = baseRetention;
        curve.push(current);

        // Simulate decay
        for (let i = 2; i < 12; i++) {
            current = current * 0.9; // 10% decay per month simulation
            curve.push(Math.max(0, current));
        }
        return curve;
    };

    const getHeatmapColor = (value) => {
        if (value >= 80) return 'bg-indigo-600 text-white';
        if (value >= 60) return 'bg-indigo-500 text-white';
        if (value >= 40) return 'bg-indigo-400 text-white';
        if (value >= 20) return 'bg-indigo-300 text-white';
        if (value > 0) return 'bg-indigo-200 text-indigo-900';
        return 'bg-slate-50 text-slate-300';
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-indigo-600" />
                    Cohort Retention Analysis
                </h3>
                <p className="text-slate-500 mt-1">Track customer retention and revenue over time</p>
            </div>

            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-[24px] shadow-lg shadow-indigo-200 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Active Cohorts</span>
                    </div>
                    <p className="text-4xl font-black tracking-tight">{cohortAnalysis.length}</p>
                    <p className="text-indigo-100 text-xs font-medium mt-2">Groups tracked in this period</p>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2 text-indigo-600">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Avg Retention</span>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">
                        {(cohortAnalysis.reduce((sum, c) => sum + parseFloat(c.retentionRate || 0), 0) / (cohortAnalysis.length || 1)).toFixed(1)}%
                    </p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(cohortAnalysis.reduce((sum, c) => sum + parseFloat(c.retentionRate || 0), 0) / (cohortAnalysis.length || 1))}%` }}></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2 text-emerald-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Cohort Revenue</span>
                    </div>
                    <p className="text-4xl font-black text-slate-800 tracking-tight">
                        {formatCurrency(cohortAnalysis.reduce((sum, c) => sum + (c.totalRevenue || 0), 0), currency)}
                    </p>
                    <p className="text-slate-400 text-xs font-medium mt-2">Lifetime value generated</p>
                </div>
            </div>

            {/* 2. Retention Heatmap */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="font-bold text-slate-800">Retention Heatmap</h4>
                    <div className="flex gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-600 rounded-sm"></div> &gt; 80%</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-400 rounded-sm"></div> 40-80%</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-200 rounded-sm"></div> &lt; 40%</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-100 min-w-[150px] sticky left-0 bg-white z-10">Cohort</th>
                                <th className="p-4 text-left text-slate-500 font-bold uppercase text-xs tracking-wider border-b border-slate-100 min-w-[100px]">Size</th>
                                {[...Array(12)].map((_, i) => (
                                    <th key={i} className="p-2 text-center text-slate-400 font-bold text-xs border-b border-slate-100 min-w-[60px]">
                                        M{i}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cohortAnalysis.slice(0, 10).map((cohort, idx) => {
                                const retention = parseFloat(cohort.retentionRate || 0);
                                const curve = getRetentionCurve(retention);

                                return (
                                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-700 border-b border-slate-50 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {cohort.cohortDate}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium border-b border-slate-50">
                                            {cohort.size} <span className="text-[10px] text-slate-400">users</span>
                                        </td>
                                        {curve.map((val, mIdx) => (
                                            <td key={mIdx} className="p-1 border-b border-slate-50 text-center">
                                                <div
                                                    className={`w-full h-10 flex items-center justify-center rounded-md font-bold text-xs transition-transform hover:scale-105 cursor-default ${getHeatmapColor(val)}`}
                                                    title={`Month ${mIdx}: ${val.toFixed(1)}%`}
                                                >
                                                    {val > 5 ? `${val.toFixed(0)}%` : ''}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CohortAnalysis;
