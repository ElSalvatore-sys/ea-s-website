import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, ChevronLeft, ChevronRight, Check, Loader, AlertCircle, Info, Coffee, Briefcase, XCircle, ArrowLeft } from 'lucide-react';
import { bookingAPI, testBusinesses } from '../lib/booking-api';
import type { TimeSlot, Business, Service, BookingApiResponse } from '../lib/booking-api';
import { useLanguage } from '../providers/LanguageProvider';
import { useTranslation } from 'react-i18next';
import { isGermanHoliday, isGermanBusinessDay, getGermanBusinessHours, isMittagspause, getNextBusinessDay } from '../utils/germanHolidays';
import {
  trackEvent,
  trackBookingFunnel,
  trackLanguage,
  trackGermanFeature,
  hasConsent
} from '../lib/gdpr-analytics';

// Import conversion optimization components
import UrgencyIndicator from './conversion/UrgencyIndicator';
import SocialProof from './conversion/SocialProof';
import TrustBadges from './conversion/TrustBadges';

// Import abandonment recovery
import {
  abandonmentRecovery,
  saveBookingProgress,
  resumeBooking,
  clearBookingProgress
} from '../lib/analytics/abandonment-recovery';

// Import GA4 tracking
import { ga4, trackGA4Event, trackGA4Ecommerce } from '../lib/analytics/ga4-config';
import { BOOKING_EVENTS, OPTIMIZATION_EVENTS } from '../lib/analytics/event-definitions';

interface BookingWidgetEnhancedProps {
  businessId?: string;
  serviceId?: string;
  onClose?: () => void;
}

interface ValidationErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface SlotAvailability {
  hasLimitedAvailability: boolean;
  percentageAvailable: number;
  availableCount: number;
  totalCount: number;
  viewingUsers?: number;
  recentBookings?: number;
}

const BookingWidgetEnhanced: React.FC<BookingWidgetEnhancedProps> = ({
  businessId = 'smart-home-installer',
  serviceId,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const businessHours = getGermanBusinessHours();

  // Core booking state
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [slotAvailability, setSlotAvailability] = useState<SlotAvailability | null>(null);

  // Form data
  const [customerData, setCustomerData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });

  // Conversion optimization state
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasRecoveredSession, setHasRecoveredSession] = useState(false);
  const [viewingUsers, setViewingUsers] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);

  // Refs
  const widgetRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize and check for abandoned sessions
  useEffect(() => {
    // Track widget view
    trackGA4Event(BOOKING_EVENTS.VIEW_BOOKING_WIDGET, {
      businessId,
      serviceId,
      language: currentLanguage
    });

    // Check for recoverable session
    const recoveredProgress = resumeBooking();
    if (recoveredProgress) {
      setHasRecoveredSession(true);

      // Restore progress
      if (recoveredProgress.serviceId) {
        // Load the service
        const service = availableServices.find(s => s.id === recoveredProgress.serviceId);
        if (service) setSelectedService(service);
      }

      if (recoveredProgress.date) {
        setSelectedDate(new Date(recoveredProgress.date));
      }

      if (recoveredProgress.formData) {
        setCustomerData(prev => ({
          ...prev,
          ...recoveredProgress.formData
        }));
      }

      if (recoveredProgress.currentStep) {
        setCurrentStep(recoveredProgress.currentStep);
      }

      // Show recovery notification
      trackGA4Event(BOOKING_EVENTS.RESUME_BOOKING, {
        recoveredStep: recoveredProgress.currentStep
      });
    }

    // Initialize business
    fetchBusiness();

    // Set up exit intent listener
    const handleExitIntent = (e: CustomEvent) => {
      setShowExitIntent(true);
    };
    window.addEventListener('show-exit-intent-modal', handleExitIntent as EventListener);

    // Simulate viewing users (in production, this would come from WebSocket)
    setViewingUsers(Math.floor(Math.random() * 8) + 2);
    setTodayBookings(Math.floor(Math.random() * 20) + 10);

    return () => {
      window.removeEventListener('show-exit-intent-modal', handleExitIntent as EventListener);
    };
  }, []);

  // Save progress on each step
  useEffect(() => {
    if (currentStep > 1) {
      saveBookingProgress({
        currentStep,
        serviceId: selectedService?.id,
        serviceName: selectedService?.name,
        date: selectedDate?.toISOString(),
        timeSlot: selectedSlot?.time,
        formData: customerData
      });
    }
  }, [currentStep, selectedService, selectedDate, selectedSlot, customerData]);

  // Fetch business data
  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const business = testBusinesses.find(b => b.id === businessId);
      if (business) {
        setSelectedBusiness(business);
        await fetchServices(business.id);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      setBookingError('Failed to load business information');
    } finally {
      setLoading(false);
    }
  };

  // Fetch services
  const fetchServices = async (businessId: string) => {
    setServicesLoading(true);
    try {
      const response = await bookingAPI.getServices(businessId);
      if (response.success && response.data) {
        setAvailableServices(response.data);

        // Auto-select if serviceId provided or only one service
        if (serviceId) {
          const service = response.data.find(s => s.id === serviceId);
          if (service) handleServiceSelect(service);
        } else if (response.data.length === 1) {
          handleServiceSelect(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch available slots
  const fetchAvailableSlots = async (date: Date) => {
    if (!selectedService || !selectedBusiness) return;

    setSlotsLoading(true);
    setAvailableSlots([]);

    try {
      const response = await bookingAPI.getAvailableSlots(
        selectedBusiness.id,
        selectedService.id,
        date.toISOString().split('T')[0]
      );

      if (response.success && response.data) {
        setAvailableSlots(response.data);

        // Calculate availability metrics
        const totalSlots = 12; // Assuming 12 slots per day
        const availableCount = response.data.filter(s => s.available).length;
        const percentageAvailable = (availableCount / totalSlots) * 100;

        setSlotAvailability({
          hasLimitedAvailability: percentageAvailable < 40,
          percentageAvailable,
          availableCount,
          totalCount: totalSlots,
          viewingUsers: Math.floor(Math.random() * 5) + 1,
          recentBookings: Math.floor(Math.random() * 3) + 1
        });

        // Track availability view
        trackGA4Event(BOOKING_EVENTS.VIEW_AVAILABILITY, {
          date: date.toISOString(),
          availableSlots: availableCount,
          serviceId: selectedService.id
        });
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setBookingError('Failed to load available time slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep(2);

    // Track selection
    trackGA4Event(BOOKING_EVENTS.SELECT_SERVICE, {
      serviceId: service.id,
      serviceName: service.name,
      price: service.price
    });

    trackGA4Ecommerce('view_item', {
      serviceId: service.id,
      serviceName: service.name,
      category: 'booking',
      price: service.price,
      value: service.price
    });

    // Fetch slots for current date
    fetchAvailableSlots(selectedDate);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);

    // Track date selection
    trackGA4Event(BOOKING_EVENTS.SELECT_DATE, {
      date: date.toISOString(),
      isBusinessDay: isGermanBusinessDay(date),
      dayOfWeek: date.getDay()
    });

    fetchAvailableSlots(date);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;

    setSelectedSlot(slot);
    setCurrentStep(3);

    // Track slot selection
    trackGA4Event(BOOKING_EVENTS.SELECT_TIME_SLOT, {
      time: slot.time,
      duration: selectedService?.duration,
      date: selectedDate.toISOString()
    });

    trackGA4Ecommerce('add_to_cart', {
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
      price: selectedService?.price,
      value: selectedService?.price
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!customerData.customerName.trim()) {
      errors.customerName = t('booking.validation.nameRequired');
    }

    if (!customerData.customerEmail.trim()) {
      errors.customerEmail = t('booking.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.customerEmail)) {
      errors.customerEmail = t('booking.validation.emailInvalid');
    }

    if (!customerData.customerPhone.trim()) {
      errors.customerPhone = t('booking.validation.phoneRequired');
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      trackGA4Event(BOOKING_EVENTS.VALIDATION_ERROR, {
        errors: Object.keys(errors)
      });
    }

    return Object.keys(errors).length === 0;
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!selectedService || !selectedSlot || !selectedDate) return;

    setSubmitLoading(true);
    setBookingError(null);

    // Track checkout begin
    trackGA4Event(BOOKING_EVENTS.SUBMIT_BOOKING, {
      serviceId: selectedService.id,
      date: selectedDate.toISOString(),
      time: selectedSlot.time
    });

    trackGA4Ecommerce('begin_checkout', {
      value: selectedService.price,
      items: [{
        item_id: selectedService.id,
        item_name: selectedService.name,
        price: selectedService.price,
        quantity: 1
      }]
    });

    try {
      const response = await bookingAPI.createBooking({
        businessId: selectedBusiness!.id,
        serviceId: selectedService.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedSlot.time,
        ...customerData
      });

      if (response.success && response.data) {
        setBookingComplete(true);

        // Clear abandonment recovery
        clearBookingProgress();

        // Track success
        trackGA4Event(BOOKING_EVENTS.BOOKING_SUCCESS, {
          bookingId: response.data.id,
          serviceId: selectedService.id,
          value: selectedService.price
        });

        trackGA4Ecommerce('purchase', {
          bookingId: response.data.id,
          serviceId: selectedService.id,
          value: selectedService.price,
          items: [{
            item_id: selectedService.id,
            item_name: selectedService.name,
            price: selectedService.price,
            quantity: 1
          }]
        });

        // Track conversion from optimization elements
        trackGA4Event(OPTIMIZATION_EVENTS.TRUST_SIGNAL_CONVERSION, {
          bookingId: response.data.id
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError(t('booking.error.submitFailed'));

      trackGA4Event(BOOKING_EVENTS.BOOKING_FAILURE, {
        error: error instanceof Error ? error.message : 'unknown',
        serviceId: selectedService.id
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render exit intent modal
  const renderExitIntentModal = () => {
    if (!showExitIntent) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-white mb-3">
            Wait! Don't leave yet 🎯
          </h3>
          <p className="text-gray-300 mb-4">
            Your selected time slot may not be available later. Complete your booking now and secure your spot!
          </p>

          {selectedSlot && (
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-300">
                Selected: {selectedDate.toLocaleDateString()} at {selectedSlot.time}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowExitIntent(false);
                trackGA4Event('exit_intent_continue', {});
              }}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              Continue Booking
            </button>
            <button
              onClick={() => {
                setShowExitIntent(false);
                abandonmentRecovery.markAsAbandoned('exit_intent_leave');
                if (onClose) onClose();
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div
        ref={widgetRef}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Header with trust signals */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t('booking.title')}
              </h2>
              {hasRecoveredSession && (
                <p className="text-sm text-green-400 mt-1">
                  ✨ We've restored your previous booking progress
                </p>
              )}
            </div>
            <button
              onClick={() => {
                abandonmentRecovery.markAsAbandoned('manual_close');
                if (onClose) onClose();
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Trust badges in header */}
          <div className="mt-3">
            <TrustBadges variant="compact" position="inline" />
          </div>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-3 bg-black/30 border-b border-white/5">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Service' },
              { num: 2, label: 'Date & Time' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Confirm' }
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center ${
                  step.num < 4 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.num
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.num
                  )}
                </div>
                <span className="ml-2 text-sm text-gray-400">{step.label}</span>
                {step.num < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      currentStep > step.num
                        ? 'bg-purple-600'
                        : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Social proof section */}
          {currentStep === 1 && (
            <div className="mb-6">
              <SocialProof
                rating={4.8}
                reviewCount={127}
                totalBookings={1543 + todayBookings}
                variant="combined"
              />
            </div>
          )}

          {/* Service selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t('booking.selectService')}
              </h3>

              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="grid gap-3">
                  {availableServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        selectedService?.id === service.id
                          ? 'bg-purple-900/30 border-purple-500'
                          : 'bg-gray-800/50 border-white/10 hover:bg-gray-800/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{service.name}</h4>
                          <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Duration: {service.duration} minutes
                          </p>
                        </div>
                        <span className="text-lg font-bold text-purple-400">
                          €{service.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Date & Time selection */}
          {currentStep === 2 && selectedService && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {t('booking.selectDateTime')}
                </h3>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change service
                </button>
              </div>

              {/* Urgency indicator */}
              {slotAvailability && slotAvailability.hasLimitedAvailability && (
                <UrgencyIndicator
                  availableSlots={slotAvailability.availableCount}
                  viewingUsers={viewingUsers}
                  bookingsToday={todayBookings}
                  variant="mixed"
                />
              )}

              {/* Date picker */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Select Date</h4>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isHoliday = isGermanHoliday(date);
                    const isBusinessDay = isGermanBusinessDay(date);
                    const isSelected = selectedDate.toDateString() === date.toDateString();

                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(date)}
                        disabled={!isBusinessDay || isHoliday}
                        className={`p-3 rounded-lg text-center transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : !isBusinessDay || isHoliday
                            ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white'
                        }`}
                      >
                        <div className="text-xs">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                        <div className="text-lg font-medium">{date.getDate()}</div>
                        {isHoliday && <div className="text-xs text-red-400">Holiday</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Select Time</h4>
                {slotsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 animate-spin text-purple-500" />
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot) => {
                      const isMittagspauseTime = isMittagspause(slot.time);
                      const isAvailable = slot.available && !isMittagspauseTime;

                      return (
                        <button
                          key={slot.time}
                          onClick={() => handleSlotSelect(slot)}
                          disabled={!isAvailable}
                          className={`p-3 rounded-lg text-center transition-all ${
                            selectedSlot?.time === slot.time
                              ? 'bg-purple-600 text-white'
                              : !isAvailable
                              ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 hover:text-white'
                          }`}
                        >
                          <div className="font-medium">{slot.time}</div>
                          {isMittagspauseTime && (
                            <div className="text-xs text-orange-400 mt-1">
                              <Coffee className="w-3 h-3 inline mr-1" />
                              Lunch
                            </div>
                          )}
                          {!slot.available && !isMittagspauseTime && (
                            <div className="text-xs text-red-400 mt-1">Booked</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">No available slots for this date</p>
                )}
              </div>
            </div>
          )}

          {/* Customer details form */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {t('booking.enterDetails')}
                </h3>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change time
                </button>
              </div>

              <form ref={formRef} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('booking.form.name')} *
                  </label>
                  <input
                    type="text"
                    value={customerData.customerName}
                    onChange={(e) => {
                      setCustomerData(prev => ({ ...prev, customerName: e.target.value }));
                      if (validationErrors.customerName) {
                        setValidationErrors(prev => ({ ...prev, customerName: undefined }));
                      }
                    }}
                    onFocus={() => trackGA4Event(BOOKING_EVENTS.START_FORM_FILL, {})}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors ${
                      validationErrors.customerName ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="Your full name"
                  />
                  {validationErrors.customerName && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('booking.form.email')} *
                  </label>
                  <input
                    type="email"
                    value={customerData.customerEmail}
                    onChange={(e) => {
                      setCustomerData(prev => ({ ...prev, customerEmail: e.target.value }));
                      if (validationErrors.customerEmail) {
                        setValidationErrors(prev => ({ ...prev, customerEmail: undefined }));
                      }
                    }}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors ${
                      validationErrors.customerEmail ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="your@email.com"
                  />
                  {validationErrors.customerEmail && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('booking.form.phone')} *
                  </label>
                  <input
                    type="tel"
                    value={customerData.customerPhone}
                    onChange={(e) => {
                      setCustomerData(prev => ({ ...prev, customerPhone: e.target.value }));
                      if (validationErrors.customerPhone) {
                        setValidationErrors(prev => ({ ...prev, customerPhone: undefined }));
                      }
                    }}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors ${
                      validationErrors.customerPhone ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="+49 123 456789"
                  />
                  {validationErrors.customerPhone && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.customerPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('booking.form.notes')}
                  </label>
                  <textarea
                    value={customerData.notes}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Any special requests or notes..."
                  />
                </div>
              </form>

              <button
                onClick={() => {
                  if (validateForm()) {
                    setCurrentStep(4);
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Continue to Confirmation
              </button>
            </div>
          )}

          {/* Confirmation step */}
          {currentStep === 4 && !bookingComplete && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t('booking.confirm')}
              </h3>

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{selectedDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{selectedSlot?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{selectedService?.duration} minutes</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-xl font-bold text-purple-400">€{selectedService?.price}</span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-white mb-2">Your Information</h4>
                <p className="text-gray-300">{customerData.customerName}</p>
                <p className="text-gray-300">{customerData.customerEmail}</p>
                <p className="text-gray-300">{customerData.customerPhone}</p>
                {customerData.notes && (
                  <p className="text-gray-400 text-sm italic">{customerData.notes}</p>
                )}
              </div>

              {bookingError && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{bookingError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success state */}
          {bookingComplete && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {t('booking.success.title')}
              </h3>
              <p className="text-gray-400 mb-6">
                {t('booking.success.message')}
              </p>
              <button
                onClick={() => {
                  setBookingComplete(false);
                  setCurrentStep(1);
                  setSelectedService(null);
                  setSelectedSlot(null);
                  setCustomerData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    notes: ''
                  });
                  if (onClose) onClose();
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exit intent modal */}
      {renderExitIntentModal()}
    </div>
  );
};

export default BookingWidgetEnhanced;