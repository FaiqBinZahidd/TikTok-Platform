import React, { useState } from 'react';
import { Book, X, Layers, Activity, Zap, FileText, HelpCircle, ArrowRight, Database, TrendingUp } from 'lucide-react';

const SystemManual = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('start');

    const sections = [
        { id: 'start', label: 'Getting Started', icon: Layers },
        { id: 'metrics', label: 'Metrics Guide', icon: Activity },
        { id: 'import', label: 'Importing Data', icon: Database },
        { id: 'intelligence', label: 'Intelligence', icon: Zap },
        { id: 'lab', label: 'Growth Lab', icon: TrendingUp },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'start':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Welcome to Quantro V2.5</h3>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                The ultimate e-commerce command center. Quantro doesn't just show you numbers; it tells you what to do with them.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-violet-50 rounded-2xl border border-violet-100">
                                <h4 className="font-bold text-violet-900 mb-2 flex items-center gap-2">
                                    <Zap className="w-5 h-5" /> Smart Feed
                                </h4>
                                <p className="text-sm text-violet-700">
                                    Your new home screen. See critical stockouts, hidden gems, and daily opportunities in one feed.
                                </p>
                            </div>
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" /> Decision Lab
                                </h4>
                                <p className="text-sm text-emerald-700">
                                    Use the Burn Rate and Ad Stress calculators to model future outcomes before they happen.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'metrics':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-2xl font-black text-slate-800">Understanding Metrics</h3>
                        <div className="space-y-4">
                            {[
                                { title: 'Net Profit', desc: 'Real profit after COGS, Ad Spend, Shipping, and Platform Fees.' },
                                { title: 'ROAS (Return on Ad Spend)', desc: 'Revenue generated per $1 of ads. > 2.0 is usually safe.' },
                                { title: 'CVR (Conversion Rate)', desc: '% of visitors who buy. Target > 2% for TikTok.' },
                                { title: 'Information Ratio', desc: 'Ratio of non-financial signals (View/Likes) to Sales.' }
                            ].map((m, i) => (
                                <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                                    <h4 className="font-bold text-slate-800">{m.title}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{m.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'import':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-2xl font-black text-slate-800">Importing Data</h3>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <ol className="list-decimal ml-4 space-y-4 text-slate-700 font-medium">
                                <li>
                                    <strong>Prepare your file:</strong> Export "Order Details" or "Product Overview" from TikTok Shop / Shopee / Lazada as Excel/CSV.
                                </li>
                                <li>
                                    <strong>Upload to Quantro:</strong> Go to "Data Sources" and drag your file in.
                                </li>
                                <li>
                                    <strong>Select Currency:</strong> <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded font-bold uppercase ml-2">New Feature</span>
                                    <p className="text-sm text-slate-500 mt-1 font-normal">You must specify if the file is USD, THB, SGD, etc. This allows us to track multi-country empires accurately.</p>
                                </li>
                                <li>
                                    <strong>Confirm Platform:</strong> Our AI tries to guess the platform, but you can confirm it manually.
                                </li>
                            </ol>
                        </div>
                    </div>
                );
            case 'lab':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-2xl font-black text-slate-800">Growth Command Lab</h3>
                        <p className="text-slate-500">Advanced simulators to prevent losses.</p>

                        <div className="grid gap-4">
                            <div className="p-4 border rounded-xl hover:border-violet-200 transition-colors cursor-default">
                                <h4 className="font-bold text-slate-800 flex items-center justify-between">
                                    Inventory Burn Rate 🔥
                                    <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase">Critical</span>
                                </h4>
                                <p className="text-sm text-slate-500 mt-2">
                                    Tells you exactly <strong>which day</strong> you will stock out based on current sales velocity.
                                </p>
                            </div>
                            <div className="p-4 border rounded-xl hover:border-violet-200 transition-colors cursor-default">
                                <h4 className="font-bold text-slate-800">Ad Stress Test 📉</h4>
                                <p className="text-sm text-slate-500 mt-2">
                                    Simulates a "Crash Scenario". What if your CPA doubles? Will you survive?
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'intelligence':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h3 className="text-2xl font-black text-slate-800">Quantro Intelligence (AI)</h3>
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 rounded-2xl text-white">
                            <h4 className="font-bold text-lg mb-2">Smart Chatbot</h4>
                            <p className="opacity-90 text-sm leading-relaxed mb-4">
                                Click the purple icon in the bottom right anytime. You can ask:
                            </p>
                            <ul className="list-disc ml-4 space-y-1 text-sm opacity-80 font-medium">
                                <li>"Check my stock"</li>
                                <li>"How to increase ROAS?"</li>
                                <li>"Open the Stress Test"</li>
                            </ul>
                        </div>
                        <p className="text-slate-500 text-sm">
                            The bot now supports <strong>Action Anchors</strong>, meaning it can navigate you directly to the tools you need.
                        </p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl h-[600px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95">

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-8 text-slate-800">
                        <Book className="w-6 h-6 text-violet-600" />
                        <span className="font-black text-lg tracking-tight">System Manual</span>
                    </div>

                    <div className="space-y-1">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveTab(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === s.id
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                                        : 'text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                                    }`}
                            >
                                <s.icon className={`w-4 h-4 ${activeTab === s.id ? 'text-white' : 'text-slate-400'}`} />
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">Quantro V2.5.0</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8 md:p-12 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                        {renderContent()}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SystemManual;
