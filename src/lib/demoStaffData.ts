// Demo Staff Data for Testing
export interface ShiftTime {
  start: string; // '09:00'
  end: string; // '17:00'
  breakStart?: string; // '12:00'
  breakEnd?: string; // '13:00'
  maxBookings?: number; // Concurrent appointments
}

export interface WeekSchedule {
  monday: ShiftTime[];
  tuesday: ShiftTime[];
  wednesday: ShiftTime[];
  thursday: ShiftTime[];
  friday: ShiftTime[];
  saturday: ShiftTime[];
  sunday: ShiftTime[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'doctor' | 'hairdresser' | 'therapist' | 'mechanic';
  specialties: string[];
  email: string;
  phone: string;
  color: string; // For calendar display
  avatar?: string;
  rating: number;
  bookingCount: number;
  defaultSchedule: WeekSchedule;
}

// Demo Doctors with varied schedules
export const DEMO_DOCTORS: Staff[] = [
  {
    id: 'dr-schmidt',
    name: 'Dr. Sarah Schmidt',
    role: 'doctor',
    specialties: ['General Practice', 'Pediatrics'],
    email: 'sarah.schmidt@medical.de',
    phone: '+49 611 123456',
    rating: 4.9,
    bookingCount: 1247,
    color: '#0891B2', // Cyan
    defaultSchedule: {
      monday: [
        { start: '08:00', end: '12:00', maxBookings: 1 },
        { start: '14:00', end: '18:00', maxBookings: 1 }
      ],
      tuesday: [
        { start: '08:00', end: '12:00', maxBookings: 1 },
        { start: '14:00', end: '18:00', maxBookings: 1 }
      ],
      wednesday: [{ start: '10:00', end: '14:00', maxBookings: 1 }], // Half day
      thursday: [
        { start: '08:00', end: '12:00', maxBookings: 1 },
        { start: '14:00', end: '18:00', maxBookings: 1 }
      ],
      friday: [
        { start: '08:00', end: '12:00', maxBookings: 1 },
        { start: '13:00', end: '16:00', maxBookings: 1 }
      ],
      saturday: [], // Closed
      sunday: [] // Closed
    }
  },
  {
    id: 'dr-mueller',
    name: 'Dr. Thomas Müller',
    role: 'doctor',
    specialties: ['Cardiology', 'Internal Medicine'],
    email: 'thomas.mueller@medical.de',
    phone: '+49 611 234567',
    rating: 4.8,
    bookingCount: 892,
    color: '#059669', // Green
    defaultSchedule: {
      monday: [{ start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30', maxBookings: 1 }],
      tuesday: [{ start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30', maxBookings: 1 }],
      wednesday: [], // Off
      thursday: [{ start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30', maxBookings: 1 }],
      friday: [{ start: '09:00', end: '17:00', breakStart: '12:30', breakEnd: '13:30', maxBookings: 1 }],
      saturday: [{ start: '09:00', end: '13:00', maxBookings: 1 }], // Saturday morning
      sunday: []
    }
  },
  {
    id: 'dr-weber',
    name: 'Dr. Anna Weber',
    role: 'doctor',
    specialties: ['Dermatology', 'Aesthetic Medicine'],
    email: 'anna.weber@medical.de',
    phone: '+49 611 345678',
    rating: 5.0,
    bookingCount: 2103,
    color: '#DC2626', // Red
    defaultSchedule: {
      monday: [{ start: '11:00', end: '19:00', maxBookings: 2 }], // Can see 2 patients
      tuesday: [{ start: '11:00', end: '19:00', maxBookings: 2 }],
      wednesday: [{ start: '11:00', end: '19:00', maxBookings: 2 }],
      thursday: [{ start: '11:00', end: '19:00', maxBookings: 2 }],
      friday: [{ start: '09:00', end: '15:00', maxBookings: 2 }],
      saturday: [],
      sunday: []
    }
  },
  {
    id: 'dr-fischer',
    name: 'Dr. Michael Fischer',
    role: 'doctor',
    specialties: ['Orthopedics', 'Sports Medicine'],
    email: 'michael.fischer@medical.de',
    phone: '+49 611 456789',
    rating: 4.7,
    bookingCount: 1456,
    color: '#7C3AED', // Purple
    defaultSchedule: {
      monday: [
        { start: '07:00', end: '12:00', maxBookings: 1 }, // Early morning
        { start: '15:00', end: '19:00', maxBookings: 1 }
      ],
      tuesday: [{ start: '07:00', end: '12:00', maxBookings: 1 }],
      wednesday: [
        { start: '07:00', end: '12:00', maxBookings: 1 },
        { start: '15:00', end: '19:00', maxBookings: 1 }
      ],
      thursday: [{ start: '07:00', end: '12:00', maxBookings: 1 }],
      friday: [
        { start: '07:00', end: '12:00', maxBookings: 1 },
        { start: '14:00', end: '17:00', maxBookings: 1 }
      ],
      saturday: [{ start: '08:00', end: '12:00', maxBookings: 1 }], // Weekend sports injuries
      sunday: []
    }
  }
];

// Demo Hairdressers with typical salon schedules
export const DEMO_HAIRDRESSERS: Staff[] = [
  {
    id: 'lisa-style',
    name: 'Lisa Marie',
    role: 'hairdresser',
    specialties: ['Color Specialist', 'Balayage', 'Wedding Styles'],
    email: 'lisa@salon.de',
    phone: '+49 611 567890',
    rating: 4.9,
    bookingCount: 3421,
    color: '#EC4899', // Pink
    defaultSchedule: {
      monday: [], // Off Mondays (typical for hairdressers)
      tuesday: [{ start: '10:00', end: '19:00', breakStart: '14:00', breakEnd: '14:30' }],
      wednesday: [{ start: '10:00', end: '19:00', breakStart: '14:00', breakEnd: '14:30' }],
      thursday: [{ start: '10:00', end: '20:00' }], // Late night
      friday: [{ start: '09:00', end: '19:00' }],
      saturday: [{ start: '09:00', end: '17:00' }], // Busy Saturday
      sunday: []
    }
  },
  {
    id: 'marco-cuts',
    name: 'Marco Giovanni',
    role: 'hairdresser',
    specialties: ['Men\'s Cuts', 'Beard Styling', 'Classic Cuts'],
    email: 'marco@salon.de',
    phone: '+49 611 678901',
    rating: 4.8,
    bookingCount: 2890,
    color: '#3B82F6', // Blue
    defaultSchedule: {
      monday: [],
      tuesday: [{ start: '09:00', end: '18:00' }],
      wednesday: [{ start: '09:00', end: '18:00' }],
      thursday: [{ start: '11:00', end: '20:00' }], // Late shift
      friday: [{ start: '09:00', end: '18:00' }],
      saturday: [{ start: '08:00', end: '16:00' }],
      sunday: [{ start: '10:00', end: '14:00' }] // Sunday morning only
    }
  },
  {
    id: 'sophie-trends',
    name: 'Sophie Chen',
    role: 'hairdresser',
    specialties: ['Asian Hair Expert', 'Keratin Treatment', 'Extensions'],
    email: 'sophie@salon.de',
    phone: '+49 611 789012',
    rating: 5.0,
    bookingCount: 1876,
    color: '#F59E0B', // Amber
    defaultSchedule: {
      monday: [{ start: '12:00', end: '20:00' }], // Afternoon/evening
      tuesday: [{ start: '12:00', end: '20:00' }],
      wednesday: [], // Off
      thursday: [{ start: '12:00', end: '20:00' }],
      friday: [{ start: '10:00', end: '18:00' }],
      saturday: [{ start: '10:00', end: '18:00' }],
      sunday: []
    }
  },
  {
    id: 'alex-creative',
    name: 'Alexander Wolf',
    role: 'hairdresser',
    specialties: ['Creative Coloring', 'Undercuts', 'Fashion Styles'],
    email: 'alex@salon.de',
    phone: '+49 611 890123',
    rating: 4.6,
    bookingCount: 1234,
    color: '#10B981', // Emerald
    defaultSchedule: {
      monday: [],
      tuesday: [{ start: '11:00', end: '19:00' }],
      wednesday: [{ start: '11:00', end: '19:00' }],
      thursday: [{ start: '11:00', end: '19:00' }],
      friday: [{ start: '11:00', end: '21:00' }], // Late Friday
      saturday: [{ start: '10:00', end: '18:00' }],
      sunday: []
    }
  }
];

// Combine all demo staff
export const ALL_DEMO_STAFF: Staff[] = [...DEMO_DOCTORS, ...DEMO_HAIRDRESSERS];

// Helper function to get staff by role
export const getStaffByRole = (role: Staff['role']): Staff[] => {
  return ALL_DEMO_STAFF.filter(staff => staff.role === role);
};

// Helper function to get staff by id
export const getStaffById = (id: string): Staff | undefined => {
  return ALL_DEMO_STAFF.find(staff => staff.id === id);
};

// Helper function to get staff schedule for a specific day
export const getStaffDaySchedule = (staffId: string, day: keyof WeekSchedule): ShiftTime[] => {
  const staff = getStaffById(staffId);
  if (!staff) return [];
  return staff.defaultSchedule[day];
};

// Helper function to check if staff is available at a specific time
export const isStaffAvailable = (
  staffId: string,
  day: keyof WeekSchedule,
  time: string
): boolean => {
  const daySchedule = getStaffDaySchedule(staffId, day);

  for (const shift of daySchedule) {
    const [checkHour, checkMin] = time.split(':').map(Number);
    const [startHour, startMin] = shift.start.split(':').map(Number);
    const [endHour, endMin] = shift.end.split(':').map(Number);

    const checkTime = checkHour * 60 + checkMin;
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    // Check if time is within shift
    if (checkTime >= startTime && checkTime < endTime) {
      // Check if it's during break time
      if (shift.breakStart && shift.breakEnd) {
        const [breakStartHour, breakStartMin] = shift.breakStart.split(':').map(Number);
        const [breakEndHour, breakEndMin] = shift.breakEnd.split(':').map(Number);
        const breakStartTime = breakStartHour * 60 + breakStartMin;
        const breakEndTime = breakEndHour * 60 + breakEndMin;

        if (checkTime >= breakStartTime && checkTime < breakEndTime) {
          return false; // During break
        }
      }
      return true; // Available during shift
    }
  }

  return false; // Not during any shift
};