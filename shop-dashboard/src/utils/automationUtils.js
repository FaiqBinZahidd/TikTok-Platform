/**
 * Automation & Alerts Utilities
 * Manages automated workflows, alerts, and notifications
 */

// Create alert rule - supports both object and parameter styles
export const createAlertRule = (ruleNameOrObject, condition, action, userId) => {
    const alerts = getAllAlertRules();
    
    // Handle both function signatures
    let newRule;
    
    if (typeof ruleNameOrObject === 'object') {
        // Object-based call from AlertsView
        const { name, condition: cond, threshold, actionType, status } = ruleNameOrObject;
        newRule = {
            id: `alert_${Date.now()}`,
            name: name || 'Unnamed Alert',
            condition: cond || 'gmv_drop',
            threshold: threshold || 0,
            actionType: actionType || 'email',
            status: status || 'active',
            severity: 'medium',
            enabled: status !== 'inactive',
            createdAt: new Date().toISOString(),
            lastTriggered: null,
            read: false
        };
    } else {
        // Parameter-based call
        newRule = {
            id: `alert_${Date.now()}`,
            name: ruleNameOrObject,
            condition: {
                metric: condition?.metric,
                operator: condition?.operator,
                value: condition?.value,
                duration: condition?.duration || null
            },
            action: {
                type: action?.type,
                target: action?.target,
                message: action?.message || null
            },
            enabled: true,
            createdAt: new Date().toISOString(),
            createdBy: userId,
            lastTriggered: null,
            triggerCount: 0
        };
    }
    
    alerts.push(newRule);
    localStorage.setItem('shopProAlertRules', JSON.stringify(alerts));
    
    return newRule;
};

// Get all alert rules
export const getAllAlertRules = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProAlertRules') || '[]');
    } catch (e) {
        return [];
    }
};

// Evaluate alerts for a product
export const evaluateProductAlerts = (product) => {
    const rules = getAllAlertRules().filter(r => r.enabled);
    const triggeredAlerts = [];
    
    rules.forEach(rule => {
        const value = product[rule.condition.metric];
        let isTriggered = false;
        
        switch (rule.condition.operator) {
            case '>':
                isTriggered = value > rule.condition.value;
                break;
            case '<':
                isTriggered = value < rule.condition.value;
                break;
            case '=':
            case '==':
                isTriggered = value === rule.condition.value;
                break;
            case '!=':
                isTriggered = value !== rule.condition.value;
                break;
            case '>=':
                isTriggered = value >= rule.condition.value;
                break;
            case '<=':
                isTriggered = value <= rule.condition.value;
                break;
            default:
                isTriggered = false;
        }
        
        if (isTriggered) {
            triggeredAlerts.push({
                rule,
                product,
                triggeredAt: new Date().toISOString()
            });
            
            // Execute action
            executeAlertAction(rule, product);
            
            // Update rule stats
            rule.lastTriggered = new Date().toISOString();
            rule.triggerCount = (rule.triggerCount || 0) + 1;
        }
    });
    
    localStorage.setItem('shopProAlertRules', JSON.stringify(getAllAlertRules()));
    
    return triggeredAlerts;
};

// Execute alert action
export const executeAlertAction = (rule, product) => {
    const alert = {
        id: `ntf_${Date.now()}`,
        ruleId: rule.id,
        productId: product.id,
        type: rule.action.type,
        message: rule.action.message || `Alert: ${rule.name} - ${product.name}`,
        createdAt: new Date().toISOString(),
        read: false
    };
    
    // Store alert
    const alerts = getAllAlerts();
    alerts.push(alert);
    localStorage.setItem('shopProAlerts', JSON.stringify(alerts));
    
    // Execute based on type
    if (rule.action.type === 'email') {
        // In production, call email service
        console.log(`Email alert sent to ${rule.action.target}: ${alert.message}`);
    } else if (rule.action.type === 'webhook') {
        // In production, call webhook
        console.log(`Webhook triggered: ${rule.action.target}`);
    } else if (rule.action.type === 'auto_pause') {
        // Auto-pause product
        console.log(`Auto-pausing product: ${product.id}`);
    }
    
    return alert;
};

