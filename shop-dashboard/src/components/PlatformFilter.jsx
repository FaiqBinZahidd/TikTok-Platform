import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const PlatformFilter = ({ value, onChange, availablePlatforms, showLabel = false }) => {
  return (
    <div className="relative group z-30">
      <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all focus:ring-2 focus:ring-violet-500 focus:outline-none">
        <Filter className="w-3.5 h-3.5 text-violet-600" />
        {showLabel && <span className="text-slate-500 font-medium mr-1 hidden sm:inline">Platform:</span>}
        {value}
        <ChevronDown className="w-3 h-3 ml-1 opacity-50 transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute top-full right-0 pt-2 w-48 hidden group-hover:block z-50">
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-1 animate-in fade-in slide-in-from-top-2">
          {availablePlatforms && availablePlatforms.length > 0 ? (
            availablePlatforms.map((p, idx) => (
              <button
                key={`${p}-${idx}`}
                onClick={() => onChange(p)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${value === p ? 'bg-violet-50 text-violet-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {p}
                {value === p && <div className="w-1.5 h-1.5 rounded-full bg-violet-600"></div>}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-slate-400">No platforms available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformFilter;
