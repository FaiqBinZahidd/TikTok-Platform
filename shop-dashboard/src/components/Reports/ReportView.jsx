import React, { useState, useEffect, useRef } from 'react';
import { Download, ShoppingBag, Video, Eye, Printer, Trash2, RotateCcw, Save, Settings, LayoutDashboard, Bell, Database } from 'lucide-react';
import PlatformFilter from '../PlatformFilter';
import { formatCurrency } from '../../utils/formatUtils';

const ReportView = ({ settings, summary, smartInsights, channelData, currency, processedProducts, setActiveView, platformFilter, setPlatformFilter, availablePlatforms, t }) => {
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
        if (!pdfReady || !reportRef.current) return;

        const element = reportRef.current;
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right
            filename: `Quantro_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        window.html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="fixed inset-0 z-[60] bg-white overflow-auto animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center pt-8 pb-24">

            {/* Report Controls */}
            <div className="w-full max-w-4xl mb-4 flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{t('performance_report')}</h2>
                    <p className="text-sm text-slate-600 mt-1">
                        {platformFilter !== 'All' ? `${t('showing_data_for')} ${platformFilter}` : t('showing_all_platforms')}
                    </p>
                </div>

                {/* Platform Filter */}
                {availablePlatforms && availablePlatforms.length > 0 && (
                    <PlatformFilter
                        value={platformFilter}
                        onChange={setPlatformFilter}
                        availablePlatforms={availablePlatforms}
                        showLabel={true}
                    />
                )}

                {/* Export Button */}
                <button
                    onClick={handleDownloadPDF}
                    disabled={!pdfReady}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    {t('download_pdf')}
                </button>
            </div>

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
                            <span className="text-xl font-bold tracking-tight text-slate-900">{t('quantro_analytics')}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                            {t('exec_performance_report')}
                            {platformFilter !== 'All' && <span className="text-lg text-violet-600"> - {platformFilter}</span>}
                        </h1>
                        <p className="text-slate-500 font-medium">{t('prepared_for')}: <span className="text-slate-900">{typeof settings.userName === 'string' ? settings.userName : 'Manager'}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">{t('generated_on')}</p>
                        <p className="text-lg font-semibold text-slate-800">{dateStr}</p>
                    </div>
                </div>

                {/* Executive Summary */}
                {showSummary && (
                    <section className="mb-12 break-inside-avoid">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-violet-600 rounded-sm"></span> {t('executive_summary')}
                        </h2>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('total_revenue')}</p>
                                <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(summary.totalGmv, currency)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('total_orders')}</p>
                                <p className="text-2xl font-extrabold text-slate-900">{summary.totalOrders}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('avg_order_value')}</p>
                                <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(summary.avgOrderValue, currency)}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">{t('conversion_rate')}</p>
                                <p className="text-2xl font-extrabold text-slate-900">{summary.conversionRate}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Strategic Analysis */}
                {showAI && (
                    <section className="mb-12 break-inside-avoid">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-indigo-600 rounded-sm"></span> {t('strategic_insights')}
                        </h2>
                        <div className="space-y-3">
                            {smartInsights.map((insight, idx) => {
                                const Icon = insight.icon;
                                return (
                                    <div key={idx} className="flex gap-4 p-4 border border-slate-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="p-2.5 rounded-lg h-fit bg-slate-100 text-slate-700">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800 text-sm mb-0.5">{insight.title}</h3>
                                            <p className="text-slate-600 text-xs leading-relaxed">{insight.text}</p>
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
                            <span className="w-2 h-8 bg-rose-600 rounded-sm"></span> {t('channel_performance')}
                        </h2>
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                        <th className="p-3 font-bold tracking-wider">{t('channel')}</th>
                                        <th className="p-3 font-bold text-right tracking-wider">{t('revenue')}</th>
                                        <th className="p-3 font-bold text-right tracking-wider">{t('contribution')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { name: t('shop_tab'), val: channelData.shop, icon: ShoppingBag },
                                        { name: t('video_content'), val: channelData.video, icon: Video },
                                        { name: t('live_streaming'), val: channelData.live, icon: Eye }
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
                        <span className="w-2 h-8 bg-amber-500 rounded-sm"></span> {t('key_inventory_drivers')}
                    </h2>
                    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                                    <th className="p-3 font-bold tracking-wider">{t('col_product')}</th>
                                    <th className="p-3 font-bold text-right tracking-wider">GMV</th>
                                    <th className="p-3 font-bold text-center tracking-wider">{t('col_sold')}</th>
                                    <th className="p-3 font-bold text-center tracking-wider">{t('status')}</th>
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
                                        <td colSpan="4" className="p-8 text-center text-slate-400 italic">{t('no_class_a')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Printable Notes Display */}
                {note && (
                    <section className="mt-8 break-inside-avoid">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-l-2 border-slate-300 pl-2">{t('executive_notes')}</h2>
                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 italic font-serif">
                            "{note}"
                        </div>
                    </section>
                )}

                <div className="mt-16 pt-8 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-xs font-medium">{t('confidential_footer')}</p>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="fixed top-8 right-8 flex flex-col gap-4 print:hidden z-50">
                <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200 space-y-3 w-64">
                    <h3 className="text-sm font-bold text-slate-900">{t('report_settings')}</h3>
                    <label htmlFor="show-summary" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input id="show-summary" name="showSummary" type="checkbox" checked={showSummary} onChange={e => setShowSummary(e.target.checked)} className="accent-violet-600 rounded" /> {t('summary')}
                    </label>
                    <label htmlFor="show-ai" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input id="show-ai" name="showAI" type="checkbox" checked={showAI} onChange={e => setShowAI(e.target.checked)} className="accent-violet-600 rounded" /> {t('smart_recommendations')}
                    </label>
                    <label htmlFor="show-channels" className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input id="show-channels" name="showChannels" type="checkbox" checked={showChannels} onChange={e => setShowChannels(e.target.checked)} className="accent-violet-600 rounded" /> {t('channels')}
                    </label>
                    <label htmlFor="executive-notes" className="text-xs font-medium text-slate-600 block mb-1">{t('notes')}</label>
                    <textarea
                        id="executive-notes"
                        name="executiveNotes"
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
                        rows="3"
                        placeholder={t('add_notes_placeholder')}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    ></textarea>

                    <div className="pt-2 flex flex-col gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={!pdfReady}
                            className="w-full py-2 bg-violet-600 text-white rounded-lg font-bold shadow-md hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" /> {pdfReady ? t('download_pdf') : t('loading_engine')}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="w-full py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> {t('print')}
                        </button>
                        <button
                            onClick={() => setActiveView('dashboard')}
                            className="w-full py-2 text-slate-400 text-xs hover:text-slate-600"
                        >
                            <X className="w-4 h-4" /> {t('close_preview')}
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

export default ReportView;
