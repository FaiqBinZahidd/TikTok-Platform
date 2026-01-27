import React, { useState } from 'react';
import { Plus, Target, Trash2, ExternalLink, BarChart3, X, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const CampaignView = ({ products, currency, campaigns, setCampaigns, t }) => {
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
        const projectedRevenue = baselineGmv * (1 - (discountPercent / 100)) * liftFactor;

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
        if (window.confirm('Delete this campaign plan?')) {
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
            if (c.id === activeCampaign.id) {
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
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('campaign_planner')}</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> {t('new_campaign')}
                </button>
            </div>

            {/* Campaign List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">{t('no_campaigns')}</p>
                        <p className="text-xs text-slate-400">{t('create_campaign_desc')}</p>
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
                                    <p className="text-xs text-slate-400 font-mono">{t('created')}: {camp.date}</p>
                                    {camp.adUrl && (
                                        <a href={camp.adUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1 hover:underline">
                                            <ExternalLink className="w-3 h-3" /> {t('view_ad_platform')}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">{t('products_discount')}</span>
                                    <span className="font-bold text-slate-800">{camp.productCount} items / -{camp.discountPercent}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">{t('ad_spend')}</span>
                                    <span className="font-bold text-slate-800">{formatCurrency(camp.adSpend, currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm bg-violet-50 p-2 rounded-lg border border-violet-100">
                                    <span className="text-violet-600 font-bold">{t('proj_revenue')}</span>
                                    <span className="font-bold text-violet-700">{formatCurrency(camp.projectedRevenue, currency)}</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex gap-2">
                                <button
                                    onClick={() => openAnalytics(camp)}
                                    className="flex-1 py-2 text-xs font-bold text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 flex items-center justify-center gap-2"
                                >
                                    <BarChart3 className="w-3 h-3" /> {t('analytics_ads')}
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
                            <h3 className="font-bold text-slate-800">{t('new_campaign_plan')}</h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            <div>
                                <label htmlFor="campaign-name" className="block text-sm font-medium text-slate-700 mb-1">{t('campaign_name')}</label>
                                <input
                                    id="campaign-name"
                                    name="campaignName"
                                    type="text"
                                    value={newCampName}
                                    onChange={(e) => setNewCampName(e.target.value)}
                                    placeholder="e.g. 11.11 Mega Sale"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="target-discount" className="block text-sm font-medium text-slate-700 mb-1">{t('target_discount')}</label>
                                    <input
                                        id="target-discount"
                                        name="targetDiscount"
                                        type="number"
                                        min="0" max="100"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ad-link" className="block text-sm font-medium text-slate-700 mb-1">{t('ad_link')}</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            id="ad-link"
                                            name="adLink"
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
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('select_campaign_products')}</label>
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
                                <p className="text-xs text-right text-slate-400 mt-1">{selectedIds.length} {t('items_selected')}</p>
                            </div>

                            {/* Smart Preview */}
                            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 flex justify-between items-center">
                                <span>{t('projected_revenue_lift')}:</span>
                                <span className="font-bold text-violet-700">{formatCurrency(products.filter(p => selectedIds.includes(p.id)).reduce((s, p) => s + p.gmv, 0) * (1 - (discountPercent / 100)) * (1 + ((discountPercent / 5) * 0.1)), currency)}</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={handleCreate}
                                disabled={!newCampName || selectedIds.length === 0}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!newCampName || selectedIds.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md'}`}
                            >
                                {t('create_plan')}
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
                                <h3 className="font-bold text-slate-800">{t('campaign_ad_analytics')}</h3>
                            </div>
                            <button onClick={() => setShowAnalyticsModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="ad-platform" className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('ad_platform')}</label>
                                <select
                                    id="ad-platform"
                                    name="adPlatform"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    value={analyticsData.platform}
                                    onChange={e => setAnalyticsData({ ...analyticsData, platform: e.target.value })}
                                >
                                    <option value="Meta Ads">Meta Ads (Facebook/Instagram)</option>
                                    <option value="TikTok Ads">TikTok Ads</option>
                                    <option value="Google Ads">Google Ads</option>
                                    <option value="Shopee Ads">Shopee Ads</option>
                                    <option value="Lazada Ads">Lazada Solutions</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="total-ad-spend" className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('total_ad_spend')} ({currency})</label>
                                <input
                                    id="total-ad-spend"
                                    name="totalAdSpend"
                                    type="number"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono font-medium"
                                    value={analyticsData.adSpend}
                                    onChange={e => setAnalyticsData({ ...analyticsData, adSpend: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="start-date" className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('start_date')}</label>
                                    <input
                                        id="start-date"
                                        name="startDate"
                                        type="date"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        value={analyticsData.startDate}
                                        onChange={e => setAnalyticsData({ ...analyticsData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end-date" className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('end_date')}</label>
                                    <input
                                        id="end-date"
                                        name="endDate"
                                        type="date"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                        value={analyticsData.endDate}
                                        onChange={e => setAnalyticsData({ ...analyticsData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="target-roas" className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('target_roas')} (Return on Ad Spend)</label>
                                <input
                                    id="target-roas"
                                    name="targetRoas"
                                    type="number"
                                    step="0.1"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                    value={analyticsData.targetRoas}
                                    onChange={e => setAnalyticsData({ ...analyticsData, targetRoas: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">{t('quantro_forecasting')}</p>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                            <button onClick={() => setShowAnalyticsModal(false)} className="px-4 py-2 text-sm text-slate-600 font-medium">{t('cancel')}</button>
                            <button onClick={saveAnalytics} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-violet-700">{t('save_data')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignView;
