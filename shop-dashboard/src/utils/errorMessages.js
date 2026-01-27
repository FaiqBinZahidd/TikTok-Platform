/**
 * Error Messages & Help System
 * Centralized database of import errors with solutions and guidance
 * 
 * @module errorMessages
 */

export const ERROR_DATABASE = {
  // CSV/File Format Errors
  INVALID_CSV_FORMAT: {
    code: 'INVALID_CSV_FORMAT',
    title: 'Invalid CSV Format',
    message: 'The file format is not recognized or is corrupted.',
    severity: 'high',
    icon: 'AlertTriangle',
    causes: [
      'File is corrupted or incomplete',
      'File encoding is not UTF-8',
      'File extension does not match content',
      'File was saved in unsupported format'
    ],
    solutions: [
      'Save your file as CSV (Comma Separated Values) format',
      'Ensure file encoding is set to UTF-8',
      'Try opening and re-saving in Excel or Google Sheets',
      'Verify file extension is .csv or .xlsx'
    ],
    example: 'Format your file as: ProductName,GMV,Orders,Status',
    learnMore: '#csv-format',
    autoRetry: false
  },

  MISSING_REQUIRED_COLUMNS: {
    code: 'MISSING_REQUIRED_COLUMNS',
    title: 'Missing Required Columns',
    message: 'Your file is missing one or more critical columns.',
    severity: 'high',
    icon: 'AlertTriangle',
    requiredColumns: [
      'Product Name (or Item Name, Product Title)',
      'GMV or Sales (or Revenue, Amount, Total Sales)',
      'Orders (optional but recommended)',
      'Status (optional)'
    ],
    causes: [
      'Columns were deleted from the file',
      'Column headers have different names',
      'File uses different naming convention',
      'Headers are in a different row'
    ],
    solutions: [
      'Ensure your file has a "Product Name" or "Item Name" column',
      'Include a "GMV" or "Sales" or "Revenue" column with amounts',
      'Check that column headers are in the first row',
      'Compare your file to the provided template',
      'Add missing columns before uploading'
    ],
    template: 'Download the template from the import guide',
    learnMore: '#column-requirements',
    autoRetry: false
  },

  INVALID_NUMERIC_VALUE: {
    code: 'INVALID_NUMERIC_VALUE',
    title: 'Invalid Number in Column',
    message: 'A numeric column contains non-numeric data.',
    severity: 'medium',
    icon: 'AlertCircle',
    causes: [
      'Text characters in a numbers-only column',
      'Special characters like ₹ or $ in amount fields',
      'Empty cells where numbers are required',
      'Formulas instead of values'
    ],
    solutions: [
      'Remove currency symbols (₹, $, etc.) - keep numbers only',
      'Delete any text in numeric columns',
      'Replace formulas with their calculated values',
      'Fill empty cells with 0 or remove the row'
    ],
    example: 'Correct: 1000.50 | Wrong: ₹1000.50 or "thousand"',
    learnMore: '#numeric-values',
    autoRetry: true
  },

  INVALID_SKU_FORMAT: {
    code: 'INVALID_SKU_FORMAT',
    title: 'Invalid Product ID Format',
    message: 'One or more product IDs have an invalid format.',
    severity: 'medium',
    icon: 'AlertCircle',
    causes: [
      'Product ID contains invalid characters',
      'Product ID is empty or missing',
      'Product ID is too long (max 100 chars)',
      'ID has leading/trailing spaces'
    ],
    solutions: [
      'Use only alphanumeric characters and hyphens',
      'Ensure each product has a unique ID',
      'Remove special characters from IDs',
      'Trim whitespace from ID fields',
      'Keep IDs under 100 characters'
    ],
    example: 'Valid: SKU123, PROD-001 | Invalid: SKU@123!, #PROD',
    learnMore: '#product-id-format',
    autoRetry: true
  },

  DUPLICATE_PRODUCT: {
    code: 'DUPLICATE_PRODUCT',
    title: 'Duplicate Product ID',
    message: 'Your file contains duplicate product IDs.',
    severity: 'medium',
    icon: 'AlertCircle',
    causes: [
      'Same product appears multiple times in file',
      'Data was accidentally copied',
      'Product ID entered incorrectly',
      'Merging multiple files with overlaps'
    ],
    solutions: [
      'Check if duplicates are intentional (different sizes/colors)',
      'If not intentional, remove duplicate rows',
      'Use unique IDs for each product variant',
      'Review data before uploading'
    ],
    example: 'If PROD-001 appears twice, keep only the latest version',
    learnMore: '#duplicate-handling',
    autoRetry: false
  },

  PLATFORM_MISMATCH: {
    code: 'PLATFORM_MISMATCH',
    title: 'Cannot Detect Platform',
    message: 'The file could not be matched to a specific platform.',
    severity: 'low',
    icon: 'Info',
    causes: [
      'File uses custom column names',
      'Data structure is non-standard',
      'No platform-specific indicators found'
    ],
    solutions: [
      'The file will be imported as "Unknown platform"',
      'You can manually assign the platform later',
      'Platform-specific features may be limited',
      'Try renaming columns to match platform standards'
    ],
    platformNames: 'TikTok, Lazada, Shopee, Amazon',
    learnMore: '#platform-detection',
    autoRetry: true
  },

  NO_DATA_FOUND: {
    code: 'NO_DATA_FOUND',
    title: 'No Data Found',
    message: 'The file has no readable data rows.',
    severity: 'high',
    icon: 'AlertTriangle',
    causes: [
      'File is empty',
      'Only headers exist, no products',
      'All rows were filtered out',
      'Data is in an unexpected location'
    ],
    solutions: [
      'Ensure your file has data rows below the headers',
      'Verify the file is not empty',
      'Check that data starts from row 2',
      'Remove any blank rows at the top'
    ],
    example: 'Row 1: Headers | Row 2-N: Product data',
    learnMore: '#empty-file',
    autoRetry: false
  },

  ENCODING_ERROR: {
    code: 'ENCODING_ERROR',
    title: 'File Encoding Error',
    message: 'The file has encoding issues and cannot be read properly.',
    severity: 'high',
    icon: 'AlertTriangle',
    causes: [
      'File is saved with non-UTF8 encoding',
      'File contains special characters not supported',
      'File was corrupted during transfer'
    ],
    solutions: [
      'Open file in Excel or Google Sheets',
      'Save as CSV with UTF-8 encoding',
      'Remove any special non-ASCII characters',
      'Re-download the original file if from a source'
    ],
    steps: [
      '1. Open file in Excel',
      '2. Go to File > Save As',
      '3. Select format: CSV UTF-8 (.csv)',
      '4. Save and re-upload'
    ],
    learnMore: '#file-encoding',
    autoRetry: false
  },

  ROW_TOO_LONG: {
    code: 'ROW_TOO_LONG',
    title: 'Row Too Long',
    message: 'One or more rows have too many columns.',
    severity: 'medium',
    icon: 'AlertCircle',
    causes: [
      'Extra empty columns at the end',
      'Data was not properly formatted',
      'Copy-paste error with extra cells'
    ],
    solutions: [
      'Delete empty columns beyond needed data',
      'Ensure all rows have the same column count',
      'Use only the columns you need for import'
    ],
    example: 'Keep consistent column count across all rows',
    learnMore: '#row-structure',
    autoRetry: true
  },

  MISSING_PRODUCT_NAME: {
    code: 'MISSING_PRODUCT_NAME',
    title: 'Missing Product Name',
    message: 'One or more products have empty names.',
    severity: 'medium',
    icon: 'AlertCircle',
    causes: [
      'Product name field is blank',
      'Product name column not found',
      'Wrong column mapped to name'
    ],
    solutions: [
      'Fill in all product names',
      'Ensure "Product Name" column exists',
      'Remove products without names',
      'Check column mapping'
    ],
    learnMore: '#product-names',
    autoRetry: false
  },

  INVALID_CONVERSION_RATE: {
    code: 'INVALID_CONVERSION_RATE',
    title: 'Invalid Conversion Rate',
    message: 'Conversion rate is outside the valid range (0-100%).',
    severity: 'low',
    icon: 'Info',
    causes: [
      'CVR expressed as decimal (0.5) instead of percentage (50%)',
      'CVR value is negative',
      'CVR value exceeds 100%'
    ],
    solutions: [
      'If decimal, multiply by 100 to get percentage',
      'Ensure CVR is between 0 and 100%',
      'Check calculation: (Conversions / Visitors) * 100',
      'We will auto-correct if it looks like a decimal'
    ],
    example: 'Correct: 2.5% | Wrong: 0.025 or 250%',
    learnMore: '#conversion-rate',
    autoRetry: true
  },

  // Unknown/Generic errors
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    title: 'Unknown Error',
    message: 'An unexpected error occurred during import.',
    severity: 'high',
    icon: 'AlertTriangle',
    causes: [
      'Unexpected file format',
      'System error',
      'File corruption'
    ],
    solutions: [
      'Try uploading again',
      'Try with a different file',
      'Check file integrity',
      'Contact support if problem persists'
    ],
    learnMore: '#contact-support',
    autoRetry: true
  }
};

