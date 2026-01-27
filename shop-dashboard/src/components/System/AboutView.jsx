import React from 'react';
import { Activity, Zap, BarChart3, BookOpen, TrendingDown, TrendingUp } from 'lucide-react';

const AboutView = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl mb-4">
                    <span className="text-3xl font-bold">Q</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Master Your E-commerce Data</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Quantro is the centralized intelligence hub designed for modern multi-platform sellers. We turn fragmented data from TikTok, Shopee, and Lazada into actionable profit strategies.
                </p>
            </div>

            {/* Core Features Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Activity className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 mb-2">Real-Time Profit</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Stop guessing your net margin. Quantro auto-calculates profit by deducting estimated COGS, ad spend, and platform fees instantly.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-4"><Zap className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 mb-2">Growth Opportunity Detection</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Our algorithms automatically flag "Hidden Gems" (high conversion, low traffic) and "Funnel Leaks" so you know exactly where to focus.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4"><BarChart3 className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 mb-2">Lifetime Analytics</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Break free from the 90-day historical limit of most platforms. Import and store your data to see long-term trends and seasonality.</p>
                </div>
            </div>

            {/* Glossary Section */}
            <div className="border-t border-slate-200 pt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-slate-400" /> Intelligence Glossary
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-violet-200 transition-colors">
                        <h4 className="font-bold text-slate-800 mb-1">ABC Analysis (Pareto Principle)</h4>
                        <p className="text-sm text-slate-600 mb-3">Categorizes inventory based on revenue contribution.</p>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded text-xs font-bold">Class A: Top 80% Revenue</span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">Class B: Next 15%</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold">Class C: Bottom 5%</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-rose-200 transition-colors">
                        <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-500" /> Funnel Leak</h4>
                        <p className="text-sm text-slate-600">
                            Products with <strong>High Traffic</strong> (&gt;500 views) but <strong>Low Conversion</strong> (&lt;0.5%).
                            <br /><span className="text-xs text-rose-600 mt-1 block">Action: Check price competitiveness, image quality, or reviews.</span>
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-200 transition-colors">
                        <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-500" /> Hidden Gem</h4>
                        <p className="text-sm text-slate-600">
                            Products with <strong>Low Traffic</strong> but <strong>High Conversion</strong> (&gt;3.0%).
                            <br /><span className="text-xs text-emerald-600 mt-1 block">Action: Scale ads or feature in livestreams immediately.</span>
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h4 className="font-bold text-slate-800 mb-1">Metrics Key</h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                            <li><strong className="text-slate-800">GMV:</strong> Gross Merchandise Value (Total Sales Revenue).</li>
                            <li><strong className="text-slate-800">CTR:</strong> Click-Through Rate (Interest metric).</li>
                            <li><strong className="text-slate-800">CVR:</strong> Conversion Rate (Sales efficiency metric).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-400">© 2024 Quantro Analytics. Enterprise Grade Security.</p>
            </div>
        </div>
    </div>
);

export default AboutView;
