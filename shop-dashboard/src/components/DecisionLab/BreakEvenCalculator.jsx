import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
// import { formatCurrency } from '../../utils/formatUtils'; 

const BreakEvenCalculator = ({ currency }) => {

    // Inputs
    const [inputs, setInputs] = useState({
        monthlyFixedCost: 20000, // Rent, Software, Salaries
        avgPrice: 500,
        avgVariableCost: 350 // COGS + Ads + Shipping per unit
    });

    // Outputs
    const [results, setResults] = useState({
        contributionMargin: 0,
        breakEvenUnits: 0,
        breakEvenRevenue: 0
    });

    useEffect(() => {
        const fixed = parseFloat(inputs.monthlyFixedCost) || 0;
        const price = parseFloat(inputs.avgPrice) || 0;
        const varCost = parseFloat(inputs.avgVariableCost) || 0;

        const contributionMargin = price - varCost;
        let breakEvenUnits = 0;

        if (contributionMargin > 0) {
            breakEvenUnits = Math.ceil(fixed / contributionMargin);
        } else {
            breakEvenUnits = Infinity; // Loss per unit, never break even
        }

        const breakEvenRevenue = breakEvenUnits * price;

        setResults({
            contributionMargin,
            breakEvenUnits,
            breakEvenRevenue
        });
    }, [inputs]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT PANEL */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 h-fit">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Break-Even Analysis</h3>
                        <p className="text-sm text-slate-400 font-medium">Monthly targets to cover fixed overheads.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Monthly Fixed Costs</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                            <input
                                type="number" name="monthlyFixedCost" value={inputs.monthlyFixedCost} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 ml-1">Rent, Salaries, Software subscriptions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Avg Selling Price</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                                <input
                                    type="number" name="avgPrice" value={inputs.avgPrice} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Avg Variable Cost</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                                <input
                                    type="number" name="avgVariableCost" value={inputs.avgVariableCost} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">COGS + Ads + Fees per unit</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESULTS PANEL */}
            <div className="space-y-6">
                <div className={`rounded-[32px] p-8 shadow-lg text-white transition-all duration-500 bg-gradient-to-br from-blue-600 to-indigo-900`}>
                    <div className="mb-8 text-center">
                        <p className="opacity-80 font-bold uppercase tracking-widest text-xs mb-2">You must sell</p>
                        <h2 className="text-6xl font-black tracking-tighter mb-2">
                            {results.breakEvenUnits === Infinity ? 'Impossible' : results.breakEvenUnits}
                        </h2>
                        <p className="text-xl font-medium text-blue-200">Units / Month</p>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                        <div className="flex justify-between items-center text-sm font-medium mb-2">
                            <span>Break-Even Revenue</span>
                            <span className="font-bold text-lg">{results.breakEvenRevenue ? results.breakEvenRevenue.toLocaleString() : '-'} {currency}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium opacity-80">
                            <span>Contribution per Unit</span>
                            <span>{results.contributionMargin.toFixed(0)} {currency}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Strategy
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {results.breakEvenUnits === Infinity
                            ? "Your variable costs exceed your price! You lose money on every sale regardless of volume. Lower variable costs immediately."
                            : `To cover your ${inputs.monthlyFixedCost} ${currency} overhead, you need ${results.breakEvenUnits} sales. Anything above this is pure profit.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BreakEvenCalculator;
