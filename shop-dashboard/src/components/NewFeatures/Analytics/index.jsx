import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Target, Activity, DollarSign, PieChart, Layers, Download } from 'lucide-react';
import * as analyticsUtils from '../../../utils/analyticsUtils';
import PlatformFilter from '../../PlatformFilter';

// Sub-Components
import AnalyticsOverview from './AnalyticsOverview';
import CohortAnalysis from './CohortAnalysis';
import RFMAnalysis from './RFMAnalysis';
import PredictiveAnalytics from './PredictiveAnalytics';
import FinancialMetrics from './FinancialMetrics';
import ConsumerInsights from './ConsumerInsights';

export default function AdvancedAnalyticsView({
    products = [],
    platformFilter = 'All',
    setPlatformFilter = () => { },
    availablePlatforms = [],
    currency = '฿',
    summary = {},
    searchTerm = '',
    channelData,
    setSelectedProduct = () => { }
}) {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeFrame, setTimeFrame] = useState('monthly');

    // Filter Products
    const filteredProducts = useMemo(() => {
        let data = products;
        if (platformFilter !== 'All') data = data.filter(p => p.platform === platformFilter);
        if (!searchTerm) return data;
        return data.filter(p =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id?.toString().includes(searchTerm)
        );
    }, [products, searchTerm, platformFilter]);

    // --- Calculations ---
    const cohortData = useMemo(() => analyticsUtils.performCohortAnalysis(filteredProducts, timeFrame), [filteredProducts, timeFrame]);
    const rfmData = useMemo(() => analyticsUtils.performRFMAnalysis(filteredProducts), [filteredProducts]);
    const predictionData = useMemo(() => analyticsUtils.predictProductPerformance(filteredProducts), [filteredProducts]);
    const anomalyData = useMemo(() => analyticsUtils.detectAnomalies(filteredProducts), [filteredProducts]);
    const profitabilityData = useMemo(() => analyticsUtils.analyzeProfitability(filteredProducts), [filteredProducts]);
    const cashflowData = useMemo(() => analyticsUtils.analyzeCashFlow(filteredProducts), [filteredProducts]);
    const breakevenData = useMemo(() => analyticsUtils.calculateBreakEven(filteredProducts), [filteredProducts]);
    const segmentData = useMemo(() => analyticsUtils.segmentCustomers(filteredProducts), [filteredProducts]);
    const clvData = useMemo(() => analyticsUtils.calculateCustomerLifetimeValue(filteredProducts), [filteredProducts]);
    const churnData = useMemo(() => analyticsUtils.predictChurnRisk(filteredProducts), [filteredProducts]);

    // --- NEW SMART ANALYTICS ---
    const trendData = useMemo(() => analyticsUtils.performTrendAnalysis(filteredProducts), [filteredProducts]);
    const smartInsights = useMemo(() => analyticsUtils.generateSmartInsights(filteredProducts, trendData), [filteredProducts, trendData]);
    const salesForecast = useMemo(() => analyticsUtils.forecastSales(filteredProducts), [filteredProducts]);

    const handleExport = () => {
        if (!filteredProducts.length) return;

        const headers = ['ID', 'Name', 'GMV', 'Orders', 'Views', 'Platform', 'Status', 'Segment'].join(',');
        const rows = filteredProducts.map(p =>
            `${p.id},"${p.name.replace(/"/g, '""')}",${p.gmv},${p.orders},${p.shopViews || 0},${p.platform},${p.status},${p.segment || ''}`
        ).join('\n');

        const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `quantro_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'cohort', label: 'Cohort', icon: BarChart3 },
        { id: 'rfm', label: 'RFM', icon: Users },
        { id: 'predictive', label: 'Predictive', icon: TrendingUp },
        { id: 'financial', label: 'Financial', icon: DollarSign },
        { id: 'insights', label: 'Insights', icon: PieChart },
    ];

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics+</h2>
                    <p className="text-slate-500 text-sm">Advanced Data Science & Financial Modeling</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors text-sm"
                    >
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center overflow-x-auto max-w-[100vw]">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <PlatformFilter
                    value={platformFilter}
                    onChange={setPlatformFilter}
                    availablePlatforms={availablePlatforms}
                />
                {activeTab === 'cohort' && (
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        {['weekly', 'monthly'].map(tf => (
                            <button
                                key={tf}
                                onClick={() => setTimeFrame(tf)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeFrame === tf ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                            >
                                {tf.charAt(0).toUpperCase() + tf.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    <AnalyticsOverview
                        products={filteredProducts}
                        currency={currency}
                        summary={summary}
                        channelData={channelData}
                        // NEW PROPS
                        trends={trendData}
                        insights={smartInsights}
                        forecast={salesForecast}
                    />
                )}

                {activeTab === 'cohort' && (
                    <CohortAnalysis
                        cohortAnalysis={cohortData}
                        timeFrame={timeFrame}
                        currency={currency}
                    />
                )}

                {activeTab === 'rfm' && (
                    <RFMAnalysis
                        rfmAnalysis={rfmData}
                        totalProducts={filteredProducts.length}
                    />
                )}

                {activeTab === 'predictive' && (
                    <PredictiveAnalytics
                        predictions={predictionData}
                        anomalies={anomalyData}
                        currency={currency}
                    />
                )}

                {activeTab === 'financial' && (
                    <FinancialMetrics
                        profitability={profitabilityData}
                        cashflow={cashflowData}
                        breakeven={breakevenData}
                        currency={currency}
                    />
                )}

                {activeTab === 'insights' && (
                    <ConsumerInsights
                        segments={segmentData}
                        clv={clvData}
                        churn={churnData}
                        currency={currency}
                        insights={smartInsights}
                        products={filteredProducts} // Passing full product list for customer data
                    />
                )}
            </div>
        </div>
    );
}