/**
 * Get error details by error code
 * @param {string} errorCode - The error code
 * @returns {object} Error details or default error
 */
export const getErrorDetails = (errorCode) => {
  return ERROR_DATABASE[errorCode] || ERROR_DATABASE.UNKNOWN_ERROR;
};

/**
 * Get all errors in a category
 * @param {string} severity - 'high', 'medium', 'low'
 * @returns {array} Array of errors matching severity
 */
export const getErrorsByReverity = (severity) => {
  return Object.values(ERROR_DATABASE).filter(
    err => err.severity === severity
  );
};

/**
 * Extract error code from error message
 * @param {string} errorMessage - The error message text
 * @returns {string} Best matching error code
 */
export const detectErrorCode = (errorMessage) => {
  const msg = errorMessage.toLowerCase();

  if (msg.includes('csv') || msg.includes('format'))
    return 'INVALID_CSV_FORMAT';
  if (msg.includes('column') || msg.includes('header'))
    return 'MISSING_REQUIRED_COLUMNS';
  if (msg.includes('sku') || msg.includes('product id'))
    return 'INVALID_SKU_FORMAT';
  if (msg.includes('duplicate'))
    return 'DUPLICATE_PRODUCT';
  if (msg.includes('platform'))
    return 'PLATFORM_MISMATCH';
  if (msg.includes('no data') || msg.includes('empty'))
    return 'NO_DATA_FOUND';
  if (msg.includes('encod'))
    return 'ENCODING_ERROR';
  if (msg.includes('row'))
    return 'ROW_TOO_LONG';
  if (msg.includes('name'))
    return 'MISSING_PRODUCT_NAME';
  if (msg.includes('number') || msg.includes('numeric'))
    return 'INVALID_NUMERIC_VALUE';
  if (msg.includes('conversion') || msg.includes('cvr'))
    return 'INVALID_CONVERSION_RATE';

  return 'UNKNOWN_ERROR';
};

/**
 * Format error for display in UI
 * @param {string} errorCode - Error code
 * @returns {object} Formatted error with all details
 */
export const formatErrorForUI = (errorCode) => {
  const error = getErrorDetails(errorCode);
  return {
    code: error.code,
    title: error.title,
    message: error.message,
    icon: error.icon,
    severity: error.severity,
    solutions: error.solutions || [],
    causes: error.causes || [],
    learnMore: error.learnMore
  };
};

/**
 * Get user-friendly error message
 * @param {string} errorCode - Error code
 * @returns {string} User-friendly message
 */
export const getErrorMessage = (errorCode) => {
  const error = getErrorDetails(errorCode);
  return error.message;
};

/**
 * Check if error is auto-retryable
 * @param {string} errorCode - Error code
 * @returns {boolean} Whether error can be auto-retried
 */
export const isAutoRetryable = (errorCode) => {
  const error = getErrorDetails(errorCode);
  return error.autoRetry === true;
};

/**
 * Get suggested action for error
 * @param {string} errorCode - Error code
 * @returns {string} Action message
 */
export const getSuggestedAction = (errorCode) => {
  const error = getErrorDetails(errorCode);
  
  if (error.template) return `Try downloading and using the template`;
  if (error.steps && error.steps.length) return `Follow the step-by-step guide`;
  if (error.solutions && error.solutions.length) return `${error.solutions[0]}`;
  
  return 'Review the error details and try again';
};

export default ERROR_DATABASE;
