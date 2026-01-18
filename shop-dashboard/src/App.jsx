import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Package, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Video, 
  ShoppingBag, 
  Search, 
  Upload,
  LayoutDashboard,
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
  Settings,
  Download,
  Save,
  Trash2,
  FileText,
  Printer,
  FileSpreadsheet,
  Database,
  Clock,
  Smartphone
} from 'lucide-react';

// --- Global Helper Functions ---

const parseCurrency = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  return parseFloat(val.toString().replace(/[^0-9.-]+/g, '')) || 0;
};

const formatCurrency = (amount, currencySymbol = '฿') => {
  const val = typeof amount === 'number' ? amount : 0;
  return `${currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getBadgeColor = (category) => {
  switch(category) {
      case 'A': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'B': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

// --- Sub-Components ---

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

const ProductDetailModal = ({ product, onClose, currency }) => {
  if (!product) return null;
  const maxGmv = Math.max(product.shopGmv, product.videoGmv, product.liveGmv) || 1;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50 flex-shrink-0">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(product.abcCategory)}`}>
                              Class {product.abcCategory}
                          </span>
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {product.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                              <Database className="w-3 h-3" /> {product.id}
                          </span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 leading-tight mb-2">{product.name}</h2>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm"><Smartphone className="w-3 h-3 text-teal-600" /> Platform: <strong>{product.platform}</strong></span>
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm"><FileText className="w-3 h-3 text-indigo-600" /> Source: {product.sourceFile}</span>
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm"><Clock className="w-3 h-3 text-orange-600" /> Import: {new Date(product.importDate || Date.now()).toLocaleDateString()}</span>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                  </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                          <p className="text-xs text-teal-600 font-bold uppercase mb-1">Total Sales</p>
                          <p className="text-xl md:text-2xl font-bold text-teal-800">{formatCurrency(product.gmv, currency)}</p>
                      </div>
                      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                          <p className="text-xs text-indigo-600 font-bold uppercase mb-1">Items Sold</p>
                          <p className="text-xl md:text-2xl font-bold text-indigo-800">{product.itemsSold}</p>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                          <p className="text-xs text-rose-600 font-bold uppercase mb-1">Conversion</p>
                          <p className="text-xl md:text-2xl font-bold text-rose-800">{product.cvr}</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                          <p className="text-xs text-amber-600 font-bold uppercase mb-1">Orders</p>
                          <p className="text-xl md:text-2xl font-bold text-amber-800">{product.orders}</p>
                      </div>
                  </div>

                  {/* Deep Dive Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* 1. GMV Source Breakdown */}
                      <div>
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> GMV Source Analysis
                          </h3>
                          <div className="space-y-4">
                              {[
                              { name: 'Shop Tab', gmv: product.shopGmv, views: product.shopViews, icon: ShoppingBag, color: 'teal' },
                              { name: 'Video Content', gmv: product.videoGmv, views: product.videoViews, icon: Video, color: 'indigo' },
                              { name: 'Live Stream', gmv: product.liveGmv, views: product.liveViews, icon: Eye, color: 'rose' },
                              ].map((channel, i) => (
                              <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="flex items-center gap-2 text-gray-700 font-bold"><channel.icon className={`w-4 h-4 text-${channel.color}-600`} /> {channel.name}</span>
                                      <span className="font-bold text-gray-900">{formatCurrency(channel.gmv, currency)}</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                                      <div style={{width: `${(channel.gmv / (maxGmv || 1)) * 100}%`}} className={`h-full bg-${channel.color}-500 rounded-full`}></div>
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500">
                                      <span>Contribution: <strong>{(channel.gmv > 0 ? ((channel.gmv / (product.gmv || 1)) * 100).toFixed(1) : 0)}%</strong></span>
                                  </div>
                              </div>
                              ))}
                          </div>
                      </div>

                      {/* 2. Traffic & Conversion Funnel */}
                      <div>
                          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                              <MousePointer2 className="w-4 h-4" /> Traffic & Conversion
                          </h3>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-6">
                              {/* Views */}
                              <div className="relative pl-8 border-l-2 border-gray-200 pb-6">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Views</p>
                                  <p className="text-lg font-bold text-gray-800">
                                      {(product.shopViews + (product.videoViews || 0) + (product.liveViews || 0)).toLocaleString()}
                                  </p>
                              </div>
                              {/* Clicks (Estimated from CTR if available) */}
                              <div className="relative pl-8 border-l-2 border-gray-200 pb-6">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-300 border-2 border-white"></div>
                                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">CTR (Click Through)</p>
                                  <p className="text-lg font-bold text-blue-600">{product.ctr}</p>
                              </div>
                              {/* Conversion */}
                              <div className="relative pl-8 border-l-2 border-teal-500">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white shadow-sm"></div>
                                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Final Conversion</p>
                                  <p className="text-xl font-bold text-teal-600">{product.cvr}</p>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
                  <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Close Details
                  </button>
              </div>
          </div>
      </div>
  );
};

