// Medical Time Slot Selection Component
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, User, MapPin, AlertTriangle, Coffee, Sun, Cloud,
  Activity, Shield, Calendar, ChevronRight
} from 'lucide-react';
import { TimeSlot } from '../../lib/timeSlotUtils';
import { useTranslation } from 'react-i18next';

interface MedicalTimeSlotsProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  visitType?: 'first' | 'followup';
  loading?: boolean;
  error?: Error | null;
}

const MedicalTimeSlots: React.FC<MedicalTimeSlotsProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  visitType = 'first',
  loading = false,
  error = null
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [expandedPeriod, setExpandedPeriod] = useState<string>('morning');

  // Group slots by time periods
  const groupedSlots = useMemo(() => {
    const groups = {
      morning: [] as TimeSlot[],
      afternoon: [] as TimeSlot[],
      emergency: [] as TimeSlot[]
    };

    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);

      // Check for emergency slots first
      if (slot.metadata?.isEmergency) {
        groups.emergency.push(slot);
      } else if (hour >= 8 && hour < 12) {
        groups.morning.push(slot);
      } else if (hour >= 13 && hour < 18) {
        groups.afternoon.push(slot);
      }
    });

    return groups;
  }, [slots]);

  // Check if slot is in lunch break
  const isLunchBreak = (time: string): boolean => {
    const hour = parseInt(time.split(':')[0]);
    const minute = parseInt(time.split(':')[1]);
    return hour === 12 || (hour === 13 && minute === 0);
  };

  // Get doctor specialty icon
  const getDoctorIcon = (doctor: string): JSX.Element => {
    if (doctor?.includes('Schmidt')) return <span>👨‍⚕️</span>;
    if (doctor?.includes('Müller')) return <span>👩‍⚕️</span>;
    if (doctor?.includes('Weber')) return <span>👨‍⚕️</span>;
    if (doctor?.includes('Fischer')) return <span>👩‍⚕️</span>;
    return <User className="w-4 h-4" />;
  };

  // Get room type color
  const getRoomColor = (room: string): string => {
    if (room?.includes('Emergency')) return 'text-red-600 bg-red-50';
    if (room?.includes('101')) return 'text-blue-600 bg-blue-50';
    if (room?.includes('102')) return 'text-green-600 bg-green-50';
    if (room?.includes('103')) return 'text-purple-600 bg-purple-50';
    return 'text-gray-600 bg-gray-50';
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedSlot?.id === slot.id;
    const isEmergency = slot.metadata?.isEmergency;
    const hasBuffer = visitType === 'first'; // First visits need buffer time

    return (
      <motion.div
        key={slot.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={slot.available ? { x: 5 } : {}}
        className="relative"
      >
        <button
          onClick={() => slot.available && onSelectSlot(slot)}
          disabled={!slot.available}
          className={`
            relative w-full text-left transition-all duration-200
            ${isSelected
              ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md'
              : slot.available
              ? 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-300'
              : 'opacity-50 cursor-not-allowed border-l-4 border-transparent'
            }
            ${isEmergency ? 'bg-red-50' : ''}
          `}
        >
          <div className="p-4 flex items-center justify-between">
            {/* Time and Doctor Info */}
            <div className="flex items-start gap-4">
              {/* Time Column */}
              <div className="text-center min-w-[60px]">
                <div className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {slot.time}
                </div>
                {hasBuffer && (
                  <div className="text-xs text-gray-500 mt-1">
                    +15 min
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-12 bg-gray-200" />

              {/* Doctor and Room Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getDoctorIcon(slot.metadata?.doctor || '')}
                  <span className="font-medium text-gray-900">
                    {slot.metadata?.doctor || 'Available Doctor'}
                  </span>
                  {isEmergency && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                      {isGerman ? 'NOTFALL' : 'EMERGENCY'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className={`px-2 py-1 rounded-md ${getRoomColor(slot.metadata?.room || '')}`}>
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {slot.metadata?.room || 'Consultation Room'}
                  </span>
                  {visitType === 'first' && (
                    <span className="text-gray-500">
                      {isGerman ? 'Erstbesuch' : 'First Visit'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              {slot.available ? (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500 mt-1">
                    {isGerman ? 'Frei' : 'Free'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span className="text-xs text-gray-500 mt-1">
                    {isGerman ? 'Belegt' : 'Booked'}
                  </span>
                </div>
              )}
              <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Buffer Time Indicator */}
          {hasBuffer && slot.available && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {isGerman
                  ? 'Inkl. 15 Min. Pufferzeit für Erstgespräch'
                  : 'Incl. 15 min buffer for initial consultation'}
              </div>
            </div>
          )}
        </button>

        {/* Visual Buffer Time */}
        {hasBuffer && slot.available && (
          <div className="h-2 bg-gradient-to-b from-gray-100 to-transparent" />
        )}
      </motion.div>
    );
  };

  const renderLunchBreak = () => (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-dashed border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-4 bg-white text-gray-500 flex items-center gap-2">
          <Coffee className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isGerman ? 'Mittagspause (12:00 - 13:00)' : 'Lunch Break (12:00 - 13:00)'}
          </span>
        </span>
      </div>
    </div>
  );

  const renderPeriod = (
    title: string,
    periodKey: string,
    slots: TimeSlot[],
    icon: JSX.Element,
    bgColor: string,
    isEmergencySection: boolean = false
  ) => {
    if (slots.length === 0) return null;

    const availableSlots = slots.filter(s => s.available);
    const isExpanded = expandedPeriod === periodKey || isEmergencySection;

    return (
      <div className={`mb-4 ${isEmergencySection ? 'border-2 border-red-200 rounded-xl p-4 bg-red-50' : ''}`}>
        <button
          onClick={() => !isEmergencySection && setExpandedPeriod(isExpanded ? '' : periodKey)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {availableSlots.length} {isGerman ? 'Termine verfügbar' : 'appointments available'}
              </p>
            </div>
          </div>
          {!isEmergencySection && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-1">
                {slots.map(renderTimeSlot)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
        <p className="text-gray-600">
          {isGerman ? 'Termine werden geladen...' : 'Loading appointments...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">
          {isGerman ? 'Fehler beim Laden der Termine' : 'Error loading appointments'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              {visitType === 'first'
                ? isGerman ? 'Erstbesuch' : 'First Visit'
                : isGerman ? 'Nachuntersuchung' : 'Follow-up'}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {visitType === 'first'
                ? isGerman
                  ? 'Bitte planen Sie 60 Minuten für die vollständige Untersuchung ein'
                  : 'Please allow 60 minutes for complete examination'
                : isGerman
                ? 'Standardtermin: 30 Minuten'
                : 'Standard appointment: 30 minutes'}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Slots */}
      {groupedSlots.emergency.length > 0 && (
        renderPeriod(
          isGerman ? 'Notfalltermine' : 'Emergency Slots',
          'emergency',
          groupedSlots.emergency,
          <AlertTriangle className="w-5 h-5 text-red-600" />,
          'bg-red-50',
          true
        )
      )}

      {/* Morning Slots */}
      {renderPeriod(
        isGerman ? 'Vormittag' : 'Morning',
        'morning',
        groupedSlots.morning,
        <Sun className="w-5 h-5 text-yellow-500" />,
        'bg-yellow-50'
      )}

      {/* Lunch Break Divider */}
      {groupedSlots.morning.length > 0 && groupedSlots.afternoon.length > 0 && renderLunchBreak()}

      {/* Afternoon Slots */}
      {renderPeriod(
        isGerman ? 'Nachmittag' : 'Afternoon',
        'afternoon',
        groupedSlots.afternoon,
        <Cloud className="w-5 h-5 text-blue-500" />,
        'bg-blue-50'
      )}

      {/* Doctor Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          {isGerman ? 'Unsere Ärzte' : 'Our Doctors'}
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span>👨‍⚕️</span>
            <span>Dr. Schmidt - {isGerman ? 'Allgemeinmedizin' : 'General Practice'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👩‍⚕️</span>
            <span>Dr. Müller - {isGerman ? 'Innere Medizin' : 'Internal Medicine'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👨‍⚕️</span>
            <span>Dr. Weber - {isGerman ? 'Kardiologie' : 'Cardiology'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👩‍⚕️</span>
            <span>Dr. Fischer - {isGerman ? 'Neurologie' : 'Neurology'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalTimeSlots;