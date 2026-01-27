import React, { useState, useEffect } from 'react';
import { Percent, TrendingUp, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const DiscountVolumeCalculator = () => {
    // Inputs
    const [currentMargin, setCurrentMargin] = useState(40); // %
    const [proposedDiscount, setProposedDiscount] = useState(10); // %

    // Outputs
    const [requiredVolumeIncrease, setRequiredVolumeIncrease] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [feasibility, setFeasibility] = useState('easy');

    useEffect(() => {
        // Formula: Required Lift = Discount % / (Original Margin % - Discount %)

        let marginDecimal = currentMargin / 100;
        let discountDecimal = proposedDiscount / 100;

        if (discountDecimal >= marginDecimal) {
            setRequiredVolumeIncrease(9999); // Impossible (Zero or Negative Margin)
            setMultiplier(99);
            setFeasibility('impossible');
        } else {
            const lift = discountDecimal / (marginDecimal - discountDecimal);
            const liftPercent = lift * 100;

            setRequiredVolumeIncrease(Math.round(liftPercent));
            setMultiplier((1 + lift).toFixed(1));

            if (liftPercent < 20) setFeasibility('easy');
            else if (liftPercent < 50) setFeasibility('medium');
            else if (liftPercent < 100) setFeasibility('hard');
            else setFeasibility('insane');
        }

    }, [currentMargin, proposedDiscount]);

    return (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-100 rounded-2xl">
                    <Percent className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Discount Profitability</h3>
                    <p className="text-sm text-slate-500">Calculate required sales lift</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Profit Margin (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={currentMargin}
                                onChange={(e) => setCurrentMargin(Number(e.target.value))}
                                className="w-full text-lg font-bold p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-700"
                            />
                            <span className="absolute right-4 top-4 text-slate-400 font-bold">%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Proposed Discount (%)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={proposedDiscount}
                                onChange={(e) => setProposedDiscount(Number(e.target.value))}
                                className="w-full text-lg font-bold p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-slate-700"
                            />
                            <span className="absolute right-4 top-4 text-slate-400 font-bold">%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={currentMargin - 1}
                            value={proposedDiscount}
                            onChange={(e) => setProposedDiscount(Number(e.target.value))}
                            className="w-full mt-3 accent-violet-500 h-2 bg-slate-200 rounded-lg cursor-pointer appearance-none"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">

                    {feasibility === 'impossible' ? (
                        <div className="text-red-500 font-bold">
                            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                            LOSING MONEY! Discount exceeds margin.
                        </div>
                    ) : (
                        <>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Required Volume Increase</p>
                            <div className="flex items-baseline gap-1 justify-center">
                                <span className="text-5xl font-black text-slate-800">+{requiredVolumeIncrease}%</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mt-2 max-w-[200px]">
                                To maintain the SAME profit, you must sell <strong className="text-violet-600">{multiplier}x</strong> more units.
                            </p>

                            <div className="mt-6 w-full">
                                <div className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ${feasibility === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        feasibility === 'medium' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            feasibility === 'hard' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                    {feasibility === 'easy' ? '✅ Easy Target' :
                                        feasibility === 'medium' ? '⚖️ Achievable' :
                                            feasibility === 'hard' ? '⚠️ High Effort' :
                                                '🛑 Very Difficult'}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Visual Comparison */}
                    {feasibility !== 'impossible' && (
                        <div className="mt-6 flex items-center gap-4 opacity-50">
                            <div className="text-center">
                                <ShoppingBag className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                                <span className="text-[10px] font-bold">100 Sold</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                            <div className="text-center">
                                <div className="flex justify-center -space-x-2">
                                    <ShoppingBag className="w-6 h-6 text-violet-500" />
                                    {multiplier > 1.5 && <ShoppingBag className="w-6 h-6 text-violet-500" />}
                                    {multiplier > 2.5 && <ShoppingBag className="w-6 h-6 text-violet-500" />}
                                </div>
                                <span className="text-[10px] font-bold text-violet-600">{Math.round(100 * (1 + requiredVolumeIncrease / 100))} Sold</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DiscountVolumeCalculator;
