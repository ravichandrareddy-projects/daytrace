/**
 * SyncService — WebSocket-based real-time sync between devices
 * 
 * Desktop (Tauri) runs a WebSocket server.
 * Mobile connects via QR code scan.
 * Both sides broadcast state changes with last-write-wins merge.
 */

class SyncService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.deviceId = this._getDeviceId();
    this.syncToken = null;
    this.onStateReceived = null;
    this.onConnectionChange = null;
    this.reconnectTimer = null;
    this.serverUrl = null;
  }

  /**
   * Connect to a sync server (mobile → desktop)
   */
  connect(serverUrl, token) {
    this.serverUrl = serverUrl;
    this.syncToken = token;

    try {
      this.ws = new WebSocket(`${serverUrl}?token=${token}&device=${this.deviceId}`);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[Sync] Connected to server');
        this._notifyConnectionChange(true);
        
        // Save for auto-reconnect
        localStorage.setItem('daytrace_sync_server', serverUrl);
        localStorage.setItem('daytrace_sync_token', token);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'state_update' && data.deviceId !== this.deviceId) {
            if (this.onStateReceived) {
              this.onStateReceived(data.state, data.timestamp);
            }
          }
        } catch (e) {
          console.warn('[Sync] Failed to parse message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this._notifyConnectionChange(false);
        console.log('[Sync] Disconnected');
        
        // Auto-reconnect after 5 seconds
        this.reconnectTimer = setTimeout(() => {
          if (this.serverUrl && this.syncToken) {
            this.connect(this.serverUrl, this.syncToken);
          }
        }, 5000);
      };

      this.ws.onerror = (error) => {
        console.error('[Sync] WebSocket error:', error);
      };

    } catch (e) {
      console.error('[Sync] Failed to connect:', e);
    }
  }

  /**
   * Send state update to connected device
   */
  sendState(state) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify({
        type: 'state_update',
        deviceId: this.deviceId,
        state: state,
        timestamp: Date.now()
      }));
    }
  }

  /**
   * Disconnect
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    localStorage.removeItem('daytrace_sync_server');
    localStorage.removeItem('daytrace_sync_token');
  }

  /**
   * Try auto-reconnect from saved credentials
   */
  tryAutoReconnect() {
    const server = localStorage.getItem('daytrace_sync_server');
    const token = localStorage.getItem('daytrace_sync_token');
    if (server && token) {
      this.connect(server, token);
    }
  }

  /**
   * Generate a QR code data string for desktop
   * Contains: ws://LOCAL_IP:PORT?token=XYZ
   */
  static generateSyncQRData(port = 9742) {
    const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    
    // Get local IP (in Tauri, this would come from Rust)
    const localIP = window.location.hostname || 'localhost';
    const url = `ws://${localIP}:${port}`;
    
    return {
      url,
      token,
      qrData: JSON.stringify({ url, token, app: 'daytrace' })
    };
  }

  // === Private ===

  _getDeviceId() {
    let id = localStorage.getItem('daytrace_device_id');
    if (!id) {
      id = 'device_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem('daytrace_device_id', id);
    }
    return id;
  }

  _notifyConnectionChange(connected) {
    if (this.onConnectionChange) {
      this.onConnectionChange(connected);
    }
  }
}

export const syncService = new SyncService();
export default syncService;
