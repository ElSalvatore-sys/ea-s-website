// Comprehensive Localization Utilities
// Handles date, time, currency, and phone formatting for different locales

import { format, parse, isValid } from 'date-fns';
import { de, enUS, fr, it } from 'date-fns/locale';

// ============================================
// TYPES
// ============================================

export type SupportedLocale = 'en' | 'de' | 'fr' | 'it';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  flag: string;
  dateFormat: string;
  timeFormat: string;
  currency: {
    symbol: string;
    position: 'before' | 'after';
    decimal: string;
    thousand: string;
  };
  phone: {
    countryCode: string;
    format: string;
    example: string;
  };
  businessHours: {
    lunchBreakStart: number; // Hour in 24h format
    lunchBreakEnd: number;
    lunchBreakName: string;
    closedDayName: string;
    workingDays: number[]; // 0 = Sunday, 6 = Saturday
  };
}

// ============================================
// LOCALE CONFIGURATIONS
// ============================================

export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'h:mm a',
    currency: {
      symbol: '€',
      position: 'before',
      decimal: '.',
      thousand: ','
    },
    phone: {
      countryCode: '+44',
      format: 'XXX XXXX XXXX',
      example: '+44 20 1234 5678'
    },
    businessHours: {
      lunchBreakStart: 12,
      lunchBreakEnd: 13,
      lunchBreakName: 'Lunch Break',
      closedDayName: 'Closed',
      workingDays: [1, 2, 3, 4, 5] // Monday to Friday
    }
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm',
    currency: {
      symbol: '€',
      position: 'after',
      decimal: ',',
      thousand: '.'
    },
    phone: {
      countryCode: '+49',
      format: 'XXX XXXXXXXX',
      example: '+49 30 12345678'
    },
    businessHours: {
      lunchBreakStart: 12,
      lunchBreakEnd: 13,
      lunchBreakName: 'Mittagspause',
      closedDayName: 'Ruhetag',
      workingDays: [1, 2, 3, 4, 5] // Montag bis Freitag
    }
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: {
      symbol: '€',
      position: 'after',
      decimal: ',',
      thousand: ' '
    },
    phone: {
      countryCode: '+33',
      format: 'X XX XX XX XX',
      example: '+33 1 23 45 67 89'
    },
    businessHours: {
      lunchBreakStart: 12,
      lunchBreakEnd: 14, // Extended French lunch
      lunchBreakName: 'Pause déjeuner',
      closedDayName: 'Fermé',
      workingDays: [1, 2, 3, 4, 5] // Lundi à Vendredi
    }
  },
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: {
      symbol: '€',
      position: 'after',
      decimal: ',',
      thousand: '.'
    },
    phone: {
      countryCode: '+39',
      format: 'XXX XXX XXXX',
      example: '+39 06 1234 5678'
    },
    businessHours: {
      lunchBreakStart: 13,
      lunchBreakEnd: 15, // Extended Italian lunch/siesta
      lunchBreakName: 'Pausa pranzo',
      closedDayName: 'Chiuso',
      workingDays: [1, 2, 3, 4, 5] // Lunedì a Venerdì
    }
  }
};

// ============================================
// DATE FORMATTING
// ============================================

const getDateFnsLocale = (locale: SupportedLocale) => {
  switch (locale) {
    case 'de': return de;
    case 'fr': return fr;
    case 'it': return it;
    default: return enUS;
  }
};

export const formatDate = (date: Date | string, locale: SupportedLocale): string => {
  const config = localeConfigs[locale];
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, config.dateFormat, {
    locale: getDateFnsLocale(locale)
  });
};

export const formatTime = (date: Date | string, locale: SupportedLocale): string => {
  const config = localeConfigs[locale];
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, config.timeFormat, {
    locale: getDateFnsLocale(locale)
  });
};

export const formatDateTime = (date: Date | string, locale: SupportedLocale): string => {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
};

// ============================================
// CURRENCY FORMATTING
// ============================================

export const formatCurrency = (amount: number, locale: SupportedLocale): string => {
  const config = localeConfigs[locale];
  
  // Format the number with proper decimal and thousand separators
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : 'fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  // Add currency symbol in correct position
  if (config.currency.position === 'before') {
    return `${config.currency.symbol}${formatted}`;
  } else {
    return `${formatted} ${config.currency.symbol}`;
  }
};

// ============================================
// PHONE NUMBER FORMATTING
// ============================================

