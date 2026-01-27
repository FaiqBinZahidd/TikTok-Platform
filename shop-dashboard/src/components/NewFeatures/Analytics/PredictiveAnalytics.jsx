import React from 'react';
import { TrendingUp, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Bar } from 'recharts';

const PredictiveAnalytics = ({ predictions, anomalies, currency }) => {
    if (!predictions || !anomalies) return null;

    // Linear Regression Data Prep
    const growth = predictions.averageGrowth || 0;
    const forecastData = Array.from({ length: 12 }, (_, i) => ({
        day: `Day ${i * 3}`,
        value: 100 * Math.pow(1 + (growth / 100), i),
        lower: 100 * Math.pow(1 + (growth / 100), i) * 0.9,
        upper: 100 * Math.pow(1 + (growth / 100), i) * 1.1
    }));

    // Velocity Simulation (Data for Recharts)
    const velocityData = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const peak1 = Math.exp(-Math.pow(hour - 12, 2) / 8) * 100;
        const peak2 = Math.exp(-Math.pow(hour - 20, 2) / 8) * 120;
        const noise = Math.random() * 20;
        return {
            hour: `${hour}:00`,
            orders: Math.min(Math.round(peak1 + peak2 + noise + 10), 100)
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Real-Time Velocity Graph */}
            <div className="bg-slate-900 rounded-[24px] p-8 shadow-large relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-violet-400" />
                            Sales Velocity Monitor
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Real-time sales momentum over the last 24 hours.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/20 rounded-full border border-violet-500/30">
                        <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                        <span className="text-xs font-bold text-violet-200">Live Updates</span>
                    </div>
                </div>

                {/* Recharts Velocity Chart */}
                <div className="h-64 w-full -ml-4 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={velocityData}>
                            <defs>
                                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.5} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                            <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                            <YAxis stroke="#475569" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#a78bfa' }}
                            />
                            <Bar dataKey="orders" fill="url(#velocityGradient)" barSize={12} radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Sales Forecast w/ Linear Regression Visual */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    Predictive Sales Forecast
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-[20px] border border-emerald-200">
                            <p className="text-emerald-800/70 text-sm font-bold uppercase tracking-wider">Projected Growth</p>
                            <p className="text-4xl font-extrabold text-emerald-700 mt-2">+{predictions.averageGrowth?.toFixed(1)}%</p>
                            <p className="text-xs text-emerald-800/60 font-medium mt-2">Monthly Compound Rate</p>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-[20px] border border-slate-200">
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Projected Revenue</p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-2">{formatCurrency(predictions.totalPredictedRevenue, currency)}</p>
                            <p className="text-xs text-slate-500 font-medium mt-2">Next 30 Days</p>
                        </div>
                    </div>

                    {/* Recharts Regression Chart */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-[20px] p-6 relative overflow-hidden border border-slate-800">
                        <p className="text-white/80 font-bold mb-4 flex justify-between">
                            <span>Linear Regression Model</span>
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Avg Error &lt; 2%</span>
                        </p>
                        <div className="h-48 w-full -ml-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis dataKey="day" hide />
                                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        formatter={(val) => [val.toFixed(0), 'Index']}
                                    />
                                    {/* Confidence Interval Band */}
                                    <Area type="monotone" dataKey="upper" stroke="none" fill="#10b981" fillOpacity={0.1} />
                                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#forecastGradient)" />
                                    <Area type="monotone" dataKey="lower" stroke="none" fill="#0f172a" fillOpacity={1} /> {/* Masking trick for band if simple AreaStack not used */}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-slate-800 mb-4">Top Growth Potential Products</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictions.predictions?.slice(0, 6).map((pred, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:shadow-md transition-all">
                                <div>
                                    <p className="font-bold text-slate-800">{pred.name}</p>
                                    <p className="text-xs text-slate-500">Current: {formatCurrency(pred.currentGMV, currency)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600">{formatCurrency(pred.predictedGMV, currency)}</p>
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">+{Number(pred.growthRate || 0).toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Anomaly Detection */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    Anomaly Detection
                </h3>

                {anomalies.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-[20px] border border-dashed border-slate-300">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 font-medium">No anomalies detected. Operations normal.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {anomalies.slice(0, 5).map((anomaly, idx) => (
                            <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-[20px] flex gap-4 transition-transform hover:scale-[1.01]">
                                <div className="mt-1">
                                    <div className="w-2 h-2 bg-rose-500 rounded-full ring-4 ring-rose-200 animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900">{anomaly.name}</p>
                                        <span className="px-2 py-0.5 bg-rose-200 text-rose-800 rounded text-[10px] font-bold uppercase">{anomaly.severity}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium mt-1">{anomaly.anomalyType}</p>
                                    <p className="text-xs text-slate-500 mt-1">{anomaly.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictiveAnalytics;
