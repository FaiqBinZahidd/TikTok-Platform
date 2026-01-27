import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, ShieldAlert, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const AdStressTest = ({ currency = 'USD' }) => {
    // Assumptions / Inputs
    const [currentRevenue, setCurrentRevenue] = useState(50000);
    const [currentAdSpend, setCurrentAdSpend] = useState(15000);
    const [cogs, setCogs] = useState(20000);
    const [stressLevel, setStressLevel] = useState(20); // 20% increase in CPA

    // Calculated
    const [projectedProfit, setProjectedProfit] = useState(0);
    const [currentProfit, setCurrentProfit] = useState(0);
    const [profitImpact, setProfitImpact] = useState(0);
    const [riskLevel, setRiskLevel] = useState('low');

    useEffect(() => {
        const baseProfit = currentRevenue - currentAdSpend - cogs;
        setCurrentProfit(baseProfit);

        // Simulation: If CPA increases by X%, and budget/revenue stays same -> Fewer conversions -> Less Revenue?
        // OR: To maintain revenue, Ad Spend must increase by X%?
        // Scenario: "Cost Shock". Ad costs rise, but sales volume is constant (so you pay more for same customers).
        // New Ad Spend = Current * (1 + stress/100)

        const newAdSpend = currentAdSpend * (1 + stressLevel / 100);
        const newProfit = currentRevenue - newAdSpend - cogs;

        setProjectedProfit(newProfit);
        setProfitImpact(baseProfit - newProfit);

        if (newProfit < 0) setRiskLevel('critical');
        else if (newProfit < baseProfit * 0.5) setRiskLevel('high');
        else setRiskLevel('low');

    }, [currentRevenue, currentAdSpend, cogs, stressLevel]);

    return (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Ad Stress Test</h3>
                    <p className="text-sm text-slate-500">Simulate rising ad costs (CPA Spikes)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Monthly Revenue</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={currentRevenue}
                                onChange={(e) => setCurrentRevenue(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Ad Spend</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={currentAdSpend}
                                onChange={(e) => setCurrentAdSpend(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">COGS + Other Expenses</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="number"
                                value={cogs}
                                onChange={(e) => setCogs(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                        <label className="block text-sm font-bold text-slate-800 mb-4 flex justify-between">
                            <span>Stress Level (CPA Increase)</span>
                            <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">+{stressLevel}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={stressLevel}
                            onChange={(e) => setStressLevel(Number(e.target.value))}
                            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                            <span>0% (Stable)</span>
                            <span>+50%</span>
                            <span>+100% (Crash)</span>
                        </div>
                    </div>
                </div>

                {/* Results Visualization */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">

                    <div className="mb-8">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Projected Net Profit</p>
                        <div className={`text-5xl font-black ${projectedProfit > 0 ? 'text-slate-800' : 'text-red-600'}`}>
                            {formatCurrency(projectedProfit, currency)}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-3 text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full inline-flex">
                            <TrendingDown className="w-4 h-4" />
                            -{formatCurrency(profitImpact, currency)} impact
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Current Profit</p>
                            <p className="text-xl font-bold text-emerald-600">{formatCurrency(currentProfit, currency)}</p>
                        </div>
                        <div className={`p-4 rounded-xl border ${riskLevel === 'critical' ? 'bg-red-50 border-red-100' : riskLevel === 'high' ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Risk Assessment</p>
                            <p className={`text-xl font-bold ${riskLevel === 'critical' ? 'text-red-600' : riskLevel === 'high' ? 'text-orange-600' : 'text-green-600'}`}>
                                {riskLevel === 'critical' ? 'UNSUSTAINABLE' : riskLevel === 'high' ? 'High Risk' : 'Resilient'}
                            </p>
                        </div>
                    </div>

                    {riskLevel === 'critical' && (
                        <div className="mt-6 flex items-start gap-3 text-left bg-red-50 p-4 rounded-xl border border-red-100 w-full">
                            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-700 text-sm">Zone of Insolvency</h4>
                                <p className="text-xs text-red-600/80 mt-1">
                                    At a +{stressLevel}% increase in ad costs, your business model becomes unprofitable. You need to improve LTV or Creatives immediately.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdStressTest;
