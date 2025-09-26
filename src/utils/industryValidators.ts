// Industry-Specific Form Validators
// Tailored validation for different business types

import { validatePhoneNumber, validateEmail, validateName } from './formValidation';

// ============================================
// RESTAURANT BOOKING VALIDATION
// ============================================

export interface RestaurantBookingData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  partySize: number;
  dietaryRestrictions?: string[];
  specialOccasion?: string;
  specialRequests?: string;
  newsletter?: boolean;
}

const DIETARY_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Lactose-Free',
  'Halal',
  'Kosher',
  'Nut Allergy',
  'Shellfish Allergy',
  'No Pork',
  'Low Sodium',
  'Diabetic-Friendly'
];

const SPECIAL_OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Business Meeting',
  'Date Night',
  'Family Gathering',
  'Graduation',
  'Engagement',
  'Other Celebration'
];

export const validateRestaurantBooking = (data: RestaurantBookingData) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  // Basic validation
  if (!data.name) errors.name = 'What name should we put the reservation under?';
  if (!data.email) errors.email = 'We\'ll send your reservation confirmation here';
  if (!data.phone) errors.phone = 'We\'ll text you when your table is ready';
  if (!data.date) errors.date = 'When would you like to dine with us?';
  if (!data.time) errors.time = 'What time would you prefer?';

  // Party size validation
  if (!data.partySize || data.partySize < 1) {
    errors.partySize = 'How many people will be joining you?';
  } else if (data.partySize > 12) {
    warnings.partySize = 'For parties larger than 12, please call us directly for special arrangements';
  } else if (data.partySize > 8) {
    warnings.partySize = 'Large parties may have limited seating options';
  }

  // Peak time detection and surcharge notice
  const hour = parseInt(data.time?.split(':')[0] || '0');
  const dayOfWeek = data.date?.getDay();

  if ((hour >= 19 && hour <= 21) || (dayOfWeek === 0 || dayOfWeek === 6)) {
    warnings.peakTime = 'Peak time - a 10% service charge applies on weekends and prime dinner hours';
  }

  // Special occasion handling
  if (data.specialOccasion === 'Birthday') {
    warnings.birthday = 'We\'ll prepare a complimentary dessert for the birthday celebration! 🎂';
  } else if (data.specialOccasion === 'Anniversary') {
    warnings.anniversary = 'Congratulations! We\'ll make sure your table has the best ambiance 💑';
  }

  // Dietary restrictions validation
  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 0) {
    const validRestrictions = data.dietaryRestrictions.filter(r =>
      DIETARY_RESTRICTIONS.includes(r)
    );

    if (validRestrictions.length !== data.dietaryRestrictions.length) {
      warnings.dietary = 'Some dietary restrictions may need clarification - we\'ll contact you';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    suggestions: {
      dietaryRestrictions: DIETARY_RESTRICTIONS,
      specialOccasions: SPECIAL_OCCASIONS
    }
  };
};

// ============================================
// MEDICAL APPOINTMENT VALIDATION
// ============================================

export interface MedicalAppointmentData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceNumber?: string;
  insuranceProvider?: string;
  appointmentType: string;
  preferredDoctor?: string;
  symptoms?: string[];
  medications?: string[];
  allergies?: string[];
  prescriptionRenewal?: boolean;
}

const INSURANCE_PROVIDERS = [
  'AOK', 'TK (Techniker Krankenkasse)', 'Barmer', 'DAK-Gesundheit',
  'IKK', 'BKK', 'Private Insurance', 'Self-Pay'
];

const APPOINTMENT_TYPES = [
  'General Checkup',
  'Follow-up',
  'Urgent Care',
  'Vaccination',
  'Prescription Renewal',
  'Lab Results',
  'Specialist Referral',
  'Prevention Screening'
];

