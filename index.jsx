import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Package, 
  BarChart3, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Video, 
  ShoppingBag, 
  Search, 
  Bell, 
  Upload,
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  Eye,
  MousePointer2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  X,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Layers
} from 'lucide-react';

export default function App() {
  // --- State Management ---
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'inventory'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [sortConfig, setSortConfig] = useState({ key: 'gmv', direction: 'desc' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Initial sample data
  const initialProducts = [
    {
      id: "1.7319588994789896e+18",
      name: "สโร่งผู้ชาย SARUNG BSH ผ้าฝ้าย 100%",
      status: "Active",
      gmv: 2774.00,
      itemsSold: 16,
      orders: 14,
      shopGmv: 1845.00,
      shopViews: 405,
      videoGmv: 1439.00,
      videoViews: 807,
      liveGmv: 0,
      liveViews: 0,
      ctr: "4.53%",
      cvr: "2.81%",
      abcCategory: 'A'
    },
    {
      id: "1.7301016435250655e+18",
      name: "ชุดมุสลิมผู้หญิงมีให้เลือกสี่แบบ",
      status: "Inactive",
      gmv: 0.00,
      itemsSold: 0,
      orders: 0,
      shopGmv: 0,
      shopViews: 339,
      videoGmv: 0,
      videoViews: 11,
      liveGmv: 0,
      liveViews: 0,
      ctr: "4.72%",
      cvr: "0.00%",
      abcCategory: 'C'
    },
    {
      id: "1.7300945131274596e+18",
      name: "หมวกถักมุสลิมมาใหม่ - Prayer Cap",
      status: "Active",
      gmv: 450.00,
      itemsSold: 5,
      orders: 3,
      shopGmv: 450.00,
      shopViews: 120,
      videoGmv: 0,
      videoViews: 0,
      liveGmv: 0,
      liveViews: 0,
      ctr: "2.10%",
      cvr: "1.50%",
      abcCategory: 'B'
    }
  ];

  const [products, setProducts] = useState(initialProducts);
  const fileInputRef = useRef(null);

  // --- Helpers & Data Science Utilities ---

  const parseCurrency = (str) => {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    // Remove currency symbol, commas, and quotes
    return parseFloat(str.replace(/[฿,"]/g, '')) || 0;
  };

  /**
   * Robust CSV Parser State Machine
   * Handles commas inside quotes correctly (e.g., "฿1,000")
   */
  const parseCSVLine = (text) => {
    const result = [];
    let cell = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }
    result.push(cell);
    return result;
  };

  // Perform ABC Analysis (Pareto Principle)
  // A: Top 80% of Revenue, B: Next 15%, C: Bottom 5%
  const calculateABC = (items) => {
    const sorted = [...items].sort((a, b) => b.gmv - a.gmv);
    const totalGMV = sorted.reduce((sum, item) => sum + item.gmv, 0);
    let accumulatedGMV = 0;

    return sorted.map(item => {
      accumulatedGMV += item.gmv;
      const percentage = accumulatedGMV / totalGMV;
      let category = 'C';
      if (percentage <= 0.8) category = 'A';
      else if (percentage <= 0.95) category = 'B';
      
      // If GMV is 0, strictly C
      if (item.gmv === 0) category = 'C';

      return { ...item, abcCategory: category };
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/); // Handle both \n and \r\n
        
        let headerIndex = -1;
        
        // Dynamic Header Detection
        for (let i = 0; i < Math.min(lines.length, 20); i++) {
          if (lines[i].includes('GMV') && lines[i].includes('Product')) {
            headerIndex = i;
            break;
          }
        }

        if (headerIndex === -1) {
          alert("Could not find valid headers (Product, GMV). Please check the file format.");
          return;
        }

        const newProducts = [];
        
        // Parse Data Rows
        for (let i = headerIndex + 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const row = parseCSVLine(lines[i]);
          
          // Basic validation: must have ID (0) and Product Name (1)
          if (!row[0] || !row[1]) continue;

          newProducts.push({
            id: row[0],
            name: row[1],
            status: row[2] || 'Unknown',
            gmv: parseCurrency(row[3]),
            itemsSold: parseInt(row[4]?.replace(/,/g, '')) || 0,
            orders: parseInt(row[5]?.replace(/,/g, '')) || 0,
            shopGmv: parseCurrency(row[6]),
            shopViews: parseInt(row[9]?.replace(/,/g, '')) || 0,
            // Mapping based on snippet provided in prompt
            // LIVE GMV is index 14, Impressions 16, Page Views 17
            liveGmv: parseCurrency(row[14]),
            liveViews: parseInt(row[17]?.replace(/,/g, '')) || 0, 
            // Video GMV is 22, Impressions 24, Page Views 25
            videoGmv: parseCurrency(row[22]),
            videoViews: parseInt(row[25]?.replace(/,/g, '')) || 0,
            ctr: row[12] || "0.00%",
            cvr: row[13] || "0.00%"
          });
        }
        
        // Apply Data Science Models
        const analyzedProducts = calculateABC(newProducts);
        
        setProducts(analyzedProducts);
        setActiveView('dashboard');
      } catch (err) {
        console.error("Parse Error:", err);
        alert("Error parsing CSV. See console for details.");
      }
    };
    reader.readAsText(file);
  };

  // --- Derived State (Calculations) ---

  const processedProducts = useMemo(() => {
    let data = [...products];

    // Status Filter
    if (statusFilter !== 'All') {
        data = data.filter(p => p.status === statusFilter);
    }

    // Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.id.includes(lowerTerm)
      );
    }

    // Sort
    data.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && aValue.includes('%')) {
        aValue = parseFloat(aValue.replace('%', ''));
        bValue = parseFloat(bValue.replace('%', ''));
      }
      
      // Custom sort for ABC to ensure A is top
      if (sortConfig.key === 'abcCategory') {
         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
         return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [products, searchTerm, sortConfig, statusFilter]);

  const summary = useMemo(() => {
    const totalGmv = products.reduce((sum, p) => sum + p.gmv, 0);
    const totalOrders = products.reduce((sum, p) => sum + p.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalGmv / totalOrders : 0;
    
    // Weighted Average CVR
    const activeItems = products.filter(p => parseInt(p.shopViews) > 0);
    const avgCvr = activeItems.length > 0 
      ? activeItems.reduce((sum, p) => sum + parseFloat(p.cvr.replace('%', '')), 0) / activeItems.length 
      : 0;

    return {
      totalGmv,
      totalOrders,
      avgOrderValue,
      conversionRate: avgCvr.toFixed(2) + '%'
    };
  }, [products]);

  const channelData = useMemo(() => {
    return products.reduce((acc, curr) => {
      acc.shop += curr.shopGmv || 0;
      acc.video += curr.videoGmv || 0;
      acc.live += curr.liveGmv || 0;
      return acc;
    }, { shop: 0, video: 0, live: 0 });
  }, [products]);

  const totalChannelGmv = channelData.shop + channelData.video + channelData.live || 1;
  const topProduct = products.reduce((prev, current) => (prev.gmv > current.gmv) ? prev : current, products[0] || {});

  // --- Smart Insights Logic (Advanced) ---
  const smartInsights = useMemo(() => {
    const insights = [];
    
    // 1. ABC Analysis Insight (Pareto)
    const classA = products.filter(p => p.abcCategory === 'A');
    if (classA.length > 0) {
        const percentCount = Math.round((classA.length / products.length) * 100);
        insights.push({
            type: 'strategic',
            title: 'Pareto Principle Alert',
            text: `Focus on your top ${percentCount}% of products (Class A) which are driving the majority of your revenue. Ensure these are always in stock.`,
            icon: PieChart,
            color: 'indigo'
        });
    }

    // 2. High View / Low Conversion Opportunity (Funnel Leak)
    const highViewLowCvr = products.find(p => {
        const views = p.shopViews + (p.videoViews || 0);
        const cvr = parseFloat(p.cvr);
        return views > 500 && cvr < 0.5 && p.gmv < 1000;
    });
    if (highViewLowCvr) {
        insights.push({
            type: 'opportunity',
            title: 'Funnel Leak Detected',
            text: `"${highViewLowCvr.name.substring(0, 20)}..." has high visibility but critically low conversion. Audit your price point and product description immediately.`,
            icon: AlertTriangle,
            color: 'rose'
        });
    }

    // 3. Hidden Gem (Low Views / High Conversion)
    const hiddenGem = products.find(p => {
        const views = p.shopViews + (p.videoViews || 0);
        const cvr = parseFloat(p.cvr);
        return views < 200 && cvr > 3.0 && p.gmv > 0;
    });
    if (hiddenGem) {
        insights.push({
            type: 'growth',
            title: 'Hidden Gem Found',
            text: `"${hiddenGem.name.substring(0, 20)}..." converts very well (${hiddenGem.cvr}) despite low traffic. Promote this item in your next Live session.`,
            icon: Lightbulb,
            color: 'teal'
        });
    }

    // Default
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            title: 'Steady Performance',
            text: 'Metrics are stable. Continue monitoring Class A products.',
            icon: CheckCircle2,
            color: 'green'
        });
    }

    return insights;
  }, [products]);


  // --- Handlers ---

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const getBadgeColor = (category) => {
    switch(category) {
        case 'A': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'B': return 'bg-blue-50 text-blue-600 border-blue-200';
        default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  // --- Components ---

  const Sidebar = () => (
    <div className="w-full md:w-64 bg-white/50 p-6 space-y-2 border-b md:border-b-0 md:border-r border-white/20 flex-shrink-0 flex flex-col">
      <div className="mb-8 flex items-center justify-between md:block">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-teal-600/20">S</div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">ShopPro</h1>
        </div>
        <button className="md:hidden p-2">
            <LayoutDashboard className="w-6 h-6 text-gray-600"/>
        </button>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto">
        <NavButton 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')} 
        />
        <NavButton 
          icon={Package} 
          label="Inventory" 
          active={activeView === 'inventory'} 
          onClick={() => setActiveView('inventory')} 
        />
        
        <div className="pt-4 pb-2 flex items-center gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">AI Insights</p>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        {smartInsights.slice(0, 3).map((insight, idx) => (
            <div key={idx} className={`mx-2 p-3 rounded-xl bg-${insight.color}-50 border border-${insight.color}-100 text-xs shadow-sm`}>
                <div className={`flex items-center gap-2 font-bold text-${insight.color}-700 mb-1`}>
                    <insight.icon className="w-3 h-3" /> {insight.title}
                </div>
                <p className={`text-${insight.color}-800 opacity-90 leading-relaxed`}>{insight.text}</p>
            </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50">
        <input 
            type="file" 
            accept=".csv,.txt" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden" 
        />
        <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-teal-100 text-teal-700 rounded-xl font-medium hover:bg-teal-50 hover:border-teal-200 transition-all text-sm shadow-sm group"
        >
            <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Import CSV
        </button>
        <p className="text-[10px] text-center text-gray-400 mt-2">Supports Data Export Format</p>
      </div>
    </div>
  );

  const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 
      ${active 
        ? 'bg-teal-600 text-white shadow-md shadow-teal-200 transform scale-[1.02]' 
        : 'text-gray-600 hover:bg-white/60 hover:text-teal-700'}`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
      {label}
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }) => (
    <div className={`bg-gradient-to-br ${colorClass} rounded-3xl p-5 shadow-sm border border-white/50 backdrop-blur-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
          <div>
              <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider opacity-70`}>{title}</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">{value}</p>
          </div>
          <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm">
              <Icon className="w-5 h-5 opacity-80" />
          </div>
      </div>
      {subText && (
        <div className="mt-3 text-xs font-medium opacity-80 flex items-center gap-1">
            {subText}
        </div>
      )}
    </div>
  );

  const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;
    
    const maxGmv = Math.max(product.shopGmv, product.videoGmv, product.liveGmv) || 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(product.abcCategory)}`}>
                                Class {product.abcCategory}
                            </span>
                             <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {product.status}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{product.id}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 leading-tight">{product.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                            <p className="text-xs text-teal-600 font-bold uppercase mb-1">Total Sales</p>
                            <p className="text-2xl font-bold text-teal-800">฿{product.gmv.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                            <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Items Sold</p>
                            <p className="text-2xl font-bold text-indigo-800">{product.itemsSold}</p>
                        </div>
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                            <p className="text-xs text-rose-600 font-bold uppercase mb-1">Conversion</p>
                            <p className="text-2xl font-bold text-rose-800">{product.cvr}</p>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Channel Performance Breakdown</h3>
                    
                    <div className="space-y-4">
                        {/* Shop */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600 font-medium"><ShoppingBag className="w-4 h-4" /> Shop Tab</span>
                                <span className="font-bold text-gray-800">฿{product.shopGmv.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{width: `${(product.shopGmv / maxGmv) * 100}%`}} className="h-full bg-teal-500 rounded-full"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 pl-6">
                                <span>{product.shopViews || 0} Views</span>
                                <span>{(product.shopGmv > 0 ? ((product.shopGmv / product.gmv) * 100).toFixed(0) : 0)}% of Total</span>
                            </div>
                        </div>

                         {/* Video */}
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600 font-medium"><Video className="w-4 h-4" /> Video</span>
                                <span className="font-bold text-gray-800">฿{product.videoGmv.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{width: `${(product.videoGmv / maxGmv) * 100}%`}} className="h-full bg-indigo-500 rounded-full"></div>
                            </div>
                             <div className="flex justify-between text-xs text-gray-400 pl-6">
                                <span>{product.videoViews || 0} Views</span>
                                <span>{(product.videoGmv > 0 ? ((product.videoGmv / product.gmv) * 100).toFixed(0) : 0)}% of Total</span>
                            </div>
                        </div>

                         {/* Live */}
                         <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 text-gray-600 font-medium"><Eye className="w-4 h-4" /> Live Stream</span>
                                <span className="font-bold text-gray-800">฿{product.liveGmv.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div style={{width: `${(product.liveGmv / maxGmv) * 100}%`}} className="h-full bg-rose-500 rounded-full"></div>
                            </div>
                             <div className="flex justify-between text-xs text-gray-400 pl-6">
                                <span>{product.liveViews || 0} Views</span>
                                <span>{(product.liveGmv > 0 ? ((product.liveGmv / product.gmv) * 100).toFixed(0) : 0)}% of Total</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
  };

  // --- Views ---

  const DashboardView = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Product */}
        <div 
            onClick={() => topProduct.gmv && setSelectedProduct(topProduct)}
            className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Top Performer</h3>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
          </div>
          
          {topProduct && topProduct.gmv > 0 ? (
              <>
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden relative">
                         <div className="absolute top-0 right-0 bg-yellow-400 text-[8px] font-bold px-1 rounded-bl">#{topProduct.abcCategory}</div>
                        <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 line-clamp-2 leading-tight">{topProduct.name}</h4>
                        <div className="flex gap-2 mt-2">
                            <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                                ฿{topProduct.gmv.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                {topProduct.id.substring(0, 10)}...
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/50">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Views</p>
                        <p className="font-bold text-gray-800">
                            {(topProduct.shopViews + (topProduct.videoViews || 0) + (topProduct.liveViews || 0)).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/50">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">Sold</p>
                        <p className="font-bold text-gray-800">{topProduct.itemsSold}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-2xl border border-white/50">
                        <p className="text-[10px] text-gray-500 mb-1 uppercase font-bold">CTR</p>
                        <p className="font-bold text-gray-800">{topProduct.ctr}</p>
                    </div>
                </div>
              </>
          ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                <Package className="w-12 h-12 mb-2 opacity-20" />
                <p>No sales data available</p>
              </div>
          )}
        </div>

        {/* Channel Statistics */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">GMV Source</h3>
            <div className="flex gap-1 text-xs">
                 <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-md font-bold">Shop</span>
                 <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-bold">Video</span>
                 <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md font-bold">Live</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-1 h-8 rounded-xl overflow-hidden bg-gray-100 p-1 border border-white/60">
                     <div 
                        style={{ width: `${(channelData.shop / totalChannelGmv) * 100}%` }} 
                        className="h-full rounded-lg bg-teal-500 shadow-sm relative group cursor-help"
                        title={`Shop: ฿${channelData.shop.toLocaleString()}`}
                     ></div>
                     <div 
                        style={{ width: `${(channelData.video / totalChannelGmv) * 100}%` }} 
                        className="h-full rounded-lg bg-indigo-500 shadow-sm relative group cursor-help"
                        title={`Video: ฿${channelData.video.toLocaleString()}`}
                     ></div>
                     <div 
                        style={{ width: `${(channelData.live / totalChannelGmv) * 100}%` }} 
                        className="h-full rounded-lg bg-rose-500 shadow-sm relative group cursor-help"
                        title={`Live: ฿${channelData.live.toLocaleString()}`}
                     ></div>
            </div>

            <div className="grid grid-cols-3 gap-2 divide-x divide-gray-200/60">
              <div className="px-2 text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Shop Tab</p>
                <p className="text-lg font-bold text-teal-600">฿{channelData.shop.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{(channelData.shop / totalChannelGmv * 100).toFixed(1)}%</p>
              </div>
              <div className="px-2 text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Video</p>
                <p className="text-lg font-bold text-indigo-600">฿{channelData.video.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{(channelData.video / totalChannelGmv * 100).toFixed(1)}%</p>
              </div>
              <div className="px-2 text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Live</p>
                <p className="text-lg font-bold text-rose-600">฿{channelData.live.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400">{(channelData.live / totalChannelGmv * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List Snippet */}
        <div className="col-span-1 lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Inventory Snapshot</h3>
            <button 
                onClick={() => setActiveView('inventory')}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
            >
                View full list <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200/60">
                    <th className="text-left py-3 px-2">Product</th>
                    <th className="text-center py-3 px-2">Class</th>
                    <th className="text-right py-3 px-2">GMV</th>
                    <th className="text-center py-3 px-2">Sold</th>
                    <th className="text-center py-3 px-2">Status</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 font-medium">
                {processedProducts.slice(0, 5).map((item, idx) => (
                    <tr 
                        key={idx} 
                        onClick={() => setSelectedProduct(item)}
                        className="hover:bg-white/40 transition-colors border-b border-gray-100 last:border-0 group cursor-pointer"
                    >
                        <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center text-xs text-gray-400">IMG</div>
                                <div className="max-w-[200px] truncate font-medium text-gray-800 group-hover:text-teal-700 transition-colors" title={item.name}>{item.name}</div>
                            </div>
                        </td>
                         <td className="py-3 px-2 text-center">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(item.abcCategory)}`}>
                                {item.abcCategory}
                            </span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-teal-700 font-bold">฿{item.gmv.toLocaleString()}</td>
                        <td className="py-3 px-2 text-center text-gray-600">{item.itemsSold}</td>
                        <td className="py-3 px-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="space-y-4">
          <StatCard 
            title="Total GMV" 
            value={`฿${summary.totalGmv.toLocaleString()}`} 
            icon={DollarSign}
            colorClass="from-purple-100 to-purple-50 text-purple-600"
          />
          <StatCard 
            title="Avg Order Value" 
            value={`฿${summary.avgOrderValue.toFixed(2)}`} 
            icon={ShoppingBag}
            colorClass="from-pink-100 to-pink-50 text-pink-600"
          />
          <StatCard 
            title="Conversion Rate" 
            value={summary.conversionRate} 
            icon={MousePointer2}
            colorClass="from-teal-100 to-teal-50 text-teal-600"
          />
        </div>
      </div>
    </>
  );

  const InventoryView = () => (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
            <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                Product Inventory
            </h3>
            <p className="text-sm text-gray-500 mt-1">{processedProducts.length} items found</p>
        </div>
        
        <div className="flex gap-2">
            {/* Status Filter Dropdown */}
            <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                    {statusFilter}
                    <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                </button>
                <div className="absolute top-full mt-2 right-0 w-32 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block z-20 py-1">
                    {['All', 'Active', 'Inactive'].map(s => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-700 ${statusFilter === s ? 'text-teal-700 font-bold bg-teal-50/50' : 'text-gray-600'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search ID or Name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-64"
                />
            </div>
        </div>
      </div>

      <div className="overflow-auto flex-1 -mx-6 px-6">
        <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10">
            <tr className="text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="text-left py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">Product {getSortIcon('name')}</div>
                </th>
                <th className="text-center py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('abcCategory')}>
                    <div className="flex items-center justify-center gap-1">Class {getSortIcon('abcCategory')}</div>
                </th>
                <th className="text-center py-4 px-2">Status</th>
                <th className="text-right py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('gmv')}>
                    <div className="flex items-center justify-end gap-1">GMV {getSortIcon('gmv')}</div>
                </th>
                <th className="text-center py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('orders')}>
                    <div className="flex items-center justify-center gap-1">Orders {getSortIcon('orders')}</div>
                </th>
                <th className="text-right py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('shopGmv')}>
                    <div className="flex items-center justify-end gap-1">Shop {getSortIcon('shopGmv')}</div>
                </th>
                <th className="text-right py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('videoGmv')}>
                    <div className="flex items-center justify-end gap-1">Video {getSortIcon('videoGmv')}</div>
                </th>
                <th className="text-center py-4 px-2 cursor-pointer hover:text-teal-600" onClick={() => handleSort('ctr')}>
                    <div className="flex items-center justify-center gap-1">CTR {getSortIcon('ctr')}</div>
                </th>
            </tr>
            </thead>
            <tbody className="text-gray-700 font-medium divide-y divide-gray-100">
            {processedProducts.map((item, idx) => (
                <tr 
                    key={idx} 
                    onClick={() => setSelectedProduct(item)}
                    className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                >
                    <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-200 group-hover:border-teal-200 transition-colors"></div>
                            <div>
                                <div className="max-w-[220px] lg:max-w-[300px] truncate font-semibold text-gray-800 group-hover:text-teal-700 transition-colors" title={item.name}>{item.name}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{item.id}</div>
                            </div>
                        </div>
                    </td>
                     <td className="py-3 px-2 text-center">
                         <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getBadgeColor(item.abcCategory)}`}>
                            {item.abcCategory}
                        </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            {item.status}
                        </span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-teal-700 font-bold">฿{item.gmv.toLocaleString()}</td>
                    <td className="py-3 px-2 text-center">{item.orders}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600">฿{item.shopGmv.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-mono text-gray-600">฿{item.videoGmv.toLocaleString()}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{item.ctr}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden h-full flex flex-col md:flex-row border border-white/40">
            <Sidebar />

            <div className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-0 z-20 bg-gradient-to-b from-white/0 via-white/0 to-transparent pb-4">
                <div>
                  <p className="text-teal-600 font-bold text-sm mb-1 tracking-wide uppercase opacity-80">
                    {activeView === 'dashboard' ? 'Overview' : 'Management'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
                    {activeView === 'dashboard' ? 'Shop Analytics' : 'Product Inventory'}
                  </h2>
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="flex items-center gap-3 pl-4 border-l-2 border-white/50">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm ring-2 ring-indigo-50">
                        S
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="font-bold text-gray-700 text-sm">Shop Manager</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: 883921</p>
                    </div>
                  </div>
                </div>
              </div>

              {activeView === 'dashboard' ? <DashboardView /> : <InventoryView />}
            </div>
        </div>
      </div>
      
      {/* Detail Modal */}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}