// React Hook for Real-Time Availability Engine
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useWebSocket } from './useWebSocket';
import {
  getPractitionerAvailability,
  getNextAvailableSlot,
  findBestMatch,
  checkConflicts,
  optimizeDailySchedule,
  reserveSlot,
  releaseSlot,
  preloadAvailability,
  getPerformanceMetrics,
  DEMO_BOOKINGS
} from '../utils/availabilityEngine';
import { bookingOptimizer } from '../utils/bookingOptimizer';
import { getGlobalCache } from '../utils/availabilityCache';
import type { Staff } from '../lib/demoStaffData';
import type { Shift } from '../lib/staffScheduleUtils';
import type {
  TimeSlot,
  AvailabilityResult,
  BookingConflict,
  ScheduleOptimization,
  PractitionerMatch
} from '../utils/availabilityEngine';

export interface UseAvailabilityEngineOptions {
  practitioners: Staff[];
  existingBookings?: Shift[];
  autoPreload?: boolean;
  realtimeUpdates?: boolean;
  demoMode?: boolean;
  cacheEnabled?: boolean;
  optimizationEnabled?: boolean;
}

export interface UseAvailabilityEngineReturn {
  // Core functions
  getAvailability: (practitionerId: string, date: Date) => AvailabilityResult;
  getNextSlot: (practitionerId: string, duration: number, from?: Date) => TimeSlot | null;
  findAlternatives: (serviceType: string, preferredTime: Date, duration: number) => PractitionerMatch[];
  checkConflict: (practitionerId: string, dateTime: Date, duration: number) => BookingConflict;
  optimizeSchedule: (practitionerId: string, date: Date) => ScheduleOptimization;

  // Slot management
  reserve: (practitionerId: string, dateTime: Date, duration: number) => Promise<boolean>;
  release: (practitionerId: string, dateTime: Date) => void;

  // Real-time data
  viewerCount: Map<string, number>;
  recentBookings: Shift[];
  isConnected: boolean;

  // Performance
  metrics: ReturnType<typeof getPerformanceMetrics>;
  isLoading: boolean;
  error: Error | null;

  // Actions
  refresh: () => void;
  preload: () => Promise<void>;
  clearCache: () => void;
}

