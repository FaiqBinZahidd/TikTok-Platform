import React from 'react';
import { ChevronDown, X, Filter, Zap } from 'lucide-react';

/**
 * Advanced Filter Panel Component
 * Provides UI for advanced filtering by GMV range, health score, ABC category, etc.
 */
export const AdvancedFilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle 
}) => {
  const handleGmvRangeChange = (field, value) => {
    onFiltersChange({
      ...filters,
      gmvRange: {
        ...filters.gmvRange,
        [field]: value
      }
    });
  };

  const handleHealthScoreChange = (value) => {
    onFiltersChange({
      ...filters,
      healthScore: value
    });
  };

  const handleABCCategoryChange = (value) => {
    onFiltersChange({
      ...filters,
      abcCategory: value
    });
  };

  const handleDateRangeChange = (field, value) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { start: null, end: null },
      month: null,
      gmvRange: { min: 0, max: 99999 },
      healthScore: 0,
      abcCategory: 'all'
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-violet-300 transition-all group"
      >
        <Zap className="w-4 h-4 group-hover:text-amber-500 transition-colors" />
        Advanced Filters
        <ChevronDown className={`w-3 h-3 ml-1 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-slate-200 p-6 w-full max-w-2xl z-30 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-slate-800">Advanced Filters</h3>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-rose-600 font-bold transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GMV Range */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                GMV Range (฿)
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.gmvRange.min}
                    onChange={(e) => handleGmvRangeChange('min', parseInt(e.target.value) || 0)}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={filters.gmvRange.max}
                    onChange={(e) => handleGmvRangeChange('max', parseInt(e.target.value) || 99999)}
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                  Range: ฿{filters.gmvRange.min.toLocaleString()} - ฿{filters.gmvRange.max.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Minimum Health Score
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.healthScore}
                  onChange={(e) => handleHealthScoreChange(parseInt(e.target.value))}
                  className="w-full accent-violet-600"
                />
                <div className="text-sm font-mono font-bold text-violet-600">
                  {filters.healthScore}/100
                </div>
              </div>
            </div>

            {/* ABC Category */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                ABC Category
              </label>
              <div className="space-y-2">
                {['all', 'A', 'B', 'C'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleABCCategoryChange(cat)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      filters.abcCategory === cat
                        ? 'bg-violet-100 text-violet-700 border border-violet-300'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-violet-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : `Class ${cat}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Import Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <input
                  type="date"
                  value={filters.dateRange.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              onClick={onToggle}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={onToggle}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedFilterPanel;
