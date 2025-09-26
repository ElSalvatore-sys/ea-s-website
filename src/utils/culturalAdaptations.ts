// Cultural Business Logic Adaptations
// Handles locale-specific business rules and cultural considerations

import { SupportedLocale } from './localization';

// ============================================
// TYPES
// ============================================

export interface CulturalBusinessRules {
  locale: SupportedLocale;
  workingDays: number[]; // 0 = Sunday, 6 = Saturday
  businessHours: {
    open: string;
    close: string;
    lunchBreak?: {
      start: string;
      end: string;
      name: string;
    };
  };
  holidays: string[];
  specialRules: string[];
  minBookingNotice: number; // Hours in advance
  maxBookingAdvance: number; // Days in advance
  cancellationNotice: number; // Hours before appointment
}

// ============================================
// GERMAN BUSINESS RULES
// ============================================

const germanBusinessRules: CulturalBusinessRules = {
  locale: 'de',
  workingDays: [1, 2, 3, 4, 5], // Montag bis Freitag
  businessHours: {
    open: '09:00',
    close: '18:00',
    lunchBreak: {
      start: '12:00',
      end: '13:00',
      name: 'Mittagspause'
    }
  },
  holidays: [
    'Neujahr',
    'Karfreitag',
    'Ostermontag',
    'Tag der Arbeit',
    'Christi Himmelfahrt',
    'Pfingstmontag',
    'Tag der Deutschen Einheit',
    'Weihnachten',
    'Zweiter Weihnachtstag'
  ],
  specialRules: [
    'Mittagspause ist immer von 12:00 bis 13:00 Uhr',
    'Ruhetag ist meist Montag bei Restaurants',
    'Sonntags geschlossen (außer Restaurants)',
    'Termine nur während der Geschäftszeiten'
  ],
  minBookingNotice: 2, // 2 Stunden Vorlauf
  maxBookingAdvance: 90, // 3 Monate im Voraus
  cancellationNotice: 24 // 24 Stunden vorher
};

// ============================================
// FRENCH BUSINESS RULES
// ============================================

const frenchBusinessRules: CulturalBusinessRules = {
  locale: 'fr',
  workingDays: [1, 2, 3, 4, 5], // Lundi à Vendredi
  businessHours: {
    open: '09:00',
    close: '19:00',
    lunchBreak: {
      start: '12:00',
      end: '14:00', // Extended lunch break
      name: 'Pause déjeuner'
    }
  },
  holidays: [
    'Jour de l\'An',
    'Lundi de Pâques',
    'Fête du Travail',
    'Victoire 1945',
    'Ascension',
    'Lundi de Pentecôte',
    'Fête Nationale',
    'Assomption',
    'Toussaint',
    'Armistice 1918',
    'Noël'
  ],
  specialRules: [
    'Pause déjeuner étendue de 12h00 à 14h00',
    'Fermeture annuelle en août (nombreux commerces)',
    'Service continu dans certains restaurants',
    'Ouverture tardive le jeudi (commerces)'
  ],
  minBookingNotice: 3,
  maxBookingAdvance: 60,
  cancellationNotice: 48
};

// ============================================
// ENGLISH BUSINESS RULES
// ============================================

const englishBusinessRules: CulturalBusinessRules = {
  locale: 'en',
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  businessHours: {
    open: '09:00',
    close: '17:00',
    lunchBreak: {
      start: '12:00',
      end: '13:00',
      name: 'Lunch Break'
    }
  },
  holidays: [
    'New Year\'s Day',
    'Good Friday',
    'Easter Monday',
    'Early May Bank Holiday',
    'Spring Bank Holiday',
    'Summer Bank Holiday',
    'Christmas Day',
    'Boxing Day'
  ],
  specialRules: [
    'Flexible lunch hours',
    'Late night shopping on Thursdays',
    'Sunday trading restrictions',
    'Bank holiday opening varies'
  ],
  minBookingNotice: 1,
  maxBookingAdvance: 180,
  cancellationNotice: 12
};

// ============================================
// BUSINESS RULES BY LOCALE
// ============================================

