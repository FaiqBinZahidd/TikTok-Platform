import React from 'react';
import {
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { getErrorDetails } from '../utils/errorMessages';

/**
 * ErrorHelpModal Component
 * Displays detailed error information with solutions and guidance
 * @param {string} errorCode - The error code to display help for
 * @param {Function} onClose - Callback to close modal
 */
export default function ErrorHelpModal({ errorCode, onClose }) {
  const error = getErrorDetails(errorCode);

  // Get icon based on severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'medium':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      case 'low':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-slate-600" />;
    }
  };

  // Get background color based on severity
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-amber-50 border-amber-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-900';
      case 'medium':
        return 'text-amber-900';
      case 'low':
        return 'text-blue-900';
      default:
        return 'text-slate-900';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className={`border-b ${getSeverityBg(error.severity)} p-6 flex items-start justify-between`}>
          <div className="flex items-start gap-4">
            {getSeverityIcon(error.severity)}
            <div>
              <h1 className={`text-2xl font-bold ${getSeverityText(error.severity)}`}>
                {error.title}
              </h1>
              <p className={`text-sm mt-1 ${getSeverityText(error.severity)} opacity-75`}>
                Error Code: {error.code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Error Message */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              About This Error
            </h2>
            <p className="text-slate-900 text-lg">{error.message}</p>
          </div>

          {/* Causes */}
          {error.causes && error.causes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                What Causes This?
              </h2>
              <ul className="space-y-2">
                {error.causes.map((cause, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Solutions */}
          {error.solutions && error.solutions.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                How to Fix It
              </h2>
              <ol className="space-y-2">
                {error.solutions.map((solution, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 pt-0.5">{solution}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Step-by-Step Guide */}
          {error.steps && error.steps.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Step-by-Step Guide
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                {error.steps.map((step, idx) => (
                  <div key={idx} className="text-slate-700 flex items-start gap-3">
                    <span className="font-mono text-blue-600 font-bold flex-shrink-0">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example */}
          {error.example && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Example
              </h2>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                {error.example}
              </div>
            </div>
          )}

          {/* Required Columns */}
          {error.requiredColumns && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Required Columns
              </h2>
              <div className="space-y-2">
                {error.requiredColumns.map((col, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-violet-50 p-3 rounded-lg border border-violet-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    <span className="text-slate-700">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Template Link */}
          {error.template && (
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-indigo-900 font-medium mb-2">
                📋 {error.template}
              </p>
              <p className="text-xs text-indigo-700">
                Using the provided template ensures all columns are formatted correctly.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900 mb-1">💡 Tip</p>
                <p className="text-sm text-yellow-800">
                  Always review your data before uploading. Check column headers, remove empty rows,
                  and verify numeric values are properly formatted.
                </p>
              </div>
            </div>
          </div>

          {/* Learn More Link */}
          {error.learnMore && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="text-sm font-medium text-slate-700">Learn more</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>
          )}

          {/* Contact Support */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-700 mb-3">
              Still stuck? Our support team is here to help.
            </p>
            <button className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
          <p className="text-xs text-slate-500">
            Error Code: <span className="font-mono font-bold text-slate-700">{error.code}</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