// Get all alerts
export const getAllAlerts = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProAlerts') || '[]');
    } catch (e) {
        return [];
    }
};

// Mark alert as read
export const markAlertAsRead = (alertId) => {
    const alerts = getAllAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
        alert.read = true;
        localStorage.setItem('shopProAlerts', JSON.stringify(alerts));
    }
    return alert;
};

// Delete alert (works with both alert rules and triggered alerts)
export const deleteAlertRule = (ruleId) => {
    // Try deleting from alert rules
    let rules = getAllAlertRules();
    let filtered = rules.filter(r => r.id !== ruleId);
    if (filtered.length < rules.length) {
        localStorage.setItem('shopProAlertRules', JSON.stringify(filtered));
        return filtered;
    }
    
    // Try deleting from active alerts
    const alerts = getAllAlerts();
    filtered = alerts.filter(a => a.id !== ruleId);
    localStorage.setItem('shopProAlerts', JSON.stringify(filtered));
    return filtered;
};

// Create automation workflow
export const createWorkflow = (workflowName, steps, userId) => {
    const workflows = getAllWorkflows();
    
    const newWorkflow = {
        id: `workflow_${Date.now()}`,
        name: workflowName,
        steps: steps, // Array of {action, condition, target}
        enabled: true,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        executionCount: 0,
        lastExecuted: null,
        schedule: null // cron expression for scheduled runs
    };
    
    workflows.push(newWorkflow);
    localStorage.setItem('shopProWorkflows', JSON.stringify(workflows));
    
    return newWorkflow;
};

// Get all workflows
export const getAllWorkflows = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProWorkflows') || '[]');
    } catch (e) {
        return [];
    }
};

// Execute workflow
export const executeWorkflow = (workflowId, context = {}) => {
    const workflows = getAllWorkflows();
    const workflow = workflows.find(w => w.id === workflowId);
    
    if (!workflow || !workflow.enabled) {
        return { success: false, error: 'Workflow not found or disabled' };
    }
    
    let results = [];
    
    for (let step of workflow.steps) {
        let stepResult = {
            step: step,
            executed: false,
            result: null
        };
        
        // Evaluate step condition
        if (step.condition && !evaluateCondition(step.condition, context)) {
            stepResult.skipped = true;
            results.push(stepResult);
            continue;
        }
        
        // Execute step action
        switch (step.action) {
            case 'send_notification':
                stepResult.result = `Notification sent to ${step.target}`;
                stepResult.executed = true;
                break;
            case 'update_product':
                stepResult.result = `Product updated: ${step.target}`;
                stepResult.executed = true;
                break;
            case 'pause_product':
                stepResult.result = `Product paused: ${step.target}`;
                stepResult.executed = true;
                break;
            case 'apply_discount':
                stepResult.result = `Discount applied: ${step.target}`;
                stepResult.executed = true;
                break;
            case 'trigger_webhook':
                stepResult.result = `Webhook triggered: ${step.target}`;
                stepResult.executed = true;
                break;
            default:
                stepResult.result = 'Unknown action';
        }
        
        results.push(stepResult);
    }
    
    // Update workflow stats
    workflow.executionCount += 1;
    workflow.lastExecuted = new Date().toISOString();
    localStorage.setItem('shopProWorkflows', JSON.stringify(workflows));
    
    return {
        success: true,
        workflowId,
        steps: results,
        executedAt: new Date().toISOString()
    };
};

// Evaluate condition
const evaluateCondition = (condition, context) => {
    if (!condition.metric) return true;
    
    const value = context[condition.metric];
    
    switch (condition.operator) {
        case '>': return value > condition.value;
        case '<': return value < condition.value;
        case '=': return value === condition.value;
        case '!=': return value !== condition.value;
        case '>=': return value >= condition.value;
        case '<=': return value <= condition.value;
        default: return true;
    }
};

// Create scheduled automation
export const scheduleAutomation = (automationId, cronExpression) => {
    const automations = getAllAutomations();
    const automation = automations.find(a => a.id === automationId);
    
    if (automation) {
        automation.schedule = cronExpression;
        automation.enabled = true;
        localStorage.setItem('shopProAutomations', JSON.stringify(automations));
    }
    
    return automation;
};

