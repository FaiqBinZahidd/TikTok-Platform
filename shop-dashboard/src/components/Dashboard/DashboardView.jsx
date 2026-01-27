import React, { useRef } from 'react';
import {
    TrendingUp, ArrowUpRight, Package, DollarSign, Zap, MousePointer2,
    ShoppingBag, Video, Eye, BarChart3, Calculator, Target, MoreHorizontal, Plus, Upload
} from 'lucide-react';
import PlatformBadge from '../PlatformBadge';
import RightPanel from './RightPanel';
import { formatCurrency, getBadgeColor, getHealthColor } from '../../utils/formatUtils';
import SmartInsightCard from '../DecisionLab/SmartInsightCard';
import { generateSmartInsights } from '../../utils/analyticsUtils';

const DashboardView = ({ topProduct, setSelectedProduct, currency, channelData, totalChannelGmv, summary, processedProducts, setActiveView, notifications, visibleKPIs, handleFileUpload, searchTerm, t }) => {
    const fileRef = useRef(null);

    return (
        <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">

            {/* ═══ LEFT CONTENT (8 cols) ═══ */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t('overview')}</h2>
                        <p className="text-slate-500 font-medium">{t('welcome')}, {t('happening_today')}</p>
                    </div>
                    <div className="flex gap-3">
                        <input
                            type="file"
                            ref={fileRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 text-sm"
                        >
                            <div className="p-1 bg-white/20 rounded-full"><Upload className="w-3 h-3" /></div>
                            {t('import_data')}
                        </button>
                    </div>
                </div>

                {/* Row 1: Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Yellow Card: Top Performer */}
                    {(visibleKPIs.topPerformer !== false) && (
                        <div
                            className="card-yellow p-6 relative group cursor-pointer"
                            onClick={() => topProduct.gmv && setSelectedProduct(topProduct)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white/40 rounded-xl backdrop-blur-sm">
                                    <TrendingUp className="w-6 h-6 text-yellow-700" />
                                </div>
                                <div className="px-3 py-1 bg-white/40 rounded-full text-xs font-bold text-yellow-800 backdrop-blur-sm">
                                    {t('top_performer')}
                                </div>
                            </div>

                            {topProduct && topProduct.gmv > 0 ? (
                                <>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-1 leading-tight line-clamp-2">{topProduct.name}</h3>
                                    <p className="text-slate-600 font-medium mb-6">{t('generated_revenue')} <span className="font-bold text-slate-800">{formatCurrency(topProduct.gmv, currency)}</span></p>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <div className="bg-white/50 px-3 py-2 rounded-lg text-center backdrop-blur-md">
                                            <p className="text-[10px] uppercase font-bold text-yellow-800/60">{t('sold')}</p>
                                            <p className="font-bold text-slate-800 text-sm">{topProduct.itemsSold}</p>
                                        </div>
                                        <div className="bg-white/50 px-3 py-2 rounded-lg text-center backdrop-blur-md">
                                            <p className="text-[10px] uppercase font-bold text-yellow-800/60">{t('views')}</p>
                                            <p className="font-bold text-slate-800 text-sm">{(topProduct.shopViews || 0).toLocaleString()}</p>
                                        </div>
                                        <button className="ml-auto p-2 bg-slate-900 text-white rounded-full hover:scale-110 transition-transform shadow-lg shadow-yellow-500/20">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="h-32 flex items-center justify-center text-yellow-800/50">
                                    {t('no_data')}
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    )}

                    {/* Pink Card: Sales Trend (Clickable → Analytics) */}
                    {(visibleKPIs.totalGMV !== false) && (
                        <div
                            onClick={() => setActiveView('analytics')}
                            className="card-pink p-6 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-white/40 rounded-xl backdrop-blur-sm group-hover:bg-white/60 transition-colors">
                                    <BarChart3 className="w-6 h-6 text-pink-700" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-slate-800">{formatCurrency(summary?.totalGmv || 0, currency)}</p>
                                    <p className="text-xs font-bold text-pink-700 uppercase tracking-wide">{t('total_revenue')}</p>
                                </div>
                            </div>

                            {/* Decorative Chart Line */}
                            <div className="mt-8 flex items-end justify-between h-16 gap-2 px-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                {[40, 65, 45, 70, 55, 80, 60, 90, 75].map((h, i) => (
                                    <div key={i} className="w-full bg-white/40 rounded-t-sm hover:bg-white/70 transition-colors" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <p className="mt-4 text-sm font-medium text-pink-900 border-t border-pink-300/30 pt-3 flex justify-between items-center">
                                <span><span className="font-bold">↑ 12%</span> vs last month</span>
                                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                        </div>
                    )}
                </div>

                {/* --- Smart Strategic Insights --- */}
                <div className="mb-2">
                    {(() => {
                        const insights = React.useMemo(() => generateSmartInsights(processedProducts, summary), [processedProducts, summary]);
                        if (insights.length === 0) return null;

                        // Show only the most critical insight to avoid overwhelming the user
                        const topInsight = insights[0];

                        return (
                            <div className="col-span-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 bg-violet-100 rounded-lg">
                                        <Zap className="w-4 h-4 text-violet-700" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        {t('strategic_analysis') || "Strategic Analysis"}
                                    </h3>
                                </div>
                                <SmartInsightCard {...topInsight} />
                            </div>
                        );
                    })()}
                </div>

                {/* Row 2: Secondary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Green Card: Business Health */}
                    {
                        (visibleKPIs.businessHealth !== false) && (
                            <div className="card-green p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">Business Health</h4>
                                        <p className="text-sm text-green-800/70">Overall score based on KPIs</p>
                                    </div>
                                    <div className="p-2 bg-white/40 rounded-full">
                                        <Zap className="w-5 h-5 text-green-700" />
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center gap-4">
                                    <div className="text-5xl font-extrabold text-slate-800 tracking-tighter">
                                        {Math.round(processedProducts.reduce((sum, p) => sum + (p.healthScore || 50), 0) / (processedProducts.length || 1))}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="px-2 py-0.5 bg-white/50 rounded text-[10px] font-bold text-green-800 uppercase">Excellent</span>
                                        <span className="text-xs text-green-800 font-medium">Top 5% of shops</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Blue Card: Channel Distribution (Clickable → Marketing) */}
                    {
                        (visibleKPIs.channelMix !== false) && (
                            <div
                                onClick={() => setActiveView('marketing')}
                                className="card-blue p-6 cursor-pointer hover:scale-[1.02] transition-transform group flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h4 className="font-bold text-slate-800 text-lg">Channel Mix</h4>
                                    <ArrowUpRight className="w-5 h-5 text-blue-700/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: 'Shop', val: channelData?.shop || 0, color: 'bg-white/80' },
                                        { label: 'Live', val: channelData?.live || 0, color: 'bg-white/50' },
                                        { label: 'Video', val: channelData?.video || 0, color: 'bg-white/30' }
                                    ].map((c, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-16 text-xs font-bold text-blue-900">{c.label}</div>
                                            <div className="flex-1 h-3 bg-blue-900/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${c.color} rounded-full`}
                                                    style={{ width: `${(c.val / (totalChannelGmv || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="w-12 text-right text-xs font-bold text-slate-800">{Math.round((c.val / (totalChannelGmv || 1)) * 100)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Product List Table */}
                <div className="bg-white rounded-[24px] p-6 shadow-soft hover:shadow-medium transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Inventory Performance</h3>
                        <button onClick={() => setActiveView('inventory')} className="text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors">View All</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/50">
                                <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="text-left py-3 px-4 rounded-l-xl">Product</th>
                                    <th className="text-center py-3 px-2">Priority</th>
                                    <th className="text-right py-3 px-2">Revenue</th>
                                    <th className="text-right py-3 px-4 rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700">
                                {(() => {
                                    const filteredProducts = searchTerm
                                        ? processedProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())))
                                        : processedProducts;

                                    return filteredProducts.length > 0 ? (
                                        filteredProducts.slice(0, 5).map((product, idx) => (
                                            <tr key={idx} onClick={() => setSelectedProduct(product)} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 cursor-pointer transition-colors group">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400">IMG</div>
                                                        <div>
                                                            <div className="font-bold text-slate-800 group-hover:text-pink-500 transition-colors line-clamp-1">{product.name}</div>
                                                            <div className="text-xs text-slate-400">SKU: {product.sku || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 text-center">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${product.abcCategory === 'A' ? 'bg-purple-100 text-purple-700' : product.abcCategory === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                        Class {product.abcCategory}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-2 text-right font-bold text-slate-700">
                                                    {formatCurrency(product.gmv, currency)}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                                                No products found matching your search.
                                            </td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ═══ RIGHT PANEL (4 cols) ═══ */}
            <div className="col-span-12 lg:col-span-4 pl-0 lg:pl-2">
                <RightPanel notifications={notifications} setActiveView={setActiveView} t={t} />
            </div>

        </div>
    );
};

export default DashboardView;
