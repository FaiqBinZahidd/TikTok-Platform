import { useState, useEffect, useCallback } from 'react';

// Custom Hook for URL-based Routing (Zero Dependency)
// Replaces useState('dashboard') with URL-synced state
export const useRouter = (defaultView = 'dashboard') => {
    // 1. Initialize from URL or Default
    const getInitialView = () => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('view') || defaultView;
        }
        return defaultView;
    };

    const [activeView, setActiveViewState] = useState(getInitialView);

    // 2. Sync State -> URL (When user clicks menu)
    const setActiveView = useCallback((newView) => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location);
            url.searchParams.set('view', newView);
            window.history.pushState({ view: newView }, '', url);
            setActiveViewState(newView);
        }
    }, []);

    // 3. Sync URL -> State (When user clicks Back/Forward)
    useEffect(() => {
        const handlePopState = (event) => {
            const params = new URLSearchParams(window.location.search);
            const viewFromUrl = params.get('view') || defaultView;
            setActiveViewState(viewFromUrl);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [defaultView]);

    return [activeView, setActiveView];
};
