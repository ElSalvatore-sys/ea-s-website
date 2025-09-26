import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getWebSocketService, DEFAULT_WEBSOCKET_CONFIG, WebSocketStatus } from '../lib/websocket';

export interface Notification {
  id: string;
  type: 'booking' | 'system' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  wsStatus: WebSocketStatus;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  wsUrl?: string;
  autoConnect?: boolean;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  wsUrl = DEFAULT_WEBSOCKET_CONFIG.url,
  autoConnect = true,
  maxNotifications = 50
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('ea-notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });
  
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>('disconnected');
  const [wsService, setWsService] = useState<ReturnType<typeof getWebSocketService> | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Save notifications to localStorage with size limit check
  useEffect(() => {
    try {
      const data = JSON.stringify(notifications);
      // Check localStorage size (5MB limit, use 4MB as safe threshold)
      const currentSize = new Blob(Object.values(localStorage)).size;
      if (currentSize > 4 * 1024 * 1024) {
        // Clear old notifications if approaching limit
        const recentNotifications = notifications.slice(0, 20);
        localStorage.setItem('ea-notifications', JSON.stringify(recentNotifications));
        setNotifications(recentNotifications);
      } else {
        localStorage.setItem('ea-notifications', data);
      }
    } catch (error) {
      // Handle QuotaExceededError
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old notifications');
        const recentNotifications = notifications.slice(0, 10);
        localStorage.setItem('ea-notifications', JSON.stringify(recentNotifications));
        setNotifications(recentNotifications);
      }
    }
  }, [notifications]);

  // Initialize WebSocket service
  useEffect(() => {
    try {
      const service = getWebSocketService({
        url: wsUrl,
        reconnect: true,
        debug: typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
      });

      setWsService(service);
      // Subscribe to status changes
      const unsubscribeStatus = service.onStatusChange(setWsStatus);

      // Subscribe to notification events
      const unsubscribeBooking = service.on('booking:new', (data) => {
        addNotification({
          type: 'booking',
          title: 'New Booking',
          message: `${data.customerName} booked ${data.service} for ${data.time}`,
          data
        });
      });

      const unsubscribeNotification = service.on('notification:new', (data) => {
        addNotification({
          type: data.type || 'info',
          title: data.title || 'Notification',
          message: data.message,
          data
        });
      });

      const unsubscribeMetrics = service.on('metrics:update', (data) => {
        // You can handle metrics updates here if needed
        console.log('Metrics updated:', data);
      });

      const unsubscribeError = service.on('error', (data) => {
        addNotification({
          type: 'alert',
          title: 'Connection Error',
          message: data.message || 'WebSocket connection error occurred'
        });
      });

      // Auto-connect if enabled
      if (autoConnect) {
        service.connect();
        service.subscribeToBookings();
      }

      // Cleanup
      return () => {
        unsubscribeStatus();
        unsubscribeBooking();
        unsubscribeNotification();
        unsubscribeMetrics();
        unsubscribeError();
        service.disconnect();
      };
    } catch (error) {
      console.warn('WebSocket service initialization failed:', error);
      // Set disconnected status if WebSocket fails to initialize
      setWsStatus('disconnected');
      // Return empty cleanup function
      return () => {};
    }
  }, [wsUrl, autoConnect]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => {
      // Add new notification at the beginning
      const updated = [newNotification, ...prev];
      // Limit to maxNotifications
      return updated.slice(0, maxNotifications);
    });
    
    // Play notification sound if available
    if ('Audio' in window) {
      try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (e.g., autoplay blocked)
        });
      } catch {
        // Ignore audio errors
      }
    }
    
    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: newNotification.id,
          requireInteraction: false
        });
      } catch {
        // Ignore notification errors
      }
    }
  }, [maxNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsService) {
      wsService.connect();
      wsService.subscribeToBookings();
    }
  }, [wsService]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsService) {
      wsService.disconnect();
    }
  }, [wsService]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    wsStatus,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    connectWebSocket,
    disconnectWebSocket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;