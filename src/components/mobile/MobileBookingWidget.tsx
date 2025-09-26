import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  Share2,
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useSwipeable } from 'react-swipeable';
import confetti from 'canvas-confetti';

// Import mobile components
import BottomSheet from './BottomSheet';
import SwipeableCalendar from './SwipeableCalendar';
import TouchTimeSlots from './TouchTimeSlots';
import MobileProgressBar from './MobileProgressBar';

// Import hooks
import useMobileViewport from '../../hooks/useMobileViewport';
import useHapticFeedback from '../../hooks/useHapticFeedback';

// Import types and utilities
import { bookingAPI, testBusinesses } from '../../lib/booking-api';
import type { TimeSlot, Business, Service, BookingApiResponse } from '../../lib/booking-api';
import { trackBookingFunnel } from '../../lib/gdpr-analytics';
import { validatePhone, validateEmail, validateName } from '../../utils/formValidation';

interface MobileBookingWidgetProps {
  businessId?: string;
  serviceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileBookingWidget: React.FC<MobileBookingWidgetProps> = ({
  businessId = 'smart-home-installer',
  serviceId,
  isOpen,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const viewport = useMobileViewport();
  const haptic = useHapticFeedback();

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<BookingApiResponse | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize business and services
  useEffect(() => {
    const business = testBusinesses.find(b => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      if (serviceId && business.services) {
        const service = business.services.find(s => s.id === serviceId);
        if (service) {
          setSelectedService(service);
          setCurrentStep(2); // Skip to date selection
        }
      }
    }
  }, [businessId, serviceId]);

  // Fetch available slots
  useEffect(() => {
    if (selectedService && selectedDate && selectedBusiness) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchAvailableSlots = async () => {
    if (!selectedBusiness || !selectedService) return;

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await bookingAPI.getAvailableSlots(
        selectedBusiness.id,
        selectedService.id,
        dateStr
      );

      if (response.status === 'success' && response.data) {
        // Transform slots for mobile display
        const slots = (response.data.slots || []).map(slot => ({
          ...slot,
          isPeakTime: parseInt(slot.time.split(':')[0]) >= 17 && parseInt(slot.time.split(':')[0]) <= 19
        }));
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    }
    setLoading(false);
  };

  // Navigation between steps
  const navigateStep = (direction: 'next' | 'prev') => {
    haptic.trigger('light');

    if (direction === 'next' && currentStep < 4) {
      // Validate before moving to next step
      if (currentStep === 1 && !selectedService) {
        haptic.trigger('error');
        return;
      }
      if (currentStep === 2 && !selectedSlot) {
        haptic.trigger('error');
        return;
      }
      if (currentStep === 3 && !validateForm()) {
        haptic.trigger('error');
        return;
      }

      setCurrentStep(currentStep + 1);
      haptic.trigger('success');
    } else if (direction === 'prev' && currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Swipe gesture handling
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < 4 && !bookingSuccess) {
        navigateStep('next');
      }
    },
    onSwipedRight: () => {
      if (currentStep > 1 && !bookingSuccess) {
        navigateStep('prev');
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50
  });

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const nameValidation = validateName(formData.customerName);
    if (!nameValidation.isValid) {
      errors.customerName = nameValidation.error || t('validation.name.required');
    }

    const emailValidation = validateEmail(formData.customerEmail);
    if (!emailValidation.isValid) {
      errors.customerEmail = emailValidation.error || t('validation.email.invalid');
    }

    const phoneValidation = validatePhone(formData.customerPhone, i18n.language as 'de' | 'en' | 'fr');
    if (!phoneValidation.isValid) {
      errors.customerPhone = phoneValidation.error || t('validation.phone.invalid');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit booking
  const handleBookingSubmit = async () => {
    if (!validateForm()) {
      haptic.trigger('error');
      return;
    }

    setLoading(true);
    haptic.trigger('medium');

    try {
      const response = await bookingAPI.createBooking({
        businessId: selectedBusiness!.id,
        serviceId: selectedService!.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedSlot!.time,
        ...formData
      });

      if (response.status === 'success') {
        setBookingResponse(response);
        setBookingSuccess(true);
        haptic.trigger('success');

        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Track conversion
        trackBookingFunnel.completeBooking(
          response.data?.bookingId || '',
          selectedService!.id,
          selectedService!.price
        );
      }
    } catch (error) {
      console.error('Booking failed:', error);
      haptic.trigger('error');
    }
    setLoading(false);
  };

  // Share booking
  const shareBooking = async () => {
    if (!bookingResponse?.data) return;

    const shareData = {
      title: t('booking.share.title'),
      text: `${t('booking.share.text')} ${format(selectedDate, 'PPP')} ${selectedSlot?.time}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        haptic.trigger('success');
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  // Add to calendar
  const addToCalendar = () => {
    if (!bookingResponse?.data) return;

    const event = {
      title: `${selectedService?.name} - ${selectedBusiness?.name}`,
      start: `${format(selectedDate, 'yyyyMMdd')}T${selectedSlot?.time.replace(':', '')}00`,
      duration: selectedService?.duration || 60,
      description: formData.notes,
      location: selectedBusiness?.address
    };

    // Create calendar URL (Google Calendar)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.start}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location || '')}`;

    window.open(calendarUrl, '_blank');
    haptic.trigger('success');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Service selection
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t('booking.selectService')}</h3>
            <div className="space-y-2">
              {selectedBusiness?.services?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    haptic.trigger('selection');
                  }}
                  className={`
                    w-full p-4 rounded-xl text-left
                    transition-all duration-200
                    ${selectedService?.id === service.id
                      ? 'bg-purple-500 text-white shadow-lg scale-[1.02]'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className={`text-sm mt-1 ${selectedService?.id === service.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </span>
                        {service.price > 0 && (
                          <span className="font-medium">
                            €{service.price}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedService?.id === service.id && (
                      <Check className="w-5 h-5 flex-shrink-0 ml-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: // Date and time selection
        return (
          <div className="space-y-6">
            <SwipeableCalendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              locale={i18n.language as 'de' | 'en' | 'fr'}
              showHolidays
              showMittagspause={i18n.language === 'de'}
            />

            {availableSlots.length > 0 && (
              <TouchTimeSlots
                slots={availableSlots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                locale={i18n.language as 'de' | 'en' | 'fr'}
                showCapacity
                groupByPeriod
              />
            )}
          </div>
        );

      case 3: // Contact information
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">{t('booking.contactInfo')}</h3>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('booking.name')} *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${validationErrors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
                placeholder={t('booking.namePlaceholder')}
              />
              {validationErrors.customerName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('booking.email')} *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${validationErrors.customerEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
                placeholder={t('booking.emailPlaceholder')}
                inputMode="email"
              />
              {validationErrors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.customerEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('booking.phone')} *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${validationErrors.customerPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                  bg-white dark:bg-gray-800
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                `}
                placeholder={t('booking.phonePlaceholder')}
                inputMode="tel"
              />
              {validationErrors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('booking.notes')}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         focus:outline-none focus:ring-2 focus:ring-purple-500
                         resize-none"
                rows={3}
                placeholder={t('booking.notesPlaceholder')}
              />
            </div>
          </div>
        );

      case 4: // Confirmation
        return (
          <div className="text-center py-8">
            {bookingSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <CheckCircle className="w-24 h-24 mx-auto text-green-500" />
                <h3 className="text-2xl font-bold">{t('booking.success.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('booking.success.message')}
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-left space-y-2">
                  <p><strong>{t('booking.confirmationCode')}:</strong> {bookingResponse?.data?.bookingId}</p>
                  <p><strong>{t('booking.service')}:</strong> {selectedService?.name}</p>
                  <p><strong>{t('booking.date')}:</strong> {format(selectedDate, 'PPP')}</p>
                  <p><strong>{t('booking.time')}:</strong> {selectedSlot?.time}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={addToCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
                  >
                    <Calendar className="w-4 h-4" />
                    {t('booking.addToCalendar')}
                  </button>

                  {navigator.share && (
                    <button
                      onClick={shareBooking}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                    >
                      <Share2 className="w-4 h-4" />
                      {t('booking.share')}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{t('booking.confirmDetails')}</h3>
                <div className="text-left space-y-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <p><strong>{t('booking.service')}:</strong> {selectedService?.name}</p>
                  <p><strong>{t('booking.date')}:</strong> {format(selectedDate, 'PPP')}</p>
                  <p><strong>{t('booking.time')}:</strong> {selectedSlot?.time}</p>
                  <p><strong>{t('booking.name')}:</strong> {formData.customerName}</p>
                  <p><strong>{t('booking.email')}:</strong> {formData.customerEmail}</p>
                  <p><strong>{t('booking.phone')}:</strong> {formData.customerPhone}</p>
                  {formData.notes && (
                    <p><strong>{t('booking.notes')}:</strong> {formData.notes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={viewport.isMobile ? [95] : [90]}
      showHandle={viewport.isMobile}
      className="max-w-2xl mx-auto"
    >
      <div {...swipeHandlers}>
        {/* Progress bar */}
        {!bookingSuccess && (
          <MobileProgressBar
            currentStep={currentStep}
            totalSteps={4}
            onStepClick={(step) => {
              if (step < currentStep) {
                setCurrentStep(step);
                haptic.trigger('light');
              }
            }}
          />
        )}

        {/* Content */}
        <div className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {!bookingSuccess && (
          <div className="flex gap-3 mt-6 pb-safe">
            {currentStep > 1 && (
              <button
                onClick={() => navigateStep('prev')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                         bg-gray-200 dark:bg-gray-700 rounded-lg
                         hover:bg-gray-300 dark:hover:bg-gray-600
                         transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                {t('booking.back')}
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => navigateStep('next')}
                disabled={
                  (currentStep === 1 && !selectedService) ||
                  (currentStep === 2 && !selectedSlot)
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                         bg-purple-500 text-white rounded-lg
                         hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              >
                {t('booking.continue')}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleBookingSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                         bg-green-500 text-white rounded-lg
                         hover:bg-green-600 disabled:opacity-50
                         transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    {t('booking.processing')}
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {t('booking.confirm')}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

export default MobileBookingWidget;