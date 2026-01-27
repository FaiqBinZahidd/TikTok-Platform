import { parseCurrency, parsePercent } from './formatUtils';

/**
 * Standardizes column names to lowercase for easier lookup.
 * @param {Array} headers - Raw header row from Excel
 * @returns {Array} List of lowercase headers
 */
export const normalizeHeaders = (headers) => {
    return headers.map(h => String(h).toLowerCase().trim());
};

/**
 * Validates if the data fits the selected platform profile.
 * @param {Array} headers - Normalized headers
 * @param {string} platform - Selected platform
 * @returns {Object} { isValid: boolean, missingColumns: Array }
 */
export const validatePlatformSchema = (headers, platform) => {
    const requiredColumns = {
        'TikTok': ['order id', 'sku', 'product name'],
        'Shopee': ['order sn', 'item name', 'deal price'],
        'Lazada': ['order item id', 'seller sku', 'paid price'],
        'Daraz': ['order number', 'seller sku', 'item price'], // Daraz specific
        'Amazon': [
            ['order-id', 'sku', 'price'], // Order Report
            ['ordered product sales', 'sku'], // Business Report
            ['asin', 'title'] // Generic Listings
        ]
    };

    // Auto-pass if platform is unknown
    if (!requiredColumns[platform]) return { isValid: true, missing: [] };

    // Check strict match for simple arrays, or 'one of' match for nested arrays (Amazon)
    const requiredSet = requiredColumns[platform];

    if (platform === 'Amazon') {
        // For Amazon, we pass if ANY of the sub-arrays are fully satisfied
        // This supports multiple file formats
        const hasMatch = requiredSet.some(subSet =>
            subSet.every(col => headers.some(h => h.includes(col)))
        );
        return { isValid: hasMatch, missing: hasMatch ? [] : ['Compatible Amazon Columns (Order ID or Sales)'] };
    }

    // Default Logic for others
    const missing = requiredSet.filter(col => !headers.some(h => h.includes(col)));
    return { isValid: missing.length === 0, missing };
};

/**
 * Unified Normalization Engine
 * Converts platform-specific raw rows into the internal Common Data Model.
 */
/**
 * Unified Normalization Engine
 * Converts platform-specific raw rows into the internal Common Data Model.
 */
