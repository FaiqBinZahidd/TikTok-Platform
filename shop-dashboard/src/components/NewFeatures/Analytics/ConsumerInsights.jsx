import React from 'react';
import { Target, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatUtils';

const ConsumerInsights = ({ segments, clv, churn, currency, insights, products }) => {
    if (!segments || !clv || !churn) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Strategic Advisory */}
            {(insights && insights.length > 0) && (
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-[24px] border border-indigo-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-200">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        Strategic Advisory
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => {
                            const getIconByType = (type) => {
                                switch (type) {
                                    case 'warning': return AlertCircle;
                                    case 'risk': return AlertCircle;
                                    case 'opportunity': return TrendingUp;
                                    default: return Target;
                                }
                            };

                            const Icon = insight.icon || getIconByType(insight.type);
                            return (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100/50 flex gap-4">
                                    <div className="p-2 h-fit bg-slate-50 rounded-lg text-slate-600">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{insight.title}</p>
                                        <p className="text-sm text-slate-600 leading-relaxed mt-1">{insight.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Segmentation & Groups */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Target className="w-6 h-6 text-indigo-600" />
                    </div>
                    Product Performance Segments
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {segments.segments?.map((segment, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-[20px] hover:shadow-md transition-shadow">
                            <p className="font-bold text-slate-900 text-lg mb-1">{segment.name}</p>
                            <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider font-bold">Group</p>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-600 font-medium">Size</span>
                                    <span className="font-bold text-slate-800">{segment.size} items</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-600 font-medium">Revenue</span>
                                    <span className="font-bold text-emerald-600">{formatCurrency(segment.revenue, currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 font-medium">Avg Value</span>
                                    <span className="font-bold text-slate-800">{formatCurrency(segment.avgValue, currency)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CLV Analysis */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    Lifetime Value (CLV) Projection
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card-purple p-6 rounded-[24px]">
                        <p className="text-purple-800 text-xs font-bold uppercase">Total CLV</p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-1">{formatCurrency(clv.totalCLV, currency)}</p>
                        <p className="text-xs text-purple-700 font-medium mt-1">Projected Total Value</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100">
                        <p className="text-blue-600 text-xs font-bold uppercase">Avg CLV / Customer</p>
                        <p className="text-3xl font-extrabold text-blue-700 mt-1">{formatCurrency(clv.averageCLV, currency)}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100">
                        <p className="text-emerald-600 text-xs font-bold uppercase">Retention Value</p>
                        <p className="text-3xl font-extrabold text-emerald-700 mt-1">{formatCurrency(clv.insights.retentionImpact, currency)}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Impact of +10% Retention</p>
                    </div>
                </div>
            </div>

            {/* Churn Risk */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    Churn Risk Radar
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['High', 'Medium', 'Low'].map(risk => {
                        const count = churn.filter(c => c.churnRisk === risk).length;
                        const color = risk === 'High' ? 'red' : risk === 'Medium' ? 'amber' : 'green';

                        return (
                            <div key={risk} className={`p-6 rounded-[24px] border border-${color}-200 bg-${color}-50`}>
                                <p className={`text-${color}-700 text-sm font-bold uppercase`}>{risk} Risk</p>
                                <p className={`text-3xl font-extrabold text-${color}-800 mt-2`}>{count} <span className="text-sm font-medium opacity-60">items</span></p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-slate-800 mb-4">High Priority Retention Actions</h4>
                    <div className="space-y-3">
                        {churn.filter(c => c.churnRisk === 'High').slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div>
                                    <p className="font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.daysSinceLastSale} days inactive</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">{item.recommendedAction}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW: Amazon Customer Data Analysis (Graphical View) */}
            <div className="bg-white rounded-[24px] border border-slate-200 p-8 shadow-soft">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    Recent Amazon Customers
                </h3>

                {/* Visual Cards for Customers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(() => {
                        const amazonCustomers = products
                            ? products.filter(p => p.platform === 'Amazon' && p.customerName).slice(0, 9)
                            : [];

                        if (amazonCustomers.length === 0) {
                            return (
                                <div className="col-span-full text-center py-10 bg-slate-50 rounded-[20px] border border-dashed border-slate-300">
                                    <p className="text-slate-400 font-medium">To see customer data, import an Amazon Order Report with "Buyer Name" and "Email".</p>
                                </div>
                            );
                        }

                        return amazonCustomers.map((customer, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                                        {customer.customerName.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                        {new Date(customer.importDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800 truncate" title={customer.customerName}>{customer.customerName}</h4>
                                <p className="text-xs text-slate-500 mb-3 truncate" title={customer.customerEmail}>{customer.customerEmail || 'No Email Provided'}</p>

                                <div className="pt-3 border-t border-slate-50">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold text-center mb-1">Purchased Product</p>
                                    <p className="text-xs font-medium text-slate-700 line-clamp-2 text-center h-8" title={customer.name}>
                                        {customer.name}
                                    </p>
                                    <div className="mt-2 text-center">
                                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                                            {formatCurrency(customer.gmv, currency)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
};

export default ConsumerInsights;
