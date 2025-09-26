// WebSocket Service for Real-Time Communication
// Provides centralized WebSocket management with reconnection, queuing, and event handling

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

type EventHandler = (data: any) => void;
type StatusHandler = (status: WebSocketStatus) => void;

class WebSocketService {
  private static instance: WebSocketService | null = null;
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private status: WebSocketStatus = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  private statusHandlers: Set<StatusHandler> = new Set();
  private messageQueue: WebSocketMessage[] = [];
  private isIntentionallyClosed = false;

  private constructor(config: WebSocketConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 1000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      debug: false,
      ...config
    };
  }

  // Singleton pattern
  public static getInstance(config?: WebSocketConfig): WebSocketService {
    if (!WebSocketService.instance && config) {
      WebSocketService.instance = new WebSocketService(config);
    } else if (!WebSocketService.instance) {
      throw new Error('WebSocketService must be initialized with config first');
    }
    return WebSocketService.instance;
  }

  // Connect to WebSocket server
  public connect(): void {
    // Disable WebSocket in development to avoid connection errors
    if (import.meta.env.DEV || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development')) {
      this.log('WebSocket disabled in development');
      this.updateStatus('disconnected');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('Already connected');
      return;
    }

    this.isIntentionallyClosed = false;
    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventListeners();
    } catch (error) {
      this.handleError(error);
    }
  }

  // Disconnect from WebSocket server
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    this.cleanup();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.updateStatus('disconnected');
  }

  // Send message to server
  public send(message: WebSocketMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        this.log('Sent message:', message);
        return true;
      } catch (error) {
        this.handleError(error);
        this.queueMessage(message);
        return false;
      }
    } else {
      this.log('WebSocket not open, queuing message');
      this.queueMessage(message);
      return false;
    }
  }

  // Subscribe to specific event type
  public on(eventType: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  // Subscribe to connection status changes
  public onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    
    // Immediately notify of current status
    handler(this.status);
    
    // Return unsubscribe function
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  // Get current connection status
  public getStatus(): WebSocketStatus {
    return this.status;
  }

  // Check if connected
  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Setup WebSocket event listeners
  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.log('WebSocket connected');
      this.updateStatus('connected');
      this.reconnectAttempts = 0;
      
      // Send queued messages
      this.flushMessageQueue();
      
      // Start heartbeat
      this.startHeartbeat();
      
      // Notify handlers
      this.emit('connection:established', {
        timestamp: new Date().toISOString()
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.log('Received message:', message);
        
        // Handle heartbeat
        if (message.type === 'pong') {
          return;
        }
        
        // Emit to specific handlers
        this.emit(message.type, message.data);
      } catch (error) {
        this.log('Error parsing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      this.handleError(error);
    };

    this.ws.onclose = (event) => {
      this.log('WebSocket closed:', event.code, event.reason);
      this.cleanup();
      
      if (!this.isIntentionallyClosed && this.config.reconnect) {
        this.updateStatus('reconnecting');
        this.scheduleReconnect();
      } else {
        this.updateStatus('disconnected');
      }
    };
  }

  // Emit event to handlers
  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  // Update connection status
  private updateStatus(status: WebSocketStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.statusHandlers.forEach(handler => {
        try {
          handler(status);
        } catch (error) {
          console.error('Error in status handler:', error);
        }
      });
    }
  }

  // Handle errors
  private handleError(error: any): void {
    this.log('WebSocket error:', error);
    this.updateStatus('error');
    this.emit('error', {
      message: error?.message || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }

  // Schedule reconnection attempt
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      this.log('Max reconnection attempts reached');
      this.updateStatus('disconnected');
      return;
    }

    const delay = this.getReconnectDelay();
    this.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Calculate reconnect delay with exponential backoff
  private getReconnectDelay(): number {
    const baseDelay = this.config.reconnectInterval || 1000;
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, this.reconnectAttempts), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  // Queue message for sending when reconnected
  private queueMessage(message: WebSocketMessage): void {
    // Limit queue size to prevent memory issues
    const maxQueueSize = 100;
    if (this.messageQueue.length >= maxQueueSize) {
      this.messageQueue.shift(); // Remove oldest message
    }
    this.messageQueue.push(message);
  }

  // Send queued messages
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    if (!this.config.heartbeatInterval) return;
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping', timestamp: new Date().toISOString() });
      }
    }, this.config.heartbeatInterval);
  }

  // Cleanup timers and handlers
  private cleanup(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Debug logging
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }

  // Subscribe to booking events
  public subscribeToBookings(organizationId?: string): void {
    this.send({
      type: 'subscribe:bookings',
      data: { organizationId: organizationId || 'admin' }
    });
  }

  // Subscribe to metrics updates
  public subscribeToMetrics(): void {
    this.send({
      type: 'subscribe:metrics',
      data: {}
    });
  }

  // Subscribe to system health updates
  public subscribeToHealth(): void {
    this.send({
      type: 'subscribe:health',
      data: {}
    });
  }
}

// Export singleton instance getter
export const getWebSocketService = (config?: WebSocketConfig): WebSocketService => {
  return WebSocketService.getInstance(config);
};

// Export default config for monitoring server
export const DEFAULT_WEBSOCKET_CONFIG: WebSocketConfig = {
  url: `ws://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:7155`,
  reconnect: true,
  reconnectInterval: 1000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  debug: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
};

export default WebSocketService;