import React, { useState } from 'react';
import { Users, Target, ChevronRight, X, TrendingUp, DollarSign, Activity, ShoppingBag, Mail, Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { formatCurrency } from '../../../utils/formatUtils';

const RFMAnalysis = ({ rfmAnalysis, totalProducts, currency = '฿', onAnalyze }) => {
    const [selectedSegment, setSelectedSegment] = useState(null);

    if (!rfmAnalysis) return null;

    // Correct mapping based on analyticsUtils.js logic
    const segmentConfig = {
        'Champions': {
            color: '#7e22ce', bg: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-500',
            textColor: 'text-purple-700',
            desc: 'Your best customers. Buy often, spend the most.', icon: Target,
            action: 'Offer exclusive VIP rewards & early access.'
        },
        'Loyal Customers': {
            color: '#2563eb', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500',
            textColor: 'text-blue-700',
            desc: 'Buy regularly. Upsell them to higher value items.', icon: Users,
            action: 'Recommend complementary high-margin products.'
        },
        'Potential Loyalists': {
            color: '#0891b2', bg: 'bg-cyan-50', border: 'border-cyan-200', bar: 'bg-cyan-500',
            textColor: 'text-cyan-700',
            desc: 'Recent customers with average frequency.', icon: TrendingUp,
            action: 'Send engagement campaigns to increase frequency.'
        },
        'Need Attention': {
            color: '#ea580c', bg: 'bg-orange-50', border: 'border-orange-200', bar: 'bg-orange-500',
            textColor: 'text-orange-700',
            desc: 'Below average recency and frequency.', icon: Activity,
            action: 'Run time-sensitive discounts to reactivate.'
        },
        'At Risk': {
            color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', bar: 'bg-red-500',
            textColor: 'text-red-700',
            desc: 'Haven\'t purchased in a long time.', icon: X,
            action: 'Send "We Miss You" win-back offers.'
        }
    };

    const getSegmentStyle = (segment) => segmentConfig[segment] || segmentConfig['At Risk'];

    // Process data for Scatter Plot
    const scatterData = rfmAnalysis.rfmDetails.map(p => ({
        ...p,
        x: p.recencyScore, // Recency Score (High is recently bought)
        y: p.frequencyScore, // Frequency Score (High is frequent)
        z: p.monetaryScore * 10, // Size based on GMV
        segmentConfig: getSegmentStyle(p.segment)
    }));

    const selectedProducts = selectedSegment
        ? rfmAnalysis.rfmDetails?.filter(p => p.segment === selectedSegment)
        : [];

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4">

            {/* Left Col: Visual Analysis */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-sm h-[500px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" /> Customer Matrix
                        </h3>
                        <div className="flex gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-600"></div>Champions</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div>Loyal</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"></div>At Risk</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Recency"
                                    domain={[0, 6]}
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(val) => val === 5 ? 'Recent' : val === 1 ? 'Old' : val}
                                    label={{ value: 'Recency Score', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Frequency"
                                    domain={[0, 6]}
                                    tick={{ fontSize: 10 }}
                                    tickFormatter={(val) => val === 5 ? 'High' : val === 1 ? 'Low' : val}
                                    label={{ value: 'Frequency Score', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                                />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Value" />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 shadow-xl rounded-xl border border-slate-100 text-xs">
                                                    <p className="font-bold text-slate-800 mb-1">{data.name}</p>
                                                    <p className="text-slate-500">{data.segment}</p>
                                                    <p className="font-mono text-indigo-600 font-bold">{formatCurrency(data.gmv, currency)}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Products" data={scatterData} onClick={(e) => setSelectedSegment(e.segment)}>
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.segmentConfig.color} fillOpacity={0.6} stroke={entry.segmentConfig.color} strokeWidth={2} />
                                    ))}
                                </Scatter>
                                {/* Quadrant Divide */}
                                <ReferenceLine x={3} stroke="#e2e8f0" strokeDasharray="3 3" />
                                <ReferenceLine y={3} stroke="#e2e8f0" strokeDasharray="3 3" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(rfmAnalysis.segments).slice(0, 4).map(([seg, data]) => {
                        const conf = getSegmentStyle(seg);
                        return (
                            <button
                                key={seg}
                                onClick={() => setSelectedSegment(seg)}
                                className={`p-4 rounded-2xl border transition-all text-left group hover:scale-105 ${selectedSegment === seg ? `shadow-md ring-2 ring-${conf.color.split('#')[1]}` : 'bg-white border-slate-100 hover:border-slate-200'}`}
                            >
                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${conf.textColor}`}>{seg}</p>
                                <p className="text-2xl font-black text-slate-800">{data.count}</p>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Col: Details & Actions */}
            <div className="lg:w-[400px] min-w-[350px] space-y-6">
                {selectedSegment ? (
                    <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right-8 duration-500">
                        {/* Header */}
                        <div className={`p-6 ${getSegmentStyle(selectedSegment).bg}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`text-2xl font-black ${getSegmentStyle(selectedSegment).textColor}`}>{selectedSegment}</h3>
                                    <p className="text-slate-600 text-xs font-medium mt-1 opacity-80">{getSegmentStyle(selectedSegment).desc}</p>
                                </div>
                                <button onClick={() => setSelectedSegment(null)} className="p-1 bg-white/50 rounded-full hover:bg-white transition-colors">
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                            <div className="flex gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg h-fit">
                                    <Zap className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Recommended Action</h4>
                                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                        {getSegmentStyle(selectedSegment).action}
                                    </p>
                                    <button className="mt-3 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> Create Campaign
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {selectedProducts.map(p => (
                                <div key={p.id} className="p-3 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-3 group cursor-pointer border-b border-slate-50 last:border-0" onClick={() => onAnalyze && onAnalyze(p)}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] ${getSegmentStyle(selectedSegment).bg} ${getSegmentStyle(selectedSegment).textColor}`}>
                                        {p.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-700 truncate">{p.name}</p>
                                        <p className="text-[10px] text-slate-400">Sold {p.daysLastSold} days ago</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-800">{formatCurrency(p.gmv, currency)}</p>
                                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-indigo-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-[24px] border border-dashed border-slate-300 p-8 h-full flex flex-col items-center justify-center text-center opacity-60">
                        <Target className="w-12 h-12 text-slate-300 mb-4" />
                        <h4 className="text-lg font-bold text-slate-500">No Segment Selected</h4>
                        <p className="text-sm text-slate-400 mt-2 max-w-[200px]">Click on a chart bubble or a summary card to view actionable insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RFMAnalysis;
