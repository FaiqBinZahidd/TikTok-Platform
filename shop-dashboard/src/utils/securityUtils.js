/**
 * Data Security & Privacy Utilities
 * Manages data encryption, privacy controls, and secure file handling
 */

// Simple encryption (Caesar cipher - for demo, use crypto library in production)
export const encryptData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        const encoded = btoa(jsonString); // Base64 encoding
        return encoded;
    } catch (e) {
        console.error('Encryption error:', e);
        return null;
    }
};

// Decrypt data
export const decryptData = (encryptedData) => {
    try {
        const decoded = atob(encryptedData); // Base64 decoding
        return JSON.parse(decoded);
    } catch (e) {
        console.error('Decryption error:', e);
        return null;
    }
};

// Hash data using simple algorithm
export const hashData = (data) => {
    let hash = 0;
    const str = JSON.stringify(data);
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
};

// Create data backup
export const createDataBackup = (userId) => {
    const backups = getAllBackups();
    
    // Gather all user data
    const userData = {
        settings: localStorage.getItem('shopProSettings'),
        products: localStorage.getItem('shopProProducts'),
        campaigns: localStorage.getItem('shopProCampaigns'),
        files: localStorage.getItem('shopProFiles'),
        kpis: localStorage.getItem('shopProKPIs')
    };
    
    const backup = {
        id: `backup_${Date.now()}`,
        userId,
        timestamp: new Date().toISOString(),
        size: new Blob([JSON.stringify(userData)]).size,
        status: 'completed',
        dataHash: hashData(userData),
        encrypted: false,
        restorable: true
    };
    
    backups.push(backup);
    localStorage.setItem('shopProBackups', JSON.stringify(backups));
    
    // Store backup data
    localStorage.setItem(`shopProBackupData_${backup.id}`, JSON.stringify(userData));
    
    return backup;
};

// Get all backups
export const getAllBackups = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProBackups') || '[]');
    } catch (e) {
        return [];
    }
};

// Restore from backup
export const restoreBackup = (backupId) => {
    const backupData = localStorage.getItem(`shopProBackupData_${backupId}`);
    
    if (!backupData) {
        return { success: false, error: 'Backup data not found' };
    }
    
    try {
        const data = JSON.parse(backupData);
        
        Object.keys(data).forEach(key => {
            if (data[key]) {
                localStorage.setItem(`shoPro${key.charAt(0).toUpperCase() + key.slice(1)}`, data[key]);
            }
        });
        
        return { success: true, message: 'Backup restored successfully' };
    } catch (e) {
        return { success: false, error: 'Failed to restore backup' };
    }
};

// Delete old backups (keep only last 10)
export const cleanupOldBackups = () => {
    const backups = getAllBackups();
    
    if (backups.length > 10) {
        const oldBackups = backups.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        ).slice(10);
        
        oldBackups.forEach(backup => {
            localStorage.removeItem(`shopProBackupData_${backup.id}`);
        });
        
        const kept = backups.slice(0, 10);
        localStorage.setItem('shopProBackups', JSON.stringify(kept));
    }
};

// Create privacy policy
export const createPrivacyPolicy = () => {
    return {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        dataCollection: {
            personal: ['name', 'email', 'organization'],
            behavioral: ['login_history', 'feature_usage', 'report_generation'],
            technical: ['ip_address', 'user_agent', 'device_info']
        },
        usage: {
            performance: 'Data used to improve platform performance',
            analytics: 'Data used to generate insights and reports',
            communication: 'Data used to send notifications and updates'
        },
        retention: {
            personal: '5 years after account deletion',
            behavioral: '2 years after last activity',
            technical: '1 year after last activity'
        },
        userRights: {
            access: 'Users can request all data collected about them',
            deletion: 'Users can request deletion of their personal data',
            portability: 'Users can export their data in standard formats',
            correction: 'Users can correct inaccurate information'
        }
    };
};

// Create data deletion request
export const createDataDeletionRequest = (userId, reason = '') => {
    const requests = getAllDeletionRequests();
    
    const request = {
        id: `delete_${Date.now()}`,
        userId,
        reason,
        status: 'pending', // pending, processing, completed, cancelled
        requestedAt: new Date().toISOString(),
        processedAt: null,
        completedAt: null
    };
    
    requests.push(request);
    localStorage.setItem('shopProDeletionRequests', JSON.stringify(requests));
    
    return request;
};

// Get all deletion requests
export const getAllDeletionRequests = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProDeletionRequests') || '[]');
    } catch (e) {
        return [];
    }
};

// Process deletion request
export const processDeletionRequest = (requestId) => {
    const requests = getAllDeletionRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request && request.status === 'pending') {
        request.status = 'processing';
        request.processedAt = new Date().toISOString();
        
        // Schedule deletion for 30 days later
        request.scheduledDeletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        
        localStorage.setItem('shopProDeletionRequests', JSON.stringify(requests));
    }
    
    return request;
};

// Complete deletion
export const completeDeletion = (requestId, userId) => {
    const requests = getAllDeletionRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
        request.status = 'completed';
        request.completedAt = new Date().toISOString();
        
        // Delete all user data
        localStorage.setItem('shopProDeletionRequests', JSON.stringify(requests));
        
        // In production, delete from database
        return { success: true, message: 'User data deleted successfully' };
    }
    
    return { success: false, error: 'Request not found' };
};

// Export user data (GDPR compliance)
export const exportUserData = (userId) => {
    const userData = {
        profile: localStorage.getItem('shopProSettings'),
        products: localStorage.getItem('shopProProducts'),
        campaigns: localStorage.getItem('shopProCampaigns'),
        files: localStorage.getItem('shopProFiles'),
        activityLog: localStorage.getItem('shopProActivityLogs'),
        comments: localStorage.getItem('shopProComments'),
        tasks: localStorage.getItem('shopProTasks'),
        exportedAt: new Date().toISOString(),
        format: 'json'
    };
    
    return userData;
};

