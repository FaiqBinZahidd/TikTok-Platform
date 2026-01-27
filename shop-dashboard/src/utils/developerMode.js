/**
 * Developer Mode Utility
 * 
 * Allows developers to test different plan tiers without Stripe integration.
 * 
 * Usage:
 * - Press Ctrl+Shift+D to toggle between Starter/Pro
 * - Visual indicator shows current plan in bottom-right corner
 */

import { PLANS } from './systemRole';

const DEV_MODE_KEY = 'quantro_dev_mode';
const DEV_PLAN_KEY = 'quantro_dev_plan';

/**
 * Check if developer mode is enabled
 */
export const isDevMode = () => {
    // Check localStorage
    const devMode = localStorage.getItem(DEV_MODE_KEY);

    // Also enable if NODE_ENV is development
    return devMode === 'true' || process.env.NODE_ENV === 'development';
};

/**
 * Enable/disable developer mode
 */
export const setDevMode = (enabled) => {
    localStorage.setItem(DEV_MODE_KEY, enabled ? 'true' : 'false');
    console.log(`🔧 Developer Mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    if (enabled) {
        updateDevIndicator();
    } else {
        removeDevIndicator();
    }
};

/**
 * Get developer override plan (if any)
 */
export const getDevPlan = () => {
    if (!isDevMode()) return null;

    const plan = localStorage.getItem(DEV_PLAN_KEY);
    return plan || PLANS.STARTER; // Default to STARTER for testing both plans
};

/**
 * Set developer plan override
 */
export const setDevPlan = (plan) => {
    if (!Object.values(PLANS).includes(plan)) {
        console.error(`Invalid plan: ${plan}. Use 'starter' or 'pro'`);
        return;
    }

    setDevMode(true); // Auto-enable dev mode
    localStorage.setItem(DEV_PLAN_KEY, plan);
    console.log(`🔧 Developer Plan Override: ${plan.toUpperCase()}`);
    updateDevIndicator();
};

/**
 * Toggle between plans
 */
export const toggleDevPlan = () => {
    const currentPlan = getDevPlan() || PLANS.STARTER;
    const newPlan = currentPlan === PLANS.PRO ? PLANS.STARTER : PLANS.PRO;
    setDevPlan(newPlan);
    return newPlan;
};

/**
 * Clear developer overrides
 */
export const clearDevOverrides = () => {
    localStorage.removeItem(DEV_MODE_KEY);
    localStorage.removeItem(DEV_PLAN_KEY);
    removeDevIndicator();
    console.log('🔧 Developer overrides cleared');
};

/**
 * Create/update persistent visual indicator
 */
const updateDevIndicator = () => {
    removeDevIndicator(); // Remove old one first

    if (!isDevMode()) return;

    const currentPlan = getDevPlan() || PLANS.STARTER;
    const isPro = currentPlan === PLANS.PRO;

    const indicator = document.createElement('div');
    indicator.id = 'dev-mode-indicator';
    indicator.className = 'fixed bottom-4 left-4 z-[9999] pointer-events-none';
    indicator.innerHTML = `
        <div class="flex items-center gap-2 px-4 py-2 rounded-xl shadow-2xl border backdrop-blur-sm ${isPro
            ? 'bg-violet-900/90 border-violet-500 text-white'
            : 'bg-slate-800/90 border-slate-500 text-white'
        }">
            <div class="w-2 h-2 rounded-full ${isPro ? 'bg-violet-400' : 'bg-slate-400'} animate-pulse"></div>
            <div>
                <p class="text-xs font-bold">DEV MODE</p>
                <p class="text-[10px] opacity-75">${currentPlan.toUpperCase()} Plan</p>
            </div>
            <kbd class="ml-2 px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] font-mono">Ctrl+Shift+D</kbd>
        </div>
    `;

    document.body.appendChild(indicator);
};

/**
 * Remove visual indicator
 */
const removeDevIndicator = () => {
    const existing = document.getElementById('dev-mode-indicator');
    if (existing) {
        existing.remove();
    }
};

/**
 * Show temporary toast notification
 */
const showToast = (message, submessage = null) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl z-[9999] animate-in slide-in-from-bottom-2';
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <div>
                <p class="font-bold text-sm">${message}</p>
                ${submessage ? `<p class="text-xs text-slate-400">${submessage}</p>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

/**
 * Initialize developer mode keyboard shortcut
 * Press Ctrl+Shift+D to toggle plan
 */
export const initDevModeShortcut = () => {
    if (typeof window === 'undefined') return;

    // Initialize indicator on page load if dev mode is active
    if (isDevMode()) {
        updateDevIndicator();
    }

    window.addEventListener('keydown', (e) => {
        // Ctrl+Shift+D (or Cmd+Shift+D on Mac)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();

            const newPlan = toggleDevPlan();
            const isPro = newPlan === PLANS.PRO;

            // Show toast notification
            showToast(
                `Switched to ${newPlan.toUpperCase()} Plan`,
                `Press F5 to refresh and see ${isPro ? 'advanced' : 'basic'} features`
            );

            // Force update indicator
            setTimeout(() => {
                updateDevIndicator();
            }, 100);
        }
    });

    // Log helper in console
    if (isDevMode()) {
        console.log('%c🔧 Developer Mode Active', 'font-size: 16px; font-weight: bold; color: #8b5cf6;');
        console.log('%cCurrent Plan:', 'font-weight: bold;', (getDevPlan() || 'STARTER').toUpperCase());
        console.log('%cKeyboard Shortcuts:', 'font-weight: bold;');
        console.log('  Ctrl+Shift+D (or Cmd+Shift+D) - Toggle between Starter/Pro');
        console.log('%cConsole Commands:', 'font-weight: bold;');
        console.log('  setDevPlan("pro")     - Switch to Pro');
        console.log('  setDevPlan("starter") - Switch to Starter');
        console.log('  getDevPlan()          - Check current plan');
        console.log('  clearDevOverrides()   - Clear all overrides');
        console.log('%cNote:', 'font-weight: bold; color: #f59e0b;', 'Changes take effect after page refresh (F5)');
    }
};

// Make functions available globally for console access
if (typeof window !== 'undefined') {
    window.setDevPlan = setDevPlan;
    window.toggleDevPlan = toggleDevPlan;
    window.clearDevOverrides = clearDevOverrides;
    window.getDevPlan = getDevPlan;
}

export default {
    isDevMode,
    setDevMode,
    getDevPlan,
    setDevPlan,
    toggleDevPlan,
    clearDevOverrides,
    initDevModeShortcut
};
