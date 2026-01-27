import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    ChevronRight,
    ChevronLeft,
    User,
    LogOut,
    FileText,
    Package,
    Video,
    Target,
    Calendar as CalendarIcon,
    BarChart3,
    TrendingUp,
    Bell,
    Wallet,
    Calculator,
    BookOpen,
    Database,
    Settings,
    Download,
    Upload,
    Plus,
    DollarSign
} from 'lucide-react';
import { getUserPlan, canAccessView, PLANS } from '../../utils/systemRole';


const NavButton = ({ icon: Icon, label, active, onClick, collapsed = false, locked = false }) => (
    <button
        onClick={locked ? null : onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative mb-1
    ${active
                ? 'bg-white text-slate-900 shadow-sm'
                : locked
                    ? 'text-gray-600 cursor-not-allowed opacity-50'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
        title={collapsed ? (locked ? `${label} (Pro Only)` : label) : ""}
        disabled={locked}
    >
        <Icon className={`w-5 h-5 transition-transform ${!locked && 'group-hover:scale-110'} ${active ? 'text-slate-900' : locked ? 'text-gray-600' : 'text-gray-400 group-hover:text-white'}`} />
        {!collapsed && <span className="relative z-10">{label}</span>}
        {locked && !collapsed && (
            <span className="ml-auto px-1.5 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded">PRO</span>
        )}
        {active && !collapsed && !locked && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-pink-400"></div>}
    </button>
);


const Sidebar = ({ activeView, setActiveView, smartInsights, fileInputRef, handleFileUpload, currentUser, handleLogout, t, isMobileOpen, setIsMobileOpen, settings = {} }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Get user plan and check view access
    const userPlan = useMemo(() => getUserPlan(settings), [settings]);
    const isPro = userPlan === PLANS.PRO;

    // Helper to check if view is locked
    const isViewLocked = (viewName) => !canAccessView(viewName, userPlan);

    // Close mobile menu when clicking a link
    const handleNavClick = (view) => {
        // Don't navigate if view is locked
        if (isViewLocked(view)) {
            return;
        }

        setActiveView(view);
        if (window.innerWidth < 768 && setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className={`
                ${sidebarCollapsed ? 'w-20' : 'w-72'} 
                bg-[#1A1A1A] text-white
                transition-all duration-300 ease-in-out
                fixed md:static inset-y-0 left-0 z-50
                flex flex-col flex-shrink-0
                md:my-4 md:ml-4 md:rounded-[24px] shadow-2xl
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
                style={{ height: 'calc(100vh - 32px)' }}
            >
                {/* Logo Section */}
                <div className="p-6 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20">Q</div>
                        {!sidebarCollapsed && <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">Quantro</h1>}
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 bg-white/10 rounded-lg text-white hover:bg-white/20"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Toggle Button (Absolute) */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="hidden md:flex absolute -right-3 top-8 bg-white text-slate-900 p-1.5 rounded-full shadow-md border border-slate-100 hover:scale-110 transition-transform z-50"
                >
                    {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-6">
                    {/* ═══ DASHBOARD (Always Available) ═══ */}
                    <div className='space-y-1'>
                        {!sidebarCollapsed && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">{t('overview')}</p>}
                        <NavButton icon={LayoutDashboard} label={t('overview')} active={activeView === 'dashboard'} onClick={() => handleNavClick('dashboard')} collapsed={sidebarCollapsed} locked={false} />
                        <NavButton icon={Package} label={t('inventory')} active={activeView === 'inventory'} onClick={() => handleNavClick('inventory')} collapsed={sidebarCollapsed} locked={isViewLocked('inventory')} />
                        <NavButton icon={TrendingUp} label={t('marketing')} active={activeView === 'marketing'} onClick={() => handleNavClick('marketing')} collapsed={sidebarCollapsed} locked={isViewLocked('marketing')} />
                        <NavButton icon={Target} label={t('campaigns')} active={activeView === 'campaigns'} onClick={() => handleNavClick('campaigns')} collapsed={sidebarCollapsed} locked={isViewLocked('campaigns')} />
                        <NavButton icon={Video} label={t('media')} active={activeView === 'media'} onClick={() => handleNavClick('media')} collapsed={sidebarCollapsed} locked={isViewLocked('media')} />
                    </div>

                    {/* ═══ ANALYTICS (Pro Only) ═══ */}
                    <div className='space-y-1'>
                        {!sidebarCollapsed && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">{t('analytics')}</p>}
                        <NavButton icon={BarChart3} label="Performance" active={activeView === 'performance'} onClick={() => handleNavClick('performance')} collapsed={sidebarCollapsed} locked={isViewLocked('performance')} />
                        <NavButton icon={Wallet} label={t('finance')} active={activeView === 'finance'} onClick={() => handleNavClick('finance')} collapsed={sidebarCollapsed} locked={isViewLocked('finance')} />
                        <NavButton icon={DollarSign} label="Revenue Intelligence" active={activeView === 'revenue-intelligence'} onClick={() => handleNavClick('revenue-intelligence')} collapsed={sidebarCollapsed} locked={isViewLocked('revenue-intelligence')} />
                        <NavButton icon={Bell} label={t('alerts')} active={activeView === 'alerts'} onClick={() => handleNavClick('alerts')} collapsed={sidebarCollapsed} locked={isViewLocked('alerts')} />
                    </div>

                    {/* ═══ TOOLS (Pro Only) ═══ */}
                    <div className='space-y-1'>
                        {!sidebarCollapsed && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">Tools</p>}
                        <NavButton icon={Calculator} label="Calculator" active={activeView === 'calculator'} onClick={() => handleNavClick('calculator')} collapsed={sidebarCollapsed} locked={isViewLocked('calculator')} />
                        <NavButton icon={CalendarIcon} label={t('calendar')} active={activeView === 'calendar'} onClick={() => handleNavClick('calendar')} collapsed={sidebarCollapsed} locked={isViewLocked('calendar')} />
                    </div>

                    {/* ═══ DATA (Always Available) ═══ */}
                    <div className='space-y-1'>
                        {!sidebarCollapsed && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">{t('datasources')}</p>}
                        <NavButton icon={Database} label={t('datasources')} active={activeView === 'datasources'} onClick={() => handleNavClick('datasources')} collapsed={sidebarCollapsed} locked={false} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative mb-1 text-gray-400 hover:bg-white/10 hover:text-white`}
                            title={sidebarCollapsed ? t('import_data') : ""}
                        >
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                            {!sidebarCollapsed && <span className="relative z-10">{t('import_data')}</span>}
                        </button>
                        <input
                            type="file"
                            ref={fileRef => { if (fileRef) fileInputRef.current = fileRef; }}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".xlsx,.xls,.csv"
                        />
                    </div>
                </div>

                {/* ═══ FOOTER ═══ */}
                <div className="p-4 mt-auto border-t border-white/5 space-y-3">
                    {!sidebarCollapsed ? (
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors" onClick={handleLogout}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold">
                                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{currentUser?.email || 'Admin User'}</p>
                                <p className="text-xs text-gray-400">View Profile</p>
                            </div>
                            <LogOut className="w-4 h-4 text-gray-400" />
                        </div>
                    ) : (
                        <div className="flex justify-center" onClick={handleLogout}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform">
                                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'A'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
