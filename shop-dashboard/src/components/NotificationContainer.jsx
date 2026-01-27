import React, { useEffect, useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  Music,
  ShoppingCart,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Single ImportNotification Component
 * Displays a toast-style notification for import events
 * Auto-dismisses after 6 seconds
 * 
 * @param {object} notification - { id, type: "success"|"failed"|"partial", title, message, details, onDismiss }
 * @param {function} onDismiss - Callback to remove notification
 * @param {function} onOpenErrorHelp - Callback to open error help modal with errorCode
 * @param {function} onOpenDataSourcesView - Callback to open data sources view
 * @returns {JSX.Element}
 */
const ImportNotification = ({ notification, onDismiss, onOpenErrorHelp, onOpenDataSourcesView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  // Notification configuration
  const notificationConfig = {
    'success': {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      iconColor: 'text-emerald-600',
      accentColor: 'bg-emerald-500'
    },
    'failed': {
      icon: AlertCircle,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-800',
      iconColor: 'text-rose-600',
      accentColor: 'bg-rose-500'
    },
    'partial': {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      iconColor: 'text-amber-600',
      accentColor: 'bg-amber-500'
    }
  };

  // Platform icons
  const platformIcons = {
    'TikTok': Music,
    'Lazada': ShoppingCart,
    'Shopee': Package
  };

  const config = notificationConfig[notification.type] || notificationConfig['success'];
  const Icon = config.icon;
  const PlatformIcon = platformIcons[notification.details?.platform] || Package;
  const hasErrors = notification.details?.errors && notification.details.errors.length > 0;

  return (
    <div 
      className={`relative mb-3 ${notification.type === 'success' ? 'animate-in fade-in slide-in-from-right-full duration-300' : 'animate-in fade-in duration-200'}`}
    >
      <div className={`${config.bgColor} border-l-4 ${config.accentColor} rounded-lg shadow-lg overflow-hidden`}>
        {/* Main Content */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 pt-0.5">
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className={`font-bold text-sm ${config.textColor}`}>
                    {notification.title}
                  </h3>
                  <p className={`text-sm mt-1 ${config.textColor} opacity-80`}>
                    {notification.message}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              {notification.details && (
                <div className={`mt-3 text-xs space-y-1 ${config.textColor} opacity-70`}>
                  <div className="flex items-center gap-2">
                    <PlatformIcon className="w-3 h-3" />
                    <span>
                      <strong>Platform:</strong> {notification.details.platform || 'Unknown'}
                    </span>
                  </div>
                  {notification.details.fileName && (
                    <div>
                      <strong>File:</strong> {notification.details.fileName}
                    </div>
                  )}
                  {notification.details.timestamp && (
                    <div>
                      <strong>Time:</strong> {new Date(notification.details.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                  {notification.details.recordsProcessed !== undefined && (
                    <div>
                      <strong>Processed:</strong> {notification.details.recordsProcessed} record{notification.details.recordsProcessed !== 1 ? 's' : ''}
                    </div>
                  )}
                  {notification.details.recordsFailed !== undefined && notification.details.recordsFailed > 0 && (
                    <div>
                      <strong>Failed:</strong> {notification.details.recordsFailed} record{notification.details.recordsFailed !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}

              {/* Expandable Errors Section */}
              {hasErrors && (
                <div className="mt-3">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`flex items-center gap-1 text-xs font-semibold ${config.textColor} hover:opacity-100 opacity-80 transition-opacity`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Hide errors
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show {(notification?.details?.errors?.length || 0)} error{(notification?.details?.errors?.length || 0) !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <div className={`mt-2 p-2 rounded ${notification.type === 'failed' ? 'bg-rose-100' : notification.type === 'partial' ? 'bg-amber-100' : 'bg-emerald-100'} border ${notification.type === 'failed' ? 'border-rose-300' : notification.type === 'partial' ? 'border-amber-300' : 'border-emerald-300'}`}>
                      <ul className="space-y-1">
                        {(notification?.details?.errors || []).map((error, idx) => (
                          <li key={idx} className={`text-xs font-mono ${config.textColor} opacity-75`}>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {notification.type === 'success' && onOpenDataSourcesView && (
                  <button
                    onClick={() => onOpenDataSourcesView()}
                    className="text-xs font-semibold px-3 py-1.5 rounded transition-colors bg-emerald-200 text-emerald-800 hover:bg-emerald-300"
                  >
                    View Data Sources
                  </button>
                )}
                {notification.type === 'failed' && notification.details?.errorCode && onOpenErrorHelp && (
                  <button
                    onClick={() => onOpenErrorHelp(notification.details.errorCode)}
                    className="text-xs font-semibold px-3 py-1.5 rounded transition-colors bg-rose-200 text-rose-800 hover:bg-rose-300"
                  >
                    Get Help
                  </button>
                )}
                {notification.actions && notification.actions.length > 0 && notification.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.action}
                    className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                      notification.type === 'success' 
                        ? 'bg-emerald-200 text-emerald-800 hover:bg-emerald-300' 
                        : notification.type === 'failed'
                        ? 'bg-rose-200 text-rose-800 hover:bg-rose-300'
                        : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onDismiss(notification.id)}
              className={`flex-shrink-0 p-1 rounded-lg transition-all ${config.textColor} opacity-50 hover:opacity-100 hover:bg-white/20`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * NotificationContainer Component
 * Manages and displays multiple notifications
 * Place this once at the top level (e.g., in App.jsx)
 * 
 * @param {array} notifications - Array of notification objects
 * @param {function} onDismiss - Callback to remove notification by ID
 * @param {function} onOpenErrorHelp - Callback to open error help modal
 * @param {function} onOpenDataSourcesView - Callback to open data sources view
 * @returns {JSX.Element}
 */
const NotificationContainer = ({ notifications = [], onDismiss, onOpenErrorHelp, onOpenDataSourcesView }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-40 max-w-md space-y-3 pointer-events-auto">
      {notifications.slice(-3).map((notification) => (
        <ImportNotification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          onOpenErrorHelp={onOpenErrorHelp}
          onOpenDataSourcesView={onOpenDataSourcesView}
        />
      ))}
    </div>
  );
};

export { ImportNotification, NotificationContainer };
export default ImportNotification;
