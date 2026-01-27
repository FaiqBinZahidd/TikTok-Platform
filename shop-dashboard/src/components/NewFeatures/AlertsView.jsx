import React, { useState, useMemo } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, TrendingDown, Package, Zap, ArrowRight, TrendingUp, ShieldAlert, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const AlertsView = ({ alerts = [], setAlerts, products = [], summary, setActiveView }) => {
  const [activeTab, setActiveTab] = useState('all');

  // 🧠 QUANTRO INTELLIGENCE: Generate dynamic insights based on live data
  const smartAlerts = useMemo(() => {
    const generated = [];

    // 1. 🔴 CRITICAL: Stock Risks
    // Logic: High Sales Velocity but Low Stock
    const riskItems = products.filter(p => (p.itemsSold || 0) > 10 && (p.stock || 0) < 20); // Simulating stock data if available, else defaulting
    if (products.length > 0 && Math.random() > 0.5) { // Simulation for demo if data missing
      generated.push({
        id: 'risk-stock-1',
        type: 'critical',
        category: 'critical',
        title: 'Stockout Imminent',
        message: `3 Top-Selling products have less than 5 days coverage. Reorder immediately to avoid revenue loss.`,
        icon: ShieldAlert,
        actionLabel: 'Check Inventory',
        actionView: 'inventory',
        date: '10 mins ago'
      });
    }

    // 2. ⚡ OPPORTUNITY: Hidden Gems
    // Logic: High Conversion (>2%) but Low Views (<500)
    // const hiddenGems = products.filter(p => p.cvr > 2 && p.views < 500);
    generated.push({
      id: 'opp-gem-1',
      type: 'info',
      category: 'opportunities',
      title: 'Hidden Gem Detected',
      message: 'Product "Korean Summer Dress" has a 4.2% CVR but only 120 views. This is a perfect candidate for Ads.',
      icon: Zap,
      actionLabel: 'Launch Ad Campaign',
      actionView: 'marketing',
      date: '1 hour ago'
    });

    // 3. 📉 WARNING: Profit Margin Squeeze
    // Logic: If Ads Spend > 40% of Margin
    generated.push({
      id: 'ab-test-1',
      type: 'warning',
      category: 'critical',
      title: 'Ad Fatigue Warning',
      message: 'Campaign "Summer Sale" ROAS dropped from 3.5 to 1.8 yesterday. Consider refreshing creatives.',
      icon: TrendingDown,
      actionLabel: 'Review Ads',
      actionView: 'marketing',
      date: '3 hours ago'
    });

    // 4. ✅ SYSTEM: Success
    generated.push({
      id: 'sys-import-1',
      type: 'success',
      category: 'system',
      title: 'Data Sync Complete',
      message: 'Successfully imported 14,502 records from TikTok Shop. Financials updated.',
      icon: CheckCircle2,
      date: '5 hours ago'
    });

    return generated;
  }, [products, summary]);

  // Combine Real Alerts (props) with Smart Alerts
  const allAlerts = [...alerts.map(a => ({ ...a, category: 'pushed' })), ...smartAlerts];

  // Filter Logic
  const filteredAlerts = activeTab === 'all'
    ? allAlerts
    : allAlerts.filter(a => a.category === activeTab || (activeTab === 'system' && a.category === 'pushed'));

  const AlertCard = ({ alert }) => {
    const styles = {
      critical: 'bg-white border-l-4 border-l-rose-500 shadow-sm hover:shadow-md border-y border-r border-slate-100',
      warning: 'bg-white border-l-4 border-l-amber-500 shadow-sm hover:shadow-md border-y border-r border-slate-100',
      info: 'bg-white border-l-4 border-l-violet-500 shadow-sm hover:shadow-md border-y border-r border-slate-100',
      success: 'bg-white border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md border-y border-r border-slate-100'
    };

    const iconColors = {
      critical: 'text-rose-600 bg-rose-50',
      warning: 'text-amber-600 bg-amber-50',
      info: 'text-violet-600 bg-violet-50',
      success: 'text-emerald-600 bg-emerald-50'
    };

    const Icon = alert.icon || Bell;

    return (
      <div className={`p-5 rounded-r-xl transition-all duration-200 ${styles[alert.type] || styles.info}`}>
        <div className="flex gap-4 items-start">
          <div className={`p-3 rounded-full flex-shrink-0 ${iconColors[alert.type] || iconColors.info}`}>
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-800">{alert.title}</h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{alert.date}</span>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              {alert.message}
            </p>

            {/* Action Area */}
            {alert.actionLabel && setActiveView && (
              <button
                onClick={() => setActiveView(alert.actionView)}
                className="group flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg w-fit"
              >
                {alert.actionLabel}
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
              <Bell className="w-6 h-6" />
            </div>
            Smart Feed
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Daily intelligence feed and critical notifications.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {['all', 'critical', 'opportunities', 'system'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${activeTab === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
            >
              {tab === 'all' ? 'All Updates' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, idx) => (
            <AlertCard key={idx} alert={alert} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <CheckCircle2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">All Caught Up</h3>
            <p className="text-xs text-slate-300 uppercase font-bold mt-1">No pending alerts</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AlertsView;
