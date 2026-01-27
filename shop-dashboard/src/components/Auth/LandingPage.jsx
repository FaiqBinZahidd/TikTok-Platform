import React, { useState } from 'react';
import SalesPage from './SalesPage';
import { supabase } from '../../lib/supabaseClient';
import { Mail, TrendingUp, Database, ShoppingBag, Globe, CheckCircle2, Key, ArrowRight, RefreshCw } from 'lucide-react';

const LandingPage = ({ onLogin }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showSales, setShowSales] = useState(false);

    if (showSales) return <SalesPage onBack={() => setShowSales(false)} />;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        // Fallback for Mock Demo if Supabase is missing
        if (!supabase) {
            setTimeout(() => {
                if (password === 'admin123') {
                    onLogin(email.split('@')[0] || 'Manager');
                } else {
                    setMessage({ type: 'error', text: 'Invalid Demo Key (admin123)' });
                    setIsLoading(false);
                }
            }, 800);
            return;
        }

        try {
            // Login Only Mode (Invite/Admin Created Users)
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;

        } catch (err) {
            setMessage({ type: 'error', text: 'Login Failed: ' + err.message });
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 bg-[#FAF8F3] flex items-center justify-center p-4 font-sans selection:bg-violet-500 selection:text-white overflow-hidden">

            {/* Animated Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-200/40 rounded-full blur-[120px] animate-in fade-in zoom-in duration-1000"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full blur-[120px] animate-in fade-in zoom-in duration-1000 delay-300"></div>
            <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-amber-100/40 rounded-full blur-[100px] animate-in fade-in zoom-in duration-1000 delay-500"></div>

            {/* Main Card */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/50 w-full max-w-[1200px] h-auto min-h-[600px] flex flex-col md:flex-row relative z-10 overflow-hidden">

                {/* Left: Brand & Visuals */}
                <div className="md:w-1/2 p-12 flex flex-col justify-between relative overflow-hidden bg-white/40">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/20">Q</div>
                            <span className="font-bold text-xl tracking-tight text-slate-800">QUANTRO</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
                            Smart Retail <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Intelligence.</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                            Connect your TikTok, Shopee, and Lazada stores in one premium dashboard.
                            AI-driven insights for modern commerce.
                        </p>
                    </div>

                    {/* Floating Cards Visual */}
                    <div className="relative h-80 mt-8 hidden md:block">
                        {/* Card 1: Revenue (Top Left) */}
                        <div className="absolute top-0 left-0 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-48 transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20} /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold">Revenue</div>
                                    <div className="text-sm font-bold text-slate-800">$12,450</div>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-green-500 rounded-full"></div>
                            </div>
                        </div>

                        {/* Card 2: Orders (Top Right) */}
                        <div className="absolute top-8 left-48 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-48 transform rotate-6 hover:rotate-3 transition-transform duration-500 z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><Database size={20} /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold">Orders</div>
                                    <div className="text-sm font-bold text-slate-800">1,204</div>
                                </div>
                            </div>
                            <div className="flex gap-1 mt-2">
                                <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white"></div>
                                <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white -ml-2"></div>
                                <div className="h-6 w-6 rounded-full bg-slate-300 border-2 border-white -ml-2 flex items-center justify-center text-[10px] font-bold text-white">+5</div>
                            </div>
                        </div>

                        {/* Card 3: Active Shoppers (Bottom Left) */}
                        <div className="absolute top-36 left-4 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-48 transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><ShoppingBag size={20} /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold">Active Shoppers</div>
                                    <div className="text-sm font-bold text-slate-800">892</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-pink-500"></span>
                                <span className="text-[10px] font-medium text-slate-400">Live now</span>
                            </div>
                        </div>

                        {/* Card 4: Store Integrations (Bottom Right) */}
                        <div className="absolute top-44 left-52 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-auto min-w-[160px] transform rotate-12 hover:rotate-6 transition-transform duration-500 z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Globe size={20} /></div>
                                <div>
                                    <div className="text-xs text-slate-400 font-bold">Integrations</div>
                                    <div className="text-sm font-bold text-slate-800">Multi-Store</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-[-8px]">
                                {/* TikTok - Black Circle with White SVG */}
                                <div className="w-8 h-8 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-sm z-30 overflow-hidden" title="TikTok">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-.05 13.6 6.9 6.9 0 0 0 5.5-2.8l.01-.02V9.12a7.35 7.35 0 0 0 3.77 1.87v-3.7a3.48 3.48 0 0 1-.03-.6z" />
                                    </svg>
                                </div>
                                {/* Shopee - Orange Circle with White SVG */}
                                <div className="w-8 h-8 rounded-full bg-[#EE4D2D] border-2 border-white flex items-center justify-center shadow-sm -ml-2 z-20 overflow-hidden p-1.5" title="Shopee">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                                        <path d="M17.6 10.3c-.6-3.8-2.6-6.4-5.2-6.4-2.8 0-4.7 2.6-4.9 6.2 0 .1 0 .2-.1.3-.8.2-1.7.5-2.6.9-.3-3.6 2.3-7.5 7.6-7.5 5.2 0 7.8 3.7 7.7 7.6-.4.2-1.6.6-2.5 1.2v-.3zm2.5 4.3c-.1 2.5-3.3 2.1-3.2 1 .1-1.3 3.3-1.4 3.2-1zm-9.3-1.6l.3.6c.1.3.1.6 0 .9-.8 1.4-1.1 2.4-1.1 2.4-.2.8.3 1.2 1 .5.3-.2.8-.7 1.3-1.3.5-.5 1-1.1 1.7-1.1.9 0 1.2.9.9 2.2-.4 1.7-1.7 3.8-3.3 3.8-1.7 0-2.3-1.7-1.9-2.7 0 0 .1-.5 1-1.8-1.5-.7-2.3-1.4-2.5-1.9-.3-.8.3-1.9 1.1-2.1.8-.2 1.5.3 1.5.5z" />
                                    </svg>
                                </div>
                                {/* Lazada - Navy Circle with White Text/SVG (Simplified Heart) */}
                                <div className="w-8 h-8 rounded-full bg-[#0f146d] border-2 border-white flex items-center justify-center shadow-sm -ml-2 z-10 overflow-hidden p-1.5" title="Lazada">
                                    <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6 text-xs font-bold text-slate-400 mt-auto uppercase tracking-wider">
                        <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-violet-500" /> Real-time</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-violet-500" /> Secure</span>
                        <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-violet-500" /> Smart Powered</span>
                    </div>
                </div>

                {/* Right: Login Form */}
                <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center shadow-[-20px_0_40px_rgba(0,0,0,0.02)] relative">
                    <div className="max-w-sm mx-auto w-full relative z-10">
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                            <p className="text-slate-400">Please enter your details to sign in.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-50 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                                </div>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-violet-500 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-100 focus:ring-4 focus:ring-violet-50 rounded-xl outline-none transition-all font-medium text-slate-800 placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            {message && (
                                <div className={`text-xs font-bold p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-200 hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden relative"
                            >
                                <div className={`absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700`}></div>
                                {isLoading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-xs text-slate-400">
                                    Don't have an account? <button type="button" onClick={() => setShowSales(true)} className="text-violet-600 font-bold hover:underline">View Plans & Pricing</button>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Decorative Pattern */}
                    <div className="absolute bottom-0 right-0 p-8 opacity-5 pointer-events-none">
                        <ShoppingBag size={120} />
                    </div>
                </div>
            </div >
        </div >
    );
};

export default LandingPage;
