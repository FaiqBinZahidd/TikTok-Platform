import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertTriangle, Crosshair, DollarSign, Package, Activity, Target, Zap, Percent } from 'lucide-react';
import NetMarginCalculator from './NetMarginCalculator';
import BreakEvenCalculator from './BreakEvenCalculator';
import InventoryBurnCalculator from './InventoryBurnCalculator';
import AdStressTest from './AdStressTest';
import DiscountVolumeCalculator from './DiscountVolumeCalculator';

const DecisionLabView = ({ currency, t }) => {
    const [activeTool, setActiveTool] = useState(null);

    const tools = [
        {
            id: 'net_margin',
            title: 'True Net Margin',
            desc: 'Calculate real profit after all hidden platform fees, ads, and returns.',
            icon: DollarSign,
            color: 'emerald',
            difficulty: 'Essential'
        },
        {
            id: 'break_even',
            title: 'Break-Even Volume',
            desc: 'How many units must you sell to cover fixed costs and ad spend?',
            icon: Target,
            color: 'blue',
            difficulty: 'Strategic'
        },
        {
            id: 'burn_rate',
            title: 'Inventory Burn Rate',
            desc: 'Predict exactly when you will run out of stock based on velocity.',
            icon: Activity,
            color: 'rose',
            difficulty: 'Critical'
        },
        {
            id: 'ad_stress',
            title: 'Ad Stress Test',
            desc: 'Simulate what happens to your profit if ad costs rise by 20%.',
            icon: AlertTriangle,
            color: 'amber',
            difficulty: 'Advanced'
        },
        {
            id: 'discount_vol',
            title: 'Discount Profitability',
            desc: 'Calculate the sales lift required to justify a discount.',
            icon: Percent,
            color: 'violet',
            difficulty: 'Tactical'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Zap className="w-6 h-6" />
                    </div>
                    Growth Command Lab
                </h2>
                <p className="text-slate-500 mt-2 max-w-2xl text-lg">
                    Model outcomes before they cost you money. Use these simulators to make data-backed decisions.
                </p>
            </div>

            {/* Tool Grid (show only if no tool active) */}
            {!activeTool && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => !tool.comingSoon && setActiveTool(tool.id)}
                                disabled={tool.comingSoon}
                                className={`text-left group relative bg-white rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 ${tool.comingSoon ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:-translate-y-1'}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${tool.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                    tool.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                                        tool.color === 'rose' ? 'bg-rose-100 text-rose-600' :
                                            'bg-amber-100 text-amber-600'
                                    }`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-violet-700 transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                                    {tool.desc}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                        {tool.difficulty}
                                    </span>
                                    {tool.comingSoon ? (
                                        <span className="text-xs font-bold text-slate-400">Coming Soon</span>
                                    ) : (
                                        <span className="text-violet-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Open Simulator →
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Active Tool View */}
            {activeTool && (
                <div className="animate-in fade-in zoom-in-95">
                    <button
                        onClick={() => setActiveTool(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors"
                    >
                        ← Back to Lab
                    </button>

                    {activeTool === 'net_margin' && <NetMarginCalculator currency={currency} />}
                    {activeTool === 'break_even' && <BreakEvenCalculator currency={currency} />}
                    {activeTool === 'burn_rate' && <InventoryBurnCalculator currency={currency} />}
                    {activeTool === 'ad_stress' && <AdStressTest currency={currency} />}
                    {activeTool === 'discount_vol' && <DiscountVolumeCalculator currency={currency} />}
                </div>
            )}
        </div>
    );
};

export default DecisionLabView;