export const normalizeData = (jsonData, filename, selectedPlatform) => {
    if (!jsonData || jsonData.length === 0) return [];

    // Helper to find value by possible keys (case-insensitive fuzzy match)
    const findVal = (row, keywords, blocklist = []) => {
        // First: Try exact match (handles hyphenated keys like 'product-name')
        for (const kw of keywords) {
            if (row.hasOwnProperty(kw) && row[kw] !== undefined && row[kw] !== null) {
                return row[kw];
            }
        }
        // Second: Try fuzzy/lowercase match
        const key = Object.keys(row).find(k => {
            const lowerK = k.toLowerCase().trim();
            if (blocklist.some(bw => lowerK.includes(bw))) return false;
            return keywords.some(kw => lowerK === kw || lowerK.includes(kw));
        });
        return key ? row[key] : null;
    };

    return jsonData.map((row, index) => {
        let id, name, status, gmv, sold, orders, views, stock, platform, ctr, cvr;

        // TikTok channel-specific variables (declared here to avoid scope issues)
        let shopGmv, shopSold, shopViews, shopCtr, shopCvr;
        let liveGmv, liveSold, liveViews, liveCtr, liveCvr;
        let videoGmv, videoSold, videoViews, videoCtr, videoCvr;
        let cardGmv, cardSold, cardViews, cardCtr, cardCvr;

        // Lazada engagement variables
        let addToCartUsers, addToCartConversion, wishlistUsers, revenuePerBuyer;

        // Helper to generate stable ID from text
        const generateStableId = (text) => {
            let hash = 0;
            if (text.length === 0) return hash;
            for (let i = 0; i < text.length; i++) {
                const char = text.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(16);
        };

        // --- DARAZ LOGIC ---
        if (selectedPlatform === 'Daraz') {
            name = findVal(row, ['item name', 'product name', 'names']) || '';
            id = findVal(row, ['order number', 'order no', 'order id']) || `daraz-${generateStableId(name || String(index))}`;
            status = findVal(row, ['status']) || 'Active';
            gmv = parseCurrency(findVal(row, ['unit price', 'item price', 'amount', 'paid price']));
            sold = 1;
            orders = 1;
            views = 0;
            stock = parseCurrency(findVal(row, ['stock', 'quantity'])) || 50;
            platform = 'Daraz';
        }

        // --- TIKTOK LOGIC (Shop Analytics with Channel Breakdown) ---
        else if (selectedPlatform === 'TikTok') {
            name = findVal(row, ['product', 'product name', 'item name', 'title']) || '';
            id = findVal(row, ['id', 'product id', 'order id']) || `tt-${generateStableId(name || String(index))}`;
            status = findVal(row, ['status', 'product status']) || 'Active';

            // Total GMV and Items Sold
            gmv = parseCurrency(findVal(row, ['gmv', 'revenue', 'order amount']));
            sold = parseCurrency(findVal(row, ['items sold', 'sold', 'quantity sold', 'orders']));

            // Channel-specific breakdown (assign to pre-declared variables)
            shopGmv = parseCurrency(findVal(row, ['shop tab gmv', 'shop gmv']));
            shopSold = parseCurrency(findVal(row, ['shop tab items sold', 'shop items sold']));
            shopViews = parseCurrency(findVal(row, ['shop tab page views', 'shop tab listing impressions', 'pageview']));
            shopCtr = parsePercent(findVal(row, ['shop tab clickthrough rate', 'shop tab ctr']));
            shopCvr = parsePercent(findVal(row, ['shop tab conversion rate', 'shop tab cr']));

            liveGmv = parseCurrency(findVal(row, ['live gmv']));
            liveSold = parseCurrency(findVal(row, ['live items sold']));
            liveViews = parseCurrency(findVal(row, ['page views from live', 'live impressions']));
            liveCtr = parsePercent(findVal(row, ['live click-through rate', 'live ctr']));
            liveCvr = parsePercent(findVal(row, ['live conversion rate', 'live cr']));

            videoGmv = parseCurrency(findVal(row, ['video gmv']));
            videoSold = parseCurrency(findVal(row, ['video items sold']));
            videoViews = parseCurrency(findVal(row, ['page views from video', 'video impressions']));
            videoCtr = parsePercent(findVal(row, ['video click-through rate', 'video ctr']));
            videoCvr = parsePercent(findVal(row, ['video conversion rate', 'video cr']));

            cardGmv = parseCurrency(findVal(row, ['product card gmv']));
            cardSold = parseCurrency(findVal(row, ['product card items sold']));
            cardViews = parseCurrency(findVal(row, ['page views from product card', 'product card impressions']));
            cardCtr = parsePercent(findVal(row, ['product card click-through rate', 'product card ctr']));
            cardCvr = parsePercent(findVal(row, ['product card conversion rate', 'product card cr']));

            // Aggregate views and metrics
            views = shopViews || parseCurrency(findVal(row, ['visitor', 'views'])) || 0;
            ctr = shopCtr || parsePercent(findVal(row, ['ctr', 'clickthrough rate']));
            cvr = shopCvr || parsePercent(findVal(row, ['cvr', 'conversion rate']));
            stock = parseCurrency(findVal(row, ['stock', 'quantity', 'inventory'])) || 0;

            platform = 'TikTok';
        }

        // --- SHOPEE LOGIC ---
        else if (selectedPlatform === 'Shopee') {
            name = findVal(row, ['product name', 'item name', 'name', 'variation name']) || '';
            id = findVal(row, ['order sn', 'order id', 'parent sku']) || `shp-${generateStableId(name || String(index))}`;
            status = findVal(row, ['order status', 'status']) || 'Active';
            gmv = parseCurrency(findVal(row, ['deal price', 'unit price', 'item price', 'sales']));
            sold = parseCurrency(findVal(row, ['quantity', 'units sold', 'qty'])) || 1;
            views = parseCurrency(findVal(row, ['page views', 'views']));
            ctr = parsePercent(findVal(row, ['ctr', 'click through rate']));
            cvr = parsePercent(findVal(row, ['conversion rate', 'cr']));
            stock = parseCurrency(findVal(row, ['stock'])) || 0;
            platform = 'Shopee';
        }

        // --- LAZADA LOGIC (Business Advisor) ---
        else if (selectedPlatform === 'Lazada') {
            name = findVal(row, ['product name', 'item name', 'name']) || '';
            id = findVal(row, ['sku id', 'seller sku', 'product id']) || `laz-${generateStableId(name || String(index))}`;
            status = 'Active';
            gmv = parseCurrency(findVal(row, ['revenue', 'product revenue', 'sales']));
            sold = parseCurrency(findVal(row, ['units sold', 'quantity sold', 'items sold']));
            views = parseCurrency(findVal(row, ['product visitors', 'product pageviews', 'page views', 'pvs', 'visitors']));
            cvr = parsePercent(findVal(row, ['conversion rate', 'cvr', 'buyers']));
            stock = 0;
            platform = 'Lazada';

            // New Lazada-specific metrics
            const addToCartUsers = parseCurrency(findVal(row, ['add to cart users', 'cart users']));
            const addToCartConversion = parsePercent(findVal(row, ['add to cart conversion rate', 'cart rate']));
            const wishlistUsers = parseCurrency(findVal(row, ['wishlist users', 'wishlists']));
            const revenuePerBuyer = parseCurrency(findVal(row, ['revenue per buyer', 'avg revenue']));
        }

        // --- AMAZON LOGIC (Order Reports + Business Reports) ---
        else if (selectedPlatform === 'Amazon') {
            // Primary: product-name (Order Report) or title (Business Report)
            name = findVal(row, ['product-name', 'product name', 'title']) || '';
            id = findVal(row, ['sku', 'asin', 'parent asin']) || `amz-${generateStableId(name || String(index))}`;
            status = 'Active';

            // Revenue: item-price (Order Report) or ordered product sales (Business Report)
            gmv = parseCurrency(findVal(row, ['item-price', 'item price', 'ordered product sales', 'revenue', 'sales']));
            sold = parseCurrency(findVal(row, ['quantity-purchased', 'quantity purchased', 'units ordered', 'units'])) || 1;

            // Views estimation (Order Reports don't have traffic data)
            views = parseCurrency(findVal(row, ['sessions', 'page views'])) || Math.round((gmv || 0) * 3);
            cvr = parsePercent(findVal(row, ['unit session percentage', 'conversion']));
            stock = 0;

            // --- Enhanced Customer Data ---
            const customerName = findVal(row, ['buyer-name', 'buyer name', 'recipient-name', 'recipient name']);
            const customerEmail = findVal(row, ['buyer-email', 'buyer email']);
            const customerPhone = findVal(row, ['buyer-phone-number', 'buyer phone number', 'ship-phone-number']);
            const city = findVal(row, ['ship-city', 'ship city']);
            const state = findVal(row, ['ship-state', 'ship state']);
            const country = findVal(row, ['ship-country', 'ship country']);
            const postalCode = findVal(row, ['ship-postal-code', 'ship postal code']);

            platform = 'Amazon';
        }

        // --- GENERIC / AUTO-DETECT FALLBACK ---
        else {
            id = findVal(row, ['id', 'sku', 'asin']) || `gen-${index}`;
            name = findVal(row, ['name', 'title', 'product']) || '';
            status = 'Active';
            gmv = parseCurrency(findVal(row, ['gmv', 'revenue', 'sales', 'price', 'amount']));
            sold = parseCurrency(findVal(row, ['sold', 'quantity', 'units', 'orders']));
            views = parseCurrency(findVal(row, ['views', 'sessions', 'visitors']));
            stock = parseCurrency(findVal(row, ['stock', 'inventory']));
            platform = selectedPlatform || 'Unknown';
        }

        // --- FINAL FALLBACKS & CLEANUP ---
        const sku = findVal(row, ['sku', 'seller sku', 'shop sku']) || id || 'N/A';
        if (!name || name === 'Unknown Product') {
            name = sku !== 'N/A' ? `${platform} Item (${sku})` : `${platform} Product (Missing Name)`;
        }

        // Simulating data if completely missing (for demo purposes only)
        // In a real production app, we might want to flag these as "Incomplete Data" instead
        if ((!views || views === 0) && gmv > 0) {
            views = Math.round(gmv * 3); // Rough estimate
        }
        if (stock === undefined || stock === null) {
            stock = 0; // Default to 0 instead of random
        }

        // --- Customer Metrics Extraction (Enhanced) ---
        // Attempt to find customer data across all platforms if not already set
        // Match Amazon standard keys first
        const customerName =
            row['buyer-name'] || row['buyer name'] || row['recipient-name'] || row['recipient name'] || row['ship-name'] || row['ship name'] ||
            findVal(row, ['receiver name', 'customer name', 'buyer username', 'username', 'recipient', 'buyer', 'ship name']);

        const customerEmail =
            row['buyer-email'] || row['buyer email'] ||
            findVal(row, ['email', 'customer email', 'contact']);

        const shipCity =
            row['ship-city'] || row['ship city'] ||
            findVal(row, ['city', 'shipping city', 'district', 'state']);

        const customerPhone =
            row['buyer-phone-number'] || row['buyer phone number'] || row['ship-phone-number'] ||
            findVal(row, ['phone', 'customer phone', 'contact number']);

        const shipState =
            row['ship-state'] || row['ship state'] ||
            findVal(row, ['state', 'province', 'region']);

        const shipCountry =
            row['ship-country'] || row['ship country'] ||
            findVal(row, ['country']);

        const shipPostalCode =
            row['ship-postal-code'] || row['ship postal code'] ||
            findVal(row, ['postal', 'zip', 'postcode']);

        return {
            id: String(id),
            name: String(name),
            status: String(status),
            gmv: gmv || 0,
            itemsSold: sold || 0,
            orders: sold || 0,

            // Channel-specific GMV (TikTok breakdown)
            shopGmv: shopGmv || gmv || 0,
            shopViews: shopViews || views || 0,
            videoGmv: videoGmv || 0,
            videoViews: videoViews || 0,
            liveGmv: liveGmv || 0,
            liveViews: liveViews || 0,
            cardGmv: cardGmv || 0,
            cardViews: cardViews || 0,

            // Stock & Metrics
            stock: stock,
            ctr: ctr || shopCtr || videoCtr || liveCtr || cardCtr || 0,
            cvr: cvr || shopCvr || videoCvr || liveCvr || cardCvr || 0,

            // Lazada-specific
            addToCartUsers: addToCartUsers || null,
            addToCartConversion: addToCartConversion || null,
            wishlistUsers: wishlistUsers || null,
            revenuePerBuyer: revenuePerBuyer || null,

            // Core metadata
            platform: platform,
            sku: sku,
            sourceFile: filename,
            importDate: new Date().toISOString(),

            // Customer Data (Amazon + others)
            customerName: customerName || null,
            customerEmail: customerEmail || null,
            customerPhone: customerPhone || null,
            shipCity: shipCity || null,
            shipState: shipState || null,
            shipCountry: shipCountry || null,
            shipPostalCode: shipPostalCode || null
        };
    }).filter(p => (p.gmv > 0 || p.itemsSold > 0 || p.stock > 0) && p.name !== '');
};
