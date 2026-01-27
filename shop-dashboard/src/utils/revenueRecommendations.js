/**
 * Revenue Recommendation Engine
 * 
 * Generates actionable, data-driven recommendations to help sellers
 * increase revenue, reduce costs, and optimize inventory.
 * 
 * Follows the "Problem-Solution Rule": only surface problems with real fixes.
 */

/**
 * Recommendation severity levels
 */
export const SEVERITY = {
    URGENT: 'urgent',      // Immediate action needed (stock-out risk, cash flow issues)
    CRITICAL: 'critical',  // High impact within 1-2 weeks
    HIGH: 'high',          // Significant revenue opportunity
    MEDIUM: 'medium',      // Moderate impact
    LOW: 'low'             // Nice-to-have optimization
};

/**
 * Recommendation types
 */
export const REC_TYPES = {
    PRICING: 'pricing',
    INVENTORY: 'inventory',
    MARKETING: 'marketing',
    CROSSSELL: 'crosssell',
    RESTOCK: 'restock',
    CLEARANCE: 'clearance'
};

/**
 * Generate all revenue recommendations
 */
export const generateRevenueRecommendations = (products = [], summary = {}, channelData = {}) => {
    const recommendations = [];

    // 1. Stock-Out Risk Detection
    const restockRecs = detectRestockOpportunities(products);
    recommendations.push(...restockRecs);

    // 2. Dead Stock Clearance
    const clearanceRecs = detectClearanceOpportunities(products);
    recommendations.push(...clearanceRecs);

    // 3. Pricing Optimization (High CVR = price too low)
    const pricingRecs = detectPricingOpportunities(products);
    recommendations.push(...pricingRecs);

    // 4. Marketing Spend Optimization (Hidden Gems = needs traffic)
    const marketingRecs = detectMarketingOpportunities(products, summary);
    recommendations.push(...marketingRecs);

    // 5. Cross-Sell/Bundle Opportunities
    const crosssellRecs = detectCrossSellOpportunities(products);
    recommendations.push(...crosssellRecs);

    // Sort by severity and estimated impact
    return recommendations.sort((a, b) => {
        const severityOrder = { urgent: 5, critical: 4, high: 3, medium: 2, low: 1 };
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;

        return b.estimatedImpactValue - a.estimatedImpactValue;
    });
};

/**
 * 1. Detect restock opportunities (prevent stock-outs)
 */
const detectRestockOpportunities = (products) => {
    const recommendations = [];

    products.forEach(product => {
        const stock = product.stock || 0;
        const velocity = (product.itemsSold || 0) / 30; // daily velocity
        const daysLeft = velocity > 0 ? stock / velocity : 999;

        // Urgent: < 7 days of stock for bestsellers
        if (daysLeft < 7 && daysLeft > 0 && velocity >= 1) {
            const reorderQty = Math.ceil(velocity * 30); // 30 days worth
            const estimatedLostSales = velocity * 7 * (product.gmv / (product.itemsSold || 1));

            recommendations.push({
                id: `restock-${product.id}`,
                type: REC_TYPES.RESTOCK,
                severity: SEVERITY.URGENT,
                title: `Stock-Out Risk: ${product.name}`,
                problem: `Only ${Math.floor(daysLeft)} days of stock left for this bestseller.`,
                solution: `Reorder ${reorderQty} units now to prevent lost sales.`,
                estimatedImpact: `Prevent $${Math.round(estimatedLostSales).toLocaleString()} in lost revenue`,
                estimatedImpactValue: estimatedLostSales,
                confidence: 'high',
                productId: product.id,
                productName: product.name,
                actionable: true
            });
        }
    });

    return recommendations;
};

/**
 * 2. Detect clearance opportunities (dead stock)
 */
const detectClearanceOpportunities = (products) => {
    const recommendations = [];

    const deadStock = products.filter(p =>
        (p.stock || 0) > 20 &&
        (p.itemsSold || 0) === 0
    );

    if (deadStock.length > 0) {
        const totalValue = deadStock.reduce((sum, p) => sum + ((p.stock || 0) * (p.gmv / (p.itemsSold || 1))), 0);
        const recoveryValue = totalValue * 0.6; // Assume 60% recovery via clearance

        recommendations.push({
            id: 'clearance-dead-stock',
            type: REC_TYPES.CLEARANCE,
            severity: SEVERITY.CRITICAL,
            title: `Dead Stock Alert: ${deadStock.length} SKUs`,
            problem: `$${Math.round(totalValue).toLocaleString()} tied up in unsold inventory.`,
            solution: `Run a clearance sale (30-40% off) or bundle with bestsellers.`,
            estimatedImpact: `Recover $${Math.round(recoveryValue).toLocaleString()} in cash flow`,
            estimatedImpactValue: recoveryValue,
            confidence: 'high',
            products: deadStock.map(p => ({ id: p.id, name: p.name, stock: p.stock })),
            actionable: true
        });
    }

    return recommendations;
};

/**
 * 3. Detect pricing optimization opportunities
 */
const detectPricingOpportunities = (products) => {
    const recommendations = [];

    // Calculate average CVR
    const validProducts = products.filter(p => (p.shopViews || 0) > 50);
    const avgCVR = validProducts.reduce((sum, p) => {
        const views = p.shopViews || 1;
        const sales = p.itemsSold || 0;
        return sum + (sales / views);
    }, 0) / (validProducts.length || 1);

    // Find products with significantly higher CVR (price too low)
    products.forEach(product => {
        const views = product.shopViews || 0;
        const sales = product.itemsSold || 0;
        const cvr = views > 0 ? sales / views : 0;

        if (cvr > avgCVR * 2 && views > 100 && sales > 10) {
            const currentPrice = product.gmv / (product.itemsSold || 1);
            const suggestedPrice = currentPrice * 1.15; // 15% increase
            const monthlyRevenue = product.gmv;
            const estimatedGain = monthlyRevenue * 0.15 * 0.8; // 15% price * 80% conversion retention

            recommendations.push({
                id: `pricing-${product.id}`,
                type: REC_TYPES.PRICING,
                severity: SEVERITY.HIGH,
                title: `Price Opportunity: ${product.name}`,
                problem: `Conversion rate is ${(cvr * 100).toFixed(1)}% (avg: ${(avgCVR * 100).toFixed(1)}%). Price may be too low.`,
                solution: `Test a 10-15% price increase to $${suggestedPrice.toFixed(2)}.`,
                estimatedImpact: `+$${Math.round(estimatedGain).toLocaleString()}/month`,
                estimatedImpactValue: estimatedGain,
                confidence: 'medium',
                productId: product.id,
                productName: product.name,
                actionable: true
            });
        }
    });

    return recommendations;
};

/**
 * 4. Detect marketing spend opportunities (Hidden Gems)
 */
const detectMarketingOpportunities = (products, summary) => {
    const recommendations = [];

    const validProducts = products.filter(p => (p.shopViews || 0) > 50);
    const avgViews = validProducts.reduce((sum, p) => sum + (p.shopViews || 0), 0) / (validProducts.length || 1);
    const avgCVR = validProducts.reduce((sum, p) => {
        const views = p.shopViews || 1;
        const sales = p.itemsSold || 0;
        return sum + (sales / views);
    }, 0) / (validProducts.length || 1);

    // Find high CVR + low traffic products
    products.forEach(product => {
        const views = product.shopViews || 0;
        const sales = product.itemsSold || 0;
        const cvr = views > 0 ? sales / views : 0;

        if (cvr > avgCVR && views < avgViews * 0.5 && sales >= 3) {
            const marginPerSale = (product.gmv / (product.itemsSold || 1)) * 0.3; // Assume 30% margin
            const estimatedAdBudget = 200;
            const estimatedNewSales = (estimatedAdBudget / 2) * cvr; // $2 CPC assumption
            const estimatedROI = estimatedNewSales * marginPerSale;

            if (estimatedROI > estimatedAdBudget * 2) { // Only recommend if 2x ROAS
                recommendations.push({
                    id: `marketing-${product.id}`,
                    type: REC_TYPES.MARKETING,
                    severity: SEVERITY.HIGH,
                    title: `Hidden Gem: ${product.name}`,
                    problem: `High conversion (${(cvr * 100).toFixed(1)}%) but only ${views} views/month.`,
                    solution: `Increase ad spend by $${estimatedAdBudget} to drive more traffic.`,
                    estimatedImpact: `+$${Math.round(estimatedROI).toLocaleString()} revenue (${(estimatedROI / estimatedAdBudget).toFixed(1)}x ROAS)`,
                    estimatedImpactValue: estimatedROI,
                    confidence: 'medium',
                    productId: product.id,
                    productName: product.name,
                    actionable: true
                });
            }
        }
    });

    return recommendations;
};

/**
 * 5. Detect cross-sell/bundle opportunities
 */
const detectCrossSellOpportunities = (products) => {
    const recommendations = [];

    // Simple implementation: find products in the same category with complementary sales patterns
    // In a real implementation, you'd use purchase correlation data

    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'uncategorized';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(p);
    });

    Object.entries(categories).forEach(([category, items]) => {
        if (items.length >= 2) {
            const topSellers = items.filter(p => (p.itemsSold || 0) > 10).sort((a, b) => b.itemsSold - a.itemsSold).slice(0, 2);

            if (topSellers.length === 2) {
                const combinedRevenue = topSellers[0].gmv + topSellers[1].gmv;
                const bundleDiscount = 0.1; // 10% bundle discount
                const estimatedUplift = combinedRevenue * 0.2; // 20% uplift from bundling

                recommendations.push({
                    id: `bundle-${category}`,
                    type: REC_TYPES.CROSSSELL,
                    severity: SEVERITY.MEDIUM,
                    title: `Bundle Opportunity: ${category}`,
                    problem: `Top sellers in "${category}" are often purchased separately.`,
                    solution: `Create a bundle: "${topSellers[0].name} + ${topSellers[1].name}" at 10% off.`,
                    estimatedImpact: `+$${Math.round(estimatedUplift).toLocaleString()}/month`,
                    estimatedImpactValue: estimatedUplift,
                    confidence: 'low',
                    products: topSellers.map(p => ({ id: p.id, name: p.name })),
                    actionable: true
                });
            }
        }
    });

    return recommendations;
};

/**
 * Get top N recommendations
 */
export const getTopRecommendations = (products, summary, channelData, limit = 5) => {
    const allRecs = generateRevenueRecommendations(products, summary, channelData);
    return allRecs.slice(0, limit);
};

/**
 * Get recommendations by type
 */
export const getRecommendationsByType = (products, summary, channelData, type) => {
    const allRecs = generateRevenueRecommendations(products, summary, channelData);
    return allRecs.filter(rec => rec.type === type);
};

export default {
    SEVERITY,
    REC_TYPES,
    generateRevenueRecommendations,
    getTopRecommendations,
    getRecommendationsByType
};
