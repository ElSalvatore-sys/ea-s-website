// German public holidays for business operations
// This includes both national and Hesse state holidays (for Wiesbaden)

export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
  nameEn: string;
  type: 'national' | 'state' | 'regional';
}

// Get German holidays for a specific year
export function getGermanHolidays(year: number): Holiday[] {
  const holidays: Holiday[] = [];
  
  // Fixed date holidays
  holidays.push({
    date: `${year}-01-01`,
    name: 'Neujahr',
    nameEn: "New Year's Day",
    type: 'national'
  });
  
  holidays.push({
    date: `${year}-05-01`,
    name: 'Tag der Arbeit',
    nameEn: 'Labour Day',
    type: 'national'
  });
  
  holidays.push({
    date: `${year}-10-03`,
    name: 'Tag der Deutschen Einheit',
    nameEn: 'German Unity Day',
    type: 'national'
  });
  
  holidays.push({
    date: `${year}-12-25`,
    name: '1. Weihnachtstag',
    nameEn: 'Christmas Day',
    type: 'national'
  });
  
  holidays.push({
    date: `${year}-12-26`,
    name: '2. Weihnachtstag',
    nameEn: 'Boxing Day',
    type: 'national'
  });
  
  // Calculate Easter and Easter-dependent holidays
  const easter = calculateEaster(year);
  
  // Good Friday (2 days before Easter)
  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);
  holidays.push({
    date: formatDate(goodFriday),
    name: 'Karfreitag',
    nameEn: 'Good Friday',
    type: 'national'
  });
  
  // Easter Monday (1 day after Easter)
  const easterMonday = new Date(easter);
  easterMonday.setDate(easterMonday.getDate() + 1);
  holidays.push({
    date: formatDate(easterMonday),
    name: 'Ostermontag',
    nameEn: 'Easter Monday',
    type: 'national'
  });
  
  // Ascension Day (39 days after Easter)
  const ascension = new Date(easter);
  ascension.setDate(ascension.getDate() + 39);
  holidays.push({
    date: formatDate(ascension),
    name: 'Christi Himmelfahrt',
    nameEn: 'Ascension Day',
    type: 'national'
  });
  
  // Whit Monday (50 days after Easter)
  const whitMonday = new Date(easter);
  whitMonday.setDate(whitMonday.getDate() + 50);
  holidays.push({
    date: formatDate(whitMonday),
    name: 'Pfingstmontag',
    nameEn: 'Whit Monday',
    type: 'national'
  });
  
  // Corpus Christi (60 days after Easter) - Hesse state holiday
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(corpusChristi.getDate() + 60);
  holidays.push({
    date: formatDate(corpusChristi),
    name: 'Fronleichnam',
    nameEn: 'Corpus Christi',
    type: 'state'
  });
  
  return holidays.sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate Easter Sunday using Gauss's Easter algorithm
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

// Format date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Check if a specific date is a German holiday
export function isGermanHoliday(date: Date | string): Holiday | null {
  const dateStr = typeof date === 'string' ? date : formatDate(date);
  const year = typeof date === 'string' 
    ? parseInt(date.split('-')[0]) 
    : date.getFullYear();
  
  const holidays = getGermanHolidays(year);
  return holidays.find(h => h.date === dateStr) || null;
}

// Check if date is a business day in Germany
export function isGermanBusinessDay(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = d.getDay();
  
  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }
  
  // Holiday check
  if (isGermanHoliday(d)) {
    return false;
  }
  
  return true;
}

// Get business hours for Germany (typical office hours)
export function getGermanBusinessHours() {
  return {
    start: '09:00',
    end: '17:00',
    lunchBreak: {
      start: '12:00',
      end: '13:00'
    }
  };
}

// Check if a time slot falls within Mittagspause
export function isMittagspause(time: string): boolean {
  const hour = parseInt(time.split(':')[0]);
  return hour === 12;
}

// Get next available business day
export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (!isGermanBusinessDay(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}