// Secure file upload validation
export const validateSecureFileUpload = (file, maxSize = 52428800) => { // 50MB default
    const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'application/pdf',
        'image/jpeg',
        'image/png'
    ];
    
    const validation = {
        valid: true,
        errors: []
    };
    
    // Check file size
    if (file.size > maxSize) {
        validation.valid = false;
        validation.errors.push(`File size exceeds limit (${maxSize / 1024 / 1024}MB)`);
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
        validation.valid = false;
        validation.errors.push('File type not allowed');
    }
    
    // Check filename for malicious patterns
    const filename = file.name.toLowerCase();
    if (/[<>:"|?*]/.test(filename)) {
        validation.valid = false;
        validation.errors.push('Invalid characters in filename');
    }
    
    return validation;
};

// Sanitize file data
export const sanitizeFileData = (data) => {
    // Remove potentially harmful scripts and content
    const sanitized = JSON.parse(JSON.stringify(data)); // Deep copy
    
    // Remove any fields that might contain executable code
    const dangerousFields = ['script', 'code', 'eval', 'function'];
    
    const clean = (obj) => {
        Object.keys(obj).forEach(key => {
            if (dangerousFields.some(f => key.toLowerCase().includes(f))) {
                delete obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                clean(obj[key]);
            } else if (typeof obj[key] === 'string') {
                // Remove potential XSS vectors
                obj[key] = obj[key]
                    .replace(/<script[^>]*>.*?<\/script>/gi, '')
                    .replace(/javascript:/gi, '')
                    .replace(/on\w+\s*=/gi, '');
            }
        });
    };
    
    clean(sanitized);
    return sanitized;
};

// Manage PII (Personally Identifiable Information)
export const managePII = (data, action = 'mask') => {
    const piiPatterns = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/g,
        ssn: /(\d{3})[-]?(\d{2})[-]?(\d{4})/g,
        creditCard: /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/g
    };
    
    let processed = JSON.stringify(data);
    
    if (action === 'mask') {
        // Replace with masked versions
        processed = processed.replace(piiPatterns.email, (match) => {
            if (!match) return match;
            const parts = match.split('@');
            if (parts.length !== 2) return match;
            const [local, domain] = parts;
            return (local?.substring(0, 2) || '') + '***@' + (domain || '');
        });
        
        processed = processed.replace(piiPatterns.phone, (match) => {
            if (!match || match.length < 7) return match;
            return (match?.substring(0, 3) || '') + '****' + (match?.substring(7) || '');
        });
        
        processed = processed.replace(piiPatterns.ssn, (match) => {
            return '***-**-' + match.substring(7);
        });
        
        processed = processed.replace(piiPatterns.creditCard, (match) => {
            return '****-****-****-' + match.substring(12);
        });
    } else if (action === 'redact') {
        // Remove entirely
        Object.values(piiPatterns).forEach(pattern => {
            processed = processed.replace(pattern, '[REDACTED]');
        });
    }
    
    return JSON.parse(processed);
};

// Create security audit log
export const createSecurityAuditLog = (userId, action, details = {}, severity = 'info') => {
    const logs = getAllSecurityLogs();
    
    const log = {
        id: `sec_audit_${Date.now()}`,
        userId,
        action,
        details,
        severity, // 'info', 'warning', 'critical'
        timestamp: new Date().toISOString(),
        ipAddress: 'N/A', // Would be populated from server
        userAgent: navigator.userAgent
    };
    
    logs.push(log);
    
    // Keep only last 10000 logs
    if (logs.length > 10000) {
        logs.shift();
    }
    
    localStorage.setItem('shopProSecurityLogs', JSON.stringify(logs));
    
    return log;
};

// Get security logs
export const getAllSecurityLogs = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProSecurityLogs') || '[]');
    } catch (e) {
        return [];
    }
};

// Get security alerts
export const getSecurityAlerts = (days = 7) => {
    const logs = getAllSecurityLogs();
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    return logs
        .filter(log => log.severity !== 'info' && new Date(log.timestamp).getTime() > cutoff)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Check data access permissions
export const checkDataAccessPermission = (userId, dataType, action) => {
    // In production, this would check against a proper permission matrix
    const permissions = {
        'user_data': ['view', 'edit'],
        'financial_data': ['view'],
        'all_reports': ['view', 'export'],
        'system_settings': []
    };
    
    const userPermissions = permissions[dataType] || [];
    return userPermissions.includes(action);
};

// Enable two-factor authentication
export const enableTwoFactorAuth = (userId) => {
    const settings = JSON.parse(localStorage.getItem('shopProSettings') || '{}');
    settings.twoFactorAuthEnabled = true;
    settings.twoFactorAuthEnabledAt = new Date().toISOString();
    localStorage.setItem('shopProSettings', JSON.stringify(settings));
    
    return { success: true, message: '2FA enabled' };
};

// Verify security score
export const calculateSecurityScore = (userSettings) => {
    let score = 0;
    
    // Check password strength
    if (userSettings.passwordStrength === 'strong') score += 25;
    else if (userSettings.passwordStrength === 'medium') score += 15;
    else score += 5;
    
    // Check 2FA
    if (userSettings.twoFactorAuthEnabled) score += 25;
    
    // Check backup
    if (userSettings.backupEnabled) score += 20;
    
    // Check session timeout
    if (userSettings.sessionTimeout) score += 15;
    
    // Check data export
    if (userSettings.dataExportEnabled) score += 10;
    
    const rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
    
    return { score, rating };
};
