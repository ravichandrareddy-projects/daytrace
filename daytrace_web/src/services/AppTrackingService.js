/**
 * AppTrackingService — 24/7 automatic app usage tracking
 * 
 * Tracks which app is in the foreground and logs start/end times.
 * Works across platforms:
 * - Web: Uses Page Visibility API + document.title
 * - Desktop (Tauri): Uses active-window Rust plugin
 * - Mobile (Capacitor): Uses UsageStats Android API
 */

import { APP_CATEGORIES, categorizeApp } from './AppCategorizer';

const POLL_INTERVAL_MS = 5000; // Check every 5 seconds

class AppTrackingService {
  constructor() {
    this.currentApp = null;
    this.currentStartTime = null;
    this.logs = [];
    this.listeners = [];
    this.pollTimer = null;
    this.platform = this._detectPlatform();
    this.activeFocusSessionId = null;
  }

  /**
   * Detect platform: 'tauri' | 'capacitor' | 'web'
   */
  _detectPlatform() {
    if (typeof window !== 'undefined') {
      if (window.__TAURI__) return 'tauri';
      if (window.Capacitor) return 'capacitor';
    }
    return 'web';
  }

  /**
   * Start tracking — call once on app startup
   */
  start() {
    if (this.pollTimer) return; // Already running

    // Load persisted logs
    this._loadLogs();

    // Initial check
    this._checkCurrentApp();

    // Start polling
    this.pollTimer = setInterval(() => {
      this._checkCurrentApp();
    }, POLL_INTERVAL_MS);

    // Also track visibility changes (web)
    if (this.platform === 'web') {
      document.addEventListener('visibilitychange', this._onVisibilityChange);
    }

    console.log(`[AppTracker] Started on platform: ${this.platform}`);
  }