export const businessRulesByLocale: Record<SupportedLocale, CulturalBusinessRules> = {
  de: germanBusinessRules,
  fr: frenchBusinessRules,
  en: englishBusinessRules
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getBusinessRules = (locale: SupportedLocale): CulturalBusinessRules => {
  return businessRulesByLocale[locale];
};

export const isBusinessDay = (date: Date, locale: SupportedLocale): boolean => {
  const rules = getBusinessRules(locale);
  const dayOfWeek = date.getDay();
  return rules.workingDays.includes(dayOfWeek);
};

export const isLunchTime = (time: string, locale: SupportedLocale): boolean => {
  const rules = getBusinessRules(locale);
  if (!rules.businessHours.lunchBreak) return false;
  
  const [hours, minutes] = time.split(':').map(Number);
  const timeInMinutes = hours * 60 + minutes;
  
  const [lunchStartHours, lunchStartMinutes] = rules.businessHours.lunchBreak.start.split(':').map(Number);
  const [lunchEndHours, lunchEndMinutes] = rules.businessHours.lunchBreak.end.split(':').map(Number);
  
  const lunchStartInMinutes = lunchStartHours * 60 + lunchStartMinutes;
  const lunchEndInMinutes = lunchEndHours * 60 + lunchEndMinutes;
  
  return timeInMinutes >= lunchStartInMinutes && timeInMinutes < lunchEndInMinutes;
};

export const getAvailableTimeSlots = (
  date: Date,
  locale: SupportedLocale,
  slotDuration: number = 30 // minutes
): string[] => {
  const rules = getBusinessRules(locale);
  const slots: string[] = [];
  
  if (!isBusinessDay(date, locale)) {
    return slots;
  }
  
  const [openHours, openMinutes] = rules.businessHours.open.split(':').map(Number);
  const [closeHours, closeMinutes] = rules.businessHours.close.split(':').map(Number);
  
  const startMinutes = openHours * 60 + openMinutes;
  const endMinutes = closeHours * 60 + closeMinutes;
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    
    // Skip lunch break
    if (!isLunchTime(time, locale)) {
      slots.push(time);
    }
  }
  
  return slots;
};

// ============================================
// RESTAURANT-SPECIFIC RULES
// ============================================

export const getRestaurantRules = (locale: SupportedLocale) => {
  switch (locale) {
    case 'de':
      return {
        peakHours: ['12:00-14:00', '18:00-21:00'],
        ruhetag: 'Montag', // Closed on Mondays
        reservationRequired: 'Reservierung empfohlen',
        kitchenClosing: '21:30',
        lastOrders: 'Küche schließt um 21:30 Uhr'
      };
      
    case 'fr':
      return {
        peakHours: ['12:00-14:30', '19:00-22:00'],
        ruhetag: 'Dimanche soir et Lundi', // Closed Sunday evening and Monday
        reservationRequired: 'Réservation conseillée',
        kitchenClosing: '22:00',
        lastOrders: 'Dernière commande à 22h00'
      };
      
    default:
      return {
        peakHours: ['12:00-14:00', '18:00-20:00'],
        ruhetag: null,
        reservationRequired: 'Reservation recommended',
        kitchenClosing: '21:00',
        lastOrders: 'Kitchen closes at 9:00 PM'
      };
  }
};

// ============================================
// MEDICAL PRACTICE RULES
// ============================================

export const getMedicalPracticeRules = (locale: SupportedLocale) => {
  switch (locale) {
    case 'de':
      return {
        emergencyNotice: 'In Notfällen wählen Sie 112',
        appointmentTypes: ['Ersttermin', 'Folgetermin', 'Vorsorge', 'Akut'],
        insuranceRequired: 'Bitte Versichertenkarte mitbringen',
        cancellationPolicy: 'Absagen bis 24 Stunden vorher',
        waitingTime: 'Wartezeit ca. 15-30 Minuten'
      };
      
    case 'fr':
      return {
        emergencyNotice: 'En cas d\'urgence, composez le 15',
        appointmentTypes: ['Première consultation', 'Suivi', 'Prévention', 'Urgence'],
        insuranceRequired: 'Carte Vitale obligatoire',
        cancellationPolicy: 'Annulation 48h à l\'avance',
        waitingTime: 'Temps d\'attente 20-40 minutes'
      };
      
    default:
      return {
        emergencyNotice: 'For emergencies call 999',
        appointmentTypes: ['New Patient', 'Follow-up', 'Check-up', 'Urgent'],
        insuranceRequired: 'Please bring insurance card',
        cancellationPolicy: '24-hour cancellation policy',
        waitingTime: 'Wait time approx. 15-30 minutes'
      };
  }
};

// ============================================
// SALON/SPA RULES
// ============================================

export const getSalonRules = (locale: SupportedLocale) => {
  switch (locale) {
    case 'de':
      return {
        depositRequired: 'Anzahlung erforderlich für Behandlungen über 100€',
        lateArrival: 'Bei Verspätung verkürzt sich die Behandlungszeit',
        cancellationFee: 'Stornogebühr bei Absage unter 24 Stunden',
        preparation: 'Bitte 10 Minuten vor Termin erscheinen'
      };
      
    case 'fr':
      return {
        depositRequired: 'Acompte requis pour les soins de plus de 100€',
        lateArrival: 'En cas de retard, le temps de soin sera réduit',
        cancellationFee: 'Frais d\'annulation sous 48 heures',
        preparation: 'Merci d\'arriver 10 minutes avant le rendez-vous'
      };
      
    default:
      return {
        depositRequired: 'Deposit required for treatments over €100',
        lateArrival: 'Late arrival will shorten treatment time',
        cancellationFee: 'Cancellation fee for less than 24 hours notice',
        preparation: 'Please arrive 10 minutes early'
      };
  }
};

// ============================================
// EXPORT ALL RULES
// ============================================

export const culturalAdaptations = {
  getBusinessRules,
  isBusinessDay,
  isLunchTime,
  getAvailableTimeSlots,
  getRestaurantRules,
  getMedicalPracticeRules,
  getSalonRules
};

export default culturalAdaptations;