const Sidebar = ({ activeView, setActiveView, smartInsights, fileInputRef, handleFileUpload }) => (
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
      <NavButton 
        icon={FileText} 
        label="Reports" 
        active={activeView === 'reports'} 
        onClick={() => setActiveView('reports')} 
      />
      <NavButton 
        icon={Settings} 
        label="Configuration" 
        active={activeView === 'settings'} 
        onClick={() => setActiveView('settings')} 
      />
      
      <div className="pt-4 pb-2 flex items-center gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">AI Insights</p>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
      </div>
      {smartInsights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
          <div key={idx} className={`mx-2 p-3 rounded-xl bg-${insight.color}-50 border border-${insight.color}-100 text-xs shadow-sm transition-all hover:scale-[1.02]`}>
              <div className={`flex items-center gap-2 font-bold text-${insight.color}-700 mb-1`}>
                  <Icon className="w-3 h-3" /> {insight.title}
              </div>
              <p className={`text-${insight.color}-800 opacity-90 leading-relaxed`}>{insight.text}</p>
          </div>
          );
      })}
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200/50">
      <input 
          type="file" 
          accept=".csv,.xlsx,.xls" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden" 
      />
      <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-teal-100 text-teal-700 rounded-xl font-medium hover:bg-teal-50 hover:border-teal-200 transition-all text-sm shadow-sm group"
      >
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <div className="flex flex-col items-start">
             <span>Import Data</span>
             <span className="text-[10px] text-gray-400 font-normal">Supports XLSX, CSV</span>
          </div>
      </button>
    </div>
  </div>
);

