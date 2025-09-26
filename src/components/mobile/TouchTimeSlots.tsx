import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Coffee, Sunrise, Sun, Moon, AlertCircle, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { isMittagspause } from '../../utils/germanHolidays';
import { useIntersectionObserver } from 'react-intersection-observer';

interface TimeSlot {
  time: string;
  available: boolean;
  capacity?: number;
  maxCapacity?: number;
  isPeakTime?: boolean;
}

interface TouchTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  locale?: 'de' | 'en' | 'fr';
  showCapacity?: boolean;
  groupByPeriod?: boolean;
  className?: string;
}

interface TimeGroup {
  period: 'morning' | 'afternoon' | 'evening';
  label: string;
  icon: React.ReactNode;
  slots: TimeSlot[];
}

const TouchTimeSlots: React.FC<TouchTimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  locale = 'en',
  showCapacity = true,
  groupByPeriod = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['morning', 'afternoon']));
  const containerRef = useRef<HTMLDivElement>(null);

  // Group slots by time period
  const groupSlots = (slots: TimeSlot[]): TimeGroup[] => {
    if (!groupByPeriod) {
      return [{
        period: 'morning',
        label: t('booking.timeSlots.allTimes'),
        icon: <Clock className="w-4 h-4" />,
        slots
      }];
    }

    const groups: TimeGroup[] = [
      {
        period: 'morning',
        label: t('booking.timeSlots.morning'),
        icon: <Sunrise className="w-4 h-4" />,
        slots: []
      },
      {
        period: 'afternoon',
        label: t('booking.timeSlots.afternoon'),
        icon: <Sun className="w-4 h-4" />,
        slots: []
      },
      {
        period: 'evening',
        label: t('booking.timeSlots.evening'),
        icon: <Moon className="w-4 h-4" />,
        slots: []
      }
    ];

    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      if (hour < 12) {
        groups[0].slots.push(slot);
      } else if (hour < 18) {
        groups[1].slots.push(slot);
      } else {
        groups[2].slots.push(slot);
      }
    });

    return groups.filter(group => group.slots.length > 0);
  };

  const timeGroups = groupSlots(slots);

  // Toggle group expansion
  const toggleGroup = (period: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(period)) {
      newExpanded.delete(period);
    } else {
      newExpanded.add(period);
    }
    setExpandedGroups(newExpanded);
  };

  // Handle slot selection with haptic feedback
  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onSlotSelect(slot);
  };

  // Format time based on locale
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    if (locale === 'en') {
      return format(date, 'h:mm a');
    }
    return time;
  };

  // Check if time is during lunch break
  const isLunchTime = (time: string) => {
    return locale === 'de' && isMittagspause(time);
  };

  // Get capacity color
  const getCapacityColor = (capacity?: number, maxCapacity?: number) => {
    if (!capacity || !maxCapacity) return 'text-gray-500';
    const percentage = (capacity / maxCapacity) * 100;
    if (percentage <= 25) return 'text-red-500';
    if (percentage <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('booking.timeSlots.selectTime')}
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {slots.filter(s => s.available).length} {t('booking.timeSlots.available')}
        </div>
      </div>

      {/* Time groups */}
      <div className="space-y-3">
        {timeGroups.map((group) => (
          <div key={group.period} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            {/* Group header */}
            {groupByPeriod && (
              <button
                onClick={() => toggleGroup(group.period)}
                className="w-full flex items-center justify-between p-4
                         touch-manipulation tap-highlight-none
                         hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  {group.icon}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {group.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({group.slots.filter(s => s.available).length} {t('booking.timeSlots.slots')})
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: expandedGroups.has(group.period) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
            )}

            {/* Time slots */}
            <AnimatePresence>
              {(!groupByPeriod || expandedGroups.has(group.period)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 pt-0">
                    {group.slots.map((slot, index) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      const isLunch = isLunchTime(slot.time);

                      return (
                        <motion.button
                          key={slot.time}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!slot.available || isLunch}
                          className={`
                            relative min-h-[60px] p-3 rounded-lg
                            touch-manipulation tap-highlight-none
                            transition-all duration-200
                            ${slot.available && !isLunch
                              ? 'hover:scale-105 active:scale-95'
                              : 'cursor-not-allowed opacity-50'
                            }
                            ${isSelected
                              ? 'bg-purple-500 text-white shadow-lg'
                              : slot.available && !isLunch
                              ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                              : 'bg-gray-100 dark:bg-gray-800'
                            }
                            ${slot.isPeakTime && slot.available
                              ? 'ring-2 ring-yellow-400 dark:ring-yellow-500'
                              : ''
                            }
                          `}
                        >
                          {/* Time */}
                          <div className={`
                            text-sm font-medium
                            ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}
                          `}>
                            {formatTime(slot.time)}
                          </div>

                          {/* Capacity indicator */}
                          {showCapacity && slot.capacity !== undefined && slot.maxCapacity && (
                            <div className={`
                              mt-1 text-xs
                              ${isSelected ? 'text-white/80' : getCapacityColor(slot.capacity, slot.maxCapacity)}
                            `}>
                              {slot.capacity}/{slot.maxCapacity}
                            </div>
                          )}

                          {/* Lunch break indicator */}
                          {isLunch && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Coffee className="w-4 h-4 text-gray-400" />
                            </div>
                          )}

                          {/* Selected indicator */}
                          {isSelected && (
                            <div className="absolute top-1 right-1">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}

                          {/* Peak time indicator */}
                          {slot.isPeakTime && slot.available && !isSelected && (
                            <div className="absolute top-1 right-1">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Info messages */}
      <div className="mt-4 space-y-2 px-2">
        {locale === 'de' && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Coffee className="w-4 h-4" />
            <span>Mittagspause von 12:00 bis 13:00 Uhr</span>
          </div>
        )}

        {slots.some(s => s.isPeakTime) && (
          <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="w-4 h-4" />
            <span>{t('booking.timeSlots.peakTimeNotice')}</span>
          </div>
        )}

        {slots.filter(s => s.available).length === 0 && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{t('booking.timeSlots.noSlotsAvailable')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouchTimeSlots;