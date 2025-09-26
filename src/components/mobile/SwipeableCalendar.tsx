import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Coffee, AlertCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { de, enUS, fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { isGermanHoliday, isGermanBusinessDay } from '../../utils/germanHolidays';
import { useSwipeable } from 'react-swipeable';

interface SwipeableCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  locale?: 'de' | 'en' | 'fr';
  showHolidays?: boolean;
  showMittagspause?: boolean;
  onMonthChange?: (date: Date) => void;
  className?: string;
}

const SwipeableCalendar: React.FC<SwipeableCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
  locale = 'en',
  showHolidays = true,
  showMittagspause = true,
  onMonthChange,
  className = ''
}) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get locale object
  const getLocaleObject = () => {
    switch (locale) {
      case 'de': return de;
      case 'fr': return fr;
      default: return enUS;
    }
  };

  // Generate calendar days
  const generateCalendarDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { locale: getLocaleObject() });
    const end = endOfWeek(endOfMonth(month), { locale: getLocaleObject() });
    return eachDayOfInterval({ start, end });
  };

  const days = generateCalendarDays(currentMonth);

  // Navigate months
  const navigateMonth = useCallback((direction: 'prev' | 'next') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction === 'next' ? 'left' : 'right');

    setTimeout(() => {
      const newMonth = direction === 'next'
        ? addMonths(currentMonth, 1)
        : subMonths(currentMonth, 1);

      setCurrentMonth(newMonth);
      onMonthChange?.(newMonth);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  }, [currentMonth, isAnimating, onMonthChange]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => navigateMonth('next'),
    onSwipedRight: () => navigateMonth('prev'),
    preventScrollOnSwipe: true,
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    swipeDuration: 500,
    touchEventOptions: { passive: false }
  });

  // Check if date is available
  const isDateAvailable = (date: Date) => {
    if (availableDates.length > 0) {
      return availableDates.some(d => isSameDay(d, date));
    }
    return date >= minDate && date <= maxDate && isGermanBusinessDay(date);
  };

  // Check if date is a holiday
  const getHolidayInfo = (date: Date) => {
    return showHolidays ? isGermanHoliday(date) : null;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateAvailable(date)) return;

    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onDateSelect(date);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateMonth('prev');
      } else if (e.key === 'ArrowRight') {
        navigateMonth('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateMonth]);

  // Get weekday headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (locale === 'de') {
    weekDays.unshift(weekDays.pop()!); // Move Sunday to end for German locale
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={() => navigateMonth('prev')}
          disabled={isAnimating || currentMonth <= startOfMonth(minDate)}
          className="p-2 rounded-lg touch-manipulation tap-highlight-none
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <motion.h3
          key={format(currentMonth, 'MMM yyyy')}
          initial={{ opacity: 0, y: swipeDirection === 'left' ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: swipeDirection === 'left' ? -20 : 20 }}
          className="text-lg font-semibold text-gray-900 dark:text-white"
        >
          {format(currentMonth, 'MMMM yyyy', { locale: getLocaleObject() })}
        </motion.h3>

        <button
          onClick={() => navigateMonth('next')}
          disabled={isAnimating || currentMonth >= startOfMonth(maxDate)}
          className="p-2 rounded-lg touch-manipulation tap-highlight-none
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div ref={containerRef} {...handlers} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={format(currentMonth, 'MM-yyyy')}
            initial={{
              opacity: 0,
              x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="grid grid-cols-7 gap-1"
          >
            {days.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isAvailable = isDateAvailable(day);
              const isTodayDate = isToday(day);
              const holiday = getHolidayInfo(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={!isAvailable || !isCurrentMonth}
                  className={`
                    relative min-h-[44px] p-2 rounded-lg
                    touch-manipulation tap-highlight-none
                    transition-all duration-200
                    ${isCurrentMonth ? '' : 'opacity-30'}
                    ${isAvailable && isCurrentMonth
                      ? 'hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
                      : 'cursor-not-allowed'
                    }
                    ${isSelected
                      ? 'bg-purple-500 text-white hover:bg-purple-600'
                      : ''
                    }
                    ${isTodayDate && !isSelected
                      ? 'ring-2 ring-purple-400 dark:ring-purple-500'
                      : ''
                    }
                    ${holiday
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : ''
                    }
                  `}
                  aria-label={format(day, 'EEEE, MMMM d, yyyy', { locale: getLocaleObject() })}
                  aria-selected={isSelected}
                  aria-disabled={!isAvailable || !isCurrentMonth}
                >
                  <span className={`
                    text-sm font-medium
                    ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}
                    ${!isAvailable && isCurrentMonth ? 'text-gray-400 dark:text-gray-600' : ''}
                  `}>
                    {format(day, 'd')}
                  </span>

                  {/* Holiday indicator */}
                  {holiday && isCurrentMonth && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-red-500 rounded-full"
                           title={holiday.name} />
                    </div>
                  )}

                  {/* Available slot indicator */}
                  {isAvailable && isCurrentMonth && !isSelected && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend and info */}
      <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-400">
        {showMittagspause && locale === 'de' && (
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4" />
            <span>Mittagspause: 12:00 - 13:00 Uhr</span>
          </div>
        )}

        {showHolidays && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{t('booking.calendar.holidaysUnavailable')}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>{t('booking.calendar.available')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <span>{t('booking.calendar.unavailable')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeableCalendar;