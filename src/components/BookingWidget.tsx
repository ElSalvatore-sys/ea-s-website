import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, ChevronLeft, ChevronRight, Check, Loader, AlertCircle, Info, Coffee, Briefcase, XCircle } from 'lucide-react';
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

interface BookingWidgetProps {
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
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ 
  businessId = 'smart-home-installer', 
  serviceId,
  onClose 
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const businessHours = getGermanBusinessHours();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Service, 2: Select Date/Time, 3: Contact Info, 4: Confirmation
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<BookingApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [retryCount, setRetryCount] = useState(0);
  const [slotAvailability, setSlotAvailability] = useState<SlotAvailability | null>(null);
  
  // Analytics tracking refs
  const stepStartTime = useRef<number>(Date.now());
  const widgetOpenTime = useRef<number>(Date.now());
  const hasTrackedLanguage = useRef<boolean>(false);

  // Track widget initialization
  useEffect(() => {
    // Track widget opened
    trackEvent('booking_widget_opened', {
      businessId,
      serviceId,
      language: currentLanguage,
      hasPreselectedService: !!serviceId,
      device: /mobile|android|iphone/i.test(navigator.userAgent.toLowerCase()) ? 'mobile' : 
              /tablet|ipad/i.test(navigator.userAgent.toLowerCase()) ? 'tablet' : 'desktop',
      browser: getBrowserInfo()
    });
    
    // Track language on first load
    if (!hasTrackedLanguage.current) {
      trackLanguage.selectLanguage(currentLanguage as 'de' | 'en', 'auto');
      hasTrackedLanguage.current = true;
    }
    
    // Track business hours display
    trackGermanFeature('business_hours_displayed', {
      hours: businessHours,
      language: currentLanguage
    });
    
    return () => {
      // Track widget close with time spent
      const timeSpent = Date.now() - widgetOpenTime.current;
      trackEvent('booking_widget_closed', {
        timeSpent,
        lastStep: step,
        completed: bookingSuccess
      });
      
      // If not completed, track abandonment
      if (!bookingSuccess && step > 1) {
        trackBookingFunnel.abandonBooking(`step_${step}`, 'widget_closed');
      }
    };
  }, []);

