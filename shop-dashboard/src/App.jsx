import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Package, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
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
  Smartphone,
  Calendar as CalendarIcon,
  Wallet,
  Plus,
  Target,
  Calculator,
  Info,
  HelpCircle,
  ExternalLink,
  Link as LinkIcon,
  User,
  BookOpen,
  LogOut,
  Users,
  ChevronLeft,
  ChevronRight,
  LogIn,
  ArrowRight,
  Lock,
  Key,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

// --- Global Helper Functions ---

const parseCurrency = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  return parseFloat(val.toString().replace(/[^0-9.-]+/g, '')) || 0;
};

const parsePercent = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace('%', '')) || 0;
};

const formatCurrency = (amount, currencySymbol = '฿') => {
  const val = typeof amount === 'number' ? amount : 0;
  return `${currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getBadgeColor = (category) => {
  switch(category) {
      case 'A': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'B': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

const getHealthColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
};

// --- Sub-Components ---

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 
    ${active 
      ? 'bg-violet-600 text-white shadow-md shadow-violet-200 transform translate-x-1' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-violet-700'}`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
    {label}
  </button>
);

const StatCard = ({ title, value, icon: Icon, colorClass, subText, info }) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group relative animate-in fade-in zoom-in duration-300`}>
    <div className="flex justify-between items-start">
        <div>
            <div className="flex items-center gap-1 mb-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}>{title}</p>
                {info && (
                    <div className="group/tooltip relative">
                        <HelpCircle className="w-3 h-3 text-slate-400 cursor-help" />
                        <div className="absolute left-0 top-6 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                            {info}
                        </div>
                    </div>
                )}
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${colorClass}`}>
            <Icon className="w-5 h-5" />
        </div>
    </div>
    {subText && (
      <div className="mt-3 text-xs font-medium text-slate-500 flex items-center gap-1">
          {subText}
      </div>
    )}
  </div>
);

