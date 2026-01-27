import React from 'react';
import {
    X, Smartphone, FileText, Zap, Activity, DollarSign, ShoppingBag,
    Video, Eye, MousePointer2, Lightbulb
} from 'lucide-react';
import { formatCurrency, getBadgeColor, getHealthColor } from '../../utils/formatUtils';

const ProductDetailModal = ({ product, onClose, currency, benchmarks }) => {
    if (!product) return null;
    const maxGmv = Math.max(product.shopGmv, product.videoGmv, product.liveGmv) || 1;
    const healthScore = product.healthScore || 0;

    // Comparison Logic
    const cvrDiff = product.cvrNum - benchmarks.avgCvr;
    const ctrDiff = product.ctrNum - benchmarks.avgCtr;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(product.abcCategory)}`}>
                                Class {product.abcCategory}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                {product.status}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getHealthColor(healthScore)}`}>
                                Health: {healthScore}/100
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">{product.name}</h2>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"><Smartphone className="w-3 h-3 text-violet-600" /> Platform: <strong>{product.platform}</strong></span>
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"><FileText className="w-3 h-3 text-indigo-600" /> ID: {product.id}</span>
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm font-semibold text-violet-700"><Zap className="w-3 h-3" /> Segment: {product.segment}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">

                    {/* Benchmarking Section */}
                    <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-violet-600" /> Market Benchmark Analysis
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Conversion Rate (CVR)</span>
                                    <span className={cvrDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                        {product.cvr} vs Avg {benchmarks.avgCvr.toFixed(2)}% ({cvrDiff > 0 ? '+' : ''}{cvrDiff.toFixed(2)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden relative">
                                    {/* Average Marker */}
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: `${Math.min(benchmarks.avgCvr * 5, 100)}%` }}></div>
                                    <div className={`h-full rounded-full ${cvrDiff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(product.cvrNum * 5, 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Click-Through Rate (CTR)</span>
                                    <span className={ctrDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                        {product.ctr} vs Avg {benchmarks.avgCtr.toFixed(2)}% ({ctrDiff > 0 ? '+' : ''}{ctrDiff.toFixed(2)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{ left: `${Math.min(benchmarks.avgCtr * 10, 100)}%` }}></div>
                                    <div className={`h-full rounded-full ${ctrDiff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(product.ctrNum * 10, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                        {product.potentialRevenue > 0 && (
                            <div className="mt-4 p-3 bg-violet-100 rounded-lg text-xs text-violet-800 flex items-center gap-2 border border-violet-200">
                                <Lightbulb className="w-4 h-4" />
                                <span><strong>Opportunity:</strong> Improving CVR to market average could generate an extra <strong>{formatCurrency(product.potentialRevenue, currency)}</strong>.</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Sales</p>
                            <p className="text-xl md:text-2xl font-bold text-violet-700">{formatCurrency(product.gmv, currency)}</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Items Sold</p>
                            <p className="text-xl md:text-2xl font-bold text-slate-700">{product.itemsSold}</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Conversion</p>
                            <p className="text-xl md:text-2xl font-bold text-emerald-600">{product.cvr}</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Orders</p>
                            <p className="text-xl md:text-2xl font-bold text-amber-600">{product.orders}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> GMV Source Analysis
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Shop Tab', gmv: product.shopGmv, icon: ShoppingBag, color: 'violet' },
                                    { name: 'Video Content', gmv: product.videoGmv, icon: Video, color: 'indigo' },
                                    { name: 'Live Stream', gmv: product.liveGmv, icon: Eye, color: 'rose' },
                                ].map((channel, i) => (
                                    <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="flex items-center gap-2 text-slate-700 font-bold"><channel.icon className={`w-4 h-4 text-${channel.color}-600`} /> {channel.name}</span>
                                            <span className="font-bold text-slate-900">{formatCurrency(channel.gmv, currency)}</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                            <div style={{ width: `${(channel.gmv / (maxGmv || 1)) * 100}%` }} className={`h-full bg-${channel.color}-500 rounded-full`}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500">
                                            <span>Contribution: <strong>{(channel.gmv > 0 ? ((channel.gmv / (product.gmv || 1)) * 100).toFixed(1) : 0)}%</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <MousePointer2 className="w-4 h-4" /> Traffic & Conversion
                            </h3>
                            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-6">
                                <div className="relative pl-8 border-l-2 border-slate-200 pb-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Views</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {(product.shopViews + (product.videoViews || 0) + (product.liveViews || 0)).toLocaleString()}
                                    </p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-slate-200 pb-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-300 border-2 border-white"></div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">CTR (Click Through)</p>
                                    <p className="text-lg font-bold text-blue-600">{product.ctr}</p>
                                </div>
                                <div className="relative pl-8 border-l-2 border-emerald-500">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Final Conversion</p>
                                    <p className="text-xl font-bold text-emerald-600">{product.cvr}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
