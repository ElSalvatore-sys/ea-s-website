import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Check, Info, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  IndustryConfig,
  IndustryService,
  industryConfigs
} from '../lib/industryServices';
import TimeSlotSelector from './TimeSlotSelector';
import { TimeSlot } from '../lib/timeSlotUtils';

interface IndustryBookingWidgetProps {
  industryType: 'restaurant' | 'medical' | 'salon' | 'automotive';
  onClose?: () => void;
  onBookingComplete?: (bookingData: any) => void;
}

const IndustryBookingWidget: React.FC<IndustryBookingWidgetProps> = ({
  industryType,
  onClose,
  onBookingComplete
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const config = industryConfigs[industryType];

  // State management
  const [step, setStep] = useState(1); // 1: Service, 2: DateTime, 3: Contact, 4: Confirmation
  const [selectedService, setSelectedService] = useState<IndustryService | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeSlot | TimeSlot[] | null>(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to format selected time for display
  const formatSelectedTime = (): string => {
    if (!selectedTime) return '';
    if (Array.isArray(selectedTime)) {
      // Check if array has elements before accessing
      if (selectedTime.length === 0) return '';
      // For salon multiple slots
      const start = selectedTime[0].time;
      const end = selectedTime[selectedTime.length - 1].time;
      return `${start} - ${end}`;
    }
    // For single slot
    return selectedTime.time;
  };


  // Generate time slots using useMemo to prevent recalculation on every render
  const timeSlots = React.useMemo(() => {
    if (!selectedService) return [];

    // Use service-specific time slots if available
    if (selectedService.timeSlots) {
      return selectedService.timeSlots;
    }

    // Default time slots
    return [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
  }, [selectedService]);


  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(isGerman ? 'de-DE' : 'en-US', options);
  };


  // Validate required fields
  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 3) {
      if (!contactInfo.name) {
        newErrors.name = isGerman ? 'Name ist erforderlich' : 'Name is required';
      }
      if (!contactInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
        newErrors.email = isGerman ? 'Gültige E-Mail erforderlich' : 'Valid email required';
      }
      if (!contactInfo.phone || !/^(\+49|0)[1-9]\d{1,14}$/.test(contactInfo.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phone = isGerman ? 'Gültige Telefonnummer erforderlich' : 'Valid phone number required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle booking submission
  const handleBooking = () => {
    if (!validateStep()) return;

    const bookingData = {
      industry: industryType,
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      contact: contactInfo
    };

    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }

    setStep(4); // Go to confirmation
  };

  // Render service selection
  const renderServiceSelection = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isGerman ? config.headerDE : config.header}
        </h2>
        <p className="text-gray-600">
          {isGerman ? config.subheaderDE : config.subheader}
        </p>
      </div>

      <div className="grid gap-4">
        {config.services.map((service) => (
          <motion.button
            key={service.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedService(service);
              // Don't auto-advance - let user click Continue
            }}
            className={`p-6 rounded-xl border-2 text-left transition-all ${
              selectedService?.id === service.id
                ? `border-[${config.color}] bg-[${config.bgColor}]`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            style={{
              borderColor: selectedService?.id === service.id ? config.color : undefined,
              backgroundColor: selectedService?.id === service.id ? config.bgColor : undefined
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isGerman ? service.nameDE : service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {isGerman ? service.descriptionDE : service.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration}
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  // Render date and time selection
  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ backgroundColor: config.bgColor }}>
        <h3 className="font-semibold text-gray-900 mb-2">
          {isGerman ? selectedService?.nameDE : selectedService?.name}
        </h3>
        <p className="text-sm text-gray-600">
          {selectedService?.duration}
        </p>
      </div>

      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isGerman ? 'Datum wählen' : 'Select Date'}
        </h3>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: config.color }} />
            <p className="font-medium text-gray-900">{formatDate(selectedDate)}</p>
          </div>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isGerman ? 'Zeit wählen' : 'Select Time'}
        </h3>
        <TimeSlotSelector
          industryType={industryType}
          serviceId={selectedService?.id || 'default'}
          serviceDuration={selectedService?.duration || 60}
          date={selectedDate}
          onSelectSlot={(slot) => {
            console.log('Selected slot:', slot);
            setSelectedTime(slot);
          }}
        />
      </div>

    </div>
  );


  // Render contact form
  const renderContactForm = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ backgroundColor: config.bgColor }}>
        <h3 className="font-semibold text-gray-900 mb-2">
          {isGerman ? selectedService?.nameDE : selectedService?.name}
        </h3>
        <p className="text-sm text-gray-600">
          {formatDate(selectedDate)} • {formatSelectedTime()}
        </p>
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {isGerman ? 'Ihre Kontaktdaten' : 'Your Contact Information'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isGerman ? 'Name' : 'Name'} *
          </label>
          <input
            type="text"
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder={isGerman ? 'Max Mustermann' : 'John Doe'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isGerman ? 'E-Mail' : 'Email'} *
          </label>
          <input
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder={isGerman ? 'max@example.de' : 'john@example.com'}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isGerman ? 'Telefon' : 'Phone'} *
          </label>
          <input
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="+49 176 12345678"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isGerman ? 'Anmerkungen' : 'Notes'}
          </label>
          <textarea
            value={contactInfo.notes}
            onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
            placeholder={isGerman ? 'Zusätzliche Informationen...' : 'Additional information...'}
          />
        </div>
      </div>
    </div>
  );

  // Render confirmation
  const renderConfirmation = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ backgroundColor: config.bgColor }}
      >
        <Check className="w-10 h-10" style={{ color: config.color }} />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {isGerman ? 'Buchung bestätigt!' : 'Booking Confirmed!'}
      </h2>

      <p className="text-gray-600 mb-6">
        {isGerman
          ? 'Wir haben Ihre Buchung erhalten und senden Ihnen eine Bestätigung per E-Mail.'
          : 'We have received your booking and will send you a confirmation email.'}
      </p>

      <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-4">
          {isGerman ? 'Buchungsdetails' : 'Booking Details'}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">{isGerman ? 'Service:' : 'Service:'}</span>
            <span className="font-medium">{isGerman ? selectedService?.nameDE : selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isGerman ? 'Datum:' : 'Date:'}</span>
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{isGerman ? 'Zeit:' : 'Time:'}</span>
            <span className="font-medium">{formatSelectedTime()}</span>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: config.bgColor }}>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" style={{ color: config.color }} />
            <p className="text-sm text-gray-700">
              {isGerman
                ? 'Sie erhalten in Kürze eine SMS-Erinnerung'
                : 'You will receive an SMS reminder shortly'}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (onClose) onClose();
        }}
        className="mt-6 px-6 py-3 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
        style={{ backgroundColor: config.color }}
      >
        {isGerman ? 'Schließen' : 'Close'}
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: config.borderColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
              <config.icon className="w-6 h-6" style={{ color: config.color }} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {isGerman ? config.nameDE : config.name} {isGerman ? 'Buchung' : 'Booking'}
            </h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step < 4 && (
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: step >= s ? config.color : '#E5E7EB'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && renderServiceSelection()}
            {step === 2 && renderDateTimeSelection()}
            {step === 3 && renderContactForm()}
            {step === 4 && renderConfirmation()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      {step < 4 && (
        <div className="p-6 border-t flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              step === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isGerman ? 'Zurück' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 3) {
                handleBooking();
              } else if (validateStep()) {
                setStep(step + 1);
              }
            }}
            disabled={
              (step === 1 && !selectedService) ||
              (step === 2 && (!selectedTime || (Array.isArray(selectedTime) && selectedTime.length === 0)))
            }
            className={`px-6 py-2 text-white font-medium rounded-lg shadow-lg transition-all ${
              ((step === 1 && !selectedService) || (step === 2 && (!selectedTime || (Array.isArray(selectedTime) && selectedTime.length === 0))))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:shadow-xl'
            }`}
            style={{
              backgroundColor:
                ((step === 1 && !selectedService) || (step === 2 && (!selectedTime || (Array.isArray(selectedTime) && selectedTime.length === 0))))
                  ? undefined
                  : config.color
            }}
          >
            {step === 3
              ? (isGerman ? 'Buchung bestätigen' : 'Confirm Booking')
              : (isGerman ? 'Weiter' : 'Continue')}
          </button>
        </div>
      )}
    </div>
  );
};

export default IndustryBookingWidget;