import React, { useState, useEffect, useMemo, useRef } from 'react';
import SystemManual from './components/SystemManual';
import {
  Package, BarChart3, TrendingUp, Filter, Search, Download,
  Settings, User, Bell, ChevronDown, BookOpen, LogOut,
  HelpCircle, AlertTriangle, CheckCircle2, X, Plus, Target, DollarSign,
  Zap, MousePointer2, Calculator, ShoppingBag, Video, Eye, PieChart
} from 'lucide-react';

// Utils
import * as authUtils from './utils/authUtils';
import * as userManagement from './utils/userManagement';
import * as automationUtils from './utils/automationUtils';
import * as securityUtils from './utils/securityUtils'; // Restored
import { detectErrorCode } from './utils/errorMessages'; // Restored
import { normalizeData } from './utils/dataIngestionUtils';
import { parseBackupFile } from './utils/backupSystem';
import { parsePercent, formatCurrency, getBadgeColor, getHealthColor, parseCurrency } from './utils/formatUtils';
import { supabase } from './lib/supabaseClient'; // NEW Import
import { dataManager } from './utils/dataManager'; // NEW Import
import { initDevModeShortcut } from './utils/developerMode'; // Developer Mode

// Components
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './components/Auth/LandingPage';
import { NotificationContainer } from './components/NotificationContainer';
import ErrorHelpModal from './components/ErrorHelpModal';
import ProductDetailModal from './components/ProductDetailModal';
import PlatformBadge from './components/PlatformBadge';
import PlatformFilter from './components/PlatformFilter';
import HelpGuide from './components/HelpGuide';
import { getTranslation } from './utils/translations';
import ChatWidget from './components/Support/ChatWidget';

// Views
import DashboardView from './components/Dashboard/DashboardView';
import InventoryView from './components/Dashboard/InventoryView';
import ReportView from './components/Reports/ReportView';
import RevenueIntelligenceReport from './components/Reports/RevenueIntelligenceReport';
import SettingsView from './components/System/SettingsView';
import CalendarView from './components/Dashboard/CalendarView';
import CampaignView from './components/Dashboard/CampaignView';
import FinanceView from './components/Dashboard/FinanceView';
import MediaView from './components/Dashboard/MediaView';
import AboutView from './components/System/AboutView';
import ProfileView from './components/System/ProfileView'; // NEW Import
import DataSourcesView from './components/DataSourcesView';
import AdvancedAnalyticsView from './components/NewFeatures/AdvancedAnalyticsView';
import AlertsView from './components/NewFeatures/AlertsView';
import SecurityView from './components/NewFeatures/SecurityView';
import ProductInsightsView from './components/Dashboard/ProductInsightsView';
import DecisionLabView from './components/DecisionLab/DecisionLabView';
// import * as XLSX from 'xlsx'; // Reverted to CDN for stability
import { useRouter } from './hooks/useRouter';
import PlatformSelectionModal from './components/PlatformSelectionModal';

