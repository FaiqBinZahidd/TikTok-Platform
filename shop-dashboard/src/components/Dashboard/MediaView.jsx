import React from 'react';
import { Video, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/formatUtils';

const MediaView = ({ products, currency, t }) => {
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
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('media_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Video className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-950 text-lg">{t('short_video')}</h3>
                            <p className="text-xs text-indigo-500 font-medium uppercase">{t('content_performance')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">{t('revenue')}</p>
                            <p className="text-xl font-bold text-indigo-700">{formatCurrency(videoStats.gmv, currency)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">{t('views')}</p>
                            <p className="text-xl font-bold text-slate-700">{videoStats.views.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">{t('top_content_products')}</h4>
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
                            <h3 className="font-bold text-rose-950 text-lg">{t('live_streaming')}</h3>
                            <p className="text-xs text-rose-500 font-medium uppercase">{t('real_time_sales')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">{t('revenue')}</p>
                            <p className="text-xl font-bold text-rose-700">{formatCurrency(liveStats.gmv, currency)}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-400 font-bold uppercase">{t('views')}</p>
                            <p className="text-xl font-bold text-slate-700">{liveStats.views.toLocaleString()}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">{t('top_live_products')}</h4>
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

export default MediaView;
