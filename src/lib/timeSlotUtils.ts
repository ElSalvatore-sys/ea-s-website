// Time Slot Utility Functions
import { addMinutes, format, parse, isAfter, isBefore, isEqual } from 'date-fns';
import { de } from 'date-fns/locale';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  capacity?: number;
  metadata?: {
    tables?: number;
    tableTypes?: string[];
    doctor?: string;
    room?: string;
    stylist?: string;
    bay?: string;
    expressLane?: boolean;
    loanerAvailable?: boolean;
    specialNote?: string;
    isEmergency?: boolean;
    isPopular?: boolean;
    isLastAvailable?: boolean;
  };
}

export interface SlotConfiguration {
  startTime: string;
  endTime: string;
  slotDuration: number; // in minutes
  bufferTime?: number; // in minutes
  lunchBreak?: { start: string; end: string };
  excludeWeekends?: boolean;
  specialSlots?: TimeSlot[];
}

// Generate time slots based on configuration
export const generateTimeSlots = (
  config: SlotConfiguration,
  date: Date,
  industryType: string
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = parse(config.startTime, 'HH:mm', date);
  const endTime = parse(config.endTime, 'HH:mm', date);
  let currentTime = startTime;

  while (isBefore(currentTime, endTime) || isEqual(currentTime, endTime)) {
    const timeString = format(currentTime, 'HH:mm');

    // Check if slot is in lunch break
    if (config.lunchBreak) {
      const lunchStart = parse(config.lunchBreak.start, 'HH:mm', date);
      const lunchEnd = parse(config.lunchBreak.end, 'HH:mm', date);

      if (!isBefore(currentTime, lunchStart) && isBefore(currentTime, lunchEnd)) {
        currentTime = addMinutes(currentTime, config.slotDuration);
        continue;
      }
    }

    // Create slot based on industry type
    const slot = createIndustrySlot(timeString, industryType, currentTime);
    slots.push(slot);

    currentTime = addMinutes(currentTime, config.slotDuration + (config.bufferTime || 0));
  }

  // Add special slots if any
  if (config.specialSlots) {
    slots.push(...config.specialSlots);
  }

  return slots;
};

// Create industry-specific slot with metadata
const createIndustrySlot = (time: string, industryType: string, dateTime: Date): TimeSlot => {
  const baseSlot: TimeSlot = {
    id: `slot-${time.replace(':', '')}`,
    time,
    available: Math.random() > 0.3, // Simulated availability
  };

  switch (industryType) {
    case 'restaurant':
      return {
        ...baseSlot,
        capacity: Math.floor(Math.random() * 5) + 1,
        metadata: {
          tables: Math.floor(Math.random() * 5) + 1,
          tableTypes: ['window', 'terrace', 'main'].filter(() => Math.random() > 0.5),
          isPopular: time >= '19:00' && time <= '21:00',
          isLastAvailable: baseSlot.available && Math.random() > 0.8,
          specialNote: time >= '20:00' ? 'Live music tonight' : undefined,
        }
      };

    case 'medical':
      const doctors = ['Dr. Schmidt', 'Dr. Müller', 'Dr. Weber', 'Dr. Fischer'];
      const rooms = ['Room 101', 'Room 102', 'Room 103', 'Emergency'];
      return {
        ...baseSlot,
        metadata: {
          doctor: doctors[Math.floor(Math.random() * doctors.length)],
          room: rooms[Math.floor(Math.random() * rooms.length)],
          isEmergency: Math.random() > 0.9,
        }
      };

    case 'salon':
      const stylists = ['Anna', 'Maria', 'Sophie', 'Lisa'];
      return {
        ...baseSlot,
        metadata: {
          stylist: stylists[Math.floor(Math.random() * stylists.length)],
          expressLane: Math.random() > 0.7,
        }
      };

    case 'automotive':
      return {
        ...baseSlot,
        metadata: {
          bay: `Bay ${Math.floor(Math.random() * 4) + 1}`,
          expressLane: Math.random() > 0.8,
          loanerAvailable: Math.random() > 0.5,
        }
      };

    default:
      return baseSlot;
  }
};

