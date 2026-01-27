/**
 * Quantro Intelligence - "Professor Mode" Knowledge Base
 * A comprehensive dictionary of e-commerce concepts, strategies, and system help.
 */

const KNOWLEDGE_BASE = [
    // ==========================================
    // 🧭 MENU & FEATURE NAVIGATION
    // ==========================================
    {
        keywords: ['dashboard', 'home', 'overview', 'main menu'],
        response: "🏠 **Dashboard Overview**\n\n**What it is:** Your command center. It shows real-time KPI cards (Revenue, Margin, Stock), a daily performance summary, and your top-selling items.\n**How to use:** Check the 'Business Health' score daily to see if you are on track.",
        action: { label: "Go to Dashboard", view: "dashboard" }
    },
    {
        keywords: ['analytics', 'charts', 'graphs', 'trends', 'performance'],
        response: "📈 **Advanced Analytics**\n\n**What it is:** Deep-dive charts for Revenue, Orders, and AOV over time.\n**How to use:** Use the date picker to compare performance (e.g., 'Last Month' vs 'This Month'). Spot trends before they become problems.",
        action: { label: "Open Analytics", view: "analytics" }
    },
    {
        keywords: ['inventory', 'products', 'stock', 'items', 'catalog'],
        response: "📦 **Inventory Manager**\n\n**What it is:** Tracks all your products, stock levels, and velocity.\n**How to use:**\n1. Filter by 'Low Stock' to see what to reorder.\n2. Filter by 'Dead Stock' to see what to discount.\n3. Click any product to see its full history.",
        action: { label: "Manage Inventory", view: "inventory" }
    },
    {
        keywords: ['marketing', 'ads', 'traffic', 'views', 'hidden gem'],
        response: "📣 **Marketing Center**\n\n**What it is:** Analyzes your traffic sources (Shop vs Live vs Video) and identifies Ad opportunities.\n**Feature:** Look for 'Hidden Gems' (High CVR, Low Traffic) and launch ads on them immediately.",
        action: { label: "Open Marketing", view: "marketing" }
    },
    {
        keywords: ['finance', 'money', 'profit', 'margin', 'p&l', 'cost', 'net profit'],
        response: "💰 **Finance Hub**\n\n**What it is:** Your P&L statement. It accounts for COGS, shipping, and fees to show your *true* Net Profit.\n**Tip:** If Net Margin < 15%, check your COGS or Ad Spend usage in the Decision Lab.",
        action: { label: "View Finance", view: "finance" }
    },
    {
        keywords: ['data', 'source', 'upload', 'import', 'file', 'csv', 'excel'],
        response: "📂 **Data Sources**\n\n**What it is:** The engine of Quantro. Upload your Excel/CSV files here.\n**Supported:** TikTok Shop, Shopee, Lazada.\n**New:** You can now specify the currency (USD, THB) for each file to ensure accurate global reporting.",
        action: { label: "Manage Data", view: "datasources" }
    },
    {
        keywords: ['lab', 'decision', 'calculator', 'simulator', 'burn rate', 'stress', 'growth'],
        response: "⚡ **Growth Command Lab**\n\n**What it is:** A suite of predictive tools.\n**Tools:**\n- **Burn Rate:** When will you stock out?\n- **Ad Stress:** Can you survive a CPA hike?\n- **Discount Calc:** Is that 20% sale actually profitable?",
        action: { label: "Open Command Lab", view: "calculator" }
    },
    {
        keywords: ['settings', 'profile', 'account', 'password'],
        response: "⚙️ **Settings & Profile**\n\n**What it is:** Manage your user account, password, and system preferences.\n**Action:** You can also reset your 'Demo Data' from here if needed.",
        action: { label: "Open Settings", view: "profile" }
    },

    // ==========================================
    // 📊 CORE METRICS & ANALYTICS
    // ==========================================
    {
        keywords: ['gmv', 'revenue', 'sales volume'],
        response: "📊 **GMV (Gross Merchandise Value)**\n\n**Definition:** Total value of merchandise sold over a period.\n**Formula:** (Price x Quantity Sold)\n**Insight:** GMV shows scale, but not health. You can have high GMV but lose money if your costs (COGS, Ads) are too high.\n**Goal:** Aim for consistent MoM (Month-over-Month) growth.",
        action: { label: "View Analytics", view: "analytics" }
    },
    {
        keywords: ['profit', 'net profit', 'margin', 'bottom line'],
        response: "💰 **Net Profit Strategies**\n\n**Definition:** Actual money you keep after ALL expenses.\n**Formula:** GMV - (COGS + Shipping + Platform Fees + Ad Spend + Tx Fees)\n**Benchmark:** >15% is healthy for dropshipping. >25% is excellent.\n**Optimization:**\n- Raise prices by 5% (often goes unnoticed).\n- Bundle items to save on shipping.\n- Negotiate bulk rates with suppliers.",
        action: { label: "Calculate Margin", view: "calculator" }
    },
    {
        keywords: ['roas', 'return on ad spend'],
        response: "📢 **ROAS (Return on Ad Spend)**\n\n**Definition:** Revenue generated for every $1 spent on ads.\n**Formula:** Revenue / Ad Spend\n**Benchmark:**\n- **< 2.0x:** Losing money (usually)\n- **3.0x:** Break-even (approx)\n- **> 4.0x:** Profitable scaling\n**Tip:** Don't obsess over ROAS if you are testing creative. Focus on CTR first.",
        action: { label: "Check Marketing", view: "marketing" }
    },
    {
        keywords: ['cvr', 'conversion rate'],
        response: "🎯 **CVR (Conversion Rate) Hacks**\n\n**Definition:** % of visitors who buy.\n**Formula:** (Orders / Total Views) x 100\n**Benchmarks:**\n- **TikTok:** 2-5% (Video), 1-3% (Live)\n- **Shopee/Lazada:** 3-7%\n**Fix:**\n- **Price:** Is it competitive?\n- **Reviews:** Do you have photo reviews? (Critical)\n- **Voucher:** Add a small $1 off coupon to nudge indecisive buyers."
    },
    {
        keywords: ['ctr', 'click through', 'click-through'],
        response: "👆 **CTR (Click-Through Rate)**\n\n**Definition:** % of people who see your item and click it.\n**Goal:** >2.0% on TikTok/Ads.\n**Fix:** If CTR is low, your **Hook** (first 3 sec of video) or **Main Image** is weak. Test new thumbnails!"
    },
    {
        keywords: ['aov', 'average order value', 'basket size'],
        response: "🛒 **AOV (Average Order Value)**\n\n**Definition:** Average amount a customer spends per transaction.\n**Formula:** Total Revenue / Total Orders\n**Strategy:** Increase AOV by offering **Bundles** (Buy 2 Get 5% Off) or Cross-sells (Add specific cable)."
    },

    // ==========================================
    // 🧪 ADVANCED SIMULATORS (Phase 6)
    // ==========================================
    {
        keywords: ['stress test', 'ad stress', 'cpa increase', 'crash'],
        response: "📉 **Ad Stress Simulator**\n\nUse this tool to see if your business survives a 20-50% spike in ad costs. It calculates your Break-Even ROAS limit and warns of insolvency zones.",
        action: { label: "Open Simulator", view: "calculator" }
    },
    {
        keywords: ['burn rate', 'stockout', 'inventory burn', 'run out'],
        response: "🔥 **Inventory Burn Rate**\n\nI can predict exactly when you'll run out of stock based on current velocity. Check the Lead Time warning to order before it's too late.",
        action: { label: "Check Burn Rate", view: "calculator" }
    },
    {
        keywords: ['discount', 'sale', 'volume', 'uplift'],
        response: "🏷️ **Discount Profitability**\n\nDid you know a 20% discount might require you to double your sales just to make the same profit? Use the calculator to find the required sales lift.",
        action: { label: "Calc Discount Info", view: "calculator" }
    },
    {
        keywords: ['growth lab', 'decision lab', 'command center'],
        response: "⚡ **Growth Command Lab**\n\nYour central hub for predictive modeling. Access Net Margin, Break-Even, Burn Rate, and Ad Stress tools here.",
        action: { label: "Open Lab", view: "calculator" }
    },


    // ==========================================
    // 🛍️ PLATFORM STRATEGIES (TikTok, Shopee, etc.)
    // ==========================================
    {
        keywords: ['tiktok strategy', 'tiktok tips', 'short video', 'algorithm'],
        response: "🎵 **TikTok Strategy Masterclass**\n\n1. **The Hook:** You have 2 seconds. Stop the scroll visually or verbally.\n2. **The Story:** Don't sell the product; sell the *problem* it solves.\n3. **The CTA:** Tell them exactly what to do ('Click the yellow basket').\n4. **Frequency:** Post 3-5x a day for new accounts to find your winning angle.\n5. **Sounds:** Use trending (but relevant) audio.",
        action: { label: "View Insights", view: "marketing" }
    },
    {
        keywords: ['affiliate', 'creator', 'influencer'],
        response: "🤝 **TikTok Affiliate Strategy**\n\nInstead of paying for ads, pay for results.\n1. **Open Plan:** Set 10-15% commission for everyone.\n2. **Targeted Plan:** Find creators in your niche. DM them: 'Free sample in exchange for a video?'\n3. **Scale:** One viral video from an affiliate can make you $10k overnight with $0 ad spend."
    },
    {
        keywords: ['tiktok live', 'livestream'],
        response: "🎥 **TikTok Live Tips**\n\n- **Consistency:** Go live at the same time daily.\n- **Energy:** High energy = High retention.\n- **Flash Deals:** Run 'Flash Sales' every 10 mins to reset viewer momentum.\n- **Pinned Products:** Always have the 'Hero Product' pinned."
    },
    {
        keywords: ['shopee strategy', 'shopee tips', 'seo'],
        response: "🧡 **Shopee Growth Hacks**\n\n- **SEO is King:** Use keywords in your title like 'Ready Stock', 'Local', 'Fast Shipping'.\n- **Decoration:** Use 'Shop Decoration' to look professional.\n- **Bundles:** Enable 'Bundle Deal' (Buy 2 Save 5%) to boost AOV."
    },
    {
        keywords: ['lazada strategy', 'lazada tips'],
        response: "💙 **Lazada Success**\n\n- **Flexi Combo:** This is Lazada's most powerful tool. Set tiers ($30 get 5% off).\n- **Sponsored Discovery:** Use automatic keywords if you are new.\n- **Store Pickup:** If possible, enable this for local trust."
    },

    // ==========================================
    // ⚔️ DROPSHIPPING & PRODUCT RESEARCH
    // ==========================================
    {
        keywords: ['product research', 'winning product', 'winner'],
        response: "🏆 **Winning Product Criteria**\n\n1. **Wow Factor:** Must stop the scroll.\n2. **Problem Solver:** Solves a painful/annoying problem.\n3. **Mass Appeal:** Can be sold to almost anyone (or a huge niche).\n4. **Healthy Margin:** Sell for $29+, Source for <$8.\n5. **Good Content:** Are there existing videos you can remix?",
        action: { label: "See Top Products", view: "inventory" }
    },

    // ==========================================
    // 🖥️ SYSTEM HELP & FEATURES
    // ==========================================
    {
        keywords: ['import', 'upload', 'excel', 'csv', 'spreadsheet'],
        response: "📂 **Import Guide**\n\n1. Click **'Import Data'** (Sidebar or Top Bar).\n2. Select your Excel/CSV.\n3. **Select Currency:** You can now specify if the file is in USD, THB, etc.\n4. **Choose Platform:** Identify the source (TikTok, Shopee).\n\n**Errors?** Ensure headers match standard formats.",
        action: { label: "Go to Data Sources", view: "datasources" }
    },
    {
        keywords: ['features', 'what can you do', 'capabilities', 'help', 'menu'],
        response: "🚀 **Quantro Features**\n\nI can help you with:\n1. **Analytics:** View Sales, GMV, and Profit.\n2. **Inventory:** Track Stock & Burn Rates.\n3. **Marketing:** Analyze Ads & Find Hidden Gems.\n4. **Tools:** Run Stress Tests & Calculators.",
        action: { label: "Explore Dashboard", view: "dashboard" }
    },
    {
        keywords: ['marketing view', 'marketing tab', 'hidden gem'],
        response: "📣 **New Marketing View**\n\nThis powerful tab shows:\n- **Visitor Traffic:** Which items get views?\n- **Ad Potential:** Items with High CVR but Low Traffic are 'Hidden Gems'. Run ads on them!\n- **Optimization:** Items with High Traffic but Low CVR need better prices or images.",
        action: { label: "Open Marketing", view: "marketing" }
    },
    {
        keywords: ['inventory', 'abc', 'stock'],
        response: "📦 **Inventory & ABC Analysis**\n\nQuantro automatically categorizes your items:\n- **A (Winners):** Top 80% of revenue. NEVER go out of stock.\n- **B (Regulars):** Steady sellers.\n- **C (Dead Stock):** Rarely sell. Clear these out with discounts to free up cash.",
        action: { label: "Manage Inventory", view: "inventory" }
    },
    {
        keywords: ['delete', 'remove file', 'clear', 'trash'],
        response: "🗑 **Deleting Data**\n\nGo to **Data Sources** (bottom menu). Find the file card. Click the **Trash Bin** icon. You will be asked to confirm. This action deletes all sales records attached to that file.",
        action: { label: "Manage Files", view: "datasources" }
    },
    {
        keywords: ['profile', 'password', 'change name'],
        response: "👤 **Profile Settings**\n\nClick your Avatar (top right) > **Profile**.\nThere you can:\n- Update your Display Name & Phone.\n- Change your Password securely.\n- View your Role and Join Date.",
        action: { label: "Open Profile", view: "profile" }
    },

    // ==========================================
    // 💬 CONVERSATION & CHIT-CHAT
    // ==========================================
    {
        keywords: ['hello', 'hi', 'hey', 'start', 'yo'],
        response: "👋 **Hello Boss!**\n\nI'm Quantro v2.5, your advanced e-commerce co-pilot. I can help with:\n- **Predictive Models** (Burn Rate, Ad Stress)\n- **Deep Analytics** (Hidden Gems, ABC Class)\n- **Strategy** (TikTok, Shopee tips)\n\nTry asking: *'Check Burn Rate'* or *'How to import?'*"
    },
    {
        keywords: ['thank', 'thx', 'good job'],
        response: "🙏 You're welcome! Keep pushing those sales number up! 🚀"
    },
    {
        keywords: ['who are you', 'bot'],
        response: "🤖 I am **Quantro Intelligence**, a specialized expert system for e-commerce operations. I don't just calculate numbers; I help you understand them."
    },
    {
        keywords: ['joke', 'funny'],
        response: "😄 Why did the dropshipper go broke?\n\nBecause he spent all his money on 'Winning Product' courses and $0 on Ads! (Don't be that guy, start testing!)"
    }
];

// Main Logic Function
export const getBotResponse = (message) => {
    const lowerMsg = message.toLowerCase();

    // 1. Direct Keyword Match (Iterate through knowledge base)
    for (const item of KNOWLEDGE_BASE) {
        // Check if ANY keyword matches
        if (item.keywords.some(k => lowerMsg.includes(k))) {
            return { text: item.response, action: item.action || null };
        }
    }

    // 2. Intelligent Context Fallback
    if (lowerMsg.includes('money') || lowerMsg.includes('cash') || lowerMsg.includes('dollar')) {
        return {
            text: "💰 **Financial Query Detected**\n\nCheck the **Finance Tab** for P&L statements. Or ask me about 'Net Profit' or 'Margins'.",
            action: { label: "Go to Finance", view: "finance" }
        };
    }
    if (lowerMsg.includes('slow') || lowerMsg.includes('fast')) {
        return {
            text: "⚡ **Performance**\n\nIf the dashboard is lagging, try clearing old data in 'Data Sources'. Large files (20k+ rows) can slow down the browser.",
            action: { label: "Clean Data", view: "datasources" }
        };
    }

    // 3. Ultimate Fallback
    return {
        text: "🤔 **I need more detail.**\n\nI detect you might need help. I know about Metrics, Strategies, and System Tools.\n\nTry asking: *'Open Decision Lab'*, *'Check Inventory'*, or *'How to scale ads?'*.",
        action: null
    };
};
