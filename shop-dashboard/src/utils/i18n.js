/**
 * Internationalization (i18n) System
 * Supports English and Thai languages
 */

const translations = {
  en: {
    // Common
    language: 'English',
    dashboard: 'Dashboard',
    settings: 'Settings',
    help: 'Help',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    export: 'Export',
    import: 'Import',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    back: 'Back',
    close: 'Close',

    // Navigation
    overview: 'Overview',
    reports: 'Reports',
    inventory: 'Inventory',
    liveVideo: 'Live & Video',
    campaigns: 'Campaigns',
    calendar: 'Calendar',
    finance: 'Finance',
    analyticsPlus: 'Analytics+',
    alerts: 'Alerts',
    dataSources: 'Data Sources',
    backup: 'Backup',

    // Dashboard
    totalGMV: 'Total GMV',
    avgOrderValue: 'Average Order Value',
    conversionRate: 'Conversion Rate',
    topPerformer: 'Top Performer',
    allPlatforms: 'All Platforms',
    platformFilter: 'Platform Filter',
    timePeriod: 'Time Period',
    allTime: 'All Time',
    lastImport: 'Last Import',

    // Metrics
    gmv: 'Gross Merchandise Value',
    ctr: 'Click-Through Rate',
    cvr: 'Conversion Rate',
    itemsSold: 'Items Sold',
    orders: 'Orders',
    views: 'Views',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',

    // Analytics
    cohortAnalysis: 'Cohort Analysis',
    rfmAnalysis: 'RFM Segmentation',
    predictions: 'Predictions',
    anomalies: 'Anomalies',
    segmentation: 'Segmentation',
    insights: 'Key Insights',
    revenue: 'Revenue',
    growth: 'Growth',
    trend: 'Trend',

    // Settings
    generalPreferences: 'General Preferences',
    displayName: 'Display Name',
    currencySymbol: 'Currency Symbol',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    dashboardCustomization: 'Dashboard Customization',
    dataManagement: 'Data Management',
    clearAllData: 'Clear All Data',
    resetToSample: 'Reset to Sample Products',
    smartAssistant: 'Smart Assistant Thresholds',
    highTrafficThreshold: 'High Traffic Threshold (Views)',
    lowCvrThreshold: 'Low Conversion Alert (%)',
    hiddenGemCvr: 'Hidden Gem CVR (%)',
    deadStockThreshold: 'Dead Stock Threshold (Sales)',
    systemConfiguration: 'System Configuration',
    customizeQuantro: 'Customize how Quantro analyzes your data',

    // KPIs
    kpiTotalGmv: 'Total GMV',
    kpiAvgOrderValue: 'Avg Order Value',
    kpiConversionRate: 'Conversion Rate',

    // Backup
    exportAllProducts: 'Export All Products',
    exportAsJson: 'Export as JSON',
    backupInformation: 'Backup Information',
    totalProducts: 'Total Products',
    lastModified: 'Last Modified',
    platforms: 'Platforms',

    // Data Sources
    loadedDataSources: 'Loaded Data Sources',
    noFilesUploaded: 'No files uploaded yet',

    // Login
    organizationLabel: 'Organization Label',
    accessKey: 'Access Key',
    publicDemo: 'Public Demo',
    signInToDashboard: 'Sign In to Dashboard',
    multiChannelSalesDashboard: 'Multi-Channel Sales Dashboard',
    manageSalesData: 'Manage sales data from TikTok Shop, Shopee, and Lazada in one place.',
    centralizedReporting: 'Centralized Reporting',
    viewAllSalesChannels: 'View all your sales channels together in real-time dashboards.',
    financialAnalysis: 'Financial Analysis',
    calculateMargins: 'Calculate margins and profit by channel and product.',
    performanceAnalytics: 'Performance Analytics',
    trackConversions: 'Track conversions, growth trends, and product rankings.',
    dataHistory: 'Data History',
    keepHistoricalData: 'Keep historical data for analysis and forecasting.',

    // Messages
    settingsSaved: 'Settings saved successfully',
    dataCleared: 'All data has been cleared',
    dataReset: 'Data reset to sample products',
    logoutSuccess: 'You have been logged out successfully',
    invalidAccessKey: 'Invalid Access Key. Please use \'admin123\' for the demo.',
    productsExported: 'Products exported successfully!',
  },
  th: {
    // Common
    language: 'ไทย',
    dashboard: 'แดชบอร์ด',
    settings: 'การตั้งค่า',
    help: 'ช่วยเหลือ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    delete: 'ลบ',
    export: 'ส่งออก',
    import: 'นำเข้า',
    loading: 'กำลังโหลด',
    error: 'ข้อผิดพลาด',
    success: 'สำเร็จ',
    warning: 'คำเตือน',
    back: 'กลับ',
    close: 'ปิด',

    // Navigation
    overview: 'ภาพรวม',
    reports: 'รายงาน',
    inventory: 'สินค้า',
    liveVideo: 'ถ่ายทำสด & วิดีโอ',
    campaigns: 'แคมเปญ',
    calendar: 'ปฏิทิน',
    finance: 'การเงิน',
    analyticsPlus: 'การวิเคราะห์+',
    alerts: 'การแจ้งเตือน',
    dataSources: 'แหล่งข้อมูล',
    backup: 'สำรองข้อมูล',

    // Dashboard
    totalGMV: 'GMV ทั้งหมด',
    avgOrderValue: 'มูลค่าการสั่งซื้อเฉลี่ย',
    conversionRate: 'อัตราการแปลง',
    topPerformer: 'ผลิตภัณฑ์ยอดเยี่ยม',
    allPlatforms: 'ทุกแพลตฟอร์ม',
    platformFilter: 'ตัวกรองแพลตฟอร์ม',
    timePeriod: 'ช่วงเวลา',
    allTime: 'ตลอดเวลา',
    lastImport: 'การนำเข้าครั้งล่าสุด',

    // Metrics
    gmv: 'มูลค่ารวมสินค้า',
    ctr: 'อัตราคลิกผ่านไป',
    cvr: 'อัตราการแปลง',
    itemsSold: 'จำนวนสินค้าที่ขาย',
    orders: 'คำสั่งซื้อ',
    views: 'มุมมอง',
    status: 'สถานะ',
    active: 'ใช้งานอยู่',
    inactive: 'ไม่ใช้งาน',

    // Analytics
    cohortAnalysis: 'การวิเคราะห์กลุ่มผู้ใช้',
    rfmAnalysis: 'การแบ่งส่วน RFM',
    predictions: 'การคาดการณ์',
    anomalies: 'ความผิดปกติ',
    segmentation: 'การแบ่งส่วน',
    insights: 'ข้อมูลเชิงลึก',
    revenue: 'รายได้',
    growth: 'การเติบโต',
    trend: 'แนวโน้ม',

    // Settings
    generalPreferences: 'การตั้งค่าทั่วไป',
    displayName: 'ชื่อที่แสดง',
    currencySymbol: 'สัญลักษณ์สกุลเงิน',
    language: 'ภาษา',
    theme: 'ธีม',
    darkMode: 'โหมดมืด',
    dashboardCustomization: 'การปรับแต่งแดชบอร์ด',
    dataManagement: 'การจัดการข้อมูล',
    clearAllData: 'ลบข้อมูลทั้งหมด',
    resetToSample: 'รีเซ็ตเป็นผลิตภัณฑ์ตัวอย่าง',
    smartAssistant: 'เกณฑ์ผู้ช่วยอัจฉริยะ',
    highTrafficThreshold: 'เกณฑ์ปริมาณการรับชม (มุมมอง)',
    lowCvrThreshold: 'การแจ้งเตือนการแปลงต่ำ (%)',
    hiddenGemCvr: 'CVR อัญมณีที่ซ่อนอยู่ (%)',
    deadStockThreshold: 'เกณฑ์สินค้าคงคลัง (ยอดขาย)',
    systemConfiguration: 'การกำหนดค่าระบบ',
    customizeQuantro: 'ปรับแต่งวิธีที่ Quantro วิเคราะห์ข้อมูลของคุณ',

    // KPIs
    kpiTotalGmv: 'GMV ทั้งหมด',
    kpiAvgOrderValue: 'มูลค่าการสั่งซื้อเฉลี่ย',
    kpiConversionRate: 'อัตราการแปลง',

    // Backup
    exportAllProducts: 'ส่งออกผลิตภัณฑ์ทั้งหมด',
    exportAsJson: 'ส่งออกเป็น JSON',
    backupInformation: 'ข้อมูลการสำรองข้อมูล',
    totalProducts: 'จำนวนผลิตภัณฑ์ทั้งหมด',
    lastModified: 'แก้ไขล่าสุด',
    platforms: 'แพลตฟอร์ม',

    // Data Sources
    loadedDataSources: 'แหล่งข้อมูลที่โหลด',
    noFilesUploaded: 'ยังไม่มีไฟล์ที่อัปโหลด',

    // Login
    organizationLabel: 'ป้ายกำกับองค์กร',
    accessKey: 'กุญแจเข้าถึง',
    publicDemo: 'สาธารณะ Demo',
    signInToDashboard: 'เข้าสู่แดชบอร์ด',
    multiChannelSalesDashboard: 'แดชบอร์ดการขายหลายช่องทาง',
    manageSalesData: 'จัดการข้อมูลการขายจาก TikTok Shop, Shopee และ Lazada ในที่เดียว',
    centralizedReporting: 'รายงานแบบรวมศูนย์',
    viewAllSalesChannels: 'ดูช่องทางการขายทั้งหมดของคุณพร้อมกันในแดชบอร์ดแบบเรียลไทม์',
    financialAnalysis: 'การวิเคราะห์ทางการเงิน',
    calculateMargins: 'คำนวณมาร์จิ้นและกำไรตามช่องทางและผลิตภัณฑ์',
    performanceAnalytics: 'การวิเคราะห์ประสิทธิภาพ',
    trackConversions: 'ติดตามการแปลง แนวโน้มการเติบโต และการจัดอันดับผลิตภัณฑ์',
    dataHistory: 'ประวัติข้อมูล',
    keepHistoricalData: 'เก็บข้อมูลประวัติศาสตร์สำหรับการวิเคราะห์และการพยากรณ์',

    // Messages
    settingsSaved: 'บันทึกการตั้งค่าสำเร็จแล้ว',
    dataCleared: 'ข้อมูลทั้งหมดถูกลบแล้ว',
    dataReset: 'รีเซ็ตข้อมูลเป็นผลิตภัณฑ์ตัวอย่าง',
    logoutSuccess: 'คุณออกจากระบบสำเร็จแล้ว',
    invalidAccessKey: 'กุญแจเข้าถึงไม่ถูกต้อง โปรดใช้ \'admin123\' สำหรับเดโม',
    productsExported: 'ส่งออกผลิตภัณฑ์สำเร็จแล้ว!',
  }
};

/**
 * Get translation for a key in specified language
 * @param {string} key - Translation key (e.g., 'dashboard', 'settings')
 * @param {string} language - Language code ('en' or 'th')
 * @returns {string} Translated text or key if not found
 */
export const t = (key, language = 'en') => {
  return translations[language]?.[key] || key;
};

/**
 * Get all translations for a language
 * @param {string} language - Language code ('en' or 'th')
 * @returns {Object} All translations for the language
 */
export const getLanguageTranslations = (language = 'en') => {
  return translations[language] || translations.en;
};

/**
 * Get available languages
 * @returns {Array} Array of language objects with code and name
 */
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' }
];

export default translations;
