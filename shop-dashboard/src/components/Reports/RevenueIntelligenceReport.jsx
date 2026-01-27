import React, { useMemo, useState } from 'react';
import { TrendingUp, DollarSign, Zap, AlertCircle, CheckCircle, Filter, Download, ArrowRight, Lock, Package, ShoppingCart, BarChart3 } from 'lucide-react';
import { generateRevenueRecommendations, SEVERITY, REC_TYPES } from '../../utils/revenueRecommendations';
import { generateProRecommendations } from '../../utils/proRecommendations';
import { getUserPlan, PLANS, canAccessFeature } from '../../utils/systemRole';
import UpgradePrompt from '../UpgradePrompt';

const RevenueIntelligenceReport = ({
    products = [],
    summary = {},
    channelData = {},
    currency = '$',
    settings = {}
}) => {
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');

    const userPlan = getUserPlan(settings);
    const isPro = userPlan === PLANS.PRO;

    // Generate all recommendations (basic + Pro if applicable)
    const allRecommendations = useMemo(() => {
        const basicRecs = generateRevenueRecommendations(products, summary, channelData);

        if (isPro) {
            const proRecs = generateProRecommendations(products, summary, channelData);
            return [...basicRecs, ...proRecs].sort((a, b) => {
                const severityOrder = { urgent: 5, critical: 4, high: 3, medium: 2, low: 1 };
                const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
                if (severityDiff !== 0) return severityDiff;
                return b.estimatedImpactValue - a.estimatedImpactValue;
            });
        }

        return basicRecs;
    }, [products, summary, channelData, isPro]);

    // Filter recommendations
    const filteredRecommendations = useMemo(() => {
        let filtered = allRecommendations;

        if (filterType !== 'all') {
            filtered = filtered.filter(rec => rec.type === filterType);
        }

        if (filterSeverity !== 'all') {
            filtered = filtered.filter(rec => rec.severity === filterSeverity);
        }

        return filtered;
    }, [allRecommendations, filterType, filterSeverity]);

    // Calculate summary stats
    const totalPotentialRevenue = useMemo(() =>
        allRecommendations.reduce((sum, rec) => sum + (rec.estimatedImpactValue || 0), 0),
        [allRecommendations]
    );

    const urgentCount = allRecommendations.filter(r => r.severity === SEVERITY.URGENT).length;
    const criticalCount = allRecommendations.filter(r => r.severity === SEVERITY.CRITICAL).length;

    // Severity styling
    const getSeverityStyle = (severity) => {
        const styles = {
            urgent: 'bg-red-50 border-red-200 text-red-700',
            critical: 'bg-orange-50 border-orange-200 text-orange-700',
            high: 'bg-violet-50 border-violet-200 text-violet-700',
            medium: 'bg-blue-50 border-blue-200 text-blue-700',
            low: 'bg-slate-50 border-slate-200 text-slate-700'
        };
        return styles[severity] || styles.medium;
    };

    const getSeverityIcon = (severity) => {
        if (severity === SEVERITY.URGENT || severity === SEVERITY.CRITICAL) {
            return AlertCircle;
        }
        return TrendingUp;
    };

    // Type icons
    const getTypeIcon = (type) => {
        const icons = {
            [REC_TYPES.RESTOCK]: Package,
            [REC_TYPES.CLEARANCE]: ShoppingCart,
            [REC_TYPES.PRICING]: DollarSign,
            [REC_TYPES.MARKETING]: BarChart3,
            [REC_TYPES.CROSSSELL]: Zap
        };
        return icons[type] || TrendingUp;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Revenue Intelligence</h1>
                    <p className="text-slate-500 mt-1">Actionable recommendations to grow your business</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm">Revenue Opportunity</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{currency}{Math.round(totalPotentialRevenue).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">Potential monthly impact</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm">Urgent Actions</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{urgentCount + criticalCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Require immediate attention</p>
                </div>

                <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <CheckCircle className="w-5 h-5 text-violet-600" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-sm">Total Insights</h3>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{allRecommendations.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Opportunities identified</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">Filter:</span>
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All Types</option>
                        <option value={REC_TYPES.RESTOCK}>Restocking</option>
                        <option value={REC_TYPES.CLEARANCE}>Clearance</option>
                        <option value={REC_TYPES.PRICING}>Pricing</option>
                        <option value={REC_TYPES.MARKETING}>Marketing</option>
                        <option value={REC_TYPES.CROSSSELL}>Cross-Sell</option>
                    </select>

                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    >
                        <option value="all">All Severities</option>
                        <option value={SEVERITY.URGENT}>Urgent</option>
                        <option value={SEVERITY.CRITICAL}>Critical</option>
                        <option value={SEVERITY.HIGH}>High</option>
                        <option value={SEVERITY.MEDIUM}>Medium</option>
                    </select>

                    <span className="ml-auto text-xs text-slate-400">{filteredRecommendations.length} results</span>
                </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
                {filteredRecommendations.length > 0 ? (
                    filteredRecommendations.map((rec, idx) => {
                        const SeverityIcon = getSeverityIcon(rec.severity);
                        const TypeIcon = getTypeIcon(rec.type);
                        const isLocked = !isPro && idx >= 3; // Starter sees first 3 only

                        return (
                            <div
                                key={rec.id}
                                className={`bg-white border rounded-2xl overflow-hidden transition-all ${isLocked ? 'opacity-60' : 'hover:shadow-md'
                                    }`}
                            >
                                <div className={`border-l-4 p-6 ${getSeverityStyle(rec.severity).replace('bg-', 'border-l-')}`}>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-lg ${getSeverityStyle(rec.severity)}`}>
                                                    <TypeIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-black text-slate-900">{rec.title}</h3>
                                                        {isLocked && <Lock className="w-4 h-4 text-slate-400" />}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getSeverityStyle(rec.severity)}`}>
                                                            {rec.severity.toUpperCase()}
                                                        </span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500 capitalize">{rec.type}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {!isLocked ? (
                                                <>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">What's Happening</p>
                                                            <p className="text-sm text-slate-700">{rec.problem}</p>
                                                        </div>

                                                        {isPro && rec.solution && (
                                                            <div className="bg-slate-50 rounded-lg p-3">
                                                                <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Recommended Action</p>
                                                                <p className="text-sm text-slate-800 font-medium">{rec.solution}</p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-2">
                                                            <SeverityIcon className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm font-bold text-green-600">{rec.estimatedImpact}</span>
                                                            <span className="text-xs text-slate-400">• Confidence: {rec.confidence}</span>
                                                        </div>
                                                    </div>

                                                    {!isPro && rec.solution && (
                                                        <div className="mt-4">
                                                            <UpgradePrompt feature="detailedFixes" variant="inline" />
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="mt-3">
                                                    <UpgradePrompt feature="detailedFixes" variant="inline" />
                                                </div>
                                            )}
                                        </div>

                                        {!isLocked && isPro && (
                                            <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg text-sm font-bold hover:from-violet-700 hover:to-fuchsia-700 transition-all flex items-center gap-2 shadow-lg shadow-violet-200">
                                                Take Action
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">All Clear!</h3>
                        <p className="text-slate-500">No urgent actions needed. Your business is running smoothly.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueIntelligenceReport;
