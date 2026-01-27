import React, { useState, useEffect } from 'react';
import { Activity, Calendar, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const InventoryBurnCalculator = ({ currency = 'USD' }) => {
    const [currentStock, setCurrentStock] = useState(1000);
    const [dailyVelocity, setDailyVelocity] = useState(25);
    const [leadTime, setLeadTime] = useState(14);
    const [growthRate, setGrowthRate] = useState(0);

    // Outputs
    const [daysUntilStockout, setDaysUntilStockout] = useState(0);
    const [stockoutDate, setStockoutDate] = useState(null);
    const [reorderDeadline, setReorderDeadline] = useState(null);
    const [status, setStatus] = useState('healthy');

    useEffect(() => {
        const adjustedVelocity = dailyVelocity * (1 + (growthRate / 100));
        const days = currentStock / (adjustedVelocity || 0.1);
        setDaysUntilStockout(Math.ceil(days));

        const today = new Date();
        const outDate = new Date(today);
        outDate.setDate(today.getDate() + days);
        setStockoutDate(outDate);

        const deadline = new Date(outDate);
        deadline.setDate(outDate.getDate() - leadTime);
        setReorderDeadline(deadline);

        // Status Logic
        if (days < leadTime) setStatus('critical');
        else if (days < leadTime + 7) setStatus('warning');
        else setStatus('healthy');

    }, [currentStock, dailyVelocity, leadTime, growthRate]);

    return (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-rose-100 rounded-2xl">
                    <Activity className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Inventory Burn Rate</h3>
                    <p className="text-sm text-slate-500">Predict stockouts & reorder points</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Stock Level (Units)</label>
                        <input
                            type="number"
                            value={currentStock}
                            onChange={(e) => setCurrentStock(Math.max(0, Number(e.target.value)))}
                            className="w-full text-lg font-bold p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Base Daily Velocity (Units/Day)</label>
                        <input
                            type="number"
                            value={dailyVelocity}
                            onChange={(e) => setDailyVelocity(Math.max(0, Number(e.target.value)))}
                            className="w-full text-lg font-bold p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Supplier Lead Time (Days)</label>
                        <input
                            type="number"
                            value={leadTime}
                            onChange={(e) => setLeadTime(Math.max(0, Number(e.target.value)))}
                            className="w-full text-lg font-bold p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 text-slate-700"
                        />
                        <p className="text-xs text-slate-400 mt-1">Days from ordering to receiving goods</p>
                    </div>

                    <div className="pt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex justify-between">
                            <span>Growth Scenario</span>
                            <span className={`font-black ${growthRate > 0 ? 'text-emerald-600' : growthRate < 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                {growthRate > 0 ? '+' : ''}{growthRate}%
                            </span>
                        </label>
                        <input
                            type="range"
                            min="-50"
                            max="100"
                            step="5"
                            value={growthRate}
                            onChange={(e) => setGrowthRate(Number(e.target.value))}
                            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                        />
                        <p className="text-xs text-slate-400 mt-1.5 flex justify-between">
                            <span>Conservative (-50%)</span>
                            <span>Aggressive (+100%)</span>
                        </p>
                    </div>
                </div>

                {/* Outputs */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-center">

                    {/* Main Counter */}
                    <div className="text-center mb-8">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Days Until Stockout</p>
                        <div className={`text-6xl font-black ${status === 'critical' ? 'text-rose-600' : status === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {daysUntilStockout}
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">
                            Estimated: {stockoutDate?.toLocaleDateString()}
                        </p>
                    </div>

                    {/* Reorder Alert */}
                    <div className={`p-4 rounded-xl border-2 ${status === 'critical' ? 'bg-rose-50 border-rose-100' : status === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="flex items-start gap-3">
                            {status === 'critical' ? <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" /> :
                                status === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" /> :
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />}

                            <div>
                                <h4 className={`font-bold ${status === 'critical' ? 'text-rose-700' : status === 'warning' ? 'text-amber-700' : 'text-emerald-700'}`}>
                                    {status === 'critical' ? 'Stockout Imminent!' : status === 'warning' ? 'Reorder Soon' : 'Healthy Inventory'}
                                </h4>
                                <p className="text-xs text-slate-600 mt-1 font-medium">
                                    {status === 'critical' ? `You have less than lead time (${leadTime} days) remaining. Order immediately!` :
                                        status === 'warning' ? `You should place an order by ${reorderDeadline?.toLocaleDateString()} to avoid gap.` :
                                            `You have plenty of stock. Next reorder by ${reorderDeadline?.toLocaleDateString()}.`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Viz */}
                    <div className="mt-6">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-slate-300" style={{ width: `${(leadTime / (daysUntilStockout + leadTime)) * 100}%` }}></div>
                            <div className={`h-full ${status === 'critical' ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ flex: 1 }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                            <span>Now</span>
                            <span>Stockout</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InventoryBurnCalculator;
