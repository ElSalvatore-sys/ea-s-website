/**
 * Analytics Event Definitions
 * Centralized event names and parameters for consistent tracking
 */

// Booking Funnel Events
export const BOOKING_EVENTS = {
  // Discovery
  VIEW_BOOKING_WIDGET: 'view_booking_widget',
  VIEW_SERVICE_DETAILS: 'view_service_details',
  VIEW_AVAILABILITY: 'view_availability',

  // Selection
  SELECT_SERVICE: 'select_service',
  SELECT_DATE: 'select_date',
  SELECT_TIME_SLOT: 'select_time_slot',
  CHANGE_SELECTION: 'change_selection',

  // Form Interaction
  START_FORM_FILL: 'start_form_fill',
  COMPLETE_FIELD: 'complete_field',
  VALIDATION_ERROR: 'validation_error',

  // Conversion
  SUBMIT_BOOKING: 'submit_booking',
  BOOKING_SUCCESS: 'booking_success',
  BOOKING_FAILURE: 'booking_failure',

  // Abandonment
  ABANDON_BOOKING: 'abandon_booking',
  EXIT_INTENT: 'exit_intent_detected',
  SESSION_TIMEOUT: 'session_timeout',

  // Recovery
  RESUME_BOOKING: 'resume_booking',
  RECOVERY_EMAIL_SENT: 'recovery_email_sent',
  RECOVERY_LINK_CLICKED: 'recovery_link_clicked'
} as const;

// Conversion Optimization Events
export const OPTIMIZATION_EVENTS = {
  // Urgency Indicators
  VIEW_URGENCY_MESSAGE: 'view_urgency_message',
  URGENCY_CONVERSION: 'urgency_conversion',

  // Social Proof
  VIEW_SOCIAL_PROOF: 'view_social_proof',
  VIEW_RECENT_BOOKING: 'view_recent_booking',
  VIEW_RATING: 'view_rating',
  SOCIAL_PROOF_CONVERSION: 'social_proof_conversion',

  // Trust Signals
  VIEW_TRUST_BADGE: 'view_trust_badge',
  VIEW_GUARANTEE: 'view_guarantee',
  TRUST_SIGNAL_CONVERSION: 'trust_signal_conversion',

  // Personalization
  PERSONALIZED_SUGGESTION: 'personalized_suggestion',
  ACCEPT_SUGGESTION: 'accept_suggestion',
  REJECT_SUGGESTION: 'reject_suggestion'
} as const;

// User Behavior Events
export const BEHAVIOR_EVENTS = {
  // Engagement
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',
  INTERACTION_RATE: 'interaction_rate',

  // Navigation
  CLICK_CTA: 'click_cta',
  NAVIGATE_BACK: 'navigate_back',
  USE_BREADCRUMB: 'use_breadcrumb',

  // Help & Support
  OPEN_HELP: 'open_help',
  USE_TOOLTIP: 'use_tooltip',
  CONTACT_SUPPORT: 'contact_support',

  // Preferences
  CHANGE_LANGUAGE: 'change_language',
  TOGGLE_THEME: 'toggle_theme',
  SET_PREFERENCE: 'set_preference'
} as const;

// A/B Testing Events
export const EXPERIMENT_EVENTS = {
  EXPERIMENT_VIEW: 'experiment_view',
  VARIANT_EXPOSURE: 'variant_exposure',
  VARIANT_INTERACTION: 'variant_interaction',
  VARIANT_CONVERSION: 'variant_conversion'
} as const;

// Error Events
export const ERROR_EVENTS = {
  API_ERROR: 'api_error',
  FORM_ERROR: 'form_error',
  PAYMENT_ERROR: 'payment_error',
  LOADING_ERROR: 'loading_error',
  NETWORK_ERROR: 'network_error'
} as const;

// Performance Events
export const PERFORMANCE_EVENTS = {
  PAGE_LOAD: 'page_load',
  API_LATENCY: 'api_latency',
  RENDER_TIME: 'render_time',
  INTERACTION_DELAY: 'interaction_delay'
} as const;

// Event Parameters
export interface BookingEventParams {
  serviceId?: string;
  serviceName?: string;
  category?: string;
  date?: string;
  timeSlot?: string;
  price?: number;
  duration?: number;
  step?: number;
  totalSteps?: number;
  abandonReason?: string;
  sessionId?: string;
  bookingId?: string;
}

export interface OptimizationEventParams {
  elementType?: string;
  elementId?: string;
  variant?: string;
  position?: string;
  message?: string;
  conversionValue?: number;
}

export interface BehaviorEventParams {
  action?: string;
  category?: string;
  label?: string;
  value?: number;
  percentage?: number;
  duration?: number;
  source?: string;
  destination?: string;
}

export interface ExperimentEventParams {
  experimentId: string;
  experimentName: string;
  variantId: string;
  variantName: string;
  conversionGoal?: string;
  conversionValue?: number;
}

export interface ErrorEventParams {
  errorType: string;
  errorMessage: string;
  errorCode?: string;
  component?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userImpact?: string;
}

export interface PerformanceEventParams {
  metric: string;
  value: number;
  unit?: 'ms' | 's' | 'bytes' | 'kb' | 'mb';
  threshold?: number;
  exceeded?: boolean;
}

// Conversion Goals with values (in cents for precision)
export const CONVERSION_GOALS = {
  // Micro conversions
  VIEW_BOOKING_WIDGET: 10,
  SELECT_SERVICE: 25,
  SELECT_TIME_SLOT: 50,
  START_FORM_FILL: 75,

  // Macro conversions
  SUBMIT_BOOKING: 200,
  BOOKING_SUCCESS: 500,
  RECOVERY_SUCCESS: 300,

  // Engagement
  HIGH_ENGAGEMENT: 100, // >3 min on page
  REPEAT_VISITOR: 150,
  REFERRAL: 400
} as const;

// Helper function to track events with proper typing
export function createEventTracker<T extends Record<string, any>>(
  trackingFunction: (name: string, params?: T) => void
) {
  return {
    track: (eventName: string, params?: T) => {
      // Add timestamp and session info
      const enrichedParams = {
        ...params,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct'
      };

      trackingFunction(eventName, enrichedParams);
    }
  };
}

// Session management
let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

// Export event categories for easy access
export const EVENT_CATEGORIES = {
  BOOKING: 'booking',
  OPTIMIZATION: 'optimization',
  BEHAVIOR: 'behavior',
  EXPERIMENT: 'experiment',
  ERROR: 'error',
  PERFORMANCE: 'performance'
} as const;

// Funnel stages for analysis
export const FUNNEL_STAGES = [
  { name: 'Widget View', event: BOOKING_EVENTS.VIEW_BOOKING_WIDGET },
  { name: 'Service Selection', event: BOOKING_EVENTS.SELECT_SERVICE },
  { name: 'Time Selection', event: BOOKING_EVENTS.SELECT_TIME_SLOT },
  { name: 'Form Start', event: BOOKING_EVENTS.START_FORM_FILL },
  { name: 'Form Submit', event: BOOKING_EVENTS.SUBMIT_BOOKING },
  { name: 'Booking Success', event: BOOKING_EVENTS.BOOKING_SUCCESS }
] as const;