// Real-time Time Slot Availability Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { TimeSlot, generateTimeSlots, SlotConfiguration } from '../lib/timeSlotUtils';

export interface AvailabilityUpdate {
  slotId: string;
  available: boolean;
  capacity?: number;
  metadata?: any;
}

export interface UseTimeSlotAvailabilityOptions {
  industryType: string;
  serviceId: string;
  date: Date;
  config: SlotConfiguration;
  onUpdate?: (slots: TimeSlot[]) => void;
}

export interface UseTimeSlotAvailabilityReturn {
  slots: TimeSlot[];
  loading: boolean;
  error: Error | null;
  isConnected: boolean;
  refreshSlots: () => void;
  updateSlot: (slotId: string, update: Partial<TimeSlot>) => void;
  reserveSlot: (slotId: string) => Promise<boolean>;
  releaseSlot: (slotId: string) => void;
}

export const useTimeSlotAvailability = (
  options: UseTimeSlotAvailabilityOptions
): UseTimeSlotAvailabilityReturn => {
  const { industryType, serviceId, date, config, onUpdate } = options;
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const reservedSlotsRef = useRef<Set<string>>(new Set());
  const optimisticUpdatesRef = useRef<Map<string, TimeSlot>>(new Map());

  // WebSocket connection for real-time updates
  const {
    status,
    isConnected,
    send,
    subscribe,
    lastMessage
  } = useWebSocket({
    autoConnect: true,
    onMessage: (message) => {
      handleWebSocketMessage(message);
    }
  });

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((message: any) => {
    if (message.type === 'availability_update') {
      const update = message.data as AvailabilityUpdate;
      updateSlotAvailability(update);
    } else if (message.type === 'bulk_update') {
      const updates = message.data as AvailabilityUpdate[];
      updates.forEach(update => updateSlotAvailability(update));
    } else if (message.type === 'reservation_confirmed') {
      const { slotId, success } = message.data;
      if (!success) {
        // Revert optimistic update if reservation failed
        revertOptimisticUpdate(slotId);
      }
    }
  }, []);

  // Initialize slots
  useEffect(() => {
    setLoading(true);
    try {
      const generatedSlots = generateTimeSlots(config, date, industryType);
      setSlots(generatedSlots);

      // Subscribe to availability updates for this service
      send({
        type: 'subscribe_availability',
        data: {
          industryType,
          serviceId,
          date: date.toISOString()
        }
      });

      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [industryType, serviceId, date, config, send]);

  // Update slot availability from WebSocket
  const updateSlotAvailability = useCallback((update: AvailabilityUpdate) => {
    setSlots(prevSlots => {
      const updatedSlots = prevSlots.map(slot => {
        if (slot.id === update.slotId) {
          return {
            ...slot,
            available: update.available,
            capacity: update.capacity !== undefined ? update.capacity : slot.capacity,
            metadata: update.metadata ? { ...slot.metadata, ...update.metadata } : slot.metadata
          };
        }
        return slot;
      });

      // Notify parent component of updates
      if (onUpdate) {
        onUpdate(updatedSlots);
      }

      return updatedSlots;
    });
  }, [onUpdate]);

  // Manual slot update (optimistic)
  const updateSlot = useCallback((slotId: string, update: Partial<TimeSlot>) => {
    setSlots(prevSlots => {
      const updatedSlots = prevSlots.map(slot => {
        if (slot.id === slotId) {
          const updatedSlot = { ...slot, ...update };
          optimisticUpdatesRef.current.set(slotId, slot); // Store original for reverting
          return updatedSlot;
        }
        return slot;
      });
      return updatedSlots;
    });
  }, []);

  // Reserve a slot (optimistic with confirmation)
  const reserveSlot = useCallback(async (slotId: string): Promise<boolean> => {
    // Optimistically mark as unavailable
    updateSlot(slotId, { available: false });
    reservedSlotsRef.current.add(slotId);

    // Send reservation request via WebSocket
    send({
      type: 'reserve_slot',
      data: {
        slotId,
        industryType,
        serviceId,
        date: date.toISOString()
      }
    });

    // Wait for confirmation (with timeout)
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        // If no confirmation after 5 seconds, assume failure
        revertOptimisticUpdate(slotId);
        resolve(false);
      }, 5000);

      const unsubscribe = subscribe('reservation_confirmed', (data) => {
        if (data.slotId === slotId) {
          clearTimeout(timeout);
          unsubscribe();
          resolve(data.success);
        }
      });
    });
  }, [industryType, serviceId, date, send, subscribe, updateSlot]);

  // Release a reserved slot
  const releaseSlot = useCallback((slotId: string) => {
    if (reservedSlotsRef.current.has(slotId)) {
      reservedSlotsRef.current.delete(slotId);
      updateSlot(slotId, { available: true });

      send({
        type: 'release_slot',
        data: {
          slotId,
          industryType,
          serviceId,
          date: date.toISOString()
        }
      });
    }
  }, [industryType, serviceId, date, send, updateSlot]);

  // Revert optimistic update
  const revertOptimisticUpdate = useCallback((slotId: string) => {
    const originalSlot = optimisticUpdatesRef.current.get(slotId);
    if (originalSlot) {
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.id === slotId ? originalSlot : slot
        )
      );
      optimisticUpdatesRef.current.delete(slotId);
      reservedSlotsRef.current.delete(slotId);
    }
  }, []);

  // Refresh all slots
  const refreshSlots = useCallback(() => {
    send({
      type: 'refresh_availability',
      data: {
        industryType,
        serviceId,
        date: date.toISOString()
      }
    });
  }, [industryType, serviceId, date, send]);

  // Clean up reserved slots on unmount
  useEffect(() => {
    return () => {
      reservedSlotsRef.current.forEach(slotId => {
        send({
          type: 'release_slot',
          data: {
            slotId,
            industryType,
            serviceId,
            date: date.toISOString()
          }
        });
      });
    };
  }, [industryType, serviceId, date, send]);

  return {
    slots,
    loading,
    error,
    isConnected,
    refreshSlots,
    updateSlot,
    reserveSlot,
    releaseSlot
  };
};