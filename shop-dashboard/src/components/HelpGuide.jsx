import React from 'react';

const HelpGuide = ({ title, content, children }) => {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl z-50 pointer-events-none">
        <div className="font-bold mb-1 border-b border-slate-600 pb-1 text-slate-200">{title}</div>
        <div className="leading-relaxed text-slate-300 font-medium">{content}</div>
        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default HelpGuide;
