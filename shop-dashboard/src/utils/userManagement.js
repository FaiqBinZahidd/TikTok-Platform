/**
 * User Management Utilities
 * Handles user creation, roles, permissions, and team management
 */

import { hashPassword, logActivity, generateToken } from './authUtils.js';

// Initialize default admin user if none exists
export const initializeDefaultUser = () => {
    const users = getAllUsers();
    if (users.length === 0) {
        const adminUser = {
            id: 'user_' + generateToken(),
            email: 'admin@quantro.com',
            name: 'System Admin',
            role: 'admin',
            passwordHash: hashPassword('admin123'), // Must be changed on first login
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null,
            mfaEnabled: false,
            status: 'active',
            department: 'Management'
        };
        
        const users = [adminUser];
        localStorage.setItem('shopProUsers', JSON.stringify(users));
        return adminUser;
    }
    return users[0];
};

// Get all users
export const getAllUsers = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProUsers') || '[]');
    } catch (e) {
        return [];
    }
};

// Get user by ID
export const getUserById = (userId) => {
    const users = getAllUsers();
    return users.find(u => u.id === userId) || null;
};

// Get user by email
export const getUserByEmail = (email) => {
    const users = getAllUsers();
    return users.find(u => u.email === email.toLowerCase()) || null;
};

// Create new user
export const createUser = (userData, createdByUserId) => {
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
    }
    
    const newUser = {
        id: 'user_' + generateToken(),
        email: userData.email.toLowerCase(),
        name: userData.name,
        role: userData.role || 'analyst',
        passwordHash: hashPassword(userData.password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        mfaEnabled: false,
        status: 'active',
        department: userData.department || 'General',
        phone: userData.phone || '',
        avatar: userData.avatar || null,
        preferences: {
            theme: 'light',
            emailNotifications: true,
            twoFactorAuth: false
        }
    };
    
    const users = getAllUsers();
    users.push(newUser);
    localStorage.setItem('shopProUsers', JSON.stringify(users));
    
    // Log activity
    logActivity('USER_CREATED', { newUserId: newUser.id, email: newUser.email }, createdByUserId);
    
    return { success: true, user: newUser };
};

// Update user
export const updateUser = (userId, updates, updatedByUserId) => {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return { success: false, error: 'User not found' };
    }
    
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
        id: users[userIndex].id, // Prevent ID change
        createdAt: users[userIndex].createdAt // Prevent creation date change
    };
    
    localStorage.setItem('shopProUsers', JSON.stringify(users));
    
    logActivity('USER_UPDATED', { userId, changes: Object.keys(updates) }, updatedByUserId);
    
    return { success: true, user: users[userIndex] };
};

// Delete user (soft delete)
export const deleteUser = (userId, deletedByUserId) => {
    const result = updateUser(userId, { status: 'inactive' }, deletedByUserId);
    
    if (result.success) {
        logActivity('USER_DELETED', { userId }, deletedByUserId);
    }
    
    return result;
};

// Restore deleted user
export const restoreUser = (userId, restoredByUserId) => {
    return updateUser(userId, { status: 'active' }, restoredByUserId);
};

// Get active users
export const getActiveUsers = () => {
    const users = getAllUsers();
    return users.filter(u => u.status === 'active');
};

// Update last login
export const updateLastLogin = (userId) => {
    return updateUser(userId, { lastLogin: new Date().toISOString() }, userId);
};

// Get users by role
export const getUsersByRole = (role) => {
    const users = getAllUsers();
    return users.filter(u => u.role === role && u.status === 'active');
};

// Get users by department
export const getUsersByDepartment = (department) => {
    const users = getAllUsers();
    return users.filter(u => u.department === department && u.status === 'active');
};

// Change password
export const changePassword = (userId, oldPassword, newPassword, changedByUserId) => {
    const user = getUserById(userId);
    if (!user) {
        return { success: false, error: 'User not found' };
    }
    
    // Verify old password
    if (hashPassword(oldPassword) !== user.passwordHash) {
        logActivity('PASSWORD_CHANGE_FAILED', { userId, reason: 'Invalid old password' }, userId);
        return { success: false, error: 'Current password is incorrect' };
    }
    
    const result = updateUser(userId, { passwordHash: hashPassword(newPassword) }, changedByUserId);
    
    if (result.success) {
        logActivity('PASSWORD_CHANGED', { userId }, userId);
    }
    
    return result;
};

// Reset password (admin only)
export const resetPassword = (userId, newPassword, resetByUserId) => {
    const result = updateUser(userId, { passwordHash: hashPassword(newPassword) }, resetByUserId);
    
    if (result.success) {
        logActivity('PASSWORD_RESET', { userId, resetBy: resetByUserId }, userId);
    }
    
    return result;
};

// Team management
export const createTeam = (teamData, createdByUserId) => {
    const teams = getAllTeams();
    
    const newTeam = {
        id: 'team_' + generateToken(),
        name: teamData.name,
        description: teamData.description || '',
        members: [createdByUserId],
        manager: createdByUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
    };
    
    teams.push(newTeam);
    localStorage.setItem('shopProTeams', JSON.stringify(teams));
    
    logActivity('TEAM_CREATED', { teamId: newTeam.id, teamName: newTeam.name }, createdByUserId);
    
    return { success: true, team: newTeam };
};

// Get all teams
export const getAllTeams = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProTeams') || '[]');
    } catch (e) {
        return [];
    }
};

