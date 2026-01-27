
import React from 'react';
import { LayoutDashboard, Package, TrendingUp, Settings, Menu } from 'lucide-react';

const MobileNavBar = ({ activeView, setActiveView, onMenuClick }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] text-slate-400">

            <button
                onClick={() => setActiveView('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeView === 'dashboard' ? 'text-violet-600 scale-105' : 'hover:text-slate-600'} transition-all`}
            >
                <LayoutDashboard size={24} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
                {/* <span className="text-[10px] font-bold">Home</span> */}
            </button>

            <button
                onClick={() => setActiveView('inventory')}
                className={`flex flex-col items-center gap-1 ${activeView === 'inventory' ? 'text-pink-600 scale-105' : 'hover:text-slate-600'} transition-all`}
            >
                <Package size={24} strokeWidth={activeView === 'inventory' ? 2.5 : 2} />
            </button>

            {/* Center Action Button (Analytics) */}
            <div className="-mt-8">
                <button
                    onClick={() => setActiveView('analytics')}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-violet-200 transition-all ${activeView === 'analytics' || activeView === 'performance'
                        ? 'bg-violet-600 text-white scale-110'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                >
                    <TrendingUp size={24} />
                </button>
            </div>

            <button
                onClick={() => setActiveView('finance')}
                className={`flex flex-col items-center gap-1 ${activeView === 'finance' ? 'text-emerald-600 scale-105' : 'hover:text-slate-600'} transition-all`}
            >
                <div className="font-black text-xl leading-none">$</div>
            </button>

            <button
                onClick={onMenuClick}
                className={`flex flex-col items-center gap-1 hover:text-slate-600 transition-all`}
            >
                <Menu size={24} />
            </button>

        </div>
    );
};

export default MobileNavBar;
