// Restaurant Time Slot Selection Component
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Music, Star, AlertCircle, MapPin, TrendingUp } from 'lucide-react';
import { TimeSlot, formatDuration } from '../../lib/timeSlotUtils';
import { useTranslation } from 'react-i18next';

interface RestaurantTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  partySize?: number;
  loading?: boolean;
  error?: Error | null;
}

const RestaurantTimeSlots: React.FC<RestaurantTimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  partySize = 2,
  loading = false,
  error = null
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  // Group slots by time periods
  const groupedSlots = useMemo(() => {
    const groups = {
      breakfast: [] as TimeSlot[],
      lunch: [] as TimeSlot[],
      dinner: [] as TimeSlot[]
    };

    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      if (hour >= 6 && hour < 11) {
        groups.breakfast.push(slot);
      } else if (hour >= 11 && hour < 15) {
        groups.lunch.push(slot);
      } else if (hour >= 17 && hour <= 22) {
        groups.dinner.push(slot);
      }
    });

    return groups;
  }, [slots]);

  // Calculate if tables can accommodate party size
  const canAccommodateParty = (slot: TimeSlot): boolean => {
    if (!slot.metadata?.tables) return false;
    // Assume each table can seat 4 people
    return (slot.metadata.tables * 4) >= partySize;
  };

  const renderTableTypes = (types: string[] | undefined) => {
    if (!types || types.length === 0) return null;

    const typeIcons: Record<string, JSX.Element> = {
      window: <span className="text-blue-600">🪟</span>,
      terrace: <span className="text-green-600">🌿</span>,
      main: <span className="text-gray-600">🪑</span>,
      private: <span className="text-purple-600">🚪</span>
    };

    return (
      <div className="flex gap-1 mt-1">
        {types.map(type => (
          <span key={type} className="text-xs" title={type}>
            {typeIcons[type]}
          </span>
        ))}
      </div>
    );
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedSlot?.id === slot.id;
    const isHovered = hoveredSlot === slot.id;
    const canBook = slot.available && canAccommodateParty(slot);
    const isPopular = slot.metadata?.isPopular;
    const isLastAvailable = slot.metadata?.isLastAvailable;

    return (
      <motion.div
        key={slot.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={canBook ? { scale: 1.02 } : {}}
        onHoverStart={() => setHoveredSlot(slot.id)}
        onHoverEnd={() => setHoveredSlot(null)}
        className="relative"
      >
        <button
          onClick={() => canBook && onSelectSlot(slot)}
          disabled={!canBook}
          className={`
            relative w-full p-4 rounded-xl border-2 transition-all duration-200
            ${isSelected
              ? 'border-orange-500 bg-orange-50 shadow-lg'
              : canBook
              ? 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
              : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
            }
          `}
        >
          {/* Popular/Last Available Badge */}
          {(isPopular || isLastAvailable) && canBook && (
            <div className="absolute -top-2 -right-2 z-10">
              {isLastAvailable ? (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {isGerman ? 'Letzter Tisch' : 'Last table'}
                </span>
              ) : isPopular ? (
                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {isGerman ? 'Beliebt' : 'Popular'}
                </span>
              ) : null}
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 text-left">
              {/* Time */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`font-semibold ${isSelected ? 'text-orange-700' : 'text-gray-900'}`}>
                  {slot.time}
                </span>
              </div>

              {/* Table Availability */}
              {slot.metadata?.tables && (
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {slot.metadata.tables === 1
                      ? isGerman ? '1 Tisch verfügbar' : '1 table left'
                      : isGerman
                      ? `${slot.metadata.tables} Tische verfügbar`
                      : `${slot.metadata.tables} tables available`
                    }
                  </span>
                </div>
              )}

              {/* Table Types */}
              {renderTableTypes(slot.metadata?.tableTypes)}

              {/* Special Notes */}
              {slot.metadata?.specialNote && (
                <div className="flex items-center gap-1 mt-2">
                  <Music className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">
                    {slot.metadata.specialNote}
                  </span>
                </div>
              )}
            </div>

            {/* Visual Capacity Indicator */}
            <div className="flex flex-col items-center ml-4">
              <div className="grid grid-cols-2 gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      i < (slot.metadata?.tables || 0)
                        ? isSelected
                          ? 'bg-orange-400'
                          : 'bg-green-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {!canBook && slot.available && (
                <span className="text-xs text-red-500 mt-1">
                  {isGerman ? 'Zu klein' : 'Too small'}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {isHovered && slot.metadata?.tableTypes && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
            >
              <div className="flex flex-col gap-1">
                {slot.metadata.tableTypes.map(type => (
                  <span key={type}>
                    {type === 'window' && (isGerman ? 'Fenstertisch' : 'Window table')}
                    {type === 'terrace' && (isGerman ? 'Terrassentisch' : 'Terrace table')}
                    {type === 'main' && (isGerman ? 'Hauptbereich' : 'Main dining')}
                    {type === 'private' && (isGerman ? 'Privater Bereich' : 'Private area')}
                  </span>
                ))}
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderPeriod = (
    title: string,
    slots: TimeSlot[],
    icon: JSX.Element,
    bgColor: string
  ) => {
    if (slots.length === 0) return null;

    const availableSlots = slots.filter(s => s.available && canAccommodateParty(s));
    const hasAvailability = availableSlots.length > 0;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {hasAvailability && (
            <span className="text-sm text-gray-500">
              {availableSlots.length} {isGerman ? 'verfügbar' : 'available'}
            </span>
          )}
        </div>

        <div className={`p-4 rounded-xl ${bgColor}`}>
          {hasAvailability ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map(renderTimeSlot)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>{isGerman ? 'Keine Tische verfügbar' : 'No tables available'}</p>
              <p className="text-sm mt-1">
                {isGerman
                  ? `Für ${partySize} Personen in diesem Zeitraum`
                  : `For ${partySize} guests during this period`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">
          {isGerman ? 'Verfügbarkeit wird geladen...' : 'Loading availability...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">
          {isGerman ? 'Fehler beim Laden der Verfügbarkeit' : 'Error loading availability'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">
            {isGerman ? 'Hauptbereich' : 'Main dining'}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {slots.filter(s => s.metadata?.tableTypes?.includes('main')).length}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">
            {isGerman ? 'Terrasse' : 'Terrace'}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {slots.filter(s => s.metadata?.tableTypes?.includes('terrace')).length}
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <Star className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-xs text-gray-600">
            {isGerman ? 'Premium' : 'Premium'}
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {slots.filter(s => s.metadata?.tableTypes?.includes('window')).length}
          </p>
        </div>
      </div>

      {/* Time Periods */}
      {renderPeriod(
        isGerman ? 'Frühstück' : 'Breakfast',
        groupedSlots.breakfast,
        <span className="text-2xl">☕</span>,
        'bg-yellow-50'
      )}
      {renderPeriod(
        isGerman ? 'Mittagessen' : 'Lunch',
        groupedSlots.lunch,
        <span className="text-2xl">🍽️</span>,
        'bg-blue-50'
      )}
      {renderPeriod(
        isGerman ? 'Abendessen' : 'Dinner',
        groupedSlots.dinner,
        <span className="text-2xl">🍷</span>,
        'bg-purple-50'
      )}
    </div>
  );
};

export default RestaurantTimeSlots;