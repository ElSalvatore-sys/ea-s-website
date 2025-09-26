// Industry-specific service configurations
import { Coffee, Heart, Scissors, Car, Users, Clock, MapPin, FileText, Calendar, Shield, CreditCard, Camera } from 'lucide-react';

export interface IndustryService {
  id: string;
  name: string;
  nameDE: string;
  duration: string;
  description: string;
  descriptionDE: string;
  timeSlots?: string[];
  icon?: any;
}

export interface SmartFeature {
  id: string;
  label: string;
  labelDE: string;
  type: 'select' | 'number' | 'toggle' | 'text' | 'file' | 'multiselect';
  options?: Array<{ value: string; label: string; labelDE: string }>;
  min?: number;
  max?: number;
  required?: boolean;
  affectsPrice?: boolean;
}

export interface IndustryConfig {
  id: string;
  name: string;
  nameDE: string;
  icon: any;
  header: string;
  headerDE: string;
  subheader: string;
  subheaderDE: string;
  color: string;
  bgColor: string;
  borderColor: string;
  services: IndustryService[];
  smartFeatures: SmartFeature[];
}

// Restaurant Configuration
export const restaurantConfig: IndustryConfig = {
  id: 'restaurant',
  name: 'Restaurant',
  nameDE: 'Restaurant',
  icon: Coffee,
  header: 'Reserve Your Table',
  headerDE: 'Reservieren Sie Ihren Tisch',
  subheader: 'Select your dining experience',
  subheaderDE: 'Wählen Sie Ihr kulinarisches Erlebnis',
  color: '#C65D00',
  bgColor: '#FFF5F0',
  borderColor: '#FFEDD5',
  services: [
    {
      id: 'breakfast',
      name: 'Breakfast',
      nameDE: 'Frühstück',
      duration: '6:00-11:00',
      description: 'Morning reservation',
      descriptionDE: 'Morgen-Reservierung',
      timeSlots: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30']
    },
    {
      id: 'lunch',
      name: 'Lunch',
      nameDE: 'Mittagessen',
      duration: '11:30-15:00',
      description: 'Afternoon reservation',
      descriptionDE: 'Nachmittags-Reservierung',
      timeSlots: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
    },
    {
      id: 'dinner',
      name: 'Dinner',
      nameDE: 'Abendessen',
      duration: '17:00-22:00',
      description: 'Evening reservation',
      descriptionDE: 'Abend-Reservierung',
      timeSlots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
    },
    {
      id: 'private-event',
      name: 'Private Event',
      nameDE: 'Private Veranstaltung',
      duration: 'Custom',
      description: 'Special occasion',
      descriptionDE: 'Besonderer Anlass'
    }
  ],
  smartFeatures: []
};

// Medical Configuration
export const medicalConfig: IndustryConfig = {
  id: 'medical',
  name: 'Medical',
  nameDE: 'Medizinisch',
  icon: Heart,
  header: 'Book Your Appointment',
  headerDE: 'Buchen Sie Ihren Termin',
  subheader: 'Choose consultation type',
  subheaderDE: 'Wählen Sie die Art der Beratung',
  color: '#0891B2',
  bgColor: '#F0FDFA',
  borderColor: '#CCFBF1',
  services: [
    {
      id: 'general-consultation',
      name: 'General Consultation',
      nameDE: 'Allgemeine Beratung',
      duration: '30 min',
      description: 'Regular appointment',
      descriptionDE: 'Regulärer Termin'
    },
    {
      id: 'specialist-referral',
      name: 'Specialist Referral',
      nameDE: 'Facharztüberweisung',
      duration: '45 min',
      description: 'Specialist appointment',
      descriptionDE: 'Facharzt-Termin'
    },
    {
      id: 'health-checkup',
      name: 'Health Check-up',
      nameDE: 'Gesundheitscheck',
      duration: '60 min',
      description: 'Full check-up',
      descriptionDE: 'Volluntersuchung'
    },
    {
      id: 'emergency-slot',
      name: 'Emergency',
      nameDE: 'Notfall',
      duration: '15 min',
      description: 'Urgent appointment',
      descriptionDE: 'Dringender Termin'
    }
  ],
  smartFeatures: []
};

// Hair Salon Configuration
export const salonConfig: IndustryConfig = {
  id: 'salon',
  name: 'Hair Salon',
  nameDE: 'Friseursalon',
  icon: Scissors,
  header: 'Book Your Transformation',
  headerDE: 'Buchen Sie Ihre Verwandlung',
  subheader: 'Select your service',
  subheaderDE: 'Wählen Sie Ihren Service',
  color: '#B76E79',
  bgColor: '#FDF2F4',
  borderColor: '#FECDD3',
  services: [
    {
      id: 'cut-style',
      name: 'Haircut',
      nameDE: 'Haarschnitt',
      duration: '45 min',
      description: 'Hair cutting service',
      descriptionDE: 'Haarschnitt-Service'
    },
    {
      id: 'color-services',
      name: 'Color',
      nameDE: 'Färben',
      duration: '120 min',
      description: 'Hair coloring',
      descriptionDE: 'Haarfärbung'
    },
    {
      id: 'treatments',
      name: 'Treatment',
      nameDE: 'Behandlung',
      duration: '30 min',
      description: 'Hair treatment',
      descriptionDE: 'Haarbehandlung'
    },
    {
      id: 'special-occasions',
      name: 'Event Styling',
      nameDE: 'Event-Styling',
      duration: '90 min',
      description: 'Special occasion styling',
      descriptionDE: 'Styling für besondere Anlässe'
    }
  ],
  smartFeatures: []
};

// Automotive Configuration
export const automotiveConfig: IndustryConfig = {
  id: 'automotive',
  name: 'Automotive',
  nameDE: 'Automobil',
  icon: Car,
  header: 'Schedule Your Service',
  headerDE: 'Planen Sie Ihren Service',
  subheader: 'Keep your vehicle running perfectly',
  subheaderDE: 'Halten Sie Ihr Fahrzeug in perfektem Zustand',
  color: '#1E40AF',
  bgColor: '#EFF6FF',
  borderColor: '#DBEAFE',
  services: [
    {
      id: 'oil-change',
      name: 'Oil Change',
      nameDE: 'Ölwechsel',
      duration: '30 min',
      description: 'Quick oil service',
      descriptionDE: 'Schneller Ölservice'
    },
    {
      id: 'full-inspection',
      name: 'Inspection',
      nameDE: 'Inspektion',
      duration: '60 min',
      description: 'Vehicle inspection',
      descriptionDE: 'Fahrzeuginspektion'
    },
    {
      id: 'brake-service',
      name: 'Brake Service',
      nameDE: 'Bremsservice',
      duration: '120 min',
      description: 'Brake maintenance',
      descriptionDE: 'Bremswartung'
    },
    {
      id: 'general-repair',
      name: 'General Repair',
      nameDE: 'Allgemeine Reparatur',
      duration: 'Custom',
      description: 'Custom repair service',
      descriptionDE: 'Individuelle Reparatur'
    }
  ],
  smartFeatures: []
};

// Export all configurations
export const industryConfigs = {
  restaurant: restaurantConfig,
  medical: medicalConfig,
  salon: salonConfig,
  automotive: automotiveConfig
};

// Helper function to get industry config by ID
export const getIndustryConfig = (industryId: string): IndustryConfig | undefined => {
  return industryConfigs[industryId as keyof typeof industryConfigs];
};