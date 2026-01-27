import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, X, Info, Settings, Target, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import PlatformFilter from '../PlatformFilter';
import { formatCurrency } from '../../utils/formatUtils';

const FinanceView = ({ products, currency, campaigns = [], platformFilter, setPlatformFilter, availablePlatforms, t }) => {
    const [cogsPercent, setCogsPercent] = useState(40);
    const [manualAdSpend, setManualAdSpend] = useState(0);
    const [fixedCost, setFixedCost] = useState(0);
    const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

    // Smart Financial Intelligence logic...
    const totalRevenue = products.reduce((sum, p) => sum + (p.gmv || 0), 0);
    const estimatedCOGS = totalRevenue * (cogsPercent / 100);
    const campaignSpend = campaigns.reduce((sum, c) => sum + (c.adSpend || 0), 0);
    const totalAdSpend = manualAdSpend + campaignSpend;
    const grossProfit = totalRevenue - estimatedCOGS;
    const variableCosts = totalRevenue * 0.05; // 5% fees
    const contributionMargin = grossProfit - variableCosts - totalAdSpend;
    const netProfit = contributionMargin - fixedCost;
    const marginPercent = (netProfit / (totalRevenue || 1)) * 100;
    const roi = totalAdSpend > 0 ? ((netProfit + totalAdSpend) / totalAdSpend) * 100 : 0;
    const breakEvenPoint = fixedCost / ((contributionMargin / totalRevenue) || 1);

    // Insights logic
    const insights = [];
    if (marginPercent < 10) insights.push({ type: 'warning', text: 'Profit margins below 10%. Review COGS.' });
    if (roi < 200) insights.push({ type: 'info', text: 'ROI below 2:1. Optimize ad spend.' });
    if (insights.length === 0) insights.push({ type: 'success', text: 'Financial metrics look healthy!' });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('finance_title')}</h2>
                    <p className="text-slate-500 text-sm">{t('finance_subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    {availablePlatforms && availablePlatforms.length > 0 && (
                        <PlatformFilter
                            value={platformFilter}
                            onChange={setPlatformFilter}
                            availablePlatforms={availablePlatforms}
                            showLabel={false}
                        />
                    )}
                    <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> {t('ai_active')}
                    </div>
                </div>
            </div>

            {/* Smart Insights Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {insights.map((insight, idx) => (
                    <div key={idx} className={`p-4 rounded-[20px] border flex items-center gap-3 ${insight.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                        insight.type === 'warning' ? 'bg-amber-50 border-amber-100 text-amber-800' :
                            'bg-blue-50 border-blue-100 text-blue-800'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${insight.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                            insight.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {insight.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <p className="text-sm font-medium leading-tight">{insight.text}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Input Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[24px] p-6 shadow-soft">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-violet-600" /> {t('cost_parameters')}
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                    <span>{t('cogs_percent')}</span>
                                    <span className="text-violet-600">{cogsPercent}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="0" max="90"
                                    value={cogsPercent}
                                    onChange={(e) => setCogsPercent(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                                />
                                <p className="text-xs text-slate-400 mt-1">Est. Cost: {formatCurrency(estimatedCOGS, currency)}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">{t('extra_ad_spend')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{currency}</span>
                                    <input
                                        type="number"
                                        value={manualAdSpend}
                                        onChange={(e) => setManualAdSpend(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-slate-700"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">+ {formatCurrency(campaignSpend, currency)} from Campaigns</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">{t('fixed_costs')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{currency}</span>
                                    <input
                                        type="number"
                                        value={fixedCost}
                                        onChange={(e) => setFixedCost(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 font-bold text-slate-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center & Right: Stats & P&L */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 text-white p-8 rounded-[24px] shadow-lg relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{t('net_profit')}</p>
                                <h3 className="text-4xl font-extrabold tracking-tight mb-4">{formatCurrency(netProfit, currency)}</h3>
                                <div className="flex gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${marginPercent > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                        {marginPercent.toFixed(1)}% {t('margin')}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-bold">
                                        {t('roi')}: {roi.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <DollarSign className="w-40 h-40" />
                            </div>
                        </div>

                        {/* P&L Snapshot */}
                        <div className="bg-white p-8 rounded-[24px] shadow-soft border border-slate-100">
                            <h4 className="font-bold text-slate-800 mb-6 flex justify-between items-center">
                                {t('pnl_snapshot')}
                                <button onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)} className="text-xs text-violet-600 font-bold">
                                    {showAdvancedMetrics ? 'Simple' : 'Detailed'}
                                </button>
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between font-bold text-slate-700">
                                    <span>{t('revenue')}</span>
                                    <span>{formatCurrency(totalRevenue, currency)}</span>
                                </div>
                                <div className="flex justify-between text-rose-500">
                                    <span>- {t('cogs')}</span>
                                    <span>{formatCurrency(estimatedCOGS, currency)}</span>
                                </div>
                                <div className="flex justify-between text-amber-500">
                                    <span>- {t('ad_spend')}</span>
                                    <span>{formatCurrency(totalAdSpend, currency)}</span>
                                </div>
                                {showAdvancedMetrics && (
                                    <div className="flex justify-between text-slate-500">
                                        <span>- {t('fixed_costs')}</span>
                                        <span>{formatCurrency(fixedCost, currency)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-slate-100 flex justify-between font-extrabold text-lg text-slate-900 mt-2">
                                    <span>Net</span>
                                    <span className={netProfit > 0 ? 'text-emerald-600' : 'text-rose-600'}>{formatCurrency(netProfit, currency)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-yellow p-6 rounded-[24px] shadow-soft">
                            <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" /> {t('break_even')}
                            </h4>
                            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(breakEvenPoint, currency)}</p>
                            <p className={`text-xs font-bold mt-1 ${totalRevenue > breakEvenPoint ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {totalRevenue > breakEvenPoint ? t('profitable') : t('below_target')}
                            </p>
                        </div>
                        <div className="card-green p-6 rounded-[24px] shadow-soft">
                            <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> {t('roas')}
                            </h4>
                            <p className="text-xl font-extrabold text-slate-900">
                                {totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : '0.00'}x
                            </p>
                            <p className="text-xs text-slate-500 font-bold mt-1">{t('return_on_ad_spend')}</p>
                        </div>
                        <div className="card-pink p-6 rounded-[24px] shadow-soft">
                            <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" /> {t('contribution')}
                            </h4>
                            <p className="text-xl font-extrabold text-slate-900">{formatCurrency(contributionMargin, currency)}</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">{t('before_fixed_costs')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceView;
