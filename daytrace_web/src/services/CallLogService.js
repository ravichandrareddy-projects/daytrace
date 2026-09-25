/**
 * CallLogService — Read and record phone calls in the timeline
 * 
 * Uses Capacitor native plugin on Android.
 * Falls back to manual entry on web/desktop.
 */

class CallLogService {
  constructor() {
    this.logs = [];
    this.listeners = [];
    this.pollTimer = null;
    this.lastReadTimestamp = null;
  }

  /**
   * Start polling call log (Android only)
   */
  async start() {
    this._loadLogs();

    // Only works on Capacitor (Android)
    if (!window.Capacitor) {
      console.log('[CallLog] Not on Capacitor, skipping native call log.');
      return;
    }

    // Check permission
    const hasPermission = await this._checkPermission();
    if (!hasPermission) {
      console.warn('[CallLog] READ_CALL_LOG permission not granted');
      return;
    }

    // Initial read
    await this._readCallLog();

    // Poll every 30 seconds for new calls
    this.pollTimer = setInterval(() => {
      this._readCallLog();
    }, 30000);
  }

  stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  getTodayLogs() {
    const today = new Date().toISOString().split('T')[0];
    return this.logs.filter(l => l.startTime.startsWith(today));
  }

  onLogUpdate(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Manually add a call log entry (for web/desktop)
   */
  addManualEntry(contact, startTime, durationMinutes, type = 'outgoing') {
    const entry = {
      id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      appName: `Call: ${contact}`,
      appIcon: type === 'incoming' ? '📲' : '📞',
      contact,
      startTime,
      endTime: new Date(new Date(startTime).getTime() + durationMinutes * 60000).toISOString(),
      durationMinutes,
      durationSeconds: durationMinutes * 60,
      category: 'call',
      callType: type, // incoming | outgoing | missed
      platform: 'mobile'
    };

    this.logs.push(entry);
    this._saveLogs();
    this._notify(entry);
    return entry;
  }

  // === Private ===

  async _checkPermission() {
    try {
      // Would use a Capacitor permission plugin here
      return true; // Assume granted for now
    } catch {
      return false;
    }
  }

  async _readCallLog() {
    try {
      // This would use a native Capacitor plugin to read android.provider.CallLog
      // For now, we simulate with stored data
      // In production: const calls = await CallLog.getCallLog({ limit: 50 });
      console.log('[CallLog] Reading call log...');
    } catch (e) {
      console.warn('[CallLog] Failed to read:', e);
    }
  }

  _saveLogs() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const cutoff = sevenDaysAgo.toISOString();
      this.logs = this.logs.filter(l => l.startTime >= cutoff);
      localStorage.setItem('daytrace_call_logs', JSON.stringify(this.logs));
    } catch (e) { /* ignore */ }
  }

  _loadLogs() {
    try {
      const stored = localStorage.getItem('daytrace_call_logs');
      if (stored) this.logs = JSON.parse(stored);
    } catch {
      this.logs = [];
    }
  }

  _notify(entry) {
    this.listeners.forEach(cb => { try { cb(entry); } catch { /* ignore */ } });
  }
}

export const callLogService = new CallLogService();
export default callLogService;
