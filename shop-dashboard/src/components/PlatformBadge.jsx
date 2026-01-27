import React from 'react';

const PlatformBadge = ({ platform, size = 'sm', variant = 'full' }) => {
  const getPlatformStyle = (p) => {
    switch (p?.toLowerCase()) {
      case 'tiktok': return 'bg-black text-white border-black';
      case 'shopee': return 'bg-orange-500 text-white border-orange-500';
      case 'lazada': return 'bg-blue-600 text-white border-blue-600';
      case 'amazon': return 'bg-yellow-500 text-white border-yellow-500';
      case 'meta ads': return 'bg-blue-700 text-white border-blue-700';
      case 'google ads': return 'bg-red-500 text-white border-red-500';
      default: return 'bg-slate-200 text-slate-600 border-slate-300';
    }
  };

  const style = getPlatformStyle(platform);
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`inline-flex items-center justify-center rounded ${sizeClasses} font-bold border ${style} uppercase tracking-wider shadow-sm`}>
      {platform}
    </span>
  );
};

export default PlatformBadge;