export default function App() {
  const [activeView, setActiveView] = useRouter('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExcelReady, setIsExcelReady] = useState(false); // Restored state

  // Platform Filter with localStorage persistence
  const [platformFilter, setPlatformFilterState] = useState(() => {
    try {
      return localStorage.getItem('quantro_platformFilter') || 'All';
    } catch (e) { return 'All'; }
  });

  const setPlatformFilter = (value) => {
    setPlatformFilterState(value);
    localStorage.setItem('quantro_platformFilter', value);
  };

  const [sortConfig, setSortConfig] = useState({ key: 'gmv', direction: 'desc' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- Advanced Filtering States ---
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: { start: null, end: null },
    month: null,
    gmvRange: { min: 0, max: 99999 },
    healthScore: 0,
    abcCategory: 'all',
    showAdvanced: false
  });

  const [notifications, setNotifications] = useState([]);
  const [importNotifications, setImportNotifications] = useState([]);
  const [errorHelpModalCode, setErrorHelpModalCode] = useState(null);
  const [showDataSourcesView, setShowDataSourcesView] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    try {
      const savedFiles = localStorage.getItem('shopProFiles');
      return savedFiles ? JSON.parse(savedFiles) : [];
    } catch (e) { return []; }
  });

  const [timePeriod, setTimePeriod] = useState('All Time');
  const [profileOpen, setProfileOpen] = useState(false);
  const [showGlobalHelp, setShowGlobalHelp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('shopProLanguage') || 'en';
    } catch (e) { return 'en'; }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('shopProLanguage', lang);
  };

  // Initialize developer mode shortcuts
  useEffect(() => {
    initDevModeShortcut();
  }, []);

  // Listen for Supabase Auth Changes
  useEffect(() => {
    // 1. Check LocalStorage fallback first (Legacy)
    const auth = localStorage.getItem('shopProAuth');
    if (auth) setIsAuthenticated(true);

    // 2. Subscribe to Supabase Session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
          // Load specific data for this user
          dataManager.getProducts().then(fetchedProducts => {
            if (fetchedProducts.length > 0) setProducts(fetchedProducts);
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          setCurrentUser(session.user);
        } else {
          // Only sign out if we strictly want to enforce Supabase
          // For transition, we might keep local state if they used "Guest" mode
          // But for now, let's sync state
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('shopProSettings');
      return saved ? JSON.parse(saved) : {
        currency: '฿', highViewThreshold: 500, lowCvrThreshold: 0.5, hiddenGemCvr: 3.0, deadStockThreshold: 0, userName: 'Manager'
      };
    } catch (e) {
      return { currency: '฿', highViewThreshold: 500, lowCvrThreshold: 0.5, hiddenGemCvr: 3.0, deadStockThreshold: 0, userName: 'Manager' };
    }
  });

  // KPI Visibility
  const [visibleKPIs, setVisibleKPIs] = useState(() => {
    try {
      const saved = localStorage.getItem('shopProKPIs');
      return saved ? JSON.parse(saved) : {
        totalGMV: true,
        businessHealth: true,
        channelMix: true,
        topPerformer: true
      };
    } catch (e) { return { totalGMV: true, businessHealth: true, channelMix: true, topPerformer: true }; }
  });

  const initialProducts = [
    { id: "1001", name: "Sample Product - Please Import Your Data", status: "Active", gmv: 1000, itemsSold: 10, orders: 5, shopGmv: 600, shopViews: 500, videoGmv: 400, videoViews: 300, liveGmv: 0, liveViews: 0, stock: 150, ctr: "5.0%", cvr: "2.0%", abcCategory: 'B', platform: 'TikTok', sourceFile: 'Sample Data', importDate: new Date().toISOString(), customerName: "Sarah J. (Sample)", customerEmail: "sarah@example.com", customerPhone: "+66 81 234 5678", shipCity: "Bangkok", shipState: "Bangkok", shipCountry: "Thailand", shipPostalCode: "10110" }
  ];

  // Persistent Products
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('shopProProducts');
      // If nothing saved yet (null/undefined), use sample data
      // If empty array exists, user deleted everything - keep it empty!
      if (savedProducts === null || savedProducts === undefined) {
        return initialProducts;
      }
      const data = JSON.parse(savedProducts);
      return Array.isArray(data) ? data : initialProducts;
    } catch (e) {
      console.error('Error loading products:', e);
      return initialProducts;
    }
  });

  // Persistent Campaigns
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('shopProCampaigns');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Auth & User Management
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [alerts, setAlerts] = useState(() => automationUtils.getAllAlerts() || []);
  const [automations, setAutomations] = useState(() => automationUtils.getAllAutomations() || []);
  const [securityLogs, setSecurityLogs] = useState(() => securityUtils.getAllSecurityLogs() || []);

  const fileInputRef = useRef(null);
  const profileRef = useRef(null);

  // Persistence Effects
  useEffect(() => localStorage.setItem('shopProSettings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('shopProKPIs', JSON.stringify(visibleKPIs)), [visibleKPIs]);
  useEffect(() => localStorage.setItem('shopProProducts', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('shopProFiles', JSON.stringify(uploadedFiles)), [uploadedFiles]);
  useEffect(() => localStorage.setItem('shopProCampaigns', JSON.stringify(campaigns)), [campaigns]);

  // Click outside profile
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  // --- Real-time Alert Evaluation ---
  // Whenever products change (import/update), run the rules engine
  useEffect(() => {
    if (products && products.length > 0) {
      const generatedAlerts = [];
      const threshold = settings.lowStockThreshold || 10;

      products.forEach(product => {
        // Core Logic Alerts
        if (product.itemsSold > 0 && product.gmv > 0) {
          // Alert if sales are high but GMV low (Review Pricing)
          if (settings.enableVelocityAlerts !== false && product.itemsSold > 100 && product.gmv < 1000) {
            generatedAlerts.push({
              id: `system_check_${product.id}`,
              msg: `Review Pricing: ${product.name} (High Vol, Low GMV)`,
              type: 'warning',
              productId: product.id
            });
          }
          // Placeholder for actual stock check if we had inventory column
          // implied low stock if (product.inventory < threshold)
        }
      });

      // Sync state
      if (generatedAlerts.length > 0) {
        setNotifications(prev => {
          const newNotes = generatedAlerts.filter(n => !prev.some(p => p.id === n.id));
          return [...prev, ...newNotes];
        });
      }
    }
  }, [products, settings]);

  // Load XLSX via CDN (Fail-safe)
  useEffect(() => {
    if (window.XLSX) { setIsExcelReady(true); return; }
    const script = document.createElement('script');
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    script.onload = () => { setIsExcelReady(true); console.log("XLSX Engine Loaded"); };
    script.onerror = () => setNotifications(prev => [...prev, { id: Date.now(), type: 'error', msg: 'Failed to load Excel engine. Please refresh.' }]);
    document.body.appendChild(script);
  }, []);

  // Helpers
  const addNotification = (msgOrObj, type = 'success') => {
    const id = Date.now();
    let msg, notificationType;
    if (typeof msgOrObj === 'object' && msgOrObj !== null) { msg = msgOrObj.msg; notificationType = msgOrObj.type || type; }
    else { msg = msgOrObj; notificationType = type; }
    setNotifications(prev => [...prev, { id, msg, type: notificationType }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const addImportNotification = (notification) => {
    const id = notification.id || `import_${Date.now()}`;
    setImportNotifications(prev => [...prev, { ...notification, id }]);
  };

  const dismissImportNotification = (id) => setImportNotifications(prev => prev.filter(n => n.id !== id));
  const handleOpenErrorHelp = (code) => setErrorHelpModalCode(code);
  const handleCloseDataSourcesView = () => setShowDataSourcesView(false);

  const handleLogin = (name) => {
    const credentials = { username: name, email: `${name.toLowerCase().replace(/\s+/g, '')}@shopmanager.local` };
    const token = authUtils.createAuthToken(credentials.username, credentials.email);
    const session = authUtils.createSession(token, credentials.username);

    setSettings(prev => ({ ...prev, userName: name }));
    setIsAuthenticated(true);
    setCurrentUser(name);
    setCurrentSession(session);
    setAuthToken(token);
    localStorage.setItem('shopProAuth', 'true');
    addNotification({ type: 'success', msg: `Welcome, ${name}!` });
  };

  const handleLogout = async () => {
    if (currentSession) authUtils.destroySession(currentSession.id);

    // Ensure Supabase session is also cleared
    if (supabase) {
      await supabase.auth.signOut();
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentSession(null);
    setAuthToken(null);
    setProfileOpen(false);
    localStorage.removeItem('shopProAuth');
    addNotification({ type: 'success', msg: 'Logged out successfully.' });
  };

  const calculateABC = (items) => {
    const sorted = [...items].sort((a, b) => b.gmv - a.gmv);
    const totalGMV = sorted.reduce((sum, item) => sum + item.gmv, 0);
    let accumulatedGMV = 0;
    return sorted.map(item => {
      accumulatedGMV += item.gmv;
      const percentage = accumulatedGMV / (totalGMV || 1);
      let category = percentage <= 0.8 ? 'A' : percentage <= 0.95 ? 'B' : 'C';
      if (item.gmv === 0) category = 'C';
      return { ...item, abcCategory: category };
    });
  };



  const processFile = (file, platformId, currency = null) => {
    if (!isExcelReady) {
      addNotification({ type: 'warning', msg: 'System initializing... please try again.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = window.XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = window.XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        if (!rawRows || rawRows.length === 0) throw new Error("File is empty.");

        // Smart Header Detection
        let headerRowIndex = 0;
        let maxScore = 0;

        const commonHeaders = [
          'sku', 'product', 'name', 'title', 'item', 'order', 'id',
          'price', 'amount', 'total', 'gmv', 'sales', 'quantity', 'qty',
          'status', 'state', 'tracking', 'buyer', 'category',
          'customer', 'recipient', 'ship', 'receiver', 'email', 'address'
        ];

        for (let i = 0; i < Math.min(25, rawRows.length); i++) {
          const row = rawRows[i].map(c => String(c).toLowerCase().trim());
          let score = 0;
          row.forEach(cell => {
            if (commonHeaders.some(h => cell.includes(h))) score++;
          });

          if (score > maxScore) {
            maxScore = score;
            headerRowIndex = i;
          }
        }

        if (maxScore < 2) {
          console.warn("Low confidence in header detection. Defaulting to row 0 or 1.");
          if (rawRows.length > 1 && rawRows[1].length > 3) headerRowIndex = 1;
          else headerRowIndex = 0;
        }

        const headers = rawRows[headerRowIndex].map(h => String(h));
        const foundHeadersPreview = headers.slice(0, 5).join(', ');
        addImportNotification({ title: 'Columns Detected', message: `Found: ${foundHeadersPreview}...`, type: 'info' });

        const jsonData = rawRows.slice(headerRowIndex + 1).map(row => {
          let obj = {}; headers.forEach((h, i) => obj[h] = row[i]); return obj;
        });

        // Use the new Unified Normalization Engine
        const normalized = normalizeData(jsonData, file.name, platformId);

        if (normalized.length === 0) throw new Error(`No products found for ${platformId}. Check matched columns.`);

        setProducts(prev => {
          // 1. Clean Replace: Remove any existing products from this specific file first!
          // This prevents "ghost" duplicates if IDs changed or items were removed in the new file.
          const cleanPrev = prev.filter(p => p.sourceFile !== file.name);

          const productMap = new Map(cleanPrev.map(p => [p.id, p]));
          let newCount = 0;
          let updateCount = 0;

          normalized.forEach(newItem => {
            if (productMap.has(newItem.id)) {
              // SMART UPDATE: Merge new data into existing record (Cross-File Match)
              const existing = productMap.get(newItem.id);
              updateCount++;

              productMap.set(newItem.id, {
                ...existing,
                ...newItem,
                currency: currency || existing.currency || settings.currency,

                shopGmv: newItem.shopGmv > 0 ? newItem.shopGmv : existing.shopGmv,
                videoGmv: newItem.videoGmv > 0 ? newItem.videoGmv : existing.videoGmv,
                liveGmv: newItem.liveGmv > 0 ? newItem.liveGmv : existing.liveGmv,

                importDate: new Date().toISOString()
              });
            } else {
              // New Product
              productMap.set(newItem.id, { ...newItem, currency: currency || settings.currency });
              newCount++;
            }
          });

          const mergedProducts = Array.from(productMap.values());
          const calculatedProducts = calculateABC(mergedProducts);
          dataManager.saveProducts(calculatedProducts, currentUser);

          addImportNotification({
            title: 'Smart Import Results',
            message: `Processed ${normalized.length} rows: ${newCount} New, ${updateCount} Updated. Currency: ${currency || settings.currency}`,
            type: 'success'
          });

          return calculatedProducts;
        });

        setUploadedFiles(prev => [...prev, {
          name: file.name,
          date: new Date().toISOString(),
          platform: platformId,
          currency: currency || settings.currency,
          status: 'success',
          recordsImported: normalized.length,
          importedData: normalized
        }]);

        addImportNotification({ title: 'Import Completed', message: `${normalized.length} records imported from ${platformId} (${currency || settings.currency}).`, type: 'success' });
        setActiveView('dashboard');
        setPendingFile(null);

      } catch (err) {
        console.error("Upload Error:", err);
        addImportNotification({ title: 'Import Failed', message: err.message, type: 'failed', details: { errorCode: detectErrorCode(err.message) } });
        setPendingFile(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (eOrFile, manualPlatform = null, manualCurrency = null) => {
    let file;
    if (eOrFile.target) {
      file = eOrFile.target.files[0];
      eOrFile.target.value = ''; // Reset input
    } else {
      file = eOrFile;
    }

    if (!file) return;

    if (manualPlatform) {
      // Direct processing if platform known
      processFile(file, manualPlatform, manualCurrency);
    } else {
      // Show App-level modal if platform unknown
      setPendingFile(file);
      setShowPlatformModal(true);
    }
  };

  const handlePlatformSelect = (platformId, currency) => {
    setShowPlatformModal(false);
    if (!pendingFile) return;
    processFile(pendingFile, platformId, currency);
  };

  const handleDeleteDataSource = (fileToDelete) => {
    if (!fileToDelete || !fileToDelete.name) {
      console.error("Delete failed: Invalid file object", fileToDelete);
      return;
    }

    // 1. Remove products associated with this file
    setProducts(prev => {
      const remaining = prev.filter(p => p.sourceFile !== fileToDelete.name);
      const updated = calculateABC(remaining);
      // Immediately persist to localStorage
      localStorage.setItem('shopProProducts', JSON.stringify(updated));
      return updated;
    });

    // 2. Remove file from registry
    setUploadedFiles(prev => {
      const remaining = prev.filter(f => f.name !== fileToDelete.name);
      // Immediately persist to localStorage (don't wait for useEffect)
      localStorage.setItem('shopProFiles', JSON.stringify(remaining));
      return remaining;
    });

    addNotification({ type: 'success', msg: `✅ Permanently deleted ${fileToDelete.name} and ${fileToDelete.recordsImported || 0} records. Data cleared from storage.` });
  };

  const handleReimportDataSource = (file) => {
    if (!file.importedData) return;
    setProducts(prev => {
      const updated = prev.filter(p => p.sourceFile !== file.name);
      const reimported = file.importedData.map(item => ({ ...item, sourceFile: file.name, importDate: new Date().toISOString() }));
      return calculateABC([...updated, ...reimported]);
    });
    setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, date: new Date().toISOString() } : f));
    addNotification(`Re-imported ${file.name}`);
  };

  const handleRestoreBackup = async (file) => {
    try {
      const data = await parseBackupFile(file);

      if (window.confirm(`Restore backup from ${new Date(file.lastModified).toLocaleDateString()}? This will replace current data.`)) {
        if (data.products) setProducts(data.products);
        if (data.settings) setSettings(data.settings);
        if (data.uploadedFiles) setUploadedFiles(data.uploadedFiles);

        // Persist immediately
        localStorage.setItem('shopProProducts', JSON.stringify(data.products));
        localStorage.setItem('shopProSettings', JSON.stringify(data.settings));
        localStorage.setItem('shopProFiles', JSON.stringify(data.uploadedFiles));

        addNotification({ type: 'success', msg: 'System restored successfully from Quantro Vault.' });
      }
    } catch (e) {
      addNotification({ type: 'error', msg: 'Invalid Backup File. Restore failed.' });
      console.error(e);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Product ID', 'Name', 'Platform', 'Status', 'Class', 'GMV', 'Orders', 'Sold'];
    const csvContent = [headers.join(','), ...processedProducts.map(p => [
      `"${p.id}"`, `"${p.name.replace(/"/g, '""')}"`, p.platform, p.status, p.abcCategory, p.gmv, p.orders, p.itemsSold
    ].join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'export.csv'; link.click();
  };

  const clearData = async () => {
    if (window.confirm("Clear all data? This will permanently remove local and cloud data.")) {
      setProducts([]);
      setUploadedFiles([]);

      // Wipe Cloud & Local through Manager
      await dataManager.clearAllUserData(currentUser);

      // Redundant safety clear
      localStorage.setItem('shopProProducts', '[]');
      localStorage.setItem('shopProFiles', '[]');

      addNotification({ type: 'success', msg: 'System fully wiped (Cloud & Local).' });
    }
  };

  const resetToSampleData = async () => {
    if (window.confirm("Reset to sample data?")) {
      setProducts(initialProducts);
      // Persist to Cloud so it survives refresh
      await dataManager.saveProducts(initialProducts, currentUser);
      localStorage.setItem('shopProProducts', JSON.stringify(initialProducts));
      addNotification({ type: 'success', msg: 'Reset to Sample Data successful.' });
    }
  };

  const { processedProducts, benchmarks, opportunityValue } = useMemo(() => {
    let data = [...products];
    if (statusFilter !== 'All') data = data.filter(p => p.status === statusFilter);
    if (platformFilter !== 'All') data = data.filter(p => p.platform === platformFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(lower) || String(p.id).toLowerCase().includes(lower));
    }

    // Sorting
    data.sort((a, b) => {
      let valA = a[sortConfig.key], valB = b[sortConfig.key];
      if (typeof valA === 'string' && valA.includes('%')) valA = parseFloat(valA);
      if (typeof valB === 'string' && valB.includes('%')) valB = parseFloat(valB);
      if (sortConfig.key === 'abcCategory') { const order = { 'A': 3, 'B': 2, 'C': 1 }; valA = order[a.abcCategory] || 0; valB = order[b.abcCategory] || 0; }
      return sortConfig.direction === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    const validItems = data.filter(p => p.gmv > 0);
    const avgCvr = validItems.reduce((sum, p) => sum + parsePercent(p.cvr), 0) / (validItems.length || 1);
    const avgCtr = validItems.reduce((sum, p) => sum + parsePercent(p.ctr), 0) / (validItems.length || 1);
    const avgViews = validItems.reduce((sum, p) => sum + (p.shopViews || 0), 0) / (validItems.length || 1);

    let totalOpportunity = 0;
    data = data.map(p => {
      const cvrNum = parsePercent(p.cvr), ctrNum = parsePercent(p.ctr);
      let segment = "Standard";
      const totalViews = (p.shopViews || 0) + (p.videoViews || 0);
      const orders = p.orders || p.itemsSold || 0;

      // Statistical Significance Thresholds (Prevent "False Hope")
      const MIN_VIEWS_SIG = 50;
      const MIN_ORDERS_SIG = 3;

      let healthScore = Math.round((Math.min((Math.log10(p.gmv + 1) / 5) * 100, 100) * 0.4) + ((cvrNum / (avgCvr || 1) * 50) * 0.3) + ((ctrNum / (avgCtr || 1) * 50) * 0.3));

      // Segmentation Logic - Now with Data Science Checks
      if (totalViews < MIN_VIEWS_SIG) {
        segment = "Incubating"; // Not enough data to judge
      } else if (healthScore >= 80) {
        segment = "Star Winner";
      } else if (totalViews > avgViews && cvrNum < avgCvr) {
        segment = "Optimize"; // High Traffic, Low CVR (Fix Listing)
      } else if (cvrNum > avgCvr && totalViews < avgViews && orders >= MIN_ORDERS_SIG) {
        segment = "Hidden Gem"; // High CVR, Low Traffic (Needs Ads)
      } else if (healthScore < 30) {
        segment = "At Risk";
      }

      // Opportunity Calculation (Only for items with potential)
      if (cvrNum < avgCvr && totalViews > 100) totalOpportunity += ((avgCvr - cvrNum) / 100) * totalViews * ((p.gmv / p.itemsSold) || 0);

      return { ...p, healthScore, segment, cvrNum, ctrNum, potentialRevenue: 0 };
    });

    return { processedProducts: data, benchmarks: { avgCvr, avgCtr, avgViews }, opportunityValue: totalOpportunity };
  }, [products, searchTerm, sortConfig, statusFilter, platformFilter]);

  const summary = useMemo(() => {
    const totalGmv = processedProducts.reduce((sum, p) => sum + (p.gmv || 0), 0);
    const totalOrders = processedProducts.reduce((sum, p) => sum + (p.orders || 0), 0);
    return { totalGmv, totalOrders, avgOrderValue: totalOrders ? totalGmv / totalOrders : 0, conversionRate: '2.5%' };
  }, [processedProducts]);

  const channelData = useMemo(() => processedProducts.reduce((acc, curr) => {
    acc.shop += curr.shopGmv || 0; acc.video += curr.videoGmv || 0; acc.live += curr.liveGmv || 0; return acc;
  }, { shop: 0, video: 0, live: 0 }), [processedProducts]);

  const totalChannelGmv = (channelData.shop + channelData.video + channelData.live) || 1;
  const topProduct = processedProducts.length > 0 ? processedProducts.reduce((p, c) => (p.gmv > c.gmv ? p : c)) : {};
  const availablePlatforms = useMemo(() => {
    const platforms = new Set(products.map(p => p.platform).filter(Boolean));
    return ['All', ...Array.from(platforms).filter(p => p !== 'All')];
  }, [products]);

  const smartInsights = useMemo(() => {
    const insights = [];
    if (processedProducts.some(p => p.segment === 'Hidden Gem')) insights.push({ type: 'opportunity', title: 'Hidden Gems', text: 'Found products with high conversion but low traffic.', icon: Zap });
    if (insights.length === 0) insights.push({ type: 'success', title: 'Stable', text: 'Performance is stable.', icon: CheckCircle2 });
    return insights;
  }, [processedProducts]);

  const handleSort = (key) => setSortConfig(c => ({ key, direction: c.key === key && c.direction === 'desc' ? 'asc' : 'desc' }));
  const getSortIcon = (key) => sortConfig.key !== key ? <ChevronDown className="w-3 h-3 opacity-30" /> : <ChevronDown className={`w-3 h-3 ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;

  if (!isAuthenticated) return <LandingPage onLogin={handleLogin} />;

  // --- Translations ---
  const t = (key) => getTranslation(language, key);

  return (
    <MainLayout
      activeView={activeView}
      setActiveView={setActiveView}
      smartInsights={smartInsights}
      fileInputRef={fileInputRef}
      handleFileUpload={handleFileUpload}
      currentUser={currentUser}
      handleLogout={handleLogout}
      platformFilter={platformFilter}
      setPlatformFilter={setPlatformFilter}
      availablePlatforms={availablePlatforms}
      timePeriod={timePeriod}
      setTimePeriod={setTimePeriod}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      t={t}
      settings={settings}
      processedProducts={processedProducts}
      setSelectedProduct={setSelectedProduct}
    >
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {activeView === 'dashboard' && <DashboardView topProduct={topProduct} setSelectedProduct={setSelectedProduct} currency={settings.currency} channelData={channelData} totalChannelGmv={totalChannelGmv} summary={summary} timePeriod={timePeriod} setTimePeriod={setTimePeriod} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} visibleKPIs={visibleKPIs} opportunityValue={opportunityValue} processedProducts={processedProducts} setActiveView={setActiveView} notifications={notifications} handleFileUpload={handleFileUpload} searchTerm={searchTerm} t={t} />}


          {activeView === 'inventory' && <InventoryView processedProducts={processedProducts} handleExportCSV={handleExportCSV} statusFilter={statusFilter} setStatusFilter={setStatusFilter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSort={handleSort} getSortIcon={getSortIcon} setSelectedProduct={setSelectedProduct} currency={settings.currency} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} t={t} />}
          {activeView === 'marketing' && <ProductInsightsView products={processedProducts} currency={settings.currency} searchTerm={searchTerm} setSearchTerm={setSearchTerm} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} t={t} />}
          {activeView === 'media' && <MediaView products={processedProducts} currency={settings.currency} t={t} />}
          {activeView === 'campaigns' && <CampaignView products={products} currency={settings.currency} campaigns={campaigns} setCampaigns={setCampaigns} t={t} />}
          {activeView === 'calendar' && <CalendarView uploadedFiles={uploadedFiles} campaigns={campaigns} products={products} t={t} />}
          {activeView === 'finance' && <FinanceView products={processedProducts} currency={settings.currency} campaigns={campaigns} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} t={t} />}
          {activeView === 'reports' && <ReportView settings={settings} summary={summary} smartInsights={smartInsights} channelData={channelData} currency={settings.currency} processedProducts={processedProducts} setActiveView={setActiveView} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} t={t} />}
          {activeView === 'settings' && <SettingsView settings={settings} setSettings={setSettings} products={products} uploadedFiles={uploadedFiles} clearData={clearData} resetToSampleData={resetToSampleData} onRestore={handleRestoreBackup} onDelete={handleDeleteDataSource} currentUser={currentUser} addNotification={addNotification} visibleKPIs={visibleKPIs} setVisibleKPIs={setVisibleKPIs} language={language} setLanguage={setLanguage} t={t} />}
          {activeView === 'profile' && <ProfileView currentUser={currentUser} onLogout={handleLogout} />}
          {activeView === 'about' && <AboutView />}
          {activeView === 'datasources' && <DataSourcesView uploadedFiles={uploadedFiles} onDelete={handleDeleteDataSource} onReimport={handleReimportDataSource} onFileUpload={handleFileUpload} currency={settings.currency} t={t} />}
          {/* Mapped Routes */}
          {(activeView === 'analytics' || activeView === 'performance') && <AdvancedAnalyticsView products={processedProducts} platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} availablePlatforms={availablePlatforms} currency={settings.currency} smartInsights={smartInsights} summary={summary} language={language} searchTerm={searchTerm} channelData={channelData} setSelectedProduct={setSelectedProduct} />}
          {activeView === 'alerts' && <AlertsView alerts={alerts} setAlerts={setAlerts} products={processedProducts} summary={summary} campaigns={campaigns} setActiveView={setActiveView} />}
          {activeView === 'revenue-intelligence' && <RevenueIntelligenceReport products={processedProducts} summary={summary} channelData={channelData} currency={settings.currency} settings={settings} />}
          {activeView === 'security' && <SecurityView securityLogs={securityLogs} setSecurityLogs={setSecurityLogs} currentUser={currentUser} summary={summary} />}
          {/* New Calculator Route */}
          {activeView === 'calculator' && <DecisionLabView currency={settings.currency} t={t} />}
        </div>
      </div>

      <NotificationContainer notifications={importNotifications} onDismiss={dismissImportNotification} onOpenErrorHelp={handleOpenErrorHelp} onOpenDataSourcesView={() => setShowDataSourcesView(true)} />
      {errorHelpModalCode && <ErrorHelpModal errorCode={errorHelpModalCode} onClose={() => setErrorHelpModalCode(null)} />}
      {showDataSourcesView && <DataSourcesView uploadedFiles={uploadedFiles} onClose={() => setShowDataSourcesView(false)} onDelete={handleDeleteDataSource} onReimport={handleReimportDataSource} />}
      {showGlobalHelp && <SystemManual onClose={() => setShowGlobalHelp(false)} />}

      <div className="fixed bottom-6 right-6 space-y-2 z-40">
        {notifications.map(n => (
          <NotificationToast key={n.id} notification={n} onDismiss={dismissNotification} />
        ))}
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} currency={settings.currency} benchmarks={benchmarks} />}
      {showPlatformModal && <PlatformSelectionModal onClose={() => { setShowPlatformModal(false); setPendingFile(null); }} onSelect={handlePlatformSelect} />}
      <ChatWidget setActiveView={setActiveView} />
    </MainLayout>
  );
}