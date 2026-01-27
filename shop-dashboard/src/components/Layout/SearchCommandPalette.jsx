import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, TrendingUp, Calculator, Settings, FileText, Calendar, DollarSign, BarChart3, Users, Zap, ArrowRight, Command } from 'lucide-react';

const SearchCommandPalette = ({
    searchTerm,
    onSearchChange,
    processedProducts = [],
    setActiveView,
    setSelectedProduct,
    onClose
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const dropdownRef = useRef(null);

    // Feature/Tool Navigation Items
    const features = [
        { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3, view: 'dashboard', keywords: ['home', 'overview', 'main'] },
        { id: 'inventory', label: 'Inventory Management', icon: Package, view: 'inventory', keywords: ['stock', 'products', 'items'] },
        { id: 'analytics', label: 'Analytics & Insights', icon: TrendingUp, view: 'analytics', keywords: ['charts', 'data', 'performance'] },
        { id: 'calculator', label: 'Growth Command Lab', icon: Calculator, view: 'calculator', keywords: ['tools', 'simulator', 'calculator', 'margin', 'break-even'] },
        { id: 'finance', label: 'Financial Reports', icon: DollarSign, view: 'finance', keywords: ['money', 'revenue', 'profit'] },
        { id: 'calendar', label: 'Campaign Calendar', icon: Calendar, view: 'calendar', keywords: ['events', 'schedule', 'planning'] },
        { id: 'campaigns', label: 'Marketing Campaigns', icon: Zap, view: 'campaigns', keywords: ['ads', 'marketing', 'rfm'] },
        { id: 'marketing', label: 'Product Insights', icon: Users, view: 'marketing', keywords: ['segments', 'cohorts', 'customer'] },
        { id: 'settings', label: 'System Settings', icon: Settings, view: 'settings', keywords: ['config', 'preferences', 'profile'] },
        { id: 'reports', label: 'Export Reports', icon: FileText, view: 'reports', keywords: ['download', 'export', 'pdf'] },
    ];

    // Filter products based on search term
    const filteredProducts = searchTerm
        ? processedProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (p.id && String(p.id).toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 12)
        : [];

    // Filter features based on search term
    const filteredFeatures = searchTerm
        ? features.filter(f =>
            f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.keywords.some(k => k.includes(searchTerm.toLowerCase()))
        )
        : features;

    const totalResults = filteredProducts.length + filteredFeatures.length;

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!searchTerm) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % totalResults);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelect(selectedIndex);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm, selectedIndex, totalResults]);

    const handleSelect = (index) => {
        if (index < filteredProducts.length) {
            // Product selected
            const product = filteredProducts[index];
            setSelectedProduct(product);
            onClose();
        } else {
            // Feature selected
            const featureIndex = index - filteredProducts.length;
            const feature = filteredFeatures[featureIndex];
            setActiveView(feature.view);
            onClose();
        }
    };

    if (!searchTerm) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ maxHeight: '70vh' }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-100">

                {/* LEFT PANE: Data Results */}
                <div className="p-5 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Your Products
                        </h3>
                        {filteredProducts.length > 0 && (
                            <span className="ml-auto text-xs text-slate-400">{filteredProducts.length} found</span>
                        )}
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="space-y-1">
                            {filteredProducts.map((product, idx) => {
                                const isSelected = idx === selectedIndex;
                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => handleSelect(idx)}
                                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${isSelected
                                            ? 'bg-violet-50 border border-violet-200'
                                            : 'hover:bg-slate-50 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 flex-shrink-0">
                                                IMG
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-bold text-sm truncate ${isSelected ? 'text-violet-700' : 'text-slate-800'}`}>
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                                    <span>SKU: {product.sku || 'N/A'}</span>
                                                    <span>•</span>
                                                    <span className="font-mono">${product.gmv?.toLocaleString() || 0}</span>
                                                </div>
                                            </div>
                                            <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-violet-600 translate-x-1' : 'text-slate-300 group-hover:translate-x-1'
                                                }`} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400">No products found</p>
                            <p className="text-xs text-slate-300 mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* RIGHT PANE: System Features */}
                <div className="p-5 bg-slate-50/50 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <div className="flex items-center gap-2 mb-3 px-2">
                        <Command className="w-4 h-4 text-slate-400" />
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Quick Actions
                        </h3>
                    </div>

                    <div className="space-y-1">
                        {filteredFeatures.map((feature, idx) => {
                            const absoluteIndex = filteredProducts.length + idx;
                            const isSelected = absoluteIndex === selectedIndex;
                            const Icon = feature.icon;

                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => handleSelect(absoluteIndex)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group ${isSelected
                                        ? 'bg-white border border-slate-200 shadow-sm'
                                        : 'hover:bg-white/60 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {feature.label}
                                            </div>
                                        </div>
                                        <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'text-violet-600 translate-x-1' : 'text-slate-300 group-hover:translate-x-1'
                                            }`} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer Hint */}
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">↑↓</kbd>
                        Navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">Enter</kbd>
                        Select
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">Esc</kbd>
                        Close
                    </span>
                </div>
                <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
            </div>
        </div>
    );
};

export default SearchCommandPalette;
