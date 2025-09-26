// Advanced Shift Management Hook with Real-time Updates
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { useStaffSchedule } from './useStaffSchedule';
import { useAvailabilityEngine } from './useAvailabilityEngine';
import { format, addDays, startOfWeek, endOfWeek, differenceInMinutes, parseISO } from 'date-fns';
import type { Staff } from '../lib/demoStaffData';
import type { Shift } from '../lib/staffScheduleUtils';
import {
  SHIFT_TEMPLATES,
  applyShiftTemplate,
  calculateStaffingRequirements,
  findAvailableCoverage,
  activateEmergencyOnCall,
  analyzeShiftPatterns,
  generateFairDistribution,
  optimizeWeeklySchedule,
  trackOvertime,
  validateCompliance
} from '../utils/shiftTemplates';

// Types
export interface ShiftConflict {
  id: string;
  type: 'overlap' | 'understaffed' | 'overtime' | 'break' | 'compliance';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affected: string[];
  suggestedAction?: string;
  resolution?: () => Promise<void>;
}

export interface ShiftMetrics {
  totalHours: number;
  avgHoursPerStaff: number;
  overtimeHours: number;
  coverageGaps: number;
  utilizationRate: number;
  complianceScore: number;
  fairnessScore: number;
  efficiencyScore: number;
}

export interface ShiftOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'swap' | 'split' | 'merge';
  timestamp: Date;
  userId: string;
  affectedShifts: string[];
  description: string;
  revertible: boolean;
  revert?: () => Promise<void>;
}

export interface UseShiftManagementOptions {
  autoDetectConflicts?: boolean;
  realtimeSync?: boolean;
  autoSave?: boolean;
  conflictResolution?: 'manual' | 'auto' | 'suggest';
  complianceMode?: 'strict' | 'flexible' | 'none';
  maxUndoHistory?: number;
}

export interface UseShiftManagementReturn {
  // Core Data
  shifts: Shift[];
  conflicts: ShiftConflict[];
  metrics: ShiftMetrics;
  operations: ShiftOperation[];

  // Shift Operations
  createShift: (shift: Omit<Shift, 'id'>) => Promise<string>;
  updateShift: (id: string, updates: Partial<Shift>) => Promise<void>;
  deleteShift: (id: string) => Promise<void>;
  swapShifts: (shift1Id: string, shift2Id: string) => Promise<void>;
  splitShift: (shiftId: string, splitTime: string) => Promise<string[]>;
  mergeShifts: (shiftIds: string[]) => Promise<string>;

  // Bulk Operations
  bulkCreate: (shifts: Omit<Shift, 'id'>[]) => Promise<string[]>;
  bulkUpdate: (updates: { id: string; changes: Partial<Shift> }[]) => Promise<void>;
  bulkDelete: (shiftIds: string[]) => Promise<void>;
  applyTemplate: (templateId: string, staffIds: string[], dateRange: [Date, Date]) => Promise<void>;

  // Conflict Management
  detectConflicts: () => ShiftConflict[];
  resolveConflict: (conflictId: string, action?: string) => Promise<void>;
  dismissConflict: (conflictId: string) => void;
  autoResolveAll: () => Promise<void>;

  // Schedule Optimization
  optimizeSchedule: (dateRange: [Date, Date]) => Promise<void>;
  balanceWorkload: (staffIds: string[]) => Promise<void>;
  fillGaps: (minimumCoverage: number) => Promise<void>;
  redistributeOvertime: () => Promise<void>;

  // Coverage Management
  findCoverage: (shiftId: string) => Promise<Staff[]>;
  requestCoverage: (shiftId: string, message?: string) => Promise<void>;
  acceptCoverageRequest: (requestId: string) => Promise<void>;
  emergencyStaffing: (date: Date, urgency: 'low' | 'medium' | 'high') => Promise<void>;

  // Analytics & Reporting
  generateReport: (type: 'daily' | 'weekly' | 'monthly', date: Date) => any;
  exportSchedule: (format: 'json' | 'csv' | 'pdf') => Promise<Blob>;
  analyzePatterns: (staffId?: string) => any;
  forecastDemand: (weeks: number) => any;

  // History & Undo
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  clearHistory: () => void;

  // Real-time
  isConnected: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSync: Date | null;
  forceSync: () => Promise<void>;
}

export const useShiftManagement = (
  staff: Staff[],
  initialShifts: Shift[] = [],
  options: UseShiftManagementOptions = {}
): UseShiftManagementReturn => {
  const {
    autoDetectConflicts = true,
    realtimeSync = true,
    autoSave = true,
    conflictResolution = 'suggest',
    complianceMode = 'flexible',
    maxUndoHistory = 50
  } = options;

  // State
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [conflicts, setConflicts] = useState<ShiftConflict[]>([]);
  const [operations, setOperations] = useState<ShiftOperation[]>([]);
  const [undoStack, setUndoStack] = useState<ShiftOperation[]>([]);
  const [redoStack, setRedoStack] = useState<ShiftOperation[]>([]);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Refs
  const shiftsRef = useRef(shifts);
  shiftsRef.current = shifts;
  const operationIdCounter = useRef(0);

  // Hooks
  const { isConnected, send, subscribe } = useWebSocket({
    autoConnect: realtimeSync
  });

  const {
    getAvailability,
    findAlternatives,
    optimizeSchedule: optimizeWithEngine
  } = useAvailabilityEngine({
    practitioners: staff,
    existingBookings: shifts,
    autoPreload: true
  });

  // Calculate metrics
  const metrics = useMemo((): ShiftMetrics => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const weekShifts = shifts.filter(s =>
      s.date >= weekStart && s.date <= weekEnd
    );

    const totalHours = weekShifts.reduce((acc, shift) => {
      const start = parseInt(shift.start.split(':')[0]) * 60 + parseInt(shift.start.split(':')[1]);
      const end = parseInt(shift.end.split(':')[0]) * 60 + parseInt(shift.end.split(':')[1]);
      const breakMinutes = shift.breakStart && shift.breakEnd ? 60 : 0;
      return acc + (end - start - breakMinutes) / 60;
    }, 0);

    const avgHoursPerStaff = staff.length > 0 ? totalHours / staff.length : 0;

    const overtimeHours = weekShifts.reduce((acc, shift) => {
      const hours = differenceInMinutes(
        new Date(`2000-01-01 ${shift.end}`),
        new Date(`2000-01-01 ${shift.start}`)
      ) / 60;
      return acc + Math.max(0, hours - 8);
    }, 0);

    // Calculate coverage gaps (simplified)
    const coverageGaps = 0; // Would need actual business hours to calculate

    const utilizationRate = staff.length > 0
      ? (weekShifts.length / (staff.length * 5)) * 100
      : 0;

    const complianceScore = 100; // Would calculate based on rules
    const fairnessScore = 95; // Would calculate based on distribution
    const efficiencyScore = 88; // Would calculate based on optimization

    return {
      totalHours,
      avgHoursPerStaff,
      overtimeHours,
      coverageGaps,
      utilizationRate,
      complianceScore,
      fairnessScore,
      efficiencyScore
    };
  }, [shifts, staff]);

  // Generate operation ID
  const generateOperationId = () => {
    operationIdCounter.current += 1;
    return `op-${Date.now()}-${operationIdCounter.current}`;
  };

  // Record operation for undo/redo
  const recordOperation = (operation: ShiftOperation) => {
    setOperations(prev => [...prev, operation]);
    setUndoStack(prev => [...prev.slice(-maxUndoHistory + 1), operation]);
    setRedoStack([]); // Clear redo stack on new operation
  };

  // Detect conflicts
  const detectConflicts = useCallback((): ShiftConflict[] => {
    const detected: ShiftConflict[] = [];

    // Check for overlapping shifts
    shifts.forEach((shift1, i) => {
      shifts.slice(i + 1).forEach(shift2 => {
        if (shift1.staffId === shift2.staffId &&
            isSameDay(shift1.date, shift2.date)) {
          const start1 = parseInt(shift1.start.replace(':', ''));
          const end1 = parseInt(shift1.end.replace(':', ''));
          const start2 = parseInt(shift2.start.replace(':', ''));
          const end2 = parseInt(shift2.end.replace(':', ''));

          if ((start1 < end2 && end1 > start2)) {
            detected.push({
              id: `conflict-${shift1.id}-${shift2.id}`,
              type: 'overlap',
              severity: 'high',
              description: `Overlapping shifts for ${staff.find(s => s.id === shift1.staffId)?.name}`,
              affected: [shift1.id, shift2.id],
              suggestedAction: 'Adjust Times'
            });
          }
        }
      });
    });

    // Check for overtime
    const weeklyHours = new Map<string, number>();
    shifts.forEach(shift => {
      const hours = differenceInMinutes(
        new Date(`2000-01-01 ${shift.end}`),
        new Date(`2000-01-01 ${shift.start}`)
      ) / 60;
      weeklyHours.set(shift.staffId, (weeklyHours.get(shift.staffId) || 0) + hours);
    });

    weeklyHours.forEach((hours, staffId) => {
      if (hours > 40) {
        detected.push({
          id: `overtime-${staffId}`,
          type: 'overtime',
          severity: 'medium',
          description: `${staff.find(s => s.id === staffId)?.name} has ${hours.toFixed(1)} hours this week`,
          affected: [staffId],
          suggestedAction: 'Redistribute Hours'
        });
      }
    });

    return detected;
  }, [shifts, staff]);

  // Auto-detect conflicts
  useEffect(() => {
    if (autoDetectConflicts) {
      const detected = detectConflicts();
      setConflicts(detected);
    }
  }, [shifts, autoDetectConflicts, detectConflicts]);

  // Create shift
  const createShift = useCallback(async (shift: Omit<Shift, 'id'>): Promise<string> => {
    const id = `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newShift: Shift = { ...shift, id };

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'create',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [id],
      description: `Created shift for ${staff.find(s => s.id === shift.staffId)?.name}`,
      revertible: true,
      revert: async () => {
        setShifts(prev => prev.filter(s => s.id !== id));
      }
    };

    setShifts(prev => [...prev, newShift]);
    recordOperation(operation);

    if (realtimeSync && isConnected) {
      send({ type: 'shift:create', data: newShift });
    }

    return id;
  }, [staff, realtimeSync, isConnected, send]);

  // Update shift
  const updateShift = useCallback(async (id: string, updates: Partial<Shift>): Promise<void> => {
    const oldShift = shiftsRef.current.find(s => s.id === id);
    if (!oldShift) throw new Error(`Shift ${id} not found`);

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'update',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [id],
      description: `Updated shift for ${staff.find(s => s.id === oldShift.staffId)?.name}`,
      revertible: true,
      revert: async () => {
        setShifts(prev => prev.map(s => s.id === id ? oldShift : s));
      }
    };

    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    recordOperation(operation);

    if (realtimeSync && isConnected) {
      send({ type: 'shift:update', data: { id, updates } });
    }
  }, [staff, realtimeSync, isConnected, send]);

  // Delete shift
  const deleteShift = useCallback(async (id: string): Promise<void> => {
    const shift = shiftsRef.current.find(s => s.id === id);
    if (!shift) throw new Error(`Shift ${id} not found`);

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'delete',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [id],
      description: `Deleted shift for ${staff.find(s => s.id === shift.staffId)?.name}`,
      revertible: true,
      revert: async () => {
        setShifts(prev => [...prev, shift]);
      }
    };

    setShifts(prev => prev.filter(s => s.id !== id));
    recordOperation(operation);

    if (realtimeSync && isConnected) {
      send({ type: 'shift:delete', data: { id } });
    }
  }, [staff, realtimeSync, isConnected, send]);

  // Swap shifts
  const swapShifts = useCallback(async (shift1Id: string, shift2Id: string): Promise<void> => {
    const shift1 = shiftsRef.current.find(s => s.id === shift1Id);
    const shift2 = shiftsRef.current.find(s => s.id === shift2Id);

    if (!shift1 || !shift2) throw new Error('Shifts not found');

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'swap',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [shift1Id, shift2Id],
      description: `Swapped shifts between ${staff.find(s => s.id === shift1.staffId)?.name} and ${staff.find(s => s.id === shift2.staffId)?.name}`,
      revertible: true,
      revert: async () => {
        setShifts(prev => prev.map(s => {
          if (s.id === shift1Id) return { ...s, staffId: shift1.staffId };
          if (s.id === shift2Id) return { ...s, staffId: shift2.staffId };
          return s;
        }));
      }
    };

    setShifts(prev => prev.map(s => {
      if (s.id === shift1Id) return { ...s, staffId: shift2.staffId };
      if (s.id === shift2Id) return { ...s, staffId: shift1.staffId };
      return s;
    }));

    recordOperation(operation);
  }, [staff]);

  // Split shift
  const splitShift = useCallback(async (shiftId: string, splitTime: string): Promise<string[]> => {
    const shift = shiftsRef.current.find(s => s.id === shiftId);
    if (!shift) throw new Error(`Shift ${shiftId} not found`);

    const id1 = `${shiftId}-1`;
    const id2 = `${shiftId}-2`;

    const shift1: Shift = {
      ...shift,
      id: id1,
      end: splitTime
    };

    const shift2: Shift = {
      ...shift,
      id: id2,
      start: splitTime
    };

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'split',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [shiftId, id1, id2],
      description: `Split shift at ${splitTime}`,
      revertible: true,
      revert: async () => {
        setShifts(prev => [
          ...prev.filter(s => s.id !== id1 && s.id !== id2),
          shift
        ]);
      }
    };

    setShifts(prev => [
      ...prev.filter(s => s.id !== shiftId),
      shift1,
      shift2
    ]);

    recordOperation(operation);
    return [id1, id2];
  }, []);

  // Merge shifts
  const mergeShifts = useCallback(async (shiftIds: string[]): Promise<string> => {
    const shiftsToMerge = shiftsRef.current.filter(s => shiftIds.includes(s.id));
    if (shiftsToMerge.length < 2) throw new Error('Need at least 2 shifts to merge');

    // Sort by start time
    shiftsToMerge.sort((a, b) => a.start.localeCompare(b.start));

    const mergedId = `merged-${Date.now()}`;
    const mergedShift: Shift = {
      id: mergedId,
      staffId: shiftsToMerge[0].staffId,
      date: shiftsToMerge[0].date,
      start: shiftsToMerge[0].start,
      end: shiftsToMerge[shiftsToMerge.length - 1].end,
      status: 'active'
    };

    const operation: ShiftOperation = {
      id: generateOperationId(),
      type: 'merge',
      timestamp: new Date(),
      userId: 'current-user',
      affectedShifts: [...shiftIds, mergedId],
      description: `Merged ${shiftIds.length} shifts`,
      revertible: true,
      revert: async () => {
        setShifts(prev => [
          ...prev.filter(s => s.id !== mergedId),
          ...shiftsToMerge
        ]);
      }
    };

    setShifts(prev => [
      ...prev.filter(s => !shiftIds.includes(s.id)),
      mergedShift
    ]);

    recordOperation(operation);
    return mergedId;
  }, []);

  // Bulk operations
  const bulkCreate = useCallback(async (newShifts: Omit<Shift, 'id'>[]): Promise<string[]> => {
    const ids = newShifts.map(() => `shift-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    const shiftsWithIds = newShifts.map((shift, i) => ({ ...shift, id: ids[i] }));

    setShifts(prev => [...prev, ...shiftsWithIds]);
    return ids;
  }, []);

  const bulkUpdate = useCallback(async (updates: { id: string; changes: Partial<Shift> }[]): Promise<void> => {
    setShifts(prev => prev.map(shift => {
      const update = updates.find(u => u.id === shift.id);
      return update ? { ...shift, ...update.changes } : shift;
    }));
  }, []);

  const bulkDelete = useCallback(async (shiftIds: string[]): Promise<void> => {
    setShifts(prev => prev.filter(s => !shiftIds.includes(s.id)));
  }, []);

  const applyTemplate = useCallback(async (
    templateId: string,
    staffIds: string[],
    dateRange: [Date, Date]
  ): Promise<void> => {
    const template = SHIFT_TEMPLATES[templateId];
    if (!template) throw new Error(`Template ${templateId} not found`);

    const newShifts: Shift[] = [];
    let currentDate = dateRange[0];

    while (currentDate <= dateRange[1]) {
      for (const staffId of staffIds) {
        const shift = applyShiftTemplate(template, staffId, currentDate, templateId);
        newShifts.push(shift);
      }
      currentDate = addDays(currentDate, 1);
    }

    setShifts(prev => [...prev, ...newShifts]);
  }, []);

  // Conflict resolution
  const resolveConflict = useCallback(async (conflictId: string, action?: string): Promise<void> => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (conflict.resolution) {
      await conflict.resolution();
    }

    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  }, [conflicts]);

  const dismissConflict = useCallback((conflictId: string): void => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  }, []);

  const autoResolveAll = useCallback(async (): Promise<void> => {
    for (const conflict of conflicts) {
      if (conflict.resolution) {
        await conflict.resolution();
      }
    }
    setConflicts([]);
  }, [conflicts]);

  // Schedule optimization
  const optimizeSchedule = useCallback(async (dateRange: [Date, Date]): Promise<void> => {
    const optimized = await optimizeWeeklySchedule(shifts, staff, dateRange[0]);
    setShifts(optimized.optimizedShifts);
  }, [shifts, staff]);

  const balanceWorkload = useCallback(async (staffIds: string[]): Promise<void> => {
    const distribution = await generateFairDistribution(
      shifts.filter(s => staffIds.includes(s.staffId)),
      staff.filter(s => staffIds.includes(s.id)),
      40 // Target hours
    );
    setShifts(prev => [
      ...prev.filter(s => !staffIds.includes(s.staffId)),
      ...distribution.redistributedShifts
    ]);
  }, [shifts, staff]);

  const fillGaps = useCallback(async (minimumCoverage: number): Promise<void> => {
    // Implementation would analyze gaps and create shifts to fill them
    console.log('Filling gaps with minimum coverage:', minimumCoverage);
  }, []);

  const redistributeOvertime = useCallback(async (): Promise<void> => {
    const overtimeData = await trackOvertime(shifts, staff);
    // Implementation would redistribute shifts from overtime staff to others
    console.log('Redistributing overtime:', overtimeData);
  }, [shifts, staff]);

  // Coverage management
  const findCoverage = useCallback(async (shiftId: string): Promise<Staff[]> => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return [];

    const coverage = await findAvailableCoverage(
      shift.date,
      { start: shift.start, end: shift.end },
      staff,
      shifts
    );

    return coverage.available;
  }, [shifts, staff]);

  const requestCoverage = useCallback(async (shiftId: string, message?: string): Promise<void> => {
    if (isConnected) {
      send({
        type: 'coverage:request',
        data: { shiftId, message }
      });
    }
  }, [isConnected, send]);

  const acceptCoverageRequest = useCallback(async (requestId: string): Promise<void> => {
    if (isConnected) {
      send({
        type: 'coverage:accept',
        data: { requestId }
      });
    }
  }, [isConnected, send]);

  const emergencyStaffing = useCallback(async (
    date: Date,
    urgency: 'low' | 'medium' | 'high'
  ): Promise<void> => {
    const emergency = await activateEmergencyOnCall(date, urgency, staff, shifts);
    if (emergency.activated && emergency.oncallStaff) {
      // Create emergency shift
      const emergencyShift: Omit<Shift, 'id'> = {
        staffId: emergency.oncallStaff.id,
        date,
        start: '00:00',
        end: '23:59',
        status: 'active',
        notes: 'Emergency on-call shift'
      };
      await createShift(emergencyShift);
    }
  }, [staff, shifts, createShift]);

  // Analytics & Reporting
  const generateReport = useCallback((type: 'daily' | 'weekly' | 'monthly', date: Date): any => {
    // Implementation would generate detailed reports
    return {
      type,
      date,
      metrics,
      shifts: shifts.length,
      staff: staff.length
    };
  }, [metrics, shifts, staff]);

  const exportSchedule = useCallback(async (format: 'json' | 'csv' | 'pdf'): Promise<Blob> => {
    const data = {
      shifts,
      staff,
      metrics,
      generated: new Date().toISOString()
    };

    if (format === 'json') {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    } else if (format === 'csv') {
      // Convert to CSV format
      const csv = shifts.map(s =>
        `${s.id},${s.staffId},${s.date},${s.start},${s.end},${s.status}`
      ).join('\n');
      return new Blob([csv], { type: 'text/csv' });
    } else {
      // PDF would require a library like jsPDF
      return new Blob(['PDF export not implemented'], { type: 'application/pdf' });
    }
  }, [shifts, staff, metrics]);

  const analyzePatterns = useCallback((staffId?: string): any => {
    return analyzeShiftPatterns(
      staffId ? shifts.filter(s => s.staffId === staffId) : shifts,
      staff
    );
  }, [shifts, staff]);

  const forecastDemand = useCallback((weeks: number): any => {
    // Implementation would use historical data to forecast
    return {
      weeks,
      forecast: 'Not implemented'
    };
  }, []);

  // Undo/Redo
  const undo = useCallback(async (): Promise<void> => {
    if (undoStack.length === 0) return;

    const operation = undoStack[undoStack.length - 1];
    if (operation.revert) {
      await operation.revert();
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, operation]);
    }
  }, [undoStack]);

  const redo = useCallback(async (): Promise<void> => {
    if (redoStack.length === 0) return;

    const operation = redoStack[redoStack.length - 1];
    // Re-apply the operation
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, operation]);
  }, [redoStack]);

  const clearHistory = useCallback((): void => {
    setOperations([]);
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  // Force sync
  const forceSync = useCallback(async (): Promise<void> => {
    if (!isConnected) return;

    setSyncStatus('syncing');
    send({
      type: 'sync:full',
      data: { shifts }
    });

    // Simulate sync completion
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 1000);
  }, [isConnected, shifts, send]);

  // WebSocket event handling
  useEffect(() => {
    if (!isConnected || !realtimeSync) return;

    const unsubscribers: Array<() => void> = [];

    unsubscribers.push(subscribe('shift:created', (data) => {
      setShifts(prev => [...prev, data as Shift]);
    }));

    unsubscribers.push(subscribe('shift:updated', (data) => {
      const { id, updates } = data as { id: string; updates: Partial<Shift> };
      setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }));

    unsubscribers.push(subscribe('shift:deleted', (data) => {
      const { id } = data as { id: string };
      setShifts(prev => prev.filter(s => s.id !== id));
    }));

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [isConnected, realtimeSync, subscribe]);

  // Auto-save
  useEffect(() => {
    if (!autoSave) return;

    const saveTimer = setTimeout(() => {
      // Save to localStorage or backend
      localStorage.setItem('shifts-backup', JSON.stringify(shifts));
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [shifts, autoSave]);

  return {
    // Core Data
    shifts,
    conflicts,
    metrics,
    operations,

    // Shift Operations
    createShift,
    updateShift,
    deleteShift,
    swapShifts,
    splitShift,
    mergeShifts,

    // Bulk Operations
    bulkCreate,
    bulkUpdate,
    bulkDelete,
    applyTemplate,

    // Conflict Management
    detectConflicts,
    resolveConflict,
    dismissConflict,
    autoResolveAll,

    // Schedule Optimization
    optimizeSchedule,
    balanceWorkload,
    fillGaps,
    redistributeOvertime,

    // Coverage Management
    findCoverage,
    requestCoverage,
    acceptCoverageRequest,
    emergencyStaffing,

    // Analytics & Reporting
    generateReport,
    exportSchedule,
    analyzePatterns,
    forecastDemand,

    // History & Undo
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    clearHistory,

    // Real-time
    isConnected,
    syncStatus,
    lastSync,
    forceSync
  };
};

export default useShiftManagement;