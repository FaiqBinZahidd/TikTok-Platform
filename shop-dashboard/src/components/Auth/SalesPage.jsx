import React from 'react';
import { ArrowLeft, CheckCircle2, Zap, BarChart3, Globe, ShieldCheck } from 'lucide-react';

const SalesPage = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-[#FAF8F3] font-sans text-slate-800 overflow-y-auto">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">Q</div>
                    <span className="font-bold text-2xl tracking-tight">QUANTRO</span>
                </div>
                <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-violet-600 font-bold transition-colors">
                    <ArrowLeft size={18} /> Back to Login
                </button>
            </nav>

            {/* Hero Section */}
            <header className="px-8 py-20 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full text-violet-700 font-bold text-sm mb-6">
                    <Zap size={16} /> #1 Retail Intelligence Platform
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Multi-Channel</span> Empire.
                </h1>
                <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop juggling spreadsheets. Sync TikTok, Shopee, and Lazada into one powerful dashboard.
                    AI-driven analytics to scale your revenue 3x faster.
                </p>
                <button onClick={() => window.location.href = 'mailto:klickode@gmail.com?subject=Demo Request - Quantro'} className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-600 transition-all shadow-xl hover:shadow-violet-200 hover:-translate-y-1">
                    Request Demo Access
                </button>
            </header>

            {/* Features Grid */}
            <section className="px-8 py-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Scale</h2>
                        <p className="text-slate-400">Built for high-volume sellers and aggressive brands.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Globe, title: "Unified Sync", text: "One dashboard for TikTok Shop, Shopee, and Lazada. Real-time inventory and order tracking across all channels." },
                            { icon: BarChart3, title: "Strategic Analytics", text: "Predict trends, spot dead stock, and identify 'Hidden Gem' products before your competitors do." },
                            { icon: ShieldCheck, title: "Enterprise Security", text: "Bank-grade data encryption, role-based access control, and automated daily backups." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-3xl hover:bg-violet-50 transition-colors group">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-violet-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="px-8 py-20 bg-[#FAF8F3]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400">Choose the plan that fits your scale.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter */}
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 font-bold mb-2">Starter</div>
                            <div className="text-4xl font-black mb-6">$49<span className="text-base text-slate-300 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> Connect 2 Stores</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> Basic Analytics</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> 1 User Account</li>
                            </ul>
                            <button
                                onClick={() => window.location.href = 'mailto:klickode@gmail.com?subject=Starter Plan Inquiry - Quantro&body=Hi Klickode Team,%0A%0AI am interested in the Starter Plan ($49/mo).%0A%0APlease send me more details.%0A%0AThank you!'}
                                className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-violet-600 hover:text-violet-600 transition-colors"
                            >
                                Select Plan
                            </button>
                        </div>

                        {/* Pro */}
                        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl transform md:-translate-y-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-violet-600 to-fuchsia-600 px-4 py-1 rounded-bl-xl text-xs font-bold">MOST POPULAR</div>
                            <div className="text-violet-300 font-bold mb-2">Growth</div>
                            <div className="text-4xl font-black mb-6">$149<span className="text-base text-slate-500 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-slate-300">
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-400" /> Connect Unlimited Stores</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-400" /> Performance Signals</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-400" /> 5 Team Members</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-400" /> Priority Support</li>
                            </ul>
                            <button
                                onClick={() => window.location.href = 'mailto:klickode@gmail.com?subject=Growth Plan Inquiry - Quantro&body=Hi Klickode Team,%0A%0AI want to start a Free Trial for the Growth Plan ($149/mo).%0A%0ACan you activate my trial access?%0A%0AThank you!'}
                                className="w-full py-3 rounded-xl bg-violet-600 font-bold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/50"
                            >
                                Start Free Trial
                            </button>
                        </div>

                        {/* Enterprise */}
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="text-slate-500 font-bold mb-2">Enterprise</div>
                            <div className="text-4xl font-black mb-6">Custom</div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> Custom API Integration</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> Dedicated Account Manager</li>
                                <li className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 size={16} className="text-green-500" /> SLA Guarantee</li>
                            </ul>
                            <button
                                onClick={() => window.location.href = 'mailto:klickode@gmail.com?subject=Enterprise Plan Inquiry - Quantro&body=Hi Klickode Team,%0A%0AI need a custom Enterprise solution.%0A%0APlease schedule a call to discuss requirements.%0A%0AThank you!'}
                                className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold hover:border-violet-600 hover:text-violet-600 transition-colors"
                            >
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-12 text-center text-slate-400 text-sm">
                © 2025 Quantro by Klickode. All rights reserved. | <a href="mailto:klickode@gmail.com" className="hover:text-violet-600 transition-colors">Contact Us</a>
            </footer>
        </div>
    );
};

export default SalesPage;
