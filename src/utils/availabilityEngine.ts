// Real-Time Availability Calculation Engine
import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  endOfDay,
  addDays,
  differenceInMinutes,
  isSameDay,
  parseISO
} from 'date-fns';
import { de } from 'date-fns/locale';
import type { Staff, ShiftTime, WeekSchedule } from '../lib/demoStaffData';
import type { Shift } from '../lib/staffScheduleUtils';
import { timeToMinutes, minutesToTime } from '../lib/staffScheduleUtils';
import { isGermanHoliday, isMittagspause } from './germanHolidays';
import { AvailabilityCache } from './availabilityCache';

// Types
export interface TimeSlot {
  practitionerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
  capacity: number;
  currentBookings: number;
  metadata?: {
    isHoliday?: boolean;
    isMittagspause?: boolean;
    isOvertime?: boolean;
    isLastMinute?: boolean;
    demandLevel?: 'low' | 'medium' | 'high';
  };
}

export interface AvailabilityResult {
  practitionerId: string;
  date: Date;
  slots: TimeSlot[];
  totalAvailable: number;
  nextAvailable: TimeSlot | null;
  utilization: number; // Percentage of booked time
}

export interface BookingConflict {
  hasConflict: boolean;
  reason?: string;
  conflictingBookings?: Shift[];
  suggestions?: TimeSlot[];
}

export interface ScheduleOptimization {
  originalSchedule: TimeSlot[];
  optimizedSchedule: TimeSlot[];
  improvements: {
    gapReduction: number; // Minutes saved
    groupingBenefit: number; // Similar services grouped
    utilizationIncrease: number; // Percentage improvement
  };
  suggestions: string[];
}

export interface PractitionerMatch {
  practitioner: Staff;
  availability: TimeSlot[];
  matchScore: number; // 0-100
  reasons: string[];
}

// Demo bookings for testing
export const DEMO_BOOKINGS: Shift[] = [
  {
    id: 'demo-1',
    staffId: 'dr-schmidt',
    date: new Date('2025-09-15'),
    start: '09:00',
    end: '09:30',
    status: 'active'
  },
  {
    id: 'demo-2',
    staffId: 'dr-schmidt',
    date: new Date('2025-09-15'),
    start: '10:00',
    end: '10:45',
    status: 'active'
  },
  {
    id: 'demo-3',
    staffId: 'dr-mueller',
    date: new Date('2025-09-15'),
    start: '14:00',
    end: '14:30',
    status: 'active'
  },
  {
    id: 'demo-4',
    staffId: 'lisa-style',
    date: new Date('2025-09-15'),
    start: '11:00',
    end: '12:00',
    status: 'active'
  },
  {
    id: 'demo-5',
    staffId: 'lisa-style',
    date: new Date('2025-09-15'),
    start: '14:30',
    end: '16:00',
    status: 'active'
  },
  {
    id: 'demo-6',
    staffId: 'dr-weber',
    date: new Date('2025-09-16'),
    start: '11:30',
    end: '12:00',
    status: 'active'
  },
  {
    id: 'demo-7',
    staffId: 'marco-cuts',
    date: new Date('2025-09-16'),
    start: '09:30',
    end: '10:15',
    status: 'active'
  }
];

// Cache instance
const cache = new AvailabilityCache();

// Performance metrics
let calculationMetrics = {
  lastCalculationTime: 0,
  averageCalculationTime: 0,
  totalCalculations: 0,
  cacheHitRate: 0,
  cacheHits: 0,
  cacheMisses: 0
};

/**
 * Get complete practitioner availability for a specific date
 * Accounts for schedule, bookings, holidays, and special rules
 */
export function getPractitionerAvailability(
  practitioner: Staff,
  date: Date,
  existingBookings: Shift[] = [],
  slotDuration: number = 30,
  bufferTime: number = 0,
  includeHolidays: boolean = false,
  includeOvertime: boolean = false
): AvailabilityResult {
  const startTime = performance.now();

  // Check cache first
  const cacheKey = `availability:${practitioner.id}:${format(date, 'yyyy-MM-dd')}:${slotDuration}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    updateMetrics(performance.now() - startTime, true);
    return cached as AvailabilityResult;
  }

  const slots: TimeSlot[] = [];
  const dayName = format(date, 'EEEE').toLowerCase() as keyof WeekSchedule;
  const daySchedule = practitioner.defaultSchedule[dayName];

  // Check if it's a holiday
  const holiday = isGermanHoliday(date);
  if (holiday && !includeHolidays) {
    const result: AvailabilityResult = {
      practitionerId: practitioner.id,
      date,
      slots: [],
      totalAvailable: 0,
      nextAvailable: null,
      utilization: 0
    };
    cache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
    updateMetrics(performance.now() - startTime, false);
    return result;
  }

  // Get relevant bookings for this practitioner and date
  const dayBookings = existingBookings.filter(b =>
    b.staffId === practitioner.id &&
    isSameDay(b.date, date) &&
    b.status === 'active'
  );

  // Process each shift in the schedule
  daySchedule.forEach(shift => {
    const shiftSlots = generateSlotsForShift(
      practitioner.id,
      date,
      shift,
      dayBookings,
      slotDuration,
      bufferTime,
      holiday !== null
    );
    slots.push(...shiftSlots);
  });

  // Add overtime slots if enabled
  if (includeOvertime && daySchedule.length > 0) {
    const lastShift = daySchedule[daySchedule.length - 1];
    const overtimeSlots = generateOvertimeSlots(
      practitioner.id,
      date,
      lastShift,
      dayBookings,
      slotDuration
    );
    slots.push(...overtimeSlots);
  }

  // Calculate metrics
  const availableSlots = slots.filter(s => s.available);
  const totalMinutes = slots.length * slotDuration;
  const bookedMinutes = slots.filter(s => !s.available).length * slotDuration;
  const utilization = totalMinutes > 0 ? (bookedMinutes / totalMinutes) * 100 : 0;

  const result: AvailabilityResult = {
    practitionerId: practitioner.id,
    date,
    slots,
    totalAvailable: availableSlots.length,
    nextAvailable: availableSlots[0] || null,
    utilization: Math.round(utilization)
  };

  // Cache the result
  cache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
  updateMetrics(performance.now() - startTime, false);

  return result;
}

/**
 * Find the next available slot that fits the service duration
 */
export function getNextAvailableSlot(
  practitioner: Staff,
  serviceDuration: number,
  fromDateTime: Date = new Date(),
  maxDaysAhead: number = 14,
  existingBookings: Shift[] = [],
  bufferTime: number = 0
): TimeSlot | null {
  const startTime = performance.now();

  for (let day = 0; day < maxDaysAhead; day++) {
    const checkDate = addDays(startOfDay(fromDateTime), day);
    const availability = getPractitionerAvailability(
      practitioner,
      checkDate,
      existingBookings,
      30, // Use 30-minute base slots
      bufferTime
    );

    // For today, filter out past slots
    const validSlots = day === 0
      ? availability.slots.filter(slot => {
          const slotTime = new Date(checkDate);
          const [hours, minutes] = slot.startTime.split(':').map(Number);
          slotTime.setHours(hours, minutes, 0, 0);
          return isAfter(slotTime, fromDateTime);
        })
      : availability.slots;

    // Find consecutive available slots that fit the service
    const requiredSlots = Math.ceil(serviceDuration / 30);
    for (let i = 0; i <= validSlots.length - requiredSlots; i++) {
      let canFit = true;

      for (let j = 0; j < requiredSlots; j++) {
        if (!validSlots[i + j]?.available) {
          canFit = false;
          break;
        }
      }

      if (canFit) {
        // Create a combined slot
        const firstSlot = validSlots[i];
        const lastSlot = validSlots[i + requiredSlots - 1];

        updateMetrics(performance.now() - startTime, false);

        return {
          practitionerId: practitioner.id,
          date: checkDate,
          startTime: firstSlot.startTime,
          endTime: lastSlot.endTime,
          available: true,
          capacity: firstSlot.capacity,
          currentBookings: 0,
          metadata: firstSlot.metadata
        };
      }
    }
  }

  updateMetrics(performance.now() - startTime, false);
  return null;
}

/**
 * Find best matching practitioners when preferred is unavailable
 */
export function findBestMatch(
  serviceType: string,
  preferredTime: Date,
  serviceDuration: number,
  allPractitioners: Staff[],
  existingBookings: Shift[] = [],
  preferredPractitionerId?: string
): PractitionerMatch[] {
  const matches: PractitionerMatch[] = [];
  const targetHour = preferredTime.getHours();
  const targetDay = format(preferredTime, 'EEEE').toLowerCase() as keyof WeekSchedule;

  allPractitioners.forEach(practitioner => {
    // Skip if it's the unavailable preferred practitioner
    if (practitioner.id === preferredPractitionerId) return;

    // Check if practitioner has matching specialty
    const hasMatchingSpecialty = practitioner.specialties.some(s =>
      s.toLowerCase().includes(serviceType.toLowerCase())
    );

    if (!hasMatchingSpecialty) return;

    // Get availability for the target date
    const availability = getPractitionerAvailability(
      practitioner,
      preferredTime,
      existingBookings,
      30
    );

    // Calculate match score
    let matchScore = 0;
    const reasons: string[] = [];

    // Base score from rating and experience
    matchScore += practitioner.rating * 10; // Up to 50 points
    matchScore += Math.min(practitioner.bookingCount / 100, 20); // Up to 20 points

    // Check time proximity
    const availableNearTime = availability.slots.filter(slot => {
      const slotHour = parseInt(slot.startTime.split(':')[0]);
      const hourDiff = Math.abs(slotHour - targetHour);
      return slot.available && hourDiff <= 2;
    });

    if (availableNearTime.length > 0) {
      matchScore += 30; // 30 points for time match
      reasons.push(`Available within 2 hours of preferred time`);
    }

    // Bonus for immediate availability
    if (availability.nextAvailable && isSameDay(availability.nextAvailable.date, preferredTime)) {
      matchScore += 10;
      reasons.push(`Available same day`);
    }

    // Specialty match bonus
    if (hasMatchingSpecialty) {
      matchScore += 10;
      reasons.push(`Specializes in ${serviceType}`);
    }

    // Low utilization bonus (more available)
    if (availability.utilization < 50) {
      matchScore += 5;
      reasons.push(`High availability`);
    }

    matches.push({
      practitioner,
      availability: availableNearTime.slice(0, 3), // Top 3 slots
      matchScore: Math.min(matchScore, 100),
      reasons
    });
  });

  // Sort by match score and return top 3
  return matches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

/**
 * Check for booking conflicts
 */
export function checkConflicts(
  practitionerId: string,
  dateTime: Date,
  duration: number,
  existingBookings: Shift[] = [],
  practitioner?: Staff
): BookingConflict {
  const startTime = format(dateTime, 'HH:mm');
  const endTime = format(addMinutes(dateTime, duration), 'HH:mm');
  const bookingDate = startOfDay(dateTime);

  // Check for holiday
  const holiday = isGermanHoliday(dateTime);
  if (holiday) {
    return {
      hasConflict: true,
      reason: `Cannot book on holiday: ${holiday.nameEn}`,
      suggestions: practitioner ?
        findAlternativeSlots(practitioner, dateTime, duration, existingBookings) : []
    };
  }

  // Check for Mittagspause
  if (isMittagspause(startTime)) {
    return {
      hasConflict: true,
      reason: 'Cannot book during lunch break (12:00-13:00)',
      suggestions: practitioner ?
        findAlternativeSlots(practitioner, dateTime, duration, existingBookings) : []
    };
  }

  // Check against existing bookings
  const conflictingBookings = existingBookings.filter(booking => {
    if (booking.staffId !== practitionerId) return false;
    if (!isSameDay(booking.date, bookingDate)) return false;

    const bookingStart = timeToMinutes(booking.start);
    const bookingEnd = timeToMinutes(booking.end);
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    return (newStart < bookingEnd && newEnd > bookingStart);
  });

  if (conflictingBookings.length > 0) {
    return {
      hasConflict: true,
      reason: `Time slot conflicts with ${conflictingBookings.length} existing booking(s)`,
      conflictingBookings,
      suggestions: practitioner ?
        findAlternativeSlots(practitioner, dateTime, duration, existingBookings) : []
    };
  }

  // Check practitioner schedule
  if (practitioner) {
    const dayName = format(dateTime, 'EEEE').toLowerCase() as keyof WeekSchedule;
    const daySchedule = practitioner.defaultSchedule[dayName];

    let isWithinSchedule = false;
    for (const shift of daySchedule) {
      const shiftStart = timeToMinutes(shift.start);
      const shiftEnd = timeToMinutes(shift.end);
      const slotStart = timeToMinutes(startTime);
      const slotEnd = timeToMinutes(endTime);

      if (slotStart >= shiftStart && slotEnd <= shiftEnd) {
        // Check if it's during break
        if (shift.breakStart && shift.breakEnd) {
          const breakStart = timeToMinutes(shift.breakStart);
          const breakEnd = timeToMinutes(shift.breakEnd);
          if (slotStart < breakEnd && slotEnd > breakStart) {
            return {
              hasConflict: true,
              reason: 'Cannot book during break time',
              suggestions: findAlternativeSlots(practitioner, dateTime, duration, existingBookings)
            };
          }
        }
        isWithinSchedule = true;
        break;
      }
    }

    if (!isWithinSchedule) {
      return {
        hasConflict: true,
        reason: 'Time slot is outside practitioner\'s working hours',
        suggestions: findAlternativeSlots(practitioner, dateTime, duration, existingBookings)
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Optimize daily schedule to minimize gaps and group similar services
 */
export function optimizeDailySchedule(
  practitioner: Staff,
  date: Date,
  existingBookings: Shift[] = [],
  preferences?: {
    minimizeGaps?: boolean;
    groupSimilarServices?: boolean;
    avoidBackToBackDifficult?: boolean;
    preferredBreakTime?: string;
  }
): ScheduleOptimization {
  const availability = getPractitionerAvailability(practitioner, date, existingBookings);
  const originalSchedule = [...availability.slots];
  const optimizedSchedule = [...availability.slots];
  const suggestions: string[] = [];

  let gapReduction = 0;
  let groupingBenefit = 0;

  // Find gaps in the current schedule
  const gaps = findScheduleGaps(availability.slots);

  if (preferences?.minimizeGaps && gaps.length > 0) {
    // Calculate potential time saved by consolidating bookings
    gaps.forEach(gap => {
      if (gap.duration >= 30 && gap.duration <= 60) {
        gapReduction += gap.duration;
        suggestions.push(`Consider moving bookings to eliminate ${gap.duration}-minute gap at ${gap.startTime}`);
      }
    });
  }

  // Group similar services (mock implementation - would need service type data)
  if (preferences?.groupSimilarServices) {
    groupingBenefit = 10; // Placeholder benefit score
    suggestions.push('Group similar appointment types together for efficiency');
  }

  // Check for back-to-back difficult appointments
  if (preferences?.avoidBackToBackDifficult) {
    // This would need appointment difficulty data
    suggestions.push('Add buffer time between complex appointments');
  }

  // Calculate utilization improvement
  const originalUtilization = availability.utilization;
  const optimizedUtilization = Math.min(originalUtilization + (gapReduction / 480) * 100, 95);

  return {
    originalSchedule,
    optimizedSchedule,
    improvements: {
      gapReduction,
      groupingBenefit,
      utilizationIncrease: optimizedUtilization - originalUtilization
    },
    suggestions
  };
}

// Helper Functions

function generateSlotsForShift(
  practitionerId: string,
  date: Date,
  shift: ShiftTime,
  bookings: Shift[],
  slotDuration: number,
  bufferTime: number,
  isHoliday: boolean
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startMinutes = timeToMinutes(shift.start);
  const endMinutes = timeToMinutes(shift.end);
  const breakStart = shift.breakStart ? timeToMinutes(shift.breakStart) : null;
  const breakEnd = shift.breakEnd ? timeToMinutes(shift.breakEnd) : null;

  for (let time = startMinutes; time < endMinutes; time += slotDuration) {
    const slotStart = minutesToTime(time);
    const slotEnd = minutesToTime(time + slotDuration);

    // Skip break times
    if (breakStart && breakEnd && time >= breakStart && time < breakEnd) {
      slots.push({
        practitionerId,
        date,
        startTime: slotStart,
        endTime: slotEnd,
        available: false,
        capacity: 0,
        currentBookings: 0,
        metadata: { isMittagspause: true }
      });
      continue;
    }

    // Check if slot is booked
    const isBooked = bookings.some(booking => {
      const bookingStart = timeToMinutes(booking.start);
      const bookingEnd = timeToMinutes(booking.end) + bufferTime;
      return time >= bookingStart && time < bookingEnd;
    });

    // Calculate current bookings for this time
    const currentBookings = bookings.filter(booking => {
      const bookingStart = timeToMinutes(booking.start);
      const bookingEnd = timeToMinutes(booking.end);
      return time >= bookingStart && time < bookingEnd;
    }).length;

    // Determine demand level based on time of day
    let demandLevel: 'low' | 'medium' | 'high' = 'medium';
    const hour = Math.floor(time / 60);
    if (hour >= 9 && hour <= 11) demandLevel = 'high';
    else if (hour >= 14 && hour <= 16) demandLevel = 'high';
    else if (hour < 9 || hour > 18) demandLevel = 'low';

    slots.push({
      practitionerId,
      date,
      startTime: slotStart,
      endTime: slotEnd,
      available: !isBooked && currentBookings < (shift.maxBookings || 1),
      capacity: shift.maxBookings || 1,
      currentBookings,
      metadata: {
        isHoliday,
        demandLevel,
        isLastMinute: differenceInMinutes(date, new Date()) < 120
      }
    });
  }

  return slots;
}

function generateOvertimeSlots(
  practitionerId: string,
  date: Date,
  lastShift: ShiftTime,
  bookings: Shift[],
  slotDuration: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const regularEnd = timeToMinutes(lastShift.end);
  const overtimeEnd = Math.min(regularEnd + 120, 22 * 60); // Max 2 hours overtime, until 10 PM

  for (let time = regularEnd; time < overtimeEnd; time += slotDuration) {
    const slotStart = minutesToTime(time);
    const slotEnd = minutesToTime(time + slotDuration);

    slots.push({
      practitionerId,
      date,
      startTime: slotStart,
      endTime: slotEnd,
      available: true,
      capacity: 1,
      currentBookings: 0,
      metadata: {
        isOvertime: true,
        demandLevel: 'low'
      }
    });
  }

  return slots;
}

function findScheduleGaps(slots: TimeSlot[]): Array<{ startTime: string; duration: number }> {
  const gaps: Array<{ startTime: string; duration: number }> = [];
  let lastBookedEnd: number | null = null;

  slots.forEach(slot => {
    if (!slot.available && slot.currentBookings > 0) {
      const slotStart = timeToMinutes(slot.startTime);

      if (lastBookedEnd !== null && slotStart > lastBookedEnd) {
        gaps.push({
          startTime: minutesToTime(lastBookedEnd),
          duration: slotStart - lastBookedEnd
        });
      }

      lastBookedEnd = timeToMinutes(slot.endTime);
    }
  });

  return gaps;
}

function findAlternativeSlots(
  practitioner: Staff,
  preferredTime: Date,
  duration: number,
  bookings: Shift[]
): TimeSlot[] {
  const alternatives: TimeSlot[] = [];
  const targetHour = preferredTime.getHours();

  // Check slots within 2 hours before and after
  for (let offset = -120; offset <= 120; offset += 30) {
    if (offset === 0) continue; // Skip the conflicting time

    const altTime = addMinutes(preferredTime, offset);
    const altSlot = getNextAvailableSlot(
      practitioner,
      duration,
      altTime,
      1, // Only check same day
      bookings
    );

    if (altSlot && alternatives.length < 3) {
      alternatives.push(altSlot);
    }
  }

  return alternatives;
}

function updateMetrics(calculationTime: number, wasCache: boolean) {
  calculationMetrics.totalCalculations++;
  calculationMetrics.lastCalculationTime = calculationTime;

  if (wasCache) {
    calculationMetrics.cacheHits++;
  } else {
    calculationMetrics.cacheMisses++;
  }

  calculationMetrics.cacheHitRate =
    (calculationMetrics.cacheHits / calculationMetrics.totalCalculations) * 100;

  calculationMetrics.averageCalculationTime =
    ((calculationMetrics.averageCalculationTime * (calculationMetrics.totalCalculations - 1)) + calculationTime) /
    calculationMetrics.totalCalculations;
}

// Export metrics for monitoring
export function getPerformanceMetrics() {
  return {
    ...calculationMetrics,
    cacheStats: cache.getStats()
  };
}

// Preload next 7 days for all practitioners
export async function preloadAvailability(
  practitioners: Staff[],
  existingBookings: Shift[] = []
): Promise<void> {
  const startDate = new Date();
  const promises: Promise<void>[] = [];

  for (let day = 0; day < 7; day++) {
    const date = addDays(startDate, day);

    practitioners.forEach(practitioner => {
      promises.push(
        new Promise((resolve) => {
          // Run in next tick to avoid blocking
          setTimeout(() => {
            getPractitionerAvailability(practitioner, date, existingBookings);
            resolve();
          }, 0);
        })
      );
    });
  }

  await Promise.all(promises);
}

// Real-time slot reservation system
const reservations = new Map<string, { until: Date; userId: string }>();

export function reserveSlot(
  practitionerId: string,
  dateTime: Date,
  duration: number,
  userId: string
): boolean {
  const key = `${practitionerId}:${format(dateTime, 'yyyy-MM-dd HH:mm')}`;
  const now = new Date();

  // Check if already reserved
  const existing = reservations.get(key);
  if (existing && existing.until > now && existing.userId !== userId) {
    return false; // Already reserved by someone else
  }

  // Reserve for 5 minutes
  reservations.set(key, {
    until: addMinutes(now, 5),
    userId
  });

  return true;
}

export function releaseSlot(
  practitionerId: string,
  dateTime: Date,
  userId: string
): void {
  const key = `${practitionerId}:${format(dateTime, 'yyyy-MM-dd HH:mm')}`;
  const reservation = reservations.get(key);

  if (reservation && reservation.userId === userId) {
    reservations.delete(key);
  }
}

// Clean up expired reservations
setInterval(() => {
  const now = new Date();
  for (const [key, reservation] of reservations.entries()) {
    if (reservation.until < now) {
      reservations.delete(key);
    }
  }
}, 60000); // Run every minute

export default {
  getPractitionerAvailability,
  getNextAvailableSlot,
  findBestMatch,
  checkConflicts,
  optimizeDailySchedule,
  preloadAvailability,
  reserveSlot,
  releaseSlot,
  getPerformanceMetrics,
  DEMO_BOOKINGS
};