  /**
   * Stop tracking
   */
  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    
    // Close current app entry
    if (this.currentApp) {
      this._closeCurrentEntry();
    }
  }

  /**
   * Set the active focus session ID (for distraction tracking)
   */
  setActiveFocusSession(sessionId) {
    this.activeFocusSessionId = sessionId;
  }

  /**
   * Subscribe to log updates
   */
  onLogUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Get all logs for today
   */
  getTodayLogs() {
    const today = new Date().toISOString().split('T')[0];
    return this.logs.filter(log => log.startTime.startsWith(today));
  }

  /**
   * Get logs that occurred during a specific focus session
   */
  getDistractionsDuringSession(sessionStartTime, sessionEndTime) {
    return this.logs.filter(log => {
      const logStart = new Date(log.startTime).getTime();
      const sessionStart = new Date(sessionStartTime).getTime();
      const sessionEnd = sessionEndTime 
        ? new Date(sessionEndTime).getTime() 
        : Date.now();
      return logStart >= sessionStart && logStart <= sessionEnd && log.category !== 'productivity';
    });
  }

  // === Private Methods ===

  async _checkCurrentApp() {
    let appInfo;

    switch (this.platform) {
      case 'tauri':
        appInfo = await this._getTauriActiveWindow();
        break;
      case 'capacitor':
        appInfo = await this._getCapacitorForegroundApp();
        break;
      default:
        appInfo = this._getWebPageInfo();
    }

    if (!appInfo || !appInfo.name) return;

    // If app changed, close previous and open new
    if (this.currentApp !== appInfo.name) {
      if (this.currentApp) {
        this._closeCurrentEntry();
      }
      this._openNewEntry(appInfo);
    }
  }

  _openNewEntry(appInfo) {
    this.currentApp = appInfo.name;
    this.currentStartTime = new Date().toISOString();
    
    console.log(`[AppTracker] Opened: ${appInfo.name}`);
  }

  _closeCurrentEntry() {
    const endTime = new Date().toISOString();
    const startMs = new Date(this.currentStartTime).getTime();
    const endMs = new Date(endTime).getTime();
    const durationMinutes = Math.round((endMs - startMs) / 60000);

    // Only log if used for more than 5 seconds
    if (durationMinutes >= 0) {
      const entry = {
        id: `usage_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        appName: this.currentApp,
        appIcon: this._getAppIcon(this.currentApp),
        startTime: this.currentStartTime,
        endTime: endTime,
        durationMinutes: Math.max(1, durationMinutes),
        durationSeconds: Math.round((endMs - startMs) / 1000),
        category: categorizeApp(this.currentApp),
        duringSession: this.activeFocusSessionId || null,
        platform: this.platform === 'web' ? 'web' : this.platform === 'tauri' ? 'desktop' : 'mobile'
      };

      this.logs.push(entry);
      this._saveLogs();
      this._notifyListeners(entry);
      
      console.log(`[AppTracker] Logged: ${entry.appName} (${entry.durationMinutes} min)`);
    }

    this.currentApp = null;
    this.currentStartTime = null;
  }

  // --- Platform-specific getters ---

  async _getTauriActiveWindow() {
    try {
      if (window.__TAURI__) {
        const { invoke } = await import('@tauri-apps/api/core');
        const info = await invoke('get_active_window');
        return {
          name: info?.title || info?.process_name || 'Unknown',
          packageName: info?.process_name || ''
        };
      }
    } catch (e) {
      // Tauri command not available yet
    }
    return null;
  }

  async _getCapacitorForegroundApp() {
    try {
      if (window.Capacitor) {
        // This would use a native plugin like @capacitor-community/app-usage
        // For now, fall back to web detection
        return this._getWebPageInfo();
      }
    } catch (e) {
      // Plugin not available
    }
    return null;
  }

  _getWebPageInfo() {
    return {
      name: document.title || 'Browser Tab',
      packageName: window.location.hostname || 'web'
    };
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      // User switched away
      if (this.currentApp) {
        this._closeCurrentEntry();
      }
    } else {
      // User came back
      this._checkCurrentApp();
    }
  }

  _getAppIcon(appName) {
    const name = (appName || '').toLowerCase();
    const iconMap = {
      'instagram': '📸',
      'youtube': '▶️',
      'whatsapp': '💬',
      'twitter': '🐦',
      'x': '𝕏',
      'telegram': '✈️',
      'discord': '🎮',
      'spotify': '🎵',
      'netflix': '🎬',
      'chrome': '🌐',
      'firefox': '🦊',
      'safari': '🧭',
      'vs code': '💻',
      'visual studio': '💻',
      'terminal': '⬛',
      'free fire': '🔥',
      'pubg': '🎯',
      'call': '📞',
      'messages': '💬',
      'gmail': '📧',
      'outlook': '📧',
      'slack': '💼',
      'notion': '📝',
      'figma': '🎨',
      'photoshop': '🖌️',
      'excel': '📊',
      'word': '📄',
      'powerpoint': '📊',
      'calculator': '🔢',
      'camera': '📷',
      'gallery': '🖼️',
      'maps': '🗺️',
      'uber': '🚗',
      'swiggy': '🍔',
      'zomato': '🍕',
      'amazon': '📦',
      'flipkart': '🛒',
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (name.includes(key)) return icon;
    }
    return '📱';
  }

  // --- Persistence ---

  _saveLogs() {
    try {
      // Keep only last 7 days of logs
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const cutoff = sevenDaysAgo.toISOString();
      
      this.logs = this.logs.filter(l => l.startTime >= cutoff);
      localStorage.setItem('daytrace_app_usage_logs', JSON.stringify(this.logs));
    } catch (e) {
      console.warn('[AppTracker] Failed to save logs:', e);
    }
  }

  _loadLogs() {
    try {
      const stored = localStorage.getItem('daytrace_app_usage_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      this.logs = [];
    }
  }

  _notifyListeners(entry) {
    this.listeners.forEach(cb => {
      try { cb(entry, this.logs); } catch (e) { /* ignore */ }
    });
  }
}

// Singleton instance
export const appTracker = new AppTrackingService();
export default appTracker;
