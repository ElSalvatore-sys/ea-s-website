// Practitioner Availability Utility Functions
import { addDays, format, isAfter, isBefore, isToday, isTomorrow, startOfDay, addMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Staff, ShiftTime, WeekSchedule } from './demoStaffData';
import type { Shift } from './staffScheduleUtils';
import { timeToMinutes, isStaffAvailableAtTime } from './staffScheduleUtils';

export interface AvailableSlot {
  date: Date;
  time: string;
  practitionerId: string;
  practitionerName: string;
  isToday: boolean;
  isTomorrow: boolean;
  formattedDate: string;
  formattedTime: string;
}

export interface PractitionerAvailability {
  practitioner: Staff;
  nextAvailableSlots: AvailableSlot[];
  isAvailableNow: boolean;
  isAvailableToday: boolean;
  isFullyBooked: boolean;
  nextAvailableDate: Date | null;
  totalAvailableSlots: number;
}

// Get the next N available slots for a practitioner
export const getNextAvailableSlots = (
  practitioner: Staff,
  fromDate: Date,
  numberOfSlots: number = 3,
  serviceDuration: number = 30,
  existingBookings: Shift[] = [],
  locale: 'en' | 'de' = 'en'
): AvailableSlot[] => {
  const availableSlots: AvailableSlot[] = [];
  const maxDaysToCheck = 14; // Check up to 2 weeks ahead

  for (let dayOffset = 0; dayOffset < maxDaysToCheck && availableSlots.length < numberOfSlots; dayOffset++) {
    const checkDate = addDays(fromDate, dayOffset);
    const dayName = format(checkDate, 'EEEE').toLowerCase() as keyof WeekSchedule;
    const daySchedule = practitioner.defaultSchedule[dayName];

    if (!daySchedule || daySchedule.length === 0) continue;

    // Get all time slots for this day
    const daySlots = generateDayTimeSlots(
      checkDate,
      daySchedule,
      serviceDuration,
      existingBookings.filter(b =>
        b.staffId === practitioner.id &&
        b.date.toDateString() === checkDate.toDateString()
      )
    );

    // Add available slots
    for (const slot of daySlots) {
      if (availableSlots.length >= numberOfSlots) break;

      // Skip past times for today
      if (dayOffset === 0) {
        const slotTime = new Date(checkDate);
        const [hours, minutes] = slot.split(':').map(Number);
        slotTime.setHours(hours, minutes, 0, 0);
        if (isBefore(slotTime, new Date())) continue;
      }

      availableSlots.push({
        date: checkDate,
        time: slot,
        practitionerId: practitioner.id,
        practitionerName: practitioner.name,
        isToday: isToday(checkDate),
        isTomorrow: isTomorrow(checkDate),
        formattedDate: formatSlotDate(checkDate, locale),
        formattedTime: slot
      });
    }
  }

  return availableSlots;
};