// Calculate slot duration blocks
export const calculateDurationBlocks = (
  startSlot: TimeSlot,
  serviceDuration: number,
  allSlots: TimeSlot[]
): TimeSlot[] => {
  const startIndex = allSlots.findIndex(s => s.id === startSlot.id);
  if (startIndex === -1) return [];

  const slotsNeeded = Math.ceil(serviceDuration / 30); // Assuming 30-min slots
  const blockedSlots: TimeSlot[] = [];

  for (let i = 0; i < slotsNeeded && startIndex + i < allSlots.length; i++) {
    blockedSlots.push(allSlots[startIndex + i]);
  }

  return blockedSlots;
};

// Get smart suggestions based on preferences
export const getSmartSuggestions = (
  slots: TimeSlot[],
  preferences: {
    preferredTime?: 'morning' | 'afternoon' | 'evening';
    preferredStylist?: string;
    preferredDoctor?: string;
    expressOnly?: boolean;
  }
): TimeSlot[] => {
  let suggestions = slots.filter(s => s.available);

  if (preferences.preferredTime) {
    suggestions = suggestions.filter(s => {
      const hour = parseInt(s.time.split(':')[0]);
      switch (preferences.preferredTime) {
        case 'morning': return hour >= 6 && hour < 12;
        case 'afternoon': return hour >= 12 && hour < 17;
        case 'evening': return hour >= 17 && hour <= 22;
        default: return true;
      }
    });
  }

  if (preferences.preferredStylist) {
    suggestions = suggestions.filter(s =>
      s.metadata?.stylist === preferences.preferredStylist
    );
  }

  if (preferences.preferredDoctor) {
    suggestions = suggestions.filter(s =>
      s.metadata?.doctor === preferences.preferredDoctor
    );
  }

  if (preferences.expressOnly) {
    suggestions = suggestions.filter(s => s.metadata?.expressLane);
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

// Format slot display based on industry
export const formatSlotDisplay = (
  slot: TimeSlot,
  industryType: string,
  locale: 'en' | 'de' = 'en'
): string => {
  const baseFormat = slot.time;

  switch (industryType) {
    case 'restaurant':
      if (slot.metadata?.tables) {
        return locale === 'de'
          ? `${baseFormat} - ${slot.metadata.tables} Tische verfügbar`
          : `${baseFormat} - ${slot.metadata.tables} tables available`;
      }
      break;

    case 'medical':
      if (slot.metadata?.doctor) {
        return `${baseFormat} - ${slot.metadata.doctor}`;
      }
      break;

    case 'salon':
      if (slot.metadata?.stylist) {
        return `${baseFormat} - ${slot.metadata.stylist}`;
      }
      break;

    case 'automotive':
      if (slot.metadata?.bay) {
        return `${baseFormat} - ${slot.metadata.bay}`;
      }
      break;
  }

  return baseFormat;
};

// Check if slot overlaps with existing bookings
export const isSlotAvailable = (
  slot: TimeSlot,
  existingBookings: Array<{ start: string; end: string }>,
  serviceDuration: number
): boolean => {
  const slotStart = parse(slot.time, 'HH:mm', new Date());
  const slotEnd = addMinutes(slotStart, serviceDuration);

  return !existingBookings.some(booking => {
    const bookingStart = parse(booking.start, 'HH:mm', new Date());
    const bookingEnd = parse(booking.end, 'HH:mm', new Date());

    return (
      (isAfter(slotStart, bookingStart) && isBefore(slotStart, bookingEnd)) ||
      (isAfter(slotEnd, bookingStart) && isBefore(slotEnd, bookingEnd)) ||
      (isBefore(slotStart, bookingStart) && isAfter(slotEnd, bookingEnd))
    );
  });
};

// Get availability score for visual indicators
export const getAvailabilityScore = (availableSlots: number, totalSlots: number): {
  score: 'high' | 'medium' | 'low';
  percentage: number;
} => {
  const percentage = (availableSlots / totalSlots) * 100;

  if (percentage > 60) return { score: 'high', percentage };
  if (percentage > 30) return { score: 'medium', percentage };
  return { score: 'low', percentage };
};

// Format duration for display
export const formatDuration = (minutes: number, locale: 'en' | 'de' = 'en'): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (locale === 'de') {
    if (hours > 0 && mins > 0) return `${hours} Std. ${mins} Min.`;
    if (hours > 0) return `${hours} Stunde${hours > 1 ? 'n' : ''}`;
    return `${mins} Minuten`;
  }

  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${mins} minutes`;
};