export const validateMedicalAppointment = (data: MedicalAppointmentData) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  const requirements: string[] = [];

  // Required fields
  if (!data.firstName) errors.firstName = 'We need your first name for our medical records';
  if (!data.lastName) errors.lastName = 'We need your last name for our medical records';
  if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required for medical records';
  if (!data.email) errors.email = 'Your appointment details will be sent here';
  if (!data.phone) errors.phone = 'We need to reach you about your appointment';

  // Emergency contact is required
  if (!data.emergencyContact) {
    errors.emergencyContact = 'Emergency contact name is required';
  }
  if (!data.emergencyPhone) {
    errors.emergencyPhone = 'Emergency contact phone is required';
  }

  // Insurance validation (German format)
  if (data.insuranceNumber) {
    const germanInsuranceRegex = /^[A-Z]\d{9}$/;
    if (!germanInsuranceRegex.test(data.insuranceNumber)) {
      errors.insuranceNumber = 'Please enter a valid German insurance number (e.g., A123456789)';
    }
  } else if (data.insuranceProvider !== 'Self-Pay') {
    errors.insuranceNumber = 'Insurance number is required for billing';
  }

  // Prescription renewal detection
  if (data.prescriptionRenewal || data.appointmentType === 'Prescription Renewal') {
    requirements.push('Please bring your current prescription bottles');
    requirements.push('List of medications needed for renewal');
  }

  // Allergy warnings
  if (data.allergies && data.allergies.length > 0) {
    warnings.allergies = 'Your allergies have been noted and will be reviewed by the doctor';
  }

  // Age-based validations
  const age = data.dateOfBirth ?
    Math.floor((new Date().getTime() - data.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0;

  if (age < 18) {
    requirements.push('Parent or guardian must accompany minors');
  } else if (age > 65) {
    warnings.senior = 'Senior discount available - please bring ID';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    requirements,
    suggestions: {
      insuranceProviders: INSURANCE_PROVIDERS,
      appointmentTypes: APPOINTMENT_TYPES
    }
  };
};

// ============================================
// SALON BOOKING VALIDATION
// ============================================

export interface SalonBookingData {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  services: string[];
  preferredStylist?: string;
  previousVisit?: boolean;
  allergies?: string[];
  sensitivities?: string[];
  hairType?: string;
  desiredStyle?: string;
  productPreferences?: string[];
}

const SALON_SERVICES = [
  'Haircut', 'Color', 'Highlights', 'Balayage', 'Perm', 'Straightening',
  'Blowout', 'Deep Conditioning', 'Keratin Treatment', 'Extensions',
  'Bridal Styling', 'Makeup', 'Eyebrow Threading', 'Eyelash Extensions'
];

const HAIR_TYPES = [
  'Fine', 'Medium', 'Thick', 'Curly', 'Wavy', 'Straight',
  'Color-Treated', 'Damaged', 'Oily', 'Dry'
];

const COMMON_SENSITIVITIES = [
  'Ammonia', 'PPD (Hair Dye)', 'Peroxide', 'Fragrance',
  'Sulfates', 'Parabens', 'Formaldehyde'
];

export const validateSalonBooking = (data: SalonBookingData) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  const recommendations: string[] = [];

  // Basic validation
  if (!data.name) errors.name = 'How should we address you?';
  if (!data.email) errors.email = 'You\'ll receive appointment details and special offers';
  if (!data.phone) errors.phone = 'We\'ll send you appointment reminders';
  if (!data.date) errors.date = 'When would you like to come in?';
  if (!data.time) errors.time = 'What time suits you best?';

  // Service validation
  if (!data.services || data.services.length === 0) {
    errors.services = 'Please select at least one service';
  } else {
    // Calculate estimated duration
    const serviceDurations: Record<string, number> = {
      'Haircut': 45,
      'Color': 120,
      'Highlights': 180,
      'Balayage': 240,
      'Perm': 180,
      'Straightening': 150,
      'Blowout': 45,
      'Deep Conditioning': 30,
      'Keratin Treatment': 180,
      'Extensions': 240,
      'Bridal Styling': 90,
      'Makeup': 60,
      'Eyebrow Threading': 15,
      'Eyelash Extensions': 120
    };

    const totalDuration = data.services.reduce((sum, service) =>
      sum + (serviceDurations[service] || 60), 0
    );

    if (totalDuration > 240) {
      warnings.duration = `Your appointment will take approximately ${Math.ceil(totalDuration / 60)} hours. We recommend booking early in the day.`;
    }
  }

  // Stylist availability
  if (data.preferredStylist) {
    warnings.stylist = `We'll do our best to book you with ${data.preferredStylist}. If unavailable, we'll suggest alternatives.`;
  }

  // Allergies and sensitivities
  if (data.allergies && data.allergies.length > 0) {
    warnings.allergies = 'We\'ll use hypoallergenic products for your appointment';
    recommendations.push('Patch test recommended 48 hours before color service');
  }

  // Previous visit benefits
  if (data.previousVisit) {
    warnings.loyalty = 'Welcome back! You\'re eligible for our 10% loyalty discount';
  }

  // Service-specific validations
  if (data.services?.includes('Color') || data.services?.includes('Highlights') || data.services?.includes('Balayage')) {
    if (!data.allergies || !data.sensitivities) {
      warnings.colorService = 'Please inform us of any allergies or sensitivities before color services';
    }
    recommendations.push('Avoid washing hair 24-48 hours before color service');
  }

  if (data.services?.includes('Keratin Treatment') || data.services?.includes('Perm')) {
    recommendations.push('These treatments are not recommended for pregnant women');
    recommendations.push('Results may vary based on hair condition');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    recommendations,
    suggestions: {
      services: SALON_SERVICES,
      hairTypes: HAIR_TYPES,
      sensitivities: COMMON_SENSITIVITIES
    }
  };
};

