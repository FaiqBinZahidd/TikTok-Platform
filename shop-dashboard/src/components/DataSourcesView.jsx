
import React, { useState, useMemo, useRef } from 'react';
import {
  Database,
  Trash2,
  RefreshCw,
  File,
  Calendar,
  Package,
  AlertTriangle,
  CheckCircle2,
  Music,
  ShoppingCart,
  Box,
  Eye,
  Upload,
  Download
} from 'lucide-react';
import PlatformBadge from './PlatformBadge';

/**
 * DataSourcesView Component
 * Displays uploaded data files with platform information and management options
 * @param {Array} uploadedFiles - Array of uploaded file objects
 * @param {Function} onDelete - Callback function for deleting files
 * @param {Function} onReimport - Callback function for re-importing files
 * @param {Function} onFileUpload - Callback function for file uploads
 * @param {string} currency - Currency symbol (default: '฿')
 */
export default function DataSourcesView({
  uploadedFiles = [],
  onDelete = () => { },
  onReimport = () => { },
  onFileUpload = () => { },
  currency = '฿',
  t
}) {
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('THB');

  // Missing States Restoration
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Platform icon mapping
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'TikTok': return Music;
      case 'Lazada': return ShoppingCart;
      case 'Shopee': return Box;
      case 'Amazon': return Database;
      case 'Daraz': return Package;
      default: return Package;
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check if we can auto-detect, otherwise show modal (Simulated logic for now)
      // In reality, we read the file first, then check headers. 
      // For this UI flow, we'll assume we might need manual input.
      setPendingFile(file);
      setShowPlatformModal(true);
      e.target.value = null; // Reset input
    }
  };

  const handlePlatformConfirm = (platform) => {
    if (pendingFile) {
      onFileUpload(pendingFile, platform, selectedCurrency);
      setShowPlatformModal(false);
      setPendingFile(null);
    }
  };

  // Sort and filter data
  const sortedFiles = useMemo(() => {
    let filtered = uploadedFiles.filter(file =>
      (file?.name || 'Unknown').toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b?.date || 0) - new Date(a?.date || 0);
      } else if (sortBy === 'platform') {
        return (a?.platform || '').localeCompare(b?.platform || '');
      } else if (sortBy === 'name') {
        return (a?.name || '').localeCompare(b?.name || '');
      }
      return 0;
    });

    return filtered;
  }, [uploadedFiles, sortBy, searchTerm]);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Unknown Date';
    }
  };

  // Handle delete with confirmation
  const handleDeleteClick = (file) => {
    setDeleteConfirm(file.name);
  };

  const confirmDelete = (file) => {
    onDelete(file);
    setDeleteConfirm(null);
    setSelectedFile(null);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 relative">

      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Select Platform</h3>
              <p className="text-sm text-slate-500 mt-1">
                Identify the source of <strong>{pendingFile?.name}</strong> to ensure correct data parsing.
              </p>
            </div>

            <div className="px-6 pt-4 pb-0">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">File Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-pink-500"
              >
                {['THB', 'USD', 'SGD', 'MYR', 'IDR', 'PHP', 'VND', 'GBP', 'EUR'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="p-6 grid grid-cols-2 gap-3">
              {['TikTok', 'Shopee', 'Lazada', 'Amazon', 'Daraz'].map(p => (
                <button
                  key={p}
                  onClick={() => handlePlatformConfirm(p)}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-700 transition-all group"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm border border-slate-100 group-hover:border-pink-200">
                    {React.createElement(getPlatformIcon(p), { className: "w-6 h-6" })}
                  </div>
                  <span className="font-bold text-sm">{p}</span>
                </button>
              ))}
              <button
                onClick={() => handlePlatformConfirm('Unknown')}
                className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all mt-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs font-bold">Auto-Detect / Unknown</span>
              </button>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => { setShowPlatformModal(false); setPendingFile(null); }}
                className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <Database className="w-8 h-8 text-pink-600" />
              {t('datasources')}
            </h2>
            <p className="text-slate-500 font-medium mt-2">
              {t('data_management')}
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-lg font-bold text-pink-600">{uploadedFiles.length}</span>
              <span className="text-sm font-bold text-slate-600">{t('active_uploads')}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('search_filename')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm font-medium"
            />
            <File className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Sort Options and Actions */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('date')}
                className={`px - 4 py - 2 rounded - xl text - xs font - bold transition - all ${sortBy === 'date'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } `}
              >
                {t('sort_date')}
              </button>
              <button
                onClick={() => setSortBy('platform')}
                className={`px - 4 py - 2 rounded - xl text - xs font - bold transition - all ${sortBy === 'platform'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  } `}
              >
                {t('sort_platform')}
              </button>
            </div>

            {/* Import/Export Actions */}
            <div className="flex gap-2">
              <input
                id="file-upload-datasources"
                name="fileUploadDatasources"
                type="file"
                accept=".csv,.xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-all hover:scale-105 active:scale-95 text-xs shadow-lg shadow-pink-200"
              >
                <Upload className="w-3.5 h-3.5" />
                {t('import_new')}
              </button>
              <button
                onClick={() => {
                  const csvContent = [
                    ['File Name', 'Platform', 'Upload Date', 'Records Imported', 'Status'].join(','),
                    ...uploadedFiles.map(f => [
                      `"${f.name || ''}"`,
                      `"${f.platform || ''}"`,
                      `"${f.date || ''}"`,
                      `"${f.recordsImported || 0}"`,
                      `"${f.status || 'unknown'}"`
                    ].join(','))
                  ].join('\n');

                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `data_export.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                {t('export_list')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Files List */}
      {sortedFiles.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {sortedFiles.map((file, idx) => (
            <div
              key={idx}
              className={`bg - white rounded - 2xl border transition - all cursor - pointer group ${selectedFile?.name === file.name
                ? 'border-pink-500 shadow-md ring-1 ring-pink-500/20'
                : 'border-slate-100 hover:border-pink-200 hover:shadow-sm'
                } `}
            >
              <div
                className="p-5"
                onClick={() => setSelectedFile(selectedFile?.name === file.name ? null : file)}
              >
                {/* File Info Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* File Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mt-1 group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors text-slate-400">
                      {React.createElement(getPlatformIcon(file.platform), { className: "w-6 h-6" })}
                    </div>

                    {/* File Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-base group-hover:text-pink-600 transition-colors">
                        {file.name}
                      </h3>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                        {/* Platform Badge */}
                        <div>
                          <PlatformBadge
                            platform={file.platform || 'Unknown'}
                            size="sm"
                            variant="full"
                          />
                        </div>

                        {/* Upload Date */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {formatDate(file.date)}
                        </div>

                        {/* Record Count */}
                        {file.recordsImported && (
                          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-bold">
                            <Package className="w-3 h-3" />
                            {file.recordsImported} items
                          </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center gap-1">
                          {file.status === 'success' ? (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{t('status_imported')}</span>
                            </div>
                          ) : file.status === 'failed' ? (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{t('status_failed')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>{t('status_processing')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onReimport(file);
                      }}
                      title="Re-import this file"
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Clicked Initial Delete for:", file.name);
                        handleDeleteClick(file);
                      }}
                      title="Delete this file"
                      className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedFile?.name === file.name && (
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-1">
                    {/* Delete Confirmation */}
                    {deleteConfirm === file.name ? (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-red-900 font-bold">{t('confirm_delete')}</p>
                            <p className="text-xs text-red-700 mt-1">
                              ⚠️ <strong>This action cannot be undone!</strong> All {file.recordsImported || 0} records will be permanently deleted.
                            </p>
                            <p className="text-xs text-red-600 mt-2">
                              You will need to re-upload this file to restore the data.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                            className="flex-1 px-3 py-2 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                          >
                            {t('cancel')}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Confirmed Delete for:", file.name);
                              confirmDelete(file);
                            }}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors text-sm shadow-lg"
                          >
                            🗑️ {t('delete_permanently')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('status')}</p>
                          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {t('status_imported')}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('file_name')}</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('platform')}</p>
                          <PlatformBadge platform={file.platform} size="sm" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">{t('upload_date')}</p>
                          <p className="text-sm font-bold text-slate-800">{formatDate(file.date)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center opacity-60">
            <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">{t('no_data_sources')}</h3>
            <p className="text-sm text-slate-500">{t('upload_start')}</p>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {sortedFiles.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
              <p className="text-xs text-pink-600 font-semibold uppercase tracking-wider mb-1">
                {t('total_files')}
              </p>
              <p className="text-2xl font-bold text-violet-700">{sortedFiles.length}</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                {t('successful')}
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {sortedFiles.filter(f => f.status === 'success').length}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider mb-1">
                {t('total_records')}
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {sortedFiles.reduce((sum, f) => sum + (f.recordsImported || 0), 0)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">
                {t('platforms')}
              </p>
              <p className="text-2xl font-bold text-blue-700">
                {new Set(sortedFiles.map(f => f.platform)).size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
