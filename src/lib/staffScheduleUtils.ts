// Staff Schedule Utility Functions
import { addMinutes, format, parse, isAfter, isBefore, isEqual, startOfWeek, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Staff, ShiftTime, WeekSchedule } from './demoStaffData';

export interface Shift {
  id: string;
  staffId: string;
  date: Date;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
  maxBookings?: number;
  status: 'active' | 'holiday' | 'sick' | 'unavailable';
  notes?: string;
}

export interface ScheduleConflict {
  type: 'overlap' | 'insufficient_gap' | 'too_many_hours' | 'break_violation';
  staffId: string;
  shift1: Shift;
  shift2?: Shift;
  message: string;
  severity: 'error' | 'warning';
}

export interface ShiftTemplate {
  id: string;
  name: string;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
  maxBookings?: number;
}

// Common shift templates
export const SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 'morning',
    name: 'Morning Shift',
    start: '08:00',
    end: '12:00',
    maxBookings: 1
  },
  {
    id: 'afternoon',
    name: 'Afternoon Shift',
    start: '14:00',
    end: '18:00',
    maxBookings: 1
  },
  {
    id: 'full-day',
    name: 'Full Day',
    start: '09:00',
    end: '17:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    maxBookings: 1
  },
  {
    id: 'early-morning',
    name: 'Early Morning',
    start: '07:00',
    end: '12:00',
    maxBookings: 1
  },
  {
    id: 'evening',
    name: 'Evening Shift',
    start: '16:00',
    end: '20:00',
    maxBookings: 1
  },
  {
    id: 'late-night',
    name: 'Late Night',
    start: '18:00',
    end: '22:00',
    maxBookings: 1
  }
];

// Convert time string to minutes
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes to time string
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Check if two shifts overlap
export const doShiftsOverlap = (shift1: Shift, shift2: Shift): boolean => {
  if (shift1.staffId !== shift2.staffId) return false;
  if (shift1.date.toDateString() !== shift2.date.toDateString()) return false;

  const start1 = timeToMinutes(shift1.start);
  const end1 = timeToMinutes(shift1.end);
  const start2 = timeToMinutes(shift2.start);
  const end2 = timeToMinutes(shift2.end);

  return (start1 < end2 && end1 > start2);
};

// Calculate gap between two shifts in minutes
export const calculateShiftGap = (shift1: Shift, shift2: Shift): number => {
  const end1 = timeToMinutes(shift1.end);
  const start2 = timeToMinutes(shift2.start);
  return start2 - end1;
};

// Validate a shift for conflicts
export const validateShift = (
  newShift: Shift,
  existingShifts: Shift[],
  minGapMinutes: number = 30,
  maxHoursPerDay: number = 10
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = [];
  const sameDayShifts = existingShifts.filter(s =>
    s.staffId === newShift.staffId &&
    s.date.toDateString() === newShift.date.toDateString() &&
    s.id !== newShift.id
  );

  // Check for overlaps
  for (const shift of sameDayShifts) {
    if (doShiftsOverlap(newShift, shift)) {
      conflicts.push({
        type: 'overlap',
        staffId: newShift.staffId,
        shift1: newShift,
        shift2: shift,
        message: `Shift overlaps with existing shift from ${shift.start} to ${shift.end}`,
        severity: 'error'
      });
    }
  }

  // Check for insufficient gaps
  for (const shift of sameDayShifts) {
    const gap = Math.abs(calculateShiftGap(newShift, shift));
    if (gap > 0 && gap < minGapMinutes) {
      conflicts.push({
        type: 'insufficient_gap',
        staffId: newShift.staffId,
        shift1: newShift,
        shift2: shift,
        message: `Only ${gap} minutes gap between shifts (minimum ${minGapMinutes} required)`,
        severity: 'warning'
      });
    }
  }

  // Check total hours per day
  const newShiftHours = (timeToMinutes(newShift.end) - timeToMinutes(newShift.start)) / 60;
  const existingHours = sameDayShifts.reduce((total, shift) => {
    const hours = (timeToMinutes(shift.end) - timeToMinutes(shift.start)) / 60;
    return total + hours;
  }, 0);

  if (newShiftHours + existingHours > maxHoursPerDay) {
    conflicts.push({
      type: 'too_many_hours',
      staffId: newShift.staffId,
      shift1: newShift,
      message: `Total hours (${newShiftHours + existingHours}) exceeds maximum ${maxHoursPerDay} hours per day`,
      severity: 'warning'
    });
  }

  // Check break violations
  if (newShiftHours >= 6 && !newShift.breakStart) {
    conflicts.push({
      type: 'break_violation',
      staffId: newShift.staffId,
      shift1: newShift,
      message: 'Shifts longer than 6 hours must include a break',
      severity: 'warning'
    });
  }

  return conflicts;
};

