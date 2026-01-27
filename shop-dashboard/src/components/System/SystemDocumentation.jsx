import React, { useState } from 'react';
import { X, FileText, Database, Shield, Upload, BarChart3, Users } from 'lucide-react';

const SystemDocumentation = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('importing');

    if (!isOpen) return null;

    const tabs = [
        { id: 'importing', label: 'Importing Data', icon: Upload },
        { id: 'metrics', label: 'Understanding Metrics', icon: BarChart3 },
        { id: 'security', label: 'Security & Privacy', icon: Shield },
    ];

    const content = {
        importing: {
            title: 'How to Import Your Data',
            sections: [
                {
                    heading: '📂 Step 1: Prepare Your File',
                    points: [
                        'Download your sales report from TikTok, Shopee, Lazada, or Amazon',
                        'Ensure the file is in Excel (.xlsx) or CSV format',
                        'Check that headers are in the first row'
                    ]
                },
                {
                    heading: '⬆️ Step 2: Upload to Quantro',
                    points: [
                        'Click "Import Data" from the sidebar or top bar',
                        'Select the correct platform from the dropdown',
                        'Drag & drop your file or click to browse'
                    ]
                },
                {
                    heading: '✅ Step 3: Verify Import',
                    points: [
                        'Review the import summary (Items, GMV, Platform)',
                        'Check the Dashboard for newly imported data',
                        'Visit "Data Sources" to manage or delete imports'
                    ]
                },
                {
                    heading: '🔧 Troubleshooting',
                    points: [
                        '❌ "Platform Mismatch": Ensure you selected the correct platform',
                        '❌ "Missing Columns": Check that your file has proper headers',
                        '❌ "Empty Data": Verify your file contains actual sales records'
                    ]
                }
            ]
        },
        metrics: {
            title: 'Understanding Key Metrics',
            sections: [
                {
                    heading: '💰 GMV (Gross Merchandise Value)',
                    points: [
                        'Total value of products sold before deductions',
                        'Formula: Price × Quantity Sold',
                        'Goal: Consistent month-over-month growth'
                    ]
                },
                {
                    heading: '📊 ABC Classification',
                    points: [
                        'A-Class (Top 20%): Generate 80% of revenue - NEVER go out of stock',
                        'B-Class (Middle 30%): Steady performers - Monitor regularly',
                        'C-Class (Bottom 50%): Low sellers - Consider discounting or removing'
                    ]
                },
                {
                    heading: '🎯 Conversion Rate (CVR)',
                    points: [
                        'Percentage of visitors who make a purchase',
                        'Good benchmarks: TikTok 2-5%, Shopee/Lazada 3-7%',
                        'Improve with better pricing, reviews, and product images'
                    ]
                },
                {
                    heading: '🚀 ROAS (Return on Ad Spend)',
                    points: [
                        'Revenue generated per dollar spent on ads',
                        'Below 2.0x: Losing money | 3.0x: Break-even | 4.0x+: Profitable',
                        'Focus on CTR (Click-Through Rate) first when testing creatives'
                    ]
                }
            ]
        },
        security: {
            title: 'Security & Privacy Policy',
            sections: [
                {
                    heading: '🔒 Data Protection',
                    points: [
                        'All data is stored locally in your browser (IndexedDB)',
                        'No data is uploaded to external servers without your consent',
                        'Your files are never shared with third parties'
                    ]
                },
                {
                    heading: '👤 User Authentication',
                    points: [
                        'Supabase-powered secure authentication',
                        'Passwords are encrypted and never stored in plain text',
                        'Session tokens expire after 7 days of inactivity'
                    ]
                },
                {
                    heading: '🛡️ Best Practices',
                    points: [
                        'Use strong passwords (12+ characters, mixed case, numbers)',
                        'Never share your login credentials',
                        'Clear browser data regularly if using a shared computer',
                        'Contact klickode@gmail.com for any security concerns'
                    ]
                },
                {
                    heading: '📧 Support',
                    points: [
                        'Questions? Email us at klickode@gmail.com',
                        'We respond within 24 hours on business days',
                        'For urgent issues, mark your email as "URGENT"'
                    ]
                }
            ]
        }
    };

    const activeContent = content[activeTab];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-4">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">System Documentation</h2>
                            <p className="text-sm text-slate-400">Everything you need to know about Quantro</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6 bg-slate-50/50">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab.id
                                        ? 'border-violet-600 text-violet-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <h3 className="text-2xl font-black text-slate-800">{activeContent.title}</h3>

                    {activeContent.sections.map((section, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <h4 className="font-bold text-slate-700 mb-3 text-base">{section.heading}</h4>
                            <ul className="space-y-2">
                                {section.points.map((point, i) => (
                                    <li key={i} className="flex gap-2 text-sm text-slate-600">
                                        <span className="text-violet-500 font-bold mt-0.5">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">
                        Need more help? Contact us at <a href="mailto:klickode@gmail.com" className="text-violet-600 font-bold hover:underline">klickode@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SystemDocumentation;
