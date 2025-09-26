// Staff Schedule Management Hook
import { useState, useEffect, useCallback, useRef } from 'react';
import { startOfWeek, addWeeks, format } from 'date-fns';
import { ALL_DEMO_STAFF, Staff } from '../lib/demoStaffData';
import {
  Shift,
  ScheduleConflict,
  ShiftTemplate,
  generateWeeklySchedule,
  validateShift,
  applyShiftTemplate,
  SHIFT_TEMPLATES
} from '../lib/staffScheduleUtils';

interface UseStaffScheduleOptions {
  initialWeek?: Date;
  autoLoadDemo?: boolean;
  onShiftChange?: (shifts: Shift[]) => void;
  onConflict?: (conflicts: ScheduleConflict[]) => void;
}

interface UseStaffScheduleReturn {
  // Data
  staff: Staff[];
  shifts: Shift[];
  currentWeek: Date;
  selectedStaff: Staff | null;
  selectedShift: Shift | null;
  conflicts: ScheduleConflict[];
  templates: ShiftTemplate[];

  // Actions
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (shiftId: string, updates: Partial<Shift>) => void;
  deleteShift: (shiftId: string) => void;
  selectStaff: (staffId: string | null) => void;
  selectShift: (shiftId: string | null) => void;
  navigateWeek: (direction: 'prev' | 'next' | 'current') => void;
  applyTemplate: (staffId: string, date: Date, templateId: string) => void;
  generateWeekSchedule: (staffId?: string) => void;
  clearConflicts: () => void;
  bulkUpdateShifts: (shifts: Shift[]) => void;
  toggleShiftStatus: (shiftId: string) => void;

  // Utilities
  getStaffShifts: (staffId: string) => Shift[];
  getDayShifts: (date: Date) => Shift[];
  isLoading: boolean;
  error: string | null;
}

export const useStaffSchedule = (
  options: UseStaffScheduleOptions = {}
): UseStaffScheduleReturn => {
  const {
    initialWeek = startOfWeek(new Date(), { weekStartsOn: 1 }),
    autoLoadDemo = true,
    onShiftChange,
    onConflict
  } = options;

  // State
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [currentWeek, setCurrentWeek] = useState<Date>(initialWeek);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for callbacks
  const shiftsRef = useRef<Shift[]>(shifts);
  shiftsRef.current = shifts;

  // Load demo data on mount
  useEffect(() => {
    if (autoLoadDemo) {
      setIsLoading(true);
      try {
        // Load demo staff
        setStaff(ALL_DEMO_STAFF);

        // Generate initial week schedules for all staff
        const initialShifts: Shift[] = [];
        ALL_DEMO_STAFF.forEach(staffMember => {
          const weekShifts = generateWeeklySchedule(staffMember, currentWeek);
          initialShifts.push(...weekShifts);
        });
        setShifts(initialShifts);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load demo data');
        setIsLoading(false);
      }
    }
  }, [autoLoadDemo]);

  // Notify on shift changes
  useEffect(() => {
    if (onShiftChange) {
      onShiftChange(shifts);
    }
  }, [shifts, onShiftChange]);

  // Notify on conflicts
  useEffect(() => {
    if (onConflict && conflicts.length > 0) {
      onConflict(conflicts);
    }
  }, [conflicts, onConflict]);

  // Add a new shift
  const addShift = useCallback((newShift: Omit<Shift, 'id'>) => {
    const shift: Shift = {
      ...newShift,
      id: `${newShift.staffId}-${format(newShift.date, 'yyyy-MM-dd')}-${Date.now()}`
    };

    // Validate the new shift
    const validationConflicts = validateShift(shift, shiftsRef.current);
    if (validationConflicts.length > 0) {
      setConflicts(validationConflicts);
      if (validationConflicts.some(c => c.severity === 'error')) {
        setError('Cannot add shift due to conflicts');
        return;
      }
    }

    setShifts(prev => [...prev, shift]);
    setError(null);
  }, []);

  // Update an existing shift
  const updateShift = useCallback((shiftId: string, updates: Partial<Shift>) => {
    setShifts(prev => {
      const updatedShifts = prev.map(shift =>
        shift.id === shiftId ? { ...shift, ...updates } : shift
      );

      // Validate the updated shift
      const updatedShift = updatedShifts.find(s => s.id === shiftId);
      if (updatedShift) {
        const validationConflicts = validateShift(
          updatedShift,
          updatedShifts.filter(s => s.id !== shiftId)
        );
        if (validationConflicts.length > 0) {
          setConflicts(validationConflicts);
        }
      }

      return updatedShifts;
    });
  }, []);

  // Delete a shift
  const deleteShift = useCallback((shiftId: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== shiftId));
    // Clear selection if deleted shift was selected
    if (selectedShift?.id === shiftId) {
      setSelectedShift(null);
    }
  }, [selectedShift]);

  // Select a staff member
  const selectStaff = useCallback((staffId: string | null) => {
    if (staffId) {
      const staffMember = staff.find(s => s.id === staffId);
      setSelectedStaff(staffMember || null);
    } else {
      setSelectedStaff(null);
    }
  }, [staff]);

  // Select a shift
  const selectShift = useCallback((shiftId: string | null) => {
    if (shiftId) {
      const shift = shifts.find(s => s.id === shiftId);
      setSelectedShift(shift || null);
    } else {
      setSelectedShift(null);
    }
  }, [shifts]);

  // Navigate between weeks
  const navigateWeek = useCallback((direction: 'prev' | 'next' | 'current') => {
    if (direction === 'current') {
      setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }));
    } else if (direction === 'prev') {
      setCurrentWeek(prev => addWeeks(prev, -1));
    } else {
      setCurrentWeek(prev => addWeeks(prev, 1));
    }
  }, []);

  // Apply a template to create a shift
  const applyTemplate = useCallback((
    staffId: string,
    date: Date,
    templateId: string
  ) => {
    const template = SHIFT_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      setError(`Template ${templateId} not found`);
      return;
    }

    const shift = applyShiftTemplate(staffId, date, template);
    addShift(shift);
  }, [addShift]);

  // Generate week schedule for staff
  const generateWeekSchedule = useCallback((staffId?: string) => {
    const staffToGenerate = staffId
      ? staff.filter(s => s.id === staffId)
      : staff;

    const newShifts: Shift[] = [];
    staffToGenerate.forEach(staffMember => {
      // Remove existing shifts for this staff and week
      setShifts(prev => prev.filter(s =>
        !(s.staffId === staffMember.id &&
          s.date >= currentWeek &&
          s.date < addWeeks(currentWeek, 1))
      ));

      // Generate new shifts
      const weekShifts = generateWeeklySchedule(staffMember, currentWeek);
      newShifts.push(...weekShifts);
    });

    setShifts(prev => [...prev, ...newShifts]);
  }, [staff, currentWeek]);

  // Clear conflicts
  const clearConflicts = useCallback(() => {
    setConflicts([]);
  }, []);

  // Bulk update shifts
  const bulkUpdateShifts = useCallback((newShifts: Shift[]) => {
    setShifts(newShifts);
  }, []);

  // Toggle shift status
  const toggleShiftStatus = useCallback((shiftId: string) => {
    setShifts(prev => prev.map(shift => {
      if (shift.id === shiftId) {
        const newStatus = shift.status === 'active'
          ? 'unavailable'
          : 'active';
        return { ...shift, status: newStatus };
      }
      return shift;
    }));
  }, []);

  // Get shifts for a specific staff member
  const getStaffShifts = useCallback((staffId: string): Shift[] => {
    return shifts.filter(shift => shift.staffId === staffId);
  }, [shifts]);

  // Get shifts for a specific day
  const getDayShifts = useCallback((date: Date): Shift[] => {
    return shifts.filter(shift =>
      shift.date.toDateString() === date.toDateString()
    );
  }, [shifts]);

  return {
    // Data
    staff,
    shifts,
    currentWeek,
    selectedStaff,
    selectedShift,
    conflicts,
    templates: SHIFT_TEMPLATES,

    // Actions
    addShift,
    updateShift,
    deleteShift,
    selectStaff,
    selectShift,
    navigateWeek,
    applyTemplate,
    generateWeekSchedule,
    clearConflicts,
    bulkUpdateShifts,
    toggleShiftStatus,

    // Utilities
    getStaffShifts,
    getDayShifts,
    isLoading,
    error
  };
};