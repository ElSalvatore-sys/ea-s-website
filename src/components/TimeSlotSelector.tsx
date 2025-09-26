// Dynamic Time Slot Selector Component
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import RestaurantTimeSlots from './timeslots/RestaurantTimeSlots';
import MedicalTimeSlots from './timeslots/MedicalTimeSlots';
import SalonTimeSlots from './timeslots/SalonTimeSlots';
import AutomotiveTimeSlots from './timeslots/AutomotiveTimeSlots';
import { useTimeSlotAvailability } from '../hooks/useTimeSlotAvailability';
import { TimeSlot, SlotConfiguration } from '../lib/timeSlotUtils';
import { useTranslation } from 'react-i18next';

interface TimeSlotSelectorProps {
  industryType: 'restaurant' | 'medical' | 'salon' | 'automotive';
  serviceId: string;
  serviceDuration: number;
  date: Date;
  onSelectSlot: (slot: TimeSlot | TimeSlot[]) => void;
  config?: SlotConfiguration;
  metadata?: {
    partySize?: number;
    visitType?: 'first' | 'followup';
    preferredStylist?: string;
    requiresMultipleDays?: boolean;
  };
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  industryType,
  serviceId,
  serviceDuration,
  date,
  onSelectSlot,
  config,
  metadata = {}
}) => {
  const { t, i18n } = useTranslation();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Default configuration if not provided
  const defaultConfig: SlotConfiguration = useMemo(() => {
    switch (industryType) {
      case 'restaurant':
        return {
          startTime: '06:00',
          endTime: '22:00',
          slotDuration: 30,
          bufferTime: 0
        };
      case 'medical':
        return {
          startTime: '08:00',
          endTime: '18:00',
          slotDuration: 30,
          bufferTime: 15,
          lunchBreak: { start: '12:00', end: '13:00' }
        };
      case 'salon':
        return {
          startTime: '09:00',
          endTime: '20:00',
          slotDuration: 30,
          bufferTime: 0
        };
      case 'automotive':
        return {
          startTime: '08:00',
          endTime: '18:00',
          slotDuration: 60,
          bufferTime: 0,
          lunchBreak: { start: '12:00', end: '13:00' }
        };
      default:
        return {
          startTime: '09:00',
          endTime: '18:00',
          slotDuration: 30,
          bufferTime: 0
        };
    }
  }, [industryType]);

  const slotConfig = config || defaultConfig;

  // Use the real-time availability hook
  const {
    slots,
    loading,
    error,
    isConnected,
    refreshSlots,
    updateSlot,
    reserveSlot,
    releaseSlot
  } = useTimeSlotAvailability({
    industryType,
    serviceId,
    date,
    config: slotConfig,
    onUpdate: (updatedSlots) => {
      setLastUpdate(Date.now());
    }
  });

  // Handle slot selection based on industry type
  const handleSlotSelection = async (slot: TimeSlot | TimeSlot[]) => {
    if (Array.isArray(slot)) {
      // Multiple slots (salon)
      setSelectedSlots(slot);
      onSelectSlot(slot);
      // Try to reserve but don't block selection
      Promise.all(slot.map(s => reserveSlot(s.id))).catch(() => {
        console.log('Reservation system not available - continuing in demo mode');
      });
    } else {
      // Single slot
      setSelectedSlot(slot);
      onSelectSlot(slot);
      // Try to reserve but don't block selection
      reserveSlot(slot.id).catch(() => {
        console.log('Reservation system not available - continuing in demo mode');
      });
    }
  };

  // Release slots on unmount or change
  useEffect(() => {
    return () => {
      if (selectedSlot) {
        releaseSlot(selectedSlot.id);
      }
      selectedSlots.forEach(s => releaseSlot(s.id));
    };
  }, [selectedSlot, selectedSlots, releaseSlot]);

  // Render industry-specific component
  const renderIndustrySelector = () => {
    switch (industryType) {
      case 'restaurant':
        return (
          <RestaurantTimeSlots
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelection}
            partySize={metadata.partySize}
            loading={loading}
            error={error}
          />
        );

      case 'medical':
        return (
          <MedicalTimeSlots
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelection}
            visitType={metadata.visitType}
            loading={loading}
            error={error}
          />
        );

      case 'salon':
        return (
          <SalonTimeSlots
            slots={slots}
            selectedSlots={selectedSlots}
            onSelectSlots={handleSlotSelection}
            serviceDuration={serviceDuration}
            preferredStylist={metadata.preferredStylist}
            loading={loading}
            error={error}
          />
        );

      case 'automotive':
        return (
          <AutomotiveTimeSlots
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSlotSelection}
            serviceDuration={serviceDuration}
            requiresMultipleDays={metadata.requiresMultipleDays}
            loading={loading}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700 font-medium">
                {t('booking.widget.liveAvailability')}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {t('booking.widget.offlineMode')}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Last Update */}
          <span className="text-xs text-gray-500">
            {t('booking.widget.updated')}: {new Date(lastUpdate).toLocaleTimeString()}
          </span>

          {/* Refresh Button */}
          <button
            onClick={refreshSlots}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title={t('booking.widget.refreshAvailability')}
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Smart Suggestions */}
      {isConnected && !loading && slots.length > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">
                {t('booking.widget.smartSuggestions')}
              </p>
              <div className="flex gap-2">
                {slots
                  .filter(s => s.available)
                  .slice(0, 3)
                  .map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelection(slot)}
                      className="px-3 py-1 bg-white text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      {slot.time}
                      {slot.metadata?.isPopular && ' ⭐'}
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Industry-Specific Selector */}
      <div className="relative">
        {renderIndustrySelector()}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {t('booking.widget.updatingAvailability')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Update Indicator */}
      {isConnected && (
        <AnimatePresence>
          {Date.now() - lastUpdate < 1000 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white text-sm rounded-lg shadow-lg z-50"
            >
              {t('booking.widget.availabilityUpdated')}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TimeSlotSelector;