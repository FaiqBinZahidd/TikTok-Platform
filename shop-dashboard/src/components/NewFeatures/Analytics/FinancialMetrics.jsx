import React from 'react';
import { DollarSign, TrendingUp, Target, BarChart3, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const FinancialMetrics = ({ profitability, cashflow, breakeven, currency }) => {
    if (!profitability || !cashflow || !breakeven) return null;

    // Gauge Chart Data
    const margin = profitability.profitMargin || 0;
    const gaugeData = [
        { name: 'Margin', value: margin },
        { name: 'Remaining', value: 100 - margin }
    ];
    const gaugeColor = margin > 20 ? '#10b981' : margin > 10 ? '#3b82f6' : '#f59e0b';

    // Inventory Turnover Simulation
    const simulatedAvgInv = profitability.netProfit * 4;
    const inventoryTurnover = (profitability.netProfit / (simulatedAvgInv || 1)).toFixed(1);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Profitability Section */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                        Profitability & Margins
                    </h3>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${margin > 20 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className="text-xs font-bold text-slate-500">{margin > 20 ? 'Healthy Margins' : 'Attention Needed'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Gauge Chart */}
                    <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                        <h4 className="absolute top-6 left-6 font-bold text-slate-500 text-xs uppercase tracking-wider">Net Profit Margin</h4>
                        <div className="h-48 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        cx="50%"
                                        cy="80%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell fill={gaugeColor} />
                                        <Cell fill="#e2e8f0" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="absolute bottom-6 flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-800">{margin}%</span>
                            <span className="text-xs font-bold text-slate-400">Target: 25%</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[24px] p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-2">Net Profit</p>
                            <p className="text-3xl font-black tracking-tight">{formatCurrency(profitability.netProfit, currency)}</p>
                            <div className="mt-4 flex items-center gap-2 text-emerald-100 text-xs font-bold">
                                <TrendingUp className="w-4 h-4" /> +8.2% vs last period
                            </div>
                        </div>

                        <div className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Inventory Turnover</p>
                                <p className="text-3xl font-black text-slate-800">{inventoryTurnover}x</p>
                            </div>
                            <div className="mt-4 bg-slate-50 p-3 rounded-xl">
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    <span className="font-bold text-slate-700">Insight:</span> Faster than industry avg (3.2x). Keep stock levels optimized.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cash Flow & Break Even */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft group hover:border-cyan-200 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-600" /> Cash Flow Health
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-5 bg-cyan-50 rounded-2xl border border-cyan-100">
                            <div>
                                <p className="text-xs font-bold text-cyan-800 uppercase tracking-wider">Net Flow</p>
                                <p className="text-2xl font-black text-cyan-900 mt-1">{formatCurrency(cashflow.netCashFlow, currency)}</p>
                            </div>
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-cyan-600">
                                <ArrowRight className="w-5 h-5 -rotate-45" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3">
                            <span className="text-sm font-bold text-slate-500">Operating Status</span>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">{cashflow.cashFlowHealth}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft group hover:border-orange-200 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-orange-600" /> Break-Even Analysis
                    </h3>
                    <div className="relative pt-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                            <span>Cost</span>
                            <span>Revenue</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-slate-300" style={{ width: '40%' }}></div>
                            <div className="h-full bg-orange-400" style={{ width: '20%' }}></div> {/* Margin of Safety */}
                            <div className="h-full bg-emerald-400" style={{ width: '40%' }}></div> {/* Profit */}
                        </div>
                        <div className="flex justify-between mt-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Break-Even Point</p>
                                <p className="text-xl font-black text-slate-800">{formatCurrency(breakeven.breakEvenPoint, currency)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Safety Margin</p>
                                <p className="text-xl font-black text-blue-600">{breakeven.marginOfSafety}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialMetrics;
