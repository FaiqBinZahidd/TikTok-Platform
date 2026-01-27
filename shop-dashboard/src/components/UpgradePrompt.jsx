import React from 'react';
import { Lock, Zap, TrendingUp, ArrowRight } from 'lucide-react';

/**
 * UpgradePrompt Component
 * 
 * Contextual, non-pushy upsell prompt following the 4-part structure:
 * 1. What we see
 * 2. Why it matters to money
 * 3. What Pro would unlock
 * 4. Reassurance (no pressure)
 */
const UpgradePrompt = ({
    feature,
    context = {},
    variant = 'inline', // 'inline' | 'card' | 'modal'
    onUpgrade
}) => {
    const message = getUpsellMessage(feature, context);

    if (variant === 'inline') {
        return (
            <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 rounded-xl p-4 my-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Lock className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800 mb-1">{message.what}</p>
                        <p className="text-xs text-slate-600 mb-2">{message.why}</p>
                        <div className="bg-white/60 rounded-lg p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Zap className="w-3 h-3 text-violet-600" />
                                <span className="text-xs font-bold text-violet-700">Pro Unlocks:</span>
                            </div>
                            <p className="text-xs text-slate-700">{message.unlock}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">{message.reassurance}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'card') {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm">Upgrade Opportunity</h3>
                        <p className="text-xs text-slate-500">Unlock more revenue insights</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">What We See</p>
                        <p className="text-sm text-slate-700">{message.what}</p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Why It Matters</p>
                        <p className="text-sm text-slate-700">{message.why}</p>
                    </div>

                    <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-violet-600" />
                            <p className="text-xs font-bold text-violet-700">Pro Unlocks</p>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">{message.unlock}</p>
                        <button
                            onClick={onUpgrade}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all"
                        >
                            Explore Pro
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-xs text-slate-400 text-center italic">{message.reassurance}</p>
                </div>
            </div>
        );
    }

    // Modal variant (for blocking actions)
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-4 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-2xl">
                        <Lock className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="font-black text-xl text-slate-800">Pro Feature</h2>
                        <p className="text-sm text-slate-500">Upgrade to unlock</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Situation</p>
                        <p className="text-sm text-slate-700">{message.what}</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Impact on Your Business</p>
                        <p className="text-sm text-slate-700">{message.why}</p>
                    </div>

                    <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-violet-600" />
                            <p className="text-sm font-bold text-violet-700">With Pro, You Get:</p>
                        </div>
                        <p className="text-sm text-slate-700">{message.unlock}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={onUpgrade}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg shadow-violet-200"
                    >
                        Upgrade Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-xs text-slate-400 text-center mt-4 italic">{message.reassurance}</p>
            </div>
        </div>
    );
};

// Helper function (imported from systemRole.js in real usage)
const getUpsellMessage = (feature, context) => {
    const messages = {
        storeLimit: {
            what: "You've reached your store limit",
            why: "More stores mean more insights across your entire business",
            unlock: "Pro allows up to 5 stores and advanced cross-store analytics",
            reassurance: "Your current stores are safe — upgrade whenever you're ready to scale"
        },
        detailedFixes: {
            what: "We can see what's happening with your data",
            why: "The right fix could save you significant time and money",
            unlock: "Pro gives you step-by-step guidance and revenue estimates",
            reassurance: "Upgrade when you're ready — we're here to help, not push"
        }
    };

    return messages[feature] || messages.detailedFixes;
};

export default UpgradePrompt;