  // Initialize business and service
  useEffect(() => {
    setServicesLoading(true);
    const business = testBusinesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      if (serviceId && business.services) {
        const service = business.services.find(s => s.id === serviceId);
        if (service) {
          setSelectedService(service);
          // Remove pricing for Smart Home Consultation
          if (service.id === 'sh-consultation') {
            service.price = 0;
          }
          setStep(2); // Skip to date selection if service is pre-selected
          
          // Track pre-selected service
          trackBookingFunnel.selectService(service.id, service.name, service.price);
        }
      }
    }
    setServicesLoading(false);
  }, [businessId, serviceId]);

  // Fetch available slots when date or service changes
  useEffect(() => {
    if (selectedService && selectedDate && selectedBusiness) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  // Helper function to get browser info
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') && !userAgent.includes('edge')) return 'chrome';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('edge')) return 'edge';
    return 'other';
  };

  const fetchAvailableSlots = async () => {
    if (!selectedBusiness || !selectedService) return;
    
    setSlotsLoading(true);
    setError(null);
    setRetryCount(0);
    
    // Track availability check
    trackBookingFunnel.checkAvailability(selectedService.id, selectedDate.toISOString());
    
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await bookingAPI.getAvailableSlots(
        selectedBusiness.id,
        selectedService.id,
        dateStr
      );
      
      if (response.status === 'success' && response.data) {
        const slots = response.data.slots || [];
        setAvailableSlots(slots);
        
        // Analyze slot availability
        const availability = analyzeSlotAvailability(slots);
        setSlotAvailability(availability);
        
        // Track availability results
        trackEvent('availability_results', {
          date: dateStr,
          serviceId: selectedService.id,
          availableSlots: availability.availableCount,
          totalSlots: availability.totalCount,
          hasLimitedAvailability: availability.hasLimitedAvailability
        });
        
        // Track if it's a holiday
        const holiday = isGermanHoliday(selectedDate);
        if (holiday) {
          trackGermanFeature('holiday_detected', {
            holiday: holiday.name,
            date: dateStr
          });
        }
      } else {
        setError(response.message || t('booking.widget.errorLoadingSlots'));
        setAvailableSlots([]);
        
        // Track error
        trackEvent('availability_error', {
          error: response.message,
          serviceId: selectedService.id,
          date: dateStr
        });
      }
    } catch (err) {
      console.error('Failed to fetch slots:', err);
      handleNetworkError();
      
      // Track network error
      trackEvent('network_error', {
        context: 'fetch_available_slots',
        serviceId: selectedService.id
      });
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleNetworkError = () => {
    if (currentLanguage === 'de') {
      setError('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.');
    } else {
      setError('Network error. Please check your internet connection and try again.');
    }
    setAvailableSlots([]);
  };

  const retryFetchSlots = async () => {
    setRetryCount(prev => prev + 1);
    await fetchAvailableSlots();
  };

  const analyzeSlotAvailability = (slots: TimeSlot[]): SlotAvailability => {
    const availableCount = slots.filter(s => s.available).length;
    const totalCount = slots.length;
    
    return {
      hasLimitedAvailability: availableCount > 0 && availableCount <= 3,
      percentageAvailable: totalCount > 0 ? (availableCount / totalCount) * 100 : 0,
      availableCount,
      totalCount
    };
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    
    // Don't allow past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      setSelectedDate(newDate);
      setSelectedSlot(null);
    }
  };

  const formatDate = (date: Date) => {
    const locale = currentLanguage === 'de' ? 'de-DE' : 'en-US';
    const formatted = date.toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Check if it's a holiday
    const holiday = isGermanHoliday(date);
    if (holiday) {
      const holidayName = currentLanguage === 'de' ? holiday.name : holiday.nameEn;
      return `${formatted} (${holidayName})`;
    }
    
    return formatted;
  };

  const formatTimeSlot = (slot: TimeSlot): string => {
    const hour = parseInt(slot.start.split(':')[0]);
    const isMittagspause = hour === 12;
    
    if (currentLanguage === 'de') {
      if (isMittagspause && !slot.available) {
        return `${slot.start} (Mittagspause)`;
      }
      return `${slot.start} Uhr`;
    }
    return slot.start;
  };

  const isSlotMittagspause = (slot: TimeSlot): boolean => {
    const hour = parseInt(slot.start.split(':')[0]);
    return hour === 12;
  };

  const getSlotClassName = (slot: TimeSlot): string => {
    const isMittagspause = isSlotMittagspause(slot);
    const isSelected = selectedSlot?.start === slot.start;
    
    if (!slot.available) {
      if (isMittagspause) {
        return 'relative bg-gradient-to-r from-orange-100 to-orange-200 from-orange-900/30 to-orange-800/30 text-orange-700 text-orange-400 cursor-not-allowed border border-orange-300 border-orange-700';
      }
      return 'bg-gray-100 bg-gray-800 text-gray-400 text-gray-600 cursor-not-allowed';
    }
    
    if (isSelected) {
      return 'bg-gray-900 text-white shadow-lg transform scale-105';
    }
    
    return 'bg-white bg-gray-900 border border-gray-200 border-gray-700 text-gray-900 text-white hover:border-blue-500 hover:border-blue-400 hover:shadow-md transition-all duration-200';
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateGermanPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+49|0)[1-9]\d{1,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!bookingData.customerName || bookingData.customerName.length < 2) {
      errors.customerName = currentLanguage === 'de' 
        ? 'Bitte geben Sie Ihren vollständigen Namen ein'
        : 'Please enter your full name';
    }
    
    if (!validateEmail(bookingData.customerEmail)) {
      errors.customerEmail = currentLanguage === 'de'
        ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
        : 'Please enter a valid email address';
    }
    
    if (!validateGermanPhone(bookingData.customerPhone)) {
      errors.customerPhone = currentLanguage === 'de'
        ? 'Bitte geben Sie eine gültige deutsche Telefonnummer ein (z.B. +49 176 12345678)'
        : 'Please enter a valid German phone number (e.g. +49 176 12345678)';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0 && selectedSlot !== null;
  };

  const handleBooking = async () => {
    if (!selectedBusiness || !selectedService || !selectedSlot || !selectedDate) return;
    
    if (!validateForm()) {
      // Track validation error
      trackEvent('booking_validation_error', {
        errors: validationErrors,
        step: 3
      });
      return;
    }
    
    // Track booking attempt
    trackEvent('booking_submit_attempt', {
      serviceId: selectedService.id,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedSlot.start
    });
    
    setLoading(true);
    setError(null);
    
    try {
      const dateTime = `${selectedDate.toISOString().split('T')[0]}T${selectedSlot.start}:00`;
      
      const response = await bookingAPI.createBooking({
        businessId: selectedBusiness.id,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        dateTime,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        notes: bookingData.notes,
        title: `${selectedService.name} - ${bookingData.customerName}`,
        location: selectedBusiness.name
      });
      
      if (response.status === 'success' && response.data) {
        setBookingResponse(response);
        setBookingSuccess(true);
        setStep(4); // Go to confirmation step
        
        // Track successful booking
        const bookingId = response.data.bookingId || `booking_${Date.now()}`;
        trackBookingFunnel.completeBooking(
          bookingId,
          selectedService.id,
          selectedService.price || 0
        );
        
        // Track booking details
        trackEvent('booking_confirmed', {
          bookingId,
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedSlot.start,
          language: currentLanguage,
          timeToComplete: Date.now() - widgetOpenTime.current
        });
        
        // Track if Mittagspause time was selected
        if (isSlotMittagspause(selectedSlot)) {
          trackGermanFeature('mittagspause_booking', {
            time: selectedSlot.start
          });
        }
      } else {
        setError(response.message || (currentLanguage === 'de' 
          ? 'Buchung fehlgeschlagen. Bitte versuchen Sie es erneut.'
          : 'Booking failed. Please try again.'));
        
        // Track booking failure
        trackEvent('booking_failed', {
          error: response.message,
          serviceId: selectedService.id
        });
      }
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.message || (currentLanguage === 'de'
        ? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        : 'An unexpected error occurred. Please try again.'));
      
      // Track booking error
      trackEvent('booking_error', {
        error: err.message,
        serviceId: selectedService.id,
        context: 'submission'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined
      });
    }
  };

  const renderServiceSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-white mb-4">
        {t('booking.widget.selectService')}
      </h3>
      
      {servicesLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 bg-gray-800 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        selectedBusiness?.services?.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              setSelectedService(service);
              setStep(2);
              setValidationErrors({});
              
              // Track service selection
              trackBookingFunnel.selectService(service.id, service.name, service.price || 0);
              trackEvent('service_selected', {
                serviceId: service.id,
                serviceName: service.name,
                price: service.price,
                duration: service.duration
              });
            }}
            className="w-full text-left p-4 rounded-lg border border-gray-200 border-gray-700 hover:border-blue-500 hover:border-blue-400 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-white group-hover:text-blue-600 group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h4>
                {service.description && (
                  <p className="text-sm text-gray-600 text-gray-400 mt-1">{service.description}</p>
                )}
                <div className="flex items-center mt-2 text-sm text-gray-500 text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration} {t('booking.widget.minutes')}</span>
                </div>
              </div>
              {service.price > 0 && (
                <div className="text-right ml-4">
                  <span className="text-lg font-semibold text-gray-900 text-white">
                    €{service.price}
                  </span>
                </div>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      {/* Service Info */}
      <div className="bg-background-tertiary border border-gray-100 from-blue-900/20 to-indigo-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 text-white">{selectedService?.name}</h4>
        <p className="text-sm text-gray-600 text-gray-400">
          {t('booking.widget.duration')}: {selectedService?.duration} {t('booking.widget.minutes')}
        </p>
      </div>

      {/* Business Hours Info */}
      <div className="bg-background-tertiary border border-gray-100 from-blue-900/20 to-indigo-900/20 p-3 rounded-lg mb-4 flex items-center">
        <Briefcase className="h-5 w-5 text-blue-600 text-blue-400 mr-3" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 text-white">
            {t('booking.widget.businessHours')}: {businessHours.start} - {businessHours.end}
          </p>
          <p className="text-xs text-gray-600 text-gray-400">
            {t('booking.widget.mittagspause')}: {businessHours.lunchBreak.start} - {businessHours.lunchBreak.end}
          </p>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 text-white mb-4">
          {t('booking.widget.selectDateTime')}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 text-gray-400" />
          </button>
          <div className="text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-blue-600 text-blue-400" />
            <p className="font-medium text-gray-900 text-white">
              {formatDate(selectedDate)}
            </p>
          </div>
          <button
            onClick={() => handleDateChange(1)}
            className="p-2 rounded-lg hover:bg-gray-100 hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 text-gray-300">
            {t('booking.widget.availableTimes')}
          </h4>
          {slotAvailability && slotAvailability.hasLimitedAvailability && (
            <span className="text-xs text-orange-600 text-orange-400 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {currentLanguage === 'de' ? 'Nur noch wenige Termine verfügbar' : 'Limited availability'}
            </span>
          )}
        </div>
        
        {slotsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 text-red-400 mb-3">{error}</p>
            <button
              onClick={retryFetchSlots}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentLanguage === 'de' ? 'Erneut versuchen' : 'Try Again'}
            </button>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-gray-400">
              {t('booking.widget.noSlots')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
              {availableSlots.map((slot) => {
                const isMittagspause = isSlotMittagspause(slot);
                return (
                  <button
                    key={`${slot.start}-${slot.end}`}
                    onClick={() => {
                      if (slot.available) {
                        setSelectedSlot(slot);
                        
                        // Track slot selection
                        trackEvent('time_slot_selected', {
                          time: slot.start,
                          date: selectedDate.toISOString().split('T')[0],
                          isMittagspause: isSlotMittagspause(slot)
                        });
                        
                        // Track if Mittagspause was viewed
                        if (isSlotMittagspause(slot)) {
                          trackGermanFeature('mittagspause_slot_selected', {
                            time: slot.start
                          });
                        }
                      }
                    }}
                    disabled={!slot.available}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 relative group
                      ${getSlotClassName(slot)}
                    `}
                    title={isMittagspause && !slot.available 
                      ? (currentLanguage === 'de' 
                        ? 'Mittagspause - Geschäftszeiten pausiert für Mittagessen' 
                        : 'Lunch break - Business hours paused for lunch')
                      : (!slot.available 
                        ? (currentLanguage === 'de' ? 'Bereits gebucht' : 'Already booked')
                        : (currentLanguage === 'de' ? 'Verfügbar - Klicken zum Auswählen' : 'Available - Click to select'))
                    }
                  >
                    {formatTimeSlot(slot)}
                    {isMittagspause && !slot.available && (
                      <>
                        <Coffee className="h-3 w-3 absolute top-1 right-1 text-orange-600 text-orange-400" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {t('booking.widget.mittagspause')}
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 text-gray-400">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                <span>{currentLanguage === 'de' ? 'Verfügbar' : 'Available'}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-300 bg-gray-700 rounded mr-1"></div>
                <span>{currentLanguage === 'de' ? 'Belegt' : 'Booked'}</span>
              </div>
              <div className="flex items-center">
                <Coffee className="h-3 w-3 text-orange-600 text-orange-400 mr-1" />
                <span>Mittagspause</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200 border-gray-700">
        <button
          onClick={() => {
            setStep(1);
            setValidationErrors({});
          }}
          className="px-4 py-2 text-gray-600 text-gray-400 hover:text-gray-900 hover:text-white transition-colors"
        >
          {t('booking.widget.back')}
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!selectedSlot}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed shadow-lg"
        >
          {t('booking.widget.continue')}
        </button>
      </div>
    </div>
  );

  const renderContactForm = () => (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-background-tertiary border border-gray-100 from-blue-900/20 to-indigo-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 text-white mb-2">{t('booking.widget.bookingSummary')}</h4>
        <p className="text-sm text-gray-600 text-gray-400">
          {selectedService?.name}
        </p>
        <p className="text-sm text-gray-600 text-gray-400">
          {formatDate(selectedDate)} • {selectedSlot && formatTimeSlot(selectedSlot)}
        </p>
        <p className="text-sm text-gray-600 text-gray-400">
          {t('booking.widget.duration')}: {selectedService?.duration} {t('booking.widget.minutes')}
        </p>
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 text-white">
          {t('booking.widget.yourInformation')}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            {t('booking.widget.name')} *
          </label>
          <input
            type="text"
            name="customerName"
            value={bookingData.customerName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white transition-colors ${
              validationErrors.customerName 
                ? 'border-red-500 border-red-400' 
                : 'border-gray-300 border-gray-600'
            }`}
            placeholder={currentLanguage === 'de' ? 'Max Mustermann' : 'John Doe'}
            required
          />
          {validationErrors.customerName && (
            <p className="mt-1 text-sm text-red-600 text-red-400">
              {validationErrors.customerName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            {t('booking.widget.email')} *
          </label>
          <input
            type="email"
            name="customerEmail"
            value={bookingData.customerEmail}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white transition-colors ${
              validationErrors.customerEmail 
                ? 'border-red-500 border-red-400' 
                : 'border-gray-300 border-gray-600'
            }`}
            placeholder={currentLanguage === 'de' ? 'max@example.de' : 'john@example.com'}
            required
          />
          {validationErrors.customerEmail && (
            <p className="mt-1 text-sm text-red-600 text-red-400">
              {validationErrors.customerEmail}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            {t('booking.widget.phone')} *
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={bookingData.customerPhone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white transition-colors ${
              validationErrors.customerPhone 
                ? 'border-red-500 border-red-400' 
                : 'border-gray-300 border-gray-600'
            }`}
            placeholder={currentLanguage === 'de' ? '+49 176 12345678' : '+49 176 12345678'}
            required
          />
          {validationErrors.customerPhone && (
            <p className="mt-1 text-sm text-red-600 text-red-400">
              {validationErrors.customerPhone}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 text-gray-400">
            {currentLanguage === 'de' 
              ? 'Bitte geben Sie eine deutsche Telefonnummer ein'
              : 'Please enter a German phone number'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
            {t('booking.widget.notes')}
          </label>
          <textarea
            name="notes"
            value={bookingData.notes}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white transition-colors"
            placeholder={t('booking.widget.notesPlaceholder')}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 bg-red-900/20 border border-red-200 border-red-800 rounded-lg text-red-600 text-red-400 text-sm flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200 border-gray-700">
        <button
          onClick={() => {
            setStep(2);
            setValidationErrors({});
          }}
          className="px-4 py-2 text-gray-600 text-gray-400 hover:text-gray-900 hover:text-white transition-colors"
        >
          {t('booking.widget.back')}
        </button>
        <button
          onClick={handleBooking}
          disabled={loading}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed shadow-lg flex items-center"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              {t('booking.widget.booking')}...
            </>
          ) : (
            t('booking.widget.confirmBooking')
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-green-50 from-green-900/30 to-emerald-900/30 rounded-full flex items-center justify-center mb-4 animate-bounce">
        <Check className="h-8 w-8 text-green-600 text-green-400" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 text-white mb-2">
        {t('booking.widget.bookingConfirmed')}
      </h3>
      <p className="text-gray-600 text-gray-400 mb-6">
        {t('booking.widget.bookingSuccess')}
      </p>
      
      {bookingResponse?.data && (
        <div className="bg-background-tertiary from-gray-800 to-gray-900 p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 text-white mb-4 text-center">
            {t('booking.widget.bookingDetails')}
          </h4>
          
          {bookingResponse.data.bookingId && (
            <div className="bg-background-tertiary border border-gray-100 from-blue-900/30 to-indigo-900/30 p-4 rounded-lg mb-4 text-center border-2 border-blue-200 border-blue-800">
              <p className="text-xs text-gray-600 text-gray-400 mb-2 uppercase tracking-wider">
                {t('booking.widget.confirmationCode')}
              </p>
              <p className="text-2xl font-bold text-blue-600 text-blue-400 font-mono">
                {bookingResponse.data.bookingId.substring(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 text-gray-400 mt-2">
                {currentLanguage === 'de' ? 'Bitte notieren Sie sich diesen Code' : 'Please save this code for your records'}
              </p>
            </div>
          )}
          
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600 text-gray-400">
                {t('booking.widget.service')}:
              </span>
              <span className="font-medium text-gray-900 text-white">
                {selectedService?.name}
              </span>
            </p>
            
            {bookingResponse.data.formattedDate ? (
              <p className="flex justify-between">
                <span className="text-gray-600 text-gray-400">
                  {currentLanguage === 'de' ? 'Termin:' : 'Appointment:'}
                </span>
                <span className="font-medium text-gray-900 text-white">
                  {bookingResponse.data.formattedDate}
                </span>
              </p>
            ) : (
              <>
                <p className="flex justify-between">
                  <span className="text-gray-600 text-gray-400">
                    {t('booking.widget.date')}:
                  </span>
                  <span className="font-medium text-gray-900 text-white">
                    {formatDate(selectedDate)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 text-gray-400">
                    {t('booking.widget.time')}:
                  </span>
                  <span className="font-medium text-gray-900 text-white">
                    {selectedSlot && formatTimeSlot(selectedSlot)}
                  </span>
                </p>
              </>
            )}
            
            <p className="flex justify-between">
              <span className="text-gray-600 text-gray-400">
                {t('booking.widget.duration')}:
              </span>
              <span className="font-medium text-gray-900 text-white">
                {selectedService?.duration} {t('booking.widget.minutes')}
              </span>
            </p>
            
            <p className="flex justify-between">
              <span className="text-gray-600 text-gray-400">
                {t('booking.widget.name')}:
              </span>
              <span className="font-medium text-gray-900 text-white">
                {bookingResponse.data.customerName}
              </span>
            </p>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-600 text-gray-400 mb-6 flex items-center justify-center">
        <Info className="h-4 w-4 mr-1" />
        {t('booking.widget.confirmationEmail')} {bookingData.customerEmail}
      </p>
      
      <button
        onClick={() => {
          // Reset everything
          setStep(1);
          setSelectedSlot(null);
          setBookingData({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            notes: ''
          });
          setBookingSuccess(false);
          setBookingResponse(null);
          setValidationErrors({});
          if (onClose) onClose();
        }}
        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg"
      >
        {t('booking.widget.close')}
      </button>
    </div>
  );

  return (
    <div className="booking-card bg-white rounded-xl shadow-subtle max-w-lg w-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 font-inter">
              {selectedBusiness?.name || t('booking.widget.bookAppointment')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-inter">
              {step === 1 ? t('booking.widget.selectService') :
               step === 2 ? t('booking.widget.selectDateTime') :
               step === 3 ? t('booking.widget.yourInformation') :
               t('booking.widget.confirmation')}
            </p>
          </div>
          <Building className="h-6 w-6 text-gray-400" />
        </div>
        
        {/* Progress Bar */}
        {!bookingSuccess && (
          <div className="mt-4 flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${step >= stepNumber 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'bg-gray-200 bg-gray-700 text-gray-600 text-gray-400'}
                `}>
                  {step > stepNumber ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`
                    flex-1 h-1 mx-2 transition-all duration-300
                    ${step > stepNumber 
                      ? 'bg-gray-900' 
                      : 'bg-gray-200 bg-gray-700'}
                  `} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {step === 1 && renderServiceSelection()}
        {step === 2 && renderDateTimeSelection()}
        {step === 3 && renderContactForm()}
        {step === 4 && renderConfirmation()}
      </div>
    </div>
  );
};

export default BookingWidget;