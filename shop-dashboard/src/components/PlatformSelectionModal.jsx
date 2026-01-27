import React from 'react';
import { X, Music, ShoppingCart, Box, Package, ShoppingBag } from 'lucide-react';

const platforms = [
    { id: 'TikTok', name: 'TikTok Shop', icon: Music, color: 'bg-black text-white', desc: 'Orders & Product Exports' },
    { id: 'Shopee', name: 'Shopee', icon: ShoppingBag, color: 'bg-orange-500 text-white', desc: 'Order & Income Reports' },
    { id: 'Lazada', name: 'Lazada', icon: ShoppingCart, color: 'bg-blue-600 text-white', desc: 'Order Overview Exports' },
    { id: 'Daraz', name: 'Daraz', icon: Package, color: 'bg-orange-600 text-white', desc: 'Seller Center Exports' },
    { id: 'Amazon', name: 'Amazon', icon: Box, color: 'bg-slate-800 text-white', desc: 'Order Fulfilment Reports' }
];

const PlatformSelectionModal = ({ onClose, onSelect }) => {
    const [currency, setCurrency] = React.useState('THB'); // Default to THB as requested by user context implies specific region, usually better to default to store setting but local state is fine.

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Import Settings</h3>
                        <p className="text-sm text-slate-500">Select source & currency for this file</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    {/* Currency Selector */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">File Currency</label>
                        <div className="flex flex-wrap gap-2">
                            {['THB', 'USD', 'IDR', 'MYR', 'SGD', 'PHP', 'VND'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCurrency(c)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${currency === c
                                        ? 'bg-violet-600 border-violet-600 text-white shadow-md transform scale-105'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform Grid */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Platform</label>
                        <div className="grid gap-3 max-h-[40vh] overflow-y-auto">
                            {platforms.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => onSelect(p.id, currency)}
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-violet-500 hover:shadow-md hover:bg-violet-50/30 transition-all group text-left"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${p.color}`}>
                                        <p.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{p.name}</h4>
                                        <p className="text-xs text-slate-500">{p.desc}</p>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-violet-500 group-hover:bg-violet-500 transition-colors"></div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Selected: <strong className="text-violet-600">{currency}</strong>. This will be tagged to the uploaded data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlatformSelectionModal;
