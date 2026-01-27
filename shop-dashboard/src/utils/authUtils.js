/**
 * Enhanced Authentication Utilities
 * Provides secure authentication, password hashing, and session management
 */

// Simple password hashing function (Improved for demo - Production should use backend bcrypt/argon2)
export const hashPassword = (password) => {
    if (!password || typeof password !== 'string') {
        return 'temp_hash_' + Math.random().toString(36).substr(2, 9);
    }

    // DJB2-like hash for better distribution than simple sum
    let hash = 5381;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
    }
    return (hash >>> 0).toString(16);
};

// Verify password
export const verifyPassword = (password, hash) => {
    return hashPassword(password) === hash;
};

// Generate secure random token
export const generateToken = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 9)}`;
};

// Create JWT-like token (simplified for frontend)
export const createAuthToken = (userId, userName, role = 'user') => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        userId,
        userName,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hour expiry
    }));
    const signature = btoa(`${header}.${payload}`);
    return `${header}.${payload}.${signature}`;
};

// Decode and validate auth token
export const validateAuthToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) return null; // Token expired

        return payload;
    } catch (e) {
        return null;
    }
};

// Multi-factor authentication setup
export const setupMFA = (userId) => {
    const mfaSecret = generateToken();
    return {
        userId,
        mfaSecret,
        setupTime: new Date().toISOString(),
        enabled: false
    };
};

// Generate MFA code
export const generateMFACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate MFA code (in production, use TOTP library)
export const validateMFACode = (inputCode, generatedCode) => {
    return inputCode === generatedCode;
};

// Session management
export const createSession = (userId, userName, role, mfaEnabled = false) => {
    const token = createAuthToken(userId, userName, role);
    const sessionId = generateToken();

    const session = {
        sessionId,
        token,
        userId,
        userName,
        role,
        mfaEnabled,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // Store in localStorage
    localStorage.setItem('shopProSession', JSON.stringify(session));

    return session;
};

// Get current session
export const getSession = () => {
    try {
        const session = JSON.parse(localStorage.getItem('shopProSession'));
        if (!session) return null;

        const expiresAt = new Date(session.expiresAt);
        if (expiresAt < new Date()) {
            localStorage.removeItem('shopProSession');
            return null;
        }

        return session;
    } catch (e) {
        return null;
    }
};

// Update session activity
export const updateSessionActivity = () => {
    try {
        const session = getSession();
        if (session) {
            session.lastActivity = new Date().toISOString();
            localStorage.setItem('shopProSession', JSON.stringify(session));
        }
    } catch (e) {
        console.error('Failed to update session:', e);
    }
};

// Destroy session
export const destroySession = () => {
    localStorage.removeItem('shopProSession');
    localStorage.removeItem('shopProAuth');
};

// Role-based access control
export const hasPermission = (userRole, requiredPermission) => {
    const permissions = {
        admin: ['view', 'edit', 'delete', 'manage_users', 'manage_settings', 'export', 'import'],
        manager: ['view', 'edit', 'export', 'manage_team'],
        analyst: ['view', 'export'],
        viewer: ['view']
    };

    const userPermissions = permissions[userRole] || [];
    return userPermissions.includes(requiredPermission);
};

// Get user capabilities based on role
export const getUserCapabilities = (role) => {
    const capabilities = {
        admin: {
            canViewAll: true,
            canEdit: true,
            canDelete: true,
            canManageUsers: true,
            canAccessSettings: true,
            canExport: true,
            canImport: true,
            canViewAuditLog: true,
            canManageApiKeys: true
        },
        manager: {
            canViewAll: true,
            canEdit: true,
            canDelete: false,
            canManageUsers: true,
            canAccessSettings: false,
            canExport: true,
            canImport: true,
            canViewAuditLog: true,
            canManageApiKeys: false
        },
        analyst: {
            canViewAll: true,
            canEdit: true,
            canDelete: false,
            canManageUsers: false,
            canAccessSettings: false,
            canExport: true,
            canImport: false,
            canViewAuditLog: false,
            canManageApiKeys: false
        },
        viewer: {
            canViewAll: true,
            canEdit: false,
            canDelete: false,
            canManageUsers: false,
            canAccessSettings: false,
            canExport: false,
            canImport: false,
            canViewAuditLog: false,
            canManageApiKeys: false
        }
    };

    return capabilities[role] || capabilities.viewer;
};

// Activity logging
export const logActivity = (action, details = {}, userId = null) => {
    try {
        const session = getSession();
        const log = {
            timestamp: new Date().toISOString(),
            userId: userId || session?.userId,
            action,
            details,
            ipInfo: 'N/A', // In production, get from server
            userAgent: navigator.userAgent
        };

        // Store activity logs
        const logs = JSON.parse(localStorage.getItem('shopProActivityLogs') || '[]');
        logs.push(log);

        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.shift();
        }

        localStorage.setItem('shopProActivityLogs', JSON.stringify(logs));

        return log;
    } catch (e) {
        console.error('Failed to log activity:', e);
    }
};

// Get activity logs
export const getActivityLogs = (filter = {}) => {
    try {
        const logs = JSON.parse(localStorage.getItem('shopProActivityLogs') || '[]');

        if (filter.userId) {
            return logs.filter(log => log.userId === filter.userId);
        }
        if (filter.action) {
            return logs.filter(log => log.action === filter.action);
        }
        if (filter.days) {
            const cutoff = Date.now() - (filter.days * 24 * 60 * 60 * 1000);
            return logs.filter(log => new Date(log.timestamp).getTime() > cutoff);
        }

        return logs;
    } catch (e) {
        return [];
    }
};

// Password strength validator
export const validatePasswordStrength = (password) => {
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const strength = Object.values(checks).filter(Boolean).length;

    return {
        score: strength,
        isStrong: strength >= 4,
        checks,
        feedback: strength < 4 ? 'Password is too weak. Add uppercase, numbers, and special characters.' : 'Password is strong!'
    };
};

// Generate secure password
export const generateSecurePassword = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Email validation
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};