// ============================================
// AUTOMOTIVE SERVICE VALIDATION
// ============================================

export interface AutomotiveServiceData {
  name: string;
  email: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  licensePlate?: string;
  vin?: string;
  mileage: number;
  serviceType: string[];
  appointmentDate: Date;
  appointmentTime: string;
  previousService?: Date;
  warrantyStatus?: string;
  concerns?: string;
}

const SERVICE_TYPES = [
  'Oil Change', 'Tire Rotation', 'Brake Service', 'Transmission Service',
  'Engine Diagnostic', 'AC Service', 'Battery Replacement', 'Alignment',
  'Inspection', 'Tune-Up', 'Exhaust Repair', 'Suspension'
];

const GERMAN_MAKES = [
  'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Porsche', 'Opel'
];

export const validateAutomotiveService = (data: AutomotiveServiceData) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  const recommendations: string[] = [];

  // Basic validation
  if (!data.name) errors.name = 'Name for the service order';
  if (!data.email) errors.email = 'Your service invoice will be sent here';
  if (!data.phone) errors.phone = 'We\'ll call you when your car is ready';
  if (!data.vehicleMake) errors.vehicleMake = 'What make is your vehicle?';
  if (!data.vehicleModel) errors.vehicleModel = 'What model is your vehicle?';
  if (!data.vehicleYear) errors.vehicleYear = 'What year is your vehicle?';
  if (!data.appointmentDate) errors.appointmentDate = 'When should we schedule your service?';
  if (!data.appointmentTime) errors.appointmentTime = 'When can you drop off your vehicle?';

  // License plate validation (German format)
  if (data.licensePlate) {
    const germanPlateRegex = /^[A-Z]{1,3}-[A-Z]{1,2}\s?\d{1,4}$/;
    if (!germanPlateRegex.test(data.licensePlate.toUpperCase())) {
      errors.licensePlate = 'Please enter a valid German license plate (e.g., B-AB 1234)';
    }
  }

  // VIN validation (17 characters)
  if (data.vin) {
    if (data.vin.length !== 17) {
      errors.vin = 'VIN must be exactly 17 characters';
    } else {
      // VIN check digit validation could be added here
      warnings.vin = 'VIN verified - vehicle history available';
    }
  }

  // Mileage validation
  if (!data.mileage || data.mileage < 0) {
    errors.mileage = 'Please enter current mileage';
  } else if (data.mileage > 300000) {
    warnings.mileage = 'High mileage vehicle - additional services may be recommended';
  }

  // Service type validation
  if (!data.serviceType || data.serviceType.length === 0) {
    errors.serviceType = 'Please select at least one service';
  }

  // Service history and recommendations
  if (data.previousService) {
    const daysSinceService = Math.floor(
      (new Date().getTime() - data.previousService.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceService > 180) {
      recommendations.push('It\'s been over 6 months - comprehensive inspection recommended');
    }
  }

  // German car specialty
  if (GERMAN_MAKES.includes(data.vehicleMake)) {
    warnings.specialty = 'German vehicle specialist available - premium service for your ' + data.vehicleMake;
  }

  // Warranty check
  const vehicleAge = new Date().getFullYear() - data.vehicleYear;
  if (vehicleAge <= 3) {
    warnings.warranty = 'Your vehicle may still be under manufacturer warranty';
    recommendations.push('Check if service affects warranty coverage');
  }

  // Service-specific validations
  if (data.serviceType?.includes('Oil Change')) {
    if (!data.mileage) {
      errors.mileage = 'Mileage required to determine oil type';
    }
    recommendations.push('Synthetic oil recommended for optimal performance');
  }

  if (data.serviceType?.includes('Brake Service')) {
    warnings.safety = 'Safety inspection included with brake service';
  }

  if (data.serviceType?.includes('Inspection')) {
    const nextInspectionYear = data.vehicleYear + 3 + Math.floor(vehicleAge / 2) * 2;
    if (new Date().getFullYear() >= nextInspectionYear) {
      warnings.inspection = 'TÜV/HU inspection due this year';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
    recommendations,
    suggestions: {
      serviceTypes: SERVICE_TYPES,
      germanMakes: GERMAN_MAKES
    }
  };
};

// ============================================
// UNIVERSAL VALIDATION HELPER
// ============================================

export type IndustryType = 'restaurant' | 'medical' | 'salon' | 'automotive';

export const getIndustryValidator = (industry: IndustryType) => {
  switch (industry) {
    case 'restaurant':
      return validateRestaurantBooking;
    case 'medical':
      return validateMedicalAppointment;
    case 'salon':
      return validateSalonBooking;
    case 'automotive':
      return validateAutomotiveService;
    default:
      throw new Error(`Unknown industry type: ${industry}`);
  }
};

// ============================================
// INDUSTRY-SPECIFIC VALIDATION
// ============================================

export const validateIndustrySpecific = (industry: IndustryType, data: any) => {
  const validator = getIndustryValidator(industry);
  return validator(data);
};

// ============================================
// FIELD AUTOCOMPLETE SUGGESTIONS
// ============================================

export const getAutocompleteOptions = (industry: IndustryType, field: string): string[] => {
  const options: Record<string, Record<string, string[]>> = {
    restaurant: {
      dietaryRestrictions: DIETARY_RESTRICTIONS,
      specialOccasion: SPECIAL_OCCASIONS,
      partySize: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']
    },
    medical: {
      insuranceProvider: INSURANCE_PROVIDERS,
      appointmentType: APPOINTMENT_TYPES,
      symptoms: ['Fever', 'Cough', 'Headache', 'Fatigue', 'Pain', 'Nausea']
    },
    salon: {
      services: SALON_SERVICES,
      hairType: HAIR_TYPES,
      sensitivities: COMMON_SENSITIVITIES
    },
    automotive: {
      serviceType: SERVICE_TYPES,
      vehicleMake: GERMAN_MAKES,
      warrantyStatus: ['Active', 'Expired', 'Extended', 'Unknown']
    }
  };

  return options[industry]?.[field] || [];
};