// Generate weekly schedule from template
export const generateWeeklySchedule = (
  staff: Staff,
  weekStart: Date
): Shift[] => {
  const shifts: Shift[] = [];
  const days: (keyof WeekSchedule)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  days.forEach((day, index) => {
    const date = addDays(weekStart, index);
    const daySchedule = staff.defaultSchedule[day];

    daySchedule.forEach((shiftTime, shiftIndex) => {
      shifts.push({
        id: `${staff.id}-${format(date, 'yyyy-MM-dd')}-${shiftIndex}`,
        staffId: staff.id,
        date,
        start: shiftTime.start,
        end: shiftTime.end,
        breakStart: shiftTime.breakStart,
        breakEnd: shiftTime.breakEnd,
        maxBookings: shiftTime.maxBookings,
        status: 'active'
      });
    });
  });

  return shifts;
};

// Apply a template to create a new shift
export const applyShiftTemplate = (
  staffId: string,
  date: Date,
  template: ShiftTemplate
): Shift => {
  return {
    id: `${staffId}-${format(date, 'yyyy-MM-dd')}-${Date.now()}`,
    staffId,
    date,
    start: template.start,
    end: template.end,
    breakStart: template.breakStart,
    breakEnd: template.breakEnd,
    maxBookings: template.maxBookings,
    status: 'active'
  };
};

// Calculate staff availability statistics
export const calculateStaffStats = (shifts: Shift[]) => {
  const stats: Record<string, {
    totalHours: number;
    shiftsCount: number;
    averageShiftLength: number;
    daysWorked: Set<string>;
  }> = {};

  shifts.forEach(shift => {
    if (!stats[shift.staffId]) {
      stats[shift.staffId] = {
        totalHours: 0,
        shiftsCount: 0,
        averageShiftLength: 0,
        daysWorked: new Set()
      };
    }

    const hours = (timeToMinutes(shift.end) - timeToMinutes(shift.start)) / 60;
    stats[shift.staffId].totalHours += hours;
    stats[shift.staffId].shiftsCount += 1;
    stats[shift.staffId].daysWorked.add(shift.date.toDateString());
  });

  // Calculate averages
  Object.keys(stats).forEach(staffId => {
    const stat = stats[staffId];
    stat.averageShiftLength = stat.shiftsCount > 0
      ? stat.totalHours / stat.shiftsCount
      : 0;
  });

  return stats;
};

// Get available time slots for a staff member on a specific date
export const getAvailableSlots = (
  staffId: string,
  date: Date,
  shifts: Shift[],
  slotDuration: number = 30 // minutes
): string[] => {
  const staffShifts = shifts.filter(s =>
    s.staffId === staffId &&
    s.date.toDateString() === date.toDateString() &&
    s.status === 'active'
  );

  const availableSlots: string[] = [];

  staffShifts.forEach(shift => {
    const startMinutes = timeToMinutes(shift.start);
    const endMinutes = timeToMinutes(shift.end);
    const breakStartMinutes = shift.breakStart ? timeToMinutes(shift.breakStart) : null;
    const breakEndMinutes = shift.breakEnd ? timeToMinutes(shift.breakEnd) : null;

    for (let time = startMinutes; time < endMinutes; time += slotDuration) {
      // Skip break times
      if (breakStartMinutes && breakEndMinutes) {
        if (time >= breakStartMinutes && time < breakEndMinutes) {
          continue;
        }
      }
      availableSlots.push(minutesToTime(time));
    }
  });

  return availableSlots;
};

// Format shift for display
export const formatShiftDisplay = (shift: Shift, locale: 'de' | 'en' = 'en'): string => {
  const dateStr = format(shift.date, 'EEE, MMM d', { locale: locale === 'de' ? de : undefined });
  const timeStr = `${shift.start} - ${shift.end}`;
  const breakStr = shift.breakStart && shift.breakEnd
    ? ` (${locale === 'de' ? 'Pause' : 'Break'}: ${shift.breakStart}-${shift.breakEnd})`
    : '';

  return `${dateStr}: ${timeStr}${breakStr}`;
};

// Check if staff member is available at a specific time
export const isStaffAvailableAtTime = (
  staffId: string,
  dayNameOrDate: Date | string,
  time: string,
  shifts: Shift[]
): boolean => {
  // Handle both Date and day name string
  if (typeof dayNameOrDate === 'string') {
    // For day name, check against default schedule
    // This is a simplified check - in production you'd check actual shifts
    return true; // Placeholder - actual implementation would check schedule
  }

  const staffShifts = shifts.filter(s =>
    s.staffId === staffId &&
    s.date.toDateString() === dayNameOrDate.toDateString() &&
    s.status === 'active'
  );

  const timeMinutes = timeToMinutes(time);

  for (const shift of staffShifts) {
    const startMinutes = timeToMinutes(shift.start);
    const endMinutes = timeToMinutes(shift.end);

    if (timeMinutes >= startMinutes && timeMinutes < endMinutes) {
      // Check if it's during break
      if (shift.breakStart && shift.breakEnd) {
        const breakStartMinutes = timeToMinutes(shift.breakStart);
        const breakEndMinutes = timeToMinutes(shift.breakEnd);
        if (timeMinutes >= breakStartMinutes && timeMinutes < breakEndMinutes) {
          return false;
        }
      }
      return true;
    }
  }

  return false;
};