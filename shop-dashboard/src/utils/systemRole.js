/**
 * System Role & Intelligence Module
 * 
 * Handles plan detection, feature gating, and contextual intelligence
 * for Starter vs Pro users.
 */

// Plan definitions
export const PLANS = {
    STARTER: 'starter',
    PRO: 'pro',
    ENTERPRISE: 'enterprise'
};

// Plan limits and capabilities
export const PLAN_LIMITS = {
    [PLANS.STARTER]: {
        maxStores: 2,
        uploadMethods: ['excel'],
        hasProactiveAlerts: false,
        hasDetailedFixes: false,
        hasRevenueEstimates: false,
        hasAdvancedCalculators: false,
        price: 49,
        // View-level access control (only Overview/Dashboard)
        allowedViews: [
            'dashboard',
            'datasources',
            'settings',
            'profile',
            'about'
        ]
    },
    [PLANS.PRO]: {
        maxStores: 5,
        uploadMethods: ['excel', 'api'],
        hasProactiveAlerts: true,
        hasDetailedFixes: true,
        hasRevenueEstimates: true,
        hasAdvancedCalculators: true,
        price: 149,
        // View-level access control (everything)
        allowedViews: [
            'dashboard',
            'inventory',
            'marketing',
            'campaigns',
            'media',
            'performance',
            'analytics',
            'finance',
            'revenue-intelligence',
            'alerts',
            'calculator',
            'calendar',
            'datasources',
            'settings',
            'profile',
            'about',
            'security'
        ]
    }
};

/**
 * Get current user plan from settings or Stripe metadata
 */
export const getUserPlan = (settings = {}) => {
    // DEVELOPER MODE: Check for dev override first
    if (typeof window !== 'undefined') {
        const devPlan = localStorage.getItem('quantro_dev_plan');
        const devMode = localStorage.getItem('quantro_dev_mode');
        if (devMode === 'true' && devPlan) {
            return devPlan;
        }
    }

    // Check settings from Stripe/backend
    if (settings.plan) {
        return settings.plan.toLowerCase();
    }

    // Default to starter if not set
    return PLANS.STARTER;
};

/**
 * Check if user can access a specific feature
 */
export const canAccessFeature = (feature, userPlan = PLANS.STARTER) => {
    const limits = PLAN_LIMITS[userPlan];
    if (!limits) return false;

    return limits[feature] === true;
};

/**
 * Check if user can access a specific view/page
 */
export const canAccessView = (viewName, userPlan = PLANS.STARTER) => {
    const limits = PLAN_LIMITS[userPlan];
    if (!limits) return false;

    return limits.allowedViews.includes(viewName);
};

/**
 * Get all locked views for a user (for showing upgrade prompts)
 */
export const getLockedViews = (userPlan = PLANS.STARTER) => {
    const allViews = PLAN_LIMITS[PLANS.PRO].allowedViews;
    const userViews = PLAN_LIMITS[userPlan]?.allowedViews || [];

    return allViews.filter(view => !userViews.includes(view));
};

/**
 * Check if user can upload another store
 */
export const canUploadStore = (currentStoreCount, userPlan = PLANS.STARTER) => {
    const limits = PLAN_LIMITS[userPlan];
    if (!limits) return false;

    return currentStoreCount < limits.maxStores;
};

/**
 * Get contextual upsell message based on blocked feature
 */
export const getUpsellMessage = (blockedFeature, context = {}) => {
    const messages = {
        proactiveAlerts: {
            what: "We've detected a potential revenue issue",
            why: "This pattern typically leads to profit drops within 2-3 weeks",
            unlock: "Pro shows exactly which products and ads to adjust before it affects your bottom line",
            reassurance: "You can upgrade anytime — no pressure, just clarity"
        },
        detailedFixes: {
            what: "We can see what's happening with your inventory",
            why: "Without the right fix, this could tie up $X in capital",
            unlock: "Pro gives you step-by-step guidance to resolve this and protect your cash flow",
            reassurance: "Upgrade when you're ready — we're here to help, not push"
        },
        revenueEstimates: {
            what: "There's an opportunity here to increase sales",
            why: "Based on your current data, you're leaving money on the table",
            unlock: "Pro shows the exact ROI impact and prioritizes opportunities by revenue potential",
            reassurance: "No rush — just letting you know what's possible"
        },
        storeLimit: {
            what: `You've reached the ${PLAN_LIMITS[PLANS.STARTER].maxStores}-store limit for this plan`,
            why: "More stores mean more insights across your entire business",
            unlock: `Pro allows up to ${PLAN_LIMITS[PLANS.PRO].maxStores} stores and advanced cross-store analytics`,
            reassurance: "Your current stores are safe — upgrade whenever you're ready to scale"
        },
        advancedCalculators: {
            what: "This tool helps you make smarter pricing and inventory decisions",
            why: "Pro users see an average of 15-20% margin improvement using these calculators",
            unlock: "Pro unlocks all Growth Command Lab tools with real-time recommendations",
            reassurance: "Try your current plan first — upgrade when you need the extra power"
        }
    };

    const message = messages[blockedFeature] || messages.detailedFixes;

    // Replace dynamic values if provided in context
    if (context.amount) {
        message.why = message.why.replace('$X', `$${context.amount.toLocaleString()}`);
    }

    return message;
};

/**
 * Format insight based on user plan
 * Starter: WHAT is happening (descriptive only)
 * Pro: WHAT + HOW to fix (actionable)
 */
export const formatInsightForPlan = (insight, userPlan = PLANS.STARTER) => {
    const isPro = userPlan === PLANS.PRO;

    return {
        summary: insight.summary, // Always show
        explanation: insight.explanation, // Always show
        nextSteps: isPro ? insight.nextSteps : [], // Pro only
        consequences: isPro ? insight.consequences : null, // Pro only
        proGuidance: isPro ? insight.proGuidance : null, // Pro only
        riskLevel: insight.riskLevel, // Always show
        isPro: isPro,
        upgradePrompt: !isPro ? getUpsellMessage('detailedFixes', insight.context) : null
    };
};

/**
 * Calculate store count from uploaded files
 */
export const getStoreCount = (uploadedFiles = []) => {
    // Get unique store names (assuming files have a 'storeName' or 'platform' field)
    const uniqueStores = new Set(
        uploadedFiles.map(f => f.storeName || f.platform || 'unknown')
    );
    return uniqueStores.size;
};

/**
 * Validate store upload attempt
 */
export const validateStoreUpload = (uploadedFiles = [], userPlan = PLANS.STARTER) => {
    const currentCount = getStoreCount(uploadedFiles);
    const canUpload = canUploadStore(currentCount, userPlan);

    return {
        allowed: canUpload,
        currentCount,
        maxCount: PLAN_LIMITS[userPlan].maxStores,
        message: canUpload
            ? null
            : getUpsellMessage('storeLimit').what
    };
};

export default {
    PLANS,
    PLAN_LIMITS,
    getUserPlan,
    canAccessFeature,
    canAccessView,
    getLockedViews,
    canUploadStore,
    getUpsellMessage,
    formatInsightForPlan,
    getStoreCount,
    validateStoreUpload
};
