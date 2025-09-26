// Salon Time Slot Selection Component with Timeline View
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, User, Scissors, Zap, Star, Sparkles, Award,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { TimeSlot, calculateDurationBlocks } from '../../lib/timeSlotUtils';
import { useTranslation } from 'react-i18next';

interface SalonTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlots: TimeSlot[];
  onSelectSlots: (slots: TimeSlot[]) => void;
  serviceDuration: number; // in minutes
  preferredStylist?: string;
  loading?: boolean;
  error?: Error | null;
}

const SalonTimeSlots: React.FC<SalonTimeSlotsProps> = ({
  slots,
  selectedSlots,
  onSelectSlots,
  serviceDuration = 60,
  preferredStylist,
  loading = false,
  error = null
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [selectedStylist, setSelectedStylist] = useState<string>(preferredStylist || 'all');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null);
  const [hoveredSlots, setHoveredSlots] = useState<TimeSlot[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get unique stylists
  const stylists = useMemo(() => {
    const uniqueStylists = new Set<string>();
    slots.forEach(slot => {
      if (slot.metadata?.stylist) {
        uniqueStylists.add(slot.metadata.stylist);
      }
    });
    return Array.from(uniqueStylists);
  }, [slots]);

  // Stylist colors
  const stylistColors: Record<string, string> = {
    'Anna': 'bg-pink-500',
    'Maria': 'bg-purple-500',
    'Sophie': 'bg-blue-500',
    'Lisa': 'bg-green-500'
  };

  // Filter slots by selected stylist
  const filteredSlots = useMemo(() => {
    if (selectedStylist === 'all') return slots;
    return slots.filter(slot => slot.metadata?.stylist === selectedStylist);
  }, [slots, selectedStylist]);

  // Group slots by stylist for timeline view
  const timelineData = useMemo(() => {
    const timeline: Record<string, TimeSlot[]> = {};

    stylists.forEach(stylist => {
      timeline[stylist] = slots.filter(s => s.metadata?.stylist === stylist);
    });

    return timeline;
  }, [slots, stylists]);

  // Calculate how many slots are needed for the service
  const slotsNeeded = Math.ceil(serviceDuration / 30); // Assuming 30-min slots

  // Handle drag selection
  const handleDragStart = (slot: TimeSlot) => {
    if (!slot.available) return;
    setIsDragging(true);
    setDragStart(slot);

    const blocks = calculateDurationBlocks(slot, serviceDuration, filteredSlots);
    setHoveredSlots(blocks);
  };

  const handleDragEnd = () => {
    if (dragStart && hoveredSlots.length > 0) {
      // Check if all hovered slots are available
      const allAvailable = hoveredSlots.every(s => s.available);
      if (allAvailable) {
        onSelectSlots(hoveredSlots);
      }
    }
    setIsDragging(false);
    setDragStart(null);
    setHoveredSlots([]);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;

    const blocks = calculateDurationBlocks(slot, serviceDuration, filteredSlots);
    const allAvailable = blocks.every(s => s.available);

    if (allAvailable) {
      onSelectSlots(blocks);
    }
  };

  const isSlotSelected = (slot: TimeSlot): boolean => {
    return selectedSlots.some(s => s.id === slot.id);
  };

  const isSlotHovered = (slot: TimeSlot): boolean => {
    return hoveredSlots.some(s => s.id === slot.id);
  };

  // Render a single time slot in the timeline
  const renderTimelineSlot = (slot: TimeSlot, stylist: string) => {
    const isSelected = isSlotSelected(slot);
    const isHovered = isSlotHovered(slot);
    const isExpress = slot.metadata?.expressLane;
    const isFirst = hoveredSlots[0]?.id === slot.id;
    const isLast = hoveredSlots[hoveredSlots.length - 1]?.id === slot.id;

    return (
      <motion.div
        key={slot.id}
        onMouseDown={() => handleDragStart(slot)}
        onMouseEnter={() => {
          if (isDragging) {
            const blocks = calculateDurationBlocks(slot, serviceDuration, filteredSlots);
            setHoveredSlots(blocks);
          }
        }}
        onClick={() => !isDragging && handleSlotClick(slot)}
        className={`
          relative h-16 border-r border-gray-200 cursor-pointer transition-all duration-200
          ${isSelected ? stylistColors[stylist] + ' opacity-90' : ''}
          ${isHovered && !isSelected ? stylistColors[stylist] + ' opacity-50' : ''}
          ${!slot.available && !isSelected ? 'bg-gray-100' : ''}
          ${slot.available && !isSelected && !isHovered ? 'bg-white hover:bg-gray-50' : ''}
          ${isFirst ? 'rounded-l-lg' : ''}
          ${isLast ? 'rounded-r-lg' : ''}
        `}
        style={{ minWidth: '80px' }}
      >
        {/* Time Label */}
        <div className="absolute top-0 left-0 text-xs text-gray-500 p-1">
          {slot.time}
        </div>

        {/* Express Badge */}
        {isExpress && slot.available && (
          <div className="absolute top-1 right-1">
            <Zap className="w-3 h-3 text-yellow-500" />
          </div>
        )}

        {/* Availability Indicator */}
        {!slot.available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-gray-300" />
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Duration Connector */}
        {isHovered && !isLast && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-current" />
        )}
      </motion.div>
    );
  };

  // Render stylist timeline row
  const renderStylistRow = (stylist: string) => {
    const stylistSlots = timelineData[stylist] || [];
    const colorClass = stylistColors[stylist] || 'bg-gray-500';

    return (
      <div key={stylist} className="mb-4">
        {/* Stylist Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold`}>
            {stylist[0]}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{stylist}</h4>
            <p className="text-xs text-gray-500">
              {stylistSlots.filter(s => s.available).length} {isGerman ? 'verfügbar' : 'available'}
            </p>
          </div>
          {preferredStylist === stylist && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
              <Award className="w-3 h-3" />
              {isGerman ? 'Bevorzugt' : 'Preferred'}
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-2" onMouseUp={handleDragEnd}>
            {stylistSlots.map(slot => renderTimelineSlot(slot, stylist))}
          </div>
        </div>
      </div>
    );
  };

  // Render express slots
  const renderExpressSlots = () => {
    const expressSlots = filteredSlots.filter(s => s.metadata?.expressLane && s.available);

    if (expressSlots.length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">
            {isGerman ? 'Express-Service' : 'Express Service'}
          </h3>
          <span className="text-sm text-gray-500">
            ({isGerman ? 'Schnelle Services bis 30 Min.' : 'Quick services up to 30 min'})
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {expressSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              className={`
                p-2 rounded-lg text-sm font-medium transition-all
                ${isSlotSelected(slot)
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white hover:bg-yellow-100 text-gray-700 border border-yellow-300'
                }
              `}
            >
              <div>{slot.time}</div>
              <div className="text-xs opacity-75">{slot.metadata?.stylist}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render stylist filter
  const renderStylistFilter = () => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {isGerman ? 'Stylist wählen' : 'Select Stylist'}
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStylist('all')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${selectedStylist === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          {isGerman ? 'Alle' : 'All'}
        </button>
        {stylists.map(stylist => (
          <button
            key={stylist}
            onClick={() => setSelectedStylist(stylist)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${selectedStylist === stylist
                ? `${stylistColors[stylist]} text-white`
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className={`w-3 h-3 rounded-full ${stylistColors[stylist]}`} />
            {stylist}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
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
      {/* Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="text-sm text-purple-900 font-medium">
              {isGerman ? 'Service-Dauer' : 'Service Duration'}: {serviceDuration} {isGerman ? 'Minuten' : 'minutes'}
            </p>
            <p className="text-xs text-purple-700 mt-1">
              {slotsNeeded > 1
                ? isGerman
                  ? `Wählen Sie ${slotsNeeded} aufeinanderfolgende Zeitfenster oder ziehen Sie über die Timeline`
                  : `Select ${slotsNeeded} consecutive time slots or drag across the timeline`
                : isGerman
                ? 'Klicken Sie auf einen verfügbaren Zeitslot'
                : 'Click on an available time slot'}
            </p>
          </div>
        </div>
      </div>

      {/* Express Slots */}
      {serviceDuration <= 30 && renderExpressSlots()}

      {/* Stylist Filter */}
      {renderStylistFilter()}

      {/* Timeline View */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isGerman ? 'Stylist-Zeitplan' : 'Stylist Schedule'}
        </h3>

        {selectedStylist === 'all' ? (
          <div ref={timelineRef}>
            {stylists.map(renderStylistRow)}
          </div>
        ) : (
          <div ref={timelineRef}>
            {renderStylistRow(selectedStylist)}
          </div>
        )}
      </div>

      {/* Selected Time Summary */}
      {selectedSlots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-900">
                {isGerman ? 'Ausgewählte Zeit' : 'Selected Time'}
              </p>
              <p className="text-sm text-green-700">
                {selectedSlots[0].time} - {
                  selectedSlots[selectedSlots.length - 1]?.time || selectedSlots[0].time
                } ({selectedSlots[0].metadata?.stylist})
              </p>
            </div>
            <button
              onClick={() => onSelectSlots([])}
              className="text-sm text-green-600 hover:text-green-700 underline"
            >
              {isGerman ? 'Ändern' : 'Change'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Recommended Badge Info */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span>{isGerman ? 'Express verfügbar' : 'Express available'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3 text-purple-500" />
          <span>{isGerman ? 'Empfohlen' : 'Recommended'}</span>
        </div>
      </div>
    </div>
  );
};

export default SalonTimeSlots;