// Generate time slots for a specific day
const generateDayTimeSlots = (
  date: Date,
  shifts: ShiftTime[],
  slotDuration: number,
  existingBookings: Shift[]
): string[] => {
  const slots: string[] = [];

  for (const shift of shifts) {
    const startMinutes = timeToMinutes(shift.start);
    const endMinutes = timeToMinutes(shift.end);
    const breakStartMinutes = shift.breakStart ? timeToMinutes(shift.breakStart) : null;
    const breakEndMinutes = shift.breakEnd ? timeToMinutes(shift.breakEnd) : null;

    for (let time = startMinutes; time < endMinutes; time += slotDuration) {
      // Skip break times
      if (breakStartMinutes && breakEndMinutes) {
        if (time >= breakStartMinutes && time < breakEndMinutes) continue;
      }

      const timeStr = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`;

      // Check if slot is already booked
      const isBooked = existingBookings.some(booking => {
        const bookingStart = timeToMinutes(booking.start);
        const bookingEnd = timeToMinutes(booking.end);
        return time >= bookingStart && time < bookingEnd;
      });

      // Check max bookings limit
      const concurrentBookings = existingBookings.filter(booking => {
        const bookingStart = timeToMinutes(booking.start);
        const bookingEnd = timeToMinutes(booking.end);
        return time >= bookingStart && time < bookingEnd;
      }).length;

      if (!isBooked && concurrentBookings < (shift.maxBookings || 1)) {
        slots.push(timeStr);
      }
    }
  }

  return slots;
};

// Format slot date for display
const formatSlotDate = (date: Date, locale: 'en' | 'de'): string => {
  if (isToday(date)) {
    return locale === 'de' ? 'Heute' : 'Today';
  }
  if (isTomorrow(date)) {
    return locale === 'de' ? 'Morgen' : 'Tomorrow';
  }
  return format(date, 'EEE, MMM d', { locale: locale === 'de' ? de : undefined });
};

// Check if practitioner is available now
export const isPractitionerAvailableNow = (
  practitioner: Staff,
  existingBookings: Shift[] = []
): boolean => {
  const now = new Date();
  const dayName = format(now, 'EEEE').toLowerCase() as keyof WeekSchedule;
  const currentTime = format(now, 'HH:mm');

  return isStaffAvailableAtTime(
    practitioner.id,
    dayName,
    currentTime,
    existingBookings
  );
};

// Get practitioner availability summary
export const getPractitionerAvailability = (
  practitioner: Staff,
  fromDate: Date = new Date(),
  serviceDuration: number = 30,
  existingBookings: Shift[] = [],
  locale: 'en' | 'de' = 'en'
): PractitionerAvailability => {
  const nextSlots = getNextAvailableSlots(
    practitioner,
    fromDate,
    5, // Get up to 5 slots for analysis
    serviceDuration,
    existingBookings,
    locale
  );

  const isAvailableNow = isPractitionerAvailableNow(practitioner, existingBookings);
  const todaySlots = nextSlots.filter(s => s.isToday);
  const isAvailableToday = todaySlots.length > 0;
  const isFullyBooked = nextSlots.length === 0;
  const nextAvailableDate = nextSlots.length > 0 ? nextSlots[0].date : null;

  return {
    practitioner,
    nextAvailableSlots: nextSlots.slice(0, 3), // Return only first 3
    isAvailableNow,
    isAvailableToday,
    isFullyBooked,
    nextAvailableDate,
    totalAvailableSlots: nextSlots.length
  };
};

// Filter practitioners by availability
export const filterPractitionersByAvailability = (
  practitioners: Staff[],
  filterType: 'all' | 'today' | 'tomorrow' | 'week',
  serviceDuration: number = 30,
  existingBookings: Shift[] = []
): Staff[] => {
  if (filterType === 'all') return practitioners;

  return practitioners.filter(practitioner => {
    const availability = getPractitionerAvailability(
      practitioner,
      new Date(),
      serviceDuration,
      existingBookings
    );

    switch (filterType) {
      case 'today':
        return availability.isAvailableToday;
      case 'tomorrow':
        return availability.nextAvailableSlots.some(s => s.isTomorrow);
      case 'week':
        return !availability.isFullyBooked && availability.nextAvailableSlots.length > 0;
      default:
        return true;
    }
  });
};

// Sort practitioners by criteria
export const sortPractitioners = (
  practitioners: PractitionerAvailability[],
  sortBy: 'rating' | 'experience' | 'availability' | 'name'
): PractitionerAvailability[] => {
  const sorted = [...practitioners];

  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.practitioner.rating - a.practitioner.rating);
    case 'experience':
      return sorted.sort((a, b) => b.practitioner.bookingCount - a.practitioner.bookingCount);
    case 'availability':
      return sorted.sort((a, b) => {
        // Prioritize available now
        if (a.isAvailableNow && !b.isAvailableNow) return -1;
        if (!a.isAvailableNow && b.isAvailableNow) return 1;
        // Then by soonest available
        if (a.nextAvailableDate && b.nextAvailableDate) {
          return a.nextAvailableDate.getTime() - b.nextAvailableDate.getTime();
        }
        if (a.nextAvailableDate && !b.nextAvailableDate) return -1;
        if (!a.nextAvailableDate && b.nextAvailableDate) return 1;
        return 0;
      });
    case 'name':
      return sorted.sort((a, b) => a.practitioner.name.localeCompare(b.practitioner.name));
    default:
      return sorted;
  }
};

// Get practitioner's working days
export const getPractitionerWorkingDays = (practitioner: Staff): string[] => {
  const workingDays: string[] = [];
  const days: (keyof WeekSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  days.forEach(day => {
    if (practitioner.defaultSchedule[day].length > 0) {
      workingDays.push(day);
    }
  });

  return workingDays;
};

// Calculate estimated wait time
export const calculateWaitTime = (
  nextAvailableSlot: AvailableSlot | null
): { minutes: number; formatted: string } => {
  if (!nextAvailableSlot) {
    return { minutes: -1, formatted: 'No availability' };
  }

  const now = new Date();
  const slotTime = new Date(nextAvailableSlot.date);
  const [hours, minutes] = nextAvailableSlot.time.split(':').map(Number);
  slotTime.setHours(hours, minutes, 0, 0);

  const diffMinutes = Math.floor((slotTime.getTime() - now.getTime()) / (1000 * 60));

  if (diffMinutes <= 0) {
    return { minutes: 0, formatted: 'Available now' };
  }

  if (diffMinutes < 60) {
    return { minutes: diffMinutes, formatted: `${diffMinutes} min wait` };
  }

  const hours2 = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  if (hours2 < 24) {
    return {
      minutes: diffMinutes,
      formatted: mins > 0 ? `${hours2}h ${mins}m wait` : `${hours2}h wait`
    };
  }

  const days = Math.floor(hours2 / 24);
  return {
    minutes: diffMinutes,
    formatted: days === 1 ? 'Tomorrow' : `In ${days} days`
  };
};

// Check if practitioner works on a specific day
export const doesPractitionerWorkOn = (
  practitioner: Staff,
  dayName: keyof WeekSchedule
): boolean => {
  return practitioner.defaultSchedule[dayName].length > 0;
};

// Get practitioner's specialties that match a service
export const getMatchingSpecialties = (
  practitioner: Staff,
  serviceKeywords: string[]
): string[] => {
  return practitioner.specialties.filter(specialty =>
    serviceKeywords.some(keyword =>
      specialty.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};