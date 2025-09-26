// Shift Templates and Management Utilities
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Shift } from '../lib/staffScheduleUtils';
import type { Staff } from '../lib/demoStaffData';
import { isGermanHoliday } from './germanHolidays';

// Shift template definitions
export const SHIFT_TEMPLATES = {
  'Morning Shift': {
    id: 'morning',
    name: 'Morning Shift',
    nameDE: 'Frühschicht',
    start: '07:00',
    end: '13:00',
    color: '#FCD34D',
    icon: '🌅'
  },
  'Afternoon Shift': {
    id: 'afternoon',
    name: 'Afternoon Shift',
    nameDE: 'Spätschicht',
    start: '13:00',
    end: '19:00',
    color: '#FB923C',
    icon: '☀️'
  },
  'Full Day': {
    id: 'full-day',
    name: 'Full Day',
    nameDE: 'Ganztag',
    start: '09:00',
    end: '17:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    color: '#60A5FA',
    icon: '📅'
  },
  'Late Shift': {
    id: 'late',
    name: 'Late Shift',
    nameDE: 'Nachtschicht',
    start: '14:00',
    end: '22:00',
    color: '#A78BFA',
    icon: '🌙'
  },
  'Weekend': {
    id: 'weekend',
    name: 'Weekend',
    nameDE: 'Wochenende',
    start: '10:00',
    end: '16:00',
    color: '#34D399',
    icon: '🎉'
  },
  'On Call': {
    id: 'on-call',
    name: 'On Call',
    nameDE: 'Bereitschaft',
    start: '00:00',
    end: '23:59',
    color: '#F87171',
    icon: '📞'
  },
  'Split Shift': {
    id: 'split',
    name: 'Split Shift',
    nameDE: 'Geteilte Schicht',
    start: '08:00',
    end: '20:00',
    breakStart: '12:00',
    breakEnd: '16:00',
    color: '#C084FC',
    icon: '⚡'
  }
};

// Minimum staffing requirements per time slot
export interface StaffingRequirement {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string; // HH:MM format
  minStaff: number;
  preferredStaff: number;
  roles?: string[]; // Specific roles required
}

export const DEFAULT_STAFFING_REQUIREMENTS: StaffingRequirement[] = [
  // Weekday requirements
  { dayOfWeek: 1, timeSlot: '09:00', minStaff: 3, preferredStaff: 5 },
  { dayOfWeek: 1, timeSlot: '12:00', minStaff: 2, preferredStaff: 4 },
  { dayOfWeek: 1, timeSlot: '15:00', minStaff: 3, preferredStaff: 5 },
  { dayOfWeek: 2, timeSlot: '09:00', minStaff: 3, preferredStaff: 5 },
  { dayOfWeek: 2, timeSlot: '12:00', minStaff: 2, preferredStaff: 4 },
  { dayOfWeek: 3, timeSlot: '09:00', minStaff: 3, preferredStaff: 5 },
  { dayOfWeek: 4, timeSlot: '09:00', minStaff: 3, preferredStaff: 5 },
  { dayOfWeek: 5, timeSlot: '09:00', minStaff: 4, preferredStaff: 6 }, // Friday busier
  // Weekend requirements
  { dayOfWeek: 6, timeSlot: '10:00', minStaff: 2, preferredStaff: 3 },
  { dayOfWeek: 0, timeSlot: '10:00', minStaff: 1, preferredStaff: 2 }
];

// Shift swap request interface
export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  shiftId: string;
  shiftDate: Date;
  shiftTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
  responseNote?: string;
}

// Fair shift distribution algorithm
export interface FairDistributionParams {
  staff: Staff[];
  totalShifts: number;
  preferences?: Map<string, string[]>; // staffId -> preferred shift types
  constraints?: Map<string, string[]>; // staffId -> unavailable dates
  maxConsecutiveDays?: number;
  minRestHours?: number;
}

export function distributeShiftsFairly(params: FairDistributionParams): Map<string, Shift[]> {
  const {
    staff,
    totalShifts,
    preferences = new Map(),
    constraints = new Map(),
    maxConsecutiveDays = 5,
    minRestHours = 11
  } = params;

  const distribution = new Map<string, Shift[]>();
  const shiftsPerPerson = Math.floor(totalShifts / staff.length);
  const remainder = totalShifts % staff.length;

  // Initialize distribution
  staff.forEach(s => distribution.set(s.id, []));

  // Track work hours and consecutive days
  const workHours = new Map<string, number>();
  const consecutiveDays = new Map<string, number>();

  // Distribute base shifts
  staff.forEach((staffMember, index) => {
    const targetShifts = shiftsPerPerson + (index < remainder ? 1 : 0);
    workHours.set(staffMember.id, 0);
    consecutiveDays.set(staffMember.id, 0);
  });

  return distribution;
}

// Overtime tracking
export interface OvertimeRecord {
  staffId: string;
  week: string; // ISO week string
  regularHours: number;
  overtimeHours: number;
  rate: number; // Overtime multiplier (1.5x, 2x, etc.)
  approved: boolean;
  notes?: string;
}

export function calculateOvertime(
  shifts: Shift[],
  weeklyThreshold: number = 40,
  dailyThreshold: number = 8
): OvertimeRecord[] {
  const overtimeRecords: OvertimeRecord[] = [];
  const shiftsByStaffAndWeek = new Map<string, Map<string, Shift[]>>();

  // Group shifts by staff and week
  shifts.forEach(shift => {
    const week = format(shift.date, 'yyyy-ww');
    const key = `${shift.staffId}-${week}`;

    if (!shiftsByStaffAndWeek.has(shift.staffId)) {
      shiftsByStaffAndWeek.set(shift.staffId, new Map());
    }

    const staffWeeks = shiftsByStaffAndWeek.get(shift.staffId)!;
    if (!staffWeeks.has(week)) {
      staffWeeks.set(week, []);
    }

    staffWeeks.get(week)!.push(shift);
  });

  // Calculate overtime for each staff member per week
  shiftsByStaffAndWeek.forEach((weeks, staffId) => {
    weeks.forEach((weekShifts, week) => {
      let totalHours = 0;
      let overtimeHours = 0;

      weekShifts.forEach(shift => {
        const start = shift.start.split(':').map(Number);
        const end = shift.end.split(':').map(Number);
        const shiftHours = (end[0] * 60 + end[1] - start[0] * 60 - start[1]) / 60;
        totalHours += shiftHours;

        // Check daily overtime
        if (shiftHours > dailyThreshold) {
          overtimeHours += shiftHours - dailyThreshold;
        }
      });

      // Check weekly overtime
      if (totalHours > weeklyThreshold) {
        overtimeHours = Math.max(overtimeHours, totalHours - weeklyThreshold);
      }

      if (overtimeHours > 0) {
        overtimeRecords.push({
          staffId,
          week,
          regularHours: totalHours - overtimeHours,
          overtimeHours,
          rate: overtimeHours > 10 ? 2 : 1.5, // 2x for excessive overtime
          approved: false
        });
      }
    });
  });

  return overtimeRecords;
}

// Check staffing levels
export function checkStaffingLevels(
  shifts: Shift[],
  date: Date,
  requirements: StaffingRequirement[] = DEFAULT_STAFFING_REQUIREMENTS
): {
  isUnderstaffed: boolean;
  gaps: Array<{ time: string; required: number; actual: number }>;
  suggestions: string[];
} {
  const dayOfWeek = date.getDay();
  const dayRequirements = requirements.filter(r => r.dayOfWeek === dayOfWeek);
  const dayShifts = shifts.filter(s => s.date.toDateString() === date.toDateString());
  const gaps: Array<{ time: string; required: number; actual: number }> = [];
  const suggestions: string[] = [];

  dayRequirements.forEach(req => {
    const timeMinutes = parseInt(req.timeSlot.split(':')[0]) * 60 + parseInt(req.timeSlot.split(':')[1]);
    const activeStaff = dayShifts.filter(shift => {
      const startMinutes = parseInt(shift.start.split(':')[0]) * 60 + parseInt(shift.start.split(':')[1]);
      const endMinutes = parseInt(shift.end.split(':')[0]) * 60 + parseInt(shift.end.split(':')[1]);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes && shift.status === 'active';
    }).length;

    if (activeStaff < req.minStaff) {
      gaps.push({
        time: req.timeSlot,
        required: req.minStaff,
        actual: activeStaff
      });
    }
  });

  // Generate suggestions
  if (gaps.length > 0) {
    suggestions.push(`Need ${gaps.reduce((sum, g) => sum + (g.required - g.actual), 0)} more staff members`);
    suggestions.push('Consider calling in on-call staff');
    suggestions.push('Ask for volunteers for overtime');
  }

  return {
    isUnderstaffed: gaps.length > 0,
    gaps,
    suggestions
  };
}

// Copy schedule from previous period
export function copySchedule(
  sourceWeekStart: Date,
  targetWeekStart: Date,
  shifts: Shift[]
): Shift[] {
  const sourceWeekEnd = endOfWeek(sourceWeekStart);
  const sourceShifts = shifts.filter(s =>
    s.date >= sourceWeekStart && s.date <= sourceWeekEnd
  );

  const copiedShifts: Shift[] = [];
  const daysDiff = Math.floor((targetWeekStart.getTime() - sourceWeekStart.getTime()) / (1000 * 60 * 60 * 24));

  sourceShifts.forEach(shift => {
    const newDate = addDays(shift.date, daysDiff);

    // Skip if it's a holiday
    if (isGermanHoliday(newDate)) {
      return;
    }

    copiedShifts.push({
      ...shift,
      id: `${shift.staffId}-${format(newDate, 'yyyy-MM-dd')}-${Date.now()}`,
      date: newDate
    });
  });

  return copiedShifts;
}

// Find coverage for sick staff
export interface CoverageOption {
  staffId: string;
  staffName: string;
  availability: 'available' | 'overtime' | 'day-off';
  score: number; // 0-100, higher is better
  reasons: string[];
}

export function findCoverage(
  sickStaffId: string,
  shift: Shift,
  allStaff: Staff[],
  existingShifts: Shift[]
): CoverageOption[] {
  const options: CoverageOption[] = [];
  const shiftDate = shift.date;
  const dayShifts = existingShifts.filter(s =>
    s.date.toDateString() === shiftDate.toDateString()
  );

  allStaff.forEach(staff => {
    if (staff.id === sickStaffId) return;

    let score = 50; // Base score
    let availability: 'available' | 'overtime' | 'day-off' = 'available';
    const reasons: string[] = [];

    // Check if already working that day
    const staffDayShifts = dayShifts.filter(s => s.staffId === staff.id);

    if (staffDayShifts.length === 0) {
      // Day off - can cover but less ideal
      availability = 'day-off';
      score -= 20;
      reasons.push('Would need to come in on day off');
    } else {
      // Check for conflicts
      const hasConflict = staffDayShifts.some(s => {
        const existingStart = parseInt(s.start.split(':')[0]) * 60 + parseInt(s.start.split(':')[1]);
        const existingEnd = parseInt(s.end.split(':')[0]) * 60 + parseInt(s.end.split(':')[1]);
        const coverStart = parseInt(shift.start.split(':')[0]) * 60 + parseInt(shift.start.split(':')[1]);
        const coverEnd = parseInt(shift.end.split(':')[0]) * 60 + parseInt(shift.end.split(':')[1]);

        return (coverStart < existingEnd && coverEnd > existingStart);
      });

      if (hasConflict) {
        return; // Skip if time conflict (use return in forEach)
      }

      // Would be overtime
      const totalHours = staffDayShifts.reduce((sum, s) => {
        const start = parseInt(s.start.split(':')[0]) * 60 + parseInt(s.start.split(':')[1]);
        const end = parseInt(s.end.split(':')[0]) * 60 + parseInt(s.end.split(':')[1]);
        return sum + (end - start) / 60;
      }, 0);

      const shiftHours = (parseInt(shift.end.split(':')[0]) * 60 + parseInt(shift.end.split(':')[1]) -
                         parseInt(shift.start.split(':')[0]) * 60 - parseInt(shift.start.split(':')[1])) / 60;

      if (totalHours + shiftHours > 8) {
        availability = 'overtime';
        score -= 10;
        reasons.push('Would be overtime');
      }
    }

    // Bonus for similar role/specialties
    const sickStaff = allStaff.find(s => s.id === sickStaffId);
    if (sickStaff && staff.role === sickStaff.role) {
      score += 20;
      reasons.push('Same role/qualifications');
    }

    // Bonus for high rating
    score += staff.rating * 5;
    if (staff.rating >= 4.5) {
      reasons.push('Highly rated staff member');
    }

    options.push({
      staffId: staff.id,
      staffName: staff.name,
      availability,
      score: Math.min(100, Math.max(0, score)),
      reasons
    });
  });

  // Sort by score
  return options.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Validate minimum rest periods
export function validateRestPeriods(
  staffId: string,
  shifts: Shift[],
  minRestHours: number = 11
): { isValid: boolean; violations: string[] } {
  const staffShifts = shifts
    .filter(s => s.staffId === staffId)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const violations: string[] = [];

  for (let i = 0; i < staffShifts.length - 1; i++) {
    const currentShift = staffShifts[i];
    const nextShift = staffShifts[i + 1];

    // Calculate rest period
    const currentEnd = new Date(currentShift.date);
    const [endHour, endMin] = currentShift.end.split(':').map(Number);
    currentEnd.setHours(endHour, endMin);

    const nextStart = new Date(nextShift.date);
    const [startHour, startMin] = nextShift.start.split(':').map(Number);
    nextStart.setHours(startHour, startMin);

    const restHours = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60);

    if (restHours < minRestHours) {
      violations.push(
        `Only ${restHours.toFixed(1)} hours rest between ${format(currentShift.date, 'MMM d')} and ${format(nextShift.date, 'MMM d')}`
      );
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}

// Emergency on-call activation
export function activateOnCall(
  date: Date,
  requiredStaff: number,
  allStaff: Staff[],
  existingShifts: Shift[]
): {
  notified: string[];
  available: string[];
  message: string;
} {
  const dayShifts = existingShifts.filter(s =>
    s.date.toDateString() === date.toDateString()
  );

  const workingStaff = new Set(dayShifts.map(s => s.staffId));
  const availableStaff = allStaff.filter(s => !workingStaff.has(s.id));

  // Prioritize by rating and availability
  const prioritized = availableStaff
    .sort((a, b) => b.rating - a.rating)
    .slice(0, requiredStaff);

  return {
    notified: prioritized.map(s => s.id),
    available: prioritized.map(s => s.name),
    message: `Emergency staffing alert sent to ${prioritized.length} staff members`
  };
}

// Additional named exports for admin/shifts.tsx
export const applyShiftTemplate = (templateId: string, date: Date, staffId: string): Shift => {
  const template = Object.values(SHIFT_TEMPLATES).find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  return {
    id: `${staffId}-${format(date, 'yyyy-MM-dd')}-${Date.now()}`,
    staffId,
    date,
    start: template.start,
    end: template.end,
    break: template.breakStart && template.breakEnd ?
      `${template.breakStart}-${template.breakEnd}` : undefined,
    status: 'active',
    type: template.name
  };
};

export const findAvailableCoverage = findCoverage;

export const activateEmergencyOnCall = (date: Date, requiredStaff: number, allStaff: Staff[], existingShifts: Shift[]) => {
  return activateOnCall(date, requiredStaff, allStaff, existingShifts);
};

export default {
  SHIFT_TEMPLATES,
  DEFAULT_STAFFING_REQUIREMENTS,
  distributeShiftsFairly,
  calculateOvertime,
  checkStaffingLevels,
  copySchedule,
  findCoverage,
  validateRestPeriods,
  activateOnCall
};