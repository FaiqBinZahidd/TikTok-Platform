
export const parseCurrency = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace(/[^0-9.-]+/g, '')) || 0;
};

export const parsePercent = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    return parseFloat(val.toString().replace('%', '')) || 0;
};

export const parseInteger = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return Math.round(val);
    // Remove non-numeric chars except minus, parse, then round
    const float = parseFloat(val.toString().replace(/[^0-9.-]+/g, '')) || 0;
    return Math.round(float);
};

export const formatCurrency = (amount, currencySymbol = '฿') => {
    const val = typeof amount === 'number' ? amount : 0;
    return `${currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getBadgeColor = (category) => {
    switch (category) {
        case 'A': return 'bg-violet-100 text-violet-700 border-violet-200';
        case 'B': return 'bg-slate-100 text-slate-600 border-slate-200';
        default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
};

export const getHealthColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
};
