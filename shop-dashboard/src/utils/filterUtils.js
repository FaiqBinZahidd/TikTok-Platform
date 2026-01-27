/**
 * Advanced Filtering Utilities
 * Provides filtering and comparison capabilities across all features
 */

/**
 * Filter products by date range
 */
export const filterByDateRange = (products, startDate, endDate) => {
  if (!startDate || !endDate) return products;
  
  return products.filter(p => {
    const date = new Date(p.importDate);
    return date >= startDate && date <= endDate;
  });
};

/**
 * Filter products by month
 */
export const filterByMonth = (products, year, month) => {
  return products.filter(p => {
    const date = new Date(p.importDate);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

/**
 * Filter by platform(s)
 */
export const filterByPlatform = (products, platforms) => {
  if (!platforms || platforms.length === 0) return products;
  return products.filter(p => platforms.includes(p.platform));
};

/**
 * Filter by status
 */
export const filterByStatus = (products, status) => {
  if (status === 'All' || !status) return products;
  return products.filter(p => p.status === status);
};

/**
 * Filter by GMV range
 */
export const filterByGMVRange = (products, minGMV, maxGMV) => {
  return products.filter(p => p.gmv >= minGMV && p.gmv <= maxGMV);
};

/**
 * Filter by ABC category
 */
export const filterByABCCategory = (products, categories) => {
  if (!categories || categories.length === 0) return products;
  return products.filter(p => categories.includes(p.abcCategory));
};

/**
 * Filter by health score
 */
export const filterByHealthScore = (products, minScore, maxScore) => {
  return products.filter(p => {
    const score = p.healthScore || 0;
    return score >= minScore && score <= maxScore;
  });
};

/**
 * Apply all filters at once
 */
export const applyAllFilters = (products, filters) => {
  let data = [...products];

  if (filters.dateRange?.start && filters.dateRange?.end) {
    data = filterByDateRange(data, filters.dateRange.start, filters.dateRange.end);
  }

  if (filters.month) {
    data = filterByMonth(data, filters.month.year, filters.month.month);
  }

  if (filters.platforms && filters.platforms.length > 0) {
    data = filterByPlatform(data, filters.platforms);
  }

  if (filters.status) {
    data = filterByStatus(data, filters.status);
  }

  if (filters.gmvRange) {
    data = filterByGMVRange(data, filters.gmvRange.min, filters.gmvRange.max);
  }

  if (filters.abcCategories && filters.abcCategories.length > 0) {
    data = filterByABCCategory(data, filters.abcCategories);
  }

  if (filters.healthScore) {
    data = filterByHealthScore(data, filters.healthScore.min, filters.healthScore.max);
  }

  return data;
};

/**
 * Compare metrics between two date ranges
 */
export const compareMetrics = (products, dateRange1, dateRange2) => {
  const data1 = filterByDateRange(products, dateRange1.start, dateRange1.end);
  const data2 = filterByDateRange(products, dateRange2.start, dateRange2.end);

  const getMetrics = (data) => ({
    totalGMV: data.reduce((sum, p) => sum + (p.gmv || 0), 0),
    totalOrders: data.reduce((sum, p) => sum + (p.orders || 0), 0),
    totalItems: data.reduce((sum, p) => sum + (p.itemsSold || 0), 0),
    count: data.length,
    avgCVR: data.length > 0 ? data.reduce((sum, p) => sum + parseFloat((p.cvr || '0').replace('%', '')), 0) / data.length : 0,
  });

  const metrics1 = getMetrics(data1);
  const metrics2 = getMetrics(data2);

  return {
    period1: metrics1,
    period2: metrics2,
    comparison: {
      gmvGrowth: ((metrics2.totalGMV - metrics1.totalGMV) / (metrics1.totalGMV || 1)) * 100,
      orderGrowth: ((metrics2.totalOrders - metrics1.totalOrders) / (metrics1.totalOrders || 1)) * 100,
      itemsGrowth: ((metrics2.totalItems - metrics1.totalItems) / (metrics1.totalItems || 1)) * 100,
      cvrChange: metrics2.avgCVR - metrics1.avgCVR,
    }
  };
};

/**
 * Compare metrics between platforms
 */
export const comparePlatforms = (products, platforms = ['TikTok', 'Lazada', 'Shopee']) => {
  const comparison = {};

  platforms.forEach(platform => {
    const data = filterByPlatform(products, [platform]);
    comparison[platform] = {
      totalGMV: data.reduce((sum, p) => sum + (p.gmv || 0), 0),
      totalOrders: data.reduce((sum, p) => sum + (p.orders || 0), 0),
      totalItems: data.reduce((sum, p) => sum + (p.itemsSold || 0), 0),
      count: data.length,
      avgGMVPerProduct: data.length > 0 ? data.reduce((sum, p) => sum + (p.gmv || 0), 0) / data.length : 0,
      avgCVR: data.length > 0 ? data.reduce((sum, p) => sum + parseFloat((p.cvr || '0').replace('%', '')), 0) / data.length : 0,
      avgCTR: data.length > 0 ? data.reduce((sum, p) => sum + parseFloat((p.ctr || '0').replace('%', '')), 0) / data.length : 0,
    };
  });

  return comparison;
};

export default {
  filterByDateRange,
  filterByMonth,
  filterByPlatform,
  filterByStatus,
  filterByGMVRange,
  filterByABCCategory,
  filterByHealthScore,
  applyAllFilters,
  compareMetrics,
  comparePlatforms,
};
