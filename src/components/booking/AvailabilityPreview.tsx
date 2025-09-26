// Availability Preview Component for Practitioner Cards
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { de } from 'date-fns/locale';
import type { AvailableSlot } from '../../lib/practitionerAvailability';
import { useTranslation } from 'react-i18next';

interface AvailabilityPreviewProps {
  slots: AvailableSlot[];
  isLoading?: boolean;
  isFullyBooked?: boolean;
  isAvailableNow?: boolean;
  variant?: 'compact' | 'detailed';
  onSlotClick?: (slot: AvailableSlot) => void;
}

const AvailabilityPreview: React.FC<AvailabilityPreviewProps> = ({
  slots,
  isLoading = false,
  isFullyBooked = false,
  isAvailableNow = false,
  variant = 'compact',
  onSlotClick
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Fully booked state
  if (isFullyBooked || slots.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">
          {isGerman ? 'Keine freien Termine' : 'No availability'}
        </span>
      </div>
    );
  }

  // Format slot display text
  const formatSlotText = (slot: AvailableSlot) => {
    let dateText = '';
    
    if (slot.isToday) {
      dateText = isGerman ? 'Heute' : 'Today';
    } else if (slot.isTomorrow) {
      dateText = isGerman ? 'Morgen' : 'Tomorrow';
    } else {
      dateText = format(slot.date, isGerman ? 'EEE dd.MM' : 'EEE MM/dd', {
        locale: isGerman ? de : undefined
      });
    }

    return `${dateText} • ${slot.time}`;
  };

  // Compact variant (for card view)
  if (variant === 'compact') {
    return (
      <div className="space-y-1.5">
        {/* Available now indicator */}
        {isAvailableNow && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-600 mb-1"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">
              {isGerman ? 'Jetzt verfügbar' : 'Available now'}
            </span>
          </motion.div>
        )}

        {/* Next available slots */}
        {slots.slice(0, 3).map((slot, index) => (
          <motion.button
            key={`${slot.date}-${slot.time}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSlotClick?.(slot)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors group w-full text-left"
          >
            <Clock className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
            <span className="group-hover:underline">
              {formatSlotText(slot)}
            </span>
            {slot.isToday && (
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                {isGerman ? 'Heute' : 'Today'}
              </span>
            )}
          </motion.button>
        ))}

        {/* More slots indicator */}
        {slots.length > 3 && (
          <div className="text-xs text-gray-500 pl-5">
            +{slots.length - 3} {isGerman ? 'weitere Termine' : 'more slots'}
          </div>
        )}
      </div>
    );
  }

  // Detailed variant (for expanded view)
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          {isGerman ? 'Verfügbare Termine' : 'Available Appointments'}
        </h4>
        {isAvailableNow && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {isGerman ? 'Jetzt verfügbar' : 'Available now'}
          </span>
        )}
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-2 gap-2">
        {slots.slice(0, 6).map((slot, index) => (
          <motion.button
            key={`${slot.date}-${slot.time}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSlotClick?.(slot)}
            className="relative flex flex-col items-start p-2.5 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
              <Calendar className="w-3 h-3" />
              <span>
                {slot.isToday
                  ? isGerman ? 'Heute' : 'Today'
                  : slot.isTomorrow
                  ? isGerman ? 'Morgen' : 'Tomorrow'
                  : format(slot.date, isGerman ? 'EEE dd.MM' : 'EEE MM/dd', {
                      locale: isGerman ? de : undefined
                    })}
              </span>
            </div>

            {/* Time */}
            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
              {slot.time}
            </div>

            {/* Today badge */}
            {slot.isToday && (
              <div className="absolute top-1 right-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </div>
            )}

            {/* Hover indicator */}
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        ))}
      </div>

      {/* View all button */}
      {slots.length > 6 && (
        <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          {isGerman
            ? `Alle ${slots.length} Termine anzeigen`
            : `View all ${slots.length} slots`}
        </button>
      )}

      {/* Booking tip */}
      <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
        <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          {isGerman
            ? 'Tipp: Buchen Sie früh für die beste Verfügbarkeit'
            : 'Tip: Book early for the best availability'}
        </p>
      </div>
    </div>
  );
};

export default AvailabilityPreview;