export const formatPhoneNumber = (phone: string, locale: SupportedLocale): string => {
  const config = localeConfigs[locale];
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Add country code if missing
  if (!cleaned.startsWith('+')) {
    cleaned = config.phone.countryCode + cleaned;
  }
  
  // Format based on locale
  switch (locale) {
    case 'de':
      // German format: +49 30 12345678
      if (cleaned.startsWith('+49')) {
        const number = cleaned.substring(3);
        if (number.length >= 10) {
          return `+49 ${number.slice(0, 2)} ${number.slice(2, 10)}`;
        }
      }
      break;
      
    case 'fr':
      // French format: +33 1 23 45 67 89
      if (cleaned.startsWith('+33')) {
        const number = cleaned.substring(3);
        if (number.length >= 9) {
          return `+33 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
        }
      }
      break;
      
    case 'en':
      // UK format: +44 20 1234 5678
      if (cleaned.startsWith('+44')) {
        const number = cleaned.substring(3);
        if (number.length >= 10) {
          return `+44 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6, 10)}`;
        }
      }
      break;
  }
  
  return phone; // Return original if can't format
};

// ============================================
// BUSINESS HOURS HELPERS
// ============================================

export const isLunchBreak = (hour: number, locale: SupportedLocale): boolean => {
  const config = localeConfigs[locale];
  return hour >= config.businessHours.lunchBreakStart && 
         hour < config.businessHours.lunchBreakEnd;
};

export const getLunchBreakHours = (locale: SupportedLocale): string => {
  const config = localeConfigs[locale];
  const start = formatTime24To12(config.businessHours.lunchBreakStart, locale);
  const end = formatTime24To12(config.businessHours.lunchBreakEnd, locale);
  return `${start} - ${end}`;
};

export const formatTime24To12 = (hour: number, locale: SupportedLocale): string => {
  if (locale === 'en') {
    // Convert to 12-hour format for English
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${hour12}:00 ${period}`;
  } else {
    // Use 24-hour format for German and French
    return `${hour.toString().padStart(2, '0')}:00`;
  }
};

// ============================================
// LANGUAGE DETECTION
// ============================================

export const detectBrowserLanguage = (): SupportedLocale => {
  // Check localStorage first
  const stored = localStorage.getItem('ea-language');
  if (stored && ['en', 'de', 'fr'].includes(stored)) {
    return stored as SupportedLocale;
  }
  
  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('en')) return 'en';
  
  // Default to English
  return 'en';
};

export const saveLanguagePreference = (locale: SupportedLocale): void => {
  localStorage.setItem('ea-language', locale);
};

// ============================================
// CULTURAL ADAPTATIONS
// ============================================

export const getGreeting = (locale: SupportedLocale): string => {
  const hour = new Date().getHours();
  
  switch (locale) {
    case 'de':
      if (hour < 11) return 'Guten Morgen';
      if (hour < 18) return 'Guten Tag';
      return 'Guten Abend';
      
    case 'fr':
      if (hour < 12) return 'Bonjour';
      if (hour < 18) return 'Bon après-midi';
      return 'Bonsoir';
      
    default:
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
  }
};

export const getFormalAddress = (name: string, locale: SupportedLocale): string => {
  switch (locale) {
    case 'de':
      return `Sehr geehrte(r) ${name}`; // Formal German
      
    case 'fr':
      return `Cher(e) ${name}`; // Formal French
      
    default:
      return `Dear ${name}`; // English
  }
};

// ============================================
// VACATION NOTICES
// ============================================

export const getVacationNotice = (locale: SupportedLocale, month: number): string | null => {
  // August vacation notice for French businesses
  if (locale === 'fr' && month === 7) { // August is month 7 (0-indexed)
    return 'Fermé pour congés annuels du 1er au 15 août';
  }
  
  // Christmas/New Year notice
  if (month === 11) { // December
    switch (locale) {
      case 'de':
        return 'Betriebsferien vom 24.12. bis 02.01.';
      case 'fr':
        return 'Fermeture annuelle du 24/12 au 02/01';
      default:
        return 'Closed for holidays Dec 24 - Jan 2';
    }
  }
  
  return null;
};

// ============================================
// EXPORT ALL HELPERS
// ============================================

export const localization = {
  configs: localeConfigs,
  formatDate,
  formatTime,
  formatDateTime,
  formatCurrency,
  formatPhoneNumber,
  isLunchBreak,
  getLunchBreakHours,
  detectBrowserLanguage,
  saveLanguagePreference,
  getGreeting,
  getFormalAddress,
  getVacationNotice
};

export default localization;