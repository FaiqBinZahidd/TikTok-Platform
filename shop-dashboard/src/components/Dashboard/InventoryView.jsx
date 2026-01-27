import React, { useState, useMemo } from 'react';
import { Package, HelpCircle, Download, Filter, ChevronDown, Search, AlertTriangle, CheckCircle2, RefreshCw, Eye, TrendingUp, DollarSign, BarChart3, Users, Lock, Archive, Zap } from 'lucide-react';
import HelpGuide from '../../components/HelpGuide';
import PlatformBadge from '../../components/PlatformBadge';
import { formatCurrency, getBadgeColor, getHealthColor } from '../../utils/formatUtils';
import CustomerDetailModal from './CustomerDetailModal';

const InventoryView = ({ processedProducts, handleExportCSV, statusFilter, setStatusFilter, searchTerm, setSearchTerm, handleSort, getSortIcon, setSelectedProduct, currency, platformFilter, t }) => {

    // View Mode State: 'Products', 'Revenue', 'Views', 'Customers'
    const [viewMode, setViewMode] = useState('Products');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Smart Filter State (for Products view)
    const [smartFilter, setSmartFilter] = useState('all');

    // --- Data Availability Checks ---
    const hasCustomerData = useMemo(() => {
        return processedProducts.some(p => p.customerName && p.customerName.trim() !== '');
    }, [processedProducts]);

    // --- Aggregation Logic for Customers ---
    const customerData = useMemo(() => {
        if (!hasCustomerData) return [];

        const customers = {};
        processedProducts.forEach(p => {
            if (!p.customerName) return;
            const name = p.customerName;

            if (!customers[name]) {
                customers[name] = {
                    id: name,
                    name: name,
                    email: p.customerEmail || 'N/A',
                    phone: p.customerPhone || 'N/A',
                    city: p.shipCity || 'Unknown',
                    state: p.shipState || '',
                    country: p.shipCountry || '',
                    zip: p.shipPostalCode || '',
                    shipline1: 'Shipping Address', // Placeholder as line 1 isn't extracted yet
                    totalSpend: 0,
                    totalOrders: 0,
                    lastOrderDate: p.importDate,
                    platforms: new Set(),
                    orders: []
                };
            }

            customers[name].totalSpend += p.gmv;
            customers[name].totalOrders += 1;
            if (p.platform) customers[name].platforms.add(p.platform);
            customers[name].orders.push(p);
        });

        // Convert to array and sort by Spend desc
        return Object.values(customers)
            .map(c => ({ ...c, platforms: Array.from(c.platforms) }))
            .sort((a, b) => b.totalSpend - a.totalSpend);

    }, [processedProducts, hasCustomerData]);

    // --- Filtering Logic for Products/Views/Revenue ---
    const filteredInventory = useMemo(() => {
        if (viewMode === 'Customers') return []; // Handled separately

        let data = processedProducts.map(p => {
            // Simulate Views data if missing, but only for the 'Views' sort logic
            // keeping it consistent with previous implementation
            const baseViews = Math.round(p.shopViews || p.gmv * 2 || 0);
            return { ...p, views: baseViews };
        });

        // Apply existing filters
        if (statusFilter !== 'All') data = data.filter(p => p.status === statusFilter);

        // Apply Smart Filters
        if (smartFilter === 'low_stock') {
            data = data.filter(p => (p.stock || 0) < 20);
        } else if (smartFilter === 'dead_stock') {
            data = data.filter(p => p.itemsSold === 0);
        } else if (smartFilter === 'high_velocity') {
            data = data.filter(p => p.itemsSold > 50);
        }

        // Apply View Mode Sorting
        if (viewMode === 'Revenue') {
            data.sort((a, b) => b.gmv - a.gmv);
        } else if (viewMode === 'Views') {
            data.sort((a, b) => b.views - a.views);
        } else if (viewMode === 'HighInterest') {
            // Lazada: High cart + wishlist
            data = data.filter(p => p.platform === 'Lazada' && ((p.addToCartUsers || 0) + (p.wishlistUsers || 0) > 10));
            data.sort((a, b) => ((b.addToCartUsers || 0) + (b.wishlistUsers || 0)) - ((a.addToCartUsers || 0) + (a.wishlistUsers || 0)));
        } else if (viewMode === 'LiveWinners') {
            // TikTok: High Live GMV
            data = data.filter(p => p.platform === 'TikTok' && (p.liveGmv || 0) > 0);
            data.sort((a, b) => (b.liveGmv || 0) - (a.liveGmv || 0));
        } else if (viewMode === 'LowStock') {
            // Items with stock < 20
            data = data.filter(p => (p.stock || 0) < 20);
            data.sort((a, b) => (a.stock || 0) - (b.stock || 0)); // Lowest first
        } else if (viewMode === 'DeadStock') {
            // Items with stock but no sales
            data = data.filter(p => (p.stock || 0) > 0 && (p.itemsSold || 0) === 0);
            data.sort((a, b) => (b.stock || 0) - (a.stock || 0)); // Highest stock first
        } else if (viewMode === 'HighVelocity') {
            // Best sellers (>100 items sold)
            data = data.filter(p => (p.itemsSold || 0) > 100);
            data.sort((a, b) => (b.itemsSold || 0) - (a.itemsSold || 0));
        }

        return data;
    }, [processedProducts, statusFilter, smartFilter, viewMode]);

    // Inventory Metrics (Global)
    const totalInventoryValue = processedProducts.reduce((sum, p) => sum + ((p.stock || 0) * (p.gmv / (p.itemsSold || 1) || 0)), 0);
    const lowStockCount = processedProducts.filter(p => (p.stock || 0) < 20).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">

            {/* Category Filter - Compact Grid Layout */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                    {[
                        { id: 'Products', icon: Package, label: 'All Items', color: 'slate' },
                        { id: 'Customers', icon: Users, label: 'Loyal Customers', color: 'violet' },
                        { id: 'Revenue', icon: DollarSign, label: 'High Revenue', color: 'emerald' },
                        { id: 'Views', icon: Eye, label: 'Top Views', color: 'blue' },
                        { id: 'LowStock', icon: AlertTriangle, label: 'Low Stock', color: 'amber', badge: lowStockCount },
                        { id: 'DeadStock', icon: Archive, label: 'Dead Stock', color: 'slate' },
                    ].map(cat => {
                        const Icon = cat.icon;
                        const isActive = viewMode === cat.id;

                        const colorClasses = {
                            slate: isActive ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                            emerald: isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
                            violet: isActive ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600 hover:bg-violet-100',
                            blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100',
                            amber: isActive ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100',
                        };

                        return (
                            <button
                                key={cat.id}
                                onClick={() => setViewMode(cat.id)}
                                className={`relative px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${colorClasses[cat.color]} ${isActive ? 'shadow-lg scale-105' : 'hover:scale-102'}`}
                                title={cat.tooltip}
                            >
                                <div className="flex items-center justify-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{cat.label}</span>
                                </div>
                                {cat.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                                        {cat.badge}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Context Cards - Dynamic Per View */}
            {viewMode === 'Customers' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4">
                    {/* 1. Total Customers */}
                    <div className="bg-gradient-to-br from-violet-50 to-white rounded-[24px] p-6 shadow-sm border border-violet-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-violet-100 flex items-center justify-center text-violet-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-violet-600/70 uppercase tracking-widest">Active Buyers</span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{customerData.length}</p>
                    </div>

                    {/* 2. Top Spender */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[24px] p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-emerald-600/70 uppercase tracking-widest">Top Spender</span>
                        </div>
                        <div>
                            <p className="text-xl font-black text-slate-800 truncate" title={customerData[0]?.name}>{customerData[0]?.name || '-'}</p>
                            <p className="text-sm font-bold text-emerald-600">{formatCurrency(customerData[0]?.totalSpend || 0, currency)}</p>
                        </div>
                    </div>

                    {/* 3. Avg Order Value (Proxy) */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-[24px] p-6 shadow-sm border border-blue-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center text-blue-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-blue-600/70 uppercase tracking-widest">Avg. Spend</span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">
                            {formatCurrency(
                                customerData.length ? customerData.reduce((acc, c) => acc + c.totalSpend, 0) / customerData.length : 0,
                                currency
                            )}
                        </p>
                    </div>

                    {/* 4. Top City */}
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-[24px] p-6 shadow-sm border border-amber-100 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center text-amber-600">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-amber-600/70 uppercase tracking-widest">Top Region</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800 tracking-tight truncate">
                            {(() => {
                                if (!customerData.length) return '-';
                                const cities = {};
                                customerData.forEach(c => cities[c.city] = (cities[c.city] || 0) + 1);
                                return Object.entries(cities).sort((a, b) => b[1] - a[1])[0][0];
                            })()}
                        </p>
                    </div>
                </div>
            ) : (
                /* INVENTORY CONTEXT CARDS */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-300">
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-[24px] p-6 shadow-sm border border-slate-100/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">{t('total_skus')}</span>
                        </div>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{processedProducts.length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[24px] p-6 shadow-sm border border-emerald-100/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-emerald-600/70 uppercase tracking-widest">{t('healthy_stock')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-emerald-800 tracking-tight">
                                {processedProducts.filter(p => !getHealthColor(p.stock).includes('rose') && !getHealthColor(p.stock).includes('amber')).length}
                            </p>
                            <span className="text-xs font-bold text-emerald-600">SKUs</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-[24px] p-6 shadow-sm border border-amber-100/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-amber-600/70 uppercase tracking-widest">{t('low_stock_alerts')}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-amber-800 tracking-tight">{lowStockCount}</p>
                            <span className="text-xs font-bold text-amber-600">Urgent</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-[24px] p-6 shadow-sm border border-blue-100/60 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <RefreshCw className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] font-extrabold text-blue-600/70 uppercase tracking-widest">{t('inventory_value')}</span>
                        </div>
                        <p className="text-2xl font-black text-blue-800 truncate tracking-tight" title={formatCurrency(totalInventoryValue, currency)}>
                            {formatCurrency(totalInventoryValue, currency)}
                        </p>
                    </div>
                </div>
            )}

            <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/50 bg-white/80 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
                            {viewMode === 'Products' ? t('smart_inventory_grid') :
                                viewMode === 'Revenue' ? 'Top Revenue Items' :
                                    viewMode === 'Views' ? 'Most Viewed Items' :
                                        viewMode === 'HighInterest' ? 'High Interest Products (Lazada)' :
                                            viewMode === 'LiveWinners' ? 'TikTok Live Champions' :
                                                viewMode === 'LowStock' ? 'Low Stock Alert' :
                                                    viewMode === 'DeadStock' ? 'Dead Stock Items' :
                                                        viewMode === 'HighVelocity' ? 'Best Sellers (High Velocity)' :
                                                            'Loyal Customers'}
                        </h3>
                        {viewMode === 'Products' && (
                            <HelpGuide
                                title={t('product_inventory_title')}
                                content={t('product_inventory_desc')}
                            >
                                <HelpCircle className="w-5 h-5 text-slate-400 hover:text-violet-600 transition-colors cursor-help" />
                            </HelpGuide>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* Only show Smart Filters in Product-centric views */}
                        {viewMode !== 'Customers' && (
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {[
                                    { id: 'all', label: t('filter_all') },
                                    { id: 'low_stock', label: t('filter_low_stock'), color: 'text-amber-700' },
                                    { id: 'dead_stock', label: t('filter_dead_stock'), color: 'text-rose-700' },
                                    { id: 'high_velocity', label: t('filter_high_velocity'), color: 'text-emerald-700' }
                                ].map(filter => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setSmartFilter(filter.id)}
                                        className={`px - 3 py - 1.5 text - xs font - bold rounded - md transition - all ${smartFilter === filter.id
                                            ? 'bg-white shadow-sm text-slate-900 border border-slate-200'
                                            : 'text-slate-500 hover:text-slate-700'
                                            } ${filter.color && smartFilter === filter.id ? filter.color : ''} `}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>



                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                <div className="overflow-auto -mx-6 px-6">
                    {/* CUSTOMER TABLE VIEW */}
                    {viewMode === 'Customers' ? (
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 shadow-sm">
                                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="text-left py-4 px-2">Customer Name</th>
                                    <th className="text-left py-4 px-2">City</th>
                                    <th className="text-center py-4 px-2">Total Orders</th>
                                    <th className="text-center py-4 px-2">Channels</th>
                                    <th className="text-right py-4 px-4">Total Spend</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-700 font-medium divide-y divide-slate-100/50">
                                {customerData.length > 0 ? customerData.map((customer, idx) => (
                                    <tr
                                        key={idx}
                                        onClick={() => setSelectedCustomer(customer)}
                                        className="hover:bg-violet-50/30 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 group-hover:text-violet-700 transition-colors">{customer.name}</div>
                                                    <div className="text-[10px] text-slate-400">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-slate-600">{customer.city}</td>
                                        <td className="py-4 px-2 text-center">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-bold">{customer.totalOrders}</span>
                                        </td>
                                        <td className="py-4 px-2 text-center">
                                            <div className="flex justify-center gap-1">
                                                {customer.platforms.map(p => <PlatformBadge key={p} platform={p} size="xs" variant="icon" />)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right font-mono font-bold text-emerald-600">
                                            {formatCurrency(customer.totalSpend, currency)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-60">
                                                <Users className="w-12 h-12 text-slate-300 mb-4" />
                                                <p className="text-lg font-bold text-slate-700">No Customers Found</p>
                                                <p className="text-sm text-slate-500 max-w-sm mt-2">
                                                    We couldn't find any customer data (names, emails) in your current list.
                                                    Try searching for a different term or ensure your uploaded file includes "Buyer Name" or "Recipient" columns.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        /* PRODUCT / REVENUE / VIEWS TABLE VIEW */
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 shadow-sm">
                                <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="text-left py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('name')}>
                                        <div className="flex items-center gap-1">{t('col_product')} {getSortIcon('name')}</div>
                                    </th>

                                    {/* DYNAMIC COLUMNS */}
                                    {(viewMode === 'Views' || viewMode === 'Products') && (
                                        <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600">
                                            <div className="flex items-center justify-center gap-1 text-violet-600"><Eye className="w-3 h-3" /> Views</div>
                                        </th>
                                    )}

                                    {viewMode === 'HighInterest' && (
                                        <>
                                            <th className="text-center py-4 px-2"><div className="flex items-center justify-center gap-1 text-orange-600">🛒 Cart</div></th>
                                            <th className="text-center py-4 px-2"><div className="flex items-center justify-center gap-1 text-pink-600">❤️ Wishlist</div></th>
                                        </>
                                    )}

                                    {viewMode === 'LiveWinners' && (
                                        <>
                                            <th className="text-center py-4 px-2"><div className="flex items-center justify-center gap-1 text-red-600">🔴 Live GMV</div></th>
                                            <th className="text-center py-4 px-2"><div className="flex items-center justify-center gap-1 text-violet-600">📹 Video GMV</div></th>
                                        </>
                                    )}

                                    <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('abcCategory')}>
                                        <div className="flex items-center justify-center gap-1">{t('col_class')} {getSortIcon('abcCategory')}</div>
                                    </th>

                                    {/* STOCK LEVEL - Hide in Revenue/Views/Sales */}
                                    {['Products', 'LowStock', 'DeadStock'].includes(viewMode) && (
                                        <th className="text-left py-4 px-4 w-40">{t('col_inventory_level')}</th>
                                    )}

                                    {/* SALES MONEY - Show in Products, Revenue */}
                                    {['Products', 'Revenue'].includes(viewMode) && (
                                        <th className="text-right py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('gmv')}>
                                            <div className="flex items-center justify-end gap-1">Total Sales {getSortIcon('gmv')}</div>
                                        </th>
                                    )}

                                    {/* DAYS LEFT - Hide in Revenue/Views */}
                                    {['Products', 'LowStock', 'DeadStock'].includes(viewMode) && (
                                        <th className="text-center py-4 px-2">
                                            <span className="border-b border-dashed border-slate-300 cursor-help" title="Based on 30-day sales velocity">{t('col_days_left')}</span>
                                        </th>
                                    )}

                                    {/* POTENTIAL REV - Show in Products, Revenue */}
                                    {['Products', 'Revenue'].includes(viewMode) && (
                                        <th className={`text-right py-4 px-2 cursor-pointer hover:text-violet-600 ${viewMode === 'Revenue' ? 'bg-emerald-50/50 text-emerald-700' : ''}`} onClick={() => handleSort('gmv')}>
                                            <div className="flex items-center justify-end gap-1">{t('col_potential_rev')} {getSortIcon('gmv')}</div>
                                        </th>
                                    )}

                                    {/* VELOCITY - Show in Products, HighVelocity, DeadStock */}
                                    {['Products', 'HighVelocity', 'DeadStock'].includes(viewMode) && (
                                        <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('orders')}>
                                            <div className="flex items-center justify-center gap-1">{t('col_velocity')} {getSortIcon('orders')}</div>
                                        </th>
                                    )}

                                    <th className="text-center py-4 px-2">{t('platform')}</th>
                                </tr>
                            </thead >
                            <tbody className="text-slate-700 font-medium divide-y divide-slate-100/50">
                                {filteredInventory.map((item, idx) => {
                                    const stock = item.stock || 0;
                                    const maxStock = 200;
                                    const fill = Math.min((stock / maxStock) * 100, 100);
                                    let stockColor = 'bg-emerald-500';
                                    if (stock < 20) stockColor = 'bg-rose-500';
                                    else if (stock < 50) stockColor = 'bg-amber-500';
                                    const dailyVelocity = Math.max(0.1, (item.itemsSold || 1) / 30);
                                    const daysLeft = Math.round((item.stock || 0) / dailyVelocity);
                                    const potentialRevenue = (item.gmv / (item.itemsSold || 1)) * stock;

                                    return (
                                        <tr key={idx} onClick={() => setSelectedProduct(item)} className="group cursor-pointer hover:scale-[1.005] hover:shadow-xl hover:z-20 hover:bg-white relative transition-all duration-300 border-b border-slate-50 last:border-0">
                                            <td className="py-4 px-3 first:rounded-l-xl last:rounded-r-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 border border-slate-200/50 group-hover:border-violet-300 transition-colors flex items-center justify-center text-[10px] text-slate-400 font-extrabold shadow-inner">IMG</div>
                                                    <div>
                                                        <div className="max-w-[180px] lg:max-w-[260px] truncate font-bold text-slate-800 group-hover:text-violet-700 transition-colors text-sm" title={item.name}>{item.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">{item.sku !== 'N/A' ? item.sku : item.id}</span>
                                                            {stock < 20 && <span className="text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Low</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {(viewMode === 'Views' || viewMode === 'Products') && (
                                                <td className="py-4 px-2 text-center">
                                                    <div className="font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg inline-block border border-slate-100">{item.views?.toLocaleString()}</div>
                                                </td>
                                            )}

                                            {viewMode === 'HighInterest' && (
                                                <>
                                                    <td className="py-4 px-2 text-center"><div className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg inline-block border border-orange-100">{(item.addToCartUsers || 0).toLocaleString()}</div></td>
                                                    <td className="py-4 px-2 text-center"><div className="font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg inline-block border border-pink-100">{(item.wishlistUsers || 0).toLocaleString()}</div></td>
                                                </>
                                            )}

                                            {viewMode === 'LiveWinners' && (
                                                <>
                                                    <td className="py-4 px-2 text-center"><div className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg inline-block border border-red-100">{formatCurrency(item.liveGmv || 0, currency)}</div></td>
                                                    <td className="py-4 px-2 text-center"><div className="font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg inline-block border border-violet-100">{formatCurrency(item.videoGmv || 0, currency)}</div></td>
                                                </>
                                            )}

                                            <td className="py-4 px-2 text-center">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider shadow-sm ${getBadgeColor(item.abcCategory)}`}>{item.abcCategory}</span>
                                            </td>

                                            {/* STOCK LEVEL COL */}
                                            {['Products', 'LowStock', 'DeadStock'].includes(viewMode) && (
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                                            <span className="text-slate-600">{stock} units</span>
                                                            <span className={stock < 20 ? "text-rose-500" : "text-emerald-600"}>{stock < 20 ? "Low" : "OK"}</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100/80 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full ${stockColor} rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${fill}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}

                                            {/* SALES MONEY COL */}
                                            {['Products', 'Revenue'].includes(viewMode) && (
                                                <td className="py-4 px-2 text-right">
                                                    <span className="font-bold text-slate-700 bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100/50 group-hover:bg-emerald-100/50 transition-colors">{formatCurrency(item.gmv, currency)}</span>
                                                </td>
                                            )}

                                            {/* DAYS LEFT COL */}
                                            {['Products', 'LowStock', 'DeadStock'].includes(viewMode) && (
                                                <td className="py-4 px-2 text-center">
                                                    {(() => {
                                                        if (stock === 0) return <span className="text-xs text-slate-300 font-mono">-</span>;
                                                        if (dailyVelocity < 0.2) return <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-100">Dead</span>;
                                                        let badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                                                        if (daysLeft < 7) badgeColor = 'bg-rose-100 text-rose-700 font-bold';
                                                        else if (daysLeft < 21) badgeColor = 'bg-amber-100 text-amber-700 font-bold';
                                                        return <span className={`px-2 py-1 rounded-md text-[10px] ${badgeColor}`}>{daysLeft} days</span>;
                                                    })()}
                                                </td>
                                            )}

                                            {/* POTENTIAL REV COL */}
                                            {['Products', 'Revenue'].includes(viewMode) && (
                                                <td className={`py-4 px-2 text-right font-mono text-slate-700 font-bold ${viewMode === 'Revenue' ? 'bg-emerald-50/30' : ''}`}>
                                                    <span className="opacity-80 group-hover:opacity-100 transition-opacity">{formatCurrency(potentialRevenue || 0, currency)}</span>
                                                </td>
                                            )}

                                            {/* VELOCITY COL */}
                                            {['Products', 'HighVelocity', 'DeadStock'].includes(viewMode) && (
                                                <td className="py-4 px-2 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-bold text-slate-800">{dailyVelocity.toFixed(1)}</span>
                                                        <span className="text-[9px] text-slate-400">u/day</span>
                                                    </div>
                                                </td>
                                            )}

                                            <td className="py-4 px-2 text-center flex justify-center">
                                                <div className="group-hover:scale-110 transition-transform duration-300"><PlatformBadge platform={item.platform} size="sm" variant="icon" /></div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table >
                    )}
                </div >
            </div >

            {/* Customer Detail Modal */}
            {
                selectedCustomer && (
                    <CustomerDetailModal
                        customer={selectedCustomer}
                        orders={selectedCustomer.orders}
                        onClose={() => setSelectedCustomer(null)}
                        currency={currency}
                    />
                )
            }
        </div >
    );
};

export default InventoryView;
