import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, User, Settings, LogOut, ChevronDown, Menu, BookOpen } from 'lucide-react';
import PlatformFilter from '../PlatformFilter';
import SystemDocumentation from '../System/SystemDocumentation';
import SearchCommandPalette from './SearchCommandPalette';

const TopBar = ({
    activeView,
    searchTerm,
    setSearchTerm,
    timePeriod,
    setTimePeriod,
    currentUser,
    handleLogout,
    platformFilter,
    setPlatformFilter,
    availablePlatforms,
    setActiveView,
    t,
    onMenuClick,
    settings,
    processedProducts,
    setSelectedProduct
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
    const [showDocumentation, setShowDocumentation] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Time periods mapping
    const timePeriods = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'All Time'];

    const profileRef = useRef(null);
    const notifRef = useRef(null);
    const dateRef = useRef(null);

    // Handle clicking outside to close dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
            if (dateRef.current && !dateRef.current.contains(event.target)) setIsDateFilterOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper to format current view title
    const getViewTitle = (view) => {
        const titles = {
            'dashboard': t('overview'),
            'inventory': t('inventory'),
            'media': t('media'),
            'campaigns': t('campaigns'),
            'calendar': t('calendar'),
            'finance': t('finance'),
            'reports': t('reports'),
            'settings': t('settings'),
            'calculator': 'Profit Simulator',
            'analytics': t('analytics'),
            'alerts': t('alerts'),
            'security': t('security')
        };
        return titles[view] || t('overview');
    };

    return (
        <div className="h-16 px-4 md:px-8 flex items-center justify-between bg-white border-b border-slate-100/50 sticky top-0 z-50 shadow-sm relative">
            {/* Left: View Title & Search */}
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-lg md:hidden text-slate-600"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <h1 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap min-w-[100px] md:min-w-[150px]">
                    {getViewTitle(activeView)}
                </h1>

                {/* Search Bar - Global */}
                <div className="relative max-w-md w-full hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products, features..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(!!e.target.value); }}
                        onFocus={() => searchTerm && setIsSearchOpen(true)}
                        id="global-search"
                        name="global-search"
                        autoComplete="off"
                        className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:bg-white transition-all"
                    />
                    {isSearchOpen && (
                        <SearchCommandPalette
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            processedProducts={processedProducts || []}
                            setActiveView={setActiveView}
                            setSelectedProduct={setSelectedProduct}
                            onClose={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                        />
                    )}
                </div>

            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Global Filters */}
                <div className="flex items-center gap-3">
                    {availablePlatforms && (
                        <PlatformFilter
                            value={platformFilter}
                            onChange={setPlatformFilter}
                            availablePlatforms={availablePlatforms}
                            showLabel={false}
                        />
                    )}

                    {/* Date Filter */}
                    <div className="relative" ref={dateRef}>
                        <button
                            onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{timePeriod || 'All Time'}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {isDateFilterOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-in fade-in zoom-in-95 origin-top-right">
                                {timePeriods.map(period => (
                                    <button
                                        key={period}
                                        onClick={() => { setTimePeriod(period); setIsDateFilterOpen(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${timePeriod === period ? 'text-violet-600 font-bold bg-violet-50' : 'text-slate-600'}`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

                    {/* User Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors group"
                        >
                            {settings?.avatar ? (
                                <img
                                    src={settings.avatar}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-white group-hover:ring-violet-100"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white group-hover:ring-violet-100">
                                    {currentUser?.email ? currentUser.email[0].toUpperCase() : 'M'}
                                </div>
                            )}
                            <div className="text-left hidden lg:block">
                                <p className="text-sm font-bold text-slate-700 leading-none">{currentUser?.email || 'Manager'}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Admin</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 origin-top-right font-medium text-sm text-slate-600">
                                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                    <p className="font-bold text-slate-800 break-words">{currentUser?.email || 'Manager'}</p>
                                    <p className="text-xs text-slate-400 capitalize">Role: {currentUser?.role || 'Admin'}</p>
                                </div>

                                <button
                                    onClick={() => { setActiveView('profile'); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-2 transition-colors"
                                >
                                    <User className="w-4 h-4" /> Profile
                                </button>
                                <button
                                    onClick={() => { setShowDocumentation(true); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-2 transition-colors"
                                >
                                    <BookOpen className="w-4 h-4" /> How it Works
                                </button>
                                <button
                                    onClick={() => { setActiveView('settings'); setIsProfileOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-violet-600 flex items-center gap-2 transition-colors"
                                >
                                    <Settings className="w-4 h-4" /> Settings
                                </button>

                                <div className="border-t border-slate-50 mt-1 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 hover:text-rose-700 flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documentation Modal */}
                <SystemDocumentation
                    isOpen={showDocumentation}
                    onClose={() => setShowDocumentation(false)}
                />
            </div>
        </div>
    );
};

export default TopBar;
