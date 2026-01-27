/**
 * Collaboration & Communication Utilities
 * Enables team collaboration, comments, approvals, and shared dashboards
 */

// Create comment
export const createComment = (targetId, targetType, content, userId, attachments = []) => {
    const comments = getAllComments();
    
    const newComment = {
        id: `comment_${Date.now()}`,
        targetId,
        targetType, // 'product', 'campaign', 'report', 'dashboard'
        authorId: userId,
        content,
        attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        replies: [],
        mentions: extractMentions(content),
        isEdited: false
    };
    
    comments.push(newComment);
    localStorage.setItem('shopProComments', JSON.stringify(comments));
    
    return newComment;
};

// Extract mentions from content
const extractMentions = (content) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
        mentions.push(match[1]);
    }
    
    return mentions;
};

// Get all comments
export const getAllComments = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProComments') || '[]');
    } catch (e) {
        return [];
    }
};

// Get comments for target
export const getCommentsForTarget = (targetId, targetType) => {
    const comments = getAllComments();
    return comments.filter(c => c.targetId === targetId && c.targetType === targetType)
                   .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Add reply to comment
export const replyToComment = (commentId, content, userId) => {
    const comments = getAllComments();
    const comment = comments.find(c => c.id === commentId);
    
    if (comment) {
        const reply = {
            id: `reply_${Date.now()}`,
            authorId: userId,
            content,
            createdAt: new Date().toISOString(),
            likes: []
        };
        
        comment.replies.push(reply);
        localStorage.setItem('shopProComments', JSON.stringify(comments));
        
        return reply;
    }
    
    return null;
};

// Like comment
export const likeComment = (commentId, userId) => {
    const comments = getAllComments();
    const comment = comments.find(c => c.id === commentId);
    
    if (comment && !comment.likes.includes(userId)) {
        comment.likes.push(userId);
        localStorage.setItem('shopProComments', JSON.stringify(comments));
    }
    
    return comment;
};

// Delete comment
export const deleteComment = (commentId) => {
    const comments = getAllComments();
    const filtered = comments.filter(c => c.id !== commentId);
    localStorage.setItem('shopProComments', JSON.stringify(filtered));
    return filtered;
};

// Create approval request
export const createApprovalRequest = (itemId, itemType, requesterUserId, approverUserId, description = '') => {
    const approvals = getAllApprovals();
    
    const newApproval = {
        id: `approval_${Date.now()}`,
        itemId,
        itemType, // 'campaign', 'discount', 'promo', 'report'
        requester: requesterUserId,
        approvers: [approverUserId],
        status: 'pending', // pending, approved, rejected
        description,
        createdAt: new Date().toISOString(),
        comments: [],
        attachments: [],
        decisions: [] // {approverId, decision, reason, timestamp}
    };
    
    approvals.push(newApproval);
    localStorage.setItem('shopProApprovals', JSON.stringify(approvals));
    
    return newApproval;
};

// Get all approvals
export const getAllApprovals = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProApprovals') || '[]');
    } catch (e) {
        return [];
    }
};

// Get pending approvals for user
export const getPendingApprovalsForUser = (userId) => {
    const approvals = getAllApprovals();
    return approvals.filter(a => (a?.approvers || []).includes(userId) && a?.status === 'pending');
};

// Approve request
export const approveRequest = (approvalId, userId, reason = '') => {
    const approvals = getAllApprovals();
    const approval = approvals.find(a => a.id === approvalId);
    
    if (approval && (approval?.approvers || []).includes(userId)) {
        if (!Array.isArray(approval.decisions)) {
            approval.decisions = [];
        }
        approval.decisions.push({
            approverId: userId,
            decision: 'approved',
            reason,
            timestamp: new Date().toISOString()
        });
        
        // Check if all approvers approved
        if ((approval?.decisions || []).filter(d => d?.decision === 'approved').length === (approval?.approvers || []).length) {
            approval.status = 'approved';
        }
        
        localStorage.setItem('shopProApprovals', JSON.stringify(approvals));
    }
    
    return approval;
};

// Reject request
export const rejectRequest = (approvalId, userId, reason) => {
    const approvals = getAllApprovals();
    const approval = approvals.find(a => a.id === approvalId);
    
    if (approval && approval.approvers.includes(userId)) {
        approval.decisions.push({
            approverId: userId,
            decision: 'rejected',
            reason,
            timestamp: new Date().toISOString()
        });
        
        approval.status = 'rejected';
        localStorage.setItem('shopProApprovals', JSON.stringify(approvals));
    }
    
    return approval;
};

// Create shared dashboard
export const createSharedDashboard = (dashboardName, config, createdByUserId, sharedWith = []) => {
    const dashboards = getAllSharedDashboards();
    
    const newDashboard = {
        id: `dashboard_${Date.now()}`,
        name: dashboardName,
        config, // {widgets, layout, filters}
        createdBy: createdByUserId,
        sharedWith: sharedWith, // array of {userId, permission: 'view', 'edit', 'admin'}
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        lastViewed: null,
        isPublic: false
    };
    
    dashboards.push(newDashboard);
    localStorage.setItem('shopProSharedDashboards', JSON.stringify(dashboards));
    
    return newDashboard;
};

// Get all shared dashboards
export const getAllSharedDashboards = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProSharedDashboards') || '[]');
    } catch (e) {
        return [];
    }
};

// Get dashboards shared with user
export const getDashboardsSharedWithUser = (userId) => {
    const dashboards = getAllSharedDashboards();
    return dashboards.filter(d => 
        d.sharedWith.some(share => share.userId === userId) || 
        d.createdBy === userId ||
        d.isPublic
    );
};

// Share dashboard with user
export const shareDashboardWithUser = (dashboardId, userId, permission = 'view') => {
    const dashboards = getAllSharedDashboards();
    const dashboard = dashboards.find(d => d.id === dashboardId);
    
    if (dashboard) {
        const existingShare = dashboard.sharedWith.find(s => s.userId === userId);
        if (existingShare) {
            existingShare.permission = permission;
        } else {
            dashboard.sharedWith.push({ userId, permission });
        }
        
        dashboard.updatedAt = new Date().toISOString();
        localStorage.setItem('shopProSharedDashboards', JSON.stringify(dashboards));
    }
    
    return dashboard;
};

// Unshare dashboard
export const unshareDashboard = (dashboardId, userId) => {
    const dashboards = getAllSharedDashboards();
    const dashboard = dashboards.find(d => d.id === dashboardId);
    
    if (dashboard) {
        dashboard.sharedWith = dashboard.sharedWith.filter(s => s.userId !== userId);
        localStorage.setItem('shopProSharedDashboards', JSON.stringify(dashboards));
    }
    
    return dashboard;
};

// Make dashboard public
export const makePublicDashboard = (dashboardId) => {
    const dashboards = getAllSharedDashboards();
    const dashboard = dashboards.find(d => d.id === dashboardId);
    
    if (dashboard) {
        dashboard.isPublic = true;
        dashboard.publicLink = `https://quantro.com/dashboard/${dashboardId}`;
        localStorage.setItem('shopProSharedDashboards', JSON.stringify(dashboards));
    }
    
    return dashboard;
};

// Track dashboard views
export const trackDashboardView = (dashboardId) => {
    const dashboards = getAllSharedDashboards();
    const dashboard = dashboards.find(d => d.id === dashboardId);
    
    if (dashboard) {
        dashboard.views += 1;
        dashboard.lastViewed = new Date().toISOString();
        localStorage.setItem('shopProSharedDashboards', JSON.stringify(dashboards));
    }
    
    return dashboard;
};

// Create team announcement
export const createAnnouncement = (teamId, title, content, userId, priority = 'normal') => {
    const announcements = getAllAnnouncements();
    
    const newAnnouncement = {
        id: `announce_${Date.now()}`,
        teamId,
        title,
        content,
        authorId: userId,
        priority, // 'low', 'normal', 'high', 'critical'
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        readBy: [],
        archived: false
    };
    
    announcements.push(newAnnouncement);
    localStorage.setItem('shopProAnnouncements', JSON.stringify(announcements));
    
    return newAnnouncement;
};

// Get all announcements
export const getAllAnnouncements = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProAnnouncements') || '[]');
    } catch (e) {
        return [];
    }
};

// Mark announcement as read
export const markAnnouncementAsRead = (announcementId, userId) => {
    const announcements = getAllAnnouncements();
    const announcement = announcements.find(a => a.id === announcementId);
    
    if (announcement && !announcement.readBy.includes(userId)) {
        announcement.readBy.push(userId);
        localStorage.setItem('shopProAnnouncements', JSON.stringify(announcements));
    }
    
    return announcement;
};

// Get team announcements
export const getTeamAnnouncements = (teamId) => {
    const announcements = getAllAnnouncements();
    return announcements
        .filter(a => a.teamId === teamId && !a.archived && new Date(a.expiresAt) > new Date())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Create task/todo
export const createTask = (title, description, assigneeId, createdByUserId, dueDate = null, priority = 'medium') => {
    const tasks = getAllTasks();
    
    const newTask = {
        id: `task_${Date.now()}`,
        title,
        description,
        assignee: assigneeId,
        creator: createdByUserId,
        status: 'open', // 'open', 'in_progress', 'completed', 'cancelled'
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
        completedAt: null,
        comments: [],
        attachments: []
    };
    
    tasks.push(newTask);
    localStorage.setItem('shopProTasks', JSON.stringify(tasks));
    
    return newTask;
};

// Get all tasks
export const getAllTasks = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProTasks') || '[]');
    } catch (e) {
        return [];
    }
};

// Get tasks for user
export const getTasksForUser = (userId) => {
    const tasks = getAllTasks();
    return tasks.filter(t => t.assignee === userId && t.status !== 'cancelled');
};

// Update task status
export const updateTaskStatus = (taskId, status) => {
    const tasks = getAllTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.status = status;
        if (status === 'completed') {
            task.completedAt = new Date().toISOString();
        }
        localStorage.setItem('shopProTasks', JSON.stringify(tasks));
    }
    
    return task;
};

// Get collaboration stats
export const getCollaborationStats = (userId) => {
    const comments = getAllComments();
    const approvals = getAllApprovals();
    const tasks = getAllTasks();
    const announcements = getAllAnnouncements();
    
    return {
        myComments: comments.filter(c => c.authorId === userId).length,
        commentsOnMyItems: comments.filter(c => c.mentions.includes(userId)).length,
        pendingApprovals: approvals.filter(a => a.approvers.includes(userId) && a.status === 'pending').length,
        assignedTasks: tasks.filter(t => t.assignee === userId && t.status !== 'completed').length,
        completedTasks: tasks.filter(t => t.assignee === userId && t.status === 'completed').length,
        unreadAnnouncements: announcements.filter(a => !a.readBy.includes(userId)).length
    };
};