const DashboardView = ({ topProduct, setSelectedProduct, currency, channelData, totalChannelGmv, summary, timePeriod, setTimePeriod, platformFilter, setPlatformFilter, availablePlatforms }) => (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-2">
       <div className="flex bg-white/50 p-1 rounded-xl border border-white/60 shadow-sm">
          {['All Time', 'Last Import'].map(period => (
              <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${timePeriod === period ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  {period}
              </button>
          ))}
       </div>

       <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-white/50 border-none text-sm font-semibold text-gray-700 focus:ring-0 cursor-pointer hover:bg-white/80 rounded-lg px-2 py-1 transition-colors"
          >
              {availablePlatforms.map(p => <option key={p} value={p}>{p} Platform</option>)}
          </select>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4">
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
                      <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                              {formatCurrency(topProduct.gmv, currency)}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                              {topProduct.platform}
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
                      style={{ width: `${(channelData.shop / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded-lg bg-teal-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Shop: ${formatCurrency(channelData.shop, currency)}`}
                   ></div>
                   <div 
                      style={{ width: `${(channelData.video / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded-lg bg-indigo-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Video: ${formatCurrency(channelData.video, currency)}`}
                   ></div>
                   <div 
                      style={{ width: `${(channelData.live / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded-lg bg-rose-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Live: ${formatCurrency(channelData.live, currency)}`}
                   ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 divide-x divide-gray-200/60">
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Shop Tab</p>
              <p className="text-lg font-bold text-teal-600">{formatCurrency(channelData.shop, currency)}</p>
              <p className="text-[10px] text-gray-400">{(channelData.shop / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Video</p>
              <p className="text-lg font-bold text-indigo-600">{formatCurrency(channelData.video, currency)}</p>
              <p className="text-[10px] text-gray-400">{(channelData.video / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Live</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(channelData.live, currency)}</p>
              <p className="text-[10px] text-gray-400">{(channelData.live / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
      {/* Product List Snippet */}
      <div className="col-span-1 lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Inventory Snapshot</h3>
          <button 
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
              {channelData && Object.keys(channelData).length > 0 && topProduct && topProduct.gmv ? (
                  <tr 
                      onClick={() => setSelectedProduct(topProduct)}
                      className="hover:bg-white/40 transition-colors border-b border-gray-100 last:border-0 group cursor-pointer"
                  >
                      <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center text-xs text-gray-400">IMG</div>
                              <div className="max-w-[200px] truncate font-medium text-gray-800 group-hover:text-teal-700 transition-colors" title={topProduct.name}>{topProduct.name}</div>
                          </div>
                      </td>
                       <td className="py-3 px-2 text-center">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(topProduct.abcCategory)}`}>
                              {topProduct.abcCategory}
                          </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-teal-700 font-bold">{formatCurrency(topProduct.gmv, currency)}</td>
                      <td className="py-3 px-2 text-center text-gray-600">{topProduct.itemsSold}</td>
                      <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${topProduct.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                              {topProduct.status}
                          </span>
                      </td>
                  </tr>
              ) : (
                <tr><td colSpan="5" className="text-center p-4">No Data</td></tr>
              )}
              </tbody>
          </table>
        </div>
      </div>

      {/* Right Side Cards */}
      <div className="space-y-4">
        <StatCard 
          title="Total GMV" 
          value={formatCurrency(summary.totalGmv, currency)} 
          icon={DollarSign}
          colorClass="from-purple-100 to-purple-50 text-purple-600"
        />
        <StatCard 
          title="Avg Order Value" 
          value={formatCurrency(summary.avgOrderValue, currency)} 
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

const InventoryView = ({ processedProducts, handleExportCSV, statusFilter, setStatusFilter, searchTerm, setSearchTerm, handleSort, getSortIcon, setSelectedProduct, currency }) => (
  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
          <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-teal-600" />
              Product Inventory
          </h3>
          <p className="text-sm text-gray-500 mt-1">{processedProducts.length} items found</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

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
                  <td className="py-3 px-2 text-right font-mono text-teal-700 font-bold">{formatCurrency(item.gmv, currency)}</td>
                  <td className="py-3 px-2 text-center">{item.orders}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600">{formatCurrency(item.shopGmv, currency)}</td>
                  <td className="py-3 px-2 text-right font-mono text-gray-600">{formatCurrency(item.videoGmv, currency)}</td>
                  <td className="py-3 px-2 text-center text-gray-500">{item.ctr}</td>
              </tr>
          ))}
          </tbody>
      </table>
    </div>
  </div>
);

const ReportView = ({ settings, summary, smartInsights, channelData, currency, processedProducts, setActiveView }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-auto animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-4xl mx-auto p-8 md:p-12 pb-24" id="printable-report">
        {/* Report Header */}
        <div className="flex justify-between items-end border-b-2 border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Executive Performance Report</h1>
            <p className="text-gray-500 font-medium">Prepared for: <span className="text-gray-900">{typeof settings.userName === 'string' ? settings.userName : 'Manager'}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Generated On</p>
            <p className="text-lg font-semibold text-gray-800">{dateStr}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-6 border-l-4 border-teal-500 pl-3">Executive Summary</h2>
          <div className="grid grid-cols-4 gap-6">
             <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Total Revenue</p>
                <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(summary.totalGmv, currency)}</p>
             </div>
             <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Total Orders</p>
                <p className="text-3xl font-extrabold text-gray-900">{summary.totalOrders}</p>
             </div>
             <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Avg Order Value</p>
                <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(summary.avgOrderValue, currency)}</p>
             </div>
             <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Conversion Rate</p>
                <p className="text-3xl font-extrabold text-gray-900">{summary.conversionRate}</p>
             </div>
          </div>
        </section>

        {/* AI Strategic Analysis */}
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-6 border-l-4 border-indigo-500 pl-3">Strategic Analysis (AI)</h2>
          <div className="space-y-4">
            {smartInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
              <div key={idx} className="flex gap-4 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                 <div className={`p-3 rounded-full h-fit bg-${insight.color}-100 text-${insight.color}-700`}>
                    <Icon className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 text-lg">{insight.title}</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">{insight.text}</p>
                 </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Channel Breakdown */}
        <section className="mb-10 break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-6 border-l-4 border-rose-500 pl-3">Channel Performance</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
              <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                  <th className="p-4 font-bold tracking-wider">Channel</th>
                  <th className="p-4 font-bold text-right tracking-wider">Revenue</th>
                  <th className="p-4 font-bold text-right tracking-wider">Contribution</th>
                  </tr>
              </thead>
              <tbody>
                  {[
                      { name: 'Shop Tab', val: channelData.shop, icon: ShoppingBag },
                      { name: 'Video Content', val: channelData.video, icon: Video },
                      { name: 'Live Streaming', val: channelData.live, icon: Eye }
                  ].map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                          <c.icon className="w-4 h-4 text-gray-400" />
                          {c.name}
                      </td>
                      <td className="p-4 text-right font-mono text-gray-600 font-medium">{formatCurrency(c.val, currency)}</td>
                      <td className="p-4 text-right text-gray-500 font-medium">{(c.val / (summary.totalGmv || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
        </section>

        {/* Top Products Table */}
        <section className="break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-6 border-l-4 border-amber-500 pl-3">Key Inventory Drivers (Class A)</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
              <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                  <th className="p-4 font-bold tracking-wider">Product Name</th>
                  <th className="p-4 font-bold text-right tracking-wider">GMV</th>
                  <th className="p-4 font-bold text-center tracking-wider">Sold</th>
                  <th className="p-4 font-bold text-center tracking-wider">Status</th>
                  </tr>
              </thead>
              <tbody>
                  {processedProducts.filter(p => p.abcCategory === 'A').slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="p-4 font-medium text-gray-800 truncate max-w-[300px]">{p.name}</td>
                      <td className="p-4 text-right font-mono text-gray-600 font-medium">{formatCurrency(p.gmv, currency)}</td>
                      <td className="p-4 text-center text-gray-600">{p.itemsSold}</td>
                      <td className="p-4 text-center"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{p.status}</span></td>
                  </tr>
                  ))}
                  {processedProducts.filter(p => p.abcCategory === 'A').length === 0 && (
                      <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-400 italic">No Class A products found in current filter.</td>
                      </tr>
                  )}
              </tbody>
              </table>
          </div>
        </section>
        
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
           <p className="text-gray-400 text-sm font-medium">Generated by ShopPro Analytics System • End of Report</p>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 flex gap-4 print:hidden z-50">
        <button 
          onClick={() => setActiveView('dashboard')}
          className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-colors"
        >
          Close View
        </button>
        <button 
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold shadow-xl hover:bg-black transition-transform hover:-translate-y-1 flex items-center gap-3"
        >
          <Printer className="w-5 h-5" /> Print / Save PDF
        </button>
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            padding: 2cm;
            margin: 0;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const SettingsView = ({ settings, setSettings, uploadedFiles, clearData, addNotification }) => (
  <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/50 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
     <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-teal-100 rounded-xl">
           <Settings className="w-6 h-6 text-teal-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">System Configuration</h2>
          <p className="text-sm text-gray-500">Customize how ShopPro analyzes your data</p>
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">General Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              type="text" 
              value={settings.userName}
              onChange={(e) => setSettings({...settings, userName: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
            <div className="flex gap-2">
              {['฿', '$', '€', '£', '¥'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setSettings({...settings, currency: curr})}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${settings.currency === curr ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Data Management</h3>
             
             {/* Data Sources List */}
             <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Loaded Data Sources</label>
                 {uploadedFiles.length === 0 ? (
                     <div className="text-sm text-gray-400 italic p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                         No files uploaded yet
                     </div>
                 ) : (
                     <div className="space-y-2">
                         {uploadedFiles.map((file, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2">
                                     <Database className="w-4 h-4 text-teal-600" />
                                     <span className="text-sm text-gray-700 font-medium">{file}</span>
                                 </div>
                                 <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">Active</span>
                             </div>
                         ))}
                     </div>
                 )}
             </div>

             <button 
                onClick={clearData}
                className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-white hover:bg-rose-600 font-medium text-sm px-4 py-3 border border-rose-200 rounded-xl transition-colors"
             >
                <Trash2 className="w-4 h-4" /> Clear All Data Sources
             </button>
          </div>
        </div>

        {/* AI Thresholds */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
             <Lightbulb className="w-4 h-4" /> Smart Assistant Thresholds
          </h3>
          
          <div className="bg-white/50 p-4 rounded-2xl border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 High Traffic Threshold (Views)
                 <span className="text-xs text-gray-400 font-normal ml-2">Defines "Funnel Leak"</span>
              </label>
              <input 
                type="number" 
                value={settings.highViewThreshold}
                onChange={(e) => setSettings({...settings, highViewThreshold: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 Low Conversion Alert (%)
                 <span className="text-xs text-gray-400 font-normal ml-2">Alert if CVR falls below this</span>
              </label>
              <input 
                type="number" 
                step="0.1"
                value={settings.lowCvrThreshold}
                onChange={(e) => setSettings({...settings, lowCvrThreshold: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 Hidden Gem CVR (%)
                 <span className="text-xs text-gray-400 font-normal ml-2">Target CVR for opportunities</span>
              </label>
              <input 
                type="number" 
                step="0.1"
                value={settings.hiddenGemCvr}
                onChange={(e) => setSettings({...settings, hiddenGemCvr: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 Dead Stock Threshold (Sales)
                 <span className="text-xs text-gray-400 font-normal ml-2">Items sold less than this</span>
              </label>
              <input 
                type="number" 
                value={settings.deadStockThreshold}
                onChange={(e) => setSettings({...settings, deadStockThreshold: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
             <button 
                onClick={() => addNotification("Settings saved successfully")}
                className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-teal-700 transition-transform active:scale-95"
             >
                <Save className="w-4 h-4" /> Save Changes
             </button>
          </div>
        </div>
     </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [platformFilter, setPlatformFilter] = useState('All'); 
  const [sortConfig, setSortConfig] = useState({ key: 'gmv', direction: 'desc' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isExcelReady, setIsExcelReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [timePeriod, setTimePeriod] = useState('All Time'); 

  // Smart Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('shopProSettings');
      return saved ? JSON.parse(saved) : {
        currency: '฿',
        highViewThreshold: 500,
        lowCvrThreshold: 0.5,
        hiddenGemCvr: 3.0,
        deadStockThreshold: 0,
        userName: 'Shop Manager'
      };
    } catch (e) {
      return {
        currency: '฿',
        highViewThreshold: 500,
        lowCvrThreshold: 0.5,
        hiddenGemCvr: 3.0,
        deadStockThreshold: 0,
        userName: 'Shop Manager'
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('shopProSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (window.XLSX) {
      setIsExcelReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => setIsExcelReady(true);
    document.body.appendChild(script);
  }, []);

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
      abcCategory: 'A',
      platform: 'TikTok',
      sourceFile: 'Sample Data',
      importDate: new Date().toISOString()
    }
  ];

  const [products, setProducts] = useState(initialProducts);
  const fileInputRef = useRef(null);

  // --- Helpers that need state access ---

  const addNotification = (msg, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const calculateABC = (items) => {
    const sorted = [...items].sort((a, b) => b.gmv - a.gmv);
    const totalGMV = sorted.reduce((sum, item) => sum + item.gmv, 0);
    let accumulatedGMV = 0;

    return sorted.map(item => {
      accumulatedGMV += item.gmv;
      const percentage = accumulatedGMV / (totalGMV || 1);
      let category = 'C';
      if (percentage <= 0.8) category = 'A';
      else if (percentage <= 0.95) category = 'B';
      if (item.gmv === 0) category = 'C';
      return { ...item, abcCategory: category };
    });
  };

  // --- Import Logic ---

  const normalizeData = (jsonData, filename) => {
    if (!jsonData || jsonData.length === 0) return [];

    const headers = Object.keys(jsonData[0]).map(h => h.toLowerCase());
    let detectedPlatform = 'Unknown';
    
    if (headers.some(h => h.includes('tiktok') || h.includes('shop tab gmv'))) detectedPlatform = 'TikTok';
    else if (headers.some(h => h.includes('lazada') || h.includes('seller sku'))) detectedPlatform = 'Lazada';
    else if (headers.some(h => h.includes('shopee') || h.includes('variation id'))) detectedPlatform = 'Shopee';

    addNotification(`Detected Platform: ${detectedPlatform}`);

    const findVal = (row, keywords) => {
      const key = Object.keys(row).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
      return key ? row[key] : null;
    };

    return jsonData.map((row, index) => {
      const id = findVal(row, ['product id', 'item id', 'id', 'sku']) || `gen-${index}`;
      const name = findVal(row, ['product name', 'item name', 'product']) || 'Unknown Product';
      const status = findVal(row, ['status', 'product status']) || 'Active';

      const gmv = parseCurrency(findVal(row, ['gmv', 'revenue', 'total sales', 'sales', 'amount']));
      const sold = parseCurrency(findVal(row, ['items sold', 'units sold', 'sold', 'quantity']));
      const orders = parseCurrency(findVal(row, ['orders', 'total orders']));
      const views = parseCurrency(findVal(row, ['views', 'page view', 'impressions']));
      
      const shopGmv = parseCurrency(findVal(row, ['shop tab gmv', 'mall sales']));
      const videoGmv = parseCurrency(findVal(row, ['video gmv', 'content sales']));
      const liveGmv = parseCurrency(findVal(row, ['live gmv', 'livestream sales']));

      let ctr = findVal(row, ['click-through', 'ctr']);
      let cvr = findVal(row, ['conversion rate', 'cvr']);
      
      if (typeof cvr === 'number') cvr = (cvr * 100).toFixed(2) + '%';
      if (!cvr) cvr = "0.00%";
      if (!ctr) ctr = "0.00%";
      if (typeof ctr === 'number') ctr = (ctr * 100).toFixed(2) + '%';
      
      return {
        id: String(id),
        name: String(name),
        status: String(status),
        gmv,
        itemsSold: sold,
        orders: orders || sold, 
        shopGmv: shopGmv || gmv, 
        shopViews: views,
        videoGmv,
        videoViews: 0,
        liveGmv,
        liveViews: 0,
        ctr: String(ctr),
        cvr: String(cvr),
        platform: detectedPlatform,
        sourceFile: filename,
        importDate: new Date().toISOString()
      };
    }).filter(p => p.name !== 'Unknown Product' && p.gmv >= 0); 
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadedFiles.includes(file.name)) {
        if(!window.confirm(`File "${file.name}" has already been uploaded. Do you want to process it again (it will overwrite duplicates)?`)) {
            return;
        }
    }

    if (!isExcelReady) {
      addNotification("Excel engine loading... please try again in 3 seconds.", "error");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const rawRows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
        
        let headerRowIndex = -1;
        let headers = [];

        for(let i = 0; i < Math.min(25, rawRows.length); i++) {
           const rowStr = rawRows[i].map(cell => String(cell).toLowerCase().trim()).join(' ');
           if (rowStr.includes('product') && (rowStr.includes('gmv') || rowStr.includes('sales') || rowStr.includes('sku') || rowStr.includes('status'))) {
               headerRowIndex = i;
               headers = rawRows[i].map(h => String(h)); 
               break;
           }
        }

        if (headerRowIndex === -1) {
             throw new Error("Could not find valid headers (Product, GMV). Please check the file structure.");
        }

        const dataRows = rawRows.slice(headerRowIndex + 1);
        const jsonData = dataRows.map(row => {
            let obj = {};
            headers.forEach((h, index) => {
                obj[h] = row[index];
            });
            return obj;
        });

        if (jsonData.length === 0) throw new Error("No data found after header row.");

        const normalized = normalizeData(jsonData, file.name);
        if (normalized.length === 0) throw new Error("Data normalization failed.");

        setProducts(prevProducts => {
            const productMap = new Map();
            prevProducts.forEach(p => productMap.set(p.id, p));
            normalized.forEach(p => productMap.set(p.id, p));
            const merged = Array.from(productMap.values());
            return calculateABC(merged);
        });

        setUploadedFiles(prev => [...new Set([...prev, file.name])]);
        setActiveView('dashboard');
        addNotification(`Imported ${normalized.length} products from ${file.name}`);
        
      } catch (err) {
        console.error(err);
        addNotification(`Import failed: ${err.message}`, "error");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportCSV = () => {
    const headers = [
      'Product ID', 'Name', 'Platform', 'Source File', 'Status', 'Class', 'GMV', 'Orders', 'Sold', 
      'Shop GMV', 'Shop Views', 'Video GMV', 'Video Views', 'Live GMV', 'Live Views', 'CTR', 'CVR'
    ];

    const csvContent = [
      headers.join(','),
      ...processedProducts.map(p => [
        `"${p.id}"`, `"${p.name.replace(/"/g, '""')}"`, p.platform, `"${p.sourceFile || ''}"`, p.status, p.abcCategory,
        p.gmv, p.orders, p.itemsSold,
        p.shopGmv, p.shopViews,
        p.videoGmv, p.videoViews,
        p.liveGmv, p.liveViews,
        `"${p.ctr}"`, `"${p.cvr}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `shop_analytics_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("CSV Export started");
  };

  const clearData = () => {
      if(window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
          setProducts([]);
          setUploadedFiles([]);
          addNotification("All data cleared");
      }
  };

  // --- Derived State ---

  const processedProducts = useMemo(() => {
    let data = [...products];
    if (statusFilter !== 'All') data = data.filter(p => p.status === statusFilter);
    if (platformFilter !== 'All') data = data.filter(p => p.platform === platformFilter);
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(lowerTerm) || p.id.includes(lowerTerm));
    }
    
    data.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (typeof aValue === 'string' && aValue.includes('%')) {
        aValue = parseFloat(aValue.replace('%', ''));
        bValue = parseFloat(bValue.replace('%', ''));
      }
      if (sortConfig.key === 'abcCategory') {
         const order = { 'A': 3, 'B': 2, 'C': 1 };
         aValue = order[a.abcCategory] || 0;
         bValue = order[b.abcCategory] || 0;
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [products, searchTerm, sortConfig, statusFilter, platformFilter, timePeriod]);

  const summary = useMemo(() => {
    const totalGmv = processedProducts.reduce((sum, p) => sum + p.gmv, 0);
    const totalOrders = processedProducts.reduce((sum, p) => sum + p.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalGmv / totalOrders : 0;
    const activeItems = processedProducts.filter(p => parseInt(p.shopViews) > 0);
    const avgCvr = activeItems.length > 0 
      ? activeItems.reduce((sum, p) => sum + parseFloat(p.cvr.replace('%', '')), 0) / activeItems.length 
      : 0;
    return { totalGmv, totalOrders, avgOrderValue, conversionRate: avgCvr.toFixed(2) + '%' };
  }, [processedProducts]);

  const channelData = useMemo(() => {
    return processedProducts.reduce((acc, curr) => {
      acc.shop += curr.shopGmv || 0;
      acc.video += curr.videoGmv || 0;
      acc.live += curr.liveGmv || 0;
      return acc;
    }, { shop: 0, video: 0, live: 0 });
  }, [processedProducts]);

  const totalChannelGmv = channelData.shop + channelData.video + channelData.live || 1;
  const topProduct = processedProducts.reduce((prev, current) => (prev.gmv > current.gmv) ? prev : current, processedProducts[0] || {});

  const availablePlatforms = useMemo(() => ['All', ...new Set(products.map(p => p.platform))], [products]);

  // --- Insights ---
  const smartInsights = useMemo(() => {
    const insights = [];
    const classA = products.filter(p => p.abcCategory === 'A');
    if (classA.length > 0) {
        const percentCount = Math.round((classA.length / products.length) * 100);
        insights.push({
            type: 'strategic',
            title: 'Pareto Strategy',
            text: `Top ${percentCount}% of products (Class A) drive 80% of revenue. Keep these in stock.`,
            icon: PieChart,
            color: 'indigo'
        });
    }
    const highViewLowCvr = products.find(p => {
        const views = p.shopViews + (p.videoViews || 0);
        const cvr = parseFloat(p.cvr);
        return views > settings.highViewThreshold && cvr < settings.lowCvrThreshold && p.gmv < 1000;
    });
    if (highViewLowCvr) {
        insights.push({
            type: 'opportunity',
            title: 'Funnel Leak',
            text: `"${highViewLowCvr.name.substring(0, 15)}..." has >${settings.highViewThreshold} views but <${settings.lowCvrThreshold}% CVR.`,
            icon: AlertTriangle,
            color: 'rose'
        });
    }
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            title: 'All Good',
            text: 'Metrics look stable based on current thresholds.',
            icon: CheckCircle2,
            color: 'green'
        });
    }
    return insights;
  }, [products, settings]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-200 p-4 md:p-6 font-sans text-slate-800 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <div className="bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-2xl overflow-hidden h-full flex flex-col md:flex-row border border-white/40">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                smartInsights={smartInsights} 
                fileInputRef={fileInputRef} 
                handleFileUpload={handleFileUpload} 
            />

            <div className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-0 z-20 bg-gradient-to-b from-white/0 via-white/0 to-transparent pb-4">
                <div>
                  <p className="text-teal-600 font-bold text-sm mb-1 tracking-wide uppercase opacity-80">
                    {activeView === 'dashboard' ? 'Overview' : activeView === 'inventory' ? 'Management' : activeView === 'reports' ? 'Documentation' : 'System'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm capitalize">
                    {activeView === 'dashboard' ? 'Shop Analytics' : activeView === 'inventory' ? 'Product Inventory' : activeView === 'reports' ? 'Performance Reports' : 'Settings'}
                  </h2>
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="flex items-center gap-3 pl-4 border-l-2 border-white/50">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm ring-2 ring-indigo-50">
                        {typeof settings.userName === 'string' ? settings.userName.charAt(0) : 'S'}
                    </div>
                    <div className="hidden sm:block leading-tight">
                        <p className="font-bold text-gray-700 text-sm">{typeof settings.userName === 'string' ? settings.userName : 'Manager'}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: 883921</p>
                    </div>
                  </div>
                </div>
              </div>

              {activeView === 'dashboard' && (
                <DashboardView 
                    topProduct={topProduct} 
                    setSelectedProduct={setSelectedProduct} 
                    currency={settings.currency} 
                    channelData={channelData} 
                    totalChannelGmv={totalChannelGmv} 
                    summary={summary} 
                    timePeriod={timePeriod} 
                    setTimePeriod={setTimePeriod} 
                    platformFilter={platformFilter} 
                    setPlatformFilter={setPlatformFilter} 
                    availablePlatforms={availablePlatforms}
                />
              )}
              {activeView === 'inventory' && (
                <InventoryView 
                    processedProducts={processedProducts} 
                    handleExportCSV={handleExportCSV} 
                    statusFilter={statusFilter} 
                    setStatusFilter={setStatusFilter} 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    handleSort={handleSort} 
                    getSortIcon={getSortIcon} 
                    setSelectedProduct={setSelectedProduct} 
                    currency={settings.currency}
                />
              )}
              {activeView === 'reports' && (
                <ReportView 
                    settings={settings} 
                    summary={summary} 
                    smartInsights={smartInsights} 
                    channelData={channelData} 
                    currency={settings.currency} 
                    processedProducts={processedProducts} 
                    setActiveView={setActiveView}
                />
              )}
              {activeView === 'settings' && (
                <SettingsView 
                    settings={settings} 
                    setSettings={setSettings} 
                    uploadedFiles={uploadedFiles} 
                    clearData={clearData} 
                    addNotification={addNotification}
                />
              )}
            </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
         {notifications.map(n => (
           <div key={n.id} className={`text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in ${n.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>
              {n.type === 'error' ? <AlertTriangle className="w-5 h-5 text-white" /> : <CheckCircle2 className="w-5 h-5 text-green-400" />}
              {n.msg}
           </div>
         ))}
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} currency={settings.currency} />}
    </div>
  );
}