const ProductDetailModal = ({ product, onClose, currency, benchmarks }) => {
  if (!product) return null;
  const maxGmv = Math.max(product.shopGmv, product.videoGmv, product.liveGmv) || 1;
  const healthScore = product.healthScore || 0;

  // Comparison Logic
  const cvrDiff = product.cvrNum - benchmarks.avgCvr;
  const ctrDiff = product.ctrNum - benchmarks.avgCtr;

  return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 flex-shrink-0">
                  <div>
                      <div className="flex items-center gap-2 mb-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getBadgeColor(product.abcCategory)}`}>
                              Class {product.abcCategory}
                          </span>
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                              {product.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getHealthColor(healthScore)}`}>
                              Health: {healthScore}/100
                          </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 leading-tight mb-2">{product.name}</h2>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"><Smartphone className="w-3 h-3 text-violet-600" /> Platform: <strong>{product.platform}</strong></span>
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"><FileText className="w-3 h-3 text-indigo-600" /> ID: {product.id}</span>
                         <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm font-semibold text-violet-700"><Zap className="w-3 h-3" /> Segment: {product.segment}</span>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-slate-500" />
                  </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                  
                  {/* Benchmarking Section */}
                  <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-violet-600" /> Market Benchmark Analysis
                      </h3>
                      <div className="space-y-4">
                          <div>
                              <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-500">Conversion Rate (CVR)</span>
                                  <span className={cvrDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                      {product.cvr} vs Avg {benchmarks.avgCvr.toFixed(2)}% ({cvrDiff > 0 ? '+' : ''}{cvrDiff.toFixed(2)}%)
                                  </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden relative">
                                  {/* Average Marker */}
                                  <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{left: `${Math.min(benchmarks.avgCvr * 5, 100)}%`}}></div>
                                  <div className={`h-full rounded-full ${cvrDiff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{width: `${Math.min(product.cvrNum * 5, 100)}%`}}></div>
                              </div>
                          </div>
                          <div>
                              <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-500">Click-Through Rate (CTR)</span>
                                  <span className={ctrDiff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                      {product.ctr} vs Avg {benchmarks.avgCtr.toFixed(2)}% ({ctrDiff > 0 ? '+' : ''}{ctrDiff.toFixed(2)}%)
                                  </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden relative">
                                  <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10" style={{left: `${Math.min(benchmarks.avgCtr * 10, 100)}%`}}></div>
                                  <div className={`h-full rounded-full ${ctrDiff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{width: `${Math.min(product.ctrNum * 10, 100)}%`}}></div>
                              </div>
                          </div>
                      </div>
                      {product.potentialRevenue > 0 && (
                          <div className="mt-4 p-3 bg-violet-100 rounded-lg text-xs text-violet-800 flex items-center gap-2 border border-violet-200">
                              <Lightbulb className="w-4 h-4" />
                              <span><strong>Opportunity:</strong> Improving CVR to market average could generate an extra <strong>{formatCurrency(product.potentialRevenue, currency)}</strong>.</span>
                          </div>
                      )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Total Sales</p>
                          <p className="text-xl md:text-2xl font-bold text-violet-700">{formatCurrency(product.gmv, currency)}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Items Sold</p>
                          <p className="text-xl md:text-2xl font-bold text-slate-700">{product.itemsSold}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Conversion</p>
                          <p className="text-xl md:text-2xl font-bold text-emerald-600">{product.cvr}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Orders</p>
                          <p className="text-xl md:text-2xl font-bold text-amber-600">{product.orders}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                              <DollarSign className="w-4 h-4" /> GMV Source Analysis
                          </h3>
                          <div className="space-y-4">
                              {[
                              { name: 'Shop Tab', gmv: product.shopGmv, icon: ShoppingBag, color: 'violet' },
                              { name: 'Video Content', gmv: product.videoGmv, icon: Video, color: 'indigo' },
                              { name: 'Live Stream', gmv: product.liveGmv, icon: Eye, color: 'rose' },
                              ].map((channel, i) => (
                              <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <div className="flex justify-between text-sm mb-2">
                                      <span className="flex items-center gap-2 text-slate-700 font-bold"><channel.icon className={`w-4 h-4 text-${channel.color}-600`} /> {channel.name}</span>
                                      <span className="font-bold text-slate-900">{formatCurrency(channel.gmv, currency)}</span>
                                  </div>
                                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                                      <div style={{width: `${(channel.gmv / (maxGmv || 1)) * 100}%`}} className={`h-full bg-${channel.color}-500 rounded-full`}></div>
                                  </div>
                                  <div className="flex justify-between text-xs text-slate-500">
                                      <span>Contribution: <strong>{(channel.gmv > 0 ? ((channel.gmv / (product.gmv || 1)) * 100).toFixed(1) : 0)}%</strong></span>
                                  </div>
                              </div>
                              ))}
                          </div>
                      </div>
                      <div>
                          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                              <MousePointer2 className="w-4 h-4" /> Traffic & Conversion
                          </h3>
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-6">
                              <div className="relative pl-8 border-l-2 border-slate-200 pb-6">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Views</p>
                                  <p className="text-lg font-bold text-slate-800">
                                      {(product.shopViews + (product.videoViews || 0) + (product.liveViews || 0)).toLocaleString()}
                                  </p>
                              </div>
                              <div className="relative pl-8 border-l-2 border-slate-200 pb-6">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-300 border-2 border-white"></div>
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">CTR (Click Through)</p>
                                  <p className="text-lg font-bold text-blue-600">{product.ctr}</p>
                              </div>
                              <div className="relative pl-8 border-l-2 border-emerald-500">
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Final Conversion</p>
                                  <p className="text-xl font-bold text-emerald-600">{product.cvr}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end flex-shrink-0">
                  <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">
                      Close Details
                  </button>
              </div>
          </div>
      </div>
  );
};

const MediaView = ({ products, currency }) => {
    const videoStats = products.reduce((acc, p) => {
        acc.gmv += p.videoGmv || 0;
        acc.views += p.videoViews || 0;
        return acc;
    }, { gmv: 0, views: 0 });

    const liveStats = products.reduce((acc, p) => {
        acc.gmv += p.liveGmv || 0;
        acc.views += p.liveViews || 0;
        return acc;
    }, { gmv: 0, views: 0 });

    const topVideos = [...products].sort((a, b) => b.videoGmv - a.videoGmv).slice(0, 5);
    const topLives = [...products].sort((a, b) => b.liveGmv - a.liveGmv).slice(0, 5);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Media Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Video className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-950 text-lg">Short Video</h3>
                            <p className="text-xs text-indigo-500 font-medium uppercase">Content Performance</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">Revenue</p>
                            <p className="text-xl font-bold text-indigo-700">{formatCurrency(videoStats.gmv, currency)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">Total Views</p>
                            <p className="text-xl font-bold text-slate-700">{videoStats.views.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Top Content Products</h4>
                        <div className="space-y-2">
                            {topVideos.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
                                    <span className="truncate w-1/2 font-medium">{p.name}</span>
                                    <span className="font-mono font-bold text-indigo-600">{formatCurrency(p.videoGmv, currency)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-rose-50 rounded-lg">
                            <Eye className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-rose-950 text-lg">Live Streaming</h3>
                            <p className="text-xs text-rose-500 font-medium uppercase">Real-time Sales</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">Revenue</p>
                            <p className="text-xl font-bold text-rose-700">{formatCurrency(liveStats.gmv, currency)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">Total Views</p>
                            <p className="text-xl font-bold text-slate-700">{liveStats.views.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Top Live Products</h4>
                        <div className="space-y-2">
                            {topLives.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm">
                                    <span className="truncate w-1/2 font-medium">{p.name}</span>
                                    <span className="font-mono font-bold text-rose-600">{formatCurrency(p.liveGmv, currency)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinanceView = ({ products, currency, campaigns = [] }) => {
    const [cogsPercent, setCogsPercent] = useState(40);
    const [manualAdSpend, setManualAdSpend] = useState(0);
    const [fixedCost, setFixedCost] = useState(0);

    // Advanced Accounting Logic
    const totalRevenue = products.reduce((sum, p) => sum + p.gmv, 0);
    const estimatedCOGS = totalRevenue * (cogsPercent / 100);
    
    // Calculate total campaign spend from planner
    const campaignSpend = campaigns.reduce((sum, c) => sum + (c.adSpend || 0), 0);
    const totalAdSpend = manualAdSpend + campaignSpend;
    
    const grossProfit = totalRevenue - estimatedCOGS;
    const variableCosts = totalRevenue * 0.05; // Assumed 5% platform fees/shipping variance
    const contributionMargin = grossProfit - variableCosts - totalAdSpend;
    const netProfit = contributionMargin - fixedCost;
    
    const marginPercent = (netProfit / (totalRevenue || 1)) * 100;
    const contributionMarginPercent = (contributionMargin / (totalRevenue || 1)) * 100;

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Advanced Profitability Engine</h2>
                <div className="bg-violet-50 text-violet-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Calculator className="w-4 h-4" /> Real-time Estimates
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2"><Settings className="w-5 h-5"/> Cost Assumptions</h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Cost of Goods (COGS) %</label>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={cogsPercent} 
                                onChange={(e) => setCogsPercent(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                            />
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-slate-400">0%</span>
                                <span className="text-sm font-bold text-violet-700">{cogsPercent}%</span>
                                <span className="text-xs text-slate-400">100%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Additional Ad Spend ({currency})</label>
                            <input 
                                type="number" 
                                value={manualAdSpend}
                                onChange={(e) => setManualAdSpend(Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                            <p className="text-xs text-slate-400 mt-1">
                                + {formatCurrency(campaignSpend, currency)} from Campaign Planner
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Fixed Costs (Rent, Salary) ({currency})</label>
                            <input 
                                type="number" 
                                value={fixedCost}
                                onChange={(e) => setFixedCost(Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                            />
                        </div>
                    </div>
                 </div>

                 <div className="lg:col-span-2 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                             <div className="relative z-10">
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Estimated Net Profit</p>
                                <p className="text-4xl font-extrabold tracking-tight">{formatCurrency(netProfit, currency)}</p>
                                <div className="flex gap-4 mt-2">
                                    <p className={`text-sm font-bold ${marginPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {marginPercent.toFixed(1)}% Net
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {contributionMarginPercent.toFixed(1)}% CM
                                    </p>
                                </div>
                             </div>
                             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                 <DollarSign className="w-48 h-48" />
                             </div>
                         </div>

                         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">Gross Revenue</span>
                                    <span className="font-bold text-slate-800">{formatCurrency(totalRevenue, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-rose-500 font-medium">- COGS (Est.)</span>
                                    <span className="font-bold text-rose-600">{formatCurrency(estimatedCOGS, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-orange-500 font-medium">- Total Ad Spend</span>
                                    <span className="font-bold text-orange-600">{formatCurrency(totalAdSpend, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">- Var. Costs (5%)</span>
                                    <span className="font-bold text-slate-600">{formatCurrency(variableCosts, currency)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-violet-600 font-bold">Contribution Margin</span>
                                    <span className="font-bold text-violet-700">{formatCurrency(contributionMargin, currency)}</span>
                                </div>
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
};

const CampaignView = ({ products, currency, campaigns, setCampaigns }) => {
    const [showModal, setShowModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [activeCampaign, setActiveCampaign] = useState(null);
    
    // Create Modal State
    const [newCampName, setNewCampName] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [adUrl, setAdUrl] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // Analytics Modal State
    const [analyticsData, setAnalyticsData] = useState({
        adSpend: 0,
        startDate: '',
        endDate: '',
        platform: 'Meta Ads',
        targetRoas: 3.0
    });

    const handleCreate = () => {
        if (!newCampName) return;
        const selectedProducts = products.filter(p => selectedIds.includes(p.id));
        const baselineGmv = selectedProducts.reduce((sum, p) => sum + p.gmv, 0);
        
        // Simple Projection Logic: Assume 10% lift for every 5% discount
        const liftFactor = 1 + ((discountPercent / 5) * 0.1); 
        const projectedRevenue = baselineGmv * (1 - (discountPercent/100)) * liftFactor; 

        const newCamp = {
            id: Date.now(),
            name: newCampName,
            productCount: selectedIds.length,
            baselineGmv,
            projectedRevenue,
            discountPercent,
            adUrl,
            status: 'Planned',
            date: new Date().toLocaleDateString(),
            adSpend: 0,
            adDetails: null
        };
        setCampaigns([...campaigns, newCamp]);
        setShowModal(false);
        setNewCampName('');
        setDiscountPercent(0);
        setAdUrl('');
        setSelectedIds([]);
    };

    const deleteCampaign = (id) => {
        if(window.confirm('Delete this campaign plan?')) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
        }
    };

    const openAnalytics = (campaign) => {
        setActiveCampaign(campaign);
        setAnalyticsData({
            adSpend: campaign.adSpend || 0,
            startDate: campaign.adDetails?.startDate || '',
            endDate: campaign.adDetails?.endDate || '',
            platform: campaign.adDetails?.platform || 'Meta Ads',
            targetRoas: campaign.adDetails?.targetRoas || 3.0
        });
        setShowAnalyticsModal(true);
    };

    const saveAnalytics = () => {
        setCampaigns(prev => prev.map(c => {
            if(c.id === activeCampaign.id) {
                return {
                    ...c,
                    adSpend: Number(analyticsData.adSpend),
                    adDetails: { ...analyticsData }
                };
            }
            return c;
        }));
        setShowAnalyticsModal(false);
    };

    const toggleSelection = (id) => {
        if (selectedIds.includes(id)) setSelectedIds(prev => prev.filter(i => i !== id));
        else setSelectedIds(prev => [...prev, id]);
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 relative">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Campaign Planner</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> New Campaign
                </button>
             </div>

             {/* Campaign List */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {campaigns.length === 0 ? (
                     <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                         <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                         <p className="text-slate-500 font-medium">No campaigns planned yet.</p>
                         <p className="text-xs text-slate-400">Create a campaign to track product groups.</p>
                     </div>
                 ) : (
                     campaigns.map(camp => (
                         <div key={camp.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                             <button 
                                onClick={() => deleteCampaign(camp.id)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                             <div className="flex justify-between items-start mb-4 pr-6">
                                 <div>
                                     <h3 className="font-bold text-slate-800 text-lg">{camp.name}</h3>
                                     <p className="text-xs text-slate-400 font-mono">Created: {camp.date}</p>
                                     {camp.adUrl && (
                                         <a href={camp.adUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">
                                             <ExternalLink className="w-3 h-3" /> View Ad Platform
                                         </a>
                                     )}
                                 </div>
                             </div>
                             <div className="space-y-2 mb-4">
                                 <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">Products / Discount</span>
                                     <span className="font-bold text-slate-800">{camp.productCount} items / -{camp.discountPercent}%</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="text-slate-500">Ad Spend</span>
                                     <span className="font-bold text-slate-800">{formatCurrency(camp.adSpend, currency)}</span>
                                 </div>
                                 <div className="flex justify-between text-sm bg-violet-50 p-2 rounded-lg border border-violet-100">
                                     <span className="text-violet-600 font-bold">Proj. Revenue</span>
                                     <span className="font-bold text-violet-700">{formatCurrency(camp.projectedRevenue, currency)}</span>
                                 </div>
                             </div>
                             <div className="pt-2 border-t border-slate-100 flex gap-2">
                                <button 
                                    onClick={() => openAnalytics(camp)}
                                    className="flex-1 py-2 text-xs font-bold text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 flex items-center justify-center gap-2"
                                >
                                    <BarChart3 className="w-3 h-3" /> Analytics & Ads
                                </button>
                             </div>
                         </div>
                     ))
                 )}
             </div>

             {/* Create Modal */}
             {showModal && (
                 <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                     <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                         <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                             <h3 className="font-bold text-slate-800">New Campaign Plan</h3>
                             <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
                         </div>
                         <div className="p-6 space-y-5 overflow-y-auto flex-1">
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
                                 <input 
                                     type="text" 
                                     value={newCampName} 
                                     onChange={(e) => setNewCampName(e.target.value)}
                                     placeholder="e.g. 11.11 Mega Sale"
                                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                                 />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Discount %</label>
                                    <input 
                                        type="number" 
                                        min="0" max="100"
                                        value={discountPercent} 
                                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Link (Optional)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="url" 
                                            value={adUrl} 
                                            onChange={(e) => setAdUrl(e.target.value)}
                                            placeholder="https://ads..."
                                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                                        />
                                    </div>
                                </div>
                             </div>
                             
                             <div>
                                 <label className="block text-sm font-medium text-slate-700 mb-2">Select Campaign Products</label>
                                 <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-lg divide-y divide-slate-100">
                                     {products.map(p => (
                                         <div 
                                            key={p.id} 
                                            onClick={() => toggleSelection(p.id)}
                                            className={`p-2 flex items-center justify-between cursor-pointer hover:bg-slate-50 ${selectedIds.includes(p.id) ? 'bg-violet-50' : ''}`}
                                         >
                                             <div className="flex flex-col overflow-hidden mr-2">
                                                 <span className="text-sm truncate font-medium text-slate-700">{p.name}</span>
                                                 <span className="text-[10px] text-slate-400">Baseline: {formatCurrency(p.gmv, currency)}</span>
                                             </div>
                                             {selectedIds.includes(p.id) && <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />}
                                         </div>
                                     ))}
                                 </div>
                                 <p className="text-xs text-right text-slate-400 mt-1">{selectedIds.length} items selected</p>
                             </div>

                             {/* Smart Preview */}
                             <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex justify-between items-center">
                                <span>Projected Revenue (with lift):</span>
                                <span className="font-bold text-violet-700">{formatCurrency(products.filter(p => selectedIds.includes(p.id)).reduce((s,p)=>s+p.gmv,0) * (1 - (discountPercent/100)) * (1 + ((discountPercent / 5) * 0.1)), currency)}</span>
                             </div>
                         </div>
                         <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                             <button 
                                onClick={handleCreate}
                                disabled={!newCampName || selectedIds.length === 0}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!newCampName || selectedIds.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md'}`}
                             >
                                 Create Plan
                             </button>
                         </div>
                     </div>
                 </div>
             )}

            {/* Analytics Modal */}
            {showAnalyticsModal && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
                     <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                             <div className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-violet-600" />
                                <h3 className="font-bold text-slate-800">Campaign Ad Analytics</h3>
                             </div>
                             <button onClick={() => setShowAnalyticsModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
                         </div>
                         <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ad Platform</label>
                                <select 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    value={analyticsData.platform}
                                    onChange={e => setAnalyticsData({...analyticsData, platform: e.target.value})}
                                >
                                    <option value="Meta Ads">Meta Ads (Facebook/Instagram)</option>
                                    <option value="TikTok Ads">TikTok Ads</option>
                                    <option value="Google Ads">Google Ads</option>
                                    <option value="Shopee Ads">Shopee Ads</option>
                                    <option value="Lazada Ads">Lazada Solutions</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Ad Spend ({currency})</label>
                                <input 
                                    type="number" 
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono font-medium"
                                    value={analyticsData.adSpend}
                                    onChange={e => setAnalyticsData({...analyticsData, adSpend: e.target.value})}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        value={analyticsData.startDate}
                                        onChange={e => setAnalyticsData({...analyticsData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        value={analyticsData.endDate}
                                        onChange={e => setAnalyticsData({...analyticsData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target ROAS (Return on Ad Spend)</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    value={analyticsData.targetRoas}
                                    onChange={e => setAnalyticsData({...analyticsData, targetRoas: e.target.value})}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Quantro uses this for profitability forecasting.</p>
                            </div>
                         </div>
                         <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                             <button onClick={() => setShowAnalyticsModal(false)} className="px-4 py-2 text-sm text-slate-600 font-medium">Cancel</button>
                             <button onClick={saveAnalytics} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-violet-700">Save Data</button>
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
};

const CalendarView = ({ uploadedFiles, campaigns }) => {
    // Smart Calendar with Month Navigation
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // State for selected date modal
    
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    
    const getEventsForDay = (day) => {
        const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Normalize time to compare dates only
        dateObj.setHours(0,0,0,0);
        
        const events = [];
        
        // Campaign Events (Creation Date)
        campaigns.forEach(c => {
             const cDate = new Date(c.date);
             cDate.setHours(0,0,0,0);
             if(cDate.getTime() === dateObj.getTime()) {
                 events.push({ type: 'campaign-create', title: `${c.name} (Created)` });
             }
             
             // Campaign Duration (Active Running)
             if (c.adDetails?.startDate && c.adDetails?.endDate) {
                 const start = new Date(c.adDetails.startDate);
                 const end = new Date(c.adDetails.endDate);
                 start.setHours(0,0,0,0);
                 end.setHours(0,0,0,0);
                 
                 if (dateObj >= start && dateObj <= end) {
                      // Check if it's the start or end day specifically for better UI text
                      if (dateObj.getTime() === start.getTime()) events.push({ type: 'campaign-start', title: `START: ${c.name}` });
                      else if (dateObj.getTime() === end.getTime()) events.push({ type: 'campaign-end', title: `END: ${c.name}` });
                      else events.push({ type: 'campaign-run', title: `${c.name} (Active)` });
                 }
             }
        });
        
        // Import History Events
        uploadedFiles.forEach(f => {
            if(typeof f === 'object' && f.date) {
                 const fDate = new Date(f.date);
                 fDate.setHours(0,0,0,0);
                 if(fDate.getTime() === dateObj.getTime()) {
                     events.push({ type: 'import', title: `Import: ${f.name}` });
                 }
            }
        });
        
        return events;
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const goToToday = () => setCurrentMonth(new Date());

    return (
        <div className="h-full bg-white rounded-xl p-6 shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 flex flex-col relative">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Operational Calendar</h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5 text-slate-600"/></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5 text-slate-600"/></button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={goToToday} className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1 rounded-full">Today</button>
                </div>
             </div>
             
             <div className="grid grid-cols-7 gap-2 mb-2">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                     <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>
                 ))}
             </div>
             
             <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto">
                 {Array.from({length: firstDay}).map((_, i) => <div key={`empty-${i}`} className="h-24 bg-transparent"></div>)}
                 
                 {days.map(day => {
                     const events = getEventsForDay(day);
                     const todayDate = new Date();
                     const isToday = day === todayDate.getDate() && currentMonth.getMonth() === todayDate.getMonth() && currentMonth.getFullYear() === todayDate.getFullYear();
                     
                     // Helper to get event color
                     const getEventStyle = (type) => {
                         if (type.includes('campaign-start')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                         if (type.includes('campaign-end')) return 'bg-rose-100 text-rose-700 border-rose-200';
                         if (type.includes('campaign-run')) return 'bg-violet-50 text-violet-600 border-violet-100 opacity-70';
                         if (type === 'import') return 'bg-slate-100 text-slate-600 border-slate-200';
                         return 'bg-indigo-100 text-indigo-700';
                     }

                     return (
                         <div 
                            key={day} 
                            onClick={() => events.length > 0 && setSelectedDate({ day, events })}
                            className={`min-h-[100px] p-2 rounded-xl border ${isToday ? 'bg-violet-50 border-violet-200 ring-2 ring-violet-200 ring-offset-2' : 'bg-white border-slate-100'} flex flex-col gap-1 overflow-hidden hover:shadow-md transition-all relative cursor-pointer group`}
                         >
                             <span className={`text-sm font-bold ${isToday ? 'text-violet-700' : 'text-slate-700'}`}>{day}</span>
                             {events.map((ev, i) => (
                                 <div key={i} className={`text-[9px] px-1.5 py-0.5 rounded truncate font-medium border ${getEventStyle(ev.type)}`}>
                                     {ev.title}
                                 </div>
                             ))}
                             {/* Traffic Sim for demo */}
                             {(day % 7 === 0 || day === 15) && (
                                 <div className="mt-auto flex justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                     <div className="text-[9px] bg-amber-50 text-amber-600 px-1 rounded flex items-center gap-1 w-full justify-center">
                                         <TrendingUp className="w-2 h-2" /> Traffic
                                     </div>
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>

             {/* Day Detail Modal */}
             {selectedDate && (
                 <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 rounded-xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-200">
                     <div className="w-full max-w-md">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-2xl font-bold text-slate-800">
                                 {currentMonth.toLocaleDateString('en-US', { month: 'long' })} {selectedDate.day}
                             </h3>
                             <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-500"/></button>
                         </div>
                         <div className="space-y-3">
                             {selectedDate.events.map((ev, i) => (
                                 <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 bg-white shadow-sm`}>
                                     {ev.type.includes('campaign') ? <Target className="w-5 h-5 text-violet-600"/> : <Database className="w-5 h-5 text-slate-500"/>}
                                     <span className="font-medium text-slate-700">{ev.title}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

const Sidebar = ({ activeView, setActiveView, smartInsights, fileInputRef, handleFileUpload }) => (
  <div className="w-full md:w-64 bg-slate-50/50 p-6 space-y-2 border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 flex flex-col">
    <div className="mb-8 flex items-center justify-between md:block">
      <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-violet-700/20">Q</div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Quantro</h1>
      </div>
      <button className="md:hidden p-2">
          <LayoutDashboard className="w-6 h-6 text-slate-600"/>
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
        icon={Video} 
        label="Live & Video" 
        active={activeView === 'media'} 
        onClick={() => setActiveView('media')} 
      />
      <NavButton 
        icon={Target} 
        label="Campaigns" 
        active={activeView === 'campaigns'} 
        onClick={() => setActiveView('campaigns')} 
      />
      <NavButton 
        icon={CalendarIcon} 
        label="Calendar" 
        active={activeView === 'calendar'} 
        onClick={() => setActiveView('calendar')} 
      />
      <NavButton 
        icon={Wallet} 
        label="Finance" 
        active={activeView === 'finance'} 
        onClick={() => setActiveView('finance')} 
      />
      <NavButton 
        icon={FileText} 
        label="Reports" 
        active={activeView === 'reports'} 
        onClick={() => setActiveView('reports')} 
      />
      
      <div className="pt-4 pb-2 flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4">AI Insights</p>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      {smartInsights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
          <div key={idx} className={`mx-2 p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-sm transition-all hover:scale-[1.02] hover:border-violet-200 group`}>
              <div className={`flex items-center gap-2 font-bold text-${insight.color}-700 mb-1 group-hover:text-violet-700`}>
                  <Icon className="w-3 h-3" /> {insight.title}
              </div>
              <p className={`text-slate-600 leading-relaxed`}>{insight.text}</p>
          </div>
          );
      })}
    </div>

    <div className="mt-4 pt-4 border-t border-slate-200">
      <input 
          type="file" 
          accept=".csv,.xlsx,.xls" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden" 
      />
      <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-violet-300 transition-all text-sm shadow-sm group"
      >
          <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-violet-600" />
          <div className="flex flex-col items-start">
             <span>Import Data</span>
             <span className="text-[10px] text-slate-400 font-normal">Supports XLSX, CSV</span>
          </div>
      </button>
    </div>
  </div>
);

const DashboardView = ({ topProduct, setSelectedProduct, currency, channelData, totalChannelGmv, summary, timePeriod, setTimePeriod, platformFilter, setPlatformFilter, availablePlatforms, visibleKPIs, opportunityValue }) => (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 animate-in fade-in slide-in-from-top-2">
       <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['All Time', 'Last Import'].map(period => (
              <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${timePeriod === period ? 'bg-slate-100 text-violet-700 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  {period}
              </button>
          ))}
       </div>

       <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-white border-none text-sm font-semibold text-slate-700 focus:ring-0 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors"
          >
              {availablePlatforms.map(p => <option key={p} value={p}>{p} Platform</option>)}
          </select>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Top Product */}
      <div 
          onClick={() => topProduct.gmv && setSelectedProduct(topProduct)}
          className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-violet-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Top Performer</h3>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
        </div>
        
        {topProduct && topProduct.gmv > 0 ? (
            <>
              <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden relative">
                       <div className="absolute top-0 right-0 bg-amber-400 text-[8px] font-bold px-1 rounded-bl">#{topProduct.abcCategory}</div>
                      <Package className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight">{topProduct.name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] uppercase font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                              {formatCurrency(topProduct.gmv, currency)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              {topProduct.platform}
                          </span>
                      </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold">Views</p>
                      <p className="font-bold text-slate-800">
                          {(topProduct.shopViews + (topProduct.videoViews || 0) + (topProduct.liveViews || 0)).toLocaleString()}
                      </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold">Sold</p>
                      <p className="font-bold text-slate-800">{topProduct.itemsSold}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 mb-1 uppercase font-bold">CTR</p>
                      <p className="font-bold text-slate-800">{topProduct.ctr}</p>
                  </div>
              </div>
            </>
        ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
              <Package className="w-12 h-12 mb-2 opacity-20" />
              <p>No sales data available</p>
            </div>
        )}
      </div>

      {/* Channel Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-violet-200 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">GMV Source</h3>
          <div className="flex gap-1 text-xs">
               <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-md font-bold">Shop</span>
               <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-bold">Video</span>
               <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-md font-bold">Live</span>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden bg-slate-100 p-1 border border-slate-200">
                   <div 
                      style={{ width: `${(channelData.shop / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded bg-violet-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Shop: ${formatCurrency(channelData.shop, currency)}`}
                   ></div>
                   <div 
                      style={{ width: `${(channelData.video / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded bg-indigo-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Video: ${formatCurrency(channelData.video, currency)}`}
                   ></div>
                   <div 
                      style={{ width: `${(channelData.live / (totalChannelGmv || 1)) * 100}%` }} 
                      className="h-full rounded bg-rose-500 shadow-sm relative group cursor-help transition-all duration-500"
                      title={`Live: ${formatCurrency(channelData.live, currency)}`}
                   ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 divide-x divide-slate-100">
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Shop Tab</p>
              <p className="text-lg font-bold text-violet-600">{formatCurrency(channelData.shop, currency)}</p>
              <p className="text-[10px] text-slate-400">{(channelData.shop / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Video</p>
              <p className="text-lg font-bold text-indigo-600">{formatCurrency(channelData.video, currency)}</p>
              <p className="text-[10px] text-slate-400">{(channelData.video / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
            <div className="px-2 text-center">
              <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Live</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(channelData.live, currency)}</p>
              <p className="text-[10px] text-slate-400">{(channelData.live / (totalChannelGmv || 1) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8">
      {/* Product List Snippet */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800 text-lg">Inventory Snapshot</h3>
          <button 
              onClick={() => setSelectedProduct(topProduct)}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline flex items-center gap-1"
          >
              View full list <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
              <thead>
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left py-3 px-2">Product</th>
                  <th className="text-center py-3 px-2">Class</th>
                  <th className="text-center py-3 px-2">Health</th>
                  <th className="text-right py-3 px-2">GMV</th>
                  <th className="text-center py-3 px-2">Sold</th>
              </tr>
              </thead>
              <tbody className="text-slate-700 font-medium">
              {channelData && Object.keys(channelData).length > 0 && topProduct && topProduct.gmv ? (
                  <tr 
                      onClick={() => setSelectedProduct(topProduct)}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group cursor-pointer"
                  >
                      <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center text-xs text-slate-400">IMG</div>
                              <div className="max-w-[200px] truncate font-medium text-slate-800 group-hover:text-violet-700 transition-colors" title={topProduct.name}>{topProduct.name}</div>
                          </div>
                      </td>
                       <td className="py-3 px-2 text-center">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeColor(topProduct.abcCategory)}`}>
                              {topProduct.abcCategory}
                          </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHealthColor(topProduct.healthScore || 0)}`}>
                              {topProduct.healthScore || 0}
                          </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-violet-700 font-bold">{formatCurrency(topProduct.gmv, currency)}</td>
                      <td className="py-3 px-2 text-center text-slate-600">{topProduct.itemsSold}</td>
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
        {visibleKPIs?.totalGMV && (
          <StatCard 
            title="Total GMV" 
            value={formatCurrency(summary.totalGmv, currency)} 
            icon={DollarSign}
            colorClass="bg-violet-50 text-violet-600"
            info="Total Gross Merchandise Value across all channels before deductions."
          />
        )}
        <StatCard 
            title="AI Opportunity" 
            value={formatCurrency(opportunityValue, currency)} 
            icon={Zap}
            colorClass="bg-amber-50 text-amber-600"
            info="Estimated additional revenue if underperforming products met the average conversion rate."
        />
        {visibleKPIs?.conversionRate && (
          <StatCard 
            title="Conversion Rate" 
            value={summary.conversionRate} 
            icon={MousePointer2}
            colorClass="bg-emerald-50 text-emerald-600"
            info="Percentage of visitors who made a purchase."
          />
        )}
      </div>
    </div>
  </>
);

const InventoryView = ({ processedProducts, handleExportCSV, statusFilter, setStatusFilter, searchTerm, setSearchTerm, handleSort, getSortIcon, setSelectedProduct, currency }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
          <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-600" />
              Product Inventory
          </h3>
          <p className="text-sm text-slate-500 mt-1">{processedProducts.length} items found</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-violet-600"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>

          {/* Status Filter Dropdown */}
          <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Filter className="w-4 h-4" />
                  {statusFilter}
                  <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
              </button>
              <div className="absolute top-full mt-2 right-0 w-32 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-20 py-1">
                  {['All', 'Active', 'Inactive'].map(s => (
                      <button 
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-700 ${statusFilter === s ? 'text-violet-700 font-bold bg-violet-50/50' : 'text-slate-600'}`}
                      >
                          {s}
                      </button>
                  ))}
              </div>
          </div>

          <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                  type="text" 
                  placeholder="Search ID or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 w-64"
              />
          </div>
      </div>
    </div>

    <div className="overflow-auto flex-1 -mx-6 px-6">
      <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-slate-200">
          <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="text-left py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Product {getSortIcon('name')}</div>
              </th>
              <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('abcCategory')}>
                  <div className="flex items-center justify-center gap-1">Class {getSortIcon('abcCategory')}</div>
              </th>
              <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('healthScore')}>
                  <div className="flex items-center justify-center gap-1">Health {getSortIcon('healthScore')}</div>
              </th>
              <th className="text-right py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('gmv')}>
                  <div className="flex items-center justify-end gap-1">GMV {getSortIcon('gmv')}</div>
              </th>
              <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('orders')}>
                  <div className="flex items-center justify-center gap-1">Orders {getSortIcon('orders')}</div>
              </th>
              <th className="text-right py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('shopGmv')}>
                  <div className="flex items-center justify-end gap-1">Shop {getSortIcon('shopGmv')}</div>
              </th>
              <th className="text-center py-4 px-2 cursor-pointer hover:text-violet-600" onClick={() => handleSort('ctr')}>
                  <div className="flex items-center justify-center gap-1">CTR {getSortIcon('ctr')}</div>
              </th>
          </tr>
          </thead>
          <tbody className="text-slate-700 font-medium divide-y divide-slate-100">
          {processedProducts.map((item, idx) => (
              <tr 
                  key={idx} 
                  onClick={() => setSelectedProduct(item)}
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                  <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 border border-slate-200 group-hover:border-violet-200 transition-colors"></div>
                          <div>
                              <div className="max-w-[220px] lg:max-w-[300px] truncate font-semibold text-slate-800 group-hover:text-violet-700 transition-colors" title={item.name}>{item.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{item.id}</div>
                          </div>
                      </div>
                  </td>
                   <td className="py-3 px-2 text-center">
                       <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getBadgeColor(item.abcCategory)}`}>
                          {item.abcCategory}
                      </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getHealthColor(item.healthScore)}`}>
                          {item.healthScore}
                      </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-violet-700 font-bold">{formatCurrency(item.gmv, currency)}</td>
                  <td className="py-3 px-2 text-center">{item.orders}</td>
                  <td className="py-3 px-2 text-right font-mono text-slate-600">{formatCurrency(item.shopGmv, currency)}</td>
                  <td className="py-3 px-2 text-center text-slate-500">{item.ctr}</td>
              </tr>
          ))}
          </tbody>
      </table>
    </div>
  </div>
);

const ReportView = ({ settings, summary, smartInsights, channelData, currency, processedProducts, setActiveView }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const [showSummary, setShowSummary] = useState(true);
  const [showAI, setShowAI] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [note, setNote] = useState('');
  const [pdfReady, setPdfReady] = useState(false);
  const reportRef = useRef(null);

  // Load html2pdf script dynamically
  useEffect(() => {
    if (window.html2pdf) {
        setPdfReady(true);
        return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => setPdfReady(true);
    document.body.appendChild(script);
  }, []);

  const handleDownloadPDF = () => {
      if(!pdfReady || !reportRef.current) return;
      
      const element = reportRef.current;
      const opt = {
        margin:       [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right
        filename:     `Quantro_Report_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      window.html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-100 overflow-auto animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center pt-8 pb-24">
      
      {/* Report Container (A4-ish look) */}
      <div 
        ref={reportRef} 
        id="printable-report"
        className="bg-white max-w-4xl w-full shadow-2xl min-h-[1100px] p-12 md:p-16 relative"
      >
        {/* Report Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-900 pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center text-white font-bold">Q</div>
                 <span className="text-xl font-bold tracking-tight text-slate-900">Quantro Analytics</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Executive Performance Report</h1>
            <p className="text-slate-500 font-medium">Prepared for: <span className="text-slate-900">{typeof settings.userName === 'string' ? settings.userName : 'Manager'}</span></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Generated On</p>
            <p className="text-lg font-semibold text-slate-800">{dateStr}</p>
          </div>
        </div>
        
        {/* Executive Summary */}
        {showSummary && (
        <section className="mb-12 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-violet-600 rounded-sm"></span> Executive Summary
          </h2>
          <div className="grid grid-cols-4 gap-4">
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Total Revenue</p>
                <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(summary.totalGmv, currency)}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Total Orders</p>
                <p className="text-2xl font-extrabold text-slate-900">{summary.totalOrders}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Avg Order Value</p>
                <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(summary.avgOrderValue, currency)}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Conversion Rate</p>
                <p className="text-2xl font-extrabold text-slate-900">{summary.conversionRate}</p>
             </div>
          </div>
        </section>
        )}

        {/* AI Strategic Analysis */}
        {showAI && (
        <section className="mb-12 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-600 rounded-sm"></span> AI Strategic Analysis
          </h2>
          <div className="space-y-4">
            {smartInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
              <div key={idx} className="flex gap-4 p-5 border border-slate-100 rounded-lg bg-white shadow-sm">
                 <div className={`p-3 rounded-full h-fit bg-${insight.color}-50 text-${insight.color}-700`}>
                    <Icon className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{insight.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{insight.text}</p>
                 </div>
              </div>
              );
            })}
          </div>
        </section>
        )}

        {/* Channel Breakdown */}
        {showChannels && (
        <section className="mb-12 break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-rose-600 rounded-sm"></span> Channel Performance
          </h2>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
              <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <th className="p-3 font-bold tracking-wider">Channel</th>
                  <th className="p-3 font-bold text-right tracking-wider">Revenue</th>
                  <th className="p-3 font-bold text-right tracking-wider">Contribution</th>
                  </tr>
              </thead>
              <tbody>
                  {[
                      { name: 'Shop Tab', val: channelData.shop, icon: ShoppingBag },
                      { name: 'Video Content', val: channelData.video, icon: Video },
                      { name: 'Live Streaming', val: channelData.live, icon: Eye }
                  ].map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-3">
                          <c.icon className="w-4 h-4 text-slate-400" />
                          {c.name}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-600 font-medium">{formatCurrency(c.val, currency)}</td>
                      <td className="p-3 text-right text-slate-500 font-medium">{(c.val / (summary.totalGmv || 1) * 100).toFixed(1)}%</td>
                  </tr>
                  ))}
              </tbody>
              </table>
          </div>
        </section>
        )}

        {/* Top Products Table */}
        <section className="break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-amber-500 rounded-sm"></span> Key Inventory Drivers (Class A)
          </h2>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
              <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <th className="p-3 font-bold tracking-wider">Product Name</th>
                  <th className="p-3 font-bold text-right tracking-wider">GMV</th>
                  <th className="p-3 font-bold text-center tracking-wider">Sold</th>
                  <th className="p-3 font-bold text-center tracking-wider">Status</th>
                  </tr>
              </thead>
              <tbody>
                  {processedProducts.filter(p => p.abcCategory === 'A').slice(0, 10).map((p, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="p-3 font-medium text-slate-800 truncate max-w-[300px]">{p.name}</td>
                      <td className="p-3 text-right font-mono text-slate-600 font-medium">{formatCurrency(p.gmv, currency)}</td>
                      <td className="p-3 text-center text-slate-600">{p.itemsSold}</td>
                      <td className="p-3 text-center"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">{p.status}</span></td>
                  </tr>
                  ))}
                  {processedProducts.filter(p => p.abcCategory === 'A').length === 0 && (
                      <tr>
                          <td colSpan="4" className="p-8 text-center text-slate-400 italic">No Class A products found in current filter.</td>
                      </tr>
                  )}
              </tbody>
              </table>
          </div>
        </section>

        {/* Printable Notes Display */}
        {note && (
            <section className="mt-8 break-inside-avoid">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-l-2 border-slate-300 pl-2">Executive Notes</h2>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 italic font-serif">
                    "{note}"
                </div>
            </section>
        )}
        
        <div className="mt-16 pt-8 border-t border-slate-200 text-center">
           <p className="text-slate-400 text-xs font-medium">Generated by Quantro Analytics • Confidential</p>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="fixed top-8 right-8 flex flex-col gap-4 print:hidden z-50">
          <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200 space-y-3 w-64">
             <h3 className="text-sm font-bold text-slate-900">Report Settings</h3>
             <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={showSummary} onChange={e => setShowSummary(e.target.checked)} className="accent-violet-600 rounded"/> Summary
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={showAI} onChange={e => setShowAI(e.target.checked)} className="accent-violet-600 rounded"/> AI Insights
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={showChannels} onChange={e => setShowChannels(e.target.checked)} className="accent-violet-600 rounded"/> Channels
            </label>
             <textarea 
                className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                rows="3"
                placeholder="Add notes..."
                value={note}
                onChange={e => setNote(e.target.value)}
            ></textarea>

            <div className="pt-2 flex flex-col gap-2">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={!pdfReady}
                  className="w-full py-2 bg-violet-600 text-white rounded-lg font-bold shadow-md hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" /> {pdfReady ? 'Download PDF' : 'Loading Engine...'}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button 
                    onClick={() => setActiveView('dashboard')}
                    className="w-full py-2 text-slate-400 text-xs hover:text-slate-600"
                >
                    Close Preview
                </button>
            </div>
          </div>
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
            margin: 0;
            box-shadow: none;
            padding: 0;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const SettingsView = ({ settings, setSettings, uploadedFiles, clearData, addNotification, visibleKPIs, setVisibleKPIs }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4">
     <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-violet-100 rounded-lg">
           <Settings className="w-6 h-6 text-violet-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Configuration</h2>
          <p className="text-sm text-slate-500">Customize how Quantro analyzes your data</p>
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">General Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
            <input 
              type="text" 
              value={settings.userName}
              onChange={(e) => setSettings({...settings, userName: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Currency Symbol</label>
            <div className="flex gap-2">
              {['฿', '$', '€', '£', '¥'].map(curr => (
                <button
                  key={curr}
                  onClick={() => setSettings({...settings, currency: curr})}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${settings.currency === curr ? 'bg-violet-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dashboard Customization</h3>
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Total GMV</span>
                  <input type="checkbox" checked={visibleKPIs.totalGMV} onChange={(e) => setVisibleKPIs({...visibleKPIs, totalGMV: e.target.checked})} className="accent-violet-600 w-5 h-5 rounded"/>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Avg Order Value</span>
                  <input type="checkbox" checked={visibleKPIs.avgOrderValue} onChange={(e) => setVisibleKPIs({...visibleKPIs, avgOrderValue: e.target.checked})} className="accent-violet-600 w-5 h-5 rounded"/>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Conversion Rate</span>
                  <input type="checkbox" checked={visibleKPIs.conversionRate} onChange={(e) => setVisibleKPIs({...visibleKPIs, conversionRate: e.target.checked})} className="accent-violet-600 w-5 h-5 rounded"/>
               </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Data Management</h3>
             
             {/* Data Sources List */}
             <div className="mb-4">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Loaded Data Sources</label>
                 {uploadedFiles.length === 0 ? (
                     <div className="text-sm text-slate-400 italic p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                         No files uploaded yet
                     </div>
                 ) : (
                     <div className="space-y-2">
                         {uploadedFiles.map((file, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                 <div className="flex items-center gap-2">
                                     <Database className="w-4 h-4 text-violet-600" />
                                     <span className="text-sm text-slate-700 font-medium">{typeof file === 'string' ? file : file.name}</span>
                                 </div>
                                 <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">Active</span>
                             </div>
                         ))}
                     </div>
                 )}
             </div>

             <button 
                onClick={clearData}
                className="w-full flex items-center justify-center gap-2 text-rose-600 hover:text-white hover:bg-rose-600 font-medium text-sm px-4 py-3 border border-rose-200 rounded-lg transition-colors"
             >
                <Trash2 className="w-4 h-4" /> Clear All Data Sources
             </button>
          </div>
        </div>

        {/* AI Thresholds */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Lightbulb className="w-4 h-4" /> Smart Assistant Thresholds
          </h3>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 High Traffic Threshold (Views)
                 <span className="text-xs text-slate-400 font-normal ml-2">Defines "Funnel Leak"</span>
              </label>
              <input 
                type="number" 
                value={settings.highViewThreshold}
                onChange={(e) => setSettings({...settings, highViewThreshold: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 Low Conversion Alert (%)
                 <span className="text-xs text-slate-400 font-normal ml-2">Alert if CVR falls below this</span>
              </label>
              <input 
                type="number" 
                step="0.1"
                value={settings.lowCvrThreshold}
                onChange={(e) => setSettings({...settings, lowCvrThreshold: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 Hidden Gem CVR (%)
                 <span className="text-xs text-slate-400 font-normal ml-2">Target CVR for opportunities</span>
              </label>
              <input 
                type="number" 
                step="0.1"
                value={settings.hiddenGemCvr}
                onChange={(e) => setSettings({...settings, hiddenGemCvr: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                 Dead Stock Threshold (Sales)
                 <span className="text-xs text-slate-400 font-normal ml-2">Items sold less than this</span>
              </label>
              <input 
                type="number" 
                value={settings.deadStockThreshold}
                onChange={(e) => setSettings({...settings, deadStockThreshold: parseInt(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
             <button 
                onClick={() => addNotification("Settings saved successfully")}
                className="flex items-center gap-2 bg-violet-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-violet-700 transition-transform active:scale-95"
             >
                <Save className="w-4 h-4" /> Save Changes
             </button>
          </div>
        </div>
     </div>
  </div>
);

const AboutView = () => (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white text-xl">Q</div>
                Quantro
            </h1>
            
            <div className="prose prose-violet max-w-none">
                <p className="text-lg text-slate-600 mb-8">
                    Quantro is an enterprise-grade analytics dashboard designed to solve the fragmentation of e-commerce data. We replace messy spreadsheets with a centralized intelligence hub.
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-violet-600" /> User Manual & Glossary
                </h3>
                
                <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Key Metrics</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><strong>GMV (Gross Merchandise Value):</strong> Total sales revenue before any deductions.</li>
                            <li><strong>CTR (Click-Through Rate):</strong> Percentage of people who saw your product and clicked on it.</li>
                            <li><strong>CVR (Conversion Rate):</strong> Percentage of visitors who actually bought the product.</li>
                        </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-2">Smart Analysis</h4>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><strong>ABC Analysis:</strong> 
                                <span className="ml-1 px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-bold">Class A</span> (Top 80% Revenue), 
                                <span className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold">Class B</span> (Next 15%), 
                                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold">Class C</span> (Bottom 5%).
                            </li>
                            <li><strong>Funnel Leak:</strong> High views but low sales. Usually means price or description issues.</li>
                            <li><strong>Hidden Gem:</strong> Low views but high conversion. Needs more traffic (Ads/Live).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const LandingPage = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulated hardcoded credential check for "generated" password
        if (password === 'admin123') {
            onLogin(name || 'Manager');
        } else {
            alert("Invalid Access Key. Please use 'admin123' for the demo.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row min-h-[600px]">
                
                {/* LEFT PANEL: Value Prop & Visuals */}
                <div className="p-12 md:w-3/5 flex flex-col justify-center bg-gradient-to-br from-violet-600 to-indigo-900 text-white relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-xl font-bold border border-white/30">Q</div>
                            <span className="font-bold text-lg tracking-wide opacity-90">QUANTRO INTELLIGENCE</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Stop Losing Profit to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">Hidden Data.</span>
                        </h1>
                        
                        <p className="text-lg text-violet-100 mb-10 leading-relaxed max-w-lg">
                            Aggregate TikTok, Lazada, and Shopee sales in one view. See lifetime value, true net profit, and inventory leaks instantly—without the spreadsheet chaos.
                        </p>

                        {/* Visual Proof / Mock Card */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 max-w-md transform hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-violet-200 mb-1">Lifetime GMV (All Channels)</p>
                                    <p className="text-3xl font-bold text-white">฿8,245,000</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-emerald-300 text-sm font-bold bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                                        <TrendingUp className="w-3 h-3" /> +24%
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-violet-200 uppercase font-bold tracking-wide">
                                    <span>Market Share</span>
                                </div>
                                <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden flex">
                                    <div className="w-[45%] bg-emerald-400"></div>
                                    <div className="w-[30%] bg-blue-400"></div>
                                    <div className="w-[25%] bg-rose-400"></div>
                                </div>
                                <div className="flex justify-between mt-1 text-[10px] text-violet-200 font-medium">
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>TikTok Shop</div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>Shopee</div>
                                    <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>Lazada</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-violet-100">
                            <div className="flex items-start gap-3 group">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span><strong>Lifetime History:</strong> Break free from the 90-day platform limit.</span>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span><strong>True Profit:</strong> Auto-deduct Ads, Fees, and COGS in real-time.</span>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span><strong>Funnel Doctor:</strong> Identify "Hidden Gems" and "Funnel Leaks" automatically.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Demo Access */}
                <div className="p-12 md:w-2/5 bg-white flex flex-col justify-center relative">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">See Quantro in Action</h2>
                            <p className="text-slate-500">Instant access to the live demo environment.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Organization Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                    <input 
                                        type="text" 
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Company Name"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Demo Access Key</label>
                                    <span className="text-xs text-violet-700 bg-violet-50 px-2 py-0.5 rounded font-mono font-bold border border-violet-100">key: admin123</span>
                                </div>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                    <input 
                                        type="password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Access Key"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                Launch Demo Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <p className="text-center text-xs text-slate-400 mt-4">
                                <span className="flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" /> No credit card required for demo.
                                </span>
                            </p>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <p className="text-xs text-center text-slate-400 font-medium uppercase tracking-wide mb-4">Trusted by Sellers On</p>
                            <div className="flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-1.5 group cursor-default">
                                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors"><Smartphone className="w-4 h-4 text-slate-600" /></div>
                                    <span className="font-bold text-sm text-slate-600">TikTok</span>
                                </div>
                                <div className="flex items-center gap-1.5 group cursor-default">
                                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors"><ShoppingBag className="w-4 h-4 text-slate-600" /></div>
                                    <span className="font-bold text-sm text-slate-600">Shopee</span>
                                </div>
                                <div className="flex items-center gap-1.5 group cursor-default">
                                    <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors"><Globe className="w-4 h-4 text-slate-600" /></div>
                                    <span className="font-bold text-sm text-slate-600">Lazada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
  const [activeView, setActiveView] = useState('dashboard'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [platformFilter, setPlatformFilter] = useState('All'); 
  const [sortConfig, setSortConfig] = useState({ key: 'gmv', direction: 'desc' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isExcelReady, setIsExcelReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(() => {
      try {
          const savedFiles = localStorage.getItem('shopProFiles');
          return savedFiles ? JSON.parse(savedFiles) : [];
      } catch (e) {
          return [];
      }
  }); 
  const [timePeriod, setTimePeriod] = useState('All Time'); 
  const [profileOpen, setProfileOpen] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth state on load
  useEffect(() => {
      const auth = localStorage.getItem('shopProAuth');
      if (auth) setIsAuthenticated(true);
  }, []);

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
        userName: 'Manager'
      };
    } catch (e) {
      return {
        currency: '฿',
        highViewThreshold: 500,
        lowCvrThreshold: 0.5,
        hiddenGemCvr: 3.0,
        deadStockThreshold: 0,
        userName: 'Manager'
      };
    }
  });

  // Custom KPI Visibility State
  const [visibleKPIs, setVisibleKPIs] = useState(() => {
    try {
      const saved = localStorage.getItem('shopProKPIs');
      return saved ? JSON.parse(saved) : {
        totalGMV: true,
        avgOrderValue: true,
        conversionRate: true
      };
    } catch(e) {
      return { totalGMV: true, avgOrderValue: true, conversionRate: true };
    }
  });

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

  // Persistent Product State
  const [products, setProducts] = useState(() => {
    try {
        const savedProducts = localStorage.getItem('shopProProducts');
        return savedProducts ? JSON.parse(savedProducts) : initialProducts;
    } catch (e) {
        return initialProducts;
    }
  });

  // Persistent Campaigns State
  const [campaigns, setCampaigns] = useState(() => {
      try {
          const saved = localStorage.getItem('shopProCampaigns');
          return saved ? JSON.parse(saved) : [];
      } catch(e) { return []; }
  });

  const fileInputRef = useRef(null);
  const profileRef = useRef(null); 

  // --- Effects to Save State ---

  useEffect(() => {
    localStorage.setItem('shopProSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('shopProKPIs', JSON.stringify(visibleKPIs));
  }, [visibleKPIs]);

  useEffect(() => {
    localStorage.setItem('shopProProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopProFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    localStorage.setItem('shopProCampaigns', JSON.stringify(campaigns));
  }, [campaigns]); 

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  // Load XLSX Script Dynamically
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

  // --- Helpers that need state access ---

  const addNotification = (msg, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLogin = (name) => {
      setSettings(prev => ({...prev, userName: name}));
      setIsAuthenticated(true);
      localStorage.setItem('shopProAuth', 'true');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('shopProAuth');
      setProfileOpen(false);
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
    else if (headers.some(h => h.includes('amazon') || h.includes('asin'))) detectedPlatform = 'Amazon';

    addNotification(`Detected Platform: ${detectedPlatform}`);

    const findVal = (row, keywords) => {
      const key = Object.keys(row).find(k => keywords.some(kw => k.toLowerCase().includes(kw)));
      return key ? row[key] : null;
    };

    return jsonData.map((row, index) => {
      const id = findVal(row, ['product id', 'item id', 'id', 'sku', 'asin', 'variation id']) || `gen-${index}`;
      const name = findVal(row, ['product name', 'item name', 'product', 'title']) || 'Unknown Product';
      const status = findVal(row, ['status', 'product status']) || 'Active';

      const gmv = parseCurrency(findVal(row, ['gmv', 'revenue', 'total sales', 'sales', 'amount', 'ordered product sales']));
      const sold = parseCurrency(findVal(row, ['items sold', 'units sold', 'sold', 'quantity', 'units']));
      const orders = parseCurrency(findVal(row, ['orders', 'total orders']));
      const views = parseCurrency(findVal(row, ['views', 'page view', 'impressions', 'sessions', 'visitors']));
      
      const shopGmv = parseCurrency(findVal(row, ['shop tab gmv', 'mall sales']));
      const videoGmv = parseCurrency(findVal(row, ['video gmv', 'content sales']));
      const liveGmv = parseCurrency(findVal(row, ['live gmv', 'livestream sales']));

      let ctr = findVal(row, ['click-through', 'ctr']);
      let cvr = findVal(row, ['conversion rate', 'cvr', 'conversion']);
      
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

    if (uploadedFiles.some(f => (typeof f === 'string' ? f : f.name) === file.name)) {
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

        // Flexible header search
        for(let i = 0; i < Math.min(25, rawRows.length); i++) {
           const rowStr = rawRows[i].map(cell => String(cell).toLowerCase().trim()).join(' ');
           // Expanded keywords for detection
           if ((rowStr.includes('product') || rowStr.includes('sku') || rowStr.includes('asin') || rowStr.includes('title')) && 
               (rowStr.includes('gmv') || rowStr.includes('sales') || rowStr.includes('revenue') || rowStr.includes('price'))) {
               headerRowIndex = i;
               headers = rawRows[i].map(h => String(h)); 
               break;
           }
        }

        if (headerRowIndex === -1) {
             throw new Error("Could not find valid headers (Product/SKU/ASIN + Sales/GMV). Please check the file structure.");
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
        if (normalized.length === 0) throw new Error("Data normalization failed. Ensure columns like 'Product Name' and 'GMV' exist.");

        setProducts(prevProducts => {
            const productMap = new Map();
            prevProducts.forEach(p => productMap.set(p.id, p));
            normalized.forEach(p => productMap.set(p.id, p));
            const merged = Array.from(productMap.values());
            return calculateABC(merged);
        });

        // Store file metadata for Calendar
        setUploadedFiles(prev => {
            const newFile = { name: file.name, date: new Date().toISOString() };
            // Filter out old string-only entries if mixing or if re-uploading same name
            const filtered = prev.filter(f => (typeof f === 'string' ? f : f.name) !== file.name);
            return [...filtered, newFile];
        });
        
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
      'Product ID', 'Name', 'Platform', 'Source File', 'Status', 'Class', 'Health', 'Segment', 'GMV', 'Orders', 'Sold', 
      'Shop GMV', 'Shop Views', 'Video GMV', 'Video Views', 'Live GMV', 'Live Views', 'CTR', 'CVR'
    ];

    const csvContent = [
      headers.join(','),
      ...processedProducts.map(p => [
        `"${p.id}"`, `"${p.name.replace(/"/g, '""')}"`, p.platform, `"${p.sourceFile || ''}"`, p.status, p.abcCategory, p.healthScore, p.segment,
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
          localStorage.removeItem('shopProProducts');
          localStorage.removeItem('shopProFiles');
          addNotification("All data cleared");
      }
  };

  // --- Derived State & Data Science Logic ---

  const { processedProducts, benchmarks, opportunityValue } = useMemo(() => {
    let data = [...products];
    if (statusFilter !== 'All') data = data.filter(p => p.status === statusFilter);
    if (platformFilter !== 'All') data = data.filter(p => p.platform === platformFilter);
    
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(lowerTerm) || p.id.includes(lowerTerm));
    }

    // 1. Calculate Benchmarks (Global Averages)
    const validItems = data.filter(p => p.gmv > 0);
    const totalItems = validItems.length || 1;
    const avgCvr = validItems.reduce((sum, p) => sum + parsePercent(p.cvr), 0) / totalItems;
    const avgCtr = validItems.reduce((sum, p) => sum + parsePercent(p.ctr), 0) / totalItems;
    const avgViews = validItems.reduce((sum, p) => sum + (p.shopViews || 0) + (p.videoViews || 0) + (p.liveViews || 0), 0) / totalItems;
    
    // 2. Enrich Data with Scores & Segments
    let totalOpportunity = 0;

    data = data.map(p => {
        const cvrNum = parsePercent(p.cvr);
        const ctrNum = parsePercent(p.ctr);
        const totalViews = (p.shopViews || 0) + (p.videoViews || 0) + (p.liveViews || 0);
        const impliedPrice = p.itemsSold > 0 ? p.gmv / p.itemsSold : 0;

        // Health Score (0-100)
        // Weighted: GMV (40%), CVR vs Avg (30%), CTR vs Avg (30%)
        // Normalized GMV score is rudimentary here based on log scale
        let gmvScore = Math.min((Math.log10(p.gmv + 1) / 5) * 100, 100); 
        let cvrScore = Math.min((cvrNum / (avgCvr || 1)) * 50, 100);
        let ctrScore = Math.min((ctrNum / (avgCtr || 1)) * 50, 100);
        
        const healthScore = Math.round((gmvScore * 0.4) + (cvrScore * 0.3) + (ctrScore * 0.3));

        // Segment Logic
        let segment = "Standard";
        if (healthScore >= 80) segment = "Star Winner";
        else if (totalViews > avgViews && cvrNum < avgCvr) segment = "Optimize (High View/Low CVR)";
        else if (totalViews < avgViews && cvrNum > avgCvr) segment = "Hidden Gem";
        else if (healthScore < 30) segment = "At Risk";

        // Opportunity Calculation (What if CVR was average?)
        let potentialRevenue = 0;
        if (cvrNum < avgCvr && totalViews > 100) {
            const missedSales = ((avgCvr - cvrNum) / 100) * totalViews;
            potentialRevenue = missedSales * impliedPrice;
            totalOpportunity += potentialRevenue;
        }

        return { 
            ...p, 
            healthScore, 
            segment, 
            cvrNum, 
            ctrNum,
            potentialRevenue 
        };
    });
    
    // Sorting
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

    return { 
        processedProducts: data, 
        benchmarks: { avgCvr, avgCtr, avgViews },
        opportunityValue: totalOpportunity
    };
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
    const classA = processedProducts.filter(p => p.abcCategory === 'A');
    
    // 1. Pareto Analysis
    if (classA.length > 0) {
        const percentCount = Math.round((classA.length / processedProducts.length) * 100);
        insights.push({
            type: 'strategic',
            title: 'Pareto Strategy',
            text: `Top ${percentCount}% of products (Class A) drive 80% of revenue. Keep these in stock.`,
            icon: PieChart,
            color: 'indigo'
        });
    }

    // 2. Hidden Gems Identification (Data Science)
    const hiddenGems = processedProducts.filter(p => p.segment === "Hidden Gem");
    if (hiddenGems.length > 0) {
        insights.push({
            type: 'opportunity',
            title: 'Hidden Gems Found',
            text: `${hiddenGems.length} products have high conversion but low traffic. Consider running ads or live streams for these items.`,
            icon: Zap,
            color: 'emerald'
        });
    }

    // 3. Optimization Targets
    const leakageItems = processedProducts.filter(p => p.segment === "Optimize (High View/Low CVR)");
    if (leakageItems.length > 0) {
        insights.push({
            type: 'opportunity',
            title: 'Fix Funnel Leaks',
            text: `${leakageItems.length} products have high traffic but poor conversion. Check pricing, images, and reviews.`,
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
  }, [processedProducts, settings]);

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

  // --- RENDERING ---

  if (!isAuthenticated) {
      return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 font-sans text-slate-800 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden h-full flex flex-col md:flex-row border border-slate-200">
            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                smartInsights={smartInsights} 
                fileInputRef={fileInputRef} 
                handleFileUpload={handleFileUpload} 
            />

            <div className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden scrollbar-hide relative bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 sticky top-0 z-20 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-sm border border-slate-100 transition-all">
                <div>
                  <p className="text-violet-600 font-bold text-sm mb-1 tracking-wide uppercase opacity-80">
                    {activeView === 'dashboard' ? 'Overview' : activeView === 'inventory' ? 'Management' : activeView === 'reports' ? 'Documentation' : activeView === 'settings' ? 'System' : 'Module'}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm capitalize">
                    {activeView === 'dashboard' ? 'Quantro Intelligence' : activeView}
                  </h2>
                </div>
                <div className="flex items-center gap-4 self-end md:self-auto">
                   
                   {/* Profile Dropdown */}
                   <div className="relative" ref={profileRef}>
                      <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-3 pl-4 border-l-2 border-slate-100 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 font-bold border-2 border-white shadow-sm ring-2 ring-violet-50">
                            {typeof settings.userName === 'string' ? settings.userName.charAt(0) : 'Q'}
                        </div>
                        <div className="hidden sm:block leading-tight text-left">
                            <p className="font-bold text-slate-700 text-sm">{typeof settings.userName === 'string' ? settings.userName : 'Manager'}</p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: 883921</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {profileOpen && (
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                  <p className="text-xs font-bold text-slate-400 uppercase">Account</p>
                              </div>
                              <button 
                                onClick={() => { setActiveView('settings'); setProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                  <Settings className="w-4 h-4" /> Configuration
                              </button>
                              <button 
                                onClick={() => { setActiveView('about'); setProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                  <BookOpen className="w-4 h-4" /> User Manual
                              </button>
                              <div className="border-t border-slate-50 mt-1 pt-1">
                                <button 
                                  onClick={handleLogout}
                                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                              </div>
                          </div>
                      )}
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
                    visibleKPIs={visibleKPIs}
                    opportunityValue={opportunityValue}
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
              {activeView === 'media' && <MediaView products={processedProducts} currency={settings.currency} />}
              {activeView === 'campaigns' && (
                  <CampaignView 
                      products={products} 
                      currency={settings.currency} 
                      campaigns={campaigns} 
                      setCampaigns={setCampaigns}
                  />
              )}
              {activeView === 'calendar' && (
                  <CalendarView 
                      uploadedFiles={uploadedFiles} 
                      campaigns={campaigns} 
                  />
              )}
              {activeView === 'finance' && <FinanceView products={processedProducts} currency={settings.currency} campaigns={campaigns} />}
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
                    visibleKPIs={visibleKPIs}
                    setVisibleKPIs={setVisibleKPIs}
                />
              )}
              {activeView === 'about' && <AboutView />}
            </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 space-y-2 z-50">
         {notifications.map(n => (
           <div key={n.id} className={`text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in ${n.type === 'error' ? 'bg-red-600' : 'bg-slate-800'}`}>
              {n.type === 'error' ? <AlertTriangle className="w-5 h-5 text-white" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {n.msg}
           </div>
         ))}
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} currency={settings.currency} benchmarks={benchmarks} />}
    </div>
  );
}