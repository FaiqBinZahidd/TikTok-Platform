// Test script for Analytics+ fixes
const { performCohortAnalysis, performRFMAnalysis, predictProductPerformance, detectAnomalies, segmentCustomers } = require('./src/utils/analyticsUtils');

// Sample product data matching the actual structure
const sampleProducts = [
  {
    id: "1001",
    name: "Premium Wireless Headphones Pro",
    status: "Active",
    gmv: 3450.00,
    itemsSold: 22,
    orders: 19,
    shopGmv: 2200.00,
    shopViews: 520,
    videoGmv: 1250.00,
    videoViews: 1240,
    liveGmv: 0,
    liveViews: 0,
    ctr: "5.12%",
    cvr: "3.46%",
    abcCategory: 'A',
    platform: 'Shopee',
    sourceFile: 'Sample Data',
    importDate: new Date().toISOString(),
    healthScore: 85
  },
  {
    id: "1002",
    name: "Ultra Slim Laptop Case 15.6\"",
    status: "Active",
    gmv: 1890.00,
    itemsSold: 34,
    orders: 28,
    shopGmv: 1200.00,
    shopViews: 890,
    videoGmv: 690.00,
    videoViews: 450,
    liveGmv: 0,
    liveViews: 0,
    ctr: "6.78%",
    cvr: "3.15%",
    abcCategory: 'A',
    platform: 'Lazada',
    sourceFile: 'Sample Data',
    importDate: new Date().toISOString(),
    healthScore: 78
  },
  {
    id: "1003",
    name: "Portable Solar Power Bank 20000mAh",
    status: "Active",
    gmv: 2150.00,
    itemsSold: 18,
    orders: 15,
    shopGmv: 1350.00,
    shopViews: 650,
    videoGmv: 800.00,
    videoViews: 920,
    liveGmv: 0,
    liveViews: 0,
    ctr: "4.89%",
    cvr: "2.31%",
    abcCategory: 'B',
    platform: 'TikTok',
    sourceFile: 'Sample Data',
    importDate: new Date().toISOString(),
    healthScore: 65
  }
];

console.log('Testing Analytics+ fixes...\n');

// Test 1: Cohort Analysis
console.log('1. Testing Cohort Analysis:');
const cohortResult = performCohortAnalysis(sampleProducts, 'monthly');
console.log(`   - Found ${cohortResult.length} cohorts`);
console.log(`   - First cohort: ${cohortResult[0]?.cohortDate} with ${cohortResult[0]?.size} products`);
console.log(`   - Average CVR: ${cohortResult[0]?.avgCVR}%`);

// Test 2: RFM Analysis
console.log('\n2. Testing RFM Analysis:');
const rfmResult = performRFMAnalysis(sampleProducts);
console.log(`   - Total products: ${rfmResult.totalProducts}`);
console.log(`   - Segments: ${Object.keys(rfmResult.segments).join(', ')}`);
console.log(`   - Top segment: ${rfmResult.topSegment}`);

// Test 3: Predictions
console.log('\n3. Testing Predictions:');
const predictionResult = predictProductPerformance(sampleProducts);
console.log(`   - Generated ${predictionResult.predictions.length} predictions`);
console.log(`   - Average growth: ${predictionResult.averageGrowth}%`);
console.log(`   - First prediction: ${predictionResult.predictions[0]?.productName} -> ${predictionResult.predictions[0]?.predictedGMV}`);

// Test 4: Anomaly Detection
console.log('\n4. Testing Anomaly Detection:');
const anomalyResult = detectAnomalies(sampleProducts);
console.log(`   - Found ${anomalyResult.length} anomalies`);

// Test 5: Segmentation
console.log('\n5. Testing Segmentation:');
const segmentResult = segmentCustomers(sampleProducts);
console.log(`   - Created ${segmentResult.segments.length} segments`);
console.log(`   - Segment summary: ${JSON.stringify(segmentResult.summary)}`);

console.log('\n✅ All tests completed successfully!');
