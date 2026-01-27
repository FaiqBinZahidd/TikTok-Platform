import React, { useState, useMemo } from 'react';
import { Lock, Shield, AlertTriangle, Activity, Download, Trash2, Eye, EyeOff, Clock, CheckCircle2, Database, Key } from 'lucide-react';
import * as securityUtils from '../../utils/securityUtils';

export default function SecurityView({ securityLogs = [], setSecurityLogs, currentUser, summary = {} }) {
  const [activeTab, setActiveTab] = useState('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEncryption, setShowEncryption] = useState(false);
  const [encryptionForm, setEncryptionForm] = useState({ text: '' });
  const [decryptedText, setDecryptedText] = useState('');
  const [showDecrypted, setShowDecrypted] = useState(false);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return (securityLogs || []).filter(log =>
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [securityLogs, searchTerm]);

  // Security statistics
  const securityStats = useMemo(() => {
    const total = (securityLogs || []).length;
    const logins = (securityLogs || []).filter(l => l.action === 'LOGIN').length;
    const dataAccess = (securityLogs || []).filter(l => l.action?.includes('DATA')).length;
    const exports = (securityLogs || []).filter(l => l.action?.includes('EXPORT')).length;
    
    return { total, logins, dataAccess, exports };
  }, [securityLogs]);

  const handleEncrypt = () => {
    if (!encryptionForm.text.trim()) {
      alert('Please enter text to encrypt');
      return;
    }

    const encrypted = securityUtils.encryptData(encryptionForm.text);
    setEncryptedText(encrypted);
    setEncryptionForm({ text: '' });
  };

  const handleDecrypt = (encryptedText) => {
    try {
      const decrypted = securityUtils.decryptData(encryptedText);
      setDecryptedText(decrypted);
      setShowDecrypted(true);
    } catch (error) {
      alert('Failed to decrypt: ' + error.message);
    }
  };

  const handleCreateBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      size: Math.floor(Math.random() * 1000) + 100
    };

    const backup = securityUtils.createDataBackup(backupData);
    alert(`Backup created successfully! ID: ${backup.id.substring(0, 8)}...`);
  };

  const handleViewSecurityScore = () => {
    const score = securityUtils.calculateSecurityScore();
    alert(`Current Security Score: ${score}/100`);
  };

  const getActionBadgeColor = (action) => {
    const colors = {
      'LOGIN': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'LOGOUT': 'bg-slate-100 text-slate-700 border-slate-200',
      'DATA_ACCESS': 'bg-blue-100 text-blue-700 border-blue-200',
      'DATA_EXPORT': 'bg-purple-100 text-purple-700 border-purple-200',
      'FILE_UPLOAD': 'bg-orange-100 text-orange-700 border-orange-200',
      'BACKUP': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'WARNING': 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[action] || colors['DATA_ACCESS'];
  };

  let encryptedText = '';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Security & Compliance</h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'logs'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('encryption')}
            className={`px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'encryption'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Encryption
          </button>
          <button
            onClick={() => setActiveTab('backups')}
            className={`px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'backups'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Backups
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'text-violet-600 border-violet-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Compliance
          </button>
        </div>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-lg border border-violet-200">
          <p className="text-slate-600 text-sm">Total Events</p>
          <p className="text-2xl font-bold text-violet-700">{securityStats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <p className="text-slate-600 text-sm">Logins</p>
          <p className="text-2xl font-bold text-emerald-700">{securityStats.logins}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-slate-600 text-sm">Data Access</p>
          <p className="text-2xl font-bold text-blue-700">{securityStats.dataAccess}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <p className="text-slate-600 text-sm">Exports</p>
          <p className="text-2xl font-bold text-orange-700">{securityStats.exports}</p>
        </div>
      </div>

      {/* Audit Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <div className="relative">
              <Activity className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs by action or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p>No security logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-slate-600 font-semibold">Time</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-semibold">User</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-semibold">Action</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-semibold">Details</th>
                      <th className="px-6 py-3 text-left text-slate-600 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.slice(0, 20).map((log, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-600 text-xs">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown'}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-900">{log.user || 'System'}</td>
                        <td className="px-6 py-3">
                          <span className={`px-3 py-1 rounded-lg border font-semibold text-xs ${getActionBadgeColor(log.action)}`}>
                            {log.action || 'UNKNOWN'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-slate-600 text-xs max-w-xs truncate">
                          {log.details || '-'}
                        </td>
                        <td className="px-6 py-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Encryption Tab */}
      {activeTab === 'encryption' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-600" />
              Data Encryption Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Encrypt Section */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900 mb-3">Encrypt Text</p>
                <textarea
                  value={encryptionForm.text}
                  onChange={(e) => setEncryptionForm({ text: e.target.value })}
                  placeholder="Enter text to encrypt..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-3"
                  rows="3"
                />
                <button
                  onClick={handleEncrypt}
                  className="w-full bg-violet-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-violet-700 transition-all"
                >
                  Encrypt
                </button>
                {encryptedText && (
                  <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Encrypted Result:</p>
                    <code className="text-xs text-slate-600 break-all">{encryptedText}</code>
                  </div>
                )}
              </div>

              {/* Decrypt Section */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900 mb-3">Decrypt Text</p>
                <textarea
                  placeholder="Paste encrypted text here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-3"
                  rows="3"
                  id="decryptInput"
                />
                <button
                  onClick={() => {
                    const encryptedValue = document.getElementById('decryptInput').value;
                    if (encryptedValue) {
                      handleDecrypt(encryptedValue);
                    }
                  }}
                  className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all"
                >
                  Decrypt
                </button>
                {showDecrypted && decryptedText && (
                  <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-700">Decrypted Result:</p>
                      <button
                        onClick={() => setShowDecrypted(!showDecrypted)}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        {showDecrypted ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-sm text-slate-600">{decryptedText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backups Tab */}
      {activeTab === 'backups' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-violet-600" />
                Data Backups
              </h3>
              <button
                onClick={handleCreateBackup}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-all"
              >
                <Download className="w-4 h-4" />
                Create Backup
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Last Backup:</strong> Today at {new Date().toLocaleTimeString()}
              </p>
              <p className="text-xs text-blue-700 mt-1">Your data is automatically backed up hourly</p>
            </div>

            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded border border-slate-200 hover:shadow-md transition-shadow">
                  <div>
                    <p className="font-medium text-slate-900">Backup #{5 - i}</p>
                    <p className="text-xs text-slate-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">{100 + i * 10}MB</span>
                    <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-600" />
              Compliance & Privacy
            </h3>

            <div className="space-y-4">
              {/* Security Score */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Security Score</p>
                    <p className="text-sm text-slate-600">Current overall security level</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-3xl font-bold text-emerald-700">85</p>
                    <p className="text-xs text-emerald-600">Good</p>
                  </div>
                </div>
              </div>

              {/* GDPR Compliance */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900 mb-2">GDPR Compliance</p>
                <p className="text-sm text-slate-600 mb-4">Data protection and privacy regulations</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">Data retention policy implemented</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">User consent tracking enabled</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">Right to be forgotten implemented</span>
                  </label>
                </div>
              </div>

              {/* Data Protection */}
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900 mb-2">Data Protection</p>
                <p className="text-sm text-slate-600 mb-4">Encryption and security measures</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">AES-256 encryption enabled</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">SSL/TLS for all connections</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-slate-700">Regular security audits</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
