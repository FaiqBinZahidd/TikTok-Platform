import React, { useState, useRef } from 'react';
import { Settings, Save, Trash2, Database, Globe, Eye, Monitor, Download, RefreshCw, FileText, Bell, ShieldCheck, UploadCloud } from 'lucide-react';
import { generateBackup, downloadBackup } from '../../utils/backupSystem';

const SettingsView = ({
    settings,
    setSettings,
    products,
    uploadedFiles,
    clearData,
    resetToSampleData,
    onRestore, // New Prop
    onDelete, // New Prop
    currentUser,
    addNotification,
    visibleKPIs,
    setVisibleKPIs,
    language,
    setLanguage,
    t
}) => {
    const [activeTab, setActiveTab] = useState('general');

    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleKpiToggle = (kpi) => {
        setVisibleKPIs(prev => ({ ...prev, [kpi]: !prev[kpi] }));
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === id
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
                    <p className="text-slate-500 text-sm">Manage your preferences and data configuration</p>
                </div>

                <div className="flex gap-2 p-1 bg-slate-100 rounded-full">
                    <TabButton id="general" label={t('settings')} icon={Settings} />
                    <TabButton id="data" label="Data Management" icon={Database} />
                    <TabButton id="notifications" label="Notifications" icon={Bell} />
                    <TabButton id="display" label="Display" icon={Monitor} />
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Settings Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'general' && (
                        <div className="bg-white rounded-[24px] p-8 shadow-soft space-y-8">
                            {/* User Profile */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    User Preferences
                                </h3>
                                <div className="flex items-center gap-6 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                    <div className="relative group cursor-pointer">
                                        {settings.avatar ? (
                                            <img
                                                src={settings.avatar}
                                                alt="Profile"
                                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-white shadow-md">
                                                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
                                            </div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                            <span className="text-xs font-bold">Edit</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setSettings(prev => ({ ...prev, avatar: reader.result }));
                                                            addNotification({ type: 'success', msg: 'Profile picture updated!' });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Profile Picture</p>
                                        <p className="text-sm text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">Display Name</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={settings.userName || ''}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">Currency Symbol</label>
                                        <select
                                            name="currency"
                                            value={settings.currency || '฿'}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:outline-none bg-white"
                                        >
                                            <option value="฿">฿ (THB)</option>
                                            <option value="$">$ (USD)</option>
                                            <option value="€">€ (EUR)</option>
                                            <option value="£">£ (GBP)</option>
                                            <option value="¥">¥ (JPY)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">{t('language_settings')}</label>
                                        <div className="flex gap-2">
                                            {['en', 'th'].map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setLanguage(lang)}
                                                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${language === lang
                                                        ? 'bg-violet-50 border-violet-200 text-violet-700'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {lang === 'en' ? t('english') : t('thai')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-8 space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <RefreshCw className="w-4 h-4" />
                                    </div>
                                    Thresholds & Logic
                                </h3>
                                <p className="text-sm text-slate-400">Adjust the logic for smart insights classification.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">High View Threshold</label>
                                        <input
                                            type="number"
                                            name="highViewThreshold"
                                            value={settings.highViewThreshold}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">Hidden Gem CVR %</label>
                                        <input
                                            type="number"
                                            name="hiddenGemCvr"
                                            value={settings.hiddenGemCvr}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">Low Stock Threshold</label>
                                        <input
                                            type="number"
                                            name="lowStockThreshold"
                                            value={settings.lowStockThreshold || 10}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-600">Dead Stock Days</label>
                                        <input
                                            type="number"
                                            name="deadStockThreshold"
                                            value={settings.deadStockThreshold || 90}
                                            onChange={handleSettingChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-[24px] p-8 shadow-soft">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <Database className="w-5 h-5 text-violet-600" /> Data Operations
                                </h3>

                                {/* QUANTRO VAULT BACKUP SYSTEM */}
                                <div className="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ShieldCheck className="w-32 h-32" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                            <h4 className="text-xl font-black">Quantro Vault</h4>
                                        </div>
                                        <p className="text-slate-300 text-sm mb-6 max-w-md">
                                            Securely backup your entire dashboard state to your computer. Use this file to restore your data instantly in case of a system crash.
                                        </p>

                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => {
                                                    const json = generateBackup(products, settings, uploadedFiles, currentUser);
                                                    downloadBackup(json);
                                                    addNotification({ type: 'success', msg: 'Backup encrypted and downloaded.' });
                                                }}
                                                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Backup
                                            </button>

                                            <label className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm">
                                                <UploadCloud className="w-4 h-4" />
                                                Restore from Vault
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    className="hidden"
                                                    onChange={(e) => e.target.files[0] && onRestore(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Danger Zone</h4>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={resetToSampleData}
                                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-violet-50 text-violet-700 font-bold hover:bg-violet-100 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Reset to Sample Data
                                    </button>
                                    <button
                                        onClick={clearData}
                                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear All Data
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] p-8 shadow-soft">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" /> Imported Files
                                </h3>

                                {uploadedFiles && uploadedFiles.length > 0 ? (
                                    <div className="space-y-3">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{file.name}</p>
                                                        <p className="text-xs text-slate-400">
                                                            Imported: {new Date(file.date).toLocaleDateString()} • {file.recordsImported} records
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 self-start sm:self-center">
                                                    <div className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                                                        {file.platform || 'Unknown Source'}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you sure you want to delete ${file.name}? This will remove all associated products.`)) {
                                                                onDelete(file);
                                                            }
                                                        }}
                                                        className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-lg transition-all shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100"
                                                        title="Delete File"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                        <p className="text-slate-400 font-medium">No files imported yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-[24px] p-8 shadow-soft">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-amber-600" /> Alert Preferences
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">Configure which real-time alerts you want to receive.</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Low Stock Warnings</p>
                                        <p className="text-xs text-slate-500">Alert when inventory drops below threshold.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="enableLowStockAlerts"
                                            checked={settings.enableLowStockAlerts !== false}
                                            onChange={handleSettingChange}
                                            className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-bold text-slate-800">Sales Velocity Spikes</p>
                                        <p className="text-xs text-slate-500">Notify when a product sales jump &gt; 50%.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="enableVelocityAlerts"
                                        checked={settings.enableVelocityAlerts !== false}
                                        onChange={handleSettingChange}
                                        className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'display' && (
                        <div className="bg-white rounded-[24px] p-8 shadow-soft">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Eye className="w-5 h-5 text-emerald-600" /> KPI Visibility
                            </h3>
                            <p className="text-slate-500 text-sm mb-6">Toggle which key metrics are displayed on the Dashboard overview.</p>

                            <div className="space-y-3">
                                {Object.keys(visibleKPIs).map(kpi => (
                                    <label key={kpi} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <span className="font-bold text-slate-700 capitalize">
                                            {kpi.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${visibleKPIs[kpi] ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${visibleKPIs[kpi] ? 'translate-x-5' : 'translate-x-0'}`} />
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={visibleKPIs[kpi]}
                                                onChange={() => handleKpiToggle(kpi)}
                                            />
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Help Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-[24px] p-8 shadow-lg">
                        <h4 className="text-lg font-bold mb-4">Quick Tips</h4>
                        <ul className="space-y-4 text-sm text-slate-300">
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold">1</span>
                                <div>Use <strong>Reset to Sample</strong> if you want to test the system with dummy data.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold">2</span>
                                <div><strong>Currency</strong> settings apply globally across all reports and dashboards.</div>
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold">3</span>
                                <div>Imported files are stored locally in your browser for privacy.</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
