// Staff Card Component for Schedule Display
import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Star, Calendar, Clock, Phone, Mail,
  ChevronRight, Activity, Award
} from 'lucide-react';
import type { Staff, ShiftTime } from '../../lib/demoStaffData';
import { formatShiftDisplay, Shift } from '../../lib/staffScheduleUtils';

interface StaffCardProps {
  staff: Staff;
  shifts?: Shift[];
  isSelected?: boolean;
  onClick?: () => void;
  onScheduleClick?: () => void;
  compact?: boolean;
  showStats?: boolean;
}

const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  shifts = [],
  isSelected = false,
  onClick,
  onScheduleClick,
  compact = false,
  showStats = true
}) => {
  // Calculate today's schedule
  const today = new Date();
  const todayDay = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof staff.defaultSchedule;
  const todaySchedule = staff.defaultSchedule[todayDay];

  // Calculate weekly hours
  const calculateWeeklyHours = (): number => {
    let totalMinutes = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

    days.forEach(day => {
      const daySchedule = staff.defaultSchedule[day];
      daySchedule.forEach(shift => {
        const [startHour, startMin] = shift.start.split(':').map(Number);
        const [endHour, endMin] = shift.end.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        let shiftMinutes = endMinutes - startMinutes;

        // Subtract break time if exists
        if (shift.breakStart && shift.breakEnd) {
          const [breakStartHour, breakStartMin] = shift.breakStart.split(':').map(Number);
          const [breakEndHour, breakEndMin] = shift.breakEnd.split(':').map(Number);
          const breakMinutes = (breakEndHour * 60 + breakEndMin) - (breakStartHour * 60 + breakStartMin);
          shiftMinutes -= breakMinutes;
        }

        totalMinutes += shiftMinutes;
      });
    });

    return Math.round(totalMinutes / 60);
  };

  const weeklyHours = calculateWeeklyHours();

  // Format shift time for display
  const formatShiftTime = (shift: ShiftTime): string => {
    let timeStr = `${shift.start} - ${shift.end}`;
    if (shift.breakStart && shift.breakEnd) {
      timeStr += ` (Break: ${shift.breakStart}-${shift.breakEnd})`;
    }
    if (shift.maxBookings && shift.maxBookings > 1) {
      timeStr += ` • ${shift.maxBookings} patients`;
    }
    return timeStr;
  };

  // Get role icon and color
  const getRoleStyle = () => {
    switch (staff.role) {
      case 'doctor':
        return { icon: Activity, bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'hairdresser':
        return { icon: Award, bgColor: 'bg-pink-50', textColor: 'text-pink-600' };
      case 'therapist':
        return { icon: User, bgColor: 'bg-purple-50', textColor: 'text-purple-600' };
      case 'mechanic':
        return { icon: Activity, bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
      default:
        return { icon: User, bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
    }
  };

  const roleStyle = getRoleStyle();
  const RoleIcon = roleStyle.icon;

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          p-3 rounded-lg border-2 cursor-pointer transition-all
          ${isSelected
            ? 'border-blue-500 bg-blue-50 shadow-lg'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: staff.color }}
            >
              {staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{staff.name}</h4>
              <p className="text-xs text-gray-500">{staff.specialties[0]}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        rounded-xl border-2 overflow-hidden transition-all
        ${isSelected
          ? 'border-blue-500 shadow-xl'
          : 'border-gray-200 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {/* Header with gradient */}
      <div
        className="p-4 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${staff.color} 0%, ${staff.color}dd 100%)`
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{staff.name}</h3>
              <p className="text-white/90 text-sm mt-1">
                {staff.specialties.join(' • ')}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${roleStyle.bgColor} bg-opacity-90`}>
              <RoleIcon className={`w-5 h-5 ${roleStyle.textColor}`} />
            </div>
          </div>

          {/* Rating and stats */}
          {showStats && (
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{staff.rating}</span>
              </div>
              <div className="text-sm text-white/90">
                {staff.bookingCount.toLocaleString()} bookings
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{staff.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{staff.phone}</span>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Today's Schedule
            </h4>
            {onScheduleClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleClick();
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View Full
              </button>
            )}
          </div>

          {todaySchedule.length > 0 ? (
            <div className="space-y-1">
              {todaySchedule.map((shift, index) => (
                <div
                  key={index}
                  className="text-sm bg-gray-50 rounded px-2 py-1 flex items-center gap-2"
                >
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-700">{formatShiftTime(shift)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No shifts today</p>
          )}
        </div>

        {/* Weekly Hours */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Weekly Hours</span>
            <span className="font-semibold text-gray-900">{weeklyHours}h</span>
          </div>
        </div>

        {/* Action Button */}
        {onClick && (
          <button
            onClick={onClick}
            className="mt-4 w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Manage Schedule
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StaffCard;