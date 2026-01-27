import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, RefreshCw, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils'; // Assuming util exists or mock it
// If formatUtils is not easily reachable, define local helper
// const formatCurrency = (val, curr) => `${curr}${val.toLocaleString()}`;

const NetMarginCalculator = ({ currency }) => {
    // Inputs (State)
    const [values, setValues] = useState({
        sellingPrice: 1000,
        cogs: 400, // Cost of Goods Sold
        shippingCost: 50,
        platformFeePercent: 12, // e.g. TikTok Shop ~12% incl VAT
        adSpendPercent: 20, // Target ROAS 5
        miscCost: 0
    });

    // Outputs (Derived)
    const [results, setResults] = useState({
        platformFeeAmt: 0,
        adSpendAmt: 0,
        totalCost: 0,
        netProfit: 0,
        marginPercent: 0,
        roi: 0
    });

    // Calculation Effect
    useEffect(() => {
        const { sellingPrice, cogs, shippingCost, platformFeePercent, adSpendPercent, miscCost } = values;

        const price = parseFloat(sellingPrice) || 0;
        const cost = parseFloat(cogs) || 0;
        const ship = parseFloat(shippingCost) || 0;
        const feePct = parseFloat(platformFeePercent) || 0;
        const adPct = parseFloat(adSpendPercent) || 0;
        const misc = parseFloat(miscCost) || 0;

        const platformFeeAmt = price * (feePct / 100);
        const adSpendAmt = price * (adPct / 100);

        const totalCost = cost + ship + platformFeeAmt + adSpendAmt + misc;
        const netProfit = price - totalCost;
        const marginPercent = price > 0 ? (netProfit / price) * 100 : 0;
        const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0; // Return on Investment (Spend)

        setResults({
            platformFeeAmt,
            adSpendAmt,
            totalCost,
            netProfit,
            marginPercent,
            roi
        });
    }, [values]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT PANEL */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 h-fit">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Unit Economics</h3>
                        <p className="text-sm text-slate-400 font-medium">Input your per-unit costs and targets.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Selling Price</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                            <input
                                type="number" name="sellingPrice" value={values.sellingPrice} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">COGS (Product Cost)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                                <input
                                    type="number" name="cogs" value={values.cogs} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Shipping Cost</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">{currency}</span>
                                <input
                                    type="number" name="shippingCost" value={values.shippingCost} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Platform Fee (%)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold"><Percent className="w-4 h-4" /></span>
                                <input
                                    type="number" name="platformFeePercent" value={values.platformFeePercent} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">Includes comms + payment fees</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ads Budget / CPA (%)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-400 font-bold"><Percent className="w-4 h-4" /></span>
                                <input
                                    type="number" name="adSpendPercent" value={values.adSpendPercent} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 ml-1">Expected Marketing Cost</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESULTS PANEL */}
            <div className="space-y-6">
                <div className={`rounded-[32px] p-8 shadow-lg text-white transition-all duration-500 ${results.netProfit > 0 ? 'bg-gradient-to-br from-emerald-600 to-teal-800' : 'bg-gradient-to-br from-rose-600 to-pink-800'}`}>
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-4xl font-black tracking-tight">{formatCurrency(results.netProfit, currency)}</h2>
                            <p className="opacity-80 font-bold uppercase tracking-widest text-sm mt-1">True Net Profit</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-bold backdrop-blur-md bg-white/20 border border-white/20 flex items-center gap-2 ${results.netProfit > 0 ? 'text-emerald-50' : 'text-rose-50'}`}>
                            {results.netProfit > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                            {results.marginPercent.toFixed(1)}% Margin
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-medium opacity-80">
                            <span>Platform Fees Paid</span>
                            <span>- {formatCurrency(results.platformFeeAmt, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium opacity-80">
                            <span>Ad Spend (Marketing)</span>
                            <span>- {formatCurrency(results.adSpendAmt, currency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-medium opacity-80">
                            <span>Product & Ship Cost</span>
                            <span>- {formatCurrency(parseFloat(values.cogs) + parseFloat(values.shippingCost), currency)}</span>
                        </div>
                        <div className="h-px bg-white/20 my-2"></div>
                        <div className="flex justify-between items-center font-bold">
                            <span>ROI (Return on Investment)</span>
                            <span>{results.roi.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        Analysis
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {results.netProfit > 0
                            ? `At a ${results.marginPercent.toFixed(1)}% margin, you are profitable. To scale, ensure your Ad CPA stays below ${(results.netProfit + results.adSpendAmt).toFixed(0)} ${currency} (Break-even CPA).`
                            : "You are losing money on every sale. You must either raise prices, lower COGS, or reduce ad spend to become profitable."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NetMarginCalculator;
