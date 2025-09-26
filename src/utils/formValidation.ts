// Intelligent Form Validation Utilities
// Smart, contextual validation with real-time feedback

// ============================================
// PHONE NUMBER VALIDATION
// ============================================

interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  type: 'mobile' | 'landline' | 'unknown';
  carrier?: string;
  country: string;
  suggestion?: string;
}

// German phone patterns
const GERMAN_MOBILE_PREFIXES = ['151', '152', '157', '159', '160', '162', '163', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179'];
const GERMAN_LANDLINE_AREAS = {
  '30': 'Berlin',
  '40': 'Hamburg',
  '69': 'Frankfurt',
  '89': 'Munich',
  '221': 'Cologne',
  '211': 'Düsseldorf',
  '711': 'Stuttgart',
  '611': 'Wiesbaden'
};

export const detectCountryCode = (): string => {
  // Detect from browser locale
  const locale = navigator.language || 'de-DE';
  const countryMap: Record<string, string> = {
    'de': '+49',
    'at': '+43',
    'ch': '+41',
    'us': '+1',
    'gb': '+44',
    'fr': '+33',
    'it': '+39',
    'es': '+34',
    'nl': '+31',
    'be': '+32'
  };

  const country = locale.split('-')[1]?.toLowerCase() || locale.split('-')[0]?.toLowerCase();
  return countryMap[country] || '+49';
};

export const formatPhoneNumber = (input: string, countryCode: string = '+49'): string => {
  // Remove all non-digit characters except +
  let cleaned = input.replace(/[^\d+]/g, '');

  // Handle German numbers
  if (countryCode === '+49' || cleaned.startsWith('49') || cleaned.startsWith('+49')) {
    // Remove country code if present
    cleaned = cleaned.replace(/^(\+?49|0049)/, '');
    // Remove leading 0 if present
    cleaned = cleaned.replace(/^0/, '');

    // Format based on length
    if (cleaned.length <= 3) {
      return `+49 ${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `+49 ${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
      return `+49 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      return `+49 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7, 11)}`;
    }
  }

  return input;
};

export const validatePhoneNumber = (phone: string): PhoneValidationResult => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  const withoutCountry = cleaned.replace(/^(\+?49|0049)/, '').replace(/^0/, '');

  // Check if it's a mobile number
  const isMobile = GERMAN_MOBILE_PREFIXES.some(prefix =>
    withoutCountry.startsWith(prefix)
  );

  // Check if it's a landline
  const landlineArea = Object.keys(GERMAN_LANDLINE_AREAS).find(area =>
    withoutCountry.startsWith(area)
  );

  const isValid = withoutCountry.length >= 10 && withoutCountry.length <= 12;

  return {
    isValid,
    formatted: formatPhoneNumber(phone),
    type: isMobile ? 'mobile' : landlineArea ? 'landline' : 'unknown',
    carrier: isMobile ? detectCarrier(withoutCountry) : undefined,
    country: 'Germany',
    suggestion: !isValid ? 'Please enter a valid German phone number' : undefined
  };
};

const detectCarrier = (number: string): string => {
  // Simplified carrier detection based on prefix
  const prefix = number.slice(0, 3);
  const carriers: Record<string, string> = {
    '151': 'T-Mobile',
    '152': 'Vodafone',
    '157': 'E-Plus',
    '159': 'O2',
    '160': 'T-Mobile',
    '162': 'Vodafone',
    '163': 'E-Plus',
    '170': 'T-Mobile',
    '171': 'T-Mobile',
    '172': 'Vodafone',
    '173': 'Vodafone',
    '174': 'Vodafone',
    '175': 'T-Mobile',
    '176': 'O2',
    '177': 'E-Plus',
    '178': 'E-Plus',
    '179': 'O2'
  };

  return carriers[prefix] || 'Unknown';
};

// ============================================
// EMAIL VALIDATION
// ============================================

interface EmailValidationResult {
  isValid: boolean;
  suggestion?: string;
  isCorporate: boolean;
  isDisposable: boolean;
  domain: string;
  warning?: string;
}

const COMMON_EMAIL_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahou.com': 'yahoo.com',
  'outlok.com': 'outlook.com',
  'outloook.com': 'outlook.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'homail.com': 'hotmail.com',
  'web.ed': 'web.de',
  'web.d': 'web.de',
  'gmx.ed': 'gmx.de',
  'gmx.d': 'gmx.de',
  't-onlin.de': 't-online.de',
  't-onlien.de': 't-online.de'
};

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'throwaway.email', 'guerrillamail.com',
  'mailinator.com', '10minutemail.com', 'trash-mail.com'
];

const CORPORATE_INDICATORS = [
  '.gmbh', '.ag', '.kg', '.ohg', '.gbr', // German business types
  'company', 'corp', 'enterprise', 'business', 'consulting'
];

export const validateEmail = (email: string): EmailValidationResult => {
  const lowercased = email.toLowerCase().trim();
  const [localPart, domain] = lowercased.split('@');

  // Basic validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isBasicallyValid = emailRegex.test(lowercased);

  // Check for typos
  const suggestion = COMMON_EMAIL_TYPOS[domain];

  // Check if corporate
  const isCorporate = CORPORATE_INDICATORS.some(indicator =>
    domain?.includes(indicator)
  ) || (!domain?.includes('gmail') && !domain?.includes('yahoo') &&
        !domain?.includes('outlook') && !domain?.includes('hotmail') &&
        !domain?.includes('web.de') && !domain?.includes('gmx'));

  // Check if disposable
  const isDisposable = DISPOSABLE_DOMAINS.some(disposable =>
    domain?.includes(disposable)
  );

  return {
    isValid: isBasicallyValid && !suggestion,
    suggestion: suggestion ? `Did you mean ${localPart}@${suggestion}?` : undefined,
    isCorporate,
    isDisposable,
    domain: domain || '',
    warning: isDisposable ? 'This appears to be a temporary email address' : undefined
  };
};

// ============================================
// NAME VALIDATION
// ============================================

interface NameValidationResult {
  isValid: boolean;
  formatted: string;
  hasTitle: boolean;
  title?: string;
  suggestions?: string[];
}

const TITLES = ['Dr.', 'Prof.', 'Prof. Dr.', 'Dipl.-Ing.', 'Dipl.-Kfm.', 'M.A.', 'B.A.', 'M.Sc.', 'B.Sc.'];

const COMMON_NAME_CORRECTIONS: Record<string, string> = {
  'mueller': 'Müller',
  'muller': 'Müller',
  'schroeder': 'Schröder',
  'schroder': 'Schröder',
  'krueger': 'Krüger',
  'kruger': 'Krüger',
  'jaeger': 'Jäger',
  'jager': 'Jäger',
  'koehler': 'Köhler',
  'kohler': 'Köhler',
  'goetz': 'Götz',
  'gotz': 'Götz',
  'strasse': 'Straße',
  'grosse': 'Große',
  'weiss': 'Weiß'
};

export const validateName = (name: string): NameValidationResult => {
  // Detect and extract title
  let title: string | undefined;
  let nameWithoutTitle = name;

  for (const t of TITLES) {
    if (name.toLowerCase().startsWith(t.toLowerCase())) {
      title = t;
      nameWithoutTitle = name.slice(t.length).trim();
      break;
    }
  }

  // Format name with proper capitalization
  const formatted = nameWithoutTitle
    .split(' ')
    .map(part => {
      // Check for common German name corrections
      const correction = COMMON_NAME_CORRECTIONS[part.toLowerCase()];
      if (correction) return correction;

      // Handle hyphenated names
      if (part.includes('-')) {
        return part.split('-')
          .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
          .join('-');
      }

      // Handle names with 'von', 'van', 'de', etc.
      if (['von', 'van', 'de', 'der', 'den', 'ter', 'zu'].includes(part.toLowerCase())) {
        return part.toLowerCase();
      }

      // Standard capitalization
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');

  const finalFormatted = title ? `${title} ${formatted}` : formatted;

  // Generate suggestions for common misspellings
  const suggestions: string[] = [];
  const nameParts = nameWithoutTitle.toLowerCase().split(' ');

  nameParts.forEach(part => {
    if (COMMON_NAME_CORRECTIONS[part]) {
      suggestions.push(`Did you mean "${COMMON_NAME_CORRECTIONS[part]}"?`);
    }
  });

  return {
    isValid: name.length >= 2,
    formatted: finalFormatted,
    hasTitle: !!title,
    title,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
};

// ============================================
// CONTEXTUAL ERROR MESSAGES
// ============================================

export const getContextualErrorMessage = (field: string, context?: string): string => {
  const messages: Record<string, Record<string, string>> = {
    phone: {
      default: 'We need your phone number to confirm your booking',
      medical: 'We need your phone number in case we need to reach you about your appointment',
      restaurant: 'We\'ll text you when your table is ready',
      salon: 'We\'ll send you appointment reminders',
      automotive: 'We\'ll call you when your car is ready'
    },
    email: {
      default: 'We\'ll send your booking confirmation here',
      medical: 'Your appointment details and reminders will be sent here',
      restaurant: 'We\'ll email you the reservation confirmation',
      salon: 'You\'ll receive your appointment details and special offers',
      automotive: 'Your service invoice will be sent to this email'
    },
    name: {
      default: 'Please tell us your name',
      medical: 'We need your full name for our medical records',
      restaurant: 'What name should we put the reservation under?',
      salon: 'How should we address you?',
      automotive: 'Name for the service order'
    },
    date: {
      default: 'Please select a date that works for you',
      medical: 'When would you like to schedule your appointment?',
      restaurant: 'When would you like to dine with us?',
      salon: 'When would you like to come in?',
      automotive: 'When should we schedule your service?'
    },
    time: {
      default: 'Please select a time that works for you',
      medical: 'What time works best for your appointment?',
      restaurant: 'What time would you prefer?',
      salon: 'What time suits you best?',
      automotive: 'When can you drop off your vehicle?'
    }
  };

  return messages[field]?.[context || 'default'] || `Please enter your ${field}`;
};

// ============================================
// SUCCESS FEEDBACK
// ============================================

export interface ValidationFeedback {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  animation?: 'checkmark' | 'shake' | 'pulse' | 'slide';
}

export const getSuccessFeedback = (field: string): ValidationFeedback => {
  const feedbacks: Record<string, ValidationFeedback> = {
    phone: {
      type: 'success',
      message: 'Phone number looks good!',
      animation: 'checkmark'
    },
    email: {
      type: 'success',
      message: 'Email verified ✓',
      animation: 'checkmark'
    },
    name: {
      type: 'success',
      message: 'Perfect!',
      animation: 'checkmark'
    },
    date: {
      type: 'success',
      message: 'Date confirmed',
      animation: 'pulse'
    },
    time: {
      type: 'success',
      message: 'Time slot available',
      animation: 'pulse'
    }
  };

  return feedbacks[field] || { type: 'success', message: '✓', animation: 'checkmark' };
};

// ============================================
// FORM PROGRESS CALCULATION
// ============================================

export interface FormField {
  name: string;
  value: any;
  required: boolean;
  valid: boolean;
}

export const calculateFormProgress = (fields: FormField[]): number => {
  const requiredFields = fields.filter(f => f.required);
  const completedFields = requiredFields.filter(f => f.valid && f.value);

  return Math.round((completedFields.length / requiredFields.length) * 100);
};

// ============================================
// REAL-TIME VALIDATION HELPERS
// ============================================

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const validateOnBlur = (value: string, validator: (val: string) => any) => {
  return validator(value);
};

export const validateOnChange = debounce((value: string, validator: (val: string) => any, callback: (result: any) => void) => {
  const result = validator(value);
  callback(result);
}, 300);

// ============================================
// EXPORT ALL VALIDATORS
// ============================================

export const validators = {
  phone: validatePhoneNumber,
  email: validateEmail,
  name: validateName
};

export const formatters = {
  phone: formatPhoneNumber,
  name: (name: string) => validateName(name).formatted
};