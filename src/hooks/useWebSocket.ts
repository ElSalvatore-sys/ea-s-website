import { useState, useEffect, useCallback, useRef } from 'react';
import { getWebSocketService, WebSocketStatus, WebSocketMessage, WebSocketConfig } from '../lib/websocket';

export interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnect?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  onError?: (error: any) => void;
}

export interface UseWebSocketReturn {
  status: WebSocketStatus;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  send: (message: WebSocketMessage) => boolean;
  subscribe: (eventType: string, handler: (data: any) => void) => () => void;
  lastMessage: WebSocketMessage | null;
  lastError: Error | null;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  const {
    url = typeof window !== 'undefined' ? `ws://${window.location.hostname}:7155` : 'ws://localhost:7155',
    autoConnect = true,
    reconnect = true,
    onMessage,
    onStatusChange,
    onError
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const wsServiceRef = useRef<ReturnType<typeof getWebSocketService> | null>(null);
  const unsubscribersRef = useRef<Array<() => void>>([]);

  // Initialize WebSocket service
  useEffect(() => {
    const config: WebSocketConfig = {
      url,
      reconnect,
      debug: process.env.NODE_ENV === 'development'
    };

    try {
      wsServiceRef.current = getWebSocketService(config);
    } catch (error) {
      // Service might already be initialized, get the existing instance
      wsServiceRef.current = getWebSocketService();
    }

    const service = wsServiceRef.current;

    // Subscribe to status changes
    const unsubscribeStatus = service.onStatusChange((newStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    });
    unsubscribersRef.current.push(unsubscribeStatus);

    // Subscribe to all messages if onMessage is provided
    if (onMessage) {
      const unsubscribeMessage = service.on('*', (data) => {
        const message: WebSocketMessage = {
          type: '*',
          data,
          timestamp: new Date().toISOString()
        };
        setLastMessage(message);
        onMessage(message);
      });
      unsubscribersRef.current.push(unsubscribeMessage);
    }

    // Subscribe to errors
    const unsubscribeError = service.on('error', (error) => {
      const errorObj = new Error(error.message || 'WebSocket error');
      setLastError(errorObj);
      onError?.(errorObj);
    });
    unsubscribersRef.current.push(unsubscribeError);

    // Auto-connect if enabled
    if (autoConnect) {
      service.connect();
    }

    // Cleanup
    return () => {
      unsubscribersRef.current.forEach(unsubscribe => unsubscribe());
      unsubscribersRef.current = [];
      if (!autoConnect) {
        service.disconnect();
      }
    };
  }, [url, autoConnect, reconnect, onMessage, onStatusChange, onError]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    wsServiceRef.current?.connect();
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    wsServiceRef.current?.disconnect();
  }, []);

  // Send message
  const send = useCallback((message: WebSocketMessage): boolean => {
    return wsServiceRef.current?.send(message) || false;
  }, []);

  // Subscribe to specific event
  const subscribe = useCallback((eventType: string, handler: (data: any) => void): (() => void) => {
    if (!wsServiceRef.current) {
      return () => {};
    }
    
    const unsubscribe = wsServiceRef.current.on(eventType, handler);
    unsubscribersRef.current.push(unsubscribe);
    
    return () => {
      unsubscribe();
      const index = unsubscribersRef.current.indexOf(unsubscribe);
      if (index > -1) {
        unsubscribersRef.current.splice(index, 1);
      }
    };
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    send,
    subscribe,
    lastMessage,
    lastError
  };
};

// Hook for real-time bookings
export const useRealtimeBookings = (onNewBooking?: (booking: any) => void) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const { status, isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('booking:new', (data) => {
      setBookings(prev => [data, ...prev]);
      onNewBooking?.(data);
    });

    return unsubscribe;
  }, [isConnected, subscribe, onNewBooking]);

  return {
    bookings,
    status,
    isConnected
  };
};

// Hook for real-time metrics
export const useRealtimeMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const { status, isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe('metrics:update', (data) => {
      setMetrics(data);
    });

    return unsubscribe;
  }, [isConnected, subscribe]);

  return {
    metrics,
    status,
    isConnected
  };
};

// Hook for system health monitoring
export const useSystemHealth = () => {
  const [health, setHealth] = useState<any>(null);
  const { status, isConnected, subscribe, send } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to health updates
    const unsubscribe = subscribe('system:health', (data) => {
      setHealth(data);
    });

    // Request initial health status
    send({ type: 'subscribe:health' });

    return unsubscribe;
  }, [isConnected, subscribe, send]);

  return {
    health,
    status,
    isConnected
  };
};

export default useWebSocket;