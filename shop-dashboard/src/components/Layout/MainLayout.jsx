import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNavBar from './MobileNavBar';

const MainLayout = ({
    children,
    activeView,
    setActiveView,
    smartInsights,
    searchTerm,
    setSearchTerm,
    notifications,
    handleQuickAction,
    currentUser,
    handleLogout,
    fileInputRef,
    handleFileUpload,
    processedProducts,
    setSelectedProduct,
    t,
    settings = {} // Added for plan detection
}) => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#FAF8F3] overflow-hidden font-sans text-slate-900 selection:bg-pink-100 selection:text-pink-600">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block h-full">
                {/* Mobile Sidebar */}
                <Sidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    smartInsights={smartInsights}
                    fileInputRef={fileInputRef}
                    handleFileUpload={handleFileUpload}
                    currentUser={currentUser}
                    handleLogout={handleLogout}
                    t={t}
                    isMobileOpen={isMobileNavOpen}
                    setIsMobileOpen={setIsMobileNavOpen}
                    settings={settings}
                /></div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative h-full w-full">
                <TopBar
                    currentUser={currentUser || "Partner"}
                    activeView={activeView}
                    platformFilter={platformFilter}
                    setPlatformFilter={setPlatformFilter}
                    availablePlatforms={availablePlatforms}
                    timePeriod={timePeriod}
                    setTimePeriod={setTimePeriod}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleLogout={handleLogout}
                    setActiveView={setActiveView}
                    t={t}
                    onMenuClick={() => setIsMobileOpen(true)}
                    settings={settings}
                    processedProducts={processedProducts}
                    setSelectedProduct={setSelectedProduct}
                />

                <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-8 scrollbar-hide">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNavBar
                activeView={activeView}
                setActiveView={setActiveView}
                onMenuClick={() => setIsMobileOpen(true)}
            />
        </div>
    );
};

export default MainLayout;
