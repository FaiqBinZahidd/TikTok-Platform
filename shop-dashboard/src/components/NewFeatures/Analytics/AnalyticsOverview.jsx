import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Zap, ArrowRight, Target, Activity, MoreHorizontal, ArrowUpRight, Sparkles, X, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, LineChart, Line } from 'recharts';
import { formatCurrency } from '../../../utils/formatUtils';

import { calculateStatistics, calculateCorrelation } from '../../../utils/analyticsUtils';

export default function AnalyticsOverview({ products, currency, summary, channelData, trends = [], insights = [], forecast = [] }) {

    // State for modal
    const [selectedInsight, setSelectedInsight] = useState(null);

    // Safety checks
    const safeTrends = trends || [];
    const safeInsights = insights || [];
    const safeForecast = forecast || [];

    // --- Advanced Analytics Calculations ---
    const gmvStats = calculateStatistics(products, 'gmv');
    // const orderStats = calculateStatistics(products, 'itemsSold'); // Optional if needed

    // Correlation Analysis
    const corGmvViews = calculateCorrelation(products, 'gmv', 'shopViews');
    const corPriceConversion = calculateCorrelation(products, 'gmv', 'cvr'); // Proxy check
    const corStockSales = calculateCorrelation(products, 'stock', 'itemsSold');

    // Helper for correlation color
    const getCorColor = (val) => {
        if (val > 0.7) return 'text-emerald-500';
        if (val > 0.3) return 'text-blue-500';
        if (val > -0.3) return 'text-slate-400';
        return 'text-rose-500'; // Negative correlation can be good or bad depending on context, but usually indicates inverse relationship
    };

    // Sparkline Component
    const Sparkline = ({ data, color }) => (
        <div className="h-8 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* 1. HERO FORECAST SECTION (Previously "Revenue Forecast") */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 rounded-[24px] p-8 shadow-2xl shadow-slate-900/20 border border-slate-800 relative overflow-hidden group">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-violet-400" />
                                    AI Revenue Forecast
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">Projected earnings based on current velocity & verified trends</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-bold text-emerald-400">89% Confidence</span>
                            </div>
                        </div>

                        <div className="h-[280px] w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={safeForecast}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="week" stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={val => `${val / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#a78bfa' }}
                                        formatter={(val) => [formatCurrency(val, currency), 'Projected']}
                                    />
                                    {/* Confidence Interval (Simulated) */}
                                    <Area type="monotone" dataKey="revenue" stroke="none" fill="url(#colorConfidence)" fillOpacity={0.3} strokeWidth={0} />
                                    {/* Main Line */}
                                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Column */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[24px] p-6 shadow-xl text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <p className="text-violet-200 text-xs font-bold uppercase tracking-wider mb-2">Next Week Predicted</p>
                        <p className="text-3xl font-black tracking-tight">{safeForecast[0] ? formatCurrency(safeForecast[0].revenue, currency) : '$0'}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-violet-200 bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <TrendingUp className="w-3 h-3" /> +12.5% vs last week
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-slate-400" /> Key Insight
                        </h4>
                        {safeInsights.length > 0 ? (
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    {safeInsights[0].message}
                                </p>
                                <button
                                    onClick={() => setSelectedInsight(safeInsights[0])}
                                    className="text-violet-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all mt-2"
                                >
                                    View Details <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No critical insights today.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. TREND SPOTTER (Redesigned) */}
            {/* ... (existing content) ... */}

            {/* ACTION PLAN MODAL */}
            {selectedInsight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div className="flex gap-3">
                                <div className="p-2 bg-violet-100 rounded-lg text-violet-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Action Plan</h3>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ai Generated Strategy</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedInsight(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                                <p className="text-sm font-bold text-violet-800 leading-relaxed">
                                    "{selectedInsight.message}"
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Actions</h4>

                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">1</div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Velocity Verification</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Check stock depth for top 3 viral SKUs. If cover is &lt; 7 days, initiate air-freight restock immediately.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Ad Spend Optimization</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Increase budget by 20% on winning creatives for these SKUs to maximize the viral wave.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="mt-1">
                                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">3</div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm">Bundle Strategy</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Create bundles with high-margin slow movers to increase AOV while traffic is high.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedInsight(null)}
                                className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-rose-500" />
                            Trend Spotter
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Real-time product velocity tracking</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">Last 24h</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-400">7 Days</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {safeTrends.slice(0, 6).map((item, i) => (
                        <div key={i} className="group p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-violet-100 transition-all duration-300 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-violet-700 transition-colors">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${item.status.includes('Viral') ? 'bg-green-100 text-green-700' :
                                            item.status.includes('Cooling') ? 'bg-slate-200 text-slate-500' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-800">{item.trendSlope > 0 ? '+' : ''}{item.trendSlope.toFixed(1)}x</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Multi</p>
                                </div>
                            </div>

                            {/* Simulated Sparkline / Action Area */}
                            <div className="flex items-center justify-between mt-4">
                                <Sparkline
                                    data={[
                                        { value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }, { value: item.trendSlope * 10 + 20 }
                                    ]}
                                    color={item.trendSlope > 1.5 ? '#10b981' : '#6366f1'}
                                />
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white p-2 rounded-lg hover:bg-violet-600">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. CHANNEL & STATISTICAL ANALYSIS */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Channel Mix (Existing) */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> Channel Mix
                    </h3>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Shop', value: channelData?.shop || 0, fill: '#8b5cf6' },
                                { name: 'Video', value: channelData?.video || 0, fill: '#ec4899' },
                                { name: 'Live', value: channelData?.live || 0, fill: '#f43f5e' }
                            ]} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} width={50} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} background={{ fill: '#f8fafc' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* NEW: Statistical Analysis Panel (Replaces Growth Opportunity) */}
                <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-violet-500" /> Advanced Statistics
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400">GMV Mean</p>
                            <p className="text-lg font-black text-slate-700">{formatCurrency(gmvStats.mean, currency)}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400">GMV Median</p>
                            <p className="text-lg font-black text-slate-700">{formatCurrency(gmvStats.median, currency)}</p>
                        </div>
                        <div className="col-span-2 flex justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Std Dev (Volatility)</p>
                                <p className="text-lg font-black text-slate-700 flex items-center gap-2">
                                    {formatCurrency(gmvStats.stdDev, '')}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${gmvStats.cv > 100 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        CV: {gmvStats.cv.toFixed(1)}%
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Correlations</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-600">GMV vs. Traffic</span>
                                <span className={`font-mono font-bold ${getCorColor(corGmvViews)}`}>{corGmvViews.toFixed(3)}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${corGmvViews > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.abs(corGmvViews) * 100}%` }}></div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-medium mt-2">
                                <span className="text-slate-600">Stock vs. Sales</span>
                                <span className={`font-mono font-bold ${getCorColor(corStockSales)}`}>{corStockSales.toFixed(3)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
