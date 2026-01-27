import React, { useState } from 'react';
import { Calculator, DollarSign, RefreshCw, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const CalculatorView = ({ currency = '฿' }) => {
    const [costPrice, setCostPrice] = useState(100);
    const [sellingPrice, setSellingPrice] = useState(250);
    const [shippingCost, setShippingCost] = useState(30);
    const [platformFeePercent, setPlatformFeePercent] = useState(5);
    const [adSpendPerUnit, setAdSpendPerUnit] = useState(20);
    const [estimatedMonthlySales, setEstimatedMonthlySales] = useState(100);

    const platformFee = sellingPrice * (platformFeePercent / 100);
    const totalCost = costPrice + shippingCost + platformFee + adSpendPerUnit;
    const profitPerUnit = sellingPrice - totalCost;
    const margin = (profitPerUnit / sellingPrice) * 100;
    const roi = (profitPerUnit / totalCost) * 100;
    const monthlyProfit = profitPerUnit * estimatedMonthlySales;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Profit Simulator</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Panel */}
                <div className="bg-white rounded-[24px] p-8 shadow-soft">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-violet-600" /> Parameters
                    </h3>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Product Cost ({currency})</label>
                            <input
                                type="number"
                                value={costPrice}
                                onChange={(e) => setCostPrice(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Selling Price ({currency})</label>
                            <input
                                type="number"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500">Shipping</label>
                                <input
                                    type="number"
                                    value={shippingCost}
                                    onChange={(e) => setShippingCost(Number(e.target.value))}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500">Platform Fee (%)</label>
                                <input
                                    type="number"
                                    value={platformFeePercent}
                                    onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Ad Spend / Unit ({currency})</label>
                            <input
                                type="number"
                                value={adSpendPerUnit}
                                onChange={(e) => setAdSpendPerUnit(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-800 font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={`p-6 rounded-[24px] shadow-sm ${profitPerUnit > 0 ? 'card-green' : 'card-pink'}`}>
                            <p className="text-sm font-bold opacity-70 mb-1">Net Profit / Unit</p>
                            <p className="text-3xl font-extrabold">{formatCurrency(profitPerUnit, currency)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                            <p className="text-sm font-bold text-slate-500 mb-1">Margin</p>
                            <p className={`text-3xl font-extrabold ${margin > 20 ? 'text-emerald-500' : margin > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
                                {margin.toFixed(1)}%
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[24px] shadow-soft border border-slate-100">
                            <p className="text-sm font-bold text-slate-500 mb-1">ROI</p>
                            <p className={`text-3xl font-extrabold ${roi > 100 ? 'text-emerald-500' : 'text-slate-700'}`}>
                                {roi.toFixed(0)}%
                            </p>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="bg-white rounded-[24px] p-8 shadow-soft">
                        <h3 className="font-bold text-lg text-slate-800 mb-6">Cost Breakdown</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-32 text-sm font-semibold text-slate-500">Product Cost</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400" style={{ width: `${(costPrice / sellingPrice) * 100}%` }}></div>
                                </div>
                                <div className="w-20 text-right font-bold text-slate-700">{formatCurrency(costPrice, currency)}</div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-32 text-sm font-semibold text-slate-500">Fees & Shipping</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-400" style={{ width: `${((shippingCost + platformFee) / sellingPrice) * 100}%` }}></div>
                                </div>
                                <div className="w-20 text-right font-bold text-slate-700">{formatCurrency(shippingCost + platformFee, currency)}</div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-32 text-sm font-semibold text-slate-500">Ad Spend</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-400" style={{ width: `${(adSpendPerUnit / sellingPrice) * 100}%` }}></div>
                                </div>
                                <div className="w-20 text-right font-bold text-slate-700">{formatCurrency(adSpendPerUnit, currency)}</div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                                <div className="w-32 text-sm font-bold text-emerald-600">Your Profit</div>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${profitPerUnit > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.max((profitPerUnit / sellingPrice) * 100, 0)}%` }}></div>
                                </div>
                                <div className={`w-20 text-right font-bold ${profitPerUnit > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatCurrency(profitPerUnit, currency)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorView;