export const useAvailabilityEngine = (
  options: UseAvailabilityEngineOptions
): UseAvailabilityEngineReturn => {
  const {
    practitioners,
    existingBookings = [],
    autoPreload = true,
    realtimeUpdates = true,
    demoMode = false,
    cacheEnabled = true,
    optimizationEnabled = true
  } = options;

  // State
  const [bookings, setBookings] = useState<Shift[]>(
    demoMode ? [...existingBookings, ...DEMO_BOOKINGS] : existingBookings
  );
  const [viewerCount, setViewerCount] = useState<Map<string, number>>(new Map());
  const [recentBookings, setRecentBookings] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState(getPerformanceMetrics());

  // Refs
  const cache = useRef(cacheEnabled ? getGlobalCache() : null);
  const reservationsRef = useRef<Map<string, { until: Date; slotKey: string }>>(new Map());
  const userId = useRef(`user-${Date.now()}-${Math.random()}`);

  // WebSocket connection for real-time updates
  const {
    isConnected,
    send,
    subscribe
  } = useWebSocket({
    autoConnect: realtimeUpdates,
    onMessage: (message) => {
      handleWebSocketMessage(message);
    }
  });

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: any) => {
    switch (message.type) {
      case 'booking:new':
        const newBooking = message.data as Shift;
        setBookings(prev => [...prev, newBooking]);
        setRecentBookings(prev => [newBooking, ...prev.slice(0, 9)]);
        // Invalidate cache for affected practitioner
        if (cache.current) {
          const pattern = `availability:${newBooking.staffId}:*`;
          cache.current.keys(pattern).forEach(key => cache.current!.delete(key));
        }
        break;

      case 'booking:cancelled':
        const cancelledId = message.data.id;
        setBookings(prev => prev.filter(b => b.id !== cancelledId));
        break;

      case 'viewers:update':
        const { slotKey, count } = message.data;
        setViewerCount(prev => new Map(prev).set(slotKey, count));
        break;

      case 'availability:changed':
        // Force refresh of affected practitioner
        if (cache.current) {
          const pattern = `availability:${message.data.practitionerId}:*`;
          cache.current.keys(pattern).forEach(key => cache.current!.delete(key));
        }
        break;
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isConnected || !realtimeUpdates) return;

    const unsubscribers: Array<() => void> = [];

    // Subscribe to booking events
    unsubscribers.push(subscribe('booking:new', (data) => {
      handleWebSocketMessage({ type: 'booking:new', data });
    }));

    unsubscribers.push(subscribe('booking:cancelled', (data) => {
      handleWebSocketMessage({ type: 'booking:cancelled', data });
    }));

    // Subscribe to viewer count updates
    unsubscribers.push(subscribe('viewers:update', (data) => {
      handleWebSocketMessage({ type: 'viewers:update', data });
    }));

    // Subscribe to availability changes
    unsubscribers.push(subscribe('availability:changed', (data) => {
      handleWebSocketMessage({ type: 'availability:changed', data });
    }));

    // Notify server we're viewing
    send({ type: 'viewer:join', data: { userId: userId.current } });

    return () => {
      unsubscribers.forEach(unsub => unsub());
      send({ type: 'viewer:leave', data: { userId: userId.current } });
    };
  }, [isConnected, realtimeUpdates, subscribe, send, handleWebSocketMessage]);

  // Auto-preload on mount
  useEffect(() => {
    if (autoPreload) {
      preload();
    }
  }, [autoPreload]);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(getPerformanceMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Core functions
  const getAvailability = useCallback((
    practitionerId: string,
    date: Date
  ): AvailabilityResult => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    if (!practitioner) {
      throw new Error(`Practitioner ${practitionerId} not found`);
    }

    return getPractitionerAvailability(
      practitioner,
      date,
      bookings,
      30, // Default slot duration
      0,  // No buffer time
      false, // Don't include holidays
      false  // Don't include overtime
    );
  }, [practitioners, bookings]);

  const getNextSlot = useCallback((
    practitionerId: string,
    duration: number,
    from: Date = new Date()
  ): TimeSlot | null => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    if (!practitioner) return null;

    return getNextAvailableSlot(
      practitioner,
      duration,
      from,
      14, // Check 2 weeks ahead
      bookings,
      0   // No buffer time
    );
  }, [practitioners, bookings]);

  const findAlternatives = useCallback((
    serviceType: string,
    preferredTime: Date,
    duration: number,
    preferredPractitionerId?: string
  ): PractitionerMatch[] => {
    return findBestMatch(
      serviceType,
      preferredTime,
      duration,
      practitioners,
      bookings,
      preferredPractitionerId
    );
  }, [practitioners, bookings]);

  const checkConflict = useCallback((
    practitionerId: string,
    dateTime: Date,
    duration: number
  ): BookingConflict => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    return checkConflicts(
      practitionerId,
      dateTime,
      duration,
      bookings,
      practitioner
    );
  }, [practitioners, bookings]);

  const optimizeSchedule = useCallback((
    practitionerId: string,
    date: Date
  ): ScheduleOptimization => {
    const practitioner = practitioners.find(p => p.id === practitionerId);
    if (!practitioner) {
      throw new Error(`Practitioner ${practitionerId} not found`);
    }

    if (optimizationEnabled) {
      const availability = getAvailability(practitionerId, date);
      const optimizationResult = bookingOptimizer.optimizeSchedule(
        practitioner,
        date,
        bookings,
        availability.slots
      );

      return {
        originalSchedule: availability.slots,
        optimizedSchedule: availability.slots, // Would be modified based on optimization
        improvements: {
          gapReduction: optimizationResult.improvements.gapReduction,
          groupingBenefit: 0,
          utilizationIncrease: optimizationResult.improvements.utilizationGain
        },
        suggestions: optimizationResult.recommendations
      };
    }

    return optimizeDailySchedule(practitioner, date, bookings);
  }, [practitioners, bookings, optimizationEnabled, getAvailability]);

  // Slot reservation
  const reserve = useCallback(async (
    practitionerId: string,
    dateTime: Date,
    duration: number
  ): Promise<boolean> => {
    // Check for conflicts first
    const conflict = checkConflict(practitionerId, dateTime, duration);
    if (conflict.hasConflict) {
      setError(new Error(conflict.reason));
      return false;
    }

    // Reserve the slot
    const success = reserveSlot(practitionerId, dateTime, duration, userId.current);

    if (success) {
      const slotKey = `${practitionerId}:${dateTime.toISOString()}`;
      reservationsRef.current.set(userId.current, {
        until: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        slotKey
      });

      // Notify server if connected
      if (isConnected) {
        send({
          type: 'slot:reserve',
          data: {
            practitionerId,
            dateTime: dateTime.toISOString(),
            duration,
            userId: userId.current
          }
        });
      }
    }

    return success;
  }, [checkConflict, isConnected, send]);

  const release = useCallback((
    practitionerId: string,
    dateTime: Date
  ): void => {
    releaseSlot(practitionerId, dateTime, userId.current);

    // Notify server if connected
    if (isConnected) {
      send({
        type: 'slot:release',
        data: {
          practitionerId,
          dateTime: dateTime.toISOString(),
          userId: userId.current
        }
      });
    }
  }, [isConnected, send]);

  // Actions
  const refresh = useCallback(() => {
    // Clear cache
    if (cache.current) {
      cache.current.clear();
    }

    // Re-fetch bookings if connected
    if (isConnected) {
      send({ type: 'bookings:refresh' });
    }

    // Update metrics
    setMetrics(getPerformanceMetrics());
  }, [isConnected, send]);

  const preload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await preloadAvailability(practitioners, bookings);
      setMetrics(getPerformanceMetrics());
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [practitioners, bookings]);

  const clearCache = useCallback(() => {
    if (cache.current) {
      cache.current.clear();
      setMetrics(getPerformanceMetrics());
    }
  }, []);

  // Clean up reservations on unmount
  useEffect(() => {
    return () => {
      reservationsRef.current.forEach((reservation, userId) => {
        const [practitionerId, dateTimeStr] = reservation.slotKey.split(':');
        releaseSlot(practitionerId, new Date(dateTimeStr), userId);
      });
    };
  }, []);

  // Monitor cache performance in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && cache.current) {
      const stopMonitoring = cache.current.startMonitoring(30000); // Every 30 seconds
      return stopMonitoring;
    }
  }, []);

  return {
    // Core functions
    getAvailability,
    getNextSlot,
    findAlternatives,
    checkConflict,
    optimizeSchedule,

    // Slot management
    reserve,
    release,

    // Real-time data
    viewerCount,
    recentBookings,
    isConnected,

    // Performance
    metrics,
    isLoading,
    error,

    // Actions
    refresh,
    preload,
    clearCache
  };
};

// Convenience hook for single practitioner
export const usePractitionerAvailability = (
  practitioner: Staff,
  date: Date = new Date(),
  options?: Partial<UseAvailabilityEngineOptions>
) => {
  const engine = useAvailabilityEngine({
    practitioners: [practitioner],
    ...options
  });

  const availability = useMemo(() =>
    engine.getAvailability(practitioner.id, date),
    [engine, practitioner.id, date]
  );

  const nextSlot = useMemo(() =>
    engine.getNextSlot(practitioner.id, 30),
    [engine, practitioner.id]
  );

  return {
    availability,
    nextSlot,
    reserve: (dateTime: Date, duration: number) =>
      engine.reserve(practitioner.id, dateTime, duration),
    release: (dateTime: Date) =>
      engine.release(practitioner.id, dateTime),
    isLoading: engine.isLoading,
    error: engine.error
  };
};

export default useAvailabilityEngine;