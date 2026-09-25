/**
 * UPIDetectionService — Detect when UPI payment apps are opened/closed
 * 
 * Monitors app tracking logs for UPI app usage and triggers
 * a purchase prompt overlay when a UPI app is closed.
 */

// Complete list of UPI apps in India (20+ apps)
export const UPI_APPS = [
  { name: 'Google Pay', package: 'com.google.android.apps.nbu.paisa.user', icon: '💳', color: '#4285F4' },
  { name: 'PhonePe', package: 'com.phonepe.app', icon: '💜', color: '#5F259F' },
  { name: 'Paytm', package: 'net.one97.paytm', icon: '🔵', color: '#00BAF2' },
  { name: 'Amazon Pay', package: 'in.amazon.mShop.android.shopping', icon: '📦', color: '#FF9900' },
  { name: 'BHIM', package: 'in.org.npci.upiapp', icon: '🇮🇳', color: '#00529B' },
  { name: 'CRED', package: 'com.dreamplug.androidapp', icon: '⚡', color: '#1A1A2E' },
  { name: 'MobiKwik', package: 'com.mobikwik_new', icon: '💙', color: '#2979FF' },
  { name: 'Freecharge', package: 'com.freecharge.android', icon: '⚡', color: '#75BA44' },
  { name: 'Airtel Thanks', package: 'com.myairtelapp', icon: '📶', color: '#ED1C24' },
  { name: 'JioPay', package: 'com.jio.myjio', icon: '📱', color: '#0A1172' },
  { name: 'Navi', package: 'com.navi.digital', icon: '🟢', color: '#00C853' },
  { name: 'Slice', package: 'com.slice', icon: '💳', color: '#6C63FF' },
  { name: 'Fi Money', package: 'com.epifi.paisa', icon: '💰', color: '#7B61FF' },
  { name: 'Jupiter', package: 'money.jupiter', icon: '🪐', color: '#FF6B35' },
  { name: 'ICICI iMobile', package: 'com.csam.icici.bank.imobile', icon: '🏦', color: '#F58220' },
  { name: 'HDFC PayZapp', package: 'com.enstage.wibmo.hdfc', icon: '🏦', color: '#004C8F' },
  { name: 'SBI YONO', package: 'com.sbi.lotusintouch', icon: '🏦', color: '#22409A' },
  { name: 'Axis Mobile', package: 'com.axis.mobile', icon: '🏦', color: '#97144D' },
  { name: 'Bank of Baroda', package: 'com.bankofbaroda.mconnect', icon: '🏦', color: '#F26522' },
  { name: 'Union Bank', package: 'com.infrasoft.uboi', icon: '🏦', color: '#1B3F8B' },
  { name: 'Kotak', package: 'com.msf.kbank.mobile', icon: '🏦', color: '#ED1C24' },
  { name: 'IndusInd Bank', package: 'com.indusindbankltd.mobile', icon: '🏦', color: '#87171E' },
  { name: 'Yes Bank', package: 'com.atomyes', icon: '🏦', color: '#00529B' },
  { name: 'Bajaj Finserv', package: 'org.altruist.BajajExperia', icon: '💰', color: '#003B73' },
];

// Keywords to match UPI apps by name (for web/Tauri where we only get window title)
const UPI_KEYWORDS = [
  'gpay', 'google pay', 'phonepe', 'paytm', 'amazon pay', 'bhim',
  'cred', 'mobikwik', 'freecharge', 'airtel thanks', 'jiopay', 'jio pay',
  'navi', 'slice', 'fi money', 'jupiter', 'imobile', 'payzapp', 'yono',
  'axis mobile', 'bank of baroda', 'union bank', 'kotak', 'induslnd',
  'yes bank', 'bajaj finserv'
];

/**
 * Check if an app name is a UPI app
 */
export function isUPIApp(appName) {
  if (!appName) return false;
  const name = appName.toLowerCase();
  return UPI_KEYWORDS.some(keyword => name.includes(keyword));
}

/**
 * Get UPI app info by name
 */
export function getUPIAppInfo(appName) {
  if (!appName) return null;
  const name = appName.toLowerCase();
  return UPI_APPS.find(app => name.includes(app.name.toLowerCase())) || {
    name: appName,
    icon: '💳',
    color: '#6366F1'
  };
}

class UPIDetectionService {
  constructor() {
    this.onUPIAppClosed = null; // Callback when UPI app is closed
    this.lastUPIApp = null;
    this.isUPIAppOpen = false;
  }

  /**
   * Call this whenever an app usage entry is logged
   */
  handleAppLogEntry(entry) {
    // Check if the closed app was a UPI app
    if (isUPIApp(entry.appName)) {
      this.lastUPIApp = getUPIAppInfo(entry.appName);
      this.isUPIAppOpen = false;
      
      // Trigger the overlay callback
      if (this.onUPIAppClosed) {
        this.onUPIAppClosed({
          appName: entry.appName,
          appInfo: this.lastUPIApp,
          timestamp: entry.endTime,
          durationSeconds: entry.durationSeconds
        });
      }
    }
  }

  /**
   * Set callback for when a UPI app is closed
   */
  setOnUPIAppClosed(callback) {
    this.onUPIAppClosed = callback;
  }
}

export const upiDetector = new UPIDetectionService();
export default upiDetector;