// Get all automations
export const getAllAutomations = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProAutomations') || '[]');
    } catch (e) {
        return [];
    }
};

// Create campaign automation
export const createCampaignAutomation = (campaignName, settings, userId) => {
    const campaigns = getAllCampaignAutomations();
    
    const newCampaign = {
        id: `campaign_${Date.now()}`,
        name: campaignName,
        type: settings.type, // 'discount', 'email', 'social', 'bundle'
        rules: settings.rules,
        targetProducts: settings.targetProducts || [],
        schedule: settings.schedule || null,
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        performance: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            revenue: 0
        }
    };
    
    campaigns.push(newCampaign);
    localStorage.setItem('shopProCampaignAutomations', JSON.stringify(campaigns));
    
    return newCampaign;
};

// Get all campaign automations
export const getAllCampaignAutomations = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProCampaignAutomations') || '[]');
    } catch (e) {
        return [];
    }
};

// Update campaign performance
export const updateCampaignPerformance = (campaignId, metrics) => {
    const campaigns = getAllCampaignAutomations();
    const campaign = campaigns.find(c => c.id === campaignId);
    
    if (campaign) {
        Object.assign(campaign.performance, metrics);
        localStorage.setItem('shopProCampaignAutomations', JSON.stringify(campaigns));
    }
    
    return campaign;
};

// Create scheduled report
export const createScheduledReport = (reportName, schedule, recipients, userId) => {
    const reports = getAllScheduledReports();
    
    const newReport = {
        id: `report_${Date.now()}`,
        name: reportName,
        schedule: schedule, // cron expression
        recipients: recipients, // array of emails
        format: 'pdf', // pdf, csv, html
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        lastSent: null,
        nextScheduled: calculateNextSchedule(schedule)
    };
    
    reports.push(newReport);
    localStorage.setItem('shopProScheduledReports', JSON.stringify(reports));
    
    return newReport;
};

// Get all scheduled reports
export const getAllScheduledReports = () => {
    try {
        return JSON.parse(localStorage.getItem('shopProScheduledReports') || '[]');
    } catch (e) {
        return [];
    }
};

// Calculate next schedule time (simplified)
const calculateNextSchedule = (cronExpression) => {
    // Simplified implementation - in production use a proper cron parser
    const cronMap = {
        'daily': 1,
        'weekly': 7,
        'monthly': 30,
        'quarterly': 90,
        'yearly': 365
    };
    
    const days = cronMap[cronExpression] || 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + days);
    
    return nextDate.toISOString();
};

// Pause/Resume automation
export const toggleAutomation = (automationId, enable) => {
    const automations = getAllAutomations();
    const automation = automations.find(a => a.id === automationId);
    
    if (automation) {
        automation.enabled = enable;
        localStorage.setItem('shopProAutomations', JSON.stringify(automations));
    }
    
    return automation;
};

// Get automation execution history
export const getAutomationHistory = (automationId, limit = 100) => {
    try {
        const history = JSON.parse(localStorage.getItem('shopProAutomationHistory') || '[]');
        return history
            .filter(h => h.automationId === automationId)
            .slice(-limit)
            .reverse();
    } catch (e) {
        return [];
    }
};

// Log automation execution
export const logAutomationExecution = (automationId, result) => {
    const history = JSON.parse(localStorage.getItem('shopProAutomationHistory') || '[]');
    
    history.push({
        automationId,
        result,
        executedAt: new Date().toISOString()
    });
    
    // Keep last 10000 records
    if (history.length > 10000) {
        history.shift();
    }
    
    localStorage.setItem('shopProAutomationHistory', JSON.stringify(history));
};

// Get automation statistics
export const getAutomationStats = () => {
    const automations = getAllAutomations();
    const alerts = getAllAlerts();
    const unreadAlerts = alerts.filter(a => !a.read);
    
    return {
        totalAutomations: automations.length,
        enabledAutomations: automations.filter(a => a.enabled).length,
        totalAlerts: alerts.length,
        unreadAlerts: unreadAlerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical' && !a.read).length
    };
};