// Add member to team
export const addTeamMember = (teamId, userId, addedByUserId) => {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);
    
    if (teamIndex === -1) {
        return { success: false, error: 'Team not found' };
    }
    
    if (!teams[teamIndex].members.includes(userId)) {
        teams[teamIndex].members.push(userId);
        localStorage.setItem('shopProTeams', JSON.stringify(teams));
        
        logActivity('TEAM_MEMBER_ADDED', { teamId, userId }, addedByUserId);
        return { success: true, team: teams[teamIndex] };
    }
    
    return { success: false, error: 'User already in team' };
};

// Remove member from team
export const removeTeamMember = (teamId, userId, removedByUserId) => {
    const teams = getAllTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);
    
    if (teamIndex === -1) {
        return { success: false, error: 'Team not found' };
    }
    
    teams[teamIndex].members = teams[teamIndex].members.filter(id => id !== userId);
    localStorage.setItem('shopProTeams', JSON.stringify(teams));
    
    logActivity('TEAM_MEMBER_REMOVED', { teamId, userId }, removedByUserId);
    
    return { success: true, team: teams[teamIndex] };
};

// Get team members with user details
export const getTeamMembersDetails = (teamId) => {
    const teams = getAllTeams();
    const team = teams.find(t => t.id === teamId);
    
    if (!team) return [];
    
    return team.members.map(userId => getUserById(userId)).filter(Boolean);
};

// Invite user to team (creates invitation)
export const inviteUserToTeam = (teamId, email, invitedByUserId) => {
    const invitations = getAllInvitations();
    
    const newInvitation = {
        id: 'inv_' + generateToken(),
        teamId,
        email: email.toLowerCase(),
        status: 'pending',
        invitedBy: invitedByUserId,
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
    
    invitations.push(newInvitation);
    localStorage.setItem('shopProInvitations', JSON.stringify(invitations));
    
    logActivity('USER_INVITED_TO_TEAM', { teamId, email }, invitedByUserId);
    
    return { success: true, invitation: newInvitation };
};

// Get all invitations
export const getAllInvitations = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProInvitations') || '[]');
    } catch (e) {
        return [];
    }
};

// Accept invitation
export const acceptInvitation = (invitationId, userId) => {
    const invitations = getAllInvitations();
    const invIndex = invitations.findIndex(i => i.id === invitationId);
    
    if (invIndex === -1) {
        return { success: false, error: 'Invitation not found' };
    }
    
    const invitation = invitations[invIndex];
    
    // Check if invitation is expired
    if (new Date(invitation.expiresAt) < new Date()) {
        return { success: false, error: 'Invitation has expired' };
    }
    
    // Add user to team
    const addResult = addTeamMember(invitation.teamId, userId, userId);
    
    if (addResult.success) {
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date().toISOString();
        invitation.acceptedBy = userId;
        localStorage.setItem('shopProInvitations', JSON.stringify(invitations));
        
        logActivity('INVITATION_ACCEPTED', { invitationId, teamId: invitation.teamId }, userId);
        
        return { success: true, team: addResult.team };
    }
    
    return addResult;
};

// Get user preferences
export const getUserPreferences = (userId) => {
    const user = getUserById(userId);
    return user?.preferences || {};
};

// Update user preferences
export const updateUserPreferences = (userId, preferences) => {
    const user = getUserById(userId);
    if (!user) {
        return { success: false, error: 'User not found' };
    }
    
    return updateUser(userId, {
        preferences: { ...user.preferences, ...preferences }
    }, userId);
};

// Get user's teams
export const getUserTeams = (userId) => {
    const teams = getAllTeams();
    return teams.filter(t => t.members.includes(userId) && t.status === 'active');
};

// API Keys management
export const generateApiKey = (userId, keyName, generatedByUserId) => {
    const apiKeys = getAllApiKeys();
    
    const newKey = {
        id: 'key_' + generateToken(),
        userId,
        name: keyName,
        key: generateToken() + '_' + generateToken(),
        createdAt: new Date().toISOString(),
        lastUsed: null,
        status: 'active'
    };
    
    apiKeys.push(newKey);
    localStorage.setItem('shopProApiKeys', JSON.stringify(apiKeys));
    
    logActivity('API_KEY_GENERATED', { userId, keyName }, generatedByUserId);
    
    return { success: true, apiKey: newKey };
};

// Get all API keys
export const getAllApiKeys = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProApiKeys') || '[]');
    } catch (e) {
        return [];
    }
};

// Get user's API keys (without showing full key)
export const getUserApiKeys = (userId) => {
    const apiKeys = getAllApiKeys();
    return apiKeys.filter(k => k.userId === userId).map(k => ({
        ...k,
        key: k.key.substring(0, 10) + '...' // Only show first 10 chars
    }));
};

// Revoke API key
export const revokeApiKey = (keyId, revokedByUserId) => {
    const apiKeys = getAllApiKeys();
    const keyIndex = apiKeys.findIndex(k => k.id === keyId);
    
    if (keyIndex === -1) {
        return { success: false, error: 'API key not found' };
    }
    
    apiKeys[keyIndex].status = 'revoked';
    apiKeys[keyIndex].revokedAt = new Date().toISOString();
    localStorage.setItem('shopProApiKeys', JSON.stringify(apiKeys));
    
    logActivity('API_KEY_REVOKED', { keyId }, revokedByUserId);
    
    return { success: true };
};

// Validate API key
export const validateApiKey = (apiKey) => {
    const apiKeys = getAllApiKeys();
    const key = apiKeys.find(k => k.key === apiKey && k.status === 'active');
    
    if (key) {
        // Update last used
        key.lastUsed = new Date().toISOString();
        localStorage.setItem('shopProApiKeys', JSON.stringify(apiKeys));
        return { valid: true, userId: key.userId };
    }
    
    return { valid: false };
};
