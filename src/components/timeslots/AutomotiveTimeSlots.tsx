// Simple Automotive Time Slot Selection Component
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { TimeSlot } from '../../lib/timeSlotUtils';
import { useTranslation } from 'react-i18next';

interface AutomotiveTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  serviceDuration: number;
  requiresMultipleDays?: boolean;
  loading?: boolean;
  error?: Error | null;
}

const AutomotiveTimeSlots: React.FC<AutomotiveTimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false,
  error = null
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{isGerman ? 'Fehler beim Laden der Zeitfenster' : 'Error loading time slots'}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{isGerman ? 'Keine verfügbaren Termine' : 'No available slots'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const isAvailable = slot.available;

        return (
          <motion.button
            key={slot.id}
            whileHover={isAvailable ? { scale: 1.02 } : {}}
            whileTap={isAvailable ? { scale: 0.98 } : {}}
            onClick={() => isAvailable && onSelectSlot(slot)}
            disabled={!isAvailable}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2
              ${isSelected
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : isAvailable
                ? 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              }
            `}
          >
            <Clock className="w-4 h-4 text-gray-500" />
            <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
              {slot.time}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AutomotiveTimeSlots;