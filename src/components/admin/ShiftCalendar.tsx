// Shift Calendar Component with Drag and Drop
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import type { Staff } from '../../lib/demoStaffData';
import type { Shift } from '../../lib/staffScheduleUtils';
import { timeToMinutes } from '../../lib/staffScheduleUtils';

interface ShiftCalendarProps {
  staff: Staff[];
  shifts: Shift[];
  currentWeek: Date;
  onNavigateWeek: (direction: 'prev' | 'next' | 'current') => void;
  onShiftClick: (shift: Shift) => void;
  onCreateShift: (staffId: string, date: Date, startTime: string, endTime: string) => void;
  onShiftUpdate: (shiftId: string, updates: Partial<Shift>) => void;
  selectedStaffId?: string | null;
  locale?: 'en' | 'de';
  viewMode?: 'week' | 'day';
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  staff,
  shifts,
  currentWeek,
  onNavigateWeek,
  onShiftClick,
  onCreateShift,
  onShiftUpdate,
  selectedStaffId,
  locale = 'en',
  viewMode = 'week'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ staffId: string; date: Date; time: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ time: number } | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{ staffId: string; date: Date; time: number } | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Time slots (7am to 10pm, 30-minute intervals)
  const timeSlots = Array.from({ length: 31 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Filter staff if one is selected
  const displayStaff = selectedStaffId
    ? staff.filter(s => s.id === selectedStaffId)
    : staff;

  // Get shifts for a specific staff member and day
  const getShiftsForDay = (staffId: string, date: Date): Shift[] => {
    return shifts.filter(shift =>
      shift.staffId === staffId &&
      shift.date.toDateString() === date.toDateString()
    );
  };

  // Calculate shift position and height
  const getShiftStyle = (shift: Shift) => {
    const startMinutes = timeToMinutes(shift.start);
    const endMinutes = timeToMinutes(shift.end);
    const startSlot = (startMinutes - 420) / 30; // 420 = 7am in minutes
    const duration = (endMinutes - startMinutes) / 30;

    return {
      top: `${startSlot * 40}px`,
      height: `${duration * 40 - 4}px`,
      backgroundColor: staff.find(s => s.id === shift.staffId)?.color || '#ccc'
    };
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, staffId: string, date: Date, timeSlot: string) => {
    e.preventDefault();
    const time = timeToMinutes(timeSlot);
    setIsDragging(true);
    setDragStart({ staffId, date, time });
    setDragEnd({ time });
  };

  // Handle drag move
  const handleDragMove = (e: React.MouseEvent, timeSlot: string) => {
    if (!isDragging || !dragStart) return;
    const time = timeToMinutes(timeSlot);
    setDragEnd({ time });
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging || !dragStart || !dragEnd) return;

    const startTime = Math.min(dragStart.time, dragEnd.time);
    const endTime = Math.max(dragStart.time, dragEnd.time);

    if (endTime - startTime >= 30) { // Minimum 30 minutes
      const startStr = `${Math.floor(startTime / 60).toString().padStart(2, '0')}:${(startTime % 60).toString().padStart(2, '0')}`;
      const endStr = `${Math.floor(endTime / 60).toString().padStart(2, '0')}:${(endTime % 60).toString().padStart(2, '0')}`;
      onCreateShift(dragStart.staffId, dragStart.date, startStr, endStr);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Render shift block
  const renderShift = (shift: Shift) => {
    const isActive = shift.status === 'active';
    const style = getShiftStyle(shift);

    return (
      <motion.div
        key={shift.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        onClick={() => onShiftClick(shift)}
        className={`
          absolute left-1 right-1 rounded cursor-pointer shadow-sm
          ${isActive ? 'hover:shadow-md' : 'opacity-50'}
        `}
        style={style}
      >
        <div className="p-1 text-white text-xs h-full flex flex-col">
          <div className="font-semibold">{shift.start} - {shift.end}</div>
          {shift.breakStart && (
            <div className="text-white/80">Break: {shift.breakStart}</div>
          )}
          {shift.notes && (
            <div className="text-white/70 truncate">{shift.notes}</div>
          )}
        </div>
      </motion.div>
    );
  };

  // Render drag preview
  const renderDragPreview = () => {
    if (!isDragging || !dragStart || !dragEnd) return null;

    const startTime = Math.min(dragStart.time, dragEnd.time);
    const endTime = Math.max(dragStart.time, dragEnd.time);
    const startSlot = (startTime - 420) / 30;
    const duration = (endTime - startTime) / 30;

    return (
      <div
        className="absolute left-1 right-1 bg-blue-400 opacity-50 rounded pointer-events-none"
        style={{
          top: `${startSlot * 40}px`,
          height: `${duration * 40 - 4}px`
        }}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigateWeek('prev')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentWeek, 'MMM d', { locale: locale === 'de' ? de : undefined })} -
            {' '}{format(addDays(currentWeek, 6), 'MMM d, yyyy', { locale: locale === 'de' ? de : undefined })}
          </h3>
          <button
            onClick={() => onNavigateWeek('next')}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => onNavigateWeek('current')}
          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
        >
          <Calendar className="w-4 h-4" />
          {locale === 'de' ? 'Heute' : 'Today'}
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto" ref={calendarRef}>
        <div className="min-w-[1200px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
            <div className="p-2 text-xs font-medium text-gray-500 border-r">
              {/* Empty corner cell */}
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 text-center border-r">
                <div className="font-semibold text-gray-900">
                  {format(day, 'EEE', { locale: locale === 'de' ? de : undefined })}
                </div>
                <div className="text-sm text-gray-500">
                  {format(day, 'MMM d', { locale: locale === 'de' ? de : undefined })}
                </div>
              </div>
            ))}
          </div>

          {/* Staff Rows */}
          {displayStaff.map(staffMember => (
            <div key={staffMember.id} className="grid grid-cols-8 border-b">
              {/* Staff Name */}
              <div className="p-3 border-r bg-gray-50 sticky left-0 z-10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: staffMember.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{staffMember.name}</div>
                    <div className="text-xs text-gray-500">{staffMember.role}</div>
                  </div>
                </div>
              </div>

              {/* Day Cells */}
              {weekDays.map((day, dayIndex) => {
                const dayShifts = getShiftsForDay(staffMember.id, day);
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={dayIndex}
                    className={`relative border-r min-h-[600px] ${isToday ? 'bg-blue-50/30' : ''}`}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={() => setHoveredSlot(null)}
                  >
                    {/* Time slot grid */}
                    {timeSlots.map((timeSlot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="absolute w-full h-10 border-b border-gray-100 hover:bg-gray-50"
                        style={{ top: `${slotIndex * 40}px` }}
                        onMouseDown={(e) => handleDragStart(e, staffMember.id, day, timeSlot)}
                        onMouseMove={(e) => handleDragMove(e, timeSlot)}
                        onMouseEnter={() => setHoveredSlot({ staffId: staffMember.id, date: day, time: timeToMinutes(timeSlot) })}
                      >
                        {slotIndex % 2 === 0 && (
                          <span className="absolute left-1 top-1 text-xs text-gray-400">
                            {timeSlot}
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Shifts */}
                    {dayShifts.map(shift => renderShift(shift))}

                    {/* Drag preview for this cell */}
                    {isDragging && dragStart?.staffId === staffMember.id && dragStart?.date.toDateString() === day.toDateString() && renderDragPreview()}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-3 bg-gray-50 border-t text-xs text-gray-600 text-center">
        {locale === 'de'
          ? 'Ziehen Sie, um Schichten zu erstellen • Klicken Sie auf Schichten zum Bearbeiten'
          : 'Drag to create shifts • Click shifts to edit'}
      </div>
    </div>
  );
};

export default ShiftCalendar;