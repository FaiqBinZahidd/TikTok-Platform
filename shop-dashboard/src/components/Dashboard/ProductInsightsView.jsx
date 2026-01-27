import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ChevronDown, ArrowUpRight,
    Eye, MousePointer2, TrendingUp, AlertCircle,
    CheckCircle2, DollarSign, Megaphone
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';
import PlatformBadge from '../PlatformBadge';

const ProductInsightsView = ({
    products,
    currency,
    searchTerm,
    setSearchTerm,
    platformFilter,
    setPlatformFilter,
    availablePlatforms,
    t
}) => {
    const [sortConfig, setSortConfig] = useState({ key: 'views', direction: 'desc' });

    // --- Data Processing & Metrics Simulation ---
    const insightsData = useMemo(() => {
        let data = products.map(p => {
            // Simulate marketing data if missing (for demo depth)
            // In a real app, this would come from the "Ad Spend" column or API
            // Force integer views
            const baseViews = Math.round(p.shopViews || p.gmv * 2 || 0);
            const visitors = Math.floor(baseViews * 0.8);
            const ctr = parseFloat(p.ctr) || 2.5;
            const cvr = parseFloat(p.cvr) || 1.8;

            // "Marketing Insight" Logic
            let insight = { label: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50' };
            if (cvr < 1.0 && baseViews > 500) {
                insight = { label: 'Low CVR - Optimize Listing', color: 'text-amber-600', bg: 'bg-amber-50' };
            } else if (cvr > 3.0 && baseViews < 200) {
                insight = { label: 'High Potential - Run Ads', color: 'text-blue-600', bg: 'bg-blue-50' };
            } else if (baseViews < 50) {
                insight = { label: 'No Traffic', color: 'text-slate-400', bg: 'bg-slate-50' };
            }

            return {
                ...p,
                visitors,
                views: baseViews,
                ctr,
                cvr,
                marketingCost: (baseViews * 0.05).toFixed(2), // Fake CPC calculation
                roas: p.gmv > 0 ? (p.gmv / ((baseViews * 0.05) || 1)).toFixed(1) + 'x' : '-',
                insight
            };
        });

        // Filtering
        if (platformFilter !== 'All') data = data.filter(p => p.platform === platformFilter);
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            data = data.filter(p => p.name.toLowerCase().includes(lower) || p.id.toLowerCase().includes(lower));
        }

        // Sorting
        data.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (sortConfig.direction === 'asc') return valA > valB ? 1 : -1;
            return valA < valB ? 1 : -1;
        });

        return data;
    }, [products, platformFilter, searchTerm, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ column }) => (
        <span className={`ml-1 inline-block transition-transform ${sortConfig.key === column ? (sortConfig.direction === 'asc' ? 'rotate-180' : '') : 'opacity-20'}`}>
            <ChevronDown className="w-3 h-3" />
        </span>
    );

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-pink-600" />
                        {t('marketing_title')}
                    </h2>
                    <p className="text-slate-500 font-medium">{t('marketing_subtitle')}</p>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">

                </div>

                {/* Platform Filter Pill */}
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    {['All', ...availablePlatforms].slice(0, 5).map(p => (
                        <button
                            key={p}
                            onClick={() => setPlatformFilter(p)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${platformFilter === p
                                ? 'bg-white text-pink-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {p === 'All' ? t('filter_all') : p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Table - REDESIGNED FOR STRATEGIC INSIGHTS */}
            <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>{t('col_product')} / SKU <SortIcon column="name" /></th>
                                <th className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('views')}>
                                    <div className="flex flex-col">
                                        <span>{t('traffic')}</span>
                                        <span className="text-[9px] lowercase opacity-70">top of funnel</span>
                                    </div> <SortIcon column="views" />
                                </th>
                                <th className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('cvr')}>
                                    <div className="flex flex-col">
                                        <span>{t('conversion')}</span>
                                        <span className="text-[9px] lowercase opacity-70">bottom of funnel</span>
                                    </div> <SortIcon column="cvr" />
                                </th>
                                <th className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('gmv')}>{t('col_revenue')} <SortIcon column="gmv" /></th>
                                <th className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors">{t('est_ad_cost')}</th>
                                <th className="py-4 px-6 text-left">{t('strategic_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {insightsData.length > 0 ? (
                                insightsData.map((product, idx) => (
                                    <tr key={idx} className="group hover:bg-pink-50/10 transition-colors">
                                        <td className="py-4 px-6 max-w-[300px]">
                                            <div className="flex items-start gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:scale-105 transition-transform overflow-hidden">
                                                    {['A', 'B', 'C'][idx % 3]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-pink-600 transition-colors">{product.name}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <PlatformBadge platform={product.platform} size="xs" />
                                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">{product.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="font-extrabold text-slate-700">{product.views.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                    <Eye className="w-3 h-3" /> Views
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${product.cvr > 3.0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                    product.cvr < 1.0 ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                                        'bg-slave-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                    {product.cvr}%
                                                </span>
                                                <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${product.cvr > 3 ? 'bg-emerald-500' : product.cvr < 1 ? 'bg-rose-500' : 'bg-slate-400'}`}
                                                        style={{ width: `${Math.min(product.cvr * 10, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-4 text-right">
                                            <div className="font-bold text-slate-800">{formatCurrency(product.gmv, currency)}</div>
                                            <div className="text-[10px] text-emerald-600 font-medium">ROAS: {product.roas}</div>
                                        </td>

                                        <td className="py-4 px-4 text-right text-slate-500 font-mono text-xs">
                                            {formatCurrency(product.marketingCost, currency)}
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${product.insight.color} ${product.insight.bg} border-transparent`}>
                                                {product.insight.label === 'Healthy' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                                                {product.insight.label}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-50">
                                            <Search className="w-12 h-12 text-slate-300 mb-4" />
                                            <p className="text-xl font-bold text-slate-700">{t('no_products_found')}</p>
                                            <p className="text-sm text-slate-500">{t('try_adjusting')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